import asyncio
import json
from playwright.async_api import async_playwright
import time
import psycopg
from psycopg.rows import dict_row

from psycopg_pool import ConnectionPool

DATABASE_URL = "postgresql://monevrkpd:heriprihanto140286@192.168.50.75:5432/dalev_kota_tegal_2026"

POOL = ConnectionPool(
    conninfo="dbname=dalev_kota_tegal_2026 user=monevrkpd password=heriprihanto140286 host=192.168.50.75 port=5432",
    min_size=1,
    max_size=5,
    open=True   # buka saat start
)



tahun = 2026
username = "admin.kotategal2"
password = "TegalBahari2022@)@@"
id_daerah = 70
is_anggaran = 1
auth_key = "v8.0.38-authf649fc9a5f55"
id_jadwal = 100

CONCURRENCY = 8   


def get_opd_list():
    with POOL.connection() as conn, conn.cursor() as cur:
        cur.execute("SELECT id_sub_pd, nama_pd FROM ta_opd ORDER BY kode")
        return cur.fetchall()


def get_subkegiatan_list():
    with POOL.connection() as conn, conn.cursor() as cur:
        cur.execute("SELECT id_sub_bl, id_sub_skpd FROM sipd.sipdri_subkegiatan ORDER BY id_sub_bl")
        return cur.fetchall()


async def login_sipd():
    import httpx
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            "https://sipd-ri.kemendagri.go.id/api/auth/auth/login",
            data={"username": username, "password": password, "id_daerah": id_daerah}
        )
        r.raise_for_status()
        return r.json()

def insert_to_db(xdata: str,  tahun: int,id_jadwal :int, id_sub_pd: int):
    with POOL.connection() as conn, conn.cursor() as cur:
        sql = "CALL sipd.sipdri_insert_subkegiatan((%s)::json,%s, %s, %s);"
        params = (xdata,tahun, id_jadwal, id_sub_pd)
        #print("SQL =", sql)
        #print("PARAMS =", params)
        cur.execute(sql, params)
        conn.commit()
        return True

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

    // pastikan ada field "data" berupa array
    if (!js || !Array.isArray(js.data)) {
        console.log("⚠️ Response tidak berisi array data:", js);
        throw new Error("Response tidak berisi array data");
    }

    return js.data;  // 👈 hanya kembalikan bagian 'data' saja
}
"""



async def main():
    print("🔑 Memulai Login ... ... ...")
    token_data = await login_sipd()

    p = await async_playwright().start()
    browser = await p.chromium.launch(
        headless=True,
        args=[
            "--disable-gpu",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--ignore-certificate-errors",
            "--allow-running-insecure-content",
            "--window-size=1920,1080"
        ]
    )

    context = await browser.new_context()
    page_auth = await context.new_page()
    await page_auth.goto("https://sipd-ri.kemendagri.go.id")

    # Isi token ke localStorage
    await page_auth.evaluate("""(args) => {
        const {params, token_data, tahun, configsipd, auth_key} = args;
        window.localStorage.setItem('login-detail', JSON.stringify(params));
        window.localStorage.setItem(auth_key, JSON.stringify(token_data));
        window.localStorage.setItem('sipd-konfigurasi-tahun', tahun);
        window.localStorage.setItem('sipd-konfigurasi', JSON.stringify(configsipd));
    }""", {
        "params": {"username": username, "password": password, "id_daerah": id_daerah},
        "token_data": token_data,
        "tahun": tahun,
        "configsipd": {"id_daerah": id_daerah, "tahun": tahun},
        "auth_key": auth_key
    })

    await page_auth.reload()
    await asyncio.sleep(1)

    # Load JS helper ke page utama
    await page_auth.add_script_tag(path="crypto-js.min.js")
    await page_auth.add_script_tag(path="sipdri.js")

    # Debug: cek apakah token sudah tersimpan
    token_str = await page_auth.evaluate(f"localStorage.getItem('{auth_key}')")
    print("🔑 Token di localStorage:", token_str[:60] + "..." if token_str else "❌ Tidak ditemukan")

    
    opd_list = get_opd_list()
    
    for opd in opd_list:
        pid_sub_pd = opd[0]
        print(opd[1])

        
        data = await page_auth.evaluate(JS_FETCH, {"ptahun":tahun, "pid_daerah":id_daerah, "pid_sub_pd":pid_sub_pd, "pis_anggaran":1})
        if data:
            xdata = json.dumps(data) 
            insert_to_db(xdata, tahun, id_jadwal, pid_sub_pd)
            print(f"  ✅ Data untuk OPD {pid_sub_pd} - {opd[1]} telah disimpan.")
            #print(xdata)
        else:
            print(f"  ⚠️ Tidak ada data untuk OPD {pid_sub_pd} - {opd[1]}.")
    

    subkegiatan_list = get_subkegiatan_list()

    for subkeg in subkegiatan_list :    
        pid_sub_bl = int(subkeg[0])
        pid_sub_pd = subkeg[1]
        print(f"Output Subkegiatan ID: {pid_sub_bl} dari OPD ID: {pid_sub_pd}")

        
        data_output = await page_auth.evaluate(JS_FETCH_OUTPUT, {"ptahun":tahun, "pid_daerah":id_daerah, "pid_sub_bl":pid_sub_bl})
        if data_output:
            xdata_output = json.dumps(data_output) 
            with POOL.connection() as conn, conn.cursor() as cur:
                sql = "CALL sipd.sipdri_insert_indikator_subkegiatan((%s)::json,%s,%s, %s);"
                params = (xdata_output,tahun, id_jadwal, pid_sub_bl)
                cur.execute(sql, params)
                conn.commit()
            print(f"  ✅ Data Output untuk Subkegiatan {pid_sub_bl} telah disimpan.")
            #print(xdata_output)
        else:
            print(f"  ⚠️ Tidak ada data Output untuk Subkegiatan {pid_sub_bl}.")


    await browser.close()
    print(f"✅ Selesai. Total data tersimpan: ")

def sync_apbd():
    asyncio.run(main())

if __name__ == "__main__":
    asyncio.run(main())
