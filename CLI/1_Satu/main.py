import httpx
import json
from config import get_db


token = "e0e2a17312441084a9a8c6b8049bc48d6445107e"
session_id = "bomq8ltcm566keqc7789i15q18"  # Update session jika perlu

def get_list_skpd():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT kode as kode_skpd FROM ta_opd WHERE is_pd=1 ORDER BY kode ASC;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [r[0] for r in rows]

def fetch_data(kodeskpd):
    url = f"https://sipd-ri.kemendagri.go.id/renstra/{token}/?m=daerah_renstra_d_rakhir_tujuan"

    cookies = {
        "kt_aside_menu_wrapperst": "0",
        "pemda": '{"domain":"tegal.sipd.kemendagri.go.id","nama":"KOTA TEGAL"}',
        "PHPSESSID": session_id # Update session jika perlu
    }

    data = {
        "draw": 1,
        "start": 0,
        "length": 10000,
        "kodeskpd": kodeskpd
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": "Mozilla/5.0"
    }

    with httpx.Client(timeout=60) as client:
        r = client.post(url, data=data, cookies=cookies, headers=headers)
        r.raise_for_status()
        result = r.json()
        return result.get("data", [])

def save_to_db(items, kodeskpd):
    conn = get_db()
    cur = conn.cursor()

    sql = """
        INSERT INTO renstra_tujuan (
            idtujuan, kodepemda, idperiode, kodeskpd,
            uraitujuan, daftar_bidang, sasaran_rpjmd,
            total_indikator, total_catatan, no_urut
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (idtujuan) DO NOTHING;
    """

    for d in items:
        cur.execute(sql, (
            d["idtujuan"],
            d["kodepemda"],
            d["idperiode"],
            kodeskpd,  # <- dari loop tabel ta_opd
            d["uraitujuan"],
            json.dumps(d.get("daftar_bidang", [])),
            json.dumps(d.get("sasaran_rpjmd", [])),
            int(d["total_indikator"]) if d["total_indikator"] else None,
            d.get("total_catatan"),
            int(d["no"]) if d.get("no") else None
        ))

    conn.commit()
    cur.close()
    conn.close()

def main():
    list_skpd = get_list_skpd()
    print(f"Jumlah SKPD ditemukan: {len(list_skpd)}")

    for kode in list_skpd:
        print(f"\n=== Ambil data SKPD: {kode} ===")
        data = fetch_data(kode)

        if not data:
            print("Tidak ada data, skip.")
            continue

        print(f"→ Ditemukan {len(data)} data, insert...")
        save_to_db(data, kode)
        print("✔ Selesai.")

    print("\n==== Semua proses selesai ====")

if __name__ == "__main__":
    main()
