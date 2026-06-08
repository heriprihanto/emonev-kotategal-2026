import uuid
import re
from typing import Any, Annotated
from datetime import timedelta
import string
import random
import hashlib

import logging
import json
from pydantic import BaseModel
from uuid_extensions import uuid7, uuid7str

from sqlalchemy import text,and_

from fastapi import APIRouter, HTTPException, Request,Body
from sqlmodel import SQLModel, Field,func, select
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.core.deps import CurrentUser, SessionDep, SessionSSODep
from app.core.config import settings
from app.core.exceptions import AuthFailedException, BadRequestException, ForbiddenException, NotFoundException

from app.models.users import NewPassword, UserLogin,JwtUserData,Token,TokenRe,UserAccess,UserRegister,UserSSO,UserSSOF
from app.core.security import get_password_hash, verify_password,create_access_token
from app.core.whatsapp import sendto_rabbitmq
from sqlalchemy.exc import SQLAlchemyError


logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()


def validate_password(password):
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False
    return True

'''
@router.post("/login")
def login(session: SessionDep, usr:UserLogin) -> Token:
    try:  
        strapp= usr.app
        sql = text("SELECT * FROM public.sso_users u WHERE u.username = :username AND password = encode_passwd(:username,:password)").bindparams(username=usr.username,password=usr.password)  
        user = session.exec(sql).all() 
        if not user:
            raise HTTPException(status_code=401, detail={"success":False,"msg":"Username / Password tidak sesuai !!"})
        
        
        if not user[0]._mapping['active']:
            raise HTTPException(status_code=401, detail={"success":False,"msg":"User Belum Aktif !!"})

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        respuserdata = JwtUserData(
            username=usr.username,
            id=user[0]._mapping['id'],
            display_name=user[0]._mapping['display_name'],
            email=user[0]._mapping['email'],
            role_id=user[0]._mapping['role_id']
        )
        return Token(
            token= create_access_token(
                user[0]._mapping['username'], expires_delta=access_token_expires
            ),
            userdata=respuserdata,
            opds=user[0]._mapping['opds'],
            apps=user[0]._mapping['apps'],
        )

       # return {"status": 201,"success": True,"userdata": usr,"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQb3J0YWwgRGF0YSBLb3RhIFRlZ2FsIiwiYXVkIjoiRm9ydW0gU2F0dSBEYXRhIEtvdGEgVGVnYWwiLCJzdWIiOiJwb3J0YWxfZGF0YV9rb3RhX3RlZ2FsIiwiaWF0IjoxNzI3MzM0ODA1LCJleHAiOjM2MDAwMDAwMDAwLCJ1aWQiOiJhZG1pbiIsIm5hbWEiOiJBZG1pbmlzdHJhdG9yIn0.2CTc5TS5snhiujvTmPvOc48d9m2FSvarN3fa6d26svI"}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,"msg":"Username / Password tidak sesuai !!"})

'''

@router.post("/login")
def login(session: SessionDep, usr: UserLogin) -> Token:
    try:
        # Ambil user berdasarkan username
        sql = text("""
            SELECT * 
            FROM public.sso_users u 
            WHERE u.username = :username 
              AND password = encode_passwd(:username, :password)
        """)
        user_result = session.exec(sql.bindparams(
            username=usr.username, 
            password=usr.password
        )).mappings().first()

        # Cek apakah user ada
        if not user_result:
            raise HTTPException(
                status_code=401,
                detail={"success": False, "msg": "Username atau Password tidak sesuai"}
            )

        # Cek apakah user aktif
        if not user_result['active']:
            raise HTTPException(
                status_code=401,
                detail={"success": False, "msg": "User belum aktif"}
            )

        # Generate JWT
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token = create_access_token(
            user_result['username'], expires_delta=access_token_expires
        )

        userdata = JwtUserData(
            username=user_result['username'],
            id=user_result['id'],
            display_name=user_result['display_name'],
            email=user_result['email'],
            role_id=user_result['role_id']
        )

        return Token(
            token=token,
            userdata=userdata,
            opds=user_result.get('opds'),
            apps=user_result.get('apps')
        )

    except HTTPException:
        logger.exception("Error tidak terduga saat login")
        raise HTTPException(
                status_code=500,
                detail={"success": False, "msg": "Username atau Password tidak sesuai"}
            )
    except SQLAlchemyError as e:
        logger.exception("Database error saat login")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "msg": "Terjadi kesalahan pada server (DB)"}
        )
    except Exception as e:
        logger.exception("Error tidak terduga saat login")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "msg": "Terjadi kesalahan pada server"}
        )

@router.get("/getjwt")
def get_jwt_info(session: SessionDep, current_user: CurrentUser) -> TokenRe:
    """
    Mengambil ulang data user berdasarkan token JWT yang masih valid.
    Pastikan user masih aktif di database.
    """
    try:
        sql = text("""
            SELECT * 
            FROM public.sso_users 
            WHERE username = :username
        """)
        user_result = session.exec(sql.bindparams(
            username=current_user.username
        )).mappings().first()

        # Jika user tidak ditemukan
        if not user_result:
            raise HTTPException(
                status_code=404,
                detail={"success": False, "msg": "User tidak ditemukan"}
            )

        # Jika user tidak aktif
        if not user_result['active']:
            raise HTTPException(
                status_code=401,
                detail={"success": False, "msg": "User belum aktif"}
            )
        print (f"OPDS {current_user.opds[0]}")
        opd1 = int(current_user.opds[0])
        opdres = session.exec(text("select * from ta_opd where id_sub_pd = :idsubpd;").bindparams(
            idsubpd= opd1
        )).mappings().first()
        nama_pd = "KOTA TEGAL"
        if opdres :
            nama_pd = opdres.get('nama_pd')
        
        '''
        return TokenRe(
            userdata=current_user,
            opds=user_result.get('opds'),
            apps=user_result.get('apps'),
            nama_pd = nama_pd
        )
        '''
        return {
            "success" : True,
            "opds" : user_result.get('opds'),
            "apps" :user_result.get('apps'),
            "nama_pd" : nama_pd,
            "userdata" : current_user
        }

    except HTTPException:
        raise
    except SQLAlchemyError as e:
        logger.exception("Database error saat getjwt")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "msg": "Kesalahan database saat mengambil data user"}
        )
    except Exception as e:
        logger.exception("Error tidak terduga saat getjwt")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "msg": "Terjadi kesalahan pada server"}
        )


@router.post("/register")
def registerlogin(session: SessionSSODep, usr:UserRegister) -> Any:
    #try:  
        if not validate_password(usr.passwordfield) :
             raise HTTPException(status_code=422, detail={"success":False,0:{"msg":"Password minimal 8 karakter, kombinasi huruf besar, kecil dan simbol !!"}})
        
        salt = ''.join(random.choices(string.ascii_lowercase + string.ascii_uppercase + string.digits, k=10))        
        npasswd = str(salt) + str(usr.passwordfield)
        newpassword = hashlib.sha256(npasswd.encode('utf-8')).hexdigest()

        item_data = usr.model_dump()
        item_data["password"] = newpassword
        item_data["salt"] = salt
        item_data["role_id"] = 4


        item = UserSSOF.model_validate(item_data)
        session.add(item)
        session.commit()
        session.refresh(item)
        sendto_rabbitmq({"nophone":item_data["no_telp"],"message":f"""Hai {item_data['display_name']}, Username anda {item_data['username']} Registrasi akun anda berhasil dikirim, silahkan hubungi Admin untuk aktifasi .""","users":"Admin"})
        
        return {"success": True}
        
    #except Exception as e:
    #    raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Registrasi User Baru Gagal !!"}})


class resetPassword(BaseModel):
    username: str
    phone: str

@router.post("/reset-user")
def reset_password(session: SessionDep, xitem:resetPassword) -> Any:
    try:
        #newPassword =  ''.join(random.choices(string.ascii_lowercase + string.ascii_uppercase + string.digits, k=8))  
        NewPassword = "TegalBahari@2026"
        sql = text("SELECT * FROM public.sso_users WHERE username = :username and no_telp= :phone").bindparams(username=xitem.username,phone=xitem.phone)  
        user = session.exec(sql).all() 
        if not user:
            raise HTTPException(status_code=401, detail={"success":False,"msg":"Username / Password tidak ditemukan !!"})
        
        sql = text(f"CALL public.updatepasswd(:id, :newpassword);").bindparams(id=int(user[0]._mapping['id']),newpassword=newPassword)  
        session.exec(sql)
        session.commit()
        sendto_rabbitmq({"nophone":user[0]._mapping['no_telp'],"message":f"""Hai {user[0]._mapping['display_name']}, Username anda {user[0]._mapping['username']} dan password baru anda adalah {newPassword}""","users":"Admin"})
        
        return {"success": True,"message":"User Berhasil Direset"}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Reset Password Gagal  !!"}})
    
