import psycopg
import requests
import collections
import urllib
import pycurl
import io



def http_build_query(data):
    dct = collections.OrderedDict()
    for key, value in data.iteritems():
        if isinstance(value, basestring):
            dct[key] = value
        elif isinstance(value, list):
            for index, v in enumerate(value):
                dct['{0}[{1}]'.format(key, index)] = v
    return urllib.urlencode(dct)

def build_query(params, prefix=''):
    pairs = []
    for key, value in params.items():
        if isinstance(value, dict):
            pairs.append(build_query(value, f"{prefix}{key}." if prefix else f"{key}."))
        elif isinstance(value, list):
            for idx, item in enumerate(value):
                pairs.append(build_query({f"{key}[{idx}]": item}, prefix))
        else:
            full_key = f"{prefix}{key}" if prefix else key
            pairs.append((full_key, value))
    return urllib.parse.urlencode(pairs)

def fetch_data_renstra():
    url = "https://sipd-ri.kemendagri.go.id/rpjmd/310020edb8f20176b20c997aae5388bf91c93343/?m=daerah_renstra_d_rakhir_sasaran"

    '''
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": "https://sipd-ri.kemendagri.go.id/",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Origin": "https://sipd-ri.kemendagri.go.id",
        "Connection": "keep-alive",
        "Cookie": "pemda=%7B%22domain%22%3A%22tegal.sipd.kemendagri.go.id%22%2C%22nama%22%3A%22KOTA+TEGAL%22%7D; PHPSESSID=cgrrbfe68rpo96732054t7sj4n",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "TE": "trailers"
    }

    data = {
        "draw": "1",
        "columns[0][data]": "no",
        "columns[0][name]": "no",
        "columns[0][searchable]": "false",
        "columns[0][orderable]": "false",
        "columns[0][search][value]": "",
        "columns[0][search][regex]": "false",
        "columns[1][data]": "uraisasaran",
        "columns[1][name]": "uraisasaran",
        "columns[1][searchable]": "true",
        "columns[1][orderable]": "true",
        "columns[1][search][value]": "",
        "columns[1][search][regex]": "false",
        "columns[2][data]": "",
        "columns[2][name]": "",
        "columns[2][searchable]": "false",
        "columns[2][orderable]": "false",
        "columns[2][search][value]": "",
        "columns[2][search][regex]": "false",
        "start": "0",
        "length": "10",
        "search[value]": "",
        "search[regex]": "false",
        "kodeskpd": "5.01.5.05.0.00.01.0000"
    }
    '''
    
    headers = [
        "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0",
        "Accept: application/json, text/javascript, */*; q=0.01",
        "Accept-Language: en-US,en;q=0.5",
        "Accept-Encoding: gzip, deflate, br",
        "Referer: https://sipd-ri.kemendagri.go.id/",
        "Content-Type: application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With: XMLHttpRequest",
        "Origin: https://sipd-ri.kemendagri.go.id",
        "Connection: keep-alive",
        "Cookie: pemda=%7B%22domain%22%3A%22tegal.sipd.kemendagri.go.id%22%2C%22nama%22%3A%22KOTA+TEGAL%22%7D; PHPSESSID=cgrrbfe68rpo96732054t7sj4n",
        "Sec-Fetch-Dest: empty",
        "Sec-Fetch-Mode: cors",
        "Sec-Fetch-Site: same-origin",
        "TE: trailers",
    ]

    post_data = (
        "draw=1"
        "&columns[0][data]=no"
        "&columns[0][name]=no"
        "&columns[0][searchable]=false"
        "&columns[0][orderable]=false"
        "&columns[0][search][value]="
        "&columns[0][search][regex]=false"
        "&columns[1][data]=uraisasaran"
        "&columns[1][name]=uraisasaran"
        "&columns[1][searchable]=true"
        "&columns[1][orderable]=true"
        "&columns[1][search][value]="
        "&columns[1][search][regex]=false"
        "&columns[2][data]="
        "&columns[2][name]="
        "&columns[2][searchable]=false"
        "&columns[2][orderable]=false"
        "&columns[2][search][value]="
        "&columns[2][search][regex]=false"
        "&start=0"
        "&length=10"
        "&search[value]="
        "&search[regex]=false"
        "&kodeskpd=5.01.5.05.0.00.01.0000"
    )

    '''
    response = requests.post(url, headers=headers, data=data)

    # Print response as JSON (if it's JSON)
    try:
        print(response.json())
    except ValueError:
        print(response.text)
    '''
    buffer = io.BytesIO()

    # Inisialisasi Curl
    c = pycurl.Curl()
    c.setopt(pycurl.URL, url)
    c.setopt(pycurl.POST, 1)
    c.setopt(pycurl.POSTFIELDS, post_data)
    c.setopt(pycurl.HTTPHEADER, headers)
    c.setopt(pycurl.WRITEDATA, buffer)
    c.setopt(pycurl.FOLLOWLOCATION, True)
    c.setopt(pycurl.ENCODING, "gzip, deflate, br")  # support compressed response

    try:
        c.perform()
        status_code = c.getinfo(pycurl.RESPONSE_CODE)
        print(f"HTTP Status Code: {status_code}")
    except pycurl.error as e:
        print(f"Request error: {e}")
    finally:
        c.close()

    # Ambil isi response
    response_body = buffer.getvalue().decode('utf-8')
    #print("Response body:")
    print(response_body)


if __name__ == "__main__":
    fetch_data_renstra()
