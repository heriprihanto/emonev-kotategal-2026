import asyncio
import httpx
from typing import Any, Dict, Optional
from tqdm.asyncio import tqdm
from .config import WEB, CONCURRENCY, MAX_RETRIES, TIMEOUT

HEADERS = {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "origin": WEB.get("origin"),
    "referer": WEB.get("origin"),
    "user-agent": "fetch_all_renstra-refactor/1.0",
    "x-requested-with": "XMLHttpRequest",
}

COOKIES = {
    "PHPSESSID": WEB.get("sessionid", ""),
}

async def post_with_retry(url: str, data: Dict[str, Any], session: Optional[httpx.AsyncClient] = None) -> Dict[str, Any]:
    """
    POST with retry and exponential backoff.
    Returns parsed JSON response.
    """
    own_session = session is None
    attempt = 0
    last_exc = None
    while attempt < MAX_RETRIES:
        try:
            if own_session:
                limits = httpx.Limits(max_connections=CONCURRENCY)
                async with httpx.AsyncClient(timeout=TIMEOUT, headers=HEADERS, cookies=COOKIES, limits=limits) as client:
                    resp = await client.post(url, data=data)
            else:
                resp = await session.post(url, data=data)

            if resp.status_code == 429:
                # Too many requests: backoff and retry
                await asyncio.sleep(1 + attempt * 1.5)
                attempt += 1
                continue

            resp.raise_for_status()
            # attempt to parse JSON
            try:
                return resp.json()
            except Exception:
                return {"data": []}

        except (httpx.RequestError, httpx.HTTPStatusError, httpx.TimeoutException) as e:
            last_exc = e
            await asyncio.sleep(1 + attempt * 1.5)
            attempt += 1
            continue

    raise last_exc if last_exc is not None else RuntimeError("Unknown error in post_with_retry")

async def post_many(urls_and_datas, desc: str = None):
    """
    Helper to run many POSTs sequentially with a progress bar.
    `urls_and_datas` => iterable of (url, data, callback)
    callback receives (json_result, original_data) or (None, original_data, exception)
    """
    limits = httpx.Limits(max_connections=CONCURRENCY)
    async with httpx.AsyncClient(timeout=TIMEOUT, headers=HEADERS, cookies=COOKIES, limits=limits) as client:
        results = []
        for item in tqdm(urls_and_datas, desc=desc):
            url, data, callback = item
            try:
                j = await post_with_retry(url, data, session=client)
                if callback:
                    try:
                        await callback(j, data)
                    except Exception:
                        pass
                results.append((True, data))
            except Exception as e:
                if callback:
                    try:
                        await callback(None, data, e)
                    except Exception:
                        pass
                results.append((False, data, str(e)))
        return results
