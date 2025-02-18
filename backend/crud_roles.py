from backend.database import get_db_connection

# Función para obtener todos los roles
def get_roles():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM roles")
    roles = cursor.fetchall()
    connection.close()
    return roles

# Función para agregar una nueva rol
def add_rol(nombre):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO roles (nombre_rol) VALUES (%s)", (nombre,))
    connection.commit()
    connection.close()

# Función para actualizar un rol
def update_rol(id_rol, nombre):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE roles SET nombre_rol=%s WHERE id_rol=%s",
                   (nombre, id_rol))
    connection.commit()
    connection.close()

# Función para eliminar un rol (marcarla como eliminada sin borrar los usuarios)
def delete_rol(id_rol):
    connection = get_db_connection()
    
    if connection:
        try:
            cursor = connection.cursor()

            # Actualizar los usuarios del rol para poner id_rol a NULL (sin eliminar los usuarios)
            cursor.execute('''
                UPDATE usuarios
                SET id_rol = NULL
                WHERE id_rol = %s
            ''', (id_rol,))

            # Recuperar los datos de rol antes de eliminarla
            cursor.execute('SELECT id_rol, nombre_rol FROM roles WHERE id_rol = %s', (id_rol,))
            rol = cursor.fetchone()

            if rol:
                # Mover el rol al histórico (sin eliminar los datos de rol)
                cursor.execute(''' 
                    INSERT INTO roles_historicos (id_rol, nombre_rol, fecha_borrado)
                    VALUES (%s, %s, NOW())
                ''', (rol[0], rol[1]))

                # Eliminar solo rol de la tabla principal (sin eliminar datos de usuarios, usuarios ni promociones)
                cursor.execute('DELETE FROM roles WHERE id_rol = %s', (id_rol,))

            # Confirmar cambios en la base de datos
            connection.commit()
            print("Rol eliminada correctamente, y la tabla usuarios actualizada.")

        finally:
            cursor.close()
            connection.close()

# Función para obtener los roles del histórico
def get_historico_roles():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM roles_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para recuperar un rol del histórico junto con sus usuarios
def recuperar_rol(id_rol, nombre_rol):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        # Insertamos el rol de nuevo en la tabla 'roles'
        cursor.execute('INSERT INTO roles (id_rol, nombre_rol) VALUES (%s, %s)', 
                       (id_rol, nombre_rol))
        
        # Recuperamos los usuarios asociados al rol desde el histórico
        cursor.execute('SELECT id_usuario, nombre_usuario, apellido_pt, apellido_mt, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal FROM usuarios_historicos WHERE id_rol = %s', (id_rol,))
        usuarios = cursor.fetchall()
        
        # Insertamos los usuarios de nuevo en la tabla 'usuarios'
        for usuario in usuarios:
            cursor.execute('INSERT INTO usuarios (id_usuario, nombre_usuario, apellido_pt, apellido_mt, correo, contrasena, telefono, direccion, puesto, tipo_rol, id_sucursal) VALUES (%s, %s, %s, %s, %s, %s, %s)', 
                           (usuario[0], usuario[1], usuario[2], usuario[3], usuario[4], usuario[5], usuario[6], usuario[7], usuario[8], usuario[9], usuario[10], id_rol))
        
        # Eliminamos los usuarios del histórico
        cursor.execute('DELETE FROM usuarios_historicos WHERE id_rol = %s', (id_rol,))
        
        # Eliminamos el rol de la tabla 'historico_rol'
        cursor.execute('DELETE FROM roles_historicos WHERE id_rol = %s', (id_rol,))
        
        connection.commit()
    except Exception as e:
        print(f"Error al recuperar el rol y sus usuarios: {e}")
        connection.rollback()
    finally:
        connection.close()