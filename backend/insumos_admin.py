from backend.database import get_db_connection
from backend.sesion import get_session

# =================================
# FUNCIONES CRUD PARA INSUMOS
# =================================

def get_insumos(page=1, limit=6):
    """
    Obtiene los insumos con paginación filtrados por idsucursal.

    Args:
        page (int): Número de página.
        limit (int): Cantidad de insumos por página.

    Returns:
        dict: Diccionario con la lista de insumos y el total de páginas.
    """
    
    session = get_session()  # Obtener los datos de la sesión actual
    idsucursal = session.get("id_sucursal")
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM insumos WHERE id_sucursal = %s LIMIT %s OFFSET %s", (idsucursal, limit, offset))
    insumos = cursor.fetchall()

    # Formatear la fecha de suministro
    for insumo in insumos:
        insumo['fecha_suministro'] = format_datetime(insumo['fecha_suministro'])

    cursor.execute("SELECT COUNT(*) AS total FROM insumos WHERE id_sucursal = %s", (idsucursal,))
    total_insumos = cursor.fetchone()["total"]

    cursor.close()
    connection.close()

    total_pages = (total_insumos + limit - 1) // limit  # Cálculo de páginas

    return {"insumos": insumos, "total_pages": total_pages}

def add_insumo(nombre_insumo, inventario, fecha_suministro, cantidad_minima, unidades, cantidad_descuento):
    """
    Agrega un nuevo insumo.

    Args:
        nombre_insumo (str): Nombre del insumo.
        inventario (int): Cantidad en inventario.
        fecha_suministro (str): Fecha de suministro.
        cantidad_minima (int): Cantidad mínima requerida.
        unidades (varchar): Litros, piezas, mililitros.
        cantidad_descuento (int): Cantidad que se descontara a "inventario".

    Returns:
        dict: Resultado de la operación.
    """
    
    session = get_session()  # Obtener los datos de la sesión actual
    idsucursal = session.get("id_sucursal")
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        INSERT INTO insumos (nombre_insumo, inventario, fecha_suministro, cantidad_minima, unidades, cantidad_descuento, id_sucursal)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """

    cursor.execute(query, (nombre_insumo, inventario, fecha_suministro, cantidad_minima, unidades, cantidad_descuento, idsucursal))
    connection.commit()

    cursor.close()
    connection.close()
    return {"status": "success", "message": "Insumo agregado correctamente."}

def actualizar_insumos(p_id_insumo, p_cantidad_descuento, p_unidades):
    """
    Actualiza el inventario de insumos, agrega un registro a la tabla descuentos_insumos
    mediante un Stored Procedure.

    Args:
        nombre_insumo (str): Nombre del insumo.
        inventario (int): Cantidad en inventario.
        fecha_suministro (str): Fecha de suministro.
        cantidad_minima (int): Cantidad mínima requerida.
        unidades (varchar): Litros, piezas, mililitros.
        cantidad_descuento (int): Cantidad que se descontara a "inventario".

    Returns:
        dict: Resultado de la operación.
    """
    
    session = get_session()  # Obtener los datos de la sesión actual
    idsucursal = session.get("id_sucursal")
    id_usuario = session.get("id_usuario");
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Llamar al stored procedure
    cursor.callproc('sp_actualizar_insumos_admin', (p_id_insumo, p_cantidad_descuento, p_unidades, id_usuario, idsucursal))
    connection.commit()
    
    cursor.close()
    connection.close()
    
    return {"status": "success", "message": "Insumo descontado correctamente."}


def get_insumo_by_id(insumoId):
    """
    Obtiene un insumo por su ID.

    Args:
        insumoId (int): ID del insumo.

    Returns:
        dict: Información del insumo.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM insumos WHERE id_insumo = %s", (insumoId,))
    insumo = cursor.fetchone()

    if insumo:
        insumo['fecha_suministro'] = format_datetime(insumo['fecha_suministro'])  # Formatear fecha

    cursor.close()
    connection.close()

    return insumo

def update_insumo(insumoId, nombre_insumo, inventario, fecha_suministro, cantidad_minima, unidades, cantidad_descuento):
    """
    Actualiza un insumo existente en la base de datos.

    Args:
        insumoId (int): ID del insumo.
        nombre_insumo (str): Nombre del insumo.
        inventario (int): Cantidad en inventario.
        fecha_suministro (str): Fecha de suministro.
        cantidad_minima (int): Cantidad mínima requerida.
        unidades (varchar): Litros, piezas, mililitros.
        cantidad_descuento (int): Cantidad que se descontara a "inventario".

    Returns:
        dict: Resultado de la operación.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        UPDATE insumos
        SET nombre_insumo = %s, inventario = %s, fecha_suministro = %s, cantidad_minima = %s, unidades = %s, cantidad_descuento = %s
        WHERE id_insumo = %s
    """

    cursor.execute(query, (nombre_insumo, inventario, fecha_suministro, cantidad_minima, unidades, cantidad_descuento, insumoId))
    connection.commit()

    cursor.close()
    connection.close()

    return {"status": "success", "message": "Insumo actualizado correctamente."}

def delete_insumos(insumoId):
    """
    Elimina un insumo de la base de datos.

    Args:
        insumoId (int): ID del insumo a eliminar.
    """
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
    """
    Recupera un insumo desde el historial.

    Args:
        insumoId (int): ID del insumo a restaurar.
    """
    connection = get_db_connection()
    cursor = connection.cursor()

    query = "DELETE FROM insumos_historicos WHERE id_insumo = %s"

    cursor.execute(query, (insumoId,))
    connection.commit()

    cursor.close()
    connection.close()
    
# =======================================================================================================================

def get_insumos_historical(page=1, limit=6):
    """
    Obtiene los históricos de los insumos con paginación.

    Args:
        page (int): Número de página.
        limit (int): Cantidad de insumos por página.

    Returns:
        dict: Diccionario con la lista de insumos históricos y el total de páginas.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM insumos_historicos LIMIT %s OFFSET %s", (limit, offset))
    insumos = cursor.fetchall()

    # Formatear las fechas antes de enviarlas
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
# FUNCIONES PARA FORMATEO DE FECHAS
# =================================

def format_datetime(datetime_obj):
    """
    Formatea un objeto datetime a un string legible.

    Args:
        datetime_obj (datetime): Objeto de fecha y hora.

    Returns:
        str: Fecha y hora en formato 'YYYY-MM-DD HH:MM:SS' o None si no hay fecha.
    """
    return datetime_obj.strftime('%Y-%m-%d %H:%M:%S') if datetime_obj else None
