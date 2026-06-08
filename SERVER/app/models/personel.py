from typing import Optional, List,Set

from uuid_extensions import uuid7, uuid7str
import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel, Column, String, ARRAY 

from sqlalchemy.dialects.postgresql import JSON


class CascadingRenstra(SQLModel):
    cascading_renstra: dict = Field(sa_type=JSON, nullable=False)


class Personel(SQLModel,table=True):
    __tablename__ = "ta_personel"
    id: int | None = Field(default=None, primary_key=True)
    nip :str | None= Field(default=None)
    nama :str | None= Field(default=None)
    jabatan :str | None= Field(default=None)
    pangkat :str | None= Field(default=None)
    golongan :str | None= Field(default=None)
    level :int | None =Field(default=None)
    id_atasan :int | None =Field(default=None)
    eselon :int | None =Field(default=None)
    eselon_a :str | None= Field(default=None)
    tahun :int | None =Field(default=None)
    id_sub_pd :int | None =Field(default=None)
    kedudukan :int | None =Field(default=None)
