import eel
import mysql.connector

# Función para obtener la conexión a la base de datos
def get_db_connection():
    connection = mysql.connector.connect(
        host='localhost',           # Cambia esto por tu host
        user='root',          # Cambia esto por tu usuario
        password='',   # Cambia esto por tu contraseña
        database='db_autolavado' # Cambia esto por tu base de datos
    )
    return connection

# Función para obtener los registros de la vista de clientes con paginación
def get_clients(page=1, limit=6):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    offset = (page - 1) * limit  # Calcular el desplazamiento
    query = "SELECT * FROM vista_clientes LIMIT %s OFFSET %s"
    
    cursor.execute(query, (limit, offset))
    clientes = cursor.fetchall()

    # Obtener el total de clientes para calcular el número total de páginas
    cursor.execute("SELECT COUNT(*) AS total FROM vista_clientes")
    total_clients = cursor.fetchone()["total"]
    
    cursor.close()
    connection.close()

    total_pages = (total_clients + limit - 1) // limit  # Calcular número total de páginas

    return {"clientes": clientes, "total_pages": total_pages}

    
# Funcio para buscar cliente por id
def get_client_by_id(clientId):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    # Asegurarse de que clientId es un número
    clientId = int(clientId)
    cursor.execute("SELECT * FROM clientes WHERE id_cliente = %s", (clientId,))
    cliente = cursor.fetchone()  # Fetchone para obtener un solo cliente
    cursor.close()
    connection.close()
    return cliente

# Funcion para agregar nuevo cliente
def add_client(id_cliente, nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal):
    connection = get_db_connection()
    cursor = connection.cursor()
    query = "INSERT INTO clientes (id_cliente, nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    # Ejecutamos la consulta
    cursor.execute(query, (id_cliente, nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal))
    connection.commit()  # Confirmamos los cambios en la base de datos
    cursor.close()
    connection.close()

# Función para actualizar un cliente existente
def update_client(id_cliente, nuevo_id_cliente, nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal):
    connection = get_db_connection()
    cursor = connection.cursor()

    # Si el nuevo_id_cliente está vacío o igual al id_cliente, no actualizamos el id_cliente
    if nuevo_id_cliente == "" or nuevo_id_cliente == id_cliente:
        query = """
            UPDATE clientes 
            SET nombre = %s, apellido_pt = %s, apellido_mt = %s, correo = %s, telefono = %s, id_sucursal = %s 
            WHERE id_cliente = %s
        """
        # Ejecutar la consulta sin modificar el id_cliente
        cursor.execute(query, (nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal, id_cliente))
    else:
        # Si se proporciona un nuevo id_cliente, actualizarlo también
        query = """
            UPDATE clientes 
            SET id_cliente = %s, nombre = %s, apellido_pt = %s, apellido_mt = %s, correo = %s, telefono = %s, id_sucursal = %s 
            WHERE id_cliente = %s
        """
        cursor.execute(query, (nuevo_id_cliente, nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal, id_cliente))

    connection.commit()  # Confirmar los cambios en la base de datos
    cursor.close()
    connection.close()

# Funcion para eliminar un cliente
def delete_client(id_usuario):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    #cursor.execute("DELETE FROM clientes WHERE id_cliente = %s", (id_usuario,))
    
    # Llamar al Stored Procedure en vez de hacer un DELETE directo
    cursor.callproc("SP_Eliminar_Cliente_Cascada", [id_usuario])
    
    connection.commit()  # Confirmar los cambios en la base de datos
    cursor.close()
    connection.close()