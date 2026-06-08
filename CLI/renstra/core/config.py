import configparser
import os

CONFIG_FILE = os.environ.get("RENSTRA_CONFIG", "config.ini")

def load_config():
    cfg = configparser.ConfigParser()
    if not os.path.exists(CONFIG_FILE):
        raise FileNotFoundError(f"Config file not found: {CONFIG_FILE}. Copy config.ini.example -> {CONFIG_FILE} and edit.")
    cfg.read(CONFIG_FILE)
    return cfg

config = load_config()

# Convenience lookups
DB = {
    "dbname": config.get("DB", "dbname", fallback=None),
    "user": config.get("DB", "user", fallback=None),
    "password": config.get("DB", "password", fallback=None),
    "host": config.get("DB", "host", fallback=None),
    "port": config.getint("DB", "port", fallback=5432),
}

WEB = {
    "token": config.get("WEBSESSION", "token", fallback=""),
    "sessionid": config.get("WEBSESSION", "sessionid", fallback=""),
    "origin": config.get("WEBSESSION", "origin", fallback="https://sipd-ri.kemendagri.go.id")
}

CONCURRENCY = config.getint("APP", "concurrency", fallback=5)
MAX_RETRIES = config.getint("APP", "max_retries", fallback=3)
TIMEOUT = config.getfloat("APP", "timeout_seconds", fallback=30.0)
