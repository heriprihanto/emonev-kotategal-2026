from typing import Any,List, Dict
import uuid
from uuid_extensions import uuid7, uuid7str
from app.models.kinerja import RfkRealKeu,CreateLaporanTw,UpdateIndikator,RenjaIndikatorRealisasi,PostUpdateIndikator, TaRencanaKinerja
import logging
from sqlalchemy import text
from fastapi import APIRouter,UploadFile, File, status,Request
from app.core.deps import CurrentUser, SessionDep, handle_errordb, RowstoDicts
import datetime
from fastapi.exceptions import HTTPException
from sqlmodel import select
import shutil
import os


from pathlib import Path



logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()



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

@router.get("/opd")
def read_opd(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'

    if role_id > 3:
        sql = text(f"SELECT * from v_opd_kinerja where id_sub_pd IN ( SELECT unnest( opds )  FROM sso_users where id= :userid)").bindparams(userid=userid)
    else :
        sql = text(f"SELECT * from v_opd_kinerja")

    try:
        result = session.exec(sql).all()
        if not result:
            return []
        return RowstoDicts(result)
    except Exception as e:
        logger.error(f"Error saat membaca OPD: {e}")
        raise HTTPException(status_code=500, detail="Gagal membaca data OPD")

@router.get("/laporantw")
def laporantw(
    session: SessionDep, current_user: CurrentUser,ptahun:int,pid_sub_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    sql = text(f"select * from ta_laporan_eval_renja where id_sub_pd = :pid_sub_pd and tahun= :ptahun order by tw asc").bindparams(pid_sub_pd=pid_sub_pd,ptahun=ptahun)
    try:
        result = session.exec(sql).all()
        if not result:
            return []
        return RowstoDicts(result)
    except Exception as e:
        logger.error(f"Error saat membaca OPD: {e}")
        raise HTTPException(status_code=500, detail="Gagal membaca data OPD")
    


@router.post("/create-laporantw")
def createlaporantriwulan(session: SessionDep, current_user: CurrentUser, xpost:CreateLaporanTw) -> Any:
   
    rtws=["","Triwulan I (Satu)","Triwulan II (Dua)","Triwulan III (Tiga)","Triwulan IV (Empat)"]
    tws = rtws[xpost.tw]    
    tgl1 = datetime.datetime.now()
    user1 = current_user.display_name
    tw = xpost.tw
    idpd = xpost.id_sub_pd

    
    exist_renkin = session.exec(
        select(TaRencanaKinerja).where(
            (TaRencanaKinerja.id_sub_pd == idpd) &
            (TaRencanaKinerja.v2 == 1)
        )
    ).first()

    if not exist_renkin :
        raise HTTPException(
                status_code=400,
                detail={"success": False, 0: {"msg": "Rencana Kinerja Belum Dibuat /<br> Belum diapprove Admin BAPPERIDA!"}}
        )


    
    existing = session.exec(
        select(CreateLaporanTw).where(
            (CreateLaporanTw.id_sub_pd == xpost.id_sub_pd) &
            (CreateLaporanTw.tahun == xpost.tahun) &
            (CreateLaporanTw.tw == xpost.tw)
        )
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Data laporan dengan data (id_sub_pd, tahun, tw) sudah ada."
        )
    
    
    new_laporan = CreateLaporanTw(
        id_sub_pd=xpost.id_sub_pd,
        tahun=xpost.tahun,
        tw=xpost.tw,
        tws=tws,
        tgl1=tgl1,
        user1=user1,
        user_s1=current_user.username
    )

    #try:
    #with session.begin():
    session.add(new_laporan)
    session.commit()
    session.refresh(new_laporan)

    return {"success": True,"byuser": user1}
   

@router.delete("/deletelaporan/{id}")
def delete_laporan_triwulan(
    id: int,
    session: SessionDep,
    current_user: CurrentUser
) -> Any:
    """
    Hapus data laporan triwulan berdasarkan ID.
    """
    # Cari data berdasarkan ID
    laporan = session.get(CreateLaporanTw, id)

    if not laporan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Laporan dengan ID {id} tidak ditemukan."
        )

    try:
        session.delete(laporan)
        session.commit()

        return {
            "success": True,
            "message": f"Laporan triwulan dengan ID {id} berhasil dihapus.",
            "deleted_by": current_user.display_name
        }

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal menghapus data: {str(e)}"
        )


@router.get("/subpd")
def read_sub_opd(
    session: SessionDep, current_user: CurrentUser,ptahun:int,pid_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    sql = text(f"select * from ta_opd where id_pd = :pid_pd order by kode asc").bindparams(pid_pd=pid_pd)
    try:
        result = session.exec(sql).all()
        if not result:
            return []
        return RowstoDicts(result)
    except Exception as e:
        logger.error(f"Error saat membaca OPD: {e}")
        raise HTTPException(status_code=500, detail="Gagal membaca data OPD")

@router.get("/indikator")
def read_indikator_all(
    session: SessionDep, current_user: CurrentUser,ptahun:int,pid_pd:int,pid_sub_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    sql = text(f"select * from v_indikator_all_ts where id_sub_pd = :pid_sub_pd and tahun= :ptahun UNION ALL select * from v_indikator_all where id_sub_pd = :pid_sub_pd and tahun= :ptahun order by lvl asc,slvl asc").bindparams(pid_sub_pd=pid_sub_pd,ptahun = ptahun)
    result = session.exec(sql).all()
    rows = [dict(row._mapping) for row in result] 
    return rows

@router.get("/getindikator/{pid}")
def getindikator(
    session: SessionDep, current_user: CurrentUser,pid:uuid.UUID
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    sql = text(f"""SELECT z.*,
                    string_agg(r.realisasi, '') FILTER (WHERE r.tw = 1) AS ck_tw1,
                    string_agg(r.realisasi, '') FILTER (WHERE r.tw = 2) AS ck_tw2,
                    string_agg(r.realisasi, '') FILTER (WHERE r.tw = 3) AS ck_tw3,
                    string_agg(r.realisasi, '') FILTER (WHERE r.tw = 4) AS ck_tw4,
                    SUM(r.persen_tw) FILTER (WHERE r.tw = 1) AS ck_tgtw1_ps,
                    SUM(r.persen_tw) FILTER (WHERE r.tw = 2) AS ck_tgtw2_ps,
                    SUM(r.persen_tw) FILTER (WHERE r.tw = 3) AS ck_tgtw3_ps,
                    SUM(r.persen_tw) FILTER (WHERE r.tw = 4) AS ck_tgtw4_ps,
                    SUM(r.persen_tahun) FILTER (WHERE r.tw = 1) AS ck_tw1_ps,
                    SUM(r.persen_tahun) FILTER (WHERE r.tw = 2) AS ck_tw2_ps,
                    SUM(r.persen_tahun) FILTER (WHERE r.tw = 3) AS ck_tw3_ps,
                    SUM(r.persen_tahun) FILTER (WHERE r.tw = 4) AS ck_tw4_ps,
                    SUM(r.persen_renstra) FILTER (WHERE r.tw = 1) AS ck_tw1_psx,
                    SUM(r.persen_renstra) FILTER (WHERE r.tw = 2) AS ck_tw2_psx,
                    SUM(r.persen_renstra) FILTER (WHERE r.tw = 3) AS ck_tw3_psx,
                    SUM(r.persen_renstra) FILTER (WHERE r.tw = 4) AS ck_tw4_psx,
                    string_agg(r.masalah, '') FILTER (WHERE r.tw = 1) AS ms1,
                    string_agg(r.masalah, '') FILTER (WHERE r.tw = 2) AS ms2,
                    string_agg(r.masalah, '') FILTER (WHERE r.tw = 3) AS ms3,
                    string_agg(r.masalah, '') FILTER (WHERE r.tw = 4) AS ms4,
                    string_agg(r.upaya, '') FILTER (WHERE r.tw = 1) AS up1,
                    string_agg(r.upaya, '') FILTER (WHERE r.tw = 2) AS up2,
                    string_agg(r.upaya, '') FILTER (WHERE r.tw = 3) AS up3,
                    string_agg(r.upaya, '') FILTER (WHERE r.tw = 4) AS up4,
                    string_agg(r.file, '') FILTER (WHERE r.tw = 1) AS file1,
                    string_agg(r.file, '') FILTER (WHERE r.tw = 2) AS file2,
                    string_agg(r.file, '') FILTER (WHERE r.tw = 3) AS file3,
                    string_agg(r.file, '') FILTER (WHERE r.tw = 4) AS file4,
                    string_agg(r.ket, '') FILTER (WHERE r.tw = 1) AS ket1,
                    string_agg(r.ket, '') FILTER (WHERE r.tw = 2) AS ket2,
                    string_agg(r.ket, '') FILTER (WHERE r.tw = 3) AS ket3,
                    string_agg(r.ket, '') FILTER (WHERE r.tw = 4) AS ket4,
                    string_agg(r.tl, '') FILTER (WHERE r.tw = 1) AS tl1,
                    string_agg(r.tl, '') FILTER (WHERE r.tw = 2) AS tl2,
                    string_agg(r.tl, '') FILTER (WHERE r.tw = 3) AS tl3,
                    string_agg(r.tl, '') FILTER (WHERE r.tw = 4) AS tl4
                    FROM renja_indikator z LEFT JOIN renja_indikator_realisasi r 
                    ON z.id = r.id_indikator WHERE z.id = :pid GROUP BY z.id;""").bindparams(pid=pid)
    try:
        result = session.exec(sql).first()
        if not result:
            raise HTTPException(status_code=404, detail="Indikator tidak ditemukan")
        return dict(result._mapping)
    except Exception as e:
        logger.exception(f"[get_indikator] Gagal membaca indikator pid={pid}")
        raise HTTPException(status_code=500, detail="Gagal membaca data indikator")

@router.get("/anggaran")
def getrealanggaran(
    session: SessionDep, current_user: CurrentUser,ptahun:int,pid_pd:int,pid_sub_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    sql = text(f"SELECT * from v_realisasi_anggaran WHERE id_sub_pd= :pid_sub_pd  and tahun= :ptahun").bindparams(pid_sub_pd=pid_sub_pd,ptahun = ptahun)
    
    try:
        result = session.exec(sql).all()
        if not result:
            return []
        return RowstoDicts(result)
    except Exception as e:
        logger.error(f"Error saat membaca OPD: {e}")
        raise HTTPException(status_code=500, detail="Gagal membaca data OPD")


@router.post("/update-realisasi-anggaran/{col_id}")
def update_real_keu_m(
    session: SessionDep,
    current_user: CurrentUser,
    col_id: int,
    postd: RfkRealKeu
) -> Any:
    """
    Update data realisasi keuangan bulanan atau pagu pada subkegiatan.
    """
    try:
        # --- Validasi dasar
        bulan = col_id - 6
        total_realisasi = sum([
            postd.bln1, postd.bln2, postd.bln3, postd.bln4, postd.bln5, postd.bln6,
            postd.bln7, postd.bln8, postd.bln9, postd.bln10, postd.bln11, postd.bln12
        ])

        if total_realisasi > postd.anggaran:
            raise HTTPException(
                status_code=400,
                detail={"success": False, 0: {"msg": "Realisasi lebih besar dari anggaran!"}}
            )

        # --- Mapping bulan → nilai
        bulan_values = {
            1: postd.bln1, 2: postd.bln2, 3: postd.bln3, 4: postd.bln4,
            5: postd.bln5, 6: postd.bln6, 7: postd.bln7, 8: postd.bln8,
            9: postd.bln9, 10: postd.bln10, 11: postd.bln11, 12: postd.bln12
        }

        nilai = float(bulan_values.get(bulan, 0))

        # --- Mode update pagu (col_id < 7)
        if col_id < 7:
            field_map = {
                3: ("pagu_renja", postd.pagu_renja),
                4: ("pagu_akhir_renstra", postd.anggaran),
                5: ("pagu_akhir_renstra", postd.pagu_akhir_renstra),
                6: ("pagu_capaian_lalu", postd.pagu_capaian_lalu),
            }

            if col_id not in field_map:
                raise HTTPException(status_code=400, detail={"success": False, "msg": "colom id tidak valid untuk update pagu."})

            fieldname, fieldvalue = field_map[col_id]

            sql = text(f"UPDATE renja_subkegiatan SET {fieldname} = :xvalue WHERE idsubkegiatan = :xidsubkegiatan")

            session.execute(sql, {"xvalue": fieldvalue, "xidsubkegiatan": postd.idsubkegiatan})

            session.commit()

            return {"success": True, "updated_field": fieldname, "value": fieldvalue}

        # --- Mode update realisasi (col_id ≥ 7)
        sql = text(f"SELECT * FROM upsert_real_keu(:idsubkegiatan, :id_sub_pd, :tahun, :bulan, :nilai);")

        session.execute(sql, 
        {
            "idsubkegiatan": postd.idsubkegiatan,
            "id_sub_pd": int(postd.id_sub_pd),
            "tahun": int(postd.tahun),
            "bulan": int(bulan),
            "nilai": float(nilai)
        })

        session.commit()

        return {"success": True, "bulan": bulan, "nilai": nilai}

    
    except HTTPException:
        raise  # biarkan FastAPI tangani HTTPException
    except Exception as e:
        # Logging bisa ditambahkan di sini jika diperlukan
        raise HTTPException(
            status_code=500,
            detail={"success": False, 0: {"msg": f"Simpan data gagal: {str(e)}"}}
        )
    


@router.post("/save-data")
def save_data_indikator(session: SessionDep, current_user: CurrentUser, xpost:PostUpdateIndikator) -> Any:
    tgl1 = datetime.datetime.now()
    user1 = current_user.display_name
    id=xpost.id
    payload = xpost.dict(exclude_unset=True)
    try:
        stmt = select(RenjaIndikatorRealisasi).where(
            (RenjaIndikatorRealisasi.id_indikator == xpost.id_indikator) &
            (RenjaIndikatorRealisasi.tw == xpost.tw)
        )
        result = session.exec(stmt).first()

        if not result:
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")

        # Update field
        tw = xpost.tw
        field_map = {
            "realisasi": f"ck_tw{tw}",
            "persen_tw": f"ck_tgtw{tw}_ps",
            "persen_tahun": f"ck_tw{tw}_ps",
            "persen_renstra": f"ck_tw{tw}_psx",
            "file": f"file{tw}",
            "masalah": f"ms{tw}",
            "upaya": f"up{tw}",
            "ket": f"ket{tw}",
            "tl": f"tl{tw}"
        }

        for db_field, model_field in field_map.items():
            if hasattr(xpost, model_field):
                val = getattr(xpost, model_field)
                if val is not None:
                    setattr(result, db_field, val)

        result.userupdate = user1
        result.dateupdated = tgl1

        session.add(result)
        session.commit()
        session.refresh(result)


        
        db_item  = session.get(UpdateIndikator, xpost.id_indikator)
        if not db_item :
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")

    
        allowed_fields = ["tags","ck1","ck2","ck3","ck4","ck5","cp1","cp2","cp3","cp4","cp5","cn1","cn2","cn3","cn4","cn5"]

        xpayload = xpost.dict(exclude_unset=True, exclude={"id"})
        updates = {k: v for k, v in xpayload.items() if k in allowed_fields}

        for key, value in updates.items():
            if value is not None:
                setattr(db_item, key, value)


        session.add(db_item)
        session.commit()
        session.refresh(db_item)


        return {"success": True}
        
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Simpan Data Gagal !!"}})


@router.post("/save-data-verifikasi")
def save_data_indikator_verifikasi(session: SessionDep, current_user: CurrentUser, xpost:PostUpdateIndikator) -> Any:
    tgl1 = datetime.datetime.now()
    user1 = current_user.display_name
    id=xpost.id
    payload = xpost.dict(exclude_unset=True)
    #try:
    stmt = select(RenjaIndikatorRealisasi).where(
        (RenjaIndikatorRealisasi.id_indikator == xpost.id) &
        (RenjaIndikatorRealisasi.tw == xpost.tw)
    )
    result = session.exec(stmt).first()

    if not result:
        raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Data belum diisi !!"}})

    # Update field
    #tw = xpost.tw
    field_map = {
        "verif1": xpost.verif1,
        "verif_user1": user1,
        "dateverif1": tgl1,
        "note1": xpost.note1
    }

    for db_field, val in field_map.items():
        if val is not None:
            setattr(result, db_field, val)


    session.add(result)
    session.commit()
    session.refresh(result)


    return {"success": True}
        
    #except HTTPException:
    #    raise
    #except Exception as e:
    #    session.rollback()
    #    raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Simpan Data Gagal !!"}})



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
    
    try:
        result = session.exec(sql).all()
        if not result:
            return []
        return RowstoDicts(result)
    except Exception as e:
        logger.error(f"Error saat membaca OPD: {e}")
        raise HTTPException(status_code=500, detail="Gagal membaca data OPD")


@router.get("/getformsubmit/{id_pd}/{tw}")
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
  WHERE o.id_sub_pd={id_pd}),
(SELECT 
 count( i.tolok_ukur) as jm_indikator_null
FROM
  public.v_indikator_all i
  INNER JOIN public.ta_opd o ON (i.id_sub_pd = o.id_sub_pd)
  WHERE o.id_sub_pd={id_pd} AND i.ck_tw{tw} IS NULL)""") 
    
    try:
        result = session.exec(sql).all()
        if not result:
            return []
        return RowstoDicts(result)
    except Exception as e:
        logger.error(f"Error saat membaca OPD: {e}")
        raise HTTPException(status_code=500, detail="Gagal membaca data OPD")

@router.post("/submit-laporan")
async def save_verifikasi_opd(session: SessionDep,current_user: CurrentUser,req : Request) -> Any:

    #if "form" in content_type:
    #    params = dict(await req.form())
    #else:
    params = await req.json()

    id_sub_pd = int (params.get("id_sub_pd"))    
    tahun = int (params.get("tahun"))    
    mode = int (params.get("mode")) 
    tw = int (params.get("tw")) 
    try:
       
        if mode == 1:
            sql = text(f"update ta_laporan_eval_renja set locked=1, v2=1, user2= :user1, tgl2=CURRENT_DATE where tahun = :tahun and tw = :tw and id_sub_pd IN (SELECT id_sub_pd from ta_opd  WHERE id_pd = :id_pd)")

            session.execute(sql, {"user1": current_user.username, "id_pd" : id_sub_pd, "tahun" : tahun, "tw" :tw})
            session.commit()
           
        elif mode == 2 :
            verifikasi = params.get("verifikasi") 
            if verifikasi == 0 :
                sql = text(f"update ta_laporan_eval_renja set locked=0, v3=0, v2=0, user2= :user1, tgl3= NULL, tgl2=null where tahun = :tahun and tw = :tw and v2=1 AND id_sub_pd IN (SELECT id_sub_pd from ta_opd  WHERE id_pd = :id_pd)")
            elif verifikasi == 1 :
                sql = text(f"update ta_laporan_eval_renja set v3=1, user3= :user1, tgl3=CURRENT_DATE where v2=1 AND tahun = :tahun and tw = :tw and id_sub_pd IN (SELECT id_sub_pd from ta_opd  WHERE id_pd = :id_pd)")
            elif verifikasi  == 2 :
                sql = text(f"update ta_laporan_eval_renja set locked=0, v3=0, v1=0, v2=0, user2= null, user3=null, tgl2=null, tgl3=NULL where tahun = :tahun and tw = :tw and v2=1 AND id_sub_pd IN (SELECT id_sub_pd from ta_opd  WHERE id_pd = :id_pd)")
            
            session.execute(sql, {"user1": current_user.username, "id_pd" : id_sub_pd, "tahun" : tahun, "tw" :tw})
            session.commit()
            
       
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":f"Gagal Verifikasi Capaian Kinerja  !! {verifikasi}"}})



@router.post("/verifikasi-laporan")
def createlapbulananverifikasi(session: SessionDep, current_user: CurrentUser, xpost:CreateLaporanTw) -> Any:
   
    rtws=["","Triwulan I (Satu)","Triwulan II (Dua)","Triwulan III (Tiga)","Triwulan IV (Empat)"]
    tws = rtws[xpost.tw]    
    tgl1 = datetime.datetime.now()
    user1 = current_user.display_name
    locked= xpost.locked
    
    try:
        sql = text(f"""UPDATE ta_laporan_eval_renja set locked={locked}, v3=1, user3='{user1}', tgl3= '{tgl1}' where id_pd= {xpost.id_pd} and tw = {xpost.tw} and tahun= {xpost.tahun};""") 
        session.exec(sql)
        session.commit()
        
        return {"success": True,"byuser": user1}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Kirim laporan Gagal !!"}})


@router.post("/uploadevidence")
async def upload_single_file(file: UploadFile = File(...)):
    """Upload a single file with basic validation"""
    if file.filename == "":
        raise HTTPException(status_code=400, detail="No file selected")

    UPLOAD_DIR = Path("UPLOADS")

    allowed_types = {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"  # .docx
    }

    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail={"success":False,0:{"msg":f"File type '{file.content_type}' not allowed"}})
        
    _, ext = os.path.splitext(file.filename)
    ext = ext.lower()
    new_filename = f"{uuid7str()}{ext}"

    file_path = UPLOAD_DIR / new_filename

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500,detail={"success":False,0:{"msg":f"Error saving file: {e}"}} )
    finally:
        file.file.close()

    # 📏 Ambil ukuran file
    size = file_path.stat().st_size

    # ✅ Return hasil upload
    return {
        "success": True,
        "original_filename": file.filename,
        "stored_filename": new_filename,
        "content_type": file.content_type
    }


@router.get("/dashboardinfo")
def read_dashboard_info(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'
    pid_pd = int(current_user.opds[0])
    
    if role_id > 3:
        sql = f"SELECT (SELECT sum(anggaran)  from renja_subkegiatan WHERE id_sub_pd = {pid_pd})  as pagu,(SELECT sum(realisasi) as realisasi from ta_renja_subkegiatan_realisasi  WHERE id_sub_pd = {pid_pd}) as realisasi"
    else :
        sql = f"SELECT (SELECT sum(anggaran)  from renja_subkegiatan) as pagu,(SELECT sum(realisasi) as realisasi from ta_renja_subkegiatan_realisasi)  as realisasi"
    #return sql
    #try:
    result = session.exec(text(sql)).all()
    if not result:
        return []
    return RowstoDicts(result)
    #except Exception as e:
    #    logger.error(f"Error saat membaca OPD: {e}")
    #    raise HTTPException(status_code=500, detail="Gagal membaca data OPD")   
    


@router.get("/opdverified")
def ref_opd_verified(
    session: SessionDep, current_user: CurrentUser, id_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'

    sql = text(f"""SELECT t.kode,t.nama_pd, i.id_sub_pd,count(i.tolok_ukur) as jml_indikator, COUNT(*) FILTER (WHERE length(r.realisasi) > 0) AS jml_indikator_isi,
                    ROUND(COUNT(*) FILTER (WHERE length(r.realisasi) > 0)::numeric/ NULLIF(COUNT(*),0) * 100,2) AS persen_isi
                    FROM
                    public.renja_indikator_realisasi r
                    RIGHT OUTER JOIN public.renja_indikator i ON (r.id_indikator = i.id)
                    JOIN ta_opd t 
                                    ON i.id_sub_pd = t.id_sub_pd
                                WHERE t.id_pd = :id_pd
                                GROUP BY t.kode, t.nama_pd, i.id_sub_pd
                                ORDER BY t.kode;""").bindparams(id_pd=id_pd) 
    results = session.exec(sql).all()
    return RowstoDicts(results)