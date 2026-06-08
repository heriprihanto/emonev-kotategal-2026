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

from app.core.deps import CurrentUser, SessionDep, TahunAnggaran, RowstoDicts
from app.core.exceptions import AuthFailedException, BadRequestException, ForbiddenException, NotFoundException
from app.models.opd import TaOpd
from app.models.dak import CreateLaporanBulanan, Dak
from app.core.whatsapp import sendto_rabbitmq

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()


@router.get("/opd")
def read_opd(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'

    if role_id > 3:
        sql = text(f"SELECT * from v_lap_dak where id_sub_pd IN ( SELECT unnest( opds )  FROM sso_users where id= :userid)").bindparams(userid=userid)
    else :
        sql = text(f"SELECT * from v_lap_dak")

    try:
        result = session.exec(sql).all()
        if not result:
            return []
        return RowstoDicts(result)
    except Exception as e:
        logger.error(f"Error saat membaca OPD: {e}")
        raise HTTPException(status_code=500, detail="Gagal membaca data OPD")

@router.get("/laporanbln")
def read_laporan_bln_opd(
    session: SessionDep, current_user: CurrentUser,pid_sub_pd: int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    sql = text(f"""SELECT * FROM ta_laporan_dak where id_sub_pd={pid_sub_pd} order by bulan asc""") 
    results = session.exec(sql).all()
    return RowstoDicts(results)


@router.post("/createlapbulanan")
def createlapbulanan(session: SessionDep, current_user: CurrentUser, xpost:CreateLaporanBulanan) -> Any:
   
    rbulan=["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]
    
    int_bulan=xpost.bulan
    int_bulan_n1=int_bulan-1
    nbulan=rbulan[int_bulan_n1]
    str_bulan = rbulan[int_bulan]
    tgl_buat = datetime.datetime.now()
    user_buat = current_user.username

    
    try:
        
        sql = text(f"""
                    BEGIN;
                    INSERT INTO ta_laporan_dak (id_sub_pd,bulan,str_bulan,tgl_buat,user_buat) VALUES({xpost.id_sub_pd},{int_bulan},'{str_bulan}','{tgl_buat}','{user_buat}');
                    INSERT INTO dak_detail_rincian (tahun,id_sub_pd,bulan,kat_dak,kd_jenis,jenis,t1_kode,t2_kode,t3_kode,t4_kode,t5_kode,t1_nama,t2_nama,t3_nama,t4_nama,t5_nama,volume,satuan,pagu,volume2,satuan2,nilai,mekanisme,metode,real_k,real_vol,real_fisik,masalah,vol_f,real_manfaat,sesuai,ket_masalah,sumber,lokasi,koordinat) select tahun,id_sub_pd,{int_bulan},kat_dak,kd_jenis,jenis,t1_kode,t2_kode,t3_kode,t4_kode,t5_kode,t1_nama,t2_nama,t3_nama,t4_nama,t5_nama,volume,satuan,pagu,volume2,satuan2,nilai,mekanisme,metode,real_k,real_vol,real_fisik,masalah,vol_f,real_manfaat,sesuai,ket_masalah,sumber,lokasi,koordinat from dak_detail_rincian where id_sub_pd={xpost.id_sub_pd} and bulan={int_bulan_n1};
                    COMMIT;
                    """) 
        '''
        sql = text(f"""
                    BEGIN;
                    INSERT INTO ta_laporan_dak (id_sub_pd,bulan,str_bulan,tgl_buat,user_buat) VALUES({xpost.id_sub_pd},{int_bulan},'{str_bulan}','{tgl_buat}','{user_buat}');
                    COMMIT;
                    """) 
        '''
        session.exec(sql)
        session.commit()
        
        return {"success": True,"byuser": user_buat}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Simpan Data Gagal !!"}})
    

@router.get("/data")
def read_data_dak(
    session: SessionDep, current_user: CurrentUser,id_sub_pd: int,tahun:int,bulan:int
) -> Any:
    sql = text(f"""SELECT dx from sp_dak_kegiatan({id_sub_pd},{tahun},{bulan}) as dx""") 
    results = session.exec(sql).all()
    return results[0]._mapping['dx']

@router.post("/save-data")
def update_dak(*, session: SessionDep, current_user: CurrentUser, item_in: Dak) -> Any:
    try:
        id=item_in.id
             
        item = session.get(Dak, id)
        if not item:
            raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})
        update_dict = item_in.model_dump(exclude_unset=True)

        item.sqlmodel_update(update_dict)
        session.add(item)
        session.commit()
        session.refresh(item)
        return {"success": True}

    except Exception as e:
       raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})

@router.post("/send-report/{id_sub_pd}/{bulan}")
def send_report(*, session: SessionDep, current_user: CurrentUser,id_sub_pd: int, bulan: int) -> Any:
    try:
        user_kirim = current_user.display_name
        tgl_kirim = datetime.datetime.now()
        
        sql = text("UPDATE ta_laporan_dak SET tgl_kirim=:tgl_kirim, user_kirim= :user_kirim ,verified_opd=1, lock=1 WHERE id_sub_pd = :id_sub_pd and bulan = :bulan;").bindparams(tgl_kirim =tgl_kirim,user_kirim=user_kirim,id_sub_pd=id_sub_pd,bulan=bulan)
        session.exec(sql)
        session.commit()
        return {"success": True}

    except Exception as e:
       raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})