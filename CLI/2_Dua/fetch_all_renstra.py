import asyncio
import httpx
import json
import psycopg2.extras
from tqdm.asyncio import tqdm
from psycopg2.extras import execute_values
from psycopg2.pool import SimpleConnectionPool
from time import sleep

import configparser
import os

def get_db_config():
    return {
        "dbname": "renstra",
        "user": "monevrkpd",
        "password": "heriprihanto140286",
        "host": "192.168.50.75",
        "port": 5432
    }

DB_CONFIG = get_db_config()

# Buat connection pool global
db_pool = SimpleConnectionPool(
    minconn=1,
    maxconn=10,  # bisa disesuaikan
    **DB_CONFIG
)

def get_conn():
    return db_pool.getconn()

def put_conn(conn):
    db_pool.putconn(conn)


CONFIG_FILE = "config.ini"


def load_config():
    config = configparser.ConfigParser()
    if os.path.exists(CONFIG_FILE):
        config.read(CONFIG_FILE)
    else:
        config["WEBSESSION"] = {"sessionid": "", "token": ""}
        with open(CONFIG_FILE, "w") as file:
            config.write(file)
    return config

config = load_config()

CONCURRENCY_LIMIT = 5
MAX_RETRIES = 3

SESSION_ID  = config["WEBSESSION"].get("sessionid", "")
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
    "pemda": '{"domain":"tegal.sipd.kemendagri.go.id","nama":"KOTA TEGAL"}'
}

def get_opd_list():
    data = execute_query("SELECT kode as kode_skpd, nama_pd as nama_skpd FROM ta_opd where is_pd=1 ORDER BY kode", fetch=True)
    return [{"kode_skpd": r[0], "nama_skpd": r[1]} for r in data]

def get_subopd_list():
    data = execute_query("SELECT kode as kode_skpd, nama_pd as nama_skpd FROM ta_opd ORDER BY kode", fetch=True)
    return [{"kode_skpd": r[0], "nama_skpd": r[1]} for r in data]


def get_tujuan_list():
    data = execute_query("SELECT idtujuan, kodeskpd FROM renstra_tujuan ORDER BY idtujuan", fetch=True)
    return [{"idtujuan": r[0], "kodeskpd": r[1]} for r in data]

def get_sasaran_list():
    data = execute_query("SELECT idsasaran, kodeskpd FROM renstra_sasaran ORDER BY kodeskpd", fetch=True)
    return [{"idsasaran": r[0], "kodeskpd": r[1]} for r in data]

def get_program_list():
    data = execute_query("SELECT id,kodeskpd,kodeprogram,kodebidang from renstra_program where id is not null ORDER BY id", fetch=True)
    return [{"idoutcome": r[0],"kodeskpd": r[1],"kodeprogram": r[2],"kodebidang": r[3] } for r in data]
            
def get_kegiatan_list():
    data = execute_query("SELECT kodeskpd,kodeprogram,kodekegiatan,idoutcome,kodebidang from renstra_kegiatan ORDER BY kodeskpd,kodeprogram,kodekegiatan", fetch=True)
    return data #[{"idoutcome": r[0],"kodeskpd": r[1],"kodeprogram": r[1] } for r in data]
           
def get_kegiatan_output_list():
    data = execute_query("SELECT kodeskpd,idoutcome,kodeprogram,kodebidang,kodekegiatan,id from renstra_output_kegiatan ORDER BY kodeskpd,kodeprogram,kodekegiatan", fetch=True)
    return data

async def fetch_tujuan():
    dataopd = get_opd_list()
    print(f"MULAI FETCH TUJUAN UNTUK {len(dataopd)} OPD")
    for opd in dataopd :
        kode_skpd = opd['kode_skpd']
        print(opd['kode_skpd'], opd['nama_skpd'])
        TUJUAN_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_tujuan"
        connector = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
        async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=connector) as client:
        
            paramstujuan = {
                "draw": "2",
                "start": "0",
                "length": "100000",
                "kodeskpd": opd['kode_skpd']
            }

            try:
                resp = await client.post(TUJUAN_URL, data=paramstujuan)
                if resp.status_code == 429:
                    sleep(2)
                    continue
                resp.raise_for_status()
                #print(resp.json()['data'])
                xdata = json.dumps(resp.json())
                print(f"  - Jumlah tujuan: {len(resp.json()['data'])}")
                execute_query(
                     "CALL insert_tujuan(%s, %s);",
                    (xdata, kode_skpd)
                )
            except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError):
                if attempt < MAX_RETRIES - 1:
                    await asyncio.sleep(1.5 * (attempt + 1))
                    continue
                else:
                    print(f"Gagal fetch {kode_skpd} setelah {MAX_RETRIES} percobaan")
                    

async def fetch_indikator_tujuan():
    tujuan_list = get_tujuan_list()
    print(f"MULAI FETCH  INDIKATOR TUJUAN UNTUK {len(tujuan_list)} TUJUAN")
    for t in tujuan_list :
        
        print(t["kodeskpd"])
        INDIKATORTUJUAN_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_tujuan&f=datatable_indikator_tujuan"
        connector = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
        async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=connector) as client:
        
            data = {
                "draw": "2",
                "start": "0",
                "length": "10000000000000",
                "idtujuan": t["idtujuan"],
                "kodeskpd": t["kodeskpd"]
            }

            try:
                resp = await client.post(INDIKATORTUJUAN_URL, data=data)
                if resp.status_code == 429:
                    sleep(2)
                    continue
                resp.raise_for_status()
                #print(resp.json()['data'])
                xdata = json.dumps(resp.json())
                print(f"  - Jumlah indikator tujuan: {len(resp.json()['data'])}")
                execute_query(
                     "CALL insert_indikator_tujuan(%s, %s, %s);",
                    (xdata, t["kodeskpd"],t["idtujuan"])
                )
            except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError):
                if attempt < MAX_RETRIES - 1:
                    await asyncio.sleep(1.5 * (attempt + 1))
                    continue
                else:
                    print(f"Gagal fetch indikator tujuan setelah {MAX_RETRIES} percobaan")


async def fetch_sasaran():
    m_list = get_opd_list()
    print(f"MULAI FETCH  SASARAN UNTUK {len(m_list)} TUJUAN")
    for t in m_list :
        
        kodeskpd = t["kode_skpd"]
        print(kodeskpd)
        
        X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_sasaran"
        connector = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
        async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=connector) as client:
        
            payload = {
                "draw": "2",
                "start": "0",
                "length": "100000",
                "kodeskpd": kodeskpd
            }

            try:
                resp = await client.post(X_URL, data=payload)
                if resp.status_code == 429:
                    sleep(2)
                    continue
                resp.raise_for_status()
                #print(resp.json()['data'])
                xdata = json.dumps(resp.json())
                print(f"  - Jumlah sasaran: {len(resp.json()['data'])}")
                execute_query(
                     "CALL insert_sasaran(%s, %s);",
                    (xdata, t["kode_skpd"])
                )
            except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError):
                if attempt < MAX_RETRIES - 1:
                    await asyncio.sleep(1.5 * (attempt + 1))
                    continue
                else:
                    print(f"Gagal fetch sasaran setelah {MAX_RETRIES} percobaan")
            

async def fetch_indikator_sasaran():
    m_list = get_sasaran_list()
    print(f"MULAI FETCH  INDIKATOR SASARAN UNTUK {len(m_list)} SASARAN")
    for t in m_list :
        
        kodeskpd = t["kodeskpd"]
        idsasaran = t["idsasaran"]

        print(kodeskpd)
        
        X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_sasaran&f=datatable_indikator_sasaran"
        connector = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
        async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=connector) as client:
        
            payload = {
                "draw": "2",
                "start": "0",
                "length": "1000000",
                "idsasaran": idsasaran,
                "kodeskpd": kodeskpd
            }

            try:
                resp = await client.post(X_URL, data=payload)
                if resp.status_code == 429:
                    sleep(2)
                    continue
                resp.raise_for_status()
                #print(resp.json()['data'])
                xdata = json.dumps(resp.json())
                print(f"  - Jumlah sasaran: {len(resp.json()['data'])}")
                execute_query(
                     "CALL insert_indikator_sasaran(%s, %s,%s);",
                    (xdata, kodeskpd, idsasaran)
                )
            except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError):
                if attempt < MAX_RETRIES - 1:
                    await asyncio.sleep(1.5 * (attempt + 1))
                    continue
                else:
                    print(f"Gagal fetch indikator program setelah {MAX_RETRIES} percobaan")


async def fetch_program():
    m_list = get_subopd_list()
    print(f"MULAI FETCH  PROGRAM UNTUK {len(m_list)} OPD")
    for t in m_list :
        
        kodeskpd = t["kode_skpd"]
        print(kodeskpd)
        
        X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable"
        connector = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
        async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=connector) as client:
        
            payload = {
                "draw": "2",
                "start": "0",
                "length": "100000",
                "kodeskpd": kodeskpd
            }

            try:
                resp = await client.post(X_URL, data=payload)
                if resp.status_code == 429:
                    sleep(2)
                    continue
                resp.raise_for_status()
                #print(resp.json()['data'])
                xdata = json.dumps(resp.json())
                print(f"  - Jumlah Program: {len(resp.json()['data'])}")
                execute_query(
                     "CALL insert_program(%s, %s);",
                    (xdata, t["kode_skpd"])
                )
            except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError):
                if attempt < MAX_RETRIES - 1:
                    await asyncio.sleep(1.5 * (attempt + 1))
                    continue
                else:
                    print(f"Gagal fetch sasaran setelah {MAX_RETRIES} percobaan")


async def fetch_indikator_program():
    m_list = get_program_list()
    print(f"MULAI FETCH  INDIKATOR PROGRAM UNTUK {len(m_list)} PROGRAM")
    for t in m_list :
        
        kodeskpd = t['kodeskpd']
        idoutcome = t['idoutcome']
        kodeprogram = t['kodeprogram']

        print(kodeskpd)
        
        X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable_indikator_outcome_perangkat_daerah"
        connector = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
        async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=connector) as client:
        
            payload = {
                 "draw": "2",
                "start": "0",
                "length": "100000",
                "kodeskpd": kodeskpd,
                "idoutcome": idoutcome,
                "kodeprogram": kodeprogram  
            }

            try:
                resp = await client.post(X_URL, data=payload)
                if resp.status_code == 429:
                    sleep(2)
                    continue
                resp.raise_for_status()
                #print(resp.json()['data'])
                xdata = json.dumps(resp.json())
                print(f"  - Jumlah Program: {len(resp.json()['data'])}")
                execute_query(
                     "CALL insert_indikator_program(%s, %s,%s,%s);",
                    (xdata, kodeskpd,idoutcome,kodeprogram)
                )
            except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError):
                if attempt < MAX_RETRIES - 1:
                    await asyncio.sleep(1.5 * (attempt + 1))
                    continue
                else:
                    print(f"Gagal fetch indikator program setelah {MAX_RETRIES} percobaan")


def fetch_kegiatan():
    m_list = get_program_list()
    print(f"MULAI FETCH  KEGIATAN UNTUK {len(m_list)} PROGRAM")
    for t in m_list :
        
        kodeskpd = t['kodeskpd']
        idoutcome = t['idoutcome']
        kodeprogram = t['kodeprogram']
        kodebidang = t['kodebidang']

        print(kodeskpd,idoutcome,kodeprogram,kodebidang)
        
        X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable_kegiatan"
        connector = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
        async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=connector) as client:
        
            payload = {
                "draw": "2",
                "start": "0",
                "length": "100000",
                "kodeskpd": kodeskpd,
                "idoutcome": idoutcome,
                "kodeprogram": kodeprogram,
                "kodebidang": kodebidang
            }

            try:
                resp = await client.post(X_URL, data=payload)
                if resp.status_code == 429:
                    sleep(2)
                    continue
                resp.raise_for_status()
                #print(resp.json()['data'])
                xdata = json.dumps(resp.json())
                print(f"  - Jumlah Kegiatan: {len(resp.json()['data'])}")
                execute_query(
                     "CALL insert_kegiatan(%s, %s,%s,%s,%s);",
                    (xdata, kodeskpd,idoutcome,kodeprogram,kodebidang)
                )
            except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError):
                if attempt < MAX_RETRIES - 1:
                    await asyncio.sleep(1.5 * (attempt + 1))
                    continue
                else:
                    print(f"Gagal fetch kegiatan setelah {MAX_RETRIES} percobaan")
        

async def fetch_kegiatan_output():
    m_list = get_kegiatan_list()
    
    print(f"MULAI FETCH  OUTPUT KEGIATAN UNTUK {len(m_list)} KEGIATAN")
    for t in m_list :
        
        kodeskpd = t[0]
        kodeprogram = t[1]
        kodekegiatan = t[2]
        idoutcome = t[3]        
        kodebidang = t[4]
        
        print(kodeskpd)
        
        X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable_output"
        connector = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
        async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=connector) as client:
        
            payload = {
                "draw": "2",
                "start": "0",
                "length": "100000",
                "kodeskpd": kodeskpd,
                "idoutcome": idoutcome,
                "kodeprogram": kodeprogram,
                "kodebidang": kodebidang,
                "kodekegiatan": kodekegiatan
            }

            try:
                resp = await client.post(X_URL, data=payload)
                if resp.status_code == 429:
                    sleep(2)
                    continue
                resp.raise_for_status()
                #print(resp.json()['data'])
                xdata = json.dumps(resp.json())
                print(f"  - Jumlah Kegiatan: {len(resp.json()['data'])}")
                execute_query(
                     "CALL insert_kegiatan_output(%s, %s,%s,%s,%s,%s);",
                    (xdata, kodeskpd,idoutcome,kodeprogram,kodebidang,kodekegiatan)
                )
            except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError):
                if attempt < MAX_RETRIES - 1:
                    await asyncio.sleep(1.5 * (attempt + 1))
                    continue
                else:
                    print(f"Gagal fetch kegiatan setelah {MAX_RETRIES} percobaan")
        
async def fetch_subkegiatan():
    m_list = get_kegiatan_output_list()
    
    print(f"MULAI FETCH  SUB KEGIATAN UNTUK {len(m_list)} KEGIATAN")
    for t in m_list :
        
        
        print(t[0])
        
        X_URL = f"https://sipd-ri.kemendagri.go.id/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable_subkegiatan"
        connector = httpx.Limits(max_connections=CONCURRENCY_LIMIT)
        async with httpx.AsyncClient(timeout=30.0, cookies=COOKIES, headers=HEADERS, limits=connector) as client:
        
            payload = {
                "draw": "2",
                "start": "0",
                "length": "100000",
                "kodeskpd": t[0],
                "idoutcome": t[1], 
                "kodeprogram": t[2],
                "kodebidang": t[3],
                "kodekegiatan": t[4],
                "idoutput": t[5]
            }

            try:
                resp = await client.post(X_URL, data=payload)
                if resp.status_code == 429:
                    sleep(2)
                    continue
                resp.raise_for_status()
                #print(resp.json()['data'])
                xdata = json.dumps(resp.json())
                print(f"  - Jumlah Kegiatan: {len(resp.json()['data'])}")
                execute_query(
                     "CALL insert_subkegiatan(%s, %s,%s,%s,%s,%s,%s);",
                    (xdata, t[0],t[1],t[2],t[3],t[4],t[5])
                )
            except (httpx.TimeoutException, httpx.RequestError, httpx.HTTPStatusError):
                if attempt < MAX_RETRIES - 1:
                    await asyncio.sleep(1.5 * (attempt + 1))
                    continue
                else:
                    print(f"Gagal fetch kegiatan setelah {MAX_RETRIES} percobaan")

def execute_query(sql, params=None, fetch=False):
    conn = None
    try:
        conn = get_conn()
        cur = conn.cursor()
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


def main():
    
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
    print("10. Update Renstra (Semua Data)")
    print("0. Keluar")

    pilihan = input("Pilih menu (0-10): ")

    while True:

        if pilihan == "1":
            fetch_tujuan()
        elif pilihan == "2":
            fetch_indikator_tujuan()
        elif pilihan == "3":
            fetch_sasaran()
        elif pilihan == "4":
            fetch_indikator_sasaran()
        elif pilihan == "5":
            fetch_program()
        elif pilihan == "6":
            fetch_indikator_program()
        elif pilihan == "7":
            fetch_kegiatan()
        elif pilihan == "8":
            fetch_kegiatan_output()
        elif pilihan == "9":
            fetch_subkegiatan()
        elif pilihan == "10":
            menu_update_all_renstra()
        elif pilihan == "0":
            print("Keluar dari program. Terima kasih!")
            break
        else:
            print("Pilihan tidak valid, silakan coba lagi.")


if __name__ == "__main__":
    main()