import asyncio
import httpx
import json
import psycopg2.extras
from tqdm.asyncio import tqdm
from psycopg2.extras import execute_values
from config import get_db as get_connection
from time import sleep
from config_db import token, session_id, HEADERS, COOKIES, CONCURRENCY_LIMIT, MAX_RETRIES


# URL target
BASE_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{token}/?m=daerah_renstra_d_rakhir_tujuan"




async def fetch_one(client, kode_skpd: str):
    """Mengambil data satu SKPD dengan retry otomatis"""
    data = {
        "draw": "1",
        "start": "0",
        "length": "10",
        "kodeskpd": kode_skpd
    }

    for attempt in range(MAX_RETRIES):
        try:
            resp = await client.post(BASE_URL, data=data)
            if resp.status_code == 429:
                sleep(2)
                continue
            resp.raise_for_status()
            return resp.json()
        except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError):
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(1.5 * (attempt + 1))
                continue
            else:
                print(f"Gagal fetch {kode_skpd} setelah {MAX_RETRIES} percobaan")
                return None


async def fetch_all(opd_list):
    """Ambil data seluruh SKPD secara paralel"""
    connector = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
    async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=connector) as client:
        tasks = [fetch_one(client, opd["kode_skpd"]) for opd in opd_list]
        results = []
        for coro in tqdm(asyncio.as_completed(tasks), total=len(tasks), desc="Fetching data"):
            res = await coro
            if res:
                results.append(res)
        return results


def insert_to_db(rows):
    """Batch insert ke tabel renstra_tujuan"""
    conn = get_connection()
    cur = conn.cursor()

    sql = """
    INSERT INTO renstra_tujuan_new (
        idtujuan, kodepemda, idperiode, kodeskpd, uraitujuan,
        daftar_bidang, sasaran_rpjmd, total_indikator, total_catatan, no_urut
    ) VALUES %s
    ON CONFLICT (idtujuan) DO NOTHING
    """

    values = [
        (
            d["idtujuan"],
            d.get("kodepemda"),
            d.get("idperiode"),
            d.get("kodeskpd"),
            d.get("uraitujuan"),
            json.dumps(d.get("daftar_bidang", [])),
            json.dumps(d.get("sasaran_rpjmd", [])),
            int(d.get("total_indikator", 0)),
            d.get("total_catatan"),
            int(d.get("no", 0))
        )
        for d in rows
    ]

    execute_values(cur, sql, values)
    conn.commit()
    cur.close()
    conn.close()


def get_opd_list():
    """Ambil daftar kode SKPD dari ta_opd"""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT kode as kode_skpd, nama_pd as nama_skpd FROM ta_opd ORDER BY kode")
    data = cur.fetchall()
    cur.close()
    conn.close()
    return [{"kode_skpd": r["kode_skpd"], "nama_skpd": r["nama_skpd"]} for r in data]


async def main():
    opd_list = get_opd_list()
    print(f"Total OPD: {len(opd_list)}")

    all_data = await fetch_all(opd_list)

    # Flatten hasil response JSON ke list data "data"
    all_rows = []
    for res in all_data:
        if res and "data" in res:
            all_rows.extend(res["data"])

    print(f"Total rows fetched: {len(all_rows)}")

    if all_rows:
        insert_to_db(all_rows)
        print("✅ Data berhasil dimasukkan ke database.")


if __name__ == "__main__":
    asyncio.run(main())
