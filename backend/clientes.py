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
        database='db_autolavado'    # Cambia esto por tu base de datos
    )

# ==============================
# FUNCIONES CRUD PARA CLIENTES
# ==============================

def get_clients(page=1, limit=6):
    """Obtiene los clientes con paginación."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    offset = (page - 1) * limit
    cursor.execute("SELECT * FROM vista_clientes LIMIT %s OFFSET %s", (limit, offset))
    clientes = cursor.fetchall()
    
    cursor.execute("SELECT COUNT(*) AS total FROM vista_clientes")
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


def add_client(id_cliente, nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal):
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
        return {"status": "errorID", "message": "El id de membresia ya está registrado."}
    
    # Insertar el nuevo cliente si el correo no está registrado
    query = """
        INSERT INTO clientes (id_cliente, nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    
    cursor.execute(query, (id_cliente, nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal))
    connection.commit()
    
    cursor.close()
    connection.close()
    
    return {"status": "success", "message": "Cliente agregado correctamente."}



def update_client(id_cliente, nuevo_id_cliente, nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal):
    """Actualiza la información de un cliente."""
    connection = get_db_connection()
    cursor = connection.cursor()
    
    if not nuevo_id_cliente or nuevo_id_cliente == id_cliente:
        query = """
            UPDATE clientes SET nombre = %s, apellido_pt = %s, apellido_mt = %s, 
            correo = %s, telefono = %s, id_sucursal = %s WHERE id_cliente = %s
        """
        cursor.execute(query, (nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal, id_cliente))
    else:
        query = """
            UPDATE clientes SET id_cliente = %s, nombre = %s, apellido_pt = %s, apellido_mt = %s, 
            correo = %s, telefono = %s, id_sucursal = %s WHERE id_cliente = %s
        """
        cursor.execute(query, (nuevo_id_cliente, nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal, id_cliente))
    
    connection.commit()
    cursor.close()
    connection.close()


def delete_client(id_cliente):
    """Elimina un cliente utilizando un Stored Procedure para mantener integridad referencial."""
    connection = get_db_connection()
    cursor = connection.cursor()
    
    cursor.callproc("SP_Eliminar_Cliente_Cascada", [id_cliente])
    connection.commit()
    
    cursor.close()
    connection.close()
