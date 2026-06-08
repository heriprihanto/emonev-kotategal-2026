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
from app.models.opd import TaOpd
from app.models.rfk import LaporanBulanan,CreateLaporanBulanan, Rfk, UpdateRfk, RfkRealKeu, KirimLaporan
from app.core.whatsapp import sendto_rabbitmq

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

    criteria=""
    #if role_id >3:
        #sql = text(f"""SELECT kode,id_pd,id_sub_pd,nama_pd from ta_opd where is_pd=1 and id_sub_pd IN (SELECT id_sub_pd from ta_user_access where userid={userid} and appname='{strapp}') order by kode asc""") 
        #sql = " where x.id_sub_pd IN ({ opds})""")
    #else :
        #sql = text(sqla)

    sql = text("SELECT kode,id_pd,id_sub_pd,nama_pd from ta_opd order by kode asc") 

    results = session.exec(sql).all()
    #print (results)
    objs= [
            {
                "kode": data[0],
                "id_pd": data[1],
                "id_sub_pd": data[2],
                "nama_pd": data[3]
            }
            for data in results
        ]
    return objs

@router.get("/rfkopd")
def read_opd(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'

    #sql = text("SELECT kode,id_pd,id_sub_pd,nama_pd from ta_opd where is_pd=1 order by kode asc") 
    if role_id >3:
        opds = ','.join(map(str, current_user.opds))
        sql = text(f"""SELECT json_agg(row_to_json(t)) as dx FROM (select * from v_opd_rfk where id_sub_pd IN ({ opds}))t""") 
    else :
        sql = text(f"""SELECT json_agg(row_to_json(t)) as dx FROM (select * from v_opd_rfk)t""") 
    results = session.exec(sql).all()
    return results[0]._mapping['dx']

@router.get("/lapbulan")
def read_lapbulanan(
    session: SessionDep, current_user: CurrentUser,pid_sub_pd: int
) -> Any:
    stmt = select(LaporanBulanan).where(LaporanBulanan.id_sub_pd==pid_sub_pd).order_by(LaporanBulanan.bulan)        
    results = session.exec(stmt).all() 
    return results




@router.post("/createlapbulanan")
def createlapbulanan(session: SessionDep, current_user: CurrentUser, xpost:CreateLaporanBulanan) -> Any:
   
    rbulan=["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]
    
    int_bulan=xpost.bulan
    int_bulan_n1=int_bulan-1
    nbulan=rbulan[int_bulan_n1]
    str_bulan = rbulan[int_bulan]
    tgl_buat = datetime.datetime.now()
    user_buat = xpost.username

    sql_verify = text("""
        SELECT v.v2
        FROM public.ta_laporan_rko v
        JOIN public.ref_tahap t ON v.kd_tahap = t.kd_tahap
        JOIN public.ref_bulan_tahap b ON t.kd_tahap = b.kd_tahap
        WHERE v.id_sub_pd = :id_sub_pd
          AND b.bulan = :bulan AND v.v2 > 0
        LIMIT 1
    """).bindparams(id_sub_pd=xpost.pid_sub_pd,bulan=int_bulan)

    res_verify = session.exec(sql_verify).first()

    if not res_verify:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"RFK Tidak dapat dibuat ! karena RKO Belum diverifikasi !!"}})
    

    sql_check_rfk = text("""
        SELECT 1
        FROM ta_laporan_rfk
        WHERE id_sub_pd = :id_sub_pd
          AND bulan = :bulan
        LIMIT 1
    """).bindparams(id_sub_pd=xpost.pid_sub_pd,bulan=int_bulan)

    exists = session.exec(sql_check_rfk).first()

    if exists:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"RFK bulan ini sudah dibuat !!"}})
    

    try:
        sql = text(f"""
                    BEGIN;
                    INSERT INTO ta_laporan_rfk (id_sub_pd,bulan,str_bulan,tgl_buat,user_buat) VALUES({xpost.pid_sub_pd},{int_bulan},'{str_bulan}','{tgl_buat}','{user_buat}');
                    INSERT INTO ta_pekerjaan_realisasi (id_sub_pd,id_pekerjaan,bulan,keuangan,fisik,keuangan_lalu,fisik_lalu,masalah,upaya) SELECT p.id_sub_pd,p.id,{int_bulan},0,COALESCE(pr.fisik,0),(COALESCE(pr.keuangan,0)+COALESCE(pr.keuangan_lalu,0)), COALESCE(pr.fisik,0),pr.masalah,pr.upaya FROM public.ta_pekerjaan p LEFT JOIN (SELECT r.* FROM public.ta_pekerjaan_realisasi r WHERE r.bulan={int_bulan_n1}) pr ON (p.id = pr.id_pekerjaan) WHERE p.id_sub_pd={xpost.pid_sub_pd};
                    COMMIT;
                    """) 
        session.exec(sql)
        session.commit()
        
        return {"success": True,"byuser": user_buat}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Simpan Data Gagal !!"}})




        

@router.delete("/delete-rfk/{id}")
def delete_rko_item(session: SessionDep,current_user: CurrentUser, id: int) -> Any:
    try:
        
        item = session.get(LaporanBulanan, id)

        if not item:
            raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Gagal hapus data  !!"}})
        session.delete(item)
        session.commit()
        return {"success": True,"message":"Data Berhasil Dihapus"}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal hapus data  !!"}})
    
@router.get("/data")
def read_data_rfk(
    session: SessionDep, current_user: CurrentUser,pid_sub_pd: int,ptahun:int,pbulan:int
) -> Any:
    sql = text(f"""SELECT dx from sp_rfk({pid_sub_pd},{ptahun},{pbulan}) as dx""") 
    results = session.exec(sql).all()
    return results[0]._mapping['dx']


@router.post("/save-rfk")
def update_realisasi_pekerjaan(*, session: SessionDep, current_user: CurrentUser, item_in: UpdateRfk) -> Any:
    try:
        id=item_in.id_realisasi
             
        item = session.get(Rfk, id)
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
    

@router.get("/getverify")
def getverify(
    session: SessionDep, current_user: CurrentUser,id_sub_pd: int,tahun:int,bulan:int
) -> Any:
    sql = text(f"""SELECT (row_to_json(t)) as dx FROM (
               SELECT (SELECT sum(keuangan) as realpek FROM ta_pekerjaan_realisasi where id_sub_pd={id_sub_pd} and bulan <={bulan}),
               COALESCE( (SELECT sum(realisasi) as realkeu FROM ta_renja_subkegiatan_realisasi where id_sub_pd={id_sub_pd} and bulan <={bulan}),0) as realkeu)t""") 
    results = session.exec(sql).all()
    return results[0]._mapping['dx']


@router.get("/fotolist")
def read_lapbulanan(
    session: SessionDep, current_user: CurrentUser,pid_pekerjaan: uuid.UUID
) -> Any:
    
    return {"results":True}


@router.get("/realkeuangan")
def read_indikator(
    session: SessionDep, current_user: CurrentUser,pid_pd: int,pid_sub_pd: int,ptahun: int
) -> Any:
    sql = text(f""" SELECT json_agg(row_to_json(t)) as dx FROM
                (SELECT sk.idsubkegiatan,sk.tahun,sk.id_sub_pd,sk.kode_program,sk.nm_program,sk.kode_kegiatan,sk.nm_kegiatan,sk.kode_sub_kegiatan,sk.nm_sub_kegiatan,sk.anggaran,sk.pagu_renja,sk.pagu_akhir_renstra,sk.pagu_capaian_lalu,
                    concat(sk.kode_program,' ',sk.nm_program) as program,
                    concat(sk.kode_kegiatan,' ',sk.nm_kegiatan) as kegiatan,
                    concat(sk.kode_sub_kegiatan,' ',sk.nm_sub_kegiatan) as subkegiatan,
                    COALESCE(rr.b1,0)as bln1,  
                    COALESCE(rr.b2,0)as bln2,
                    COALESCE(rr.b3,0)as bln3,
                    COALESCE(rr.b4,0)as bln4,
                    COALESCE(rr.b5,0)as bln5,
                    COALESCE(rr.b6,0)as bln6,
                    COALESCE(rr.b7,0)as bln7,
                    COALESCE(rr.b8,0)as bln8,
                    COALESCE(rr.b9,0)as bln9,
                    COALESCE(rr.b10,0)as bln10,
                    COALESCE(rr.b11,0)as bln11,
                    COALESCE(rr.b12,0)as bln12,
                    COALESCE ((rr.b1+rr.b2+rr.b3+rr.b4+rr.b5+rr.b6+rr.b7+rr.b8+rr.b9+rr.b10+rr.b11+rr.b12),0) as total_real
                    FROM
                    public.ta_renja_subkegiatan sk 
                    LEFT JOIN 
                    (SELECT r.idsubkegiatan,r.tahun,
                    SUM (CASE WHEN r.bulan=1 THEN r.realisasi ELSE 0 END) as b1,
                    SUM (CASE WHEN r.bulan=2 THEN r.realisasi ELSE 0 END) as b2,
                    SUM (CASE WHEN r.bulan=3 THEN r.realisasi ELSE 0 END) as b3,
                    SUM (CASE WHEN r.bulan=4 THEN r.realisasi ELSE 0 END) as b4,
                    SUM (CASE WHEN r.bulan=5 THEN r.realisasi ELSE 0 END) as b5,
                    SUM (CASE WHEN r.bulan=6 THEN r.realisasi ELSE 0 END) as b6,
                    SUM (CASE WHEN r.bulan=7 THEN r.realisasi ELSE 0 END) as b7,
                    SUM (CASE WHEN r.bulan=8 THEN r.realisasi ELSE 0 END) as b8,
                    SUM (CASE WHEN r.bulan=9 THEN r.realisasi ELSE 0 END) as b9,
                    SUM (CASE WHEN r.bulan=10 THEN r.realisasi ELSE 0 END) as b10,
                    SUM (CASE WHEN r.bulan=11 THEN r.realisasi ELSE 0 END) as b11,
                    SUM (CASE WHEN r.bulan=12 THEN r.realisasi ELSE 0 END) as b12
                    FROM public.ta_renja_subkegiatan_realisasi r GROUP BY r.idsubkegiatan,r.tahun
                    )rr ON (sk.idsubkegiatan = rr.idsubkegiatan) AND (sk.tahun=rr.tahun)
                    WHERE sk.id_sub_pd={pid_sub_pd}  and sk.tahun={ptahun}
                    ORDER BY sk.kode_program, sk.kode_kegiatan,sk.kode_sub_kegiatan)t
                """) 
    results = session.exec(sql).all()
    return results[0]._mapping['dx']


@router.post("/update-real-keu-m/{idx}")
def update_real_keu_m(
    session: SessionDep, current_user: CurrentUser,idx: int,postd: RfkRealKeu
) -> Any:
    bulan = idx - 7
    nilai = 0
    total = postd.rjan + postd.rfeb + postd.rmar + postd.rapr + postd.rmei + postd.rjun + postd.rjul + postd.ragu + postd.rsep + postd.rokt + postd.rnov + postd.rdes
    if total > postd.anggaran:
        raise  HTTPException(status_code=400, detail={"success":False,0:{"msg":"Realisasi Lebih Besar dari Anggaran !!"}})
    match bulan:
        case 1:
            nilai = float(postd.rjan)
        case 2:
            nilai = float(postd.rfeb)
        case 3:
            nilai = float(postd.rmar)
        case 4:
            nilai = float(postd.rapr)
        case 5:
            nilai = float(postd.rmei)
        case 6:
            nilai = float(postd.rjun)
        case 7:
            nilai = float(postd.rjul)
        case 8:
            nilai = float(postd.ragu)
        case 9:
            nilai = float(postd.rsep)
        case 10:
            nilai = float(postd.rokt)
        case 11:
            nilai = float(postd.rnov)
        case 12:
            nilai = float(postd.rdes)
    try:
        sql = text(f"""SELECT * FROM public.upsert_real_keu('{postd.idsubkegiatan}', {postd.id_sub_pd}, 2026, {bulan}, {nilai});""")
        session.exec(sql)
        session.commit()

        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Simpan Data Gagal !!"}})
    

@router.post("/kirimlaporan")
def kirimlaporan(
    session: SessionDep, current_user: CurrentUser,postd:KirimLaporan
) -> Any:
    user = current_user.display_name
    tgl_kirim = datetime.datetime.now()
    idl = postd.id_laporan

    if postd.rkeu < 1 :
            raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Realisasi Keuangan Masih 0  !!"}})
    
    if postd.fmis < 1 :
            raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Realisasi Keuangan Masih 0  !!"}})

    try:
        sql = text(f"""UPDATE ta_laporan_rfk SET user_kirim='{user}', tgl_kirim='{tgl_kirim}', lock=1 WHERE id={idl};""")
        session.exec(sql)
        session.commit()

        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Simpan Data Gagal !!"}})

'''    
@router.post("/verifikasilaporan/{mode}/{id}")
def verifikasilaporan(
    session: SessionDep, current_user: CurrentUser,mode:str,id:int
) -> Any:
    user = current_user.display_name
    tgl_verify = datetime.datetime.now()
    tahun=2026
    
    try:
        if mode == 'verify':
            sql = text(f"""UPDATE ta_laporan_rfk SET user_verify='{user}', tgl_verify='{tgl_verify}', verified=1 WHERE id={id} and lock=1;""")
            
            sqlphone = text(f"""SELECT r.user_buat,u.no_telp,o.kode,o.nama_pd,r.id_sub_pd,r.str_bulan FROM public.ta_laporan_rfk r INNER JOIN public.sso_users u ON ( rtxt(r.user_buat) = rtxt(u.display_name)) INNER JOIN public.ta_opd o ON (r.id_sub_pd = o.id_sub_pd) WHERE r.id={id}""") 
            rst_lp = session.exec(sqlphone).all()
            nophone =  rst_lp[0]._mapping['no_telp']
            namauser = rst_lp[0]._mapping['user_buat']
            namaopd = rst_lp[0]._mapping['nama_pd']
            bulan = rst_lp[0]._mapping['str_bulan']

            sendto_rabbitmq({"nophone":nophone,"message":f"""Hai {namauser}, Laporan RFK {namaopd} bulan {bulan} sudah diverifikasi oleh Admin SIMLABA .""","users":"Admin"})
        
        else:
            sql = text(f"""UPDATE ta_laporan_rfk SET user_verify='', tgl_kirim=NULL,tgl_verify=NULL, verified=0, lock=0 WHERE id={id} and lock=1;""")
        session.exec(sql)
        session.commit()

        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Simpan Data Gagal !!"}})

'''


@router.post("/verifikasilaporan/{mode}/{id}")
def verifikasilaporan(session: SessionDep, current_user: CurrentUser, mode: str, id: int) -> Any:
    user = current_user.display_name
    tgl_verify = datetime.datetime.now()

    #try:
    if mode == "verify":
        # Update dulu
        sql_update = text("""
            UPDATE ta_laporan_rfk
            SET user_verify = :user, tgl_verify = :tgl_verify, verified = 1
            WHERE id = :id AND lock = 1
        """).bindparams(user=user,tgl_verify=tgl_verify,id=id)
        result = session.exec(sql_update)
        session.commit()
        #if result.rowcount == 0:
        #    raise HTTPException(status_code=404, detail="Data tidak ditemukan atau tidak terkunci")

        # Ambil data untuk notifikasi
        '''
        sqlphone = text("""
            SELECT r.user_buat, u.no_telp, o.nama_pd, r.str_bulan
            FROM public.ta_laporan_rfk r
            INNER JOIN public.sso_users u ON (rtxt(r.user_buat) = rtxt(u.display_name))
            INNER JOIN public.ta_opd o ON (r.id_sub_pd = o.id_sub_pd)
            WHERE r.id = :id
        """).bindparams(id=id)
        rst_lp = session.exec(sqlphone).first()
        if not rst_lp:
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")

        

        # Kirim notifikasi setelah commit sukses
        sendto_rabbitmq({
            "nophone": rst_lp.no_telp,
            "message": f"Hai {rst_lp.user_buat}, Laporan RFK {rst_lp.nama_pd} bulan {rst_lp.str_bulan} sudah diverifikasi oleh Admin SIMLABA.",
            "users": "Admin"
        })
        '''

    elif mode == "batal":
        sql_update = text("""
            UPDATE ta_laporan_rfk
            SET user_verify = '', tgl_kirim = NULL, tgl_verify = NULL, verified = 0, lock = 0
            WHERE id = :id AND lock = 1
        """).bindparams(id=id)
        result = session.exec(sql_update)
        #if result.rowcount == 0:
        #    raise HTTPException(status_code=404, detail="Data tidak ditemukan atau tidak terkunci")
        session.commit()
    else:
        raise HTTPException(status_code=400, detail="Mode tidak valid")

    return {"success": True}

    '''
    except HTTPException:
        raise
    except Exception as e:
        logging.exception("Gagal verifikasi laporan")
        raise HTTPException(status_code=500, detail={"success": False, "msg": "Simpan Data Gagal"})
    '''
