from core.http import post_with_retry
from core.db import call_proc
from core.config import WEB
import json

TOKEN = WEB.get("token")
BASE = WEB.get("origin")

async def fetch_indikator_program_for_item(p):
    url = f"{BASE}/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_manprokeg_beta&f=datatable"
    payload = {"draw": "2", "start": "0", "length": "100000", "kodeskpd": p["kodeskpd"], "idoutcome": p["idoutcome"], "kodeprogram": p["kodeprogram"]}
    j = await post_with_retry(url, payload)
    xdata = json.dumps(j)
    await call_proc("insert_indikator_program", (xdata, p["kodeskpd"], p["idoutcome"], p["kodeprogram"]))
    return len(j.get("data", []))

async def run(get_program_list):
    items = get_program_list()
    results = []
    for p in items:
        try:
            n = await fetch_indikator_program_for_item(p)
            results.append((True, p, n))
        except Exception as e:
            results.append((False, p, str(e)))
    return results
