from collections.abc import Generator
from typing import Annotated, Any,List, Dict

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from sqlmodel import Session, select

from app.core import security
from app.core.config import settings
from app.core.db import engine,sso_engine
from app.models.users import TokenPayload, User,UserSSO

from sqlalchemy.exc import SQLAlchemyError

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

def get_db2() -> Generator[Session, None, None]:
    with Session(sso_engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
SessionSSODep = Annotated[Session, Depends(get_db2)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]
TahunAnggaran =settings.TAHUN_ANGGARAN


def get_current_user(session: SessionDep, token: TokenDep) -> UserSSO:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (InvalidTokenError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
   
    stmt = select(UserSSO).where(UserSSO.username==token_data.sub)        
    results = session.exec(stmt).first()
    if not results:
        raise HTTPException(status_code=404, detail="User not found")
    return results


CurrentUser = Annotated[UserSSO, Depends(get_current_user)]


def get_current_active_superuser(current_user: CurrentUser) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user


def rows_to_dicts(rows: List[Any]) -> List[Dict[str, Any]]:
    return [dict(getattr(r, "_mapping", r)) if hasattr(r, "_mapping") else dict(r) for r in rows]


from fastapi.templating import Jinja2Templates
templates = Jinja2Templates(directory="templates")
templates.env.globals['app_name'] = "E-Monev "
templates.env.globals['baseurl'] = settings.BASE_URL

def get_templates():
    return templates

def RowstoDicts(rows: List[Any]) -> List[Dict[str, Any]]:
    return [dict(getattr(r, "_mapping", r)) if hasattr(r, "_mapping") else dict(r) for r in rows]



def handle_errordb(e, session=None):
    # Database error
    if isinstance(e, SQLAlchemyError):
        if session:
            session.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

    # HTTPException langsung lempar ulang
    if isinstance(e, HTTPException):
        raise e

    # Error lain
    if session:
        session.rollback()
    raise HTTPException(
        status_code=500,
        detail=f"Unexpected error: {str(e)}"
    )
