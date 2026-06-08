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

from app.core.deps import CurrentUser, SessionDep, TahunAnggaran
from app.core.exceptions import AuthFailedException, BadRequestException, ForbiddenException, NotFoundException

from collections import defaultdict
logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()




@router.get("/ref-opd")
def read_opd(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'

    sql = text(f"""SELECT json_agg(row_to_json(t)) as dx FROM (SELECT 0 as id_sub_pd, '-' as kode, '-- Semua OPD --' as nama_pd 
                UNION ALL
                SELECT id_sub_pd, kode, nama_pd from ta_opd order by kode 
                )t""") 
    results = session.exec(sql).all()
    return results[0]._mapping['dx']


@router.get("/pd")
def bidangurusan(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    sql = text(f"select id_sub_pd,id_pd, kode, nama_pd from ta_opd where is_pd=1 order by kode ")
    result = session.exec(sql).all()
    rows = [dict(row._mapping) for row in result] 
    return rows

@router.get("/sub-pd")
def bidangurusan(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    sql = text(f"select id_sub_pd,id_pd, kode, nama_pd from ta_opd order by kode ")
    result = session.exec(sql).all()
    rows = [dict(row._mapping) for row in result] 
    return rows