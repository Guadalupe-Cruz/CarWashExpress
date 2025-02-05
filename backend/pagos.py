from backend.database import get_db_connection

# Función para recuperar el pago y agregarlo nuevamente a la tabla de pagos
def recuperar_pago(id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Inserta el pago de nuevo en la tabla 'pagos'
    cursor.execute('INSERT INTO pagos (id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado) VALUES (%s, %s, %s, %s, %s, %s)', 
                   (id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado))
    
    # Elimina el pago de la tabla 'pagos_historicos'
    cursor.execute('DELETE FROM pagos_historicos WHERE id_pago = %s', (id_pago,))
    
    connection.commit()
    connection.close()

# Función para obtener los pagos del histórico
def get_historico_pagos():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)  # Permite obtener los resultados como diccionarios
    cursor.execute('SELECT id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado, fecha_borrado FROM pagos_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico  # Retorna la lista completa de pagos históricos

# Función para eliminar un pago (mueve el pago al histórico)
def delete_pago(id_pago):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos el pago antes de eliminarlo
    cursor.execute('SELECT id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado FROM pagos WHERE id_pago = %s', (id_pago,))
    pago = cursor.fetchone()

    if pago:
        # Insertamos el pago en el histórico
        cursor.execute('INSERT INTO pagos_historicos (id_pago, monto_pagado, metodo_pago, fecha_pago, id_cliente, id_lavado, fecha_borrado) VALUES (%s, %s, %s, %s, %s, %s, NOW())', 
                       (pago[0], pago[1], pago[2], pago[3], pago[4], pago[5]))
        
        # Eliminamos el pago de la tabla 'pagos'
        cursor.execute('DELETE FROM pagos WHERE id_pago = %s', (id_pago,))

    connection.commit()
    connection.close()
