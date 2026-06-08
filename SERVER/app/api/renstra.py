import uuid
from uuid_extensions import uuid7str
from typing import Any

import logging


from sqlalchemy import text,and_

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.core.deps import CurrentUser, SessionDep, RowstoDicts
from app.models.renstra import Tujuan,Sasaran,ProgramCreate,Program,KegiatanCreate,SubKegiatanCreate,Kegiatan,SubKegiatan,Strategi,Kebijakan,Masalah,Isu
from app.models.rpjmd import Indikator

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

    '''
    if role_id > 3:
        sql = text(f"SELECT * from v_opd_kinerja where id_sub_pd IN ( SELECT unnest( opds )  FROM sso_users where id= :userid)").bindparams(userid=userid)
    else :
        sql = text(f"SELECT * from v_opd_kinerja")
    '''

    sql = text(f"SELECT * from ta_opd where is_pd=1 order by kode")

    try:
        result = session.exec(sql).all()
        if not result:
            return []
        return RowstoDicts(result)
    except Exception as e:
        logger.error(f"Error saat membaca OPD: {e}")
        raise HTTPException(status_code=500, detail="Gagal membaca data OPD")

@router.get("/ref-bidang-urusan")
def read_bidangurusan(
    session: SessionDep
    #, current_user: CurrentUser
) -> Any:
    sql = text("SELECT kode_bidang_urusan, bidang_urusan_alias from ref_bidang_urusan order by kode_bidang_urusan") 
    results = session.exec(sql).all()
    objs= [
            {
                "kode_bidang_urusan": data[0],
                "bidang_urusan_alias": data[1]
            }
            for data in results
        ]
    return objs


@router.get("/ref-tagging")
def read_tagging(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    sql = text("SELECT * from ref_tagging") 
    results = session.exec(sql).all()
    objs= [
            {
                "id": int(data[0]),
                "tag": str(data[1]),
                "ket": str(data[2]),
            }
            for data in results
        ]
    return objs


@router.get("/sasaran-rpjmd")
def read_sasaran_rpjmd(
    session: SessionDep
    #, current_user: CurrentUser
) -> Any:
    sql = text("SELECT concat(kd_visi,'.',kd_misi,'.',kd_tujuan,'.',kd_sasaran) as kode,sasaran FROM rpjmd_sasaran") 
    results = session.exec(sql).all()
    objs= [
            {
                "kode": data[0],
                "sasaran": data[1]
            }
            for data in results
        ]
    return objs

@router.get("/data")
def read_renstra_opd(
    session: SessionDep, current_user: CurrentUser,pid_pd: int,ptahun:int,pkd_tahap:int
) -> Any:
    sql = text(f"""SELECT dx from cascading_renstra({pid_pd},1) as dx""") 
    results = session.exec(sql).all()
    return results[0]._mapping['dx']


@router.post("/save-tujuan")
def update_tujuan(*, session: SessionDep, current_user: CurrentUser, item_in: Tujuan) -> Any:
    try:
        id=item_in.id
        if (id=='0') :
            item_data = item_in.model_dump(exclude_unset=True)
            item_data["id"] = uuid7str()

            item = Tujuan.model_validate(item_data)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}
         
        else :             
            item = session.get(Tujuan, id)
            if not item:
                raise HTTPException(status_code=404, detail="Item not found")
            update_dict = item_in.model_dump(exclude_unset=True)

            item.sqlmodel_update(update_dict)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}

    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.post("/save-sasaran")
def update_sasaran(*, session: SessionDep, item_in: Sasaran) -> Any:
    try:
        id=item_in.id
        if (id=='0') :
            item_data = item_in.model_dump(exclude_unset=True)
            item_data["id"] = uuid7str()
            item = Sasaran.model_validate(item_data)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}
         
        else :             
            item = session.get(Sasaran, id)
            if not item:
                raise HTTPException(status_code=404, detail="Item not found")
            update_dict = item_in.model_dump(exclude_unset=True)
            item.sqlmodel_update(update_dict)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}

    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/ref-program-rpjmd")
def read_renstra_opd(
    session: SessionDep,id_sub_pd: int,kd_tujuan:int,kd_tahap:int
    #, current_user: CurrentUser
) -> Any:
    sql = text(f"""SELECT * from rpjmd_program where kd_tahap={kd_tahap} and kd_bidang_urusan IN(select unnest(bidang_urusan) from  renstra_tujuan where kd_tujuan={kd_tujuan} and kd_tahap={kd_tahap} and id_sub_pd={id_sub_pd})""") 
    results = session.exec(sql).all()
    #print (results)
    objects = [
            {
                "id": data[0],
                "kd_bidang_urusan": data[7],
                "kode_program": data[8],
                "nm_program":data[9],
                "bidang_urusan": data[18]
            }
            for data in results
        ]
    return objects

@router.get("/ref-kegiatan")
def read_renstra_kegiatanopd(
    session: SessionDep,id_sub_pd: int,kd_tujuan:int,kd_tahap:int,kode_program:str
    #, current_user: CurrentUser
) -> Any:
    sql = text(f"""SELECT DISTINCT kodekegiatan,uraikegiatan from ref_kegiatan where kodeprogram='{kode_program}' ORDER BY kodekegiatan""") 
    results = session.exec(sql).all()
    #print (results)
    objects = [
            {
                "kodekegiatan": data[0],
                "uraikegiatan": data[1]
            }
            for data in results
        ]
    return objects


@router.get("/ref-subkegiatan")
def read_renstra_subkegiatanopd(
    session: SessionDep,id_sub_pd: int,kd_tujuan:int,kd_tahap:int,kode_kegiatan:str
    #, current_user: CurrentUser
) -> Any:
    sql = text(f"""SELECT kodesubkegiatan,uraisubkegiatan from ref_kegiatan where kodekegiatan='{kode_kegiatan}' ORDER BY kodesubkegiatan""") 
    results = session.exec(sql).all()
    #print (results)
    objects = [
            {
                "kodesubkegiatan": data[0],
                "uraisubkegiatan": data[1]
            }
            for data in results
        ]
    return objects

@router.post("/save-program")
def update_program(session: SessionDep, prog:ProgramCreate) -> Any:
    try:
        for kdprg in prog.programs:
            print (kdprg)
            sql = text(f"""
            BEGIN;
            insert into renstra_program(kd_tahap,id_sub_pd,kd_tujuan,kd_sasaran,kd_bidang_urusan,kode_program,nm_program,bidang_urusan) select kd_tahap,{prog.id_sub_pd},{prog.kd_tujuan},{prog.kd_sasaran},kd_bidang_urusan,kode_program,nm_program,bidang_urusan from rpjmd_program where kode_program='{kdprg}' and kd_tahap={prog.kd_tahap};
            insert into rpjmd_indikator (lvl1,lvl2,kd_tahap,kd_visi,kd_misi,kd_tujuan,kd_sasaran,kode_program,kode_kegiatan,kode_subkegiatan,id_sub_pd,id_indikator,indikator,satuan,status,ket,formula,t0,t1,t2,t3,t4,t5,kode,tags) select 2,3,kd_tahap,0,0,{prog.kd_tujuan},{prog.kd_sasaran},kode_program,'','',id_sub_pd,id_indikator,indikator,satuan,status,ket,formula,t0,t1,t2,t3,t4,t5,kode,tags from rpjmd_indikator where kd_tahap={prog.kd_tahap} and lvl1=1 and kode_program='{kdprg}' and id_sub_pd={prog.id_sub_pd};
            COMMIT;
            """) 
            session.exec(sql)
            session.commit()
        
        return {"success": True,"id_pd": str(prog.kd_tujuan)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    

@router.post("/save-kegiatan")
def update_kegiatan(session: SessionDep, prog:KegiatanCreate) -> Any:
    try:
        for kdprg in prog.kegiatans:
            print (kdprg)
            sql = text(f"""insert into renstra_kegiatan(kd_tahap,id_sub_pd,kd_tujuan,kd_sasaran,kode_program,kode_kegiatan,nm_kegiatan) SELECT DISTINCT {prog.kd_tahap},{prog.id_sub_pd},{prog.kd_tujuan},{prog.kd_sasaran},kodeprogram,kodekegiatan,uraikegiatan from ref_kegiatan where kodekegiatan='{kdprg}';""") 
            session.exec(sql)
            session.commit()
        
        return {"success": True,"id_pd": str(prog.kd_tujuan)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.post("/save-subkegiatan")
def update_subkegiatan(session: SessionDep, prog:SubKegiatanCreate) -> Any:
    try:
        for kdprg in prog.subkegiatans:
            print (kdprg)
            id_indikator = uuid7str()
            sql = text(f"""
            BEGIN;
            insert into renstra_subkegiatan(kd_tahap,id_sub_pd,kd_tujuan,kd_sasaran,kode_program,kode_kegiatan,kode_subkegiatan,nm_subkegiatan) SELECT {prog.kd_tahap},{prog.id_sub_pd},{prog.kd_tujuan},{prog.kd_sasaran},kodeprogram,kodekegiatan,kodesubkegiatan,uraisubkegiatan from ref_kegiatan where kodesubkegiatan='{kdprg}';
            insert into rpjmd_indikator (lvl1,lvl2,kd_tahap,kd_visi,kd_misi,kd_tujuan,kd_sasaran,kode_program,kode_kegiatan,kode_subkegiatan,id_sub_pd,id_indikator,indikator,satuan,status,kode) select 2,5,{prog.kd_tahap},0,0,{prog.kd_tujuan},{prog.kd_sasaran},'{prog.kode_program}','{prog.kode_kegiatan}','{kdprg}',{prog.id_sub_pd},'{id_indikator}',indikator,satuan,1,1 from ref_kegiatan where kodesubkegiatan='{kdprg}';
            COMMIT;
            """) 
            session.exec(sql)
            session.commit()
        
        return {"success": True,"id_pd": str(prog.kd_tujuan)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    

@router.delete("/delete/{lvl}/{id}")
def delete_item(session: SessionDep,lvl:int, id: uuid.UUID) -> Any:
    try:
        match lvl:
            case 1:
                item = session.get(Tujuan, id)
            case 2:
                item = session.get(Sasaran, id)
            case 3:
                item = session.get(Program, id)
            case 4:
                item = session.get(Kegiatan, id)
            case 5:
                item = session.get(SubKegiatan, id)
            case 7:
                item = session.get(Strategi, id)
            case 8:
                item = session.get(Kebijakan, id)

        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        session.delete(item)
        session.commit()
        return {"success": True,"message":"Data Berhasil Dihapus"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    


@router.get("/strategi")
def read_renstra_strategi(
    session: SessionDep,id_sub_pd: int,kd_tahap:int
    #, current_user: CurrentUser
) -> Any:
    stmt = select(Strategi).where(and_(Strategi.id_sub_pd==id_sub_pd,Strategi.kd_tahap==kd_tahap))        
    results = session.exec(stmt).all() 
    return results



@router.post("/save-strategi")
def save_strategi(*, session: SessionDep, item_in: Strategi) -> Any:
    try:
        id=item_in.id
        if (id=='0') :
            item_data = item_in.model_dump(exclude_unset=True)
            item_data["id"] = uuid7str()
            item = Strategi.model_validate(item_data)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}
         
        else :             
            item = session.get(Strategi, id)
            if not item:
                raise HTTPException(status_code=404, detail="Item not found")
            update_dict = item_in.model_dump(exclude_unset=True)
            item.sqlmodel_update(update_dict)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}

    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    


@router.get("/kebijakan")
def read_renstra_kebijakan(
    session: SessionDep,id_sub_pd: int,kd_tahap:int
    #, current_user: CurrentUser
) -> Any:
    stmt = select(Kebijakan).where(and_(Kebijakan.id_sub_pd==id_sub_pd,Kebijakan.kd_tahap==kd_tahap))        
    results = session.exec(stmt).all() 
    return results



@router.post("/save-kebijakan")
def save_kebijakan(*, session: SessionDep, item_in: Kebijakan) -> Any:
    try:
        id=item_in.id
        if (id=='0') :
            item_data = item_in.model_dump(exclude_unset=True)
            item_data["id"] = uuid7str()
            item = Kebijakan.model_validate(item_data)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}
         
        else :             
            item = session.get(Kebijakan, id)
            if not item:
                raise HTTPException(status_code=404, detail="Item not found")
            update_dict = item_in.model_dump(exclude_unset=True)
            item.sqlmodel_update(update_dict)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}

    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    

@router.get("/indikator")
def read_renstra_indikator(
    session: SessionDep, current_user: CurrentUser,lvl:int,kd_tahap:int,id_sub_pd:int,kd_visi:int,kd_misi:int,kd_tujuan:int,kd_sasaran:int ,kode_program:str,kode_kegiatan:str,kode_subkegiatan:str
) -> Any:
    match lvl:
        case 1:
            stmt = select(Indikator).where(and_(Indikator.id_sub_pd==id_sub_pd,Indikator.kd_tahap==kd_tahap,Indikator.lvl1==2,Indikator.lvl2==lvl,Indikator.kd_visi==0,Indikator.kd_misi==0,Indikator.kd_tujuan==kd_tujuan))    
        case 2:
            stmt = select(Indikator).where(and_(Indikator.id_sub_pd==id_sub_pd,Indikator.kd_tahap==kd_tahap,Indikator.lvl1==2,Indikator.lvl2==lvl,Indikator.kd_visi==0,Indikator.kd_misi==0,Indikator.kd_tujuan==kd_tujuan,Indikator.kd_sasaran==kd_sasaran))   
        case 3:
            stmt = select(Indikator).where(and_(Indikator.id_sub_pd==id_sub_pd,Indikator.kd_tahap==kd_tahap,Indikator.lvl1==2,Indikator.lvl2==lvl,Indikator.kd_visi==0,Indikator.kd_misi==0,Indikator.kd_tujuan==kd_tujuan,Indikator.kd_sasaran==kd_sasaran,Indikator.kode_program==kode_program))  
        case 4:
            stmt = select(Indikator).where(and_(Indikator.id_sub_pd==id_sub_pd,Indikator.kd_tahap==kd_tahap,Indikator.lvl1==2,Indikator.lvl2==lvl,Indikator.kd_visi==0,Indikator.kd_misi==0,Indikator.kd_tujuan==kd_tujuan,Indikator.kd_sasaran==kd_sasaran,Indikator.kode_program==kode_program))  
        case 5:
            stmt = select(Indikator).where(and_(Indikator.id_sub_pd==id_sub_pd,Indikator.kd_tahap==kd_tahap,Indikator.lvl1==2,Indikator.lvl2==lvl,Indikator.kd_visi==0,Indikator.kd_misi==0,Indikator.kd_tujuan==kd_tujuan,Indikator.kd_sasaran==kd_sasaran,Indikator.kode_program==kode_program,Indikator.kode_kegiatan==kode_kegiatan,Indikator.kode_subkegiatan==kode_subkegiatan))  
    

    results = session.exec(stmt).all() 
    return results


@router.post("/save-indikator")
def save_indikator(*, session: SessionDep, item_in: Indikator) -> Any:
    try:
        id=item_in.id
        if (id=='0') :
            item_data = item_in.model_dump(exclude_unset=True)
            item_data["id"] = uuid7str()
            item = Indikator.model_validate(item_data)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}
         
        else :             
            item = session.get(Indikator, id)
            if not item:
                raise HTTPException(status_code=404, detail="Item not found")
            update_dict = item_in.model_dump(exclude_unset=True)
            item.sqlmodel_update(update_dict)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}

    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")




@router.get("/masalah")
def read_masalah(
    session: SessionDep, current_user: CurrentUser,kd_tahap:int,id_sub_pd: int
) -> Any:
    stmt = select(Masalah).where(and_(Masalah.id_sub_pd==id_sub_pd,Masalah.kd_tahap==kd_tahap))         
    results = session.exec(stmt).all() 
    return results


@router.post("/save-masalah")
def save_masalah(*, session: SessionDep, current_user: CurrentUser, item_in: Masalah) -> Any:
    try:
        id=item_in.id
        if (id=='0') :
            item_data = item_in.model_dump(exclude_unset=True)
            item_data["id"] = uuid7str()

            item = Masalah.model_validate(item_data)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}
         
        else :             
            item = session.get(Masalah, id)
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


@router.get("/isu")
def read_isu(
    session: SessionDep, current_user: CurrentUser,kd_tahap:int,id_sub_pd: int
) -> Any:
    stmt =select(Isu).where(and_(Isu.id_sub_pd==id_sub_pd,Isu.kd_tahap==kd_tahap))        
    results = session.exec(stmt).all() 
    return results


@router.post("/save-isu")
def save_isu(*, session: SessionDep, current_user: CurrentUser, item_in: Isu) -> Any:
    try:
        id=item_in.id
        if (id=='0') :
            item_data = item_in.model_dump(exclude_unset=True)
            item_data["id"] = uuid7str()

            item = Isu.model_validate(item_data)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}
         
        else :             
            item = session.get(Isu, id)
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
    
