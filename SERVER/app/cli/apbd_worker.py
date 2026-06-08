# apbd_worker.py
import asyncio
import json
import logging
from typing import Any, Dict, List, Optional

import httpx
from playwright.async_api import async_playwright, Browser, Page
from psycopg_pool import AsyncConnectionPool

log = logging.getLogger("apbd_worker")
log.setLevel(logging.INFO)

# ====== CONFIG ======
DATABASE_URL = "postgresql://monevrkpd:heriprihanto140286@192.168.50.75:5432/dalev_kota_tegal_2026"
POOL: Optional[AsyncConnectionPool] = None

# SIPD credentials / config (sesuaikan)
USERNAME = "admin.kotategal2"
PASSWORD = "TegalBahari2022@)@@"
ID_DAERAH = 70
TAHUN = 2026
AUTH_KEY = "v8.0.38-authf649fc9a5f55"
ID_JADWAL = 100

# timeout / retry
HTTPX_TIMEOUT = 30
RETRY_ATTEMPTS = 3
RETRY_DELAY = 3

# JS untuk fetch data
JS_FETCH = """
async (params) => {
    const { ptahun, pid_daerah, pid_sub_pd, pis_anggaran } = params;

    if (typeof xHeader === 'undefined') {
        getToken();
        var xHeader = { "X-API-KEY": x_api_key2(), "X-ACCESS-TOKEN": _token.token };
    }

    const formData = new FormData();
    const data = {
        tahun: ptahun,
        id_daerah: pid_daerah,
        id_unit: pid_sub_pd,
        is_prop: 0,
        is_anggaran: pis_anggaran
    };
    for (const key in data) formData.append(key, data[key]);

    const resp = await fetch(
        "https://sipd-ri.kemendagri.go.id/api/renja/sub_bl/list_belanja_by_tahun_daerah_unit",
        { method: "POST", headers: xHeader, body: formData }
    );

    if (!resp.ok) throw new Error("HTTP " + resp.status);

    let js;
    try {
        js = await resp.json();
    } catch (err) {
        throw new Error("Respon bukan JSON valid");
    }

    // pastikan ada field "data" berupa array
    if (!js || !Array.isArray(js.data)) {
        console.log("⚠️ Response tidak berisi array data:", js);
        throw new Error("Response tidak berisi array data");
    }

    return js;  // 👈 hanya kembalikan bagian 'data' saja
}
"""

# JS snippets (sesuai original)
JS_FETCH_OUTPUT = """
async (params) => {
    const { ptahun, pid_daerah, pid_sub_bl } = params;

    if (typeof xHeader === 'undefined') {
        getToken();
        var xHeader = { "X-API-KEY": x_api_key2(), "X-ACCESS-TOKEN": _token.token };
    }

    const formData = new FormData();
    const data = {
        tahun: ptahun,
        id_daerah: pid_daerah,
        id_sub_bl: pid_sub_bl
    };
    for (const key in data) formData.append(key, data[key]);

    const resp = await fetch(
        "https://sipd-ri.kemendagri.go.id/api/renja/output_bl/get_by_id_sub_bl",
        { method: "POST", headers: xHeader, body: formData }
    );

    if (!resp.ok) throw new Error("HTTP " + resp.status);

    let js;
    try {
        js = await resp.json();
    } catch (err) {
        throw new Error("Respon bukan JSON valid");
    }

    if (!js || !Array.isArray(js.data)) {
        throw new Error("Response tidak berisi array data");
    }

    return js.data;
}
"""

# ====== DB utilities ======
async def init_pool():
    global POOL
    if POOL is None:
        POOL = AsyncConnectionPool(conninfo=DATABASE_URL, max_size=10)
        log.info("DB pool initialized")

async def close_pool():
    global POOL
    if POOL is not None:
        await POOL.close()
        POOL = None
        log.info("DB pool closed")

# helper to run simple SELECT queries (async)
async def fetchall_opd() -> List[Any]:
    await init_pool()
    async with POOL.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("SELECT id_sub_pd, nama_pd FROM ta_opd ORDER BY kode")
            rows = await cur.fetchall()
            return rows

async def fetchall_subkegiatan() -> List[Any]:
    await init_pool()
    async with POOL.connection() as conn:
        async with conn.cursor() as cur:
            await cur.execute("SELECT id_sub_bl, id_sub_skpd FROM sipd.sipdri_subkegiatan ORDER BY id_sub_bl")
            rows = await cur.fetchall()
            return rows

async def call_proc_insert_indikator(xjson: str, tahun: int, id_jadwal: int, id_sub_bl: int):
    await init_pool()
    async with POOL.connection() as conn:
        async with conn.cursor() as cur:
            sql = "CALL sipd.sipdri_insert_indikator_subkegiatan((%s)::json,%s,%s,%s);"
            await cur.execute(sql, (xjson, tahun, id_jadwal, id_sub_bl))
            await conn.commit()

# ====== SIPD login via httpx (faster than full UI login) ======
async def login_sipd_httpx() -> Dict[str, Any]:
    url = "https://sipd-ri.kemendagri.go.id/api/auth/auth/login"
    async with httpx.AsyncClient(timeout=HTTPX_TIMEOUT) as client:
        for attempt in range(1, RETRY_ATTEMPTS + 1):
            try:
                r = await client.post(url, data={"username": USERNAME, "password": PASSWORD, "id_daerah": ID_DAERAH})
                r.raise_for_status()
                return r.json()
            except Exception as e:
                log.warning("login attempt %s failed: %s", attempt, e)
                if attempt == RETRY_ATTEMPTS:
                    raise
                await asyncio.sleep(RETRY_DELAY)

# ====== Processor class ======
class APBDProcessor:
    def __init__(self, concurrency: int = 4, headless: bool = True):
        self._semaphore = asyncio.Semaphore(concurrency)
        self._headless = headless
        self._pw = None
        self._browser: Optional[Browser] = None
        self._context = None

    async def start_browser(self):
        if self._browser:
            return
        if self._pw is None:
            self._pw = await async_playwright().start()
        self._browser = await self._pw.chromium.launch(headless=self._headless, args=[
            "--no-sandbox", "--disable-dev-shm-usage"
        ])
        self._context = await self._browser.new_context()
        log.info("Playwright browser started")

    async def stop_browser(self):
        try:
            if self._context:
                await self._context.close()
                self._context = None
        finally:
            if self._browser:
                await self._browser.close()
                self._browser = None
            if self._pw:
                await self._pw.stop()
                self._pw = None
            log.info("Playwright browser stopped")

    async def prepare_page_with_token(self, token_data: Dict[str, Any]):
        """Create a page and write token + localStorage items"""
        await self.start_browser()
        page = await self._context.new_page()
        await page.goto("https://sipd-ri.kemendagri.go.id")
        await page.evaluate(
            """(args) => {
                const {params, token_data, tahun, configsipd, auth_key} = args;
                window.localStorage.setItem('login-detail', JSON.stringify(params));
                window.localStorage.setItem(auth_key, JSON.stringify(token_data));
                window.localStorage.setItem('sipd-konfigurasi-tahun', tahun);
                window.localStorage.setItem('sipd-konfigurasi', JSON.stringify(configsipd));
            }""",
            {
                "params": {"username": USERNAME, "password": PASSWORD, "id_daerah": ID_DAERAH},
                "token_data": token_data,
                "tahun": TAHUN,
                "configsipd": {"id_daerah": ID_DAERAH, "tahun": TAHUN},
                "auth_key": AUTH_KEY
            }
        )
        # load helper scripts if needed (make sure paths are available to worker)
        
        await page.reload()
        await page.add_script_tag(path="crypto-js.min.js")
        await page.add_script_tag(path="sipdri.js")
        return page

    async def process_task(self, task: Dict[str, Any]):
        """
        Main entry to process one task. Task is expected to be JSON with keys:
        { "kodepemda":..., "tahun":..., "jenis": "output_subkegiatan" | ... }
        """
        async with self._semaphore:
            log.info("Start processing task: %s", task)
            # login (httpx)
            token_data = await login_sipd_httpx()
            page = None
            try:
                page = await self.prepare_page_with_token(token_data)
                # choose behavior by jenis
                jenis = task.get("jenis", "output_subkegiatan")
                if jenis == "output_subkegiatan":
                    # get list from DB
                    subk_list = await fetchall_subkegiatan()
                    for subk in subk_list:
                        pid_sub_bl = int(subk[0])
                        pid_sub_pd = subk[1]
                        log.info("Processing subk %s (opd %s)", pid_sub_bl, pid_sub_pd)
                        try:
                            data_output = await page.evaluate(JS_FETCH_OUTPUT, {"ptahun": TAHUN, "pid_daerah": ID_DAERAH, "pid_sub_bl": pid_sub_bl})
                        except Exception as e:
                            log.warning("Evaluate failed for subk %s: %s", pid_sub_bl, e)
                            continue

                        if data_output:
                            xdata_output = json.dumps(data_output, ensure_ascii=False)
                            # write to DB (call procedure)
                            try:
                                await call_proc_insert_indikator(xdata_output, TAHUN, ID_JADWAL, pid_sub_bl)
                                log.info("Saved output for subk %s", pid_sub_bl)
                            except Exception as e:
                                log.exception("DB insert failed for subk %s: %s", pid_sub_bl, e)
                        else:
                            log.info("No output for subk %s", pid_sub_bl)
                else:
                    log.warning("Unknown jenis: %s", jenis)
            finally:
                # always close page to avoid leaks
                if page:
                    try:
                        await page.close()
                    except Exception:
                        pass
                log.info("Finished processing task: %s", task)

