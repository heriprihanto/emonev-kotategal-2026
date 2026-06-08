from typing import Any
from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import HTMLResponse, FileResponse

from sqlalchemy import text
import json
import uuid
import os
from pathlib import Path
from dotenv import load_dotenv

from app.core.config import settings
from app.core.deps import SessionDep, get_templates
from fastapi import HTTPException


router = APIRouter()
templates = get_templates()


async def req_dokren_kota():
    file_path = Path("DATA") / "dokren.json"
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


async def req_materi():
    try:
        directory_path = settings.DOKUMEN_PATH
        entries = os.listdir(directory_path)

        files = [
            entry for entry in entries
            if os.path.isfile(os.path.join(directory_path, entry))
            and not entry.startswith('.')
            and entry != 'index.php'
        ]

        return [{"filename": filename} for filename in files]

    except FileNotFoundError:
        print(f"Error: Directory '{directory_path}' not found.")
        return []



@router.get("/", tags=["homepage"])
def homepage(session: SessionDep, request: Request):
    pagename = "Homepage"
    datax = {
        "jmlprogram": session.exec(
            text("SELECT count(DISTINCT nm_program) as jm FROM renja_subkegiatan")
        ).all(),
        "jmlanggaran": session.exec(
            text("SELECT round(sum(anggaran)/1e12, 2) as jm FROM renja_subkegiatan")
        ).all(),
        "jmlrealisasi": session.exec(
            text("SELECT round(sum(realisasi)/1e9, 2) as jm FROM renja_subkegiatan_realisasi")
        ).all(),
        "indikatormakro": session.exec(
            text("""SELECT tolok_ukur, satuan, ck1, ck2, ck3, ck4, ck5, id
                    FROM ta_renja_indikator
                    WHERE 'Indikator Makro' = ANY(tags)
                    ORDER BY tolok_ukur ASC""")
        ).all(),
        "ikukota": session.exec(
            text("""SELECT tolok_ukur, satuan, target, target_akhir,
                    ck1, ck2, ck3, ck4, ck5, id
                    FROM ta_renja_indikator
                    WHERE 'IKU Kota' = ANY(tags)
                    ORDER BY tolok_ukur ASC""")
        ).all(),
        "jmlkegiatan": session.exec(
            text("SELECT count(DISTINCT nm_kegiatan) as jm FROM renja_subkegiatan WHERE anggaran > 0")
        ).all(),
        "jmlsubkegiatan": session.exec(
            text("SELECT count(*) as jm FROM renja_subkegiatan WHERE anggaran > 0")
        ).all(),
    }

    return templates.TemplateResponse(
        request=request,
        name='frontpage.html',
        context={"pagename": pagename, "datax": datax},
    )


@router.get("/{pagename}", tags=["pagename"])
async def read_pages(session: SessionDep, request: Request, pagename: str):
    try:
        opdlist = session.exec(
            text("SELECT kode, id_pd, id_sub_pd, nama_pd FROM ta_opd WHERE is_pd=1 ORDER BY kode ASC")
        ).all()

        datax = {}

        if pagename == "pelaporan-kinerja":
            datax = {
                "lkjipkota": session.exec(
                    text("SELECT * FROM ta_dokumen_lkjip WHERE id_pd=0 ORDER BY tahun DESC")
                ).all()
            }

        elif pagename == "admin":
            datax = {"adminpage": {"rptname": "eval_rkpd"}}

        elif pagename == "kinerja-kota":
            datax = {"menulaporan": {"rptname": "eval_rkpd"}}

        elif pagename in ["rencana-kota", "perencanaan"]:
            datax = {"dokrenkota": await req_dokren_kota()}

        elif pagename == "unduhan":
            datax = {"materi": await req_materi()}

        elif pagename == "evaluasi-kinerja":
            datax = {
                "nilaikota": session.exec(
                    text("SELECT * FROM ta_evaluasi_kinerja WHERE id_pd=0 ORDER BY tahun ASC")
                ).all(),
                "nilaiopd": session.exec(
                    text("""
                        SELECT o.kode, o.nama_pd, x.*
                        FROM ta_opd o
                        JOIN (
                            SELECT id_pd,
                            MAX(CASE WHEN tahun=2020 THEN nilai END) AS nilai_2020,
                            MAX(CASE WHEN tahun=2020 THEN predikat END) AS predikat_2020,
                            MAX(CASE WHEN tahun=2021 THEN nilai END) AS nilai_2021,
                            MAX(CASE WHEN tahun=2021 THEN predikat END) AS predikat_2021,
                            MAX(CASE WHEN tahun=2022 THEN nilai END) AS nilai_2022,
                            MAX(CASE WHEN tahun=2022 THEN predikat END) AS predikat_2022,
                            MAX(CASE WHEN tahun=2023 THEN nilai END) AS nilai_2023,
                            MAX(CASE WHEN tahun=2023 THEN predikat END) AS predikat_2023,
                            MAX(CASE WHEN tahun=2024 THEN nilai END) AS nilai_2024,
                            MAX(CASE WHEN tahun=2024 THEN predikat END) AS predikat_2024
                            FROM ta_evaluasi_kinerja
                            WHERE id_pd > 0
                            GROUP BY id_pd
                        ) x ON o.id_sub_pd = x.id_pd
                        ORDER BY o.kode
                    """)
                ).all()
            }

        return templates.TemplateResponse(
            request=request,
            name=pagename + ".html",
            context={"pagename": pagename, "opdlist": opdlist, "datax": datax},
        )

    except HTTPException:
        return templates.TemplateResponse(
            "500.html",
            {"request": request},
            status_code=500
        )

    except Exception as e:
        return templates.TemplateResponse(
            "500.html",
            {"request": request},
            status_code=500
        )

@router.get("/indikator/{id}", tags=["indikator"], response_class=HTMLResponse)
async def indikator(session: SessionDep, request: Request, id: uuid.UUID):

    sql = text("SELECT * FROM ta_renja_indikator WHERE id = :id").bindparams(id=id)
    indikator_data = session.exec(sql).all()

    return templates.TemplateResponse(
        request=request,
        name="indikator.html",
        context={"datax": {"indikator": indikator_data}},
    )


@router.get("/dokrenpd/{idpd}", tags=["dokren"], response_class=HTMLResponse)
async def dokrenpd(session: SessionDep, request: Request, idpd: int):

    sql = text("""
        SELECT r.jenis, r.dokumen, d.filename, d.id
        FROM ta_dokumen_pd d
        INNER JOIN ref_dookumen r ON d.id_dok = r.id
        WHERE d.id_pd = :idpd
        ORDER BY r.id_jenis, r.id
    """).bindparams(idpd=idpd)

    opdlist = session.exec(sql).all()

    return templates.TemplateResponse(
        request=request,
        name="dokren-pd-modal.html",
        context={"opdlist": opdlist},
    )


@router.get("/doklap/{idpd}", tags=["doklap"], response_class=HTMLResponse)
async def doklap(session: SessionDep, request: Request, idpd: int):

    sql = text(
        "SELECT * FROM ta_dokumen_lkjip WHERE id_pd = :idpd ORDER BY tahun DESC"
    ).bindparams(idpd=idpd)

    opdlist = session.exec(sql).all()

    return templates.TemplateResponse(
        request=request,
        name="doklap-pd-modal.html",
        context={"opdlist": opdlist},
    )


@router.get("/files/{filename}", tags=["files"], response_class=FileResponse)
async def get_file(filename: str):
    load_dotenv()
    upload_path = os.getenv("UPLOAD_PATH")
    return upload_path + "/" + filename
