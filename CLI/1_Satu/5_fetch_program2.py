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
BASE_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{token}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable"

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
    cur.execute("SELECT kode as kode_skpd, nama_pd as nama_skpd FROM ta_opd ORDER BY kode")
    opd_list= cur.fetchall()
    
    for opd in opd_list:
        print(f"Memproses SKPD {opd['kode_skpd']} - {opd['nama_skpd']}")
        kode_skpd = opd['kode_skpd']

        data = {
            "draw": "2",
            "start": "0",
            "length": "100000",
            "kodeskpd": kode_skpd
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
                        INSERT INTO renstra_program (
                                kodepemda, idperiode, kodebidang, uraibidang, kodeprogram, uraiprogram,
                                program_rakortek, id, urai,
                                pagu_validasi1, pagu_validasi2, pagu_validasi3, pagu_validasi4, pagu_validasi5,
                                pagu_validasi6, pagu_validasi7,
                                idparameter, renstra_sasaran, rpjmd_sasaran,
                                total_indikator,
                                pagu_skpd1, pagu_skpd2, pagu_skpd3, pagu_skpd4, pagu_skpd5, pagu_skpd6, pagu_skpd7,
                                total_catatan, total_catatan_program,
                                kodeskpd_creator, total_kegiatan, admin_only, no,kodeskpd
                            ) VALUES %s
                        """

                values = [
                            (
                                d.get("kodepemda"),
                                    d.get("idperiode"),
                                    d.get("kodebidang"),
                                    d.get("uraibidang"),
                                    d.get("kodeprogram"),
                                    d.get("uraiprogram"),
                                    d.get("program_rakortek"),
                                    d.get("id"),
                                    d.get("urai"),
                                    d.get("pagu_validasi1"),
                                    d.get("pagu_validasi2"),
                                    d.get("pagu_validasi3"),
                                    d.get("pagu_validasi4"),
                                    d.get("pagu_validasi5"),
                                    d.get("pagu_validasi6"),
                                    d.get("pagu_validasi7"),
                                    d.get("idparameter"),
                                    json.dumps(d.get("renstra_sasaran", [])),
                                    json.dumps(d.get("rpjmd_sasaran", [])),
                                    d.get("total_indikator"),
                                    d.get("pagu_skpd1"),
                                    d.get("pagu_skpd2"),
                                    d.get("pagu_skpd3"),
                                    d.get("pagu_skpd4"),
                                    d.get("pagu_skpd5"),
                                    d.get("pagu_skpd6"),
                                    d.get("pagu_skpd7"),
                                    d.get("total_catatan"),
                                    d.get("total_catatan_program"),
                                    d.get("kodeskpd_creator"),
                                    d.get("total_kegiatan"),
                                    d.get("admin_only"),
                                    d.get("no"),kode_skpd
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
                print(f"Gagal fetch {kode_skpd} setelah {MAX_RETRIES} percobaan")
                #return None


    cur.close()
    conn.close()

if __name__ == "__main__":
    asyncio.run(main())
