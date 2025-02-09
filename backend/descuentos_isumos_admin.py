from backend.database import get_db_connection
from backend.sesion import get_session

# ==========================================
# FUNCIONES CRUD PARA DESCUENTOS DE INSUMOS
# ==========================================

def get_descuentos_insumos(page=1, limit=6):
    session = get_session()  # Obtener los datos de la sesión actual
    idsucursal = session.get("id_sucursal")
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Cálculo del offset para la paginación
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM vw_descuentos_insumos_admin WHERE id_sucursal = %s LIMIT %s OFFSET %s", (idsucursal, limit, offset))
    descuentos_insumos = cursor.fetchall()

    # Formatear la fecha de expiración de la membresía
    for descuento in descuentos_insumos:
        descuento['fecha_hora_descuento'] = format_datetime(descuento['fecha_hora_descuento'])

    # Obtener el número total de descuentos_insumos
    cursor.execute("SELECT COUNT(*) AS total FROM vw_descuentos_insumos_admin WHERE id_sucursal = %s", (idsucursal,))
    total_clients = cursor.fetchone()["total"]

    # Cierre de la conexión
    cursor.close()
    connection.close()

    # Cálculo del total de páginas
    total_pages = (total_clients + limit - 1) // limit

    return {"descuentos_insumos": descuentos_insumos, "total_pages": total_pages}

def format_datetime(datetime_obj):
    """
    Formatea un objeto datetime en un string legible.

    Args:
        datetime_obj (datetime): Objeto datetime.

    Returns:
        str: Fecha y hora en formato 'YYYY-MM-DD HH:MM:SS'.
    """
    return datetime_obj.strftime('%Y-%m-%d %H:%M:%S') if datetime_obj else None