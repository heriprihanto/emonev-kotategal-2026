import uuid
from typing import Any, Annotated, List, Dict
import datetime


import logging
import json
from uuid_extensions import uuid7, uuid7str

from sqlalchemy import text,and_

from fastapi import APIRouter, HTTPException, Request,Body
from sqlmodel import SQLModel, Field,func, select
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.core.deps import SessionDep,TahunAnggaran
from app.core.exceptions import AuthFailedException, BadRequestException, ForbiddenException, NotFoundException
from app.models.opd import TaOpd
from app.models.rfk import LaporanBulanan,CreateLaporanBulanan, Rfk, UpdateRfk

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()

def _rows_to_dicts(rows: List[Any]) -> List[Dict[str, Any]]:
    return [dict(getattr(r, "_mapping", r)) if hasattr(r, "_mapping") else dict(r) for r in rows]


@router.get("/chartkinerja")
def chart_kinerja(
    session: SessionDep
) -> Any:
    sql = text(f"select * from chart_kinerja order by idx asc") 
    results = session.exec(sql).all()
    return _rows_to_dicts(results)


@router.get("/laba-dashboard")
def get_data_dashboard(
    session: SessionDep
) -> Any:
    pbulan=6
    ptahun=TahunAnggaran
    sql = text(f"""SELECT json_agg(row_to_json(t)) as dx FROM (SELECT * from chartrfk order by bl asc)t""") 
    sql2= text(f"""SELECT dx from fn_dashboard_chart_rank({ptahun},{pbulan}) as dx""")
    sql3=text(f"""SELECT (row_to_json(t)) as dx FROM (SELECT (SELECT sum(anggaran) from ta_renja_subkegiatan) as anggaran,(SELECT sum(realisasi) FROM ta_renja_subkegiatan_realisasi WHERE bulan <= {pbulan}) as realkeu)t""")
    sql4= text(f"""SELECT dx from fn_dashboard_sum_progres({ptahun},{pbulan}) as dx""")
    sql5= text(f"""SELECT dx from fn_dashboard_chart_rank_d({ptahun},{pbulan}) as dx""")
    
    return {
        "chartrfk" : session.exec(sql).all()[0]._mapping['dx'],
        "chartRank" : session.exec(sql2).all()[0]._mapping['dx'],
        "chartRankD" : session.exec(sql5).all()[0]._mapping['dx'],
        "realKeu" : session.exec(sql3).all()[0]._mapping['dx'],
        "summary" : session.exec(sql4).all()[0]._mapping['dx'][0]
    } 


@router.get("/emonev-dashboard")
def get_data_dashboard(
    session: SessionDep
) -> Any:
    pbulan=6
    ptahun=TahunAnggaran
    sql = text(f"""SELECT json_agg(row_to_json(t)) as dx FROM (SELECT * from chartrfk order by bl asc)t""") 
    sql2= text(f"""SELECT dx from fn_dashboard_chart_rank({ptahun},{pbulan}) as dx""")
    sql3=text(f"""SELECT (row_to_json(t)) as dx FROM (SELECT (SELECT sum(anggaran) from ta_renja_subkegiatan) as anggaran,(SELECT sum(realisasi) FROM ta_renja_subkegiatan_realisasi WHERE bulan <= {pbulan}) as realkeu)t""")
    sql4= text(f"SELECT * from tb_statistic")
    sql5= text(f"""SELECT dx from fn_dashboard_chart_rank_d({ptahun},{pbulan}) as dx""")

    results = session.exec(sql4).all()
    #print (results)
    objs= {
            data[1]: data[2]
            for data in results
    }
    
    return {
        "chartrfk" : session.exec(sql).all()[0]._mapping['dx'],
        "chartRank" : session.exec(sql2).all()[0]._mapping['dx'],
        "chartRankD" : session.exec(sql5).all()[0]._mapping['dx'],
        "realKeu" : session.exec(sql3).all()[0]._mapping['dx'],
        "summary" : objs
    } 