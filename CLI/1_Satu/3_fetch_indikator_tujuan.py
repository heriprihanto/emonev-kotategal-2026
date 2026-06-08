import asyncio
import httpx
import json
import psycopg2.extras
from tqdm.asyncio import tqdm
from psycopg2.extras import execute_values
from config import get_db as get_connection
from time import sleep

# URL target
BASE_URL = "https://sipd-ri.kemendagri.go.id/renstra/e0e2a17312441084a9a8c6b8049bc48d6445107e/?m=daerah_renstra_d_rakhir_tujuan&f=datatable_indikator_tujuan"

# Header dan cookie dari CURL
HEADERS = {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "origin": "https://sipd-ri.kemendagri.go.id",
    "referer": "https://sipd-ri.kemendagri.go.id/",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
}

COOKIES = {
    "PHPSESSID": "bomq8ltcm566keqc7789i15q18",
    "pemda": '{"domain":"tegal.sipd.kemendagri.go.id","nama":"KOTA TEGAL"}'
}

CONCURRENCY_LIMIT = 5
MAX_RETRIES = 3


async def fetch_one(client, idtujuan: str, kodeskpd: str):
    """Ambil data indikator dari satu tujuan"""
    data = {
        "draw": "1",
        "start": "0",
        "length": "100",
        "idtujuan": idtujuan,
        "kodeskpd": kodeskpd
    }

    for attempt in range(MAX_RETRIES):
        try:
            resp = await client.post(BASE_URL, data=data)
            if resp.status_code == 429:
                await asyncio.sleep(2)
                continue
            resp.raise_for_status()
            return resp.json()
        except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError):
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(1.5 * (attempt + 1))
                continue
            else:
                print(f"Gagal fetch indikator {idtujuan}")
                return None


async def fetch_all(tujuan_list):
    """Ambil semua indikator_tujuan secara paralel"""
    connector = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
    async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=connector) as client:
        tasks = [fetch_one(client, t["idtujuan"], t["kodeskpd"]) for t in tujuan_list]
        results = []
        for coro in tqdm(asyncio.as_completed(tasks), total=len(tasks), desc="Fetching indikator"):
            res = await coro
            if res:
                results.append(res)
        return results


def insert_to_db(rows):
    """Batch insert ke tabel renstra_tujuan_indikator"""
    conn = get_connection()
    cur = conn.cursor()

    sql = """
    INSERT INTO renstra_indikator_tujuan (
        idtujuan_indikator, idtujuan, kodepemda, idperiode, uraitujuan_indikator,
        status, satuan, target_awal, target0, target1, target2, target3, target4, target5,
        creator, updater, postdate, lastupdate, tipe_data, kodeindikator_master, sumber,
        iku, ikd, uraiaspek, aspek, kodeskpd, kodebidang_ikk, uraibidang_ikk, urut, total_catatan, no
    ) VALUES %s
    ON CONFLICT (idtujuan_indikator) DO NOTHING
    """

    values = [
        (
            d["idtujuan_indikator"],
            d.get("idtujuan"),
            d.get("kodepemda"),
            d.get("idperiode"),
            d.get("uraitujuan_indikator"),
            d.get("status"),
            d.get("satuan"),
            d.get("target_awal"),
            d.get("target0"),
            d.get("target1"),
            d.get("target2"),
            d.get("target3"),
            d.get("target4"),
            d.get("target5"),
            d.get("creator"),
            d.get("updater"),
            d.get("postdate"),
            d.get("lastupdate"),
            d.get("tipe_data"),
            d.get("kodeindikator_master"),
            d.get("sumber"),
            d.get("iku"),
            d.get("ikd"),
            d.get("uraiaspek"),
            d.get("aspek"),
            d.get("kodeskpd"),
            d.get("kodebidang_ikk"),
            d.get("uraibidang_ikk"),
            int(d.get("urut", 0)) if d.get("urut") else 0,
            d.get("total_catatan"),
            int(d.get("no", 0)) if d.get("no") else 0,
        )
        for d in rows
    ]

    execute_values(cur, sql, values)
    conn.commit()
    cur.close()
    conn.close()


def get_tujuan_list():
    """Ambil daftar idtujuan dari tabel renstra_tujuan"""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT idtujuan, kodeskpd FROM renstra_tujuan ORDER BY idtujuan")
    data = cur.fetchall()
    cur.close()
    conn.close()
    return [{"idtujuan": r["idtujuan"], "kodeskpd": r["kodeskpd"]} for r in data]


async def main():
    tujuan_list = get_tujuan_list()
    print(f"Total tujuan: {len(tujuan_list)}")

    all_data = await fetch_all(tujuan_list)

    # Flatten semua data dari setiap tujuan
    all_rows = []
    for res in all_data:
        if res and "data" in res:
            all_rows.extend(res["data"])

    print(f"Total indikator fetched: {len(all_rows)}")

    if all_rows:
        insert_to_db(all_rows)
        print("✅ Data indikator berhasil dimasukkan ke database.")


if __name__ == "__main__":
    asyncio.run(main())
