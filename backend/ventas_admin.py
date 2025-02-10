from backend.database import get_db_connection

# ==============================
# FUNCIONES CRUD PARA VENTAS
# ==============================

def cierre_caja(page=1, limit=6):
    """
    Obtiene el listado de cierres de caja con paginación.

    Args:
        page (int): Número de página actual.
        limit (int): Cantidad de registros por página.

    Returns:
        dict: Diccionario con la lista de cierres de caja y el total de páginas.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Cálculo del offset para la paginación
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM vw_cierre_caja LIMIT %s OFFSET %s", (limit, offset))
    cierre_cajas = cursor.fetchall()

    # Formateo de la fecha de cierre y el monto total
    for cierre in cierre_cajas:
        cierre['fecha_cierre'] = format_datetime(cierre['fecha_cierre'])
        cierre['monto_total'] = "{:,.2f}".format(cierre['monto_total']) if cierre['monto_total'] is not None else "0.00"

    # Obtención del número total de cierres de caja
    cursor.execute("SELECT COUNT(*) AS total FROM vw_cierre_caja")
    total_clients = cursor.fetchone()["total"]

    # Cierre de la conexión a la base de datos
    cursor.close()
    connection.close()

    # Cálculo del total de páginas
    total_pages = (total_clients + limit - 1) // limit

    return {"cierre_cajas": cierre_cajas, "total_pages": total_pages}

def cierre_caja_mes(page=1, limit=6):
    """
    Obtiene el listado de cierres de caja por mes con paginación.

    Args:
        page (int): Número de página actual.
        limit (int): Cantidad de registros por página.

    Returns:
        dict: Diccionario con la lista de cierres de caja mensuales y el total de páginas.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Cálculo del offset para la paginación
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM vw_cierre_caja_mes_admin LIMIT %s OFFSET %s", (limit, offset))
    cierre_cajas = cursor.fetchall()

    # Formateo del total de ventas
    for cierre in cierre_cajas:
        cierre['total_ventas'] = "{:,.2f}".format(cierre['total_ventas']) if cierre['total_ventas'] is not None else "0.00"

    # Obtención del número total de cierres de caja mensuales
    cursor.execute("SELECT COUNT(*) AS total FROM vw_cierre_caja_mes_admin")
    total_clients = cursor.fetchone()["total"]

    # Cierre de la conexión a la base de datos
    cursor.close()
    connection.close()

    # Cálculo del total de páginas
    total_pages = (total_clients + limit - 1) // limit

    return {"cierre_cajas": cierre_cajas, "total_pages": total_pages}

def format_datetime(datetime_obj):
    """
    Formatea un objeto datetime en un string legible.

    Args:
        datetime_obj (datetime): Objeto datetime.

    Returns:
        str: Fecha y hora en formato 'YYYY-MM-DD HH:MM:SS'.
    """
    return datetime_obj.strftime('%Y-%m-%d %H:%M:%S') if datetime_obj else None
