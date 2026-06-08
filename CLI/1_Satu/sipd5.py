import asyncio
import json
from tqdm.asyncio import tqdm
from playwright.async_api import async_playwright
import psycopg2.extras
from config_db import get_conn, put_conn
import time

tahun = 2026
username = "admin.kotategal2"
password = "TegalBahari2022@)@@"
id_daerah = 70
is_anggaran = 1
auth_key = "v8.0.38-authf649fc9a5f55"
id_jadwal = 100

CONCURRENCY = 8   # jumlah paralel page / worker


async def login_sipd():
    import httpx
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            "https://sipd-ri.kemendagri.go.id/api/auth/auth/login",
            data={"username": username, "password": password, "id_daerah": id_daerah}
        )
        r.raise_for_status()
        return r.json()


def get_opd_list():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id_sub_pd, nama_pd FROM ta_opd ORDER BY kode")
    rows = cur.fetchall()
    cur.close()
    put_conn(conn)
    return rows


def get_completed_opd():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT id_sub_skpd FROM sipdri_subkegiatan")
    rows = cur.fetchall()
    cur.close()
    put_conn(conn)
    return {r[0] for r in rows}


def insert_batch(rows):
    if not rows:
        print("⚠️ Tidak ada data yang akan disimpan ke database.")
        return set()

    conn = None
    cur = None
    try:
        conn = get_conn()
        cur = conn.cursor()

        psycopg2.extras.execute_values(cur, """
            INSERT INTO sipdri_subkegiatan(
                id_jadwal,id_sub_bl,id_daerah,tahun,id_unit,id_sub_skpd,
                kode_urusan,nama_urusan,kode_bidang_urusan,nama_bidang_urusan,
                kode_sub_skpd,nama_sub_skpd,id_program,kode_program,nama_program,
                id_giat,kode_giat,nama_giat,id_sub_giat,kode_sub_giat,
                nama_sub_giat,pagu,rincian,kode_bl,kode_sbl
            ) VALUES %s
            ON CONFLICT DO NOTHING
        """, rows)

        conn.commit()
        print(f"💾 Berhasil menyimpan {len(rows)} baris ke database.")

    except psycopg2.Error as e:
        print("❌ ERROR saat insert data ke database:")
        print(f"   Tipe: {type(e).__name__}")
        print(f"   Pesan: {e.pgerror or e}")
        if conn:
            conn.rollback()
    except Exception as e:
        print("❌ ERROR tak terduga saat insert data:")
        print(f"   {type(e).__name__}: {e}")
        if conn:
            conn.rollback()
    finally:
        if cur:
            cur.close()
        if conn:
            put_conn(conn)

    return {r[4] for r in rows}  # index 4 adalah id_unit


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

    return js.data;  // 👈 hanya kembalikan bagian 'data' saja
}
"""



async def worker(page, queue, results, pbar, result_lock, start_time):
    while True:
        item = await queue.get()
        if item is None:
            queue.task_done()
            break

        id_sub_pd, nama_pd = item
        for attempt in range(5):
            try:
                data = await page.evaluate(JS_FETCH, {
                    "ptahun": tahun,
                    "pid_daerah": id_daerah,
                    "pid_sub_pd": id_sub_pd,
                    "pis_anggaran": 1
                })
                #print (data)
                break
            except Exception as e:
                print(f"❌ Error mengambil {nama_pd} (percobaan {attempt+1}): {e}")
                await asyncio.sleep(1 + attempt)
        else:
            print(f"⚠️ Gagal mengambil {nama_pd}, dilewati.")
            queue.task_done()
            pbar.update(1)
            continue

        async with result_lock:
            for row in data:
                results.append((
                    id_jadwal, row["id_sub_bl"], id_daerah, tahun, row["id_unit"], row["id_sub_skpd"],
                    row["kode_urusan"], row["nama_urusan"], row["kode_bidang_urusan"], row["nama_bidang_urusan"],
                    row["kode_sub_skpd"], row["nama_sub_skpd"], row["id_program"], row["kode_program"], row["nama_program"],
                    row["id_giat"], row["kode_giat"], row["nama_giat"], row["id_sub_giat"], row["kode_sub_giat"],
                    row["nama_sub_giat"], row["pagu"], row["rincian"], row["kode_bl"], row["kode_sbl"]
                ))

        # Update progress bar + statistik waktu
        elapsed = time.time() - start_time
        rate = pbar.n / elapsed if elapsed > 0 else 0
        remaining = (pbar.total - pbar.n) / rate if rate > 0 else 0
        pbar.set_postfix({
            "⏱️ waktu": f"{elapsed:,.1f}s",
            "⚡ kecepatan": f"{rate:.2f} OPD/s",
            "🕒 sisa": f"{remaining:,.1f}s"
        })
        pbar.update(1)
        queue.task_done()


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
    done = get_completed_opd()
    opd_list = [row for row in opd_list if row[0] not in done]

    total_opd = len(opd_list)
    print(f"🟢 Total OPD: {len(get_opd_list())}")
    print(f"🟡 Sudah selesai: {len(done)}")
    print(f"🔴 Akan diproses: {total_opd}")

    if total_opd == 0:
        print("Semua OPD sudah selesai. Tidak ada yang perlu diproses.")
        await browser.close()
        return

    queue = asyncio.Queue()
    for row in opd_list:
        await queue.put(row)

    results = []
    result_lock = asyncio.Lock()

    # Buat page worker dan load JS helper di tiap page
    pages = [await context.new_page() for _ in range(CONCURRENCY)]
    for pg in pages:
        await pg.goto("https://sipd-ri.kemendagri.go.id")
        await pg.add_script_tag(path="crypto-js.min.js")
        await pg.add_script_tag(path="sipdri.js")
        await asyncio.sleep(0.2)

    start_time = time.time()

    # Progress bar dengan estimasi waktu dan kecepatan
    with tqdm(total=total_opd, desc="📦 Mengambil data OPD", unit="OPD") as pbar:
        tasks = [
            asyncio.create_task(worker(pg, queue, results, pbar, result_lock, start_time))
            for pg in pages
        ]

        await queue.join()

        for _ in pages:
            await queue.put(None)
        await asyncio.gather(*tasks)

    insert_batch(results)

    await browser.close()
    print(f"✅ Selesai. Total data tersimpan: {len(results)}")


if __name__ == "__main__":
    asyncio.run(main())
