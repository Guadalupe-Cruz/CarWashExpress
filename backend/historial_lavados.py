import eel
from datetime import datetime
import mysql.connector

# ==============================
# CONEXIÓN A LA BASE DE DATOS
# ==============================
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',          # Cambia esto por tu host
        user='root',               # Cambia esto por tu usuario
        password='',                # Cambia esto por tu contraseña
        database='db_carwashexpress'    # Cambia esto por tu base de datos
    )

# =================================
# FUNCIONES PARA HISTORIAL_LAVADOS
# =================================

def get_wash_history(page=1, limit=7):
    """Obtiene los historiales de lavados con paginación."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM VW_Historial_Lavados LIMIT %s OFFSET %s", (limit, offset))
    historial_lavados = cursor.fetchall()
    
    # Formatear las fechas 'tiempo_inicio' y 'tiempo_fin' antes de enviarlas
    for historial in historial_lavados:
        historial['tiempo_inicio'] = format_datetime(historial['tiempo_inicio'])
        historial['tiempo_fin'] = format_datetime(historial['tiempo_fin'])
    
    cursor.execute("SELECT COUNT(*) AS total FROM VW_Historial_Lavados")
    total_lavados = cursor.fetchone()["total"]
    
    cursor.close()
    connection.close()
    
    total_pages = (total_lavados + limit - 1) // limit  # Cálculo de páginas
    
    return {"historial_lavados": historial_lavados, "total_pages": total_pages}


def get_wash_history_historical(page=1, limit=7):
    """Obtiene los historicos de historial de lavados con paginación."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM VW_Historial_Lavados_Eliminados LIMIT %s OFFSET %s", (limit, offset))
    historial_lavados = cursor.fetchall()
    
    # Formatear las fechas 'tiempo_inicio' y 'tiempo_fin' antes de enviarlas
    for historial in historial_lavados:
        historial['tiempo_inicio'] = format_datetime(historial['tiempo_inicio'])
        historial['tiempo_fin'] = format_datetime(historial['tiempo_fin'])
    
    cursor.execute("SELECT COUNT(*) AS total FROM VW_Historial_Lavados_Eliminados")
    total_lavados = cursor.fetchone()["total"]
    
    cursor.close()
    connection.close()
    
    total_pages = (total_lavados + limit - 1) // limit  # Cálculo de páginas
    
    return {"historial_lavados": historial_lavados, "total_pages": total_pages}


def format_datetime(datetime_obj):
    """Formato de fecha y hora en formato legible."""
    return datetime_obj.strftime('%Y-%m-%d %H:%M:%S') if datetime_obj else None
