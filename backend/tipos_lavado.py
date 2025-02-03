from backend.database import get_db_connection

# Función para recuperar el tipo de lavado del histórico y agregarla nuevamente a la tabla de tipos de lavado
def recuperar_tipo(id_lavado, nombre_lavado, duracion_minutos, costos_pesos):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Inserta el tipo de lavado de nuevo en la tabla 'tipos_lavado'
    cursor.execute('INSERT INTO tipos_lavado (id_lavado, nombre_lavado, duracion_minutos, costos_pesos) VALUES (%s, %s, %s, %s)', 
                   (id_lavado, nombre_lavado, duracion_minutos, costos_pesos))
    
    # Elimina el tipo de lavado de la tabla 'tipos_lavado_historicos'
    cursor.execute('DELETE FROM tipos_lavado_historicos WHERE id_lavado = %s', (id_lavado,))
    
    connection.commit()
    connection.close()

# Función para obtener los tipos de lavado del histórico
def get_historico_tipos():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT id_lavado, nombre_lavado, duracion_minutos, costos_pesos, fecha_borrado FROM tipos_lavado_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para eliminar un tipo de lavado (mueve el tipo de lavado al histórico)
def delete_tipo(id_lavado):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos el tipo de lavado antes de eliminarla
    cursor.execute('SELECT id_lavado, nombre_lavado, duracion_minutos, costos_pesos FROM tipos_lavado WHERE id_lavado = %s', (id_lavado,))
    tipo = cursor.fetchone()

    if tipo:
        # Insertamos el tipo de lavado en el histórico
        cursor.execute('INSERT INTO tipos_lavado_historicos  (id_lavado, nombre_lavado, duracion_minutos, costos_pesos, fecha_borrado) VALUES (%s, %s, %s, %s, NOW())', 
                       (tipo[0], tipo[1], tipo[2], tipo[3]))
        
        # Elimina el tipo de lavado de la tabla 'tipos_lavado'
        cursor.execute('DELETE FROM tipos_lavado WHERE id_lavado = %s', (id_lavado,))

    connection.commit()
    connection.close()