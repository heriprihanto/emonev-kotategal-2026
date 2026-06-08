from typing import Any,List, Dict
import uuid
from uuid_extensions import uuid7, uuid7str
from app.models.kinerja import RfkRealKeu,CreateLaporanTw,UpdateIndikator,RenjaIndikatorRealisasi,PostUpdateIndikator, TaRencanaKinerja
import logging
from sqlalchemy import text
from fastapi import APIRouter,UploadFile, File, status,Request, Form
from app.core.deps import CurrentUser, SessionDep, handle_errordb, RowstoDicts
import datetime
from fastapi.exceptions import HTTPException
from sqlmodel import select, Field, Relationship, SQLModel
import shutil
import os
from fastapi.responses import FileResponse

from dotenv import load_dotenv

from pydantic import BaseModel, EmailStr
from datetime import datetime,date
from pathlib import Path



logger = logging.getLogger('uvicorn.error')
logger.setLevel(logging.DEBUG)

router = APIRouter()

class TaDokumen(SQLModel,table=True):
    __tablename__ = "ta_dokumen_pd"
    id : int = Field(primary_key=True)
    id_pd :int
    tgl_update :datetime
    user_update :str
    filename :str
    ket : str
    filename_o : str
    id_dok : int

@router.get("/list")
def read_opd(
    session: SessionDep, current_user: CurrentUser,pid_pd:int
) -> Any:
    role_id=current_user.role_id
    userid=current_user.id
    strapp='emonev'

    sql = text(f"SELECT d.id as id_dok, COALESCE(o.id,0) as idf,d.id_jenis,d.dokumen,o.id_pd,o.tgl_update,o.user_update,o.filename,o.ket, o.filename_o,coalesce(length(o.filename),0) as lng FROM public.ref_dokumen d left JOIN (SELECT * FROM public.ta_dokumen_pd WHERE id_pd={pid_pd})o ON (d.id = o.id_dok) order by id_jenis asc, id_dok asc")

    try:
        result = session.exec(sql).all()
        if not result:
            return []
        return RowstoDicts(result)
    except Exception as e:
        logger.error(f"Error saat membaca OPD: {e}")
        raise HTTPException(status_code=500, detail="Gagal membaca data OPD")



@router.post("/uploadberkas")
async def upload_single_file(
    session: SessionDep,
    pid: int = Form(0),
    pid_pd: int = Form(...),
    pid_dok: int = Form(...),
    userfile: UploadFile = File(...)
):

    if not userfile.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    load_dotenv()
    upload_path = os.getenv("UPLOAD_PATH")
    UPLOAD_DIR = Path(os.getenv("UPLOAD_PATH")) #Path("/home/herry/PythonProject/EMONEV_2026_PYTHON/SERVER/UPLOADS")
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    allowed_types = {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }

    allowed_ext = {".pdf", ".docx"}
    MAX_FILE_SIZE = 50 * 1024 * 1024

    if userfile.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="File type not allowed")

    _, ext = os.path.splitext(userfile.filename)
    ext = ext.lower()

    if ext not in allowed_ext:
        raise HTTPException(status_code=400, detail="Extension not allowed")

    new_filename = f"{uuid7str()}{ext}"
    file_path = UPLOAD_DIR / new_filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(userfile.file, buffer)

    size = file_path.stat().st_size

    if size > MAX_FILE_SIZE:
        file_path.unlink()
        raise HTTPException(status_code=400, detail="File terlalu besar")

    if pid > 0:

        item = session.get(TaDokumen, pid)
        if not item:
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")

        item.id_dok = pid_dok
        item.id_pd = pid_pd
        item.filename = new_filename
        item.filename_o = userfile.filename

    else:

        item = TaDokumen(
            id_dok=pid_dok,
            id_pd=pid_pd,
            filename_o =  userfile.filename,
            filename=new_filename
        )

        session.add(item)

    session.commit()
    session.refresh(item)

    return {
        "success": True,
        "filename": new_filename,
        "size": size
    }
    

    
@router.get("/file/{filename}")
async def get_file(filename: str):

    UPLOAD_DIR = Path("/home/herry/PythonProject/EMONEV_2026_PYTHON/SERVER/UPLOADS")
    file_path = UPLOAD_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File tidak ditemukan")

    return FileResponse(
        path=file_path,
        filename=filename
    )