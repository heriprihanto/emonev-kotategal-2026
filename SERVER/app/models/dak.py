import uuid

from pydantic import BaseModel, EmailStr
from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime,date


class CreateLaporanBulanan(SQLModel):
    tahun: int
    id_sub_pd: int
    bulan: int

class Dak(SQLModel,table=True):
    __tablename__ = "dak_detail_rincian"
    id: int = Field(primary_key=True)
    tahun         : int | None =Field(default=None)
    id_sub_pd     : int | None =Field(default=None)
    bulan         : int | None =Field(default=None)
    kat_dak       : int  | None =Field(default=None)
    kd_jenis      : int | None =Field(default=None)
    jenis         : str | None=Field(default=None)
    t1_kode       : str | None=Field(default=None) 
    t2_kode       : str | None=Field(default=None) 
    t3_kode       : str | None=Field(default=None) 
    t4_kode       : str | None=Field(default=None) 
    t5_kode       : str | None=Field(default=None) 
    t1_nama       : str | None=Field(default=None)
    t2_nama       : str | None=Field(default=None)
    t3_nama       : str | None=Field(default=None)
    t4_nama       : str | None=Field(default=None)
    t5_nama       : str | None=Field(default=None)
    volume        : float | None=Field(default=None)
    satuan        : str | None=Field(default=None)
    pagu          : float | None=Field(default=None) 
    volume2       : float | None=Field(default=None)
    satuan2       : str | None=Field(default=None)
    nilai         : float | None=Field(default=None) 
    mekanisme     : str | None=Field(default=None)
    metode        : str | None=Field(default=None)
    real_k        : float | None=Field(default=None) 
    real_vol      : float | None=Field(default=None) 
    real_fisik    : float | None=Field(default=None) 
    masalah       : str | None=Field(default=None)
    vol_f         : float | None=Field(default=None) 
    real_manfaat  : float | None=Field(default=None)
    sesuai        : str | None=Field(default=None)
    ket_masalah   : str | None=Field(default=None)
    sumber        : int | None =Field(default=None)
    lokasi        : str | None=Field(default=None)
    koordinat     : str | None=Field(default=None)

