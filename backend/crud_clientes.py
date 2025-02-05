from backend.database import get_db_connection

# Función para obtener todos los clientes
# Función para obtener todos los clientes
def get_clientes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT c.id_cliente, 
                   c.nombre_cliente, 
                   c.apellido_pt, 
                   c.apellido_mt, 
                   c.correo, 
                   c.telefono, 
                   IFNULL(s.nombre_sucursal, 'Sucursal eliminada') AS nombre_sucursal
            FROM clientes c
            LEFT JOIN sucursales s ON c.id_sucursal = s.id_sucursal
        """)
        clientes = cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener clientes: {e}")
        clientes = []
    finally:
        cursor.close()
        conn.close()
    return clientes


# Función para agregar un nuevo cliente
def add_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono, id_sucursal):
    if not all([id_cliente, nombre, apellido1, apellido2, telefono, id_sucursal]):
        raise ValueError("Todos los campos son obligatorios, excepto el correo.")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO clientes (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (id_cliente, nombre, apellido1, apellido2, correo, telefono, id_sucursal))
        conn.commit()
    except Exception as e:
        print(f"Error al agregar cliente: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

# Función para actualizar un cliente
def update_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono, id_sucursal):
    if not all([id_cliente, nombre, apellido1, apellido2, telefono, id_sucursal]):
        raise ValueError("Todos los campos son obligatorios.")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE clientes 
            SET nombre_cliente = %s, apellido_pt = %s, apellido_mt = %s, correo = %s, telefono = %s, id_sucursal = %s
            WHERE id_cliente = %s
        """, (nombre, apellido1, apellido2, correo, telefono, id_sucursal, id_cliente))
        conn.commit()
    except Exception as e:
        print(f"Error al actualizar cliente: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

# Función para eliminar un cliente (moverlo al histórico) y los pagos relacionados
def delete_cliente(id_cliente):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos el cliente antes de moverla al histórico
    cursor.execute('SELECT id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal FROM clientes WHERE id_cliente = %s', (id_cliente,))
    cliente = cursor.fetchone()

    if cliente:
        # Mover los pagos relacionados a pagos_historicos
        cursor.execute("""
            INSERT INTO pagos_historicos (id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado)
            SELECT id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado
            FROM pagos
            WHERE id_cliente = %s
        """, (id_cliente,))

        # Eliminar los pagos de la tabla 'pagos'
        cursor.execute('DELETE FROM pagos WHERE id_cliente = %s', (id_cliente,))
        
        # Insertamos el cliente en el histórico
        cursor.execute('INSERT INTO clientes_historicos (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal, fecha_borrado) VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())', 
                       (cliente[0], cliente[1], cliente[2], cliente[3], cliente[4], cliente[5], cliente[6]))
        
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

# Función para recuperar un cliente del histórico y restaurar los pagos
def recuperar_cliente(id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Insertamos el cliente de nuevo en la tabla 'clientes'
    cursor.execute('INSERT INTO clientes (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal) VALUES (%s, %s, %s, %s, %s, %s, %s)', 
                   (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal))
    
    # Recuperamos los pagos del histórico
    cursor.execute("""
        INSERT INTO pagos (id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado)
        SELECT id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado
        FROM pagos_historicos
        WHERE id_cliente = %s
    """, (id_cliente,))
    
    # Elimina el cliente de la tabla 'clientes_historicos'
    cursor.execute('DELETE FROM clientes_historicos WHERE id_cliente = %s', (id_cliente,))
    
    connection.commit()
    connection.close()

# Función para obtener todas las sucursales
def get_sucursales():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id_sucursal, nombre_sucursal FROM sucursales")
        sucursales = cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener sucursales: {e}")
        sucursales = []
    finally:
        cursor.close()
        conn.close()
    return sucursales