from backend.database import get_db_connection

# Función para obtener todas las sucursales
def get_sucursales():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM sucursales")
    sucursales = cursor.fetchall()
    connection.close()
    return sucursales

# Función para agregar una nueva sucursal
def add_sucursal(nombre, direccion):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO sucursales (nombre_sucursal, direccion) VALUES (%s, %s)", (nombre, direccion))
    connection.commit()
    connection.close()

# Función para actualizar una sucursal
def update_sucursal(id_sucursal, nombre, direccion):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE sucursales SET nombre_sucursal=%s, direccion=%s WHERE id_sucursal=%s",
                   (nombre, direccion, id_sucursal))
    connection.commit()
    connection.close()

# Función para eliminar una sucursal (marcarla como eliminada sin borrar los clientes)
def delete_sucursal(id_sucursal):
    connection = get_db_connection()
    
    if connection:
        try:
            cursor = connection.cursor()

            # Actualizar los clientes de la sucursal para poner id_sucursal a NULL (sin eliminar los clientes)
            cursor.execute('''
                UPDATE clientes
                SET id_sucursal = NULL
                WHERE id_sucursal = %s
            ''', (id_sucursal,))

            # Actualizar los usuarios de la sucursal para poner id_sucursal a NULL (sin eliminar los usuarios)
            cursor.execute('''
                UPDATE usuarios
                SET id_sucursal = NULL
                WHERE id_sucursal = %s
            ''', (id_sucursal,))

            # Actualizar las promociones de la sucursal para poner id_sucursal a NULL (sin eliminar las promociones)
            cursor.execute('''
                UPDATE promociones
                SET id_sucursal = NULL
                WHERE id_sucursal = %s
            ''', (id_sucursal,))

            # Recuperar los datos de la sucursal antes de eliminarla
            cursor.execute('SELECT id_sucursal, nombre_sucursal, direccion FROM sucursales WHERE id_sucursal = %s', (id_sucursal,))
            sucursal = cursor.fetchone()

            if sucursal:
                # Mover la sucursal al histórico (sin eliminar los datos de la sucursal)
                cursor.execute(''' 
                    INSERT INTO sucursales_historicos (id_sucursal, nombre_sucursal, direccion, fecha_borrado)
                    VALUES (%s, %s, %s, NOW())
                ''', (sucursal[0], sucursal[1], sucursal[2]))

                # Eliminar solo la sucursal de la tabla principal (sin eliminar datos de clientes, usuarios ni promociones)
                cursor.execute('DELETE FROM sucursales WHERE id_sucursal = %s', (id_sucursal,))

            # Confirmar cambios en la base de datos
            connection.commit()
            print("Sucursal eliminada correctamente, y las tablas clientes, usuarios y promociones actualizadas.")

        finally:
            cursor.close()
            connection.close()

# Función para obtener las sucursales del histórico
def get_historico_sucursales():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM sucursales_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para recuperar una sucursal del histórico junto con sus clientes
def recuperar_sucursal(id_sucursal, nombre_sucursal, direccion):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        # Insertamos la sucursal de nuevo en la tabla 'sucursales'
        cursor.execute('INSERT INTO sucursales (id_sucursal, nombre_sucursal, direccion) VALUES (%s, %s, %s)', 
                       (id_sucursal, nombre_sucursal, direccion))
        
        # Recuperamos los clientes asociados a la sucursal desde el histórico
        cursor.execute('SELECT id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal FROM clientes_historicos WHERE id_sucursal = %s', (id_sucursal,))
        clientes = cursor.fetchall()
        
        # Insertamos los clientes de nuevo en la tabla 'clientes'
        for cliente in clientes:
            cursor.execute('INSERT INTO clientes (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal) VALUES (%s, %s, %s, %s, %s, %s, %s)', 
                           (cliente[0], cliente[1], cliente[2], cliente[3], cliente[4], cliente[5], id_sucursal))
        
        # Eliminamos los clientes del histórico
        cursor.execute('DELETE FROM clientes_historicos WHERE id_sucursal = %s', (id_sucursal,))
        
        # Eliminamos la sucursal de la tabla 'historico_sucursal'
        cursor.execute('DELETE FROM sucursales_historicos WHERE id_sucursal = %s', (id_sucursal,))
        
        connection.commit()
    except Exception as e:
        print(f"Error al recuperar la sucursal y sus clientes: {e}")
        connection.rollback()
    finally:
        connection.close()
