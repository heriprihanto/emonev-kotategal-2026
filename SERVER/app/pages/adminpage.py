from typing import Any
from fastapi import FastAPI, Request,APIRouter
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

router = APIRouter()

templates = Jinja2Templates(directory="templates")


@router.get("/", response_class=HTMLResponse)
async def read_items(request: Request):
   return templates.TemplateResponse(
        request=request, name="adminpage.html", context={"id": 1}
    )




