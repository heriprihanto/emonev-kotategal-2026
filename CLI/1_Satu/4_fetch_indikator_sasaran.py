import asyncio
import httpx
import psycopg2
import psycopg2.extras
from psycopg2.extras import execute_values
from tqdm.asyncio import tqdm
from config import get_db as get_connection

BASE_URL = "https://sipd-ri.kemendagri.go.id/renstra/e0e2a17312441084a9a8c6b8049bc48d6445107e/?m=daerah_renstra_d_rakhir_sasaran&f=datatable_indikator_sasaran"

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


def get_sasaran_list():
    """Ambil daftar idsasaran dan kodeskpd dari tabel renstra_sasaran"""
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT idsasaran, kodeskpd FROM renstra_sasaran ORDER BY kodeskpd")
    data = cur.fetchall()
    cur.close()
    conn.close()
    return [(r["idsasaran"], r["kodeskpd"]) for r in data]


async def fetch_one(client, idsasaran: str, kodeskpd: str):
    """Ambil indikator untuk satu sasaran"""
    payload = {
        "draw": "1",
        "start": "0",
        "length": "1000",
        "idsasaran": idsasaran,
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
                print(f"⚠️ Gagal fetch indikator sasaran: {idsasaran}")
                return None


async def fetch_all(sasaran_list):
    """Ambil semua indikator sasaran secara paralel"""
    limits = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
    async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=limits) as client:
        tasks = [fetch_one(client, ids, kode) for ids, kode in sasaran_list]
        results = []
        for coro in tqdm(asyncio.as_completed(tasks), total=len(tasks), desc="Fetching indikator sasaran"):
            res = await coro
            if res:
                results.append(res)
        return results


def insert_to_db(rows):
    """Batch insert ke tabel renstra_indikator_sasaran"""
    conn = get_connection()
    cur = conn.cursor()

    sql = """
    INSERT INTO renstra_indikator_sasaran (
        idsasaran_indikator, idsasaran, kodeskpd, kodepemda, idperiode,
        uraisasaran_indikator, status, satuan, target_awal, target0,
        target1, target2, target3, target4, target5, target6, target7,
        creator, updater, postdate, lastupdate, sumber, kodeindikator_master,
        tipe_data, urut, total_catatan, no,iku
    ) VALUES %s
    """

    values = []
    for d in rows:
        values.append((
            d.get("idsasaran_indikator"),
            d.get("idsasaran"),
            d.get("kodeskpd"),
            d.get("kodepemda"),
            d.get("idperiode"),
            d.get("uraisasaran_indikator"),
            d.get("status"),
            d.get("satuan"),
            d.get("target_awal"),
            d.get("target0"),
            d.get("target1"),
            d.get("target2"),
            d.get("target3"),
            d.get("target4"),
            d.get("target5"),
            d.get("target6"),
            d.get("target7"),
            d.get("creator"),
            d.get("updater"),
            d.get("postdate"),
            d.get("lastupdate"),
            d.get("sumber"),
            d.get("kodeindikator_master"),
            d.get("tipe_data"),
            int(d.get("urut", 0)) if d.get("urut") else 0,
            d.get("total_catatan"),
            int(d.get("no", 0)) if d.get("no") else 0,
            d.get("iku")
        ))

    if values:
        execute_values(cur, sql, values)
        conn.commit()
    cur.close()
    conn.close()


async def main():
    sasaran_list = get_sasaran_list()
    print(f"Total sasaran: {len(sasaran_list)}")

    all_data = await fetch_all(sasaran_list)

    all_rows = []
    for res in all_data:
        if res and "data" in res:
            all_rows.extend(res["data"])

    print(f"Total indikator fetched: {len(all_rows)}")

    if all_rows:
        insert_to_db(all_rows)
        print("✅ Data indikator sasaran berhasil disimpan ke database.")


if __name__ == "__main__":
    asyncio.run(main())
