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
# FUNCIONES PARA LOS USUARIO
# ==============================

def get_users(page=1, limit=7):
    """Obtiene los usuarios con paginación."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM usuarios LIMIT %s OFFSET %s", (limit, offset))
    usuarios = cursor.fetchall()
    
    cursor.execute("SELECT COUNT(*) AS total FROM usuarios")
    total_usuarios = cursor.fetchone()["total"]
    
    cursor.close()
    connection.close()
    
    total_pages = (total_usuarios + limit - 1) // limit  # Cálculo de páginas
    
    return {"usuarios": usuarios, "total_pages": total_pages}


def get_users_historical(page=1, limit=7):
    """Obtiene los historicos de usuarios con paginación."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM usuarios_eliminados LIMIT %s OFFSET %s", (limit, offset))
    usuarios = cursor.fetchall()
    
    # Formatear las fechas 'tiempo_inicio' y 'tiempo_fin' antes de enviarlas
    for usuario in usuarios:
        usuario['fecha_borrado'] = format_datetime(usuario['fecha_borrado'])
    
    cursor.execute("SELECT COUNT(*) AS total FROM usuarios_eliminados")
    total_usuarios = cursor.fetchone()["total"]
    
    cursor.close()
    connection.close()
    
    total_pages = (total_usuarios + limit - 1) // limit  # Cálculo de páginas
    
    return {"usuarios": usuarios, "total_pages": total_pages}


def format_datetime(datetime_obj):
    """Formato de fecha y hora en formato legible."""
    return datetime_obj.strftime('%Y-%m-%d %H:%M:%S') if datetime_obj else None