from backend.database import get_db_connection

# Función para recuperar el cliente y agregarla nuevamente a la tabla de clientes
def recuperar_cliente(id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, fecha_expiracion_membresia, id_sucursal):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Inserta el cliente de nuevo en la tabla 'clientes'
    cursor.execute('INSERT INTO clientes (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, fecha_expiracion_membresia, id_sucursal) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)', 
                   (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, fecha_expiracion_membresia, id_sucursal))
    
    # Elimina el cliente de la tabla 'clientes_historicos'
    cursor.execute('DELETE FROM clientes_historicos WHERE id_cliente = %s', (id_cliente,))
    
    connection.commit()
    connection.close()

# Función para obtener los clientes del histórico
def get_historico_clientes():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, fecha_expiracion_membresia, id_sucursal, fecha_borrado FROM clientes_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para eliminar un cliente (mueve el cliente al histórico)
def delete_cliente(id_cliente):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos el cliente antes de eliminarla
    cursor.execute('SELECT id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, fecha_expiracion_membresia, id_sucursal FROM clientes WHERE id_cliente = %s', (id_cliente,))
    cliente = cursor.fetchone()

    if cliente:
        # Insertamos el cliente en el histórico
        cursor.execute('INSERT INTO clientes_historicos  (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, fecha_expiracion_membresia, id_sucursal, fecha_borrado) VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())', 
                       (cliente[0], cliente[1], cliente[2], cliente[3], cliente[4], cliente[5], cliente[6], cliente[7]))
        
        # Elimina el cliente de la tabla 'clientes'
        cursor.execute('DELETE FROM clientes WHERE id_cliente = %s', (id_cliente,))

    connection.commit()
    connection.close()