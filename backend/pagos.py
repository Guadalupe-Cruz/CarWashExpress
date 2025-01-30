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
# FUNCIONES PARA PAGOS
# ==============================

def get_payments(page=1, limit=7):
    """Obtiene los pagos con paginación."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM VW_Pagos LIMIT %s OFFSET %s", (limit, offset))
    pagos = cursor.fetchall()
    
    # Formatear las fechas 'tiempo_inicio' y 'tiempo_fin' antes de enviarlas
    for pago in pagos:
        pago['fecha_pago'] = format_datetime(pago['fecha_pago'])
    
    cursor.execute("SELECT COUNT(*) AS total FROM VW_Pagos")
    total_pagos = cursor.fetchone()["total"]
    
    cursor.close()
    connection.close()
    
    total_pages = (total_pagos + limit - 1) // limit  # Cálculo de páginas
    
    return {"pagos": pagos, "total_pages": total_pages}


def get_payments_historical(page=1, limit=7):
    """Obtiene el historico pagos con paginación."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM VW_Pagos_Eliminados LIMIT %s OFFSET %s", (limit, offset))
    pagos = cursor.fetchall()
    
    # Formatear las fechas 'tiempo_inicio' y 'tiempo_fin' antes de enviarlas
    for pago in pagos:
        pago['fecha_pago'] = format_datetime(pago['fecha_pago'])
        pago['fecha_borrado'] = format_datetime(pago['fecha_borrado'])
    
    cursor.execute("SELECT COUNT(*) AS total FROM VW_Pagos_Eliminados")
    total_pagos = cursor.fetchone()["total"]
    
    cursor.close()
    connection.close()
    
    total_pages = (total_pagos + limit - 1) // limit  # Cálculo de páginas
    
    return {"pagos": pagos, "total_pages": total_pages}


def format_datetime(datetime_obj):
    """Formato de fecha y hora en formato legible."""
    return datetime_obj.strftime('%Y-%m-%d %H:%M:%S') if datetime_obj else None