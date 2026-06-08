import sentry_sdk
from fastapi import FastAPI,Request
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse,  PlainTextResponse
from fastapi.staticfiles import StaticFiles



from app.api.api_router import api_router
from app.pages.page_router import page_router
from app.core.config import settings
from fastapi.responses import RedirectResponse


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

origins = [
    "https://monevrkpd.tegalkota.go.id", 
    "https://sipd.kemendagri.go.id",
    "https://e-laba.tegalkota.go.id",    
    "*" 
]
# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(page_router)


app.mount("/assets", StaticFiles(directory="ASSETS_STATIC"), name="assets")

from app.pages import frontpage
app.include_router(frontpage.router)



from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.exception_handlers import http_exception_handler




from app.core.deps import get_templates
templates = get_templates()

'''
@app.middleware("http")
async def detect_api(request: Request, call_next):
    request.state.is_api = request.url.path.startswith("/api/")
    return await call_next(request)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler_custom(request: Request, exc: StarletteHTTPException):
    # Jika API, kembalikan error ke endpoint / default FastAPI
    if request.state.is_api:
        raise exc  # <<— penting

    # Hanya untuk HTML
    if exc.status_code == 404:
        return templates.TemplateResponse("404.html", {"request": request}, status_code=404)

    return templates.TemplateResponse(
        "error.html",
        {"request": request, "status_code": exc.status_code},
        status_code=exc.status_code
    )

@app.exception_handler(Exception)
async def internal_exception_handler(request: Request, exc: Exception):

    # Pada API → kembalikan error ke endpoint
    if request.state.is_api:
        raise exc  # <<— dilepas ke default handler FastAPI

    print("ERROR 500:", exc)

    return templates.TemplateResponse(
        "500.html",
        {"request": request},
        status_code=500
    )
'''