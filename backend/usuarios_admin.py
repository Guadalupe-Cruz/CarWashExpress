from backend.database import get_db_connection

# ==============================
# FUNCIONES PARA LOS USUARIOS
# ==============================

def get_users(page=1, limit=7):
    """
    Obtiene una lista de usuarios con paginación.

    Args:
        page (int): Número de página.
        limit (int): Cantidad de usuarios por página.

    Returns:
        dict: Diccionario con la lista de usuarios y el total de páginas.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM vw_usuarios_admin LIMIT %s OFFSET %s", (limit, offset))
    usuarios = cursor.fetchall()

    # Calcular el número total de usuarios
    cursor.execute("SELECT COUNT(*) AS total FROM vw_usuarios_admin")
    total_usuarios = cursor.fetchone()["total"]

    cursor.close()
    connection.close()

    # Calcular el total de páginas
    total_pages = (total_usuarios + limit - 1) // limit

    return {"usuarios": usuarios, "total_pages": total_pages}

# =======================================================================================================================

def get_users_historical(page=1, limit=7):
    """
    Obtiene una lista de usuarios históricos con paginación.

    Args:
        page (int): Número de página.
        limit (int): Cantidad de usuarios históricos por página.

    Returns:
        dict: Diccionario con la lista de usuarios históricos y el total de páginas.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM usuarios_historicos LIMIT %s OFFSET %s", (limit, offset))
    usuarios = cursor.fetchall()

    # Formatear las fechas 'tiempo_inicio' y 'tiempo_fin' antes de enviarlas
    for usuario in usuarios:
        usuario['fecha_borrado'] = format_datetime(usuario['fecha_borrado'])

    # Calcular el número total de usuarios históricos
    cursor.execute("SELECT COUNT(*) AS total FROM usuarios_historicos")
    total_usuarios = cursor.fetchone()["total"]

    cursor.close()
    connection.close()

    # Calcular el total de páginas
    total_pages = (total_usuarios + limit - 1) // limit

    return {"usuarios": usuarios, "total_pages": total_pages}

# =======================================================================================================================

def format_datetime(datetime_obj):
    """
    Formatea un objeto datetime a una cadena en formato 'YYYY-MM-DD HH:MM:SS'.

    Args:
        datetime_obj (datetime): Objeto datetime a formatear.

    Returns:
        str: Cadena con el formato 'YYYY-MM-DD HH:MM:SS'.
    """
    return datetime_obj.strftime('%Y-%m-%d %H:%M:%S') if datetime_obj else None
