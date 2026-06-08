import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

class TaOpdBase(SQLModel):
    id_pd :int | None = Field(default=None)
    kode :str | None = Field(default=None)
    nama_pd :str
    nip_kepala :str
    nama_kepala :str
    is_pd :int | None = Field(default=None)
    bidangurusan :str | None = Field(default=None)
    nama_pd_singkat :str | None = Field(default=None)
    jabatan_kepala :str
    alamat :str
    telp :str 
    email :str 
    aktif :int | None = Field(default=None)

class TaOpd(TaOpdBase, table=True):
    __tablename__ = "ta_opd"
    id_sub_pd : int = Field(default_factory=int, primary_key=True)