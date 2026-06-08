from typing import Any

import logging

from sqlalchemy import text

from fastapi import APIRouter

from app.core.deps import SessionDep

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()



@router.get("/opd")
def read_opd(
    session: SessionDep
    #, current_user: CurrentUser
) -> Any:
    sql = text("SELECT * from ta_opd order by kode") 
    results = session.exec(sql).all()
    objs= [
            {
                "id_sub_pd": data[0],
                "id_pd": data[1],
                "kode": data[2],
                "nama_pd": data[3],
            }
            for data in results
        ]
    return objs


