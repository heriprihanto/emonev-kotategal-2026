#from .fetch_tujuan import update_tujuan
import asyncio
from fetch_subkegiatan import run_fetch_subkegiatan 
from fetch_all_renstra import run_fetch_renstra
import configparser
import os


CONFIG_FILE = "config.ini"


def load_config():
    config = configparser.ConfigParser()
    if os.path.exists(CONFIG_FILE):
        config.read(CONFIG_FILE)
    else:
        config["WEBSESSION"] = {"sessionid": "", "token": ""}
        with open(CONFIG_FILE, "w") as file:
            config.write(file)
    return config

def save_config(config):
    with open(CONFIG_FILE, "w") as file:
        config.write(file)


def menu_tujuan():
    print("\n=== MENU TUJUAN ===")
    print("Contoh: Meningkatkan kualitas pendidikan")
    # Tambahkan logika lain di sini


def menu_sasaran():
    print("\n=== MENU SASARAN ===")
    print("Contoh: Meningkatnya angka partisipasi sekolah")
    # Tambahkan logika lain di sini


def menu_program():
    print("\n=== MENU PROGRAM ===")
    print("Contoh: Program Peningkatan Mutu Pendidikan Dasar")
    # Tambahkan logika lain di sini


def menu_kegiatan():
    print("\n=== MENU KEGIATAN ===")
    print("Contoh: Kegiatan Pelatihan Guru SD")
    # Tambahkan logika lain di sini


def menu_sub_kegiatan():
    print("\n=== MENU SUB KEGIATAN ===")
    print("Sync Database Renstra Sub Kegiatan")
    run_fetch_subkegiatan()
    # Tambahkan logika lain di sini

def menu_update_all_renstra():
    print("\n=== UPDATE ALL DATA RENSTRA ===")
    print("Sync Database Renstra Tujuan, Sasaran, Program, Kegiatan, dan Sub Kegiatan")
    run_fetch_renstra()

def main():
    config = load_config()

    current_sessionid = config["WEBSESSION"].get("sessionid", "")
    current_token = config["WEBSESSION"].get("token", "")

    print("=== SINKRONISASI RENSTRA SIPD DAN LOKAL DATABASE ===")
    print(f"SESSION ID saat ini   : {current_sessionid}")
    print(f"TOKEN saat ini : {current_token}")

    print("(Tekan ENTER untuk tidak mengubah)")
    SESSION_ID = input("Masukkan Session ID   : ").strip()
    TOKEN = input("Masukkan Token : ").strip()

    if SESSION_ID != "":
        config["WEBSESSION"]["sessionid"] = SESSION_ID

    if TOKEN != "":
        config["WEBSESSION"]["token"] = TOKEN

    save_config(config)
    print("\n✔ Data berhasil disimpan ke config.ini")

    while True:
        print("\n=== MENU UTAMA ===")
        print("1. Tujuan")
        print("2. Sasaran")
        print("3. Program")
        print("4. Kegiatan")
        print("5. Sub Kegiatan")
        print("6. Update Renstra (Semua Data)")
        print("0. Keluar")

        pilihan = input("Pilih menu (0-6): ")

        if pilihan == "1":
            update_tujuan()
        elif pilihan == "2":
            menu_sasaran()
        elif pilihan == "3":
            menu_program()
        elif pilihan == "4":
            menu_kegiatan()
        elif pilihan == "5":
            menu_sub_kegiatan()
        elif pilihan == "6":
            menu_update_all_renstra()
        elif pilihan == "0":
            print("Keluar dari program. Terima kasih!")
            break
        else:
            print("Pilihan tidak valid, silakan coba lagi.")


if __name__ == "__main__":
    main()
