import eel
import mysql.connector

# ==============================
# CONEXIÓN A LA BASE DE DATOS
# ==============================
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',          # Cambia esto por tu host
        user='root',               # Cambia esto por tu usuario
        password='',                # Cambia esto por tu contraseña
        database='db_autolavado'    # Cambia esto por tu base de datos
    )

# ==============================
# FUNCIONES CRUD PARA SUCURSALES
# ==============================

def get_branches():
    """Obtiene las sucursales."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM sucursales")
    sucursales = cursor.fetchall()
    
    cursor.close()
    connection.close()
    
    return sucursales