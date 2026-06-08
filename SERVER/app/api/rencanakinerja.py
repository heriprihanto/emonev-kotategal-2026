from typing import Any,List, Dict
import uuid
from uuid_extensions import uuid7, uuid7str
from app.models.kinerja import RfkRealKeu,CreateLaporanTw,UpdateIndikator, TaPersonelKeg, TaRencanaKinerja
import logging
from sqlalchemy import text
from fastapi import APIRouter,Request
from app.core.deps import CurrentUser, SessionDep, RowstoDicts, handle_errordb
import datetime
from fastapi.exceptions import HTTPException
from app.core.chainfilter import ChainFilter
from sqlmodel import select

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

    if role_id > 3:
        sql = text(f"SELECT * from v_opd_rencanakinerja where id_sub_pd IN ( SELECT unnest( opds )  FROM sso_users where id= :userid)").bindparams(userid=userid)
    else :
        sql = text(f"SELECT * from v_opd_rencanakinerja")
    
    
    try:
        result = session.exec(sql).all()
        if not result:
            return []
        return RowstoDicts(result)
    except Exception as e:
        handle_errordb(e)


@router.get("/subpd")
def read_sub_opd(
    session: SessionDep, current_user: CurrentUser,ptahun:int,pid_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    sql_query = text(f"select * from ta_opd where id_pd = :pid_pd order by kode asc").bindparams(pid_pd=pid_pd)
    try:
        result = session.exec(sql_query).all()
        if not result:
            return []
        return RowstoDicts(result)
    except Exception as e:
        handle_errordb(e)


@router.get("/tujuansasaran/data")
def read_tujuansasaran(
    session: SessionDep, current_user: CurrentUser,ptahun:int,pid_pd:int,pkode_pd:str
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    
    sql = text(f"SELECT dx from sp_renja_tujuan_sasaran(:pid_pd,:ptahap) as dx").bindparams(pid_pd=pid_pd,ptahap=1) 
    results = session.exec(sql).all()
    return results[0]._mapping['dx']

@router.get("/kegiatanlist/data")
def read_kegiatan(
    session: SessionDep, current_user: CurrentUser,ptahun:int,pid_pd:int,pkode_pd:str,pid_sub_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    
    sql = text(f"SELECT dx from sp_renja_programkegiatansubkegiatan(:pidpd,:ptahun) as dx").bindparams(pidpd=pid_sub_pd,ptahun=ptahun) 
    results = session.exec(sql).all()
    return results[0]._mapping['dx']

@router.get("/indikatorlist")
def read_indikator(
    session: SessionDep, current_user: CurrentUser,ptahun:int,pid:uuid.UUID,plvl:int,pjn:str 
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    sql_query = text(f"select * from renja_indikator where id_parent = :pid order by nomor asc").bindparams(pid=pid)
    try:
        result = session.exec(sql_query).all()
        if not result:
            return []
        return RowstoDicts(result)
    except Exception as e:
        logger.error(f"Error saat membaca Indikator: {e}")
        raise HTTPException(status_code=500, detail="Gagal membaca data Indikator")

@router.get("/ref-tagging")
def ref_tagging(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'

    sql = text(f"select * from ref_tagging order by tag asc") 
    results = session.exec(sql).all()
    return RowstoDicts(results)

@router.get("/getindikator/{pid}")
def getindikator(
    session: SessionDep, current_user: CurrentUser,pid:uuid.UUID
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    sql = text("SELECT * FROM renja_indikator WHERE id = :pid").bindparams(pid=pid)
    try:
        result = session.exec(sql).first()
        if not result:
            raise HTTPException(status_code=404, detail="Indikator tidak ditemukan")

        # ubah Row ke dict (FastAPI otomatis ubah ke JSON saat return)
        return dict(result._mapping)
    except Exception as e:
        logger.exception(f"[get_indikator] Gagal membaca indikator pid={pid}")
        raise HTTPException(status_code=500, detail="Gagal membaca data indikator")


@router.post("/savedata")
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
        session.rollback()
        handle_errordb(e)


@router.get("/personel")
def ref_personel(
    session: SessionDep, current_user: CurrentUser, id_sub_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'

    sql = text(f"select * from sso_users where :idsubpd = ANY(opds) order by display_name asc").bindparams(idsubpd=id_sub_pd) 
    results = session.exec(sql).all()
    return RowstoDicts(results)



@router.post("/save-personel")
async def save_personel(
    session: SessionDep,
    current_user: CurrentUser,
    request: Request
):

    try:
        # ---- READ PARAM ----
        content_type = request.headers.get("content-type", "")
        if "form" in content_type:
            params = dict(await request.form())
        else:
            params = await request.json()

        id_parent = params.get("id_parent")
        lvl = params.get("lvl")

        if lvl is None:
            raise HTTPException(400, "Parameter 'lvl' wajib diisi")

        try:
            lvl = int(lvl)
        except:
            raise HTTPException(400, "Nilai 'lvl' harus berupa angka")

        # ---- CEK EXISTING ----
        existing = session.exec(
            select(TaPersonelKeg).where(
                TaPersonelKeg.id_parent == id_parent,
                TaPersonelKeg.lvl == lvl
            )
        ).first()

        # ------------------------
        #        UPDATE
        # ------------------------
        if existing:
            existing.nip_pptk = params.get("nip_pptk")
            existing.nip_ops = params.get("nip_ops")

            session.add(existing)
            session.commit()
            session.refresh(existing)

            return {
                "success": True,
                "mode": "update",
                "id": str(existing.id)
            }

        # ------------------------
        #        INSERT
        # ------------------------
        data = TaPersonelKeg(
            id_parent=id_parent,
            lvl=lvl,
            nip_pptk=params.get("nip_pptk"),
            nip_ops=params.get("nip_ops")
        )

        session.add(data)
        session.commit()
        session.refresh(data)

        return {
            "success": True,
            "mode": "insert",
            "id": str(data.id)
        }

    except HTTPException:
        raise

    except Exception as e:
        session.rollback()
        handle_errordb(e)


@router.post("/get_form_verifikasi")
async def getindikator(
    session: SessionDep, current_user: CurrentUser,req : Request
) -> Any:
    content_type = req.headers.get("content-type", "")
    if "form" in content_type:
        params = dict(await req.form())
    else:
        params = await req.json()

    id_sub_pd = int (params.get("id_sub_pd"))

    sql = text(f"""SELECT COUNT(*) AS jml_indikator, COUNT(CASE WHEN tg_tw4 IS NOT NULL THEN 1 END) AS jml_indikator_isi FROM renja_indikator WHERE id_sub_pd = :id_sub_pd;
                """).bindparams(id_sub_pd=id_sub_pd)
    try:
        result = session.exec(sql).first()
        if not result:
            raise HTTPException(status_code=404, detail="Indikator tidak ditemukan")

        # ubah Row ke dict (FastAPI otomatis ubah ke JSON saat return)
        return dict(result._mapping)
    except Exception as e:
        logger.exception(f"[get_indikator] Gagal membaca indikator pid={pid}")
        raise HTTPException(status_code=500, detail="Gagal membaca data indikator")


@router.post("/save-verifikasi-opd")
async def save_verifikasi_opd(session: SessionDep,current_user: CurrentUser,req : Request) -> Any:

    #if "form" in content_type:
    #    params = dict(await req.form())
    #else:
    params = await req.json()

    id_sub_pd = int (params.get("id_sub_pd"))    
    tahun = int (params.get("tahun"))    
    mode = int (params.get("mode")) 
    try:
       
        if mode == 1:
            sql = text(f"update ta_rencana_kinerja set v1=1, user1= :user1, tgl1=CURRENT_DATE where id_sub_pd IN (SELECT id_sub_pd from ta_opd  WHERE id_pd = :id_pd)")

            session.execute(sql, {"user1": current_user.username, "id_pd" : id_sub_pd})
            session.commit()
           
        elif mode == 2 :
            verifikasi = params.get("verifikasi") 
            if verifikasi == 0 :
                sql = text(f"update ta_rencana_kinerja set v2=0, user2= :user1, tgl1=CURRENT_DATE where id_sub_pd IN (SELECT id_sub_pd from ta_opd  WHERE id_pd = :id_pd)")
            elif verifikasi == 1 :
                sql = text(f"update ta_rencana_kinerja set v2=1, user2= :user1, tgl1=CURRENT_DATE where id_sub_pd IN (SELECT id_sub_pd from ta_opd  WHERE id_pd = :id_pd)")
            elif verifikasi  == 2 :
                sql = text(f"update ta_rencana_kinerja set v1=0, v2=0, user2= :user1, tgl1=CURRENT_DATE where id_sub_pd IN (SELECT id_sub_pd from ta_opd  WHERE id_pd = :id_pd)")
            
            session.execute(sql, {"user1": current_user.username, "id_pd" : id_sub_pd})
            session.commit()
            
       
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":f"Gagal Verifikasi Rencana Kinerja  !! {verifikasi}"}})


@router.get("/opdverified")
def ref_opd_verified(
    session: SessionDep, current_user: CurrentUser, id_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'

    sql = text(f"""SELECT t.kode,t.nama_pd, COUNT(*) AS jml_indikator,COUNT(*) FILTER (WHERE ri.tg_tw4 IS NOT NULL) AS jml_indikator_isi,
                ROUND(
                    COUNT(*) FILTER (WHERE ri.tg_tw4 IS NOT NULL)::numeric
                    / NULLIF(COUNT(*),0) * 100,
                    2
                ) AS persen_isi
            FROM renja_indikator ri
            JOIN ta_opd t 
                ON ri.id_sub_pd = t.id_sub_pd
            WHERE t.id_pd = :id_pd
            GROUP BY t.kode, t.nama_pd
            ORDER BY t.kode;""").bindparams(id_pd=id_pd) 
    results = session.exec(sql).all()
    return RowstoDicts(results)