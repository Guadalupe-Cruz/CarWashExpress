from backend.database import get_db_connection
from backend.sesion import get_session

# ==========================================
# FUNCIONES CRUD PARA DESCUENTOS DE INSUMOS
# ==========================================

def get_descuentos_insumos(page=1, limit=6):
    """
    Obtiene una lista de descuentos de insumos con paginación.

    Args:
        page (int): Número de la página actual.
        limit (int): Cantidad de registros por página.

    Returns:
        dict: Diccionario que contiene la lista de descuentos de insumos
            y el número total de páginas.
    """
    session = get_session()  # Obtener los datos de la sesión actual
    idsucursal = session.get("id_sucursal")  # ID de la sucursal asociada a la sesión

    connection = get_db_connection()  # Establecer la conexión con la base de datos
    cursor = connection.cursor(dictionary=True)

    # Cálculo del offset para la paginación
    offset = (page - 1) * limit

    # Consulta para obtener los descuentos de insumos de la sucursal actual
    cursor.execute(
        "SELECT * FROM vw_descuentos_insumos_admin WHERE id_sucursal = %s LIMIT %s OFFSET %s",
        (idsucursal, limit, offset)
    )
    descuentos_insumos = cursor.fetchall()

    # Formatear la fecha y hora del descuento para mejor legibilidad
    for descuento in descuentos_insumos:
        descuento['fecha_hora_descuento'] = format_datetime(descuento['fecha_hora_descuento'])

    # Obtener el número total de descuentos de insumos para la sucursal actual
    cursor.execute(
        "SELECT COUNT(*) AS total FROM vw_descuentos_insumos_admin WHERE id_sucursal = %s",
        (idsucursal,)
    )
    total_clients = cursor.fetchone()["total"]

    # Cierre de la conexión a la base de datos
    cursor.close()
    connection.close()

    # Cálculo del total de páginas para la paginación
    total_pages = (total_clients + limit - 1) // limit

    return {"descuentos_insumos": descuentos_insumos, "total_pages": total_pages}

def format_datetime(datetime_obj):
    """
    Formatea un objeto datetime en una cadena legible.

    Args:
        datetime_obj (datetime): Objeto datetime a formatear.

    Returns:
        str: Fecha y hora en formato 'YYYY-MM-DD HH:MM:SS',
            o None si datetime_obj es None.
    """
    return datetime_obj.strftime('%Y-%m-%d %H:%M:%S') if datetime_obj else None
