from sqlmodel import Session, create_engine, select

#from app.core import crud
from app.core.config import settings
from app.models.users import User, UserCreate

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI),echo=True)
#engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


#sso_engine = create_engine("postgresql+psycopg://monevrkpd:heriprihanto140286@192.168.50.75/db_sso_tegal")
sso_engine = create_engine(str(settings.SSO_SQLALCHEMY_DATABASE_URI),echo=True)


