from backend.database import get_db_connection

# Función para obtener todas los insumos
def get_insumos():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM insumos")
    insumos = cursor.fetchall()
    connection.close()
    return insumos

# Función para agregar un nuevo insumo
def add_insumo(nombre, inventario, fecha, cantidad):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO insumos (nombre_insumo, inventario, fecha_suministro, cantidad_minima) VALUES (%s, %s, %s, %s)", (nombre, inventario, fecha, cantidad))
    connection.commit()
    connection.close()

# Función para actualizar un insumo
def update_insumo(id_insumo, nombre, inventario, fecha, cantidad):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE insumos SET nombre_insumo=%s, inventario=%s, fecha_suministro=%s, cantidad_minima=%s WHERE id_insumo=%s",
                   (nombre, inventario, fecha, cantidad, id_insumo))
    connection.commit()
    connection.close()

# Función para eliminar un insumo (moverla al histórico)
def delete_insumo(id_insumo):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos el insumo antes de moverla al histórico
    cursor.execute('SELECT id_insumo, nombre_insumo, inventario, fecha_suministro, cantidad_minima FROM insumos WHERE id_insumo = %s', (id_insumo,))
    insumo = cursor.fetchone()

    if insumo:
        # Insertamos el insumo en el histórico
        cursor.execute('INSERT INTO insumos_historicos (id_insumo, nombre_insumo, inventario, fecha_suministro, cantidad_minima, fecha_borrado) VALUES (%s, %s, %s, %s, %s, NOW())', 
                       (insumo[0], insumo[1], insumo[2], insumo[3], insumo[4]))
        
        # Elimina el insumo de la tabla 'insumos'
        cursor.execute('DELETE FROM insumos WHERE id_insumo = %s', (id_insumo,))

    connection.commit()
    connection.close()

# Función para obtener los insumos del histórico
def get_historico_insumos():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM insumos_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para recuperar un insumo del histórico
def recuperar_insumo(id_insumo, nombre_insumo, inventario, fecha_suministro, cantidad_minima ):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Insertamos el insumo de nuevo en la tabla 'insumos'
    cursor.execute('INSERT INTO insumos (id_insumo, nombre_insumo, inventario, fecha_suministro, cantidad_minima) VALUES (%s, %s, %s, %s, %s)', 
                   (id_insumo, nombre_insumo, inventario, fecha_suministro, cantidad_minima))
    
    # Elimina el insumo de la tabla 'insumos_historicos'
    cursor.execute('DELETE FROM insumos_historicos WHERE id_insumo = %s', (id_insumo,))
    
    connection.commit()
    connection.close()