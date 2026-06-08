import asyncio
try:
    from InquirerPy import inquirer
    from InquirerPy.separator import Separator
except Exception:
    inquirer = None
    Separator = None

from core.db import init_pool

from fetch import (
    tujuan,
    indikator_tujuan,
    sasaran,
    indikator_sasaran,
    program,
    indikator_program,
    kegiatan,
    kegiatan_output,
    subkegiatan,
)

try:
    from fetch_all_renstra import (
        get_opd_list,
        get_subopd_list,
        get_tujuan_list,
        get_program_list,
        get_kegiatan_list,
        get_kegiatan_output_list,
    )
except Exception:
    def get_opd_list(): return []
    def get_subopd_list(): return []
    def get_tujuan_list(): return []
    def get_program_list(): return []
    def get_kegiatan_list(): return []
    def get_kegiatan_output_list(): return []

MENU_CHOICES = [
    {"name": "Fetch Tujuan", "value": "tujuan"},
    {"name": "Fetch Indikator Tujuan", "value": "indikator_tujuan"},
    {"name": "Fetch Sasaran", "value": "sasaran"},
    {"name": "Fetch Indikator Sasaran", "value": "indikator_sasaran"},
    {"name": "Fetch Program", "value": "program"},
    {"name": "Fetch Indikator Program", "value": "indikator_program"},
    {"name": "Fetch Kegiatan", "value": "kegiatan"},
    {"name": "Fetch Output Kegiatan", "value": "kegiatan_output"},
    {"name": "Fetch Subkegiatan", "value": "subkegiatan"},
    {"name": "Fetch SEMUA (urut)", "value": "all"},
    {"name": "Keluar", "value": "exit"},
]

async def run_choice(choice):
    if choice == "tujuan":
        return await tujuan.run(get_opd_list)
    if choice == "indikator_tujuan":
        return await indikator_tujuan.run(get_tujuan_list)
    if choice == "sasaran":
        return await sasaran.run(get_opd_list)
    if choice == "indikator_sasaran":
        return await indikator_sasaran.run(get_program_list)
    if choice == "program":
        return await program.run(get_subopd_list)
    if choice == "indikator_program":
        return await indikator_program.run(get_program_list)
    if choice == "kegiatan":
        return await kegiatan.run(get_program_list)
    if choice == "kegiatan_output":
        return await kegiatan_output.run(get_kegiatan_list)
    if choice == "subkegiatan":
        return await subkegiatan.run(get_kegiatan_output_list)
    if choice == "all":
        await tujuan.run(get_opd_list)
        await indikator_tujuan.run(get_tujuan_list)
        await sasaran.run(get_opd_list)
        await indikator_sasaran.run(get_program_list)
        await program.run(get_subopd_list)
        await indikator_program.run(get_program_list)
        await kegiatan.run(get_program_list)
        await kegiatan_output.run(get_kegiatan_list)
        return await subkegiatan.run(get_kegiatan_output_list)

def main():
    init_pool()
    while True:
        if inquirer:
            choice = inquirer.select(message="Pilih aksi:", choices=MENU_CHOICES, pointer="➡").execute()
        else:
            print("Pilih aksi:")
            for i, c in enumerate(MENU_CHOICES, start=1):
                print(f"{i}. {c['name']}")
            s = input("Pilihan (number): ").strip()
            try:
                idx = int(s) - 1
                if idx < 0 or idx >= len(MENU_CHOICES):
                    print("Pilihan tidak valid.")
                    continue
                choice = MENU_CHOICES[idx]["value"]
            except Exception:
                print("Pilihan tidak valid.")
                continue

        if choice == "exit":
            print("Keluar.")
            break
        print(f"Menjalankan: {choice} ...")
        asyncio.run(run_choice(choice))
        print("Selesai. Kembali ke menu.\n")

if __name__ == "__main__":
    main()
