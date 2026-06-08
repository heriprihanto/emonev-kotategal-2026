import asyncio
import json
import httpx
from playwright.async_api import async_playwright
from config_db import get_conn, put_conn
import time


tahun = 2026
username = "admin.kotategal2"
password = "TegalBahari2022@)@@"
id_daerah = 70

is_anggaran = 1

login_url = "https://sipd-ri.kemendagri.go.id/api/auth/auth/login"
params = {"username": username, "password": password, "id_daerah": id_daerah}
configsipd = {"id_daerah": id_daerah, "tahun": tahun}
auth_key = "v8.0.38-authf649fc9a5f55"

js_fetch = """
            async (params) => {
                const { ptahun, pid_daerah, pid_sub_pd, pis_anggaran } = params;
                const formData = new FormData();
                const data = {
                    tahun: ptahun,
                    id_daerah: 70,
                    id_unit:  pid_sub_pd,
                    is_prop: 0,
                    is_anggaran: 1
                };

                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        formData.append(key, data[key]);
                    }
                }

                const resp = await fetch("https://sipd-ri.kemendagri.go.id/api/renja/sub_bl/list_belanja_by_tahun_daerah_unit", {
                    method: "POST",
                    headers: xHeader,
                    body: formData
                });

                return await resp.json();
            }
        """

def get_opd_list():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id_sub_pd, nama_pd FROM ta_opd ORDER BY kode  limit 1")
    rows = cur.fetchall()
    put_conn(conn)
    return rows

async def main():
    async with httpx.AsyncClient() as client:
        resp = await client.post(login_url, data=params)
        token_data = resp.json()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True,
        args=[
                "--disable-gpu",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--ignore-certificate-errors",
                "--allow-running-insecure-content",
                "--window-size=1920,1080"
            ])
        context = await browser.new_context(user_agent="Mozilla/5.0 (X11; Linux x86_64)")
        page = await context.new_page()

        await page.goto("https://sipd-ri.kemendagri.go.id", wait_until="networkidle")

        # Set localStorage
        await page.evaluate("""
            ({params, token_data, tahun, configsipd, auth_key}) => {
                window.localStorage.setItem('login-detail', JSON.stringify(params));
                window.localStorage.setItem(auth_key, JSON.stringify(token_data));
                window.localStorage.setItem('sipd-konfigurasi-tahun', tahun);
                window.localStorage.setItem('sipd-konfigurasi', JSON.stringify(configsipd));
            }
        """, {
            "params": params,
            "token_data": token_data,
            "tahun": tahun,
            "configsipd": configsipd,
            "auth_key": auth_key
        })

        await page.reload()

        with open("crypto-js.min.js", "r") as f:
            await page.add_script_tag(content=f.read())

        with open("sipdri.js", "r") as f:
            await page.add_script_tag(content=f.read())
        
        opd_list = get_opd_list()

        for id_sub_pd, nama_pd in opd_list:
            print(f"{id_sub_pd} - {nama_pd}")
            #result_text = await page.evaluate(js_fetch, {"ptahun":2026, "pid_daerah":70, "pid_sub_pd": 900, "pis_anggaran":1})
            #result_text = await page.evaluate("return _token.token;")
            result_text = await page.evaluate(js_fetch, {"ptahun":tahun, "pid_daerah":70, "pid_sub_pd": id_sub_pd, "pis_anggaran":1})
            print(result_text)

        await browser.close()
        #time.sleep(200) 

asyncio.run(main())
