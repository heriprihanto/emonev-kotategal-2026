
from typing import Any, Annotated
import datetime


import logging
import json



from selenium import webdriver
from selenium.common.exceptions import TimeoutException

import time
import requests
import json

tahun = 2024
username = "admin.kotategal2"
#username = "tapd.bappeda"
password = "TegalBahari2022@)@@"
url = 'https://sipd-ri.kemendagri.go.id/api/auth/auth/login'
params = {"username": username,
"password": password,
"id_daerah": 70}
configsipd ={"id_daerah":70,"tahun":tahun}
response = requests.post(url, data=params)
rdata = response.json()
yresp = json.dumps(rdata)

auth_key = 'v8.0.38-authf649fc9a5f55'
auth_key2 ='v0.0.0-authf649fc9a5f55'


options = webdriver.ChromeOptions()


options.add_argument('--disable-gpu')
options.add_argument('--headless')
options.add_argument('--window-size=1920,1080')
options.add_argument('--no-sandbox')
options.add_argument('--start-maximized')
options.add_argument('--disable-setuid-sandbox')


options.add_argument('--disable-dev-shm-usage')
options.add_argument('--ignore-certificate-errors')
options.add_argument('--allow-running-insecure-content')

user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36'
options.add_argument(f'user-agent={user_agent}')


#driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver = webdriver.Chrome(options=options)
driver.get("https://sipd-ri.kemendagri.go.id")

driver.execute_script(f"window.localStorage.setItem('login-detail', '{json.dumps(params)}');")
driver.execute_script(f"window.localStorage.setItem('{auth_key}', '{json.dumps(response.json())}');")
driver.execute_script(f"window.localStorage.setItem('sipd-konfigurasi-tahun', {tahun});")
driver.execute_script(f"window.localStorage.setItem('sipd-konfigurasi', '{json.dumps(configsipd)}');") 
time.sleep(5)
driver.refresh()


locasto = driver.execute_script("return window.localStorage")


filejs1 = open("crypto-js.min.js", "r")
cryptojs = filejs1.read()
driver.execute_script(cryptojs)
filejs1.close()

filejs2 = open("sipdri.js", "r")
sipdri = filejs2.read()
#driver.execute_script(sipdri)
filejs2.close()


respx = driver.execute_async_script(
        sipdri +
        """
        let callback = arguments[0];
        const formData = new FormData();
        formData.append("id_daerah", 70);
        formData.append("tahun", 2026);
        formData.append("deleted_data", true);
        formData.append("order[0][column]", 0);
        formData.append("order[0][dir]", "asc");
        formData.append("search[value]", "");
        formData.append("length", 1000000000000);
        formData.append("start", 0);
        
                                      
        fetch("https://sipd-ri.kemendagri.go.id/api/master/akun/listNew", {method: "POST",headers: xHeader,
                body: formData                           
        }).then(r => r.text()).then(callback)""")
    
    #print()
#print(json.loads(respx))
print(respx)