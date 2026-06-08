import uuid
from typing import Any, Annotated
import datetime


import logging
import json
from uuid_extensions import uuid7, uuid7str

from sqlalchemy import text,and_

from fastapi import APIRouter, HTTPException, Request,Body,Form, UploadFile, File
from sqlmodel import SQLModel, Field,func, select
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from pydantic import BaseModel
import os
from dotenv import load_dotenv


from app.core.deps import CurrentUser, SessionDep, TahunAnggaran
from app.core.exceptions import AuthFailedException, BadRequestException, ForbiddenException, NotFoundException

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()


class FormData(BaseModel):
    report_name: str
    id_pd:int | None=Field(default=458)
    tahun:int | None=Field(default=2024)


@router.get("/opd")
def read_opd(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    sql = text("SELECT '-' as kode, 0 as id_pd,'Kota Tegal' as nama_pd UNION ALL SELECT kode,id_pd,nama_pd from ta_opd where is_pd=1 order by kode asc") 
    results = session.exec(sql).all()
    #print (results)
    objs= [
            {
                "kode": data[0],
                "id_pd": data[1],
                "nama_pd": data[2]
            }
            for data in results
        ]
    return objs


@router.get("/doklaplist")
def read_doklap_list(
    session: SessionDep, current_user: CurrentUser,ptahun:int,pid_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    sql = text(f"""SELECT json_agg(row_to_json(t)) as dx FROM (SELECT r.tahun as rtahun,r.dokumen,l.* FROM public.ref_dokumen_laporan r LEFT JOIN (SELECT *,length(filename) as lng FROM ta_dokumen_lkjip WHERE id_pd= :pid_pd) l ON (r.tahun = l.tahun) ORDER BY rtahun)t""").bindparams(pid_pd=pid_pd)
    results = session.exec(sql).all()
    return results[0]._mapping['dx']


@router.post("/uploadberkas/{tahun}/{idpd}")
def read_upload_berkas(session: SessionDep,tahun:int,idpd:int, file: UploadFile = File(...)):
    try:
        load_dotenv()
        upload_path = os.getenv("UPLOAD_PATH")
        oldfilename = file.filename
        newfilename = 'lkjip-'+uuid7str() + oldfilename.replace(" ", "")
        file_path = upload_path + f"{newfilename}"
        with open(file_path, "wb+") as f:
            f.write(file.file.read())
        sql = text(f"insert into ta_dokumen_lkjip (tahun,id_pd,filename,filename_o) values(:tahun,:id_pd,:filename,:filename_o) ON CONFLICT(id_pd,tahun) DO UPDATE SET filename = :filename, filename_o = :filename_o;").bindparams(tahun=tahun,id_pd=idpd,filename=newfilename,filename_o=oldfilename)
        session.exec(sql)
        session.commit()
        return {"success": True, "filename": newfilename}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Simpan Data Gagal !!","message": e.args}})

