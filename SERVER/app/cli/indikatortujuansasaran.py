import requests

import pycurl
import io
import json
import psycopg
from urllib.parse import urlencode


def curl_request(
    url: str,
    method: str = "GET",
    post_data: dict = None,
    headers: dict = None
):
  
    buffer = io.BytesIO()
    c = pycurl.Curl()
    c.setopt(pycurl.URL, url)   
    c.setopt(pycurl.HTTPHEADER, headers)
    c.setopt(pycurl.WRITEDATA, buffer)
    c.setopt(pycurl.FOLLOWLOCATION, True)
    c.setopt(pycurl.ENCODING, "gzip, deflate, br")  
    c.setopt(pycurl.SSL_VERIFYPEER, 0)
    c.setopt(pycurl.SSL_VERIFYHOST, 0)


    if method.upper() == "POST":
        c.setopt(pycurl.POST, 1)
        if post_data:
            c.setopt(pycurl.POSTFIELDS, post_data)
    elif method.upper() == "GET":
        if post_data:
            # Tambahkan query string ke URL
            query_string = urlencode(data)
            c.setopt(pycurl.URL, f"{url}?{query_string}".encode('utf-8'))
    else:
        raise ValueError("Method harus 'GET' atau 'POST'")

    try:
        c.perform()
        status_code = c.getinfo(pycurl.RESPONSE_CODE)
    finally:
        c.close()

    response_body = buffer.getvalue().decode('utf-8')

    if status_code != 200:
        raise Exception(f"Request failed with status {status_code}: {response_body}")

    # Return JSON kalau valid, jika tidak return raw text
    try:
        return json.loads(response_body)
    except json.JSONDecodeError:
        return response_body




conn = psycopg.connect(
            dbname="dalev_kota_tegal_2026",
            user="monevrkpd",
            password="heriprihanto140286",
            host="192.168.50.75",
            port="5432"
        )
cur = conn.cursor()

urltoken = "6fc85b536e8df82c5497732635477026eea59bfb"
cookie = "pemda=%7B%22domain%22%3A%22tegal.sipd.kemendagri.go.id%22%2C%22nama%22%3A%22KOTA+TEGAL%22%7D; PHPSESSID=cgrrbfe68rpo96732054t7sj4n"

headers = [
            "User-Agent:Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0",
            "Accept:application/json, text/javascript, */*; q=0.01",
            "Accept-Language:en-US,en;q=0.5",
            "Accept-Encoding:gzip, deflate, br",
            "Referer:https://sipd-ri.kemendagri.go.id/",
            "Content-Type:application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With:XMLHttpRequest",
            "Origin:https://sipd-ri.kemendagri.go.id",
            "Connection:keep-alive",
            "Cookie:pemda=%7B%22domain%22%3A%22tegal.sipd.kemendagri.go.id%22%2C%22nama%22%3A%22KOTA+TEGAL%22%7D; _ga_MM393X9LG5=GS2.1.s1760415485$o1$g1$t1760415503$j42$l0$h0; _ga=GA1.1.1039358289.1760415486; PHPSESSID=qqbrm2hv7qt00jsocvej1gp8qv",
            "Sec-Fetch-Dest:empty",
            "Sec-Fetch-Mode:cors",
            "Sec-Fetch-Site:same-origin",
            "TE:trailers"
        ]


cur.execute("SELECT idtujuan,kodeskpd FROM renja_tujuan by idtujuan;")
tujuanresult = cur.fetchall()

for tjn in tujuanresult:
    print(tjn[1])
    
    # UPDATE TUJUAN OPD
    
        
    urltujuan = f"https://sipd-ri.kemendagri.go.id/renstra/{urltoken}/?m=daerah_renstra_d_rakhir_tujuan&f=datatable_indikator_tujuan"

    params_tujuan = (
        f"draw=1&idtujuan={tjn[0]}&kodeskpd={tjn[1]}"
    )

    response_tujuan = curl_request(urltujuan, method="POST", post_data=params_tujuan, headers=headers) #buffer.getvalue().decode('utf-8')
    
    data_tujuan = response_tujuan["data"]
    print(response_tujuan)

    insert_query = """
        INSERT INTO indikator_sipd (
        id, kodepemda, idperiode, idparent, id_indikator, uraian, status, satuan,
        target_awal, target1, target2, target3, target4, target5, target6, target7, target0,
        creator, updater, postdate, lastupdate, pilihan_input, tipe_data, kodeindikator_master,
        dssd, sumber, master_aspek, iku, ikd, uraiaspek, aspek, kodeskpd, kodebidang_ikk,
        uraibidang_ikk, urut, total_catatan, no, lvl
    )
    VALUES (
        %(id)s, %(kodepemda)s, %(idperiode)s, %(idparent)s, %(id_indikator)s, %(uraian)s, %(status)s, %(satuan)s,
        %(target_awal)s, %(target1)s, %(target2)s, %(target3)s, %(target4)s, %(target5)s, %(target6)s, %(target7)s, %(target0)s,
        %(creator)s, %(updater)s, %(postdate)s, %(lastupdate)s, %(pilihan_input)s, %(tipe_data)s, %(kodeindikator_master)s,
        %(dssd)s, %(sumber)s, %(master_aspek)s, %(iku)s, %(ikd)s, %(uraiaspek)s, %(aspek)s, %(kodeskpd)s, %(kodebidang_ikk)s,
        %(uraibidang_ikk)s, %(urut)s, %(total_catatan)s, %(no)s, %(lvl)s
    );
    """
    datatj = {
        'kodepemda': '3376',
        'idperiode': 2025,
        'idparent': None,
        'id_indikator': 'IK001',
        'uraian': 'Persentase pelayanan publik',
        'status': 1,
        'satuan': '%',
        'target_awal': 80,
        'target1': 82,
        'target2': 84,
        'target3': 85,
        'target4': 86,
        'target5': 87,
        'target6': None,
        'target7': None,
        'target0': None,
        'creator': 'admin',
        'updater': None,
        'postdate': '2025-10-29 09:00:00',
        'lastupdate': None,
        'pilihan_input': 'manual',
        'tipe_data': 'numeric',
        'kodeindikator_master': 'M001',
        'dssd': None,
        'sumber': 'BPS',
        'master_aspek': 'Pelayanan',
        'iku': True,
        'ikd': False,
        'uraiaspek': 'Kualitas Layanan',
        'aspek': 'Efisiensi',
        'kodeskpd': '01',
        'kodebidang_ikk': 'IKK01',
        'uraibidang_ikk': 'Kinerja Bidang A',
        'urut': 1,
        'total_catatan': 0,
        'no': 1,
        'lvl': 1
    }

    for row in data_tujuan:
        cur.execute(insert_query, row)