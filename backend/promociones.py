from backend.database import get_db_connection

# Función para recuperar la promocion y agregarla nuevamente a la tabla de promociones
def recuperar_promocion(id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_final):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Inserta la promocion de nuevo en la tabla 'promociones'
    cursor.execute('INSERT INTO promociones (id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_final) VALUES (%s, %s, %s, %s, %s, %s)', 
                   (id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_final))
    
    # Elimina la promocion de la tabla 'promociones_historicos'
    cursor.execute('DELETE FROM promociones_historicos WHERE id_promocion = %s', (id_promocion,))
    
    connection.commit()
    connection.close()

# Función para obtener las promociones del histórico
def get_historico_promociones():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_final, fecha_borrado FROM promociones_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para eliminar una promocion (mueve la promocion al histórico)
def delete_promocion(id_promocion):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos la promocion antes de eliminarla
    cursor.execute('SELECT id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_final FROM promociones WHERE id_promocion = %s', (id_promocion,))
    promocion = cursor.fetchone()

    if promocion:
        # Insertamos la promocion en el histórico
        cursor.execute('INSERT INTO promociones_historicos  (id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_final, fecha_borrado) VALUES (%s, %s, %s, %s, %s, %s, NOW())', 
                       (promocion[0], promocion[1], promocion[2], promocion[3], promocion[4], promocion[5]))
        
        # Elimina la promocion de la tabla 'promociones'
        cursor.execute('DELETE FROM promociones WHERE id_promocion = %s', (id_promocion,))

    connection.commit()
    connection.close()