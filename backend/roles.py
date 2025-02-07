from backend.database import get_db_connection

# Función para recuperar un rol del histórico y agregarla nuevamente a la tabla roles
def recuperar_rol(id_rol, nombre_rol):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Inserta el rol de nuevo en la tabla 'roles'
    cursor.execute('INSERT INTO roles (id_rol, nombre_rol) VALUES (%s, %s)', 
                   (id_rol, nombre_rol))
    
    # Elimina el rol de la tabla 'roles_historicos'
    cursor.execute('DELETE FROM roles_historicos WHERE id_rol = %s', (id_rol,))
    
    connection.commit()
    connection.close()

# Función para obtener los roles del histórico
def get_historico_roles():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT id_rol, nombre_rol, fecha_borrado FROM roles_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para eliminar un rol (mueve el rol al histórico)
def delete_rol(id_rol):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos el rol antes de eliminarla
    cursor.execute('SELECT id_rol, nombre_rol FROM roles WHERE id_rol = %s', (id_rol,))
    rol = cursor.fetchone()

    if rol:
        # Insertamos el rol en el histórico
        cursor.execute('INSERT INTO roles_historicos (id_rol, nombre_rol, fecha_borrado) VALUES (%s, %s, NOW())', 
                       (rol[0], rol[1]))
        
        # Elimina el rol de la tabla 'rol'
        cursor.execute('DELETE FROM roles WHERE id_rol = %s', (id_rol,))

    connection.commit()
    connection.close()