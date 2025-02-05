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
        database='db_carwashexpress'    # Cambia esto por tu base de datos
    )

# ==============================
# FUNCIONES CRUD PARA CLIENTES
# ==============================

def get_clients(page=1, limit=6):
    """Obtiene los clientes con paginación."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM VW_Clientes LIMIT %s OFFSET %s", (limit, offset))
    clientes = cursor.fetchall()
    
    cursor.execute("SELECT COUNT(*) AS total FROM VW_Clientes")
    total_clients = cursor.fetchone()["total"]
    
    cursor.close()
    connection.close()
    
    total_pages = (total_clients + limit - 1) // limit  # Cálculo de páginas
    
    return {"clientes": clientes, "total_pages": total_pages}


def get_client_by_id(client_id):
    """Obtiene un cliente por su ID."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM clientes WHERE id_cliente = %s", (client_id,))
    cliente = cursor.fetchone()
    
    cursor.close()
    connection.close()
    
    return cliente


def add_client(id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal):
    """Agrega un nuevo cliente si el correo no está registrado."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("SELECT id_cliente FROM clientes WHERE correo = %s", (correo,)) # Verificar si el correo ya existe
    existing_client = cursor.fetchone()
    
    cursor.execute("SELECT id_cliente FROM clientes WHERE id_cliente = %s", (id_cliente,)) # Verificar si el id_cliente ya existe
    existing_idclient = cursor.fetchone()
    
    if existing_client:
        cursor.close()
        connection.close()
        return {"status": "error", "message": "El correo ya está registrado."}
    
    if existing_idclient:
        cursor.close()
        connection.close()
        return {"status": "error", "message": "El id de membresia ya está registrado."}
    
    # Insertar el nuevo cliente si el correo no está registrado
    query = """
        INSERT INTO clientes (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    
    cursor.execute(query, (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal))
    connection.commit()
    
    cursor.close()
    connection.close()
    
    return {"status": "success", "message": "Cliente agregado correctamente."}



def update_client(id_cliente, nuevo_id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, nuevo_correo, telefono, id_sucursal):
    """Actualiza la información de un cliente."""
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            # Verificar si el nuevo id_cliente ya está registrado
            if nuevo_id_cliente and existing_idClient(cursor, nuevo_id_cliente):
                return {"status": "error", "message": "El id de la membresia ya está registrado."}

            # Verificar si el nuevo correo ya está registrado
            if nuevo_correo and existing_mail(cursor, nuevo_correo):
                return {"status": "error", "message": "El correo ya está registrado."}

            # Crear el query de actualización
            query = """
                UPDATE clientes SET nombre_cliente = %s, apellido_pt = %s, apellido_mt = %s, 
                correo = %s, telefono = %s, id_sucursal = %s WHERE id_cliente = %s
            """
            # Preparar los parámetros
            params = (nombre_cliente, apellido_pt, apellido_mt, correo if not nuevo_correo else nuevo_correo, telefono, id_sucursal, id_cliente)
            
            # Si se proporciona un nuevo id_cliente, actualizarlo
            if nuevo_id_cliente:
                query = query.replace("id_cliente = %s", "id_cliente = %s, id_cliente = %s")
                params = (nuevo_id_cliente, nombre_cliente, apellido_pt, apellido_mt, nuevo_correo or correo, telefono, id_sucursal, id_cliente)
                
            # Ejecutar la consulta
            cursor.execute(query, params)

            # Confirmar cambios
            connection.commit()

        return {"status": "success", "message": "Cliente actualizado correctamente."}

    except Exception as e:
        connection.rollback()
        return {"status": "error", "message": f"Ocurrió un error: {str(e)}"}

    finally:
        connection.close()

def delete_client(id_cliente):
    """Elimina un cliente utilizando un Stored Procedure para mantener integridad referencial."""
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
    existing_mail_client = cursor.fetchone()
    
    if existing_mail_client:
        return True  # El correo ya existe
    return False  # El correo no existe

def existing_idClient(cursor, nuevo_id_cliente):
    """Verifica si el id_cliente ya existe en la base de datos."""
    cursor.execute("SELECT id_cliente FROM clientes WHERE id_cliente = %s", (nuevo_id_cliente,))
    existing_id_client = cursor.fetchone()
    
    if existing_id_client:
        return True  # El id_cliente ya existe
    return False  # El id_cliente no existe


# ========================================
# FUNCIONES PARA CLIENTES_HISTORICOS
# ========================================

def restore_client(id_cliente):
    """Recupera un cliente utilizando un Stored Procedure para mantener integridad referencial."""
    connection = get_db_connection()
    cursor = connection.cursor()
    
    cursor.callproc("SP_Restaurar_Cliente_Cascada", [id_cliente])
    connection.commit()
    
    cursor.close()
    connection.close()
    
def get_client_hts(page=1, limit=6):
    """Obtiene los historicos de los clientes con paginación."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM VW_Clientes_Eliminados LIMIT %s OFFSET %s", (limit, offset))
    clientes_eliminados = cursor.fetchall()
    
    for clientes in clientes_eliminados:
        clientes['fecha_borrado'] = format_datetime(clientes['fecha_borrado'])
    
    cursor.execute("SELECT COUNT(*) AS total FROM VW_Clientes_Eliminados")
    total_clients = cursor.fetchone()["total"]
    
    cursor.close()
    connection.close()
    
    total_pages = (total_clients + limit - 1) // limit  # Cálculo de páginas
    
    return {"clientes": clientes_eliminados, "total_pages": total_pages}

def get_client_by_id_hts(client_id):
    """Obtiene un cliente por su ID."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM clientes_eliminados WHERE id_cliente = %s", (client_id,))
    cliente = cursor.fetchone()
    
    cursor.close()
    connection.close()
    
    return cliente

def format_datetime(datetime_obj):
    """Formato de fecha y hora en formato legible."""
    return datetime_obj.strftime('%Y-%m-%d %H:%M:%S') if datetime_obj else None