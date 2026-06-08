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

from app.core.deps import CurrentUser, SessionDep,TahunAnggaran,handle_errordb, RowstoDicts
from app.core.exceptions import AuthFailedException, BadRequestException, ForbiddenException, NotFoundException
from app.models.opd import TaOpd
from app.models.rfk import Pekerjaan,RencanaPekerjaan,UpdatePersonelSubkegiatan,LaporanRKO, UpdateRKO
from app.core.whatsapp import sendto_rabbitmq

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()


@router.get("/rkopd")
def read_opd(session: SessionDep, current_user: CurrentUser):

    tahun = int(TahunAnggaran)
    role_id=current_user.role_id
    
    userid=current_user.id
    strapp='emonev'

    base_sql = """
    SELECT 
        o.kode,
        o.id_pd,
        o.id_sub_pd,
        o.nama_pd,
        COALESCE(rk.anggaran,0) as anggaran,
        COALESCE(rk.jm_sub,0) as jm_sub,
        COALESCE(pk.jm_pek,0) as jm_pek
    FROM ta_opd o
    LEFT JOIN (
        SELECT id_sub_pd,
               SUM(anggaran) AS anggaran,
               COUNT(*) AS jm_sub
        FROM ta_renja_subkegiatan
        WHERE tahun = :tahun
        GROUP BY id_sub_pd
    ) rk ON o.id_sub_pd = rk.id_sub_pd
    LEFT JOIN (
        SELECT id_sub_pd,
               COUNT(*) AS jm_pek
        FROM ta_pekerjaan
        WHERE tahun = :tahun
        GROUP BY id_sub_pd
    ) pk ON o.id_sub_pd = pk.id_sub_pd
    """

    if role_id >3:
        opds = ','.join(map(str, current_user.opds))
        base_sql += f""" where o.id_sub_pd IN ({ opds})"""
    
    base_sql += " ORDER BY o.kode ASC"

    sql = text(base_sql).bindparams(tahun=tahun)

    results = session.exec(sql).all()
    return RowstoDicts(results)



@router.get("/personel")
def read_personel(
    session: SessionDep, current_user: CurrentUser, ptahun:int,pid_sub_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    tahun=TahunAnggaran
    sql = text(f"""SELECT * from ta_personel where id_sub_pd={pid_sub_pd};""")
    
    results = session.exec(sql).all()
    #print (results)
    objs= [
            {
                'id':data[0],
                'nip':data[1],
                'nama':data[2]
            }
            for data in results
        ]
    return objs

@router.get("/tahap")
def read_tahap(
    session: SessionDep, current_user: CurrentUser, ptahun:int,pid_sub_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    tahun=TahunAnggaran
    sql = text(f"""SELECT t.kd_tahap, t.nm_tahap, t.ket, v.id, v.id_sub_pd, v.v1, v.tgl1, v.user1, v.v2, v.tgl2, v.user2 FROM public.ref_tahap t LEFT JOIN (SELECT v0.* FROM public.ta_laporan_rko v0 WHERE v0.id_sub_pd={pid_sub_pd}) v ON (t.kd_tahap = v.kd_tahap) where t.aktif=1 ORDER BY t.kd_tahap ASC;""")
    
    results = session.exec(sql).all()
    #print (results)
    objs= [
            {
                'kd_tahap':data[0],
                'nm_tahap':data[1],
                'ket':data[2],
                'id':data[3],
                'id_sub_pd':data[4],
                'v1':data[5],
                'tgl1':data[6],
                'user1':data[7],
                'v2':data[8],
                'tgl2':data[9],
                'user2':data[10]
            }
            for data in results
        ]
    return objs


@router.get("/data")
def read_renstra_opd(
    session: SessionDep, current_user: CurrentUser,pid_sub_pd: int,ptahun:int,pkd_tahap:int
) -> Any:
    sql = text(f"""SELECT dx from sp_rko({pid_sub_pd},1) as dx""") 
    results = session.exec(sql).all()
    return results[0]._mapping['dx']


@router.post("/save-pekerjaan")
def update_pekerjaan(*, session: SessionDep, current_user: CurrentUser, item_in: Pekerjaan) -> Any:
    try:
        id=item_in.id
        if (id=='0') :
            item_data = item_in.model_dump(exclude_unset=True)
            item_data["id"] = uuid7str()

            item = Pekerjaan.model_validate(item_data)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}
         
        else :             
            item = session.get(Pekerjaan, id)
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
    

@router.delete("/delete-pekerjaan/{id}")
def delete_item(session: SessionDep,current_user: CurrentUser, id: uuid.UUID) -> Any:
    try:
        
        item = session.get(Pekerjaan, id)

        if not item:
            raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Gagal hapus data  !!"}})
        session.delete(item)
        session.commit()
        return {"success": True,"message":"Data Berhasil Dihapus"}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal hapus data  !!"}})
    


@router.post("/save-rencana")
def update_pekerjaan(*, session: SessionDep, current_user: CurrentUser, item_in: RencanaPekerjaan) -> Any:
    try:
        id=item_in.id
             
        item = session.get(Pekerjaan, id)
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
    

@router.post("/update-subkegiatan/{id}")
def update_subkegiatan(session: SessionDep,current_user: CurrentUser, id: uuid.UUID,formdata : UpdatePersonelSubkegiatan) -> Any:
    try:
        sql = f"""UPDATE ta_renja_subkegiatan set id_ppk = {formdata.id_ppk}, id_pptk = {formdata.id_pptk} WHERE idsubkegiatan='{id}';"""
        
        session.exec(text(sql))
        session.commit()
        return {"success": True,"message":"Data Berhasil Disimpan"}
        #return formdata
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal hapus data  !!"}})
    
@router.get("/getverify")
def getverify(
    session: SessionDep, current_user: CurrentUser,id_sub_pd: int
) -> Any:
    sql = text(f"""SELECT (row_to_json(t)) as dx FROM (SELECT sum(x.a) as a, sum(x.b) as b, sum(x.c) as c FROM
		(SELECT sum(k.anggaran) as a,0 as b,0 as c FROM public.ta_renja_subkegiatan k WHERE k.id_sub_pd={id_sub_pd}  GROUP BY k.id_sub_pd
		UNION ALL
		SELECT 0 as a,SUM(p.pagu_anggaran) as b, 0 as c FROM public.ta_pekerjaan p WHERE p.id_sub_pd={id_sub_pd}
        UNION ALL
        SELECT 0 as a, 0 as b, avg(des_f)  as c from public.ta_pekerjaan  WHERE id_sub_pd={id_sub_pd}
        ) x)t""") 
    results = session.exec(sql).all()
    return results[0]._mapping['dx']


@router.post("/verifikasirko")
def update_verifikasi_rko(session: SessionDep,current_user: CurrentUser,fdata: UpdateRKO) -> Any:
    try:
        id = fdata.id_tahap
        item = session.get(LaporanRKO, id)
        if not item:
                raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Gagal Verifikasi RKO  !!"}})
        
        
        if fdata.method == 'v1':
            item.tgl1 = datetime.datetime.now()
            item.v1 = 1
            item.user1 = current_user.username

        elif fdata.method == 'v2':
            item.tgl2 = datetime.datetime.now()
            item.v2 = 1
            item.user2 = current_user.username

            sqlphone = text(f"""SELECT u.username,u.display_name,u.no_telp, o.id_sub_pd,o.nama_pd FROM public.ta_laporan_rko l INNER JOIN public.sso_users u ON (l.user1 = u.username) INNER JOIN public.ta_opd o ON (l.id_sub_pd = o.id_sub_pd) where l.id={id}""") 
            rst_lp = session.exec(sqlphone).all()
            nophone =  rst_lp[0]._mapping['no_telp']
            namauser = rst_lp[0]._mapping['display_name']
            namaopd = rst_lp[0]._mapping['nama_pd']
            #bulan = rst_lp[0]._mapping['str_bulan']

            sendto_rabbitmq({"nophone":nophone,"message":f"""Hai {namauser}, Laporan RKO {namaopd} sudah diverifikasi oleh Admin SIMLABA .""","users":"Admin"})
        

        elif fdata.method == 'cancel':
                item.v1 = 0
                item.v2 = 0
            
        #data =dict(data)
        #update_dict = data.model_dump(exclude_unset=True)

        #item.sqlmodel_update(update_dict)
        session.add(item)
        session.commit()
        session.refresh(item)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal Verifikasi RKO  !!"}})