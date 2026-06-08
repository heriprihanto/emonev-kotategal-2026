from fastapi import APIRouter

from app.pages import reports


page_router = APIRouter()


page_router.include_router(reports.router, prefix="/laporan", tags=["laporan"])

