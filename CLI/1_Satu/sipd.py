from typing import Any
import datetime
import logging
import json

import httpx
from playwright.sync_api import sync_playwright


tahun = 2024
username = "admin.kotategal2"
password = "TegalBahari2022@)@@"
id_daerah = 70

auth_url = "https://sipd-ri.kemendagri.go.id/api/auth/auth/login"
params = {
    "username": username,
    "password": password,
    "id_daerah": id_daerah
}

configsipd = {"id_daerah": id_daerah, "tahun": tahun}
auth_key = "v8.0.38-authf649fc9a5f55"

# login via httpx
with httpx.Client(timeout=30) as client:
    r = client.post(auth_url, data=params)
    r.raise_for_status()
    authtoken = r.json()

# buka browser hanya untuk inject localstorage
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("https://sipd-ri.kemendagri.go.id", wait_until="domcontentloaded")

    page.evaluate(f"window.localStorage.setItem('login-detail', '{json.dumps(params)}');")
    page.evaluate(f"window.localStorage.setItem('{auth_key}', '{json.dumps(authtoken)}');")
    page.evaluate(f"window.localStorage.setItem('sipd-konfigurasi-tahun', '{tahun}');")
    page.evaluate(f"window.localStorage.setItem('sipd-konfigurasi', '{json.dumps(configsipd)}');")

    page.reload()

    with open("crypto-js.min.js", "r") as f:
        cryptojs = f.read()
        page.add_script_tag(content=cryptojs)

    # load sipdri.js
    with open("sipdri.js", "r") as f:
        sipdri = f.read()
        page.add_script_tag(content=sipdri)


    # Ambil x-access-token dan x-api-key dari localStorage
    token = page.evaluate(f"return _token.token")
    api_key = "AAAAA" #page.evaluate(f"return JSON.parse(window.localStorage.getItem('{auth_key}')).api_key")

    browser.close()

# Header API siap dipakai untuk httpx
xHeader = {
    "accept": "application/json, text/plain, */*",
    "x-access-token": token,
    "x-api-key": api_key,
    "origin": "https://sipd-ri.kemendagri.go.id",
    "referer": "https://sipd-ri.kemendagri.go.id/",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64)",
}

# Contoh pengganti execute_async_script → httpx request langsung
def get_list_tahun():
    url = "https://sipd-ri.kemendagri.go.id/api/master/tahun/list"
    data = {"tahun": tahun, "id_daerah": id_daerah}

    with httpx.Client(timeout=60) as client:
        resp = client.post(url, data=data, headers=xHeader)
        resp.raise_for_status()
        return resp.json()

print(token)
