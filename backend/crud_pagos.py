from backend.database import get_db_connection

# Función para obtener todos los pagos
def get_pagos():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT p.id_pago, p.monto_pago, p.metodo_pago, p.fecha_pago, 
                   c.nombre_cliente, s.nombre_lavado 
            FROM pagos p 
            JOIN clientes c ON p.id_cliente = c.id_cliente
            JOIN tipos_lavado t ON p.id_lavado = t.id_lavado
        """)
        pagos = cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener pagos: {e}")
        pagos = []
    finally:
        cursor.close()
        conn.close()
    return pagos

# Función para eliminar un pago (moverlo al histórico)
def delete_pago(id_cliente):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos el cliente antes de moverla al histórico
    cursor.execute('SELECT id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal FROM clientes WHERE id_cliente = %s', (id_cliente,))
    cliente = cursor.fetchone()

    if cliente:
        # Insertamos el cliente en el histórico
        cursor.execute('INSERT INTO clientes_historicos (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal, fecha_borrado) VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())', 
                       (cliente[0], cliente[1], cliente[2], cliente[3], cliente[4], cliente[5], cliente[6]))
        
        # Elimina el cliente de la tabla 'insumos'
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
def recuperar_cliente(id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal ):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Insertamos el cliente de nuevo en la tabla 'clientes'
    cursor.execute('INSERT INTO clientes (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal) VALUES (%s, %s, %s, %s, %s, %s, %s)', 
                   (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal))
    
    # Elimina el cliente de la tabla 'clientes_historicos'
    cursor.execute('DELETE FROM clientes_historicos WHERE id_cliente = %s', (id_cliente,))
    
    connection.commit()
    connection.close()

# Función para obtener todas las clientes
def get_clientes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id_cliente, nombre_cliente FROM clientes")
        clientes = cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener clientes: {e}")
        clientes = []
    finally:
        cursor.close()
        conn.close()
    return clientes