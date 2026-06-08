import asyncio
import httpx
import json
import psycopg2.extras
from psycopg2.pool import SimpleConnectionPool
from time import sleep
import configparser
import os
from typing import Any, Optional, Tuple, List


# ---------------------------
# Configuration / DB pool
# ---------------------------

def get_db_config():
    return {
        "dbname": "renstra",
        "user": "monevrkpd",
        "password": "heriprihanto140286",
        "host": "192.168.50.75",
        "port": 5432,
    }

DB_CONFIG = get_db_config()

# Buat connection pool global
db_pool = SimpleConnectionPool(minconn=1, maxconn=10, **DB_CONFIG)


def get_conn():
    return db_pool.getconn()


def put_conn(conn):
    db_pool.putconn(conn)


CONFIG_FILE = "config.ini"


def load_config() -> configparser.ConfigParser:
    config = configparser.ConfigParser()
    if os.path.exists(CONFIG_FILE):
        config.read(CONFIG_FILE)
    else:
        config["WEBSESSION"] = {"sessionid": "", "token": ""}
        with open(CONFIG_FILE, "w") as file:
            config.write(file)
    return config

def save_config(config):
    with open(CONFIG_FILE, "w") as file:
        config.write(file)


config = load_config()

CONCURRENCY_LIMIT = 5
MAX_RETRIES = 3

SESSION_ID = config["WEBSESSION"].get("sessionid", "")
TOKEN = config["WEBSESSION"].get("token", "")

HEADERS = {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "origin": "https://sipd-ri.kemendagri.go.id",
    "referer": "https://sipd-ri.kemendagri.go.id/",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
}

COOKIES = {
    "PHPSESSID": SESSION_ID,
    "pemda": '{"domain":"tegal.sipd.kemendagri.go.id","nama":"KOTA TEGAL"}',
}


# ---------------------------
# DB helper
# ---------------------------

def execute_query(sql: str, params: Optional[Tuple[Any, ...]] = None, fetch: bool = False):
    conn = None
    try:
        conn = get_conn()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute(sql, params)
        result = None
        if fetch:
            result = cur.fetchall()
        conn.commit()
        cur.close()
        return result
    except Exception as e:
        if conn:
            conn.rollback()
        print("[DB ERROR]:", e)
    finally:
        if conn:
            put_conn(conn)


# ---------------------------
# Small HTTP helper with retries
# ---------------------------

async def post_with_retries(client: httpx.AsyncClient, url: str, data: dict, max_retries: int = MAX_RETRIES) -> dict:
    """Post request with simple retry/backoff. Returns parsed JSON on success, raises after retries."""
    for attempt in range(max_retries):
        try:
            resp = await client.post(url, data=data)
            if resp.status_code == 429:
                # Too many requests → backoff
                wait = 2 * (attempt + 1)
                await asyncio.sleep(wait)
                continue
            resp.raise_for_status()
            return resp.json()
        except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError) as exc:
            if attempt < max_retries - 1:
                wait = 1.5 * (attempt + 1)
                await asyncio.sleep(wait)
                continue
            else:
                # re-raise to allow caller to handle/log
                raise


# ---------------------------
# Query helpers (DB read)
# ---------------------------

def get_opd_list():
    data = execute_query("SELECT kode as kode_skpd, nama_pd as nama_skpd FROM ta_opd where is_pd=1 ORDER BY kode asc", fetch=True)
    return [{"kode_skpd": r["kode_skpd"], "nama_skpd": r["nama_skpd"]} for r in data] if data else []


def get_subopd_list():
    data = execute_query("SELECT kode as kode_skpd, nama_pd as nama_skpd FROM ta_opd ORDER BY kode asc", fetch=True)
    return [{"kode_skpd": r["kode_skpd"], "nama_skpd": r["nama_skpd"]} for r in data] if data else []


def get_tujuan_list():
    data = execute_query("SELECT idtujuan, kodeskpd FROM renstra_tujuan ORDER BY idtujuan", fetch=True)
    return [{"idtujuan": r["idtujuan"], "kodeskpd": r["kodeskpd"]} for r in data] if data else []


def get_sasaran_list():
    data = execute_query("SELECT idsasaran, kodeskpd FROM renstra_sasaran ORDER BY kodeskpd", fetch=True)
    return [{"idsasaran": r["idsasaran"], "kodeskpd": r["kodeskpd"]} for r in data] if data else []


def get_program_list():
    data = execute_query("SELECT id,kodeskpd,kodeprogram,kodebidang,renstra_sasaran from renstra_program where id is not null ORDER BY kodeprogram asc", fetch=True)
    return [{"idoutcome": r["id"], "kodeskpd": r["kodeskpd"], "kodeprogram": r["kodeprogram"], "kodebidang": r["kodebidang"],"renstra_sasaran" :r["renstra_sasaran"] } for r in data] if data else []


def get_kegiatan_list():
    data = execute_query("SELECT kodeskpd,kodeprogram,kodekegiatan,idoutcome,kodebidang from renstra_kegiatan ORDER BY kodeskpd,kodeprogram,kodekegiatan", fetch=True)
    # return list of tuples-like DictRows
    return data if data else []


def get_kegiatan_output_list():
    data = execute_query("""SELECT kodeskpd,idoutcome,kodeprogram,kodebidang,kodekegiatan,id from renstra_output_kegiatan where kodeskpd IN ('7.01.0.00.0.00.04.0000',
'7.01.0.00.0.00.04.0001',
'7.01.0.00.0.00.04.0002',
'7.01.0.00.0.00.04.0003',
'7.01.0.00.0.00.04.0004',
'7.01.0.00.0.00.04.0005',
'7.01.0.00.0.00.04.0006',
'7.01.0.00.0.00.04.0007') ORDER BY kodeskpd,kodeprogram,kodekegiatan""", fetch=True)
    return data if data else []


# ---------------------------
# Fetch functions (ALL async)
# ---------------------------

async def fetch_tujuan(client: httpx.AsyncClient):
    dataopd = get_opd_list()
    print(f"MULAI FETCH TUJUAN UNTUK {len(dataopd)} OPD")

    TUJUAN_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_tujuan"

    for i, opd in enumerate(dataopd, start=1):
        kode_skpd = opd["kode_skpd"]
        print(i, kode_skpd, opd["nama_skpd"])

        paramstujuan = {"draw": "2", "start": "0", "length": "100000", "kodeskpd": kode_skpd}

        try:
            data = await post_with_retries(client, TUJUAN_URL, paramstujuan)
            xdata = json.dumps(data)
            count = len(data.get("data", [])) if isinstance(data, dict) else 0
            print(f"  - Jumlah tujuan: {count}")
            execute_query("CALL insert_tujuan(%s, %s);", (xdata, kode_skpd))
        except Exception as e:
            print(f"Gagal fetch tujuan {kode_skpd}: {e}")


async def fetch_indikator_tujuan(client: httpx.AsyncClient):
    tujuan_list = get_tujuan_list()
    print(f"MULAI FETCH  INDIKATOR TUJUAN UNTUK {len(tujuan_list)} TUJUAN")

    INDIKATORTUJUAN_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_tujuan&f=datatable_indikator_tujuan"

    for t in tujuan_list:
        try:
            payload = {"draw": "2", "start": "0", "length": "1000000", "idtujuan": t["idtujuan"], "kodeskpd": t["kodeskpd"]}
            data = await post_with_retries(client, INDIKATORTUJUAN_URL, payload)
            xdata = json.dumps(data)
            count = len(data.get("data", [])) if isinstance(data, dict) else 0
            print(f"  - Jumlah indikator tujuan ({t['kodeskpd']}:{t['idtujuan']}): {count}")
            execute_query("CALL insert_indikator_tujuan(%s, %s, %s);", (xdata, t["kodeskpd"], t["idtujuan"]))
        except Exception as e:
            print(f"Gagal fetch indikator tujuan {t}: {e}")


async def fetch_sasaran(client: httpx.AsyncClient):
    m_list = get_opd_list()
    print(f"MULAI FETCH  SASARAN UNTUK {len(m_list)} TUJUAN")

    X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_sasaran"

    for t in m_list:
        kodeskpd = t["kode_skpd"]
        print(kodeskpd)
        payload = {"draw": "2", "start": "0", "length": "100000", "kodeskpd": kodeskpd}
        try:
            data = await post_with_retries(client, X_URL, payload)
            xdata = json.dumps(data)
            count = len(data.get("data", [])) if isinstance(data, dict) else 0
            print(f"  - Jumlah sasaran: {count}")
            execute_query("CALL insert_sasaran(%s, %s);", (xdata, kodeskpd))
        except Exception as e:
            print(f"Gagal fetch sasaran {kodeskpd}: {e}")


async def fetch_indikator_sasaran(client: httpx.AsyncClient):
    m_list = get_sasaran_list()
    print(f"MULAI FETCH  INDIKATOR SASARAN UNTUK {len(m_list)} SASARAN")

    X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_sasaran&f=datatable_indikator_sasaran"

    for t in m_list:
        kodeskpd = t["kodeskpd"]
        idsasaran = t["idsasaran"]
        print(kodeskpd)
        payload = {"draw": "2", "start": "0", "length": "1000000", "idsasaran": idsasaran, "kodeskpd": kodeskpd}
        try:
            data = await post_with_retries(client, X_URL, payload)
            xdata = json.dumps(data)
            count = len(data.get("data", [])) if isinstance(data, dict) else 0
            print(f"  - Jumlah indikator sasaran: {count}")
            execute_query("CALL insert_indikator_sasaran(%s, %s, %s);", (xdata, kodeskpd, idsasaran))
        except Exception as e:
            print(f"Gagal fetch indikator sasaran {kodeskpd}:{idsasaran}: {e}")


async def fetch_program(client: httpx.AsyncClient):
    m_list = get_subopd_list()
    print(f"MULAI FETCH  PROGRAM UNTUK {len(m_list)} OPD")

    X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable"

    for t in m_list:
        kodeskpd = t["kode_skpd"]
        print(kodeskpd)
        payload = {"draw": "2", "start": "0", "length": "100000", "kodeskpd": kodeskpd}
        try:
            data = await post_with_retries(client, X_URL, payload)
            xdata = json.dumps(data)
            count = len(data.get("data", [])) if isinstance(data, dict) else 0
            print(f"  - Jumlah Program: {count}")
            execute_query("CALL insert_program(%s, %s);", (xdata, kodeskpd))
        except Exception as e:
            print(f"Gagal fetch program {kodeskpd}: {e}")


async def fetch_indikator_program(client: httpx.AsyncClient):
    m_list = get_program_list()
    print(f"MULAI FETCH  INDIKATOR PROGRAM UNTUK {len(m_list)} PROGRAM")

    X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable_indikator_outcome_perangkat_daerah"

    for t in m_list:
        kodeskpd = t["kodeskpd"]
        idoutcome = t["idoutcome"]
        kodeprogram = t["kodeprogram"]
        print(kodeskpd)
        payload = {"draw": "2", "start": "0", "length": "100000", "kodeskpd": kodeskpd, "idoutcome": idoutcome, "kodeprogram": kodeprogram}
        try:
            data = await post_with_retries(client, X_URL, payload)
            xdata = json.dumps(data)
            count = len(data.get("data", [])) if isinstance(data, dict) else 0
            print(f"  - Jumlah indikator program: {count}")
            execute_query("CALL insert_indikator_program(%s, %s, %s, %s);", (xdata, kodeskpd, idoutcome, kodeprogram))
        except Exception as e:
            print(f"Gagal fetch indikator program {kodeskpd}:{idoutcome}:{kodeprogram}: {e}")


async def fetch_kegiatan(client: httpx.AsyncClient):
    m_list = get_program_list()
    print(f"MULAI FETCH  KEGIATAN UNTUK {len(m_list)} PROGRAM")

    X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable_kegiatan"

    for t in m_list:
        kodeskpd = t["kodeskpd"]
        idoutcome = t["idoutcome"]
        kodeprogram = t["kodeprogram"]
        # kodebidang might be missing in some rows; use get
        kodebidang = t.get("kodebidang")

        print(kodeskpd, idoutcome, kodeprogram, kodebidang)
        payload = {"draw": "2", "start": "0", "length": "100000", "kodeskpd": kodeskpd, "idoutcome": idoutcome, "kodeprogram": kodeprogram, "kodebidang": kodebidang}
        try:
            data = await post_with_retries(client, X_URL, payload)
            xdata = json.dumps(data)
            count = len(data.get("data", [])) if isinstance(data, dict) else 0
            print(f"  - Jumlah Kegiatan: {count}")
            execute_query("CALL insert_kegiatan(%s, %s, %s, %s, %s);", (xdata, kodeskpd, idoutcome, kodeprogram, kodebidang))
        except Exception as e:
            print(f"Gagal fetch kegiatan {kodeskpd}:{kodeprogram}: {e}")


async def fetch_kegiatan_output(client: httpx.AsyncClient):
    m_list = get_kegiatan_list()
    print(f"MULAI FETCH  OUTPUT KEGIATAN UNTUK {len(m_list)} KEGIATAN")

    X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable_output"

    for t in m_list:
        # t is a DictRow from cursor_factory=DictCursor
        kodeskpd = t["kodeskpd"]
        kodeprogram = t["kodeprogram"]
        kodekegiatan = t["kodekegiatan"]
        idoutcome = t["idoutcome"]
        kodebidang = t["kodebidang"]

        print(kodeskpd)
        payload = {"draw": "2", "start": "0", "length": "100000", "kodeskpd": kodeskpd, "idoutcome": idoutcome, "kodeprogram": kodeprogram, "kodebidang": kodebidang, "kodekegiatan": kodekegiatan}
        try:
            data = await post_with_retries(client, X_URL, payload)
            xdata = json.dumps(data)
            count = len(data.get("data", [])) if isinstance(data, dict) else 0
            print(f"  - Jumlah Output Kegiatan: {count}")
            execute_query("CALL insert_kegiatan_output(%s, %s, %s, %s, %s, %s);", (xdata, kodeskpd, idoutcome, kodeprogram, kodebidang, kodekegiatan))
        except Exception as e:
            print(f"Gagal fetch output kegiatan {kodeskpd}:{kodeprogram}:{kodekegiatan}: {e}")


async def fetch_subkegiatan(client: httpx.AsyncClient):
    m_list = get_kegiatan_output_list()
    print(f"MULAI FETCH  SUB KEGIATAN UNTUK {len(m_list)} KEGIATAN")

    X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable_subkegiatan"

    #for t in m_list:
    for i, t in enumerate(m_list, start=1):
        # t is DictRow
        print(i, t["kodeskpd"], t["kodekegiatan"])

        payload = {"draw": "2", "start": "0", "length": "100000", "kodeskpd": t["kodeskpd"], "idoutcome": t["idoutcome"], "kodeprogram": t["kodeprogram"], "kodebidang": t["kodebidang"], "kodekegiatan": t["kodekegiatan"], "idoutput": t["id"]}
        try:
            data = await post_with_retries(client, X_URL, payload)
            xdata = json.dumps(data)
            count = len(data.get("data", [])) if isinstance(data, dict) else 0
            print(f"  - Jumlah Subkegiatan: {count}")
            execute_query("CALL insert_subkegiatan(%s, %s, %s, %s, %s, %s, %s);", (xdata, t["kodeskpd"], t["idoutcome"], t["kodeprogram"], t["kodebidang"], t["kodekegiatan"], t["id"]))
        except Exception as e:
            print(f"Gagal fetch subkegiatan {t}: {e}")



async def fetch_sasaran_program(client: httpx.AsyncClient):
    m_list = get_program_list()
    print(f"MULAI FETCH  SASARAN UNTUK {len(m_list)} PROGRAM")
    
    X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable_sasaran"

    for t in m_list:
        kodeskpd = t["kodeskpd"]
        idsasaran = t["renstra_sasaran"]
        kodeprogram = t["kodeprogram"]
        print(kodeskpd,idsasaran)
        payload = {"draw": "2", "start": "0", "length": "100000", "kodeskpd": kodeskpd, "idsasaran": idsasaran}
        try:
            data = await post_with_retries(client, X_URL, payload)
            xdata = json.dumps(data)
            count = len(data.get("data", [])) if isinstance(data, dict) else 0
            print(f"  - Jumlah sasaran program: {count}")
            execute_query("CALL insert_sasaran_program(%s, %s, %s);", (xdata, kodeskpd, kodeprogram))
        except Exception as e:
            print(f"Gagal fetch indikator program {kodeskpd}:{idoutcome}:{kodeprogram}: {e}")

# ---------------------------
# Main CLI
# ---------------------------

def print_menu():
    print("\n=== MENU UTAMA ===")
    print("1. Tujuan")
    print("2. Indikator Tujuan")
    print("3. Sasaran")
    print("4. Indikator Sasaran")
    print("5. Program")
    print("6. Indikator Program")
    print("7. Kegiatan")
    print("8. Indikator Kegiatan")
    print("9. Sub Kegiatan")
    print("10. Program > Sasaran")
    print("11. Update Renstra (All)")
    print("0. Keluar")


async def run_task(task_id: str):
    # create one shared client per run; use connection limits
    limits = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
    async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=limits) as client:
        if task_id == "1":
            await fetch_tujuan(client)
        elif task_id == "2":
            await fetch_indikator_tujuan(client)
        elif task_id == "3":
            await fetch_sasaran(client)
        elif task_id == "4":
            await fetch_indikator_sasaran(client)
        elif task_id == "5":
            await fetch_program(client)
        elif task_id == "6":
            await fetch_indikator_program(client)
        elif task_id == "7":
            await fetch_kegiatan(client)
        elif task_id == "8":
            await fetch_kegiatan_output(client)
        elif task_id == "9":
            await fetch_subkegiatan(client)
        elif task_id == "10":
            await fetch_sasaran_program(client)
        elif task_id == "11":
            # run them all sequentially
            await fetch_tujuan(client)
            await fetch_indikator_tujuan(client)
            await fetch_sasaran(client)
            await fetch_indikator_sasaran(client)
            await fetch_program(client)
            await fetch_indikator_program(client)
            await fetch_kegiatan(client)
            await fetch_kegiatan_output(client)
            await fetch_subkegiatan(client)


def main():
    config = load_config()

    current_sessionid = config["WEBSESSION"].get("sessionid", "")
    current_token = config["WEBSESSION"].get("token", "")

    print("=== SINKRONISASI RENSTRA SIPD DAN LOKAL DATABASE ===")
    print(f"SESSION ID saat ini   : {current_sessionid}")
    print(f"TOKEN saat ini : {current_token}")

    print("(Tekan ENTER untuk tidak mengubah)")
    SESSION_ID = input("Masukkan Session ID   : ").strip()
    TOKEN = input("Masukkan Token : ").strip()

    if SESSION_ID != "":
        config["WEBSESSION"]["sessionid"] = SESSION_ID

    if TOKEN != "":
        config["WEBSESSION"]["token"] = TOKEN

    save_config(config)
    print("\n✔ Data berhasil disimpan ke config.ini")


    while True:
        print_menu()
        pilihan = input("Pilih menu (0-10): ")

        if pilihan == "0":
            print("Keluar dari program. Terima kasih!")
            # close pool
            try:
                db_pool.closeall()
            except Exception:
                pass
            break

        if pilihan in {str(i) for i in range(1, 11)}:
            try:
                asyncio.run(run_task(pilihan))
            except KeyboardInterrupt:
                print("Dibatalkan oleh user")
            except Exception as e:
                print("Terjadi error saat menjalankan tugas:", e)
        else:
            print("Pilihan tidak valid, silakan coba lagi.")


if __name__ == "__main__":
    main()
