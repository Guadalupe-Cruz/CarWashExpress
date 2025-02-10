from backend.database import get_db_connection
from backend.sesion import get_session

# ==============================
# FUNCIONES CRUD PARA CLIENTES
# ==============================

def get_clients(page=1, limit=6):
    """
    Obtiene la lista de clientes con paginación, filtrados por id_sucursal.
    
    Args:
        page (int): Número de la página actual.
        limit (int): Número de registros por página.

    Returns:
        dict: Diccionario con la lista de clientes y el total de páginas.
    """
    
    session = get_session()  # Obtener los datos de la sesión actual
    idsucursal = session.get("id_sucursal")
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Cálculo del offset para la paginación
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM vw_clientes_admin WHERE id_sucursal = %s LIMIT %s OFFSET %s", (idsucursal, limit, offset))
    clientes = cursor.fetchall()

    # Formatear la fecha de expiración de la membresía
    for cliente in clientes:
        cliente['fecha_expiracion_membresia'] = format_date(cliente['fecha_expiracion_membresia'])

    # Obtener el número total de clientes
    cursor.execute("SELECT COUNT(*) AS total FROM vw_clientes_admin WHERE id_sucursal = %s", (idsucursal,))
    total_clients = cursor.fetchone()["total"]

    # Cierre de la conexión
    cursor.close()
    connection.close()

    # Cálculo del total de páginas
    total_pages = (total_clients + limit - 1) // limit

    return {"clientes": clientes, "total_pages": total_pages}

# =======================================================================================================================

def get_client_by_id(client_id):
    """
    Obtiene la información de un cliente específico por su ID.

    Args:
        client_id (int): ID del cliente.

    Returns:
        dict: Información del cliente.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM clientes WHERE id_cliente = %s", (client_id,))
    cliente = cursor.fetchone()
    
    # Formatear la fecha de expiración de la membresía
    if cliente and cliente.get('fecha_expiracion_membresia'):
        cliente['fecha_expiracion_membresia'] = format_date(cliente['fecha_expiracion_membresia'])

    cursor.close()
    connection.close()

    return cliente

# =======================================================================================================================

def add_client(id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal, fecha_expiracion_membresia):
    """
    Agrega un nuevo cliente si no existe previamente un registro con el mismo correo, ID o teléfono.

    Args:
        id_cliente (int): ID del cliente.
        nombre_cliente (str): Nombre del cliente.
        apellido_pt (str): Primer apellido.
        apellido_mt (str): Segundo apellido.
        correo (str): Correo electrónico.
        telefono (str): Teléfono de contacto.
        id_sucursal (int): ID de la sucursal.
        fecha_expiracion_membresia (datetime): Fecha en que expira la membresia.

    Returns:
        dict: Estado de la operación y mensaje.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Verificación de duplicados
    checks = [
        ("SELECT id_cliente FROM clientes WHERE id_cliente = %s", id_cliente, "El ID de membresía ya está registrado."),
        ("SELECT id_cliente FROM clientes WHERE correo = %s", correo, "El correo ya está registrado."),
        ("SELECT id_cliente FROM clientes WHERE telefono = %s", telefono, "El teléfono ya está registrado.")
    ]

    for query, param, error_message in checks:
        cursor.execute(query, (param,))
        if cursor.fetchone():
            cursor.close()
            connection.close()
            return {"status": "error", "message": error_message}

    # Inserción del nuevo cliente
    cursor.execute(
        """
        INSERT INTO clientes (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal, fecha_expiracion_membresia)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal, fecha_expiracion_membresia)
    )
    connection.commit()

    cursor.close()
    connection.close()

    return {"status": "success", "message": "Cliente agregado correctamente."}

# =======================================================================================================================

def update_client(id_cliente, nuevo_id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, nuevo_correo, telefono, nuevo_telefono, id_sucursal, fecha_expiracion_membresia):
    """
    Actualiza la información de un cliente existente.

    Args:
        id_cliente (int): ID actual del cliente.
        nuevo_id_cliente (int): Nuevo ID del cliente (opcional).
        nombre_cliente (str): Nombre del cliente.
        apellido_pt (str): Primer apellido.
        apellido_mt (str): Segundo apellido.
        correo (str): Correo actual.
        nuevo_correo (str): Nuevo correo (opcional).
        telefono (str): Teléfono actual.
        nuevo_telefono (str): Nuevo teléfono (opcional).
        id_sucursal (int): ID de la sucursal.
        fecha_expiracion_membresia (datetime): Fecha en que expira la membresia.

    Returns:
        dict: Estado de la operación y mensaje.
    """
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Validaciones para nuevos datos
            validations = [
                (nuevo_id_cliente, existing_idClient, "El ID de la membresía ya está registrado."),
                (nuevo_correo, existing_mail, "El correo ya está registrado."),
                (nuevo_telefono, existing_phone, "El teléfono ya está registrado.")
            ]

            for value, check_func, error_message in validations:
                if value and check_func(cursor, value):
                    return {"status": "error", "message": error_message}

            # Actualización de datos
            query = """
                UPDATE clientes SET nombre_cliente = %s, apellido_pt = %s, apellido_mt = %s, correo = %s, telefono = %s, id_sucursal = %s, fecha_expiracion_membresia = %s
            """

            params = [nombre_cliente, apellido_pt, apellido_mt, nuevo_correo or correo, nuevo_telefono or telefono, id_sucursal, fecha_expiracion_membresia]

            if nuevo_id_cliente:
                query += ", id_cliente = %s"
                params.append(nuevo_id_cliente)

            query += " WHERE id_cliente = %s"
            params.append(id_cliente)

            cursor.execute(query, tuple(params))
            connection.commit()

        return {"status": "success", "message": "Cliente actualizado correctamente."}

    except Exception as e:
        connection.rollback()
        return {"status": "error", "message": f"Ocurrió un error: {str(e)}"}

    finally:
        connection.close()

# =======================================================================================================================

def delete_client(id_cliente):
    """
    Elimina un cliente utilizando un Stored Procedure para mantener la integridad referencial.

    Args:
        id_cliente (int): ID del cliente a eliminar.
    """
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.callproc("SP_Eliminar_Cliente_Cascada", [id_cliente])
    connection.commit()

    cursor.close()
    connection.close()


# ==============================
# FUNCIONES PARA VALIDACIONES
# ==============================

def existing_mail(cursor, nuevo_correo):
    """Verifica si el correo ya existe en la base de datos."""
    cursor.execute("SELECT id_cliente FROM clientes WHERE correo = %s", (nuevo_correo,))
    return bool(cursor.fetchone())


def existing_idClient(cursor, nuevo_id_cliente):
    """Verifica si el ID de cliente ya existe en la base de datos."""
    cursor.execute("SELECT id_cliente FROM clientes WHERE id_cliente = %s", (nuevo_id_cliente,))
    return bool(cursor.fetchone())


def existing_phone(cursor, nuevo_telefono):
    """Verifica si el teléfono ya existe en la base de datos."""
    cursor.execute("SELECT id_cliente FROM clientes WHERE telefono = %s", (nuevo_telefono,))
    return bool(cursor.fetchone())


# ========================================
# FUNCIONES PARA CLIENTES HISTÓRICOS
# ========================================

def restore_client(id_cliente):
    """
    Restaura un cliente eliminado utilizando un Stored Procedure.

    Args:
        id_cliente (int): ID del cliente a restaurar.
    """
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.callproc("SP_Restaurar_Cliente_Cascada", [id_cliente])
    connection.commit()

    cursor.close()
    connection.close()

# =======================================================================================================================

def get_client_hts(page=1, limit=6):
    """
    Obtiene la lista de clientes históricos (eliminados) con paginación.

    Args:
        page (int): Número de página.
        limit (int): Registros por página.

    Returns:
        dict: Diccionario con la lista de clientes eliminados y el total de páginas.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM vw_clientes_historicos_admin LIMIT %s OFFSET %s", (limit, offset))
    clientes_eliminados = cursor.fetchall()

    for cliente in clientes_eliminados:
        cliente['fecha_borrado'] = format_datetime(cliente['fecha_borrado'])

    cursor.execute("SELECT COUNT(*) AS total FROM vw_clientes_historicos_admin")
    total_clients = cursor.fetchone()["total"]

    cursor.close()
    connection.close()

    total_pages = (total_clients + limit - 1) // limit

    return {"clientes": clientes_eliminados, "total_pages": total_pages}

# =======================================================================================================================

def get_client_by_id_hts(client_id):
    """
    Obtiene la información de un cliente eliminado por su ID.

    Args:
        client_id (int): ID del cliente eliminado.

    Returns:
        dict: Información del cliente eliminado.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM clientes_eliminados WHERE id_cliente = %s", (client_id,))
    cliente = cursor.fetchone()

    cursor.close()
    connection.close()

    return cliente

# =======================================================================================================================

def format_datetime(datetime_obj):
    """
    Formatea un objeto datetime en un string legible.

    Args:
        datetime_obj (datetime): Objeto datetime.

    Returns:
        str: Fecha y hora en formato 'YYYY-MM-DD HH:MM:SS'.
    """
    return datetime_obj.strftime('%Y-%m-%d %H:%M:%S') if datetime_obj else None


def format_date(date_obj):
    """
    Formatea un objeto date en un string legible.

    Args:
        datetime_obj (date): Objeto datetime.

    Returns:
        str: Fecha en formato 'YYYY-MM-DD'.
    """
    return date_obj.strftime('%Y-%m-%d') if date_obj else None