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
    c.setopt(pycurl.ENCODING, "gzip, deflate, br")  # support compressed response
    c.setopt(pycurl.SSL_VERIFYPEER, 0)
    c.setopt(pycurl.SSL_VERIFYHOST, 0)


    # Method GET / POST
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

urltoken = "310020edb8f20176b20c997aae5388bf91c93343"
cookie = "pemda=%7B%22domain%22%3A%22tegal.sipd.kemendagri.go.id%22%2C%22nama%22%3A%22KOTA+TEGAL%22%7D; PHPSESSID=cgrrbfe68rpo96732054t7sj4n"

# URL tujuan
url = f"https://sipd-ri.kemendagri.go.id/rpjmd/{urltoken}/?m=daerah_renstra_d_rakhir_sasaran"

# Header yang sama seperti di cURL
headers = [
    'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
    'Accept: application/json, text/javascript, */*; q=0.01',
    'Accept-Language: en-US,en;q=0.5',
    'Accept-Encoding: gzip, deflate, br',
    'Referer: https://sipd-ri.kemendagri.go.id/',
    'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With: XMLHttpRequest',
    'Origin: https://sipd-ri.kemendagri.go.id',
    'Connection: keep-alive',
    'Cookie: '+cookie,
    'Sec-Fetch-Dest: empty',
    'Sec-Fetch-Mode: cors',
    'Sec-Fetch-Site: same-origin',
    'TE: trailers'
]


cur.execute("SELECT * FROM ta_opd where is_pd=1 order by kode;")
opdresult = cur.fetchall()

for opd in opdresult:
    print(opd[2])
    
    # UPDATE TUJUAN OPD
    urltujuan = f"https://sipd-ri.kemendagri.go.id/rpjmd/{urltoken}/?m=daerah_renstra_d_rakhir_tujuan"

    params_tujuan = (
        f"draw=1&kodeskpd={opd[2]}"
    )

    response_tujuan = curl_request(urltujuan, method="POST", post_data=params_tujuan, headers=headers) #buffer.getvalue().decode('utf-8')
    
    data_tujuan = response_tujuan["data"]
    print(response_tujuan)

    insert_query = """
        INSERT INTO renja_tujuan (
            idtujuan,
            kodepemda,
            idperiode,
            tahun,
            kodeskpd,
            nomor,
            uraitujuan
        )
        VALUES (  %(idtujuan)s, %(kodepemda)s, %(idperiode)s,2026, %(kodeskpd)s,%(no)s, %(uraitujuan)s)
        ;
    """

    # --- 5. Loop data & insert ---
    for row in data_tujuan:
        cur.execute(insert_query, row)


# UPDATE SASARAN OPD
    urlsasaran = f"https://sipd-ri.kemendagri.go.id/rpjmd/{urltoken}/?m=daerah_renstra_d_rakhir_sasaran"

    params_sasaran = (
        f"draw=1&kodeskpd={opd[2]}"
    )
    
    response_sasaran = curl_request(urlsasaran, method="POST", post_data=params_sasaran, headers=headers) #buffer.getvalue().decode('utf-8')
    
    data_sasaran = response_sasaran["data"]
    print(response_sasaran)

    insert_query_sasaran = """
        INSERT INTO renja_sasaran (
            idsasaran,
            idtujuan,
            kodepemda,
            idperiode,
            tahun,
            kodeskpd,
            nomor,
            uraisasaran
        )
        VALUES ( %(idsasaran)s, %(idtujuan)s, %(kodepemda)s, %(idperiode)s,2026, %(kodeskpd)s,%(no)s, %(uraisasaran)s)
        ;
    """

    # --- 5. Loop data & insert ---
    for rowx in data_sasaran:
        cur.execute(insert_query_sasaran, rowx)

conn.commit()
cur.close()
conn.close()
