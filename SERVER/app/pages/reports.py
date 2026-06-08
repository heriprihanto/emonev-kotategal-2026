from fastapi import APIRouter, Request, Response
from fastapi.responses import HTMLResponse
from urllib.parse import urlencode
from dotenv import load_dotenv
import os
import httpx

router = APIRouter()


@router.post("/{namalaporan}")
async def preview_report(request: Request, namalaporan:str):
    load_dotenv()
    birt_url = os.getenv("REPORT_URL")

    content_type = request.headers.get("content-type", "")
    if "form" in content_type:
        params = dict(await request.form())
    else:
        params = await request.json()

    report_name = params.get("report_name")
    rpt_format = params.get("format", "pdf")

    if not report_name:
        return Response("Parameter 'report_name' wajib ada", status_code=400)

    if rpt_format not in ["html", "pdf", "xls", "docx"]:
        return Response("Format tidak dikenal", status_code=400)

    
    query = urlencode(params, doseq=True)
    rpturl = f"{birt_url}{report_name}.rptdesign&__format={rpt_format}&{query}"

    try:
        async with httpx.AsyncClient(timeout=60.0, verify=False) as client:
            resp = await client.get(rpturl)
    except httpx.RequestError as e:
        return Response(f"Gagal konek ke BIRT: {e}", status_code=502)

    if resp.status_code != 200:
        return Response(f"Error fetching report: {resp.status_code}", status_code=500)

    match rpt_format:
        case "html":
            return HTMLResponse(content=resp.text)
        case "pdf":
            return Response(resp.content, media_type="application/pdf")
        case "xls":
            headers = {
                "Content-Disposition": f"attachment; filename={report_name}.xls",
                "Cache-Control": "no-cache, must-revalidate",
                "Pragma": "no-cache",
            }
            return Response(
                resp.content,
                media_type="application/vnd.ms-excel",
                headers=headers,
            )
        case "docx":
            headers = {
                "Content-Disposition": f"attachment; filename={report_name}.docx",
                "Cache-Control": "no-cache, must-revalidate",
                "Pragma": "no-cache",
            }
            return Response(
                resp.content,
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                headers=headers,
            )
