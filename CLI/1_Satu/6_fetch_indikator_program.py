import asyncio
import httpx
import json
import psycopg2.extras
from tqdm.asyncio import tqdm
from psycopg2.extras import execute_values
from config import get_db as get_connection
from time import sleep

token = "bf12ec972b696142b2590421a95827721ffec7aa"
session_id = "6hfldp2apm05oos0joa3u728ml" 

# URL target
BASE_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{token}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable_indikator_outcome_perangkat_daerah"

# Header dari CURL
HEADERS = {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "origin": "https://sipd-ri.kemendagri.go.id",
    "referer": "https://sipd-ri.kemendagri.go.id/",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
}

# Cookie dari session (wajib aktif)
COOKIES = {
    "PHPSESSID": session_id,
    "pemda": '{"domain":"tegal.sipd.kemendagri.go.id","nama":"KOTA TEGAL"}'
}

# Limit concurrency (misal 5 request paralel)
CONCURRENCY_LIMIT = 5
MAX_RETRIES = 3


async def main():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute("SELECT * from renstra_program where id is not null ORDER BY id")
    opd_list= cur.fetchall()
    
    for opd in opd_list:
        print(f"Memproses Program {opd['kodeprogram']} - {opd['uraiprogram']}")
        kodeskpd = opd['kodeskpd']

        data = {
            "draw": "2",
            "start": "0",
            "length": "100000",
            "kodeskpd": opd['kodeskpd'],
            "idoutcome": opd['id'],  # Kosongkan untuk mengambil semua outcome
            "kodeprogram": opd['kodeprogram']  # Kosongkan untuk mengambil semua program
        }

        try:
            connector = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
            async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=connector) as client:
                resp = await client.post(BASE_URL, data=data)
                if resp.status_code == 429:
                    sleep(2)
                    continue
                resp.raise_for_status()
                rows = resp.json()

                sql = """
                        INSERT INTO renstra_indikator_program (
                            kodepemda, kodeskpd, uraiskpd, idperiode, kodebidang, uraibidang,
                            kodeprogram, uraiprogram, kodeindikator, uraiindikator, satuan,
                            status, target_awal, target0, target1, target2, target3, target4, target5,
                            creator, updater, source, kodeindikator_master, idoutcome, uraioUtcome,
                            tipe_data, sumber, urut, total_catatan
                        ) VALUES %s
                        ON CONFLICT DO NOTHING;
                        """

                values = [
                            (
                                d.get("kodepemda"), d.get("kodeskpd"), d.get("uraiskpd"), d.get("idperiode"),
                                d.get("kodebidang"), d.get("uraibidang"), d.get("kodeprogram"), d.get("uraiprogram"),
                                d.get("kodeindikator"), d.get("uraiindikator"), d.get("satuan"), d.get("status"),
                                d.get("target_awal"), d.get("target0"), d.get("target1"), d.get("target2"),
                                d.get("target3"), d.get("target4"), d.get("target5"),
                                d.get("creator"), d.get("updater"), d.get("source"),
                                d.get("kodeindikator_master"), d.get("idoutcome"), d.get("uraioutcome"),
                                d.get("tipe_data"), d.get("sumber"), d.get("urut"), d.get("total_catatan")
                            )
                            for d in rows["data"]
                        ]
                execute_values(cur, sql, values)
                conn.commit()

        except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError):
            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(1.5 * (attempt + 1))
                continue
            else:
                print(f"Gagal fetch {kodeskpd} setelah {MAX_RETRIES} percobaan")
                #return None


    cur.close()
    conn.close()

if __name__ == "__main__":
    asyncio.run(main())
