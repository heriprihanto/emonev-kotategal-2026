from typing import List, Optional
import uuid
from uuid_extensions import uuid7, uuid7str

from pydantic import BaseModel, EmailStr, validator, field_validator
from sqlmodel import Field, Relationship, SQLModel,ARRAY, Column, String
from datetime import datetime,date

class CreateLaporanTw(SQLModel,table=True):
    __tablename__ = "ta_laporan_eval_renja"

    id: Optional[int] = Field(default=None, primary_key=True)
    id_sub_pd: Optional[int] = Field(default=None, index=True)
    tahun: Optional[int] = Field(default=None, index=True)
    tw: Optional[int] = Field(default=None, index=True)

    v1: Optional[int] = None
    v2: Optional[int] = None
    v3: Optional[int] = None
    v4: Optional[int] = None

    user1: Optional[str] = Field(default=None, max_length=30)
    user2: Optional[str] = Field(default=None, max_length=30)
    user3: Optional[str] = Field(default=None, max_length=30)
    user4: Optional[str] = Field(default=None, max_length=30)

    user_s1: Optional[str] = Field(default=None, max_length=30)
    user_s2: Optional[str] = Field(default=None, max_length=30)
    user_s3: Optional[str] = Field(default=None, max_length=30)
    user_s4: Optional[str] = Field(default=None, max_length=30)

    tgl1: Optional[datetime] = None
    tgl2: Optional[datetime] = None
    tgl3: Optional[datetime] = None
    tgl4: Optional[datetime] = None

    tws: Optional[str] = None
    locked: int = Field(default=0)
    tl_tw: Optional[str] = None
    tl_n: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True

class UpdateIndikator(SQLModel,table=True):    
    __tablename__ = "renja_indikator"
    id :uuid.UUID = Field(primary_key=True)
    lvl :int
    id_parent :uuid.UUID 
    tahun :int
    id_sub_pd :int
    idformula :int
    iku :int
    kode : str
    nomor :int
    tolok_ukur : str
    ket : str
    formula : str
    satuan : str
    idjenis :int
    iskota :int
    kategori : str
    sumber : str
    t0 : str
    t1 : str
    t2 : str
    t3 : str
    t4 : str
    t5 : str
    tx : str
    tags  :List[str] = Field(default=None, sa_column=Column(ARRAY(String()))) 
    keterangan : str
    target_renja : str
    target_renja_murni : str
    target : str
    target_murni : str
    target_pk : str
    target_pk_murni : str
    target_rpj : str
    target_akhir : str
    tg_tw1 : str
    tg_tw2 : str
    tg_tw3 : str
    tg_tw4 : str
    tg_tw1_murni : str
    tg_tw2_murni : str
    tg_tw3_murni : str
    tg_tw4_murni : str
    ck1 : str
    ck2 : str
    ck3 : str
    ck4 : str
    ck5 : str
    cp1 : str
    cp2 : str
    cp3 : str
    cp4 : str
    cp5 : str
    cn1 : str
    cn2 : str
    cn3 : str
    cn4 : str
    cn5 : str
    ps1 : float
    ps2 : float
    ps3 : float
    ps4 : float
    ps5 : float
    psn : float
    psn_rpj : float    
    id_ref :int
    tipedata :int
    

class RfkRealKeu(BaseModel):
    idsubkegiatan :uuid.UUID
    id_sub_pd : int
    tahun: int
    anggaran:float
    bln1: float
    bln2: float
    bln3: float
    bln4: float
    bln5: float
    bln6: float
    bln7: float
    bln8: float
    bln9: float
    bln10: float
    bln11: float
    bln12: float
    pagu_akhir_renstra : float | None = Field(default=None)
    pagu_capaian_lalu : float | None = Field(default=None)
    pagu_renja : float | None = Field(default=None)

'''    
class TaLaporanEvalRenja(SQLModel, table=True):
    __tablename__ = "ta_laporan_eval_renja"

    id: Optional[int] = Field(default=None, primary_key=True)
    id_pd: Optional[int] = Field(default=None, index=True)
    tahun: Optional[int] = Field(default=None, index=True)
    tw: Optional[int] = Field(default=None, index=True)

    v1: Optional[int] = None
    v2: Optional[int] = None
    v3: Optional[int] = None
    v4: Optional[int] = None

    user1: Optional[str] = Field(default=None, max_length=30)
    user2: Optional[str] = Field(default=None, max_length=30)
    user3: Optional[str] = Field(default=None, max_length=30)
    user4: Optional[str] = Field(default=None, max_length=30)

    tgl1: Optional[datetime] = None
    tgl2: Optional[datetime] = None
    tgl3: Optional[datetime] = None
    tgl4: Optional[datetime] = None

    tws: Optional[str] = None
    locked: int = Field(default=0)
    tl_tw: Optional[str] = None
    tl_n: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True

class LaporanEvalCreate(SQLModel):
    id_pd: int
    tahun: int
    tw: int

class LaporanEvalRead(SQLModel):
    id: int
    id_pd: int
    tahun: int
    tw: int
    tws: Optional[str]
    tgl1: Optional[datetime]
    user1: Optional[str]
'''

class PostUpdateIndikator(SQLModel):    
    id :uuid.UUID
    id_indikator :uuid.UUID
    tw :int
    lvl:int
    t0 : Optional[str] = Field(default=None)
    t1 : Optional[str] = Field(default=None)
    t2 : Optional[str] = Field(default=None)
    t3 : Optional[str] = Field(default=None)
    t4 : Optional[str] = Field(default=None)
    t5 : Optional[str] = Field(default=None)
    tx : Optional[str] = Field(default=None)
    tags: List[str] = Field(default_factory=list, sa_column=Column(ARRAY(String())))
    cp1 : Optional[str] = Field(default=None)
    cp2 : Optional[str] = Field(default=None)
    cp3 : Optional[str] = Field(default=None)
    cp4 : Optional[str] = Field(default=None)
    cp5 : Optional[str] = Field(default=None)
    cn1 : Optional[str] = Field(default=None)
    cn2 : Optional[str] = Field(default=None)
    cn3 : Optional[str] = Field(default=None)
    cn4 : Optional[str] = Field(default=None)
    cn5 : Optional[str] = Field(default=None)
    ps1 : Optional[float] = Field(default=None)
    ps2 : Optional[float] = Field(default=None)
    ps3 : Optional[float] = Field(default=None)
    ps4 : Optional[float] = Field(default=None)
    ps5 : Optional[float] = Field(default=None)
    ck_tw1: Optional[str] = Field(default=None)
    ck_tw2: Optional[str] = Field(default=None)
    ck_tw3: Optional[str] = Field(default=None)
    ck_tw4: Optional[str] = Field(default=None)
    ck_tw1_ps: Optional[float] = Field(default=None)
    ck_tw2_ps: Optional[float] = Field(default=None)
    ck_tw3_ps: Optional[float] = Field(default=None)
    ck_tw4_ps: Optional[float] = Field(default=None)
    file1: Optional[str] = Field(default=None)
    file2: Optional[str] = Field(default=None)
    file3: Optional[str] = Field(default=None)
    file4: Optional[str] = Field(default=None)
    ms1: Optional[str] = Field(default=None)
    up1: Optional[str] = Field(default=None)
    ms2: Optional[str] = Field(default=None)
    up2: Optional[str] = Field(default=None)
    ms3: Optional[str] = Field(default=None)
    up3: Optional[str] = Field(default=None)
    ms4: Optional[str] = Field(default=None)
    up4: Optional[str] = Field(default=None)
    ck_tw1_psx: Optional[float] = Field(default=None)
    ck_tw2_psx: Optional[float] = Field(default=None)
    ck_tw3_psx: Optional[float] = Field(default=None)
    ck_tw4_psx: Optional[float] = Field(default=None)
    ck_tgtw1_ps: Optional[float] = Field(default=None)
    ck_tgtw2_ps: Optional[float] = Field(default=None)
    ck_tgtw3_ps: Optional[float] = Field(default=None)
    ck_tgtw4_ps: Optional[float] = Field(default=None)
    ck1 : Optional[str] = Field(default=None)
    ck2 : Optional[str] = Field(default=None)
    ck3 : Optional[str] = Field(default=None)
    ck4 : Optional[str] = Field(default=None)
    ck5 : Optional[str] = Field(default=None)
    cp1 : Optional[str] = Field(default=None)
    cp2 : Optional[str] = Field(default=None)
    cp3 : Optional[str] = Field(default=None)
    cp4 : Optional[str] = Field(default=None)
    cp5 : Optional[str] = Field(default=None)
    cn1 : Optional[str] = Field(default=None)
    cn2 : Optional[str] = Field(default=None)
    cn3 : Optional[str] = Field(default=None)
    cn4 : Optional[str] = Field(default=None)
    cn5 : Optional[str] = Field(default=None)
    verif1 : Optional[int] = Field(default=None)
    note1 : Optional[str] = Field(default=None)
    dateverif1 : Optional[datetime] = None
    verif_user1 : Optional[str] = Field(default=None)
    ket1 : Optional[str] = Field(default=None)
    ket2 : Optional[str] = Field(default=None)
    ket3 : Optional[str] = Field(default=None)
    ket4 : Optional[str] = Field(default=None)
    tl1 : Optional[str] = Field(default=None)
    tl2 : Optional[str] = Field(default=None)
    tl3 : Optional[str] = Field(default=None)
    tl4 : Optional[str] = Field(default=None)

    @validator("tags", pre=True, always=True)
    def empty_string_to_list(cls, v):
        if v in ("", None):
            return []
        return v

    @field_validator("ck_tgtw1_ps", "ck_tgtw2_ps", "ck_tgtw3_ps", "ck_tgtw4_ps", "ck_tw1_ps", "ck_tw2_ps", "ck_tw3_ps", "ck_tw4_ps")
    def clamp_persen_tw_lvl7(cls, v, info):
        lvl = info.data.get("lvl")

        if v is None:
            return v

        if lvl == 7 and isinstance(v, (int, float)):
            return min(v, 100)

        return v



class RenjaIndikatorRealisasi(SQLModel, table=True):
    __tablename__ = "renja_indikator_realisasi"
    id: uuid.UUID = Field(default=None, primary_key=True)
    id_indikator: Optional[uuid.UUID] = Field(default=None, foreign_key=None)
    tw: Optional[int] = Field(default=None)
    target: Optional[str] = Field(default=None)
    target_tw: Optional[str] = Field(default=None)
    realisasi: Optional[str] = Field(default=None)
    persen_tw: Optional[float] = Field(default=None)
    persen_tahun: Optional[float] = Field(default=None)
    persen_renstra: Optional[float] = Field(default=None)
    file: Optional[str] = Field(default=None)
    masalah: Optional[str] = Field(default=None)
    upaya: Optional[str] = Field(default=None)
    userupdate: Optional[str] = Field(default=None)
    dateupdated: Optional[datetime] = Field(default=None)
    verif1: Optional[int] = Field(default=None)
    verif_user1: Optional[str] = Field(default=None)
    verif2: Optional[int] = Field(default=None)
    verif_user2: Optional[str] = Field(default=None)
    verif3: Optional[int] = Field(default=None)
    verif_user3: Optional[str] = Field(default=None)
    dateverif1: Optional[datetime] = Field(default=None)
    dateverif2: Optional[datetime] = Field(default=None)
    dateverif3: Optional[datetime] = Field(default=None)
    note1 : Optional[str] = Field(default=None)
    note2 : Optional[str] = Field(default=None)
    note3 : Optional[str] = Field(default=None)
    ket: Optional[str] = Field(default=None)
    tl: Optional[str] = Field(default=None)

class TaPersonelKeg(SQLModel, table=True):
    __tablename__ = "ta_personel_keg"

    id: Optional[uuid.UUID] = Field(
        default_factory=uuid7,
        primary_key=True,
        index=True,
        nullable=False
    )
    id_parent: Optional[uuid.UUID] = None
    lvl: Optional[int] = None
    nip_pptk: Optional[str] = None
    nip_ops: Optional[str] = None
    nip_kpa: Optional[str] = None

from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime


class TaRencanaKinerja(SQLModel, table=True):
    __tablename__ = "ta_rencana_kinerja"

    id: Optional[int] = Field(
        default=None,
        primary_key=True,
        index=True
    )

    id_sub_pd: Optional[int] = Field(
        default=None,
        unique=True,
        index=True
    )

    tahun: Optional[int] = None

    v1: int = Field(default=0)
    v2: int = Field(default=0)
    v3: int = Field(default=0)
    v4: int = Field(default=0)

    user1: Optional[str] = Field(default=None, max_length=30)
    user2: Optional[str] = Field(default=None, max_length=30)
    user3: Optional[str] = Field(default=None, max_length=30)
    user4: Optional[str] = Field(default=None, max_length=30)

    tgl1: Optional[datetime] = None
    tgl2: Optional[datetime] = None
    tgl3: Optional[datetime] = None
    tgl4: Optional[datetime] = None
