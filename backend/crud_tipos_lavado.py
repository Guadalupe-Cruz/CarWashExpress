from backend.database import get_db_connection

# Función para obtener todas los tipos de lavados
def get_tipos():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tipos_lavado")
    tipos = cursor.fetchall()
    connection.close()
    return tipos

# Función para agregar un nuevo tipo de lavado
def add_tipo(nombre, duracion, costo):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO tipos_lavado (nombre_lavado, duracion_minutos, costos_pesos) VALUES (%s, %s, %s)", (nombre, duracion, costo))
    connection.commit()
    connection.close()

# Función para actualizar un tipo de lavado
def update_tipo(id_lavado, nombre, duracion, costo):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE tipos_lavado SET nombre_lavado=%s, duracion_minutos=%s, costos_pesos=%s WHERE id_lavado=%s",
                   (nombre, duracion, costo, id_lavado))
    connection.commit()
    connection.close()

# Función para eliminar un tipo de lavado (moverla al histórico)
def delete_tipo(id_lavado):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos el tipo de lavado antes de moverla al histórico
    cursor.execute('SELECT id_lavado, nombre_lavado, duracion_minutos, costos_pesos FROM tipos_lavado WHERE id_lavado = %s', (id_lavado,))
    tipo = cursor.fetchone()

    if tipo:
        # Insertamos el tipo de lavado en el histórico
        cursor.execute('INSERT INTO tipos_lavado_historicos (id_lavado, nombre_lavado, duracion_minutos, costos_pesos, fecha_borrado) VALUES (%s, %s, %s, %s, NOW())', 
                       (tipo[0], tipo[1], tipo[2], tipo[3]))
        
        # Elimina el tipo de lavado de la tabla 'tipos_lavado'
        cursor.execute('DELETE FROM tipos_lavado WHERE id_lavado = %s', (id_lavado,))

    connection.commit()
    connection.close()

# Función para obtener los tipos de lavado del histórico
def get_historico_tipos():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM tipos_lavado_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para recuperar un tipo de lavado del histórico
def recuperar_tipo(id_lavado, nombre_lavado, duracion_minutos, costos_pesos):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Insertamos el tipo de lavado de nuevo en la tabla 'tipos_lavado'
    cursor.execute('INSERT INTO tipos_lavado (id_lavado, nombre_lavado, duracion_minutos, costos_pesos) VALUES (%s, %s, %s, %s)', 
                   (id_lavado, nombre_lavado, duracion_minutos, costos_pesos))
    
    # Elimina el tipo de lavado de la tabla 'tipos_lavado_historicos'
    cursor.execute('DELETE FROM tipos_lavado_historicos WHERE id_lavado = %s', (id_lavado,))
    
    connection.commit()
    connection.close()