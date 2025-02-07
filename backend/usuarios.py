from backend.database import get_db_connection

# Función para recuperar el usuario y agregarla nuevamente a la tabla de usuarios
def recuperar_usuario(id_usuario, nombre_usuario, apellido_pt, apellido_mt, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Inserta el usuario de nuevo en la tabla 'usuarios'
    cursor.execute('INSERT INTO usuarios (id_usuario, nombre_usuario, apellido_pt, apellido_mt, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', 
                   (id_usuario, nombre_usuario, apellido_pt, apellido_mt, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal))
    
    # Elimina el usuario de la tabla 'usuarios_historicos'
    cursor.execute('DELETE FROM usuarios_historicos WHERE id_usuario = %s', (id_usuario,))
    
    connection.commit()
    connection.close()

# Función para obtener los usuarios del histórico
def get_historico_usuarios():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT id_usuario, nombre_usuario, apellido_pt, apellido_mt, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal, fecha_borrado FROM usuarios_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para eliminar un usuario (mueve el usuario al histórico)
def delete_usuario(id_usuario):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos el usuario antes de eliminarla
    cursor.execute('SELECT id_usuario, nombre_usuario, apellido_pt, apellido_mt, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal FROM usuarios WHERE id_usuario = %s', (id_usuario,))
    usuario = cursor.fetchone()

    if usuario:
        # Insertamos el usuario en el histórico
        cursor.execute('INSERT INTO usuarios_historicos  (id_usuario, nombre_usuario, apellido_pt, apellido_mt, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal, fecha_borrado) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())', 
                       (usuario[0], usuario[1], usuario[2], usuario[3], usuario[4], usuario[5], usuario[6], usuario[7], usuario[8], usuario[9], usuario[10]))
        
        # Elimina el usuario de la tabla 'usuarios'
        cursor.execute('DELETE FROM usuarios WHERE id_usuario = %s', (id_usuario,))

    connection.commit()
    connection.close()