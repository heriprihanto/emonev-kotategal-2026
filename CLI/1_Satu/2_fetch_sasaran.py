import asyncio
import httpx
import psycopg2.extras
from tqdm.asyncio import tqdm
from psycopg2.extras import execute_values
from config import get_db as get_connection

BASE_URL = "https://sipd-ri.kemendagri.go.id/renstra/e0e2a17312441084a9a8c6b8049bc48d6445107e/?m=daerah_renstra_d_rakhir_sasaran"

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


def get_opd_list():
    """Ambil daftar kodeskpd dari tabel ta_opd"""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT kode as kodeskpd FROM ta_opd ORDER BY kode")
    data = cur.fetchall()
    cur.close()
    conn.close()
    return [r["kodeskpd"] for r in data]


async def fetch_one(client, kodeskpd: str):
    """Ambil data sasaran untuk satu kodeskpd"""
    payload = {
        "draw": "1",
        "start": "0",
        "length": "1000",
        "kodeskpd": kodeskpd
    }

    for attempt in range(MAX_RETRIES):
        try:
            resp = await client.post(BASE_URL, data=payload)
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
                print(f"Gagal fetch sasaran untuk {kodeskpd}")
                return None


async def fetch_all(opd_list):
    """Ambil semua sasaran secara paralel"""
    limits = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
    async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=limits) as client:
        tasks = [fetch_one(client, kode) for kode in opd_list]
        results = []
        for coro in tqdm(asyncio.as_completed(tasks), total=len(tasks), desc="Fetching sasaran"):
            res = await coro
            if res:
                results.append(res)
        return results


def insert_to_db(rows):
    """Batch insert ke tabel renstra_sasaran"""
    conn = get_connection()
    cur = conn.cursor()

    sql = """
    INSERT INTO renstra_sasaran (
        idsasaran, kodepemda, idperiode, kodeskpd, idtujuan,
        uraitujuan, uraisasaran, total_indikator, urut, total_catatan, no
    ) VALUES %s
    ON CONFLICT (idsasaran) DO NOTHING
    """

    values = [
        (
            d["idsasaran"],
            d.get("kodepemda"),
            d.get("idperiode"),
            d.get("kodeskpd"),
            d.get("idtujuan"),
            d.get("uraitujuan"),
            d.get("uraisasaran"),
            int(d.get("total_indikator", 0)) if d.get("total_indikator") else 0,
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


async def main():
    opd_list = get_opd_list()
    print(f"Total OPD: {len(opd_list)}")

    all_data = await fetch_all(opd_list)

    all_rows = []
    for res in all_data:
        if res and "data" in res:
            all_rows.extend(res["data"])

    print(f"Total sasaran fetched: {len(all_rows)}")

    if all_rows:
        insert_to_db(all_rows)
        print("✅ Data sasaran berhasil disimpan ke database.")


if __name__ == "__main__":
    asyncio.run(main())
