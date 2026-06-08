import uuid
from typing import Any, Annotated
import datetime


import logging
import json
from uuid_extensions import uuid7, uuid7str

from sqlalchemy import text,and_

from fastapi import APIRouter, HTTPException, Request,Body
from sqlmodel import SQLModel, Field,func, select
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.core.deps import CurrentUser, SessionDep
from app.core.exceptions import AuthFailedException, BadRequestException, ForbiddenException, NotFoundException
from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
from bs4 import BeautifulSoup

from pydantic import BaseModel

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()

class FormData(BaseModel):
    #kd_tahap: int | None
    f_bulan: int
    idskpd: int
    idsubunit: int
    idunit: int
    nm_opd: str
    password: str
    ptahun: int
    tgl_1: str
    tgl_2: str
    tgl_laporan: str
    tgl_range: str
    username: str


def str_to_numb(xstr:str)->float:
     nstr1= str(xstr.replace('.',''))
     nstr =  str(nstr1.replace(',','.'))
     return float(nstr)

@router.get("/test")
def update_pekerjaan_test() -> Any:
    return {"data":str_to_numb("10.235.566,00")}

@router.post("/update-realkeu")
def update_pekerjaan(*, session: SessionDep, current_user: CurrentUser,fdata : FormData) -> Any:
    #try:
        
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
        options.add_experimental_option(
            "prefs",
            {
                'profile.managed_default_content_settings.javascript':2
            }
        )
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)


        driver.get("https://smartbakeuda.tegalkota.go.id")
    
        username = driver.find_element(By.NAME, "kduser")
        username.send_keys(fdata.username)

        password = driver.find_element(By.NAME, "password")
        password.send_keys(fdata.password)

        tahun = driver.find_element(By.NAME, "tahun")
        tahun.send_keys(fdata.ptahun)

        driver.find_element(By.XPATH, "//button[@type='submit']").click()
        

        cookies = driver.get_cookies()
        for cookie in cookies:
            driver.add_cookie(cookie)

        driver.get(f"""https://smartbakeuda.tegalkota.go.id/penatausahaan/laporan-skpd/bend-pengeluaran/kendali?kd_laporan=1&tgl_laporan={fdata.tgl_laporan}&idskpd={fdata.idskpd}&tgl_range={fdata.tgl_range}&tgl_1={fdata.tgl_1}&tgl_2={fdata.tgl_2}&idunit={fdata.idunit}&idsubunit={fdata.idsubunit}&footer=z""")

        elem = driver.find_element(By.ID, "table-laporan").get_attribute("outerHTML")

        if not elem :
             raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})

        soup = BeautifulSoup(elem, 'html.parser')
        table = soup.find('table')
        dt_list = []
        realini=0
        realtotal=0

        for emp_data in table.find_all('tbody'):
            rows = emp_data.find_all('tr')
            for row in rows:
                dt_list.append({
                    "id_sub_pd": fdata.idsubunit,
                    "tahun": fdata.ptahun,
                    "bulan": fdata.f_bulan,
                    "program": row.find_all('td')[0].text,
                    "kegiatan": row.find_all('td')[1].text,
                    "subkegiatan": row.find_all('td')[2].text,
                    "koderek": row.find_all('td')[3].text,
                    "uraian": row.find_all('td')[4].text,
                    "pagu": row.find_all('td')[5].text,
                    "realisasi_ls": row.find_all('td')[6].text,
                    "realisasi_gu": row.find_all('td')[7].text,
                    "sisa": row.find_all('td')[8].text
                })

        driver.quit() 

        sql = text(f"""select * from sp_sinc_rkeu('{json.dumps(dt_list)}',{fdata.ptahun},{fdata.idsubunit},{fdata.f_bulan})""") 

        results = session.exec(sql).all()
        session.commit()

        #print(results)

        return {"success": True,"bulanini":"8.586.256","total":"9.898.985.656"}
        #return results

    #except Exception as e:
    #   raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal sinkronisasi data !!  "}})
    