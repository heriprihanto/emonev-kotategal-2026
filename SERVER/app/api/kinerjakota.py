from typing import Any
import uuid
from uuid_extensions import uuid7, uuid7str
from app.models.kinerja import RfkRealKeu,CreateLaporanTw,UpdateIndikator
import logging
from sqlalchemy import text
from fastapi import APIRouter
from app.core.deps import CurrentUser, SessionDep
import datetime

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()

@router.get("/indikator")
def read_indikator_all(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    sql = text(f"""SELECT json_agg(row_to_json(t)) as dx FROM (select * from v_indikator_all where lvl < 3 order by lvl asc,idindikator asc)t""")
    results = session.exec(sql).all()
    return results[0]._mapping['dx']

@router.get("/getindikator/{pid}")
def getindikator(
    session: SessionDep, current_user: CurrentUser,pid:uuid.UUID
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    sql = text(f"""SELECT json_agg(row_to_json(t)) as dx FROM (select * from ta_renja_indikator where id = :pid)t""").bindparams(pid = pid)
    results = session.exec(sql).all()
    return results[0]._mapping['dx'][0]


@router.get("/anggaran")
def getrealanggaran(
    session: SessionDep, current_user: CurrentUser,ptahun:int,pid_pd:int,pid_sub_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    sql = text(f"""SELECT json_agg(row_to_json(t)) as dx FROM (SELECT * from v_realisasi_anggaran WHERE id_sub_pd= :pid_sub_pd  and tahun= :ptahun)t""").bindparams(pid_sub_pd=pid_sub_pd,ptahun = ptahun)
    results = session.exec(sql).all()
    return results[0]._mapping['dx']


@router.post("/update-realisasi-anggaran/{col_id}")
def update_real_keu_m(
    session: SessionDep, current_user: CurrentUser,col_id: int,postd: RfkRealKeu
) -> Any:
    bulan = col_id - 6
    nilai = 0
    total = postd.bln1 + postd.bln2 + postd.bln3 + postd.bln4 + postd.bln5 + postd.bln6 + postd.bln7 + postd.bln8 + postd.bln9 + postd.bln10 + postd.bln11 + postd.bln12
    if total > postd.anggaran:
        raise  HTTPException(status_code=400, detail={"success":False,0:{"msg":"Realisasi Lebih Besar dari Anggaran !!"}})
    match bulan:
        case 1:
            nilai = float(postd.bln1)
        case 2:
            nilai = float(postd.bln2)
        case 3:
            nilai = float(postd.bln3)
        case 4:
            nilai = float(postd.bln4)
        case 5:
            nilai = float(postd.bln5)
        case 6:
            nilai = float(postd.bln6)
        case 7:
            nilai = float(postd.bln7)
        case 8:
            nilai = float(postd.bln8)
        case 9:
            nilai = float(postd.bln9)
        case 10:
            nilai = float(postd.bln10)
        case 11:
            nilai = float(postd.bln11)
        case 12:
            nilai = float(postd.bln12)
    try:
        if col_id < 7 :
            if col_id == 3:
                fieldname = 'pagu_renja' 
                fieldvalue = xpost.pagu_renja
            elif col_id == 4:
                fieldname = 'pagu_akhir_renstra'
                fieldvalue = xpost.anggaran
            elif col_id == 5:
                fieldname = 'pagu_akhir_renstra'
                fieldvalue = xpost.pagu_akhir_renstra
            elif col_id == 6:
                fieldname = 'pagu_capaian_lalu' 
                fieldvalue = xpost.pagu_capaian_lalu


            sql = text(f"""UPDATE ta_renja_subkegiatan set {fieldname} = {fieldvalue} where idsubkegiatan={idsubkegiatan};""")     
            session.exec(sql)
            session.commit()
            return {"success": True}
            
        else :

            sql = text(f"""SELECT * FROM public.upsert_real_keu('{postd.idsubkegiatan}', {postd.id_sub_pd}, {postd.tahun}, {bulan}, {nilai});""")
            session.exec(sql)
            session.commit()

            return {"success": True}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Simpan Data Gagal !!"}})


@router.post("/save-data")
def save_data_indikator(session: SessionDep, current_user: CurrentUser, xpost:UpdateIndikator) -> Any:
    tgl1 = datetime.datetime.now()
    user1 = current_user.display_name
    id=xpost.id
    try:
        item = session.get(UpdateIndikator, id)
        if not item:
            raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Item Not Found !!"}})
        update_dict = xpost.model_dump(exclude_unset=True)

        item.sqlmodel_update(update_dict)
        session.add(item)
        session.commit()
        session.refresh(item)
        return {"success": True}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Simpan Data Gagal !!"}})


@router.get("/getjmlindikator")
def getjmlindikator(
    session: SessionDep, current_user: CurrentUser, id_pd:int, tw:int
) -> Any:
    role_id=current_user.role_id
    
    sql = text(f"""SELECT {id_pd} as id_pd,
(SELECT 
 count( i.tolok_ukur) as jm_indikator
FROM
  public.v_indikator_all i
  INNER JOIN public.ta_opd o ON (i.id_sub_pd = o.id_sub_pd)
  WHERE o.id_pd={id_pd}),
(SELECT 
 count( i.tolok_ukur) as jm_indikator_null
FROM
  public.v_indikator_all i
  INNER JOIN public.ta_opd o ON (i.id_sub_pd = o.id_sub_pd)
  WHERE o.id_pd={id_pd} AND i.ck_tw{tw} IS NULL)""") 
    
    results = session.exec(sql).all()
    #print (results)
    objs= [
            {
                "id_pd": data[0],
                "jm1": data[1],
                "jm2": data[2]
            }
            for data in results
        ]
    return objs[0]
    