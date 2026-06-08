import asyncio
import httpx
import json
import psycopg2.extras
from tqdm.asyncio import tqdm
from psycopg2.extras import execute_values
from config import get_db as get_connection
from time import sleep
from datetime import datetime


token = "bf12ec972b696142b2590421a95827721ffec7aa"
session_id = "6hfldp2apm05oos0joa3u728ml" 

# URL target
BASE_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{token}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable_subkegiatan"

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
    cur.execute("SELECT * from renstra_output_kegiatan ORDER BY kodeskpd,kodeprogram,kodekegiatan")
    opd_list= cur.fetchall()
    
    for opd in opd_list:
        print(f"Memproses Program {opd['kodekegiatan']} - {opd['urai']}")
        kodeskpd = opd['kodeskpd']

        data = {
            "draw": "2",
            "start": "0",
            "length": "100000",
            "kodeskpd": opd['kodeskpd'],
            "idoutcome": opd['idoutcome'],  # Kosongkan untuk mengambil semua outcome
            "kodeprogram": opd['kodeprogram'],
            "kodebidang": opd['kodebidang'],
            "kodekegiatan": opd['kodekegiatan'],
            "idoutput": opd['id']  # Kosongkan untuk mengambil semua output
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
                        INSERT INTO renstra_subkegiatan (
                            kodepemda, idperiode, kodeskpd, kodebidang, kodeprogram,
                            kodekegiatan, idoutcome, idoutput, kodesubkegiatan, uraisubkegiatan,
                            kinerja, kodesubkegiatan_indikator, uraisubkegiatan_indikator, formula,
                            satuan, status, pagu1, pagu2, pagu3, pagu4, pagu5, pagu6, pagu7,
                            volume_awal, volume_0, volume_1, volume_2, volume_3, volume_4, volume_5,
                            kodeindikator_master, dssd, lokasi, tag_lokasi, prioritas, total_catatan,
                            no, created_at, updated_at
                        ) VALUES %s
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
                            for r in rows["data"]
                        ]
                execute_values(cur, sql, values)
                conn.commit()

        except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError):
            #if attempt < MAX_RETRIES - 1:
            #    await asyncio.sleep(1.5 * (attempt + 1))
            #    continue
            #else:
            print(f"Gagal fetch {kodeskpd} setelah {MAX_RETRIES} percobaan")
                #return None


    cur.close()
    conn.close()

if __name__ == "__main__":
    asyncio.run(main())
