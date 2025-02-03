import mariadb

def get_db_connection():
    try:
        conn = mariadb.connect(
            user="root",
            password="root",
            host="localhost",
            port=3306,  # Puerto por defecto de MariaDB
            database="db_carwashexpress"
        )
        return conn
    except mariadb.Error as e:
        print(f"Error conectando a MariaDB: {e}")
        return None