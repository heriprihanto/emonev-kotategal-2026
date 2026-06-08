from core.http import post_with_retry
from core.config import WEB
from core.db import call_proc
import json

TOKEN = WEB.get("token")
BASE = WEB.get("origin")

async def fetch_tujuan_for_opd(opd):
    kodeskpd = opd["kode_skpd"]
    url = f"{BASE}/renstra/{TOKEN}/?m=daerah_renstra_d_rakhir_tujuan"
    payload = {"draw": "2", "start": "0", "length": "100000", "kodeskpd": kodeskpd}
    j = await post_with_retry(url, payload)
    xdata = json.dumps(j)
    await call_proc("insert_tujuan", (xdata, kodeskpd))
    return len(j.get("data", []))

async def run(get_opd_list, progress_desc="Fetch Tujuan"):
    opds = get_opd_list()
    results = []
    for opd in opds:
        try:
            n = await fetch_tujuan_for_opd(opd)
            results.append((True, opd, n))
        except Exception as e:
            results.append((False, opd, str(e)))
    return results
