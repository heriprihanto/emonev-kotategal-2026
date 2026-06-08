from typing import Optional, List,Set

from uuid_extensions import uuid7, uuid7str
import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel, Column, String, ARRAY 

from sqlalchemy.dialects.postgresql import JSON


class Visi(SQLModel,table=True):
    __tablename__ = "rpjmd_visi"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    kd_visi :int
    visi :str
    penjelasan :str

class Misi(SQLModel,table=True):
    __tablename__ = "rpjmd_misi"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    kd_visi :int
    kd_misi :int
    misi :str
    penjelasan :str

class Tujuan(SQLModel,table=True):
    __tablename__ = "rpjmd_tujuan"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    kd_visi :int
    kd_misi :int
    kd_tujuan :int
    tujuan :str
    penjelasan :str


class Sasaran(SQLModel,table=True):
    __tablename__ = "rpjmd_sasaran"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    kd_visi :int
    kd_misi :int
    kd_tujuan :int
    kd_sasaran :int
    sasaran :str
    penjelasan :str

class Program(SQLModel,table=True):
    __tablename__ = "rpjmd_program"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    kd_visi :int
    kd_misi :int
    kd_tujuan :int
    kd_sasaran :int
    kd_bidang_urusan :str
    kode_program :str
    nm_program :str
    outcome :str | None = Field(default=None)
    keterangan :str | None = Field(default=None)
    sasaran_program :str | None = Field(default=None)
    pagu1 :float
    pagu2 :float
    pagu3 :float
    pagu4 :float
    pagu5 :float
    bidang_urusan :str


class Masalah(SQLModel,table=True):
    __tablename__ = "rpjmd_masalah"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    kode :str
    masalah :str
	
class Strategi(SQLModel,table=True):
    __tablename__ = "rpjmd_strategi"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    kode :str
    strategi :str
    tags_masalah : List[str] | None = Field(default=None, sa_column=Column(ARRAY(String())))


class Kebijakan(SQLModel,table=True):
    __tablename__ = "rpjmd_kebijakan"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    kode :str
    kebijakan :str
    '''
    t1 : int  = Field(default=0)
    t2 : int  = Field(default=0)
    t3 : int  = Field(default=0)
    t4 : int  = Field(default=0)
    t5 : int  = Field(default=0)
    '''

class Isu(SQLModel,table=True):
    __tablename__ = "rpjmd_isu"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    kode :str
    dinamika_intl :str
    dinamika_nas :str
    dinamika_reg :str
    lain :str
    '''
    t1 : int  = Field(default=0)
    t2 : int  = Field(default=0)
    t3 : int  = Field(default=0)
    t4 : int  = Field(default=0)
    t5 : int  = Field(default=0)
    '''

class Indikator(SQLModel,table=True):
    __tablename__ = "rpjmd_indikator"
    id :uuid.UUID = Field(primary_key=True)
    kd_tahap :int
    id_sub_pd :int | None = Field(default=0)
    #idparent :uuid.UUID
    lvl1 :int | None = Field(default=1)
    lvl2 :int | None = Field(default=1)
    kd_visi :int | None = Field(default=0)
    kd_misi :int | None = Field(default=0)
    kd_tujuan :int | None = Field(default=0)
    kd_sasaran :int | None = Field(default=0)
    kode_program :str | None = Field(default=None)
    kode_kegiatan :str | None = Field(default=None)
    kode_subkegiatan :str | None = Field(default=None)
    kode :int
    id_indikator :uuid.UUID | None = Field(default=None)
    indikator :str
    satuan :str
    status :str
    ket :str | None = Field(default=None)
    formula :str | None = Field(default=None)
    tags : List[str] | None = Field(default=None, sa_column=Column(ARRAY(String())))
    t0 :str
    t1 :str
    t2 :str
    t3 :str
    t4 :str
    t5 :str