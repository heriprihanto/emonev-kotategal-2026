from typing import Any


import logging
from uuid_extensions import uuid7str

from sqlalchemy import text

from fastapi import APIRouter, HTTPException

from app.core.deps import CurrentUser, SessionDep, TahunAnggaran, rows_to_dicts
from app.models.personel import Personel

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
    tahun =TahunAnggaran
    criteria=""
    if role_id >3:
        opds = ','.join(map(str, current_user.opds))
        criteria = text(f""" where o.id_sub_pd IN ({ opds})""")
    else :
        criteria = ""

    sql = text(f"""select x.* from (SELECT o.kode,o.id_pd,o.id_sub_pd,o.nama_pd,COALESCE( sk.jm_person,0) as jm_person from ta_opd o
        left join (SELECT id_sub_pd,count(*) as jm_person FROM ta_personel  GROUP BY id_sub_pd) sk ON (o.id_sub_pd=sk.id_sub_pd) {criteria} 
        order by kode asc)x """) 
    
    results = session.exec(sql).all()
    return rows_to_dicts(results)


@router.get("/data")
def read_personel(
    session: SessionDep, current_user: CurrentUser, ptahun:int,pid_sub_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    tahun=TahunAnggaran
    sql = text(f"""SELECT * FROM ta_personel where id_sub_pd={pid_sub_pd}""") 
    results = session.exec(sql).all()
    return rows_to_dicts(results)


@router.post("/save-data")
def update_data(*, session: SessionDep, current_user: CurrentUser, item_in: Personel) -> Any:
    try:
        id=item_in.id
        if (id==0) :
            item_data = item_in.model_dump(exclude_unset=True)
            item_data["id"] = None
            item = Personel.model_validate(item_data)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}
         
        else :             
            item = session.get(Personel, id)
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
    


@router.delete("/delete/{id}")
def delete_item(session: SessionDep,current_user: CurrentUser, id: int) -> Any:
    try:
        
        item = session.get(Personel, id)

        if not item:
            raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Gagal hapus data  !!"}})
        session.delete(item)
        session.commit()
        return {"success": True,"message":"Data Berhasil Dihapus"}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal hapus data  !!"}})