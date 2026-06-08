import uuid

from pydantic import BaseModel, EmailStr
from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime,date

class UpdatePersonelSubkegiatan(BaseModel):
    id_pptk :int  | None= Field(default=None)
    id_ppk :int  | None= Field(default=None)


class Pekerjaan(SQLModel,table=True):
    __tablename__ = "ta_pekerjaan"
    id: uuid.UUID = Field(primary_key=True)
    tahun :int
    id_sub_pd :int
    id_subkegiatan :uuid.UUID 
    kd_tahap :int
    kd_sumber :int | None= Field(default=None)
    pagu_anggaran :float
    pagu_anggaran_murni :float | None= Field(default=None)
    pagu_anggaran_geser :float | None= Field(default=None)
    pagu_anggaran_perubahan :float | None= Field(default=None)
    nomor_rup :str | None= Field(default=None)
    nomor_pekerjaan :int 
    nama_pekerjaan :str
    jenis_paket :int | None =Field(default=None)
    jenis_belanja :int | None=Field(default=None)
    jenis_pengadaan :int | None= Field(default=None)
    metode :int | None= Field(default=None)
    volume :str
    lokasi :str 
    tgl_mulai_pemilihan :date | None = Field(default=None)
    tgl_akhir_pemilihan :date | None= Field(default=None)
    tgl_mulai_pelaksanaan :date | None= Field(default=None)
    tgl_akhir_pelaksanaan :date | None = Field(default=None)
    tgl_buat :datetime = Field(default_factory=datetime.now)
    user_buat :str | None= Field(default=None)
    jan :float | None = Field(default=None)
    feb :float | None =Field(default=None)
    mar :float | None=Field(default=None)
    apr :float | None=Field(default=None)
    mei :float | None=Field(default=None)
    jun :float | None=Field(default=None)
    jul :float | None=Field(default=None)
    agu :float | None=Field(default=None)
    sep :float | None=Field(default=None)
    okt :float | None=Field(default=None)
    nov :float | None=Field(default=None)
    des :float | None=Field(default=None)
    jan_f :float | None=Field(default=None)
    feb_f :float | None=Field(default=None)
    mar_f :float | None=Field(default=None)
    apr_f :float | None=Field(default=None)
    mei_f :float | None=Field(default=None)
    jun_f :float | None=Field(default=None)
    jul_f :float | None=Field(default=None)
    agu_f :float | None=Field(default=None)
    sep_f :float | None=Field(default=None)
    okt_f :float | None=Field(default=None)
    nov_f :float | None=Field(default=None)
    des_f :float | None=Field(default=None)
    nama_ppk :str | None=Field(default=None)
    nama_pptk :str | None=Field(default=None)
    nama_pokja :str | None=Field(default=None)
    nama_pphp :str | None=Field(default=None)
    hps :float | None=Field(default=None)
    nilai_kontrak :float | None= Field(default=None)
    sisa_anggaran :float | None=Field(default=None)
    realisasi :float | None =Field(default=None)
    nama_penyedia :str | None=Field(default=None)
    alamat_penyedia :str | None=Field(default=None)
    nama_direktur :str | None=Field(default=None)
    npwp_penyedia :str | None=Field(default=None)
    nomor_kontrak :str | None=Field(default=None)
    tgl_kontrak1 :date | None=Field(default=None)
    tgl_kontrak2 :date | None=Field(default=None)
    nomor_spmk :str | None=Field(default=None)
    tgl_spmk1 :date | None=Field(default=None)
    tgl_spmk2 :date | None=Field(default=None)
    tgl_adendum :date | None=Field(default=None)
    tgl_terima1 :date | None=Field(default=None)
    tgl_terima2 :date | None=Field(default=None)
    status :int | None =Field(default=None)
    ket_pekerjaan :str| None =Field(default=None)
    awal_pelaksanaan :int | None=Field(default=None)
    akhir_pelaksanaan :int | None=Field(default=None)
    awal_pemilihan :int | None=Field(default=None)
    akhir_pemilihan :int | None=Field(default=None)
    awal_kontrak :int | None=Field(default=None)
    akhir_kontrak :int | None=Field(default=None)
    anggaran1 :float | None=Field(default=None)
    anggaran2 :float | None=Field(default=None)
    anggaran3 :float | None=Field(default=None)
    tipe_swa :int | None=Field(default=None)
    penyelenggara_swa :str| None =Field(default=None)
    lat :str | None=Field(default=None)
    lng :str | None=Field(default=None)
    tg1 :str | None=Field(default=None)
    tg2 :str | None=Field(default=None)
    tg3 :str | None=Field(default=None)
    tg4 :str | None=Field(default=None)
    tg5 :str | None=Field(default=None)


class RencanaPekerjaan(SQLModel):
    id: uuid.UUID
    jan :float | None = Field(default=None)
    feb :float | None =Field(default=None)
    mar :float | None=Field(default=None)
    apr :float | None=Field(default=None)
    mei :float | None=Field(default=None)
    jun :float | None=Field(default=None)
    jul :float | None=Field(default=None)
    agu :float | None=Field(default=None)
    sep :float | None=Field(default=None)
    okt :float | None=Field(default=None)
    nov :float | None=Field(default=None)
    des :float | None=Field(default=None)
    jan_f :float | None=Field(default=None)
    feb_f :float | None=Field(default=None)
    mar_f :float | None=Field(default=None)
    apr_f :float | None=Field(default=None)
    mei_f :float | None=Field(default=None)
    jun_f :float | None=Field(default=None)
    jul_f :float | None=Field(default=None)
    agu_f :float | None=Field(default=None)
    sep_f :float | None=Field(default=None)
    okt_f :float | None=Field(default=None)
    nov_f :float | None=Field(default=None)
    des_f :float | None=Field(default=None)

class UserSSOBase(SQLModel):
    display_name:str
    email:EmailStr = Field(unique=True, index=True, max_length=255)
    no_telp:str
    opd:str
    username:str
    role_id:int| None = None
    salt:str| None = None
    
class LaporanBulanan(SQLModel,table=True):
    __tablename__ = "ta_laporan_rfk"
    id: int = Field(default=None, primary_key=True)
    id_sub_pd :int
    bulan :int
    str_bulan :str
    tgl_buat :datetime
    tgl_kirim :datetime
    tgl_verify :datetime
    lock :int
    user_buat :str
    user_kirim :str
    verified :int
    user_verify :str
    kd_perubahan :int

class CreateLaporanBulanan(SQLModel):
    tahun: int
    username: str
    pid_sub_pd: int
    bulan: int

class RfkProgram(SQLModel):
    kode_program:str
    nm_program:str
    anggaran:float


class UpdateRfk(SQLModel):
    id_realisasi:uuid.UUID
    fisik:float
    keuangan:float
    masalah:str | None=Field(default=None)
    upaya:str | None=Field(default=None)


class Rfk(SQLModel,table=True):
    __tablename__ = "ta_pekerjaan_realisasi"
    id: uuid.UUID = Field(primary_key=True)
    id_sub_pd : int
    id_pekerjaan :uuid.UUID
    bulan:int
    keuangan:float
    fisik:float
    masalah:str | None=Field(default=None)
    upaya:str | None=Field(default=None)
    keuangan_lalu : float
    fisik_lalu :float


class RfkRealKeu(BaseModel):
    idsubkegiatan :uuid.UUID
    id_sub_pd : int
    tahun: int
    ragu: float
    rapr: float
    rdes: float
    rfeb: float
    rjan: float
    rjul: float
    rjun: float
    rmar: float
    rmei: float
    rnov: float
    rokt: float
    rsep: float
    anggaran:float

class KirimLaporan(BaseModel):
    bulan: int
    fmis: float
    id_laporan: int
    id_sub_pd: int
    rkeu: float
    tahun: int
    tanggal: date

class LaporanRKO(SQLModel,table=True):
    __tablename__ = "ta_laporan_rko"
    id: int = Field(default=None, primary_key=True)
    kd_tahap : int
    id_sub_pd : int
    v1 : int
    tgl1 : datetime
    user1 : str
    v2 : int
    tgl2 : datetime
    user2 : str

class UpdateRKO(BaseModel):
    id_sub_pd : int
    id_tahap : int
    method : str
    pagu_kegiatan : float | None = Field(default=None)
    pagu_pekerjaan : float | None = Field(default=None)
    rencana_fisik : float | None = Field(default=None)