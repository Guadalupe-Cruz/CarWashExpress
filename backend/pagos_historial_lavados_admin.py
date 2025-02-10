from backend.database import get_db_connection

# ===============================
# FUNCIONES PARA HISTORIAL_LAVADOS
# ===============================

def get_wash_history(page=1, limit=7):
    """
    Obtiene los historiales de lavados con paginación.

    Args:
        page (int): Número de la página actual.
        limit (int): Cantidad de registros por página.

    Returns:
        dict: Diccionario que contiene la lista de historiales de lavados y el total de páginas.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Cálculo del desplazamiento para la paginación
    offset = (page - 1) * limit
    
    # Consulta para obtener el historial de lavados con paginación
    cursor.execute("SELECT * FROM vw_pagos_historial_lavado LIMIT %s OFFSET %s", (limit, offset))
    historial_lavados = cursor.fetchall()

    # Formatear las fechas antes de enviarlas
    for historial in historial_lavados:
        historial['fecha_pago'] = format_datetime(historial['fecha_pago'])
        historial['tiempo_inicio'] = format_datetime(historial['tiempo_inicio'])
        historial['tiempo_fin'] = format_datetime(historial['tiempo_fin'])

    # Calcular el número total de registros de lavados
    cursor.execute("SELECT COUNT(*) AS total FROM vw_pagos_historial_lavado")
    total_lavados = cursor.fetchone()["total"]

    cursor.close()
    connection.close()

    # Cálculo del total de páginas
    total_pages = (total_lavados + limit - 1) // limit

    return {"historial_lavados": historial_lavados, "total_pages": total_pages}

# =======================================================================================================================

def get_wash_history_historical(page=1, limit=7):
    """
    Obtiene los historiales de lavados eliminados (históricos) con paginación.

    Args:
        page (int): Número de la página actual.
        limit (int): Cantidad de registros por página.

    Returns:
        dict: Diccionario que contiene la lista de historiales eliminados y el total de páginas.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Cálculo del desplazamiento para la paginación
    offset = (page - 1) * limit
    
    # Consulta para obtener el historial de lavados eliminados con paginación
    cursor.execute("SELECT * FROM pagos_historial_lavado_historico LIMIT %s OFFSET %s", (limit, offset))
    historial_lavados = cursor.fetchall()

    # Formatear las fechas 'tiempo_inicio', 'tiempo_fin' y 'fecha_borrado' antes de enviarlas
    for historial in historial_lavados:
        historial['tiempo_inicio'] = format_datetime(historial['tiempo_inicio'])
        historial['tiempo_fin'] = format_datetime(historial['tiempo_fin'])
        historial['fecha_pago'] = format_datetime(historial['fecha_pago'])
        historial['fecha_borrado'] = format_datetime(historial['fecha_borrado'])

    # Calcular el número total de registros eliminados
    cursor.execute("SELECT COUNT(*) AS total FROM pagos_historial_lavado_historico")
    total_lavados = cursor.fetchone()["total"]

    cursor.close()
    connection.close()

    # Cálculo del total de páginas
    total_pages = (total_lavados + limit - 1) // limit

    return {"historial_lavados": historial_lavados, "total_pages": total_pages}

# =======================================================================================================================

def search_wash_count_by_id(client_id):
    """
    Obtiene la cantidad de lavados por ID del cliente.

    Args:
        client_id (int): ID del cliente.

    Returns:
        dict: Diccionario que contiene la cantidad de lavados del cliente.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    # Consulta para obtener la cantidad de lavados de un cliente específico
    cursor.execute("SELECT * FROM vw_cantidad_lavados_admin WHERE id_cliente = %s", (client_id,))
    cliente = cursor.fetchone()
    
    cursor.close()
    connection.close()

    return cliente

# =======================================================================================================================

def format_datetime(datetime_obj):
    """
    Formatea un objeto datetime a un string legible.

    Args:
        datetime_obj (datetime): Objeto de fecha y hora.

    Returns:
        str: Fecha y hora en formato 'YYYY-MM-DD HH:MM:SS' o None si no hay fecha.
    """
    return datetime_obj.strftime('%Y-%m-%d %H:%M:%S') if datetime_obj else None
