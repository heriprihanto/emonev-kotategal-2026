import uuid
from typing import Any, Annotated

import logging
import json
from uuid_extensions import uuid7, uuid7str

from sqlalchemy import text,and_

from fastapi import APIRouter, HTTPException, Request,Body
from sqlmodel import SQLModel, Field,func, select
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.core.deps import CurrentUser, SessionDep
from app.core.exceptions import AuthFailedException, BadRequestException, ForbiddenException, NotFoundException
from app.models.opd import TaOpd
from app.models.rpjmd import Visi,Misi, Tujuan, Sasaran, Program, Masalah, Strategi, Kebijakan, Isu, Indikator

logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()



@router.get("/ref-opd")
def read_opd(
    session: SessionDep, current_user: CurrentUser
) -> Any:
    sql = text("SELECT kode,id_pd,id_sub_pd,nama_pd from ta_opd where is_pd=1 order by kode asc") 

    results = session.exec(sql).all()
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


@router.get("/ref-program")
def read_rpjmd_kegiatanopd(
    session: SessionDep,current_user: CurrentUser
) -> Any:
  
    results = session.exec(text(f"""SELECT DISTINCT kodebidang,uraibidang,kodeprogram,uraiprogram,concat(kodeprogram,' ',uraiprogram) as namaprogram from ref_kegiatan ORDER BY kodeprogram asc""")).all()
    #print (results)
    objects = [
            {
                "kodebidang": data[0],
                "uraibidang": data[1],
                "kodeprogram": data[2],
                "uraiprogram": data[3],
                "namaprogram": data[4]
            }
            for data in results
        ]
    return objects


@router.get("/ref-masalah")
def read_ref_masalah(
    session: SessionDep,current_user: CurrentUser
) -> Any:
    results = session.exec(text(f"""SELECT DISTINCT masalah from rpjmd_masalah ORDER BY masalah asc""")).all()
    #print (results)
    objects = [
            {
                "masalah": data[0]
            }
            for data in results
        ]
    return objects

@router.get("/ref-indikator")
def read_ref_indikator(
    session: SessionDep,current_user: CurrentUser
) -> Any:
  
    results = session.exec(text(f"""SELECT id,kode_dssd,indikator,satuan,status,ket,formula from ref_indikator ORDER BY kode_dssd asc""")).all()
    #print (results)
    objects = [
            {
                "id": data[0],
                "kode_dssd": data[1],
                "indikator": data[2],
                "satuan": data[3],
                "status": data[4],
                "ket": data[5],
                "formula": data[6],
            }
            for data in results
        ]
    return objects


@router.get("/data")
def read_rpjmd_opd(
    session: SessionDep, current_user: CurrentUser,kd_tahap:int =1
) -> Any:

    results = session.exec(text(f"""SELECT dx from cascading_rpjmd({kd_tahap}) as dx""")).all()
    return results[0]._mapping['dx']



@router.delete("/delete/{lvl}/{id}")
def delete_item(session: SessionDep,lvl:int, id: uuid.UUID) -> Any:
    try:
        match lvl:
            case 1:
                item = session.get(Visi, id)
            case 2:
                item = session.get(Misi, id)
            case 3:
                item = session.get(Tujuan, id)
            case 4:
                item = session.get(Sasaran, id)
            case 5:
                item = session.get(Program, id)
            case 11:
                item = session.get(Masalah, id)
            case 12:
                item = session.get(Strategi, id)  
            case 13:
                item = session.get(Kebijakan, id)  
            case 14:
                item = session.get(Isu, id) 
            case 15:
                item = session.get(Indikator, id) 

        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        session.delete(item)
        session.commit()
        return {"success": True,"message":"Data Berhasil Dihapus"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    


@router.post("/save-visi")
def save_visi(*, session: SessionDep, current_user: CurrentUser, item_in: Visi) -> Any:
    try:
        id=item_in.id
        if (id=='0') :
            item_data = item_in.model_dump(exclude_unset=True)
            item_data["id"] = uuid7str()

            item = Visi.model_validate(item_data)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}
         
        else :             
            item = session.get(Visi, id)
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
    



@router.post("/save-misi")
def save_misi(*, session: SessionDep, current_user: CurrentUser, item_in: Misi) -> Any:
    try:
        id=item_in.id
        if (id=='0') :
            item_data = item_in.model_dump(exclude_unset=True)
            item_data["id"] = uuid7str()

            item = Misi.model_validate(item_data)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}
         
        else :             
            item = session.get(Misi, id)
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
    

@router.post("/save-tujuan")
def save_tujuan(*, session: SessionDep, current_user: CurrentUser, item_in: Tujuan) -> Any:
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
                raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})
            update_dict = item_in.model_dump(exclude_unset=True)

            item.sqlmodel_update(update_dict)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}

    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})
    
@router.post("/save-sasaran")
def save_sasaran(*, session: SessionDep, current_user: CurrentUser, item_in: Sasaran) -> Any:
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
                raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})
            update_dict = item_in.model_dump(exclude_unset=True)

            item.sqlmodel_update(update_dict)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}

    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})
    

@router.post("/save-program")
def save_program(*, session: SessionDep, current_user: CurrentUser, item_in: Program) -> Any:
    try:
        id=item_in.id
        if (id=='0') :
            item_data = item_in.model_dump(exclude_unset=True)
            item_data["id"] = uuid7str()

            item = Program.model_validate(item_data)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}
         
        else :             
            item = session.get(Program, id)
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


@router.get("/masalah")
def read_masalah(
    session: SessionDep, current_user: CurrentUser,kd_tahap:int
) -> Any:
    stmt = select(Masalah).where(Masalah.kd_tahap==kd_tahap)        
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



@router.get("/strategi")
def read_strategi(
    session: SessionDep, current_user: CurrentUser,kd_tahap:int
) -> Any:
    stmt = select(Strategi).where(Strategi.kd_tahap==kd_tahap)        
    results = session.exec(stmt).all() 
    return results


@router.post("/save-strategi")
def save_strategi(*, session: SessionDep, current_user: CurrentUser, item_in: Strategi) -> Any:
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
                raise HTTPException(status_code=404, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})
            update_dict = item_in.model_dump(exclude_unset=True)

            item.sqlmodel_update(update_dict)
            session.add(item)
            session.commit()
            session.refresh(item)
            return {"success": True}

    except Exception as e:
        raise HTTPException(status_code=500, detail={"success":False,0:{"msg":"Gagal simpan data  !!"}})




@router.get("/kebijakan")
def read_kebijakan(
    session: SessionDep, current_user: CurrentUser,kd_tahap:int
) -> Any:
    stmt = select(Kebijakan).where(Kebijakan.kd_tahap==kd_tahap)        
    results = session.exec(stmt).all() 
    return results


@router.post("/save-kebijakan")
def save_kebijakan(*, session: SessionDep, current_user: CurrentUser, item_in: Kebijakan) -> Any:
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
    session: SessionDep, current_user: CurrentUser,kd_tahap:int,id_sub_pd
) -> Any:
    stmt = select(Isu).where(Isu.kd_tahap==kd_tahap)        
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
    


@router.get("/indikator")
def read_rpjmd_indikator(
    session: SessionDep, current_user: CurrentUser,lvl:int,kd_tahap:int,kd_visi:int,kd_misi:int,kd_tujuan:int,kd_sasaran:int ,kode_program:str
) -> Any:
    
    match lvl:
        case 3:
            stmt = select(Indikator).where(and_(Indikator.kd_tahap==kd_tahap,Indikator.lvl1==1,Indikator.lvl2==lvl,Indikator.kd_visi==kd_visi,Indikator.kd_misi==kd_misi,Indikator.kd_tujuan==kd_tujuan))    
        case 4:
            stmt = select(Indikator).where(and_(Indikator.kd_tahap==kd_tahap,Indikator.lvl1==1,Indikator.lvl2==lvl,Indikator.kd_visi==kd_visi,Indikator.kd_misi==kd_misi,Indikator.kd_tujuan==kd_tujuan,Indikator.kd_sasaran==kd_sasaran))   
        case 5:
            stmt = select(Indikator).where(and_(Indikator.kd_tahap==kd_tahap,Indikator.lvl1==1,Indikator.lvl2==lvl,Indikator.kd_visi==kd_visi,Indikator.kd_misi==kd_misi,Indikator.kd_tujuan==kd_tujuan,Indikator.kd_sasaran==kd_sasaran,Indikator.kode_program==kode_program))  

    results = session.exec(stmt).all() 
    return results


@router.post("/save-indikator")
def save_indikator(*, session: SessionDep, current_user: CurrentUser, item_in: Indikator) -> Any:
    #try:
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

    #except Exception as e:
    #    raise HTTPException(status_code=500, detail="Internal server error")
