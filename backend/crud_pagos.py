from backend.database import get_db_connection

# Función para obtener todos los pagos
def get_pagos():
    try:
        with get_db_connection() as conn, conn.cursor(dictionary=True) as cursor:
            cursor.execute("""
                SELECT p.id_pago, p.monto_pagado, p.metodo_pago, p.fecha_pago AS fecha_pago,
                       IFNULL(c.nombre_cliente, 'Cliente eliminado') AS nombre_cliente,
                       IFNULL(t.nombre_lavado, 'Tipo de lavado eliminado') AS nombre_lavado 
                FROM pagos p 
                LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
                LEFT JOIN tipos_lavado t ON p.id_lavado = t.id_lavado
            """)
            return cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener pagos: {e}")
        return []
    
# Función para eliminar un pago (moverlo al histórico)
def delete_pago(id_pago):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos el pago antes de moverlo al histórico
    cursor.execute('SELECT id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado FROM pagos WHERE id_pago = %s', (id_pago,))
    pago = cursor.fetchone()

    if pago:
        # Insertamos el pago en el histórico
        cursor.execute('INSERT INTO pagos_historicos (id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado, fecha_borrado) VALUES (%s, %s, %s, %s, %s, %s, NOW())', 
                       (pago[0], pago[1], pago[2], pago[3], pago[4], pago[5]))
        
        # Elimina el pago de la tabla 'pagos'
        cursor.execute('DELETE FROM pagos WHERE id_pago = %s', (id_pago,))

    connection.commit()
    connection.close()

# Función para obtener los pagos del histórico
def get_historico_pagos():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM pagos_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para recuperar un pago del histórico
def recuperar_pago(id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Insertamos el pago de nuevo en la tabla 'pagos'
    cursor.execute('INSERT INTO pagos (id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado) VALUES (%s, %s, %s, %s, %s, %s)', 
                   (id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado))
    
    # Elimina el pago de la tabla 'pagos_historicos'
    cursor.execute('DELETE FROM pagos_historicos WHERE id_pago = %s', (id_pago,))
    
    connection.commit()
    connection.close()

# Función para obtener todos los clientes
def get_clientes():
    try:
        with get_db_connection() as conn, conn.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT id_cliente, nombre_cliente FROM clientes")
            return cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener clientes: {e}")
        return []

# Función para obtener todos los tipos de lavado
def get_tipos():
    try:
        with get_db_connection() as conn, conn.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT id_lavado, nombre_lavado FROM tipos_lavado")
            return cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener tipos: {e}")
        return []
