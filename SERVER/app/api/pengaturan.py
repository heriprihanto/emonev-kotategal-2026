import string
import random
import uuid
from typing import Any, Annotated, List
import datetime


import logging
import json
from uuid_extensions import uuid7, uuid7str

from sqlalchemy import text,and_

from fastapi import APIRouter, HTTPException, Request,Body
from sqlmodel import Integer, SQLModel, Field,func, select,Column, String, ARRAY
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.core.deps import CurrentUser, SessionDep
from app.core.exceptions import AuthFailedException, BadRequestException, ForbiddenException, NotFoundException
from app.models.users import UserSSO
from app.models.opd import TaOpd
from app.core.whatsapp import sendto_rabbitmq

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()



@router.get("/userlist")
def userlist(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    sql = text(f"""SELECT  json_agg (row_to_json(t)) as dx FROM (SELECT u.id,u.email,u.username, u.display_name,u.no_telp,u.role_id,u.apps,u.opds,u.active,dd.namaopd FROM public.sso_users u 
LEFT JOIN (SELECT 
  u.id,
  string_agg( t.nama_pd,',') as namaopd
FROM
  public.sso_users u
  CROSS JOIN unnest(u.opds) AS id_sub_pd
JOIN ta_opd t USING (id_sub_pd)
GROUP BY u.id)dd ON (u.id=dd.id)
order by u.username asc)t""") 
    results = session.exec(sql).all()
    return results[0]._mapping['dx']


@router.get("/ref-opd")
def ref_opd(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    sql = text(f"""SELECT  json_agg (row_to_json(t)) as dx FROM (SELECT id_sub_pd,nama_pd FROM ta_opd u order by kode asc)t""") 
    results = session.exec(sql).all()
    return results[0]._mapping['dx']


@router.post("/updateuser")
def update_user(*, session: SessionDep, current_user: CurrentUser, item_in: UserSSO) -> Any:
    try:
        id=item_in.id
        isaktif=item_in.active
             
        item = session.get(UserSSO, id)
        if not item:
            raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})
        update_dict = item_in.model_dump(exclude_unset=True)

        item.sqlmodel_update(update_dict)
        session.add(item)
        session.commit()
        session.refresh(item)
        if isaktif > 0:
            sendto_rabbitmq({"nophone":item.no_telp,"message":f"""Hai {item.display_name}, Username anda {item.username} sudah aktif""","users":"Admin"})
        return {"success": True}

    except Exception as e:
       raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})
    

@router.post("/reset_password/{id}")
def rest_password(session: SessionDep,current_user: CurrentUser, id: int) -> Any:
    try:
        newPassword = 'TegalBahari@2026' #''.join(random.choices(string.ascii_lowercase + string.ascii_uppercase + string.digits, k=8))  
        item = session.get(UserSSO, id)
        sql =  text(f"CALL public.updatepasswd(:id, :newpassword);").bindparams(id=id,newpassword=newPassword)  
        session.exec(sql)
        session.commit()
        sendto_rabbitmq({"nophone":item.no_telp,"message":f"""Hai {item.display_name}, Username anda {item.username} dan password baru anda adalah {newPassword}""","users":"Admin"})
        return {"success": True,"message":"User Berhasil Direset"}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Reset Password Gagal  !!"}})
    
@router.delete("/delete-user/{id}")
def delete_item(session: SessionDep,current_user: CurrentUser, id: int) -> Any:
    try:
        
        item = session.get(UserSSO, id)

        if not item:
            raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Gagal hapus data  !!"}})
        session.delete(item)
        session.commit()
        return {"success": True,"message":"Data Berhasil Dihapus"}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal hapus data  !!"}})
    
@router.get("/profil-user/{id}")
def profil_user(session: SessionDep,current_user: CurrentUser, id: int) -> Any:
    try:
        
        item = session.get(UserSSO, id)

        if not item:
            raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Gagal hapus data  !!"}})
        return item
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal hapus data  !!"}})
    
@router.get("/profil-opd")
def profil_opd(session: SessionDep,current_user: CurrentUser) -> Any:
    try:
        role_id=current_user.role_id
        userid=current_user.id
        strapp='emonev'

        #sql = text("SELECT kode,id_pd,id_sub_pd,nama_pd from ta_opd where is_pd=1 order by kode asc") 
        if role_id >3:
            opds = ','.join(map(str, current_user.opds))
            sql = text(f"""SELECT json_agg(row_to_json(t)) as dx FROM (select * from ta_opd where id_sub_pd IN ({ opds}) order by kode asc)t""") 
        else :
            sql = text(f"""SELECT json_agg(row_to_json(t)) as dx FROM (select * from ta_opd order by kode asc)t""") 
        results = session.exec(sql).all()
        return results[0]._mapping['dx']
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal hapus data  !!"}})
    
@router.post("/update-profil-opd")
def update_profil_opd(session: SessionDep,current_user: CurrentUser,opd: TaOpd) -> Any:
    try:
        id=opd.id_sub_pd
        item = session.get(TaOpd, id)
        if not item:
            raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})
        update_dict = opd.model_dump(exclude_unset=True)

        item.sqlmodel_update(update_dict)
        session.add(item)
        session.commit()
        session.refresh(item)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal Simpan data  !!"}})
    
@router.post("/update-profil-user")
def update_profil_opd(session: SessionDep,current_user: CurrentUser,xuser: UserSSO) -> Any:
    try:
        id=xuser.id
        item = session.get(UserSSO, id)
        if not item:
            raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})
        update_dict = xuser.model_dump(exclude_unset=True)

        item.sqlmodel_update(update_dict)
        session.add(item)
        session.commit()
        session.refresh(item)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal Simpan data  !!"}})