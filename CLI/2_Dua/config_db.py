from psycopg2.pool import SimpleConnectionPool
import configparser
import os

TOKEN = "52cbc6339a806763ee406976e3edd448b1a1c307"
SESSION_ID = "gr23b58v11805majg3gkv9kqcd"

DB_POOL = SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    host="192.168.50.75",
    port=5432,
    database="renstra",
    user="monevrkpd",
    password="heriprihanto140286"
)

def get_conn():
    return DB_POOL.getconn()

def put_conn(conn):
    DB_POOL.putconn(conn)

import psycopg2

# ==========================
# KONFIGURASI DATABASE
# ==========================

def get_db():
    return psycopg2.connect(
        host="localhost",
        port=5432,
        dbname="sipd",
        user="postgres",
        password="postgres"
    )

# ==========================
# KONFIGURASI SIPD
# ==========================

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

CONCURRENCY_LIMIT = 5
MAX_RETRIES = 3

def get_db_config():
    return {
        "dbname": "renstra",
        "user": "monevrkpd",
        "password": "heriprihanto140286",
        "host": "192.168.50.75",
        "port": 5432
    }
