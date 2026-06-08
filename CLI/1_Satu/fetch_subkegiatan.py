import asyncio
import json
from datetime import datetime

import httpx
import psycopg2
from psycopg2.pool import SimpleConnectionPool
from psycopg2.extras import execute_values
from tqdm.asyncio import tqdm

from config_db import (
    get_db_config,
    TOKEN,
    SESSION_ID,
    HEADERS,
    COOKIES,
    CONCURRENCY_LIMIT,
    MAX_RETRIES
)


# --- CONFIGURASI DASAR ---

BASE_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable_subkegiatan"
DB_CONFIG = get_db_config()

# Buat connection pool global
db_pool = SimpleConnectionPool(
    minconn=1,
    maxconn=10,  # bisa disesuaikan
    **DB_CONFIG
)

semaphore = asyncio.Semaphore(CONCURRENCY_LIMIT)


# --- FUNCTION UNTUK FETCH ---

async def fetch_subkegiatan(client, opd):
    """Fetch data subkegiatan untuk 1 OPD (1 kegiatan)"""
    data = {
        "draw": "2",
        "start": "0",
        "length": "100000",
        "kodeskpd": opd["kodeskpd"],
        "idoutcome": opd["idoutcome"],
        "kodeprogram": opd["kodeprogram"],
        "kodebidang": opd["kodebidang"],
        "kodekegiatan": opd["kodekegiatan"],
        "idoutput": opd["id"]
    }

    for attempt in range(MAX_RETRIES):
        try:
            async with semaphore:
                resp = await client.post(BASE_URL, data=data)
                if resp.status_code == 429:  # Rate limit
                    await asyncio.sleep(2 * (attempt + 1))
                    continue
                resp.raise_for_status()
                return opd, resp.json().get("data", [])

        except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError):
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(1.5 * (attempt + 1))
                continue
            else:
                print(f"❌ Gagal fetch {opd['kodeskpd']} setelah {MAX_RETRIES} percobaan")
                return opd, []
    return opd, []


# --- FUNCTION UNTUK INSERT DATABASE ---

def insert_subkegiatan(rows):
    """Batch insert hasil fetch ke tabel renstra_subkegiatan"""
    if not rows:
        return

    conn = db_pool.getconn()
    try:
        with conn.cursor() as cur:
            sql = """
                INSERT INTO renstra_subkegiatan (
                    kodepemda, idperiode, kodeskpd, kodebidang, kodeprogram,
                    kodekegiatan, idoutcome, idoutput, kodesubkegiatan, uraisubkegiatan,
                    kinerja, kodesubkegiatan_indikator, uraisubkegiatan_indikator, formula,
                    satuan, status, pagu1, pagu2, pagu3, pagu4, pagu5, pagu6, pagu7,
                    volume_awal, volume_0, volume_1, volume_2, volume_3, volume_4, volume_5,
                    kodeindikator_master, dssd, lokasi, tag_lokasi, prioritas, total_catatan,
                    no, created_at, updated_at
                ) VALUES %s
                ON CONFLICT DO NOTHING
            """

            values = [
                (
                    r.get("kodepemda"),
                    r.get("idperiode"),
                    r.get("kodeskpd"),
                    r.get("kodebidang"),
                    r.get("kodeprogram"),
                    r.get("kodekegiatan"),
                    r.get("idoutcome"),
                    r.get("idoutput"),
                    r.get("kodesubkegiatan"),
                    r.get("uraisubkegiatan"),
                    r.get("kinerja"),
                    r.get("kodesubkegiatan_indikator"),
                    r.get("uraisubkegiatan_indikator"),
                    r.get("formula"),
                    r.get("satuan"),
                    r.get("status"),
                    float(r.get("pagu1", 0) or 0),
                    float(r.get("pagu2", 0) or 0),
                    float(r.get("pagu3", 0) or 0),
                    float(r.get("pagu4", 0) or 0),
                    float(r.get("pagu5", 0) or 0),
                    float(r.get("pagu6", 0) or 0),
                    float(r.get("pagu7", 0) or 0),
                    r.get("volume_awal"),
                    r.get("volume_0"),
                    r.get("volume_1"),
                    r.get("volume_2"),
                    r.get("volume_3"),
                    r.get("volume_4"),
                    r.get("volume_5"),
                    r.get("kodeindikator_master"),
                    json.dumps(r.get("dssd")) if r.get("dssd") else None,
                    json.dumps(r.get("lokasi")) if r.get("lokasi") else None,
                    json.dumps(r.get("tag_lokasi")) if r.get("tag_lokasi") else None,
                    r.get("prioritas"),
                    r.get("total_catatan"),
                    int(r.get("no", 0) or 0),
                    datetime.now(),
                    datetime.now()
                )
                for r in rows
            ]

            execute_values(cur, sql, values)
            conn.commit()
    finally:
        db_pool.putconn(conn)


# --- MAIN PROGRAM ---

async def main():
    # Ambil daftar kegiatan dari DB
    conn = db_pool.getconn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT * FROM renstra_output_kegiatan ORDER BY kodeskpd,kodeprogram,kodekegiatan")
    opd_list = cur.fetchall()
    cur.close()
    db_pool.putconn(conn)

    connector = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
    async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=connector) as client:
        tasks = [fetch_subkegiatan(client, opd) for opd in opd_list]
        results = []
        
        # ✅ gunakan tqdm + asyncio.as_completed
        for coro in tqdm(asyncio.as_completed(tasks), total=len(tasks), desc="Fetching Subkegiatan"):
            opd, rows = await coro
            if rows:
                insert_subkegiatan(rows)
            results.append(rows)

    # Tutup semua koneksi di akhir
    db_pool.closeall()



def run_fetch_subkegiatan():
    """Fungsi wrapper supaya bisa dipanggil dari script lain"""
    asyncio.run(main())

'''
if __name__ == "__main__":
    asyncio.run(main())
'''