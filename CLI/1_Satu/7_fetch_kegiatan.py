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
BASE_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{token}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable_kegiatan"

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
            "kodeprogram": opd['kodeprogram'],
            "kodebidang": opd['kodebidang']
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
                        INSERT INTO renstra_kegiatan (
                            kodepemda, idperiode, kodeskpd, kodebidang, kodeprogram,
                            idoutcome, kodekegiatan, uraikegiatan, idparameter,
                            pagu1, pagu2, pagu3, pagu4, pagu5, pagu6, pagu7,
                            total_output, total_catatan, no
                        ) VALUES %s;
                        """

                values = [
                            (
                                r.get("kodepemda"),
                                r.get("idperiode"),
                                r.get("kodeskpd"),
                                r.get("kodebidang"),
                                r.get("kodeprogram"),
                                r.get("idoutcome"),
                                r.get("kodekegiatan"),
                                r.get("uraikegiatan"),
                                r.get("idparameter"),
                                float(r.get("pagu1", 0) or 0),
                                float(r.get("pagu2", 0) or 0),
                                float(r.get("pagu3", 0) or 0),
                                float(r.get("pagu4", 0) or 0),
                                float(r.get("pagu5", 0) or 0),
                                float(r.get("pagu6", 0) or 0),
                                float(r.get("pagu7", 0) or 0),
                                int(r.get("total_output", 0) or 0),
                                r.get("total_catatan", ""),
                                int(r.get("no", 0) or 0)
                            )
                            for r in rows["data"]
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
