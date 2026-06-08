import psycopg2
from psycopg2.pool import SimpleConnectionPool
from concurrent.futures import ThreadPoolExecutor
import asyncio
from .config import DB

_pool = None
_executor = ThreadPoolExecutor(max_workers=4)

def init_pool(minconn=1, maxconn=10):
    global _pool
    if _pool is None:
        _pool = SimpleConnectionPool(minconn, maxconn, **DB)

def get_conn():
    global _pool
    if _pool is None:
        init_pool()
    return _pool.getconn()

def put_conn(conn):
    global _pool
    if _pool:
        _pool.putconn(conn)

async def run_query(sql, params=None, fetch=False):
    loop = asyncio.get_running_loop()

    def _sync():
        conn = None
        try:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(sql, params)
            res = None
            if fetch:
                res = cur.fetchall()
            conn.commit()
            cur.close()
            return res
        except Exception as e:
            if conn:
                conn.rollback()
            raise
        finally:
            if conn:
                put_conn(conn)

    return await loop.run_in_executor(_executor, _sync)

async def call_proc(procname, params: tuple = ()):
    """Call a stored procedure with positional params, e.g. CALL insert_tujuan(%s, %s);"""
    placeholders = ",".join(["%s"] * len(params)) if params else ""
    sql = f"CALL {procname}({placeholders});"
    return await run_query(sql, params=params)
