import psycopg2

def get_db():
    return psycopg2.connect(
        host="localhost",
        port=5432,
        database="renstra",
        user="monevrkpd",
        password="heriprihanto140286"
    )
