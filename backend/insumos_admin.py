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
# FUNCIONES CRUD PARA INSUMOS
# =================================

def get_insumos(page=1, limit=6):
    """Obtiene los insumos con paginación."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM insumos LIMIT %s OFFSET %s", (limit, offset))
    insumos = cursor.fetchall()
    
    # Formatear las fechas 'tiempo_inicio' y 'tiempo_fin' antes de enviarlas
    for insumo in insumos:
        insumo['fecha_suministro'] = format_datetime(insumo['fecha_suministro'])
    
    cursor.execute("SELECT COUNT(*) AS total FROM insumos")
    total_insumos = cursor.fetchone()["total"]
    
    cursor.close()
    connection.close()
    
    total_pages = (total_insumos + limit - 1) // limit  # Cálculo de páginas
    
    return {"insumos": insumos, "total_pages": total_pages}

def add_insumo(nombre_insumo, inventario, fecha_suministro, cantidad_minima):
    """Agrega un nuevo insumo"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    query = """
        INSERT INTO insumos (nombre_insumo, inventario, fecha_suministro, cantidad_minima)
        VALUES (%s, %s, %s, %s)
    """
    
    cursor.execute(query, (nombre_insumo, inventario, fecha_suministro, cantidad_minima))
    connection.commit()
    
    cursor.close()
    connection.close()
    return {"status": "success", "message": "Insumo agregado correctamente."}
    
def get_insumo_by_id(insumoId):
    """Obtiene un insumo por su ID."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM insumos WHERE id_insumo = %s", (insumoId,))
    insumo = cursor.fetchone()
    
    if insumo:
        insumo['fecha_suministro'] = format_datetime(insumo['fecha_suministro'])  # Formatear fecha
    
    cursor.close()
    connection.close()
    
    return insumo

def update_insumo(insumoId, nombre_insumo, inventario, fecha_suministro, cantidad_minima):
    """Actualiza un insumo existente en la base de datos"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    query = """
        UPDATE insumos
        SET nombre_insumo = %s, inventario = %s, fecha_suministro = %s, cantidad_minima = %s
        WHERE id_insumo = %s
    """
    
    cursor.execute(query, (nombre_insumo, inventario, fecha_suministro, cantidad_minima, insumoId))
    connection.commit()
    
    cursor.close()
    connection.close()
    
    return {"status": "success", "message": "Insumo actualizado correctamente."}

def delete_insumos(insumoId):
    """Elimina un insumo de la base de datos"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    query = "DELETE FROM insumos WHERE id_insumo = %s"
    
    cursor.execute(query, (insumoId,))
    connection.commit()
    
    cursor.close()
    connection.close()
    
# =====================================
# FUNCIONES PARA HISTORICOS DE INSUMOS
# =====================================

def restore_insumos(insumoId):
    """Recupera un insumo."""
    connection = get_db_connection()
    cursor = connection.cursor()
    
    query = "DELETE FROM insumos_historicos WHERE id_insumo = %s"
    
    cursor.execute(query, (insumoId,))
    connection.commit()
    
    cursor.close()
    connection.close()
    

def get_insumos_historical(page=1, limit=6):
    """Obtiene los historicos de los insumos con paginación."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM insumos_historicos LIMIT %s OFFSET %s", (limit, offset))
    insumos = cursor.fetchall()
    
    # Formatear las fechas 'tiempo_inicio' y 'tiempo_fin' antes de enviarlas
    for insumo in insumos:
        insumo['fecha_suministro'] = format_datetime(insumo['fecha_suministro'])
        insumo['fecha_borrado'] = format_datetime(insumo['fecha_borrado'])
    
    cursor.execute("SELECT COUNT(*) AS total FROM insumos_historicos")
    total_insumos = cursor.fetchone()["total"]
    
    cursor.close()
    connection.close()
    
    total_pages = (total_insumos + limit - 1) // limit  # Cálculo de páginas
    
    return {"insumos": insumos, "total_pages": total_pages}


# =================================
# FUNCIONES PARA INSUMOS
# =================================

def format_datetime(datetime_obj):
    """Convierte la fecha a formato compatible con <input type='datetime-local'>."""
    return datetime_obj.strftime('%Y-%m-%dT%H:%M') if datetime_obj else None
