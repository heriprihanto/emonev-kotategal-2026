from core.http import post_with_retry
from core.db import call_proc
from core.config import WEB
import json

TOKEN = WEB.get("token")
BASE = WEB.get("origin")

async def fetch_subkegiatan_for_row(row):
    # row: (kodeskpd,idoutcome,kodeprogram,kodebidang,kodekegiatan,idoutput)
    kodeskpd, idoutcome, kodeprogram, kodebidang, kodekegiatan, idoutput = row
    url = f"{BASE}/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable_subkegiatan"
    payload = {
        "draw": "2",
        "start": "0",
        "length": "100000",
        "kodeskpd": kodeskpd,
        "idoutcome": idoutcome,
        "kodeprogram": kodeprogram,
        "kodebidang": kodebidang,
        "kodekegiatan": kodekegiatan,
        "idoutput": idoutput
    }
    j = await post_with_retry(url, payload)
    xdata = json.dumps(j)
    await call_proc("insert_subkegiatan", (xdata, kodeskpd, idoutcome, kodeprogram, kodebidang, kodekegiatan, idoutput))
    return len(j.get("data", []))

async def run(get_kegiatan_output_list):
    rows = get_kegiatan_output_list()
    results = []
    for r in rows:
        try:
            n = await fetch_subkegiatan_for_row(r)
            results.append((True, r, n))
        except Exception as e:
            results.append((False, r, str(e)))
    return results
