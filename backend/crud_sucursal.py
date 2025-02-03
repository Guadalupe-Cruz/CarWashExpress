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

# Función para eliminar una sucursal (moverla al histórico)
def delete_sucursal(id_sucursal):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos la sucursal antes de moverla al histórico
    cursor.execute('SELECT id_sucursal, nombre_sucursal, direccion FROM sucursales WHERE id_sucursal = %s', (id_sucursal,))
    sucursal = cursor.fetchone()

    if sucursal:
        # Insertamos la sucursal en el histórico
        cursor.execute('INSERT INTO sucursales_historicos (id_sucursal, nombre_sucursal, direccion, fecha_borrado) VALUES (%s, %s, %s, NOW())', 
                       (sucursal[0], sucursal[1], sucursal[2]))
        
        # Elimina la sucursal de la tabla 'sucursal'
        cursor.execute('DELETE FROM sucursales WHERE id_sucursal = %s', (id_sucursal,))

    connection.commit()
    connection.close()

# Función para obtener las sucursales del histórico
def get_historico_sucursales():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM sucursales_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para recuperar una sucursal del histórico
def recuperar_sucursal(id_sucursal, nombre_sucursal, direccion):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Insertamos la sucursal de nuevo en la tabla 'sucursal'
    cursor.execute('INSERT INTO sucursales (id_sucursal, nombre_sucursal, direccion) VALUES (%s, %s, %s)', 
                   (id_sucursal, nombre_sucursal, direccion))
    
    # Elimina la sucursal de la tabla 'historico_sucursal'
    cursor.execute('DELETE FROM sucursales_historicos WHERE id_sucursal = %s', (id_sucursal,))
    
    connection.commit()
    connection.close()