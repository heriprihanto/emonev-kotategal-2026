import string
import random
import uuid
from typing import Any, Annotated, List
import datetime
import hashlib

import logging
import json
from uuid_extensions import uuid7, uuid7str

from sqlalchemy import text,and_
from sqlalchemy.exc import IntegrityError

from fastapi import APIRouter, HTTPException, Request,Body
from sqlmodel import Integer, SQLModel, Field,func, select,Column, String, ARRAY
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.core.deps import CurrentUser, SessionDep, SessionSSODep, RowstoDicts
from app.core.exceptions import AuthFailedException, BadRequestException, ForbiddenException, NotFoundException
from app.models.users import UserSSO, UserSSOF, UserRegister
from app.models.opd import TaOpd
from app.core.whatsapp import sendto_rabbitmq

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()


@router.get("/ref-opd")
def ref_opd(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    role_id = current_user.role_id
    userid = current_user.id
    opds = current_user.opds

    sqlwhere = " "

    if role_id > 3 :
        sqlwhere = f" where id_sub_pd IN (SELECT unnest( opds )  FROM sso_users where id= {userid}) "

    sql = text(f"""SELECT id_sub_pd,nama_pd FROM ta_opd {sqlwhere} order by kode asc""") 
    results = session.exec(sql).all()
    return RowstoDicts(results)


@router.get("/userlist")
def userlist(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    role_id = current_user.role_id
    userid = current_user.id
    opds = current_user.opds

    sqlwhere = " "

    if role_id == 4 :
        sqlwhere = f" where u.opds && array[(select opds from public.sso_users where id={userid})] and u.role_id in (4,5,6,7,8,9) "

    sql = text(f"""SELECT u.*,dd.namaopd FROM public.sso_users u LEFT JOIN (SELECT  u.id, string_agg( t.nama_pd,',') as namaopd FROM
        public.sso_users u
        CROSS JOIN unnest(u.opds) AS id_sub_pd
        JOIN ta_opd t USING (id_sub_pd)
        GROUP BY u.id)dd ON (u.id=dd.id)
        {sqlwhere}
        order by u.username asc""") 
    results = session.exec(sql).all()
    return RowstoDicts(results)



@router.post("/save-data")
def update_user(*, session: SessionSSODep, current_user: CurrentUser, item_in: UserSSO) -> Any:
    try:
        id=item_in.id
        defaultpassword = "TegalBahari@2026"
        if (id==0) :
            item_data = item_in.model_dump(exclude_unset=True)
            item_data["id"] = None
            salt = ''.join(random.choices(string.ascii_lowercase + string.ascii_uppercase + string.digits, k=10))        
            npasswd = str(salt) + str(defaultpassword)
            newpassword = hashlib.sha256(npasswd.encode('utf-8')).hexdigest()
            item_data["password"] = newpassword
            item_data["salt"] = salt

            item = UserSSOF.model_validate(item_data)
            session.add(item)
            session.commit()
            session.refresh(item)
            #return {"success": True}
            return {"success": True, "id": item.id, "data": jsonable_encoder(item)}
            
            
        else :             
            item = session.get(UserSSOF, id)
            if not item:
                raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})
            update_dict = item_in.model_dump(exclude_unset=True)
            item.sqlmodel_update(update_dict)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}
            

    
    except HTTPException:
        raise
    except IntegrityError as e:
        logger.warning("Duplicate atau constraint saat simpan user: %s", e)
        raise HTTPException(status_code=409, detail={"success":False,0:{"msg":"Email atau username sudah terdaftar."}})
        
    except Exception as e:
        logger.exception("Error saat simpan user: %s", e)
        raise HTTPException(
            status_code=500,
            detail={"success":False,0:{"msg":"Gagal simpan data  !!"}},
        )



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
    
@router.delete("/delete/{id}")
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