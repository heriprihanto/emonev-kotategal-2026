from typing import Optional, List,Set

from uuid_extensions import uuid7, uuid7str
import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel, Column, String, ARRAY 

from sqlalchemy.dialects.postgresql import JSON


class CascadingRenstra(SQLModel):
    cascading_renstra: dict = Field(sa_type=JSON, nullable=False)


class Tujuan(SQLModel,table=True):
    __tablename__ = "renstra_tujuan"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    id_sub_pd :int
    kd_tujuan :int
    tujuan :str
    keterangan :str
    kd_sasaran_rpjmd:str
    bidang_urusan: List[str] = Field(default=None, sa_column=Column(ARRAY(String()))) #str | None= Field(default=None)

class Sasaran(SQLModel,table=True):
    __tablename__ = "renstra_sasaran"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    id_sub_pd :int
    kd_tujuan :int
    kd_sasaran :int
    sasaran :str
    keterangan :str
    '''
    masalah :str
    akar_masalah1 :str
    akar_masalah2 :str
    akar_masalah3 :str
    akar_masalah4 :str
    akar_masalah5 :str
    '''

class Program(SQLModel,table=True):
    __tablename__ = "renstra_program"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    id_sub_pd :int
    kd_tujuan :int
    kd_sasaran :int
    kode_program :str
    nm_program :str

class Kegiatan(SQLModel,table=True):
    __tablename__ = "renstra_kegiatan"
    id :uuid.UUID = Field(primary_key=True)

class SubKegiatan(SQLModel,table=True):
    __tablename__ = "renstra_subkegiatan"
    id :uuid.UUID = Field(primary_key=True)

class ProgramCreate(SQLModel):
    kd_tahap :int
    id_sub_pd :int
    kd_tujuan :int
    kd_sasaran :int
    programs:list

class KegiatanCreate(SQLModel):
    kd_tahap :int
    id_sub_pd :int
    kd_tujuan :int
    kd_sasaran :int
    kode_program:str
    kegiatans:list

class SubKegiatanCreate(SQLModel):
    kd_tahap :int
    id_sub_pd :int
    kd_tujuan :int
    kd_sasaran :int
    kode_program:str
    kode_kegiatan:str
    subkegiatans:list

class Strategi(SQLModel,table=True):
    __tablename__ = "renstra_strategi"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    id_sub_pd :int
    kode :int
    strategi :str

class Kebijakan(SQLModel,table=True):
    __tablename__ = "renstra_kebijakan"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    id_sub_pd :int
    kode :int
    kebijakan :str

class Masalah(SQLModel,table=True):
    __tablename__ = "renstra_masalah"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    id_sub_pd :int
    kode :str
    masalah :str


class Isu(SQLModel,table=True):
    __tablename__ = "renstra_isu"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    id_sub_pd :int
    kode :str
    dinamika_intl :str
    dinamika_nas :str
    dinamika_reg :str
    lain :str


