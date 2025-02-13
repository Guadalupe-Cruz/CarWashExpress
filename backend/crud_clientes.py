from backend.database import get_db_connection

# Función para obtener todos los clientes
def get_clientes():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clientes")
    clientes = cursor.fetchall()
    connection.close()
    return clientes


# Función para agregar un nuevo cliente
def add_cliente(nombre, apellido1, apellido2, correo, telefono):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO clientes (nombre_cliente, apellido_pt, apellido_mt, correo, telefono, fecha_expiracion_membresia) VALUES (%s, %s, %s, %s, %s, %s, NOW())", (nombre, apellido1, apellido2, correo, telefono))
    connection.commit()
    connection.close()

# Función para actualizar un cliente
def update_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono):
    if not all([id_cliente, nombre, apellido1, apellido2, telefono]):
        raise ValueError("Todos los campos son obligatorios.")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE clientes 
            SET nombre_cliente = %s, apellido_pt = %s, apellido_mt = %s, correo = %s, telefono = %s
            WHERE id_cliente = %s
        """, (nombre, apellido1, apellido2, correo, telefono, id_cliente))
        conn.commit()
    except Exception as e:
        print(f"Error al actualizar cliente: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def delete_cliente(id_cliente):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos el cliente antes de moverlo al histórico
    cursor.execute('SELECT id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, fecha_expiracion_membresia FROM clientes WHERE id_cliente = %s', (id_cliente,))
    cliente = cursor.fetchone()

    if cliente:
        # Insertamos el cliente en el histórico
        cursor.execute('INSERT INTO clientes_historicos (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, fecha_expiracion_membresia, fecha_borrado) VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())', 
                       (cliente[0], cliente[1], cliente[2], cliente[3], cliente[4], cliente[5]))
        
        # Eliminar el cliente de la tabla 'clientes'
        cursor.execute('DELETE FROM clientes WHERE id_cliente = %s', (id_cliente,))

    connection.commit()
    connection.close()

# Función para obtener los clientes del histórico
def get_historico_clientes():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM clientes_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para recuperar un cliente del histórico
def recuperar_cliente(id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Insertamos el cliente de nuevo en la tabla 'clientes'
    cursor.execute('INSERT INTO clientes (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, fecha_expiracion_membresia) VALUES (%s, %s, %s, %s, %s, %s, NOW())', 
                   (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono))
    
    # Elimina el cliente de la tabla 'clientes_historicos'
    cursor.execute('DELETE FROM clientes_historicos WHERE id_cliente = %s', (id_cliente,))
    
    connection.commit()
    connection.close()
    