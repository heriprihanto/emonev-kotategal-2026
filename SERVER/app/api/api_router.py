from fastapi import APIRouter

from app.api import renstra,rpjmd,login,referensi,kinerja,rfk,rko,personel,pubapi,pengaturan,sipd,dak,ref,kinerjakota,sakip,rencanakinerja,pengguna, dokren

api_router = APIRouter()
api_router.include_router(login.router, prefix="/auth", tags=["auth"])

api_router.include_router(renstra.router, prefix="/renstra", tags=["renstra"])
api_router.include_router(rpjmd.router, prefix="/rpjmd", tags=["rpjmd"])
api_router.include_router(referensi.router, prefix="/referensi", tags=["referensi"])
api_router.include_router(kinerja.router, prefix="/kinerja", tags=["kinerja"])
api_router.include_router(kinerjakota.router, prefix="/kinerjakota", tags=["kinerjakota"])
api_router.include_router(rfk.router, prefix="/rfk", tags=["rfk"])
api_router.include_router(rko.router, prefix="/rko", tags=["rko"])
api_router.include_router(personel.router, prefix="/personel", tags=["personel"])
#api_router.include_router(fmis.router, prefix="/fmis", tags=["fmis"])
api_router.include_router(pubapi.router, prefix="/pubapi", tags=["pubapi"])
api_router.include_router(pengaturan.router, prefix="/pengaturan", tags=["pengaturan"])
api_router.include_router(sipd.router, prefix="/sipd", tags=["sipd"])
api_router.include_router(dak.router, prefix="/dak", tags=["dak"])
api_router.include_router(ref.router, prefix="/ref", tags=["ref"])
api_router.include_router(sakip.router, prefix="/sakip", tags=["sakip"])


api_router.include_router(rencanakinerja.router, prefix="/rencanakinerja", tags=["rencanakinerja"])
api_router.include_router(pengguna.router, prefix="/pengguna", tags=["pengguna"])
api_router.include_router(dokren.router, prefix="/dokren", tags=["dokren"])