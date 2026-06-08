from core.http import post_with_retry
from core.db import call_proc
from core.config import WEB
import json

TOKEN = WEB.get("token")
BASE = WEB.get("origin")

async def fetch_indikator_tujuan_for_item(t):
    url = f"{BASE}/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_tujuan&f=datatable_indikator_tujuan"
    payload = {"draw": "2", "start": "0", "length": "10000000000000", "idtujuan": t["idtujuan"], "kodeskpd": t["kodeskpd"]}
    j = await post_with_retry(url, payload)
    xdata = json.dumps(j)
    await call_proc("insert_indikator_tujuan", (xdata, t["kodeskpd"], t["idtujuan"]))
    return len(j.get("data", []))

async def run(get_tujuan_list):
    items = get_tujuan_list()
    results = []
    for t in items:
        try:
            n = await fetch_indikator_tujuan_for_item(t)
            results.append((True, t, n))
        except Exception as e:
            results.append((False, t, str(e)))
    return results
