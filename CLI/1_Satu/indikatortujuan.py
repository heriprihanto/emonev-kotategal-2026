import httpx
import json
from config import get_db

def get_list_tujuan():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT idtujuan, kodeskpd FROM renstra_tujuan ORDER BY kodeskpd, idtujuan;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

def fetch_indikator(idtujuan, kodeskpd):
    url = "https://sipd-ri.kemendagri.go.id/renstra/e0e2a17312441084a9a8c6b8049bc48d6445107e/?m=daerah_renstra_d_rakhir_tujuan&f=datatable_indikator_tujuan"

    cookies = {
        "PHPSESSID": "bomq8ltcm566keqc7789i15q18"   # <- ganti sesuai session aktif
    }

    data = {
        "draw": 1,
        "start": 0,
        "length": 200,
        "idtujuan": idtujuan,
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
        return r.json().get("data", [])

def save_indikator(items):
    conn = get_db()
    cur = conn.cursor()

    sql = """
        INSERT INTO renstra_indikator_tujuan (
            idtujuan_indikator, idtujuan, kodepemda, idperiode, kodeskpd,
            uraitujuan_indikator, status, satuan,
            target_awal, target0, target1, target2, target3, target4, target5,
            target6, target7, creator, updater, postdate, lastupdate,
            pilihan_input, tipe_data, kodeindikator_master, dssd, sumber,
            master_aspek, iku, ikd, uraiaspek, aspek,
            kodebidang_ikk, uraibidang_ikk, urut, total_catatan, no_urut
        ) VALUES (
            %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s
        )
        ON CONFLICT (idtujuan_indikator) DO NOTHING;
    """

    for d in items:
        cur.execute(sql, (
            d["idtujuan_indikator"],
            d["idtujuan"],
            d["kodepemda"],
            d["idperiode"],
            d["kodeskpd"],
            d["uraitujuan_indikator"],
            d.get("status"),
            d.get("satuan"),
            d.get("target_awal"),
            d.get("target0"),
            d.get("target1"),
            d.get("target2"),
            d.get("target3"),
            d.get("target4"),
            d.get("target5"),
            d.get("target6"),
            d.get("target7"),
            d.get("creator"),
            d.get("updater"),
            d.get("postdate"),
            d.get("lastupdate"),
            json.dumps(d.get("pilihan_input", [])),
            d.get("tipe_data"),
            d.get("kodeindikator_master"),
            json.dumps(d.get("dssd", [])),
            d.get("sumber"),
            d.get("master_aspek"),
            d.get("iku"),
            d.get("ikd"),
            d.get("uraiaspek"),
            d.get("aspek"),
            d.get("kodebidang_ikk"),
            d.get("uraibidang_ikk"),
            int(d["urut"]) if d.get("urut") else None,
            d.get("total_catatan"),
            int(d["no"]) if d.get("no") else None
        ))

    conn.commit()
    cur.close()
    conn.close()

def main():
    tujuan_list = get_list_tujuan()
    print(f"Total tujuan ditemukan: {len(tujuan_list)}")

    for idtujuan, kodeskpd in tujuan_list:
        print(f"\nMengambil indikator tujuan: {idtujuan} | {kodeskpd}")
        data = fetch_indikator(idtujuan, kodeskpd)

        if not data:
            print("Tidak ada data indikator, lanjut...")
            continue

        print(f"Menyimpan {len(data)} indikator...")
        save_indikator(data)
        print("Selesai.")

if __name__ == "__main__":
    main()
