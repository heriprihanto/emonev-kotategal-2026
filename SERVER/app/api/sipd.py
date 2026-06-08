import uuid
from typing import Any, Annotated
import datetime

import pycurl
from io import BytesIO
from urllib.parse import urlencode

import logging
import json
from uuid_extensions import uuid7, uuid7str

from sqlalchemy import text,and_
import requests
from fastapi import APIRouter, HTTPException, Request,Body
from sqlmodel import SQLModel, Field,func, select
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.core.deps import CurrentUser, SessionDep, TahunAnggaran
from app.core.exceptions import AuthFailedException, BadRequestException, ForbiddenException, NotFoundException
from sqlalchemy.dialects.postgresql import JSON
#from selenium import webdriver
#from selenium.webdriver.chrome.options import Options
import time
#from bs4 import BeautifulSoup
from typing import List
import pika
import datetime
import aio_pika
from typing import Optional


from pydantic import BaseModel

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()

class FormData(BaseModel):
    ptahun: int
    f_bulan: int
    idsubunit: int
    chaptchaid: str
    chaptcha: str
    password: str
    username: str


def str_to_numb(xstr:str)->float:
     nstr1= str(xstr.replace('.',''))
     nstr =  str(nstr1.replace(',','.'))
     return float(nstr)

@router.get("/test")
def update_pekerjaan_test() -> Any:
    return {"data":str_to_numb("10.235.566,00")}

@router.post("/startjob")
async def startjob(request: Request,session: SessionDep, current_user: CurrentUser) -> Any:

    content_type = request.headers.get("content-type", "")
    if "form" in content_type:
        params = dict(await request.form())
    else:
        params = await request.json()

    modulname = params.get("jobname")

    #try:
    '''
    connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    channel.queue_declare(queue=modulname)

    channel.basic_publish(exchange='', routing_key=modulname, body="SInkronisasi SIPD") 

    data = {
        'tgl': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'status': True,
        'user': current_user.username
    }
    '''
    RABBIT_URL = "amqp://guest:guest@localhost/"
    task = {
        'tgl': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        'status': True,
        'user': current_user.username
    }

    conn = await aio_pika.connect_robust(RABBIT_URL)
    async with conn:
        channel = await conn.channel()
        await channel.declare_queue( modulname, durable=True)
        await channel.default_exchange.publish(
            aio_pika.Message(body=json.dumps(task).encode(), delivery_mode=aio_pika.DeliveryMode.PERSISTENT),
            routing_key= modulname
        )
    print("Sent:", task)
    
    #log_wa_to_database(data)
    return {"success": True,"msg":"Data berhasil disinkronisasi"}
    
    #except Exception as e:
            #print(e)
    #        return {"success": False,"msg":"Gagal memulai job"}
    #return {"success": True,"msg":"Data berhasil disinkronisasi"}



@router.get("/getcaptcha")
def getcaptcha() -> Any:
    return {"success": True,"msg":"Data berhasil disinkronisasi"}


@router.post("/update-realkeu")
def update_pekerjaan(*, session: SessionDep, current_user: CurrentUser,fdata : FormData) -> Any:
    try:
        tahun = fdata.ptahun
        
        url = 'https://service.sipd.kemendagri.go.id/auth/auth/pre-login'
        params = {"tahun":tahun,"username":fdata.username,"password":fdata.password,"id_daerah":0,"id_role":0,"id_skpd":0,"id_pegawai":0,"captcha_id":"","captcha_solution":"","remember_me":False,"pegawai":[],"selected_pegawai":{"id_pegawai":0,"id_user":0,"id_daerah":0,"id_skpd":0,"kode_skpd":"","nama_skpd":"","id_role":0,"nama_role":""}}
        configsipd ={"id_daerah":70,"tahun":tahun}
        response = requests.post(url, json=params,headers={"Content-Type":"application/json","Origin":"https://sipd.kemendagri.go.id"})
        rdata = response.json()

        
        
        paramslogin={
                    "tahun": tahun,
                    "username": fdata.username,
                    "password": fdata.password,
                    "id_daerah": 70,
                    "id_role": rdata[0]["id_role"],
                    "id_skpd": rdata[0]["id_skpd"],
                    "id_pegawai": rdata[0]["id_pegawai"],
                    "captcha_id": fdata.chaptchaid,
                    "captcha_solution": fdata.chaptcha,
                    "remember_me": False,
                    }
        
        
        responselogin = requests.post("https://service.sipd.kemendagri.go.id/auth/auth/login", json=paramslogin,headers={"Content-Type":"application/json","Origin":"https://sipd.kemendagri.go.id"})
        rdatalogin = responselogin.json()
        xtoken = f"""Bearer {rdatalogin["token"]}"""
        #furl =f"""https://service.sipd.kemendagri.go.id/pengeluaran/strict/laporan/realisasi/cetak?tipe=bulan&skpd={fdata.idsubunit}&bulan={fdata.f_bulan}"""
        furl =f"""https://service.sipd.kemendagri.go.id/pengeluaran/strict/lpj/adm-fungs/0?type=SKPD&id_pegawai=0&bulan={fdata.f_bulan}"""

        responserealkeu = requests.get(furl, headers={"Content-Type":"application/json","Origin":"https://sipd.kemendagri.go.id","Authorization": xtoken})
        rdatarealkeu = responserealkeu.json()

        #total_realisasi = 0
        #xrdata = json.load(rdatarealkeu)

        #for item in rdatarealkeu:
        #    total_realisasi += item['nilai_realisasi']

        total_realisasi =rdatarealkeu['pembukuan1'][0]['jumlah_sd_saat_ini']
        #total_realisasi = 1000000

        sql = text(f"""select * from sp_sinc_rkeu_sipd((:xdata)::json,{fdata.ptahun},{fdata.idsubunit},{fdata.f_bulan})""").bindparams(xdata=json.dumps(rdatarealkeu['pembukuan2'])) 
        results = session.exec(sql).all()
        session.commit()

        return {"success": True,"msg":"Data berhasil disinkronisasi","bulanini":total_realisasi,"total":total_realisasi}

        #return {"success": True,"msg":"Data berhasil disinkronisasi","bulanini":total_realisasi,"total":total_realisasi,"resp":rdatarealkeu}
        
    except Exception as e:
       raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal sinkronisasi data !!  "}})
    

@router.post("/update-dpa-sipd")
def update_pekerjaan(*, session: SessionDep, current_user: CurrentUser,fdata : FormData) -> Any:
    try:
        tahun = fdata.ptahun  
        url = 'https://service.sipd.kemendagri.go.id/auth/auth/pre-login'
        params = {"tahun":tahun,"username":fdata.username,"password":fdata.password,"id_daerah":0,"id_role":0,"id_skpd":0,"id_pegawai":0,"captcha_id":"","captcha_solution":"","remember_me":False,"pegawai":[],"selected_pegawai":{"id_pegawai":0,"id_user":0,"id_daerah":0,"id_skpd":0,"kode_skpd":"","nama_skpd":"","id_role":0,"nama_role":""}}
        configsipd ={"id_daerah":70,"tahun":tahun}
        response = requests.post(url, json=params,headers={"Content-Type":"application/json","Origin":"https://sipd.kemendagri.go.id"})
        rdata = response.json()
        
        paramslogin={
                    "tahun": tahun,
                    "username": fdata.username,
                    "password": fdata.password,
                    "id_daerah": 70,
                    "id_role": rdata[0]["id_role"],
                    "id_skpd": rdata[0]["id_skpd"],
                    "id_pegawai": rdata[0]["id_pegawai"],
                    "captcha_id": fdata.chaptchaid,
                    "captcha_solution": fdata.chaptcha,
                    "remember_me": False,
                    }
        
        
        responselogin = requests.post("https://service.sipd.kemendagri.go.id/auth/auth/login", json=paramslogin,headers={"Content-Type":"application/json","Origin":"https://sipd.kemendagri.go.id"})
        
        rdatalogin = responselogin.json()

        xtoken = f"""Bearer {rdatalogin["token"]}"""
        
        furl =f"""https://service.sipd.kemendagri.go.id/referensi/strict/dpa/penarikan/belanja/skpd/{rdata[0]["id_skpd"]}"""

        responserealkeu = requests.get(furl, headers={"Content-Type":"application/json","Origin":"https://sipd.kemendagri.go.id","Authorization": xtoken})
        
        rdatarealkeu = responserealkeu.json()

        '''
        sql = text(f"""select * """) 
        results = session.exec(sql).all()
        session.commit()
        '''

        return {"success": True,"data":rdatarealkeu}
    
    except Exception as e:
       raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal sinkronisasi data !!  "}})



class AkunItem(BaseModel):
    kode_akun: str
    nama_akun: str
    alokasi_anggaran: float | None=Field(default=None)
    realisasi_gaji_bulan_sebelumnya: int
    realisasi_gaji_bulan_ini: float | None=Field(default=None)
    realisasi_gaji_sd_saat_ini: float | None=Field(default=None)
    realisasi_ls_selain_gaji_bulan_sebelumnya: float | None=Field(default=None)
    realisasi_ls_selain_gaji_bulan_ini: float | None=Field(default=None)
    realisasi_ls_selain_gaji_sd_saat_ini: float | None=Field(default=None)
    realisasi_up_gu_tu_bulan_sebelumnya: float | None=Field(default=None)
    realisasi_up_gu_tu_bulan_ini: float | None=Field(default=None)
    realisasi_up_gu_tu_sd_saat_ini: float | None=Field(default=None)
    jumlah_sd_saat_ini: float | None=Field(default=None)
    sisa_pagu_anggaran: float | None=Field(default=None)
    bku_jenis: int
    kode_unik: str


class RequestPayload(BaseModel):
    kode_pd: str
    tahun : int
    bulan : int
    jumlah_sd_saat_ini : float
    xdata: List[AkunItem]
    chrversion : Optional[str] = None



@router.post("/updaerealisasikeuangan")
def update_realisasi_keuangan(*, session: SessionDep,fdata: RequestPayload) -> Any:
   
    if fdata.chrversion != '1.4' :
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal sinkronisasi data, Update Chrome Extension ke versi terbaru !!  "}})
    
    try:
        
        tahun = fdata.tahun
        total_realisasi = fdata.jumlah_sd_saat_ini        
        idsubunit = 475
        xdatajson = fdata.xdata
        xdata_json_str = json.dumps([item.dict() for item in fdata.xdata])
        sql = text(f"""select * from sp_sinc_rkeu_sipd_v2((:xdata)::json,2026,:kode_pd,{fdata.bulan})""").bindparams(xdata=xdata_json_str,kode_pd=fdata.kode_pd)
        results = session.exec(sql).all()
        session.commit()

        return {"success": True,"msg":"Data berhasil disinkronisasi","kode_pd":fdata.kode_pd,"total":total_realisasi}
        
    except Exception as e:
       raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal sinkronisasi data !!  "}})
    