from backend.database import get_db_connection

# Función para obtener todos los usuarios
def get_usuarios():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT u.id_usuario, u.nombre_usuario, u.apellido_pt, u.apellido_mt, u.correo, u.contrasena, u.telefono, u.direccion, u.puesto, u.tipo_usuario, 
                   IFNULL(s.nombre_sucursal, 'Sucursal eliminada') AS nombre_sucursal
            FROM usuarios u
            LEFT JOIN sucursales s ON u.id_sucursal = s.id_sucursal
        """)
        usuarios = cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener usuarios: {e}")
        usuarios = []
    finally:
        cursor.close()
        conn.close()
    return usuarios


# Función para agregar un nuevo usuario
def add_usuario(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, tipo, id_sucursal):
    if not all([id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, tipo, id_sucursal]):
        raise ValueError("Todos los campos son obligatorios")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO usuarios (id_usuario, nombre_usuario, apellido_pt, apellido_mt, correo, contrasena, telefono, direccion, puesto, tipo_usuario, id_sucursal)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, tipo, id_sucursal))
        conn.commit()
    except Exception as e:
        print(f"Error al agregar usuario: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

# Función para actualizar un usuario
def update_usuario(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, tipo, id_sucursal):
    if not all([id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, tipo, id_sucursal]):
        raise ValueError("Todos los campos son obligatorios.")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE usuarios 
            SET nombre_usuario = %s, apellido_pt = %s, apellido_mt = %s, correo = %s, contrasena = %s, telefono = %s, direccion = %s, puesto = %s, tipo_usuario = %s, id_sucursal = %s
            WHERE id_usuario = %s
        """, (nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, tipo, id_sucursal, id_usuario))
        conn.commit()
    except Exception as e:
        print(f"Error al actualizar usuario: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

# Función para eliminar un usuario (moverlo al histórico)
def delete_usuario(id_usuario):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos el usuario antes de moverla al histórico
    cursor.execute('SELECT id_usuario, nombre_usuario, apellido_pt, apellido_mt, correo, contrasena, telefono, direccion, puesto, tipo_usuario, id_sucursal FROM usuarios WHERE id_usuario = %s', (id_usuario,))
    usuario = cursor.fetchone()

    if usuario:
        # Insertamos el usuario en el histórico
        cursor.execute('INSERT INTO usuarios_historicos (id_usuario, nombre_usuario, apellido_pt, apellido_mt, correo, contrasena, telefono, direccion, puesto, tipo_usuario, id_sucursal, fecha_borrado) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())', 
                       (usuario[0], usuario[1], usuario[2], usuario[3], usuario[4], usuario[5], usuario[6], usuario[7], usuario[8], usuario[9], usuario[10]))
        
        # Elimina el usuario de la tabla 'usuarios'
        cursor.execute('DELETE FROM usuarios WHERE id_usuario = %s', (id_usuario,))

    connection.commit()
    connection.close()

# Función para obtener los usuarios del histórico
def get_historico_usuarios():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM usuarios_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para recuperar un usuario del histórico
def recuperar_usuario(id_usuario, nombre_usuario, apellido_pt, apellido_mt, correo, contrasena, telefono, direccion, puesto, tipo_usuario, id_sucursal):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Insertamos el usuario de nuevo en la tabla 'usuarios'
    cursor.execute('INSERT INTO usuarios (id_usuario, nombre_usuario, apellido_pt, apellido_mt, correo, contrasena, telefono, direccion, puesto, tipo_usuario, id_sucursal) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', 
                   (id_usuario, nombre_usuario, apellido_pt, apellido_mt, correo, contrasena, telefono, direccion, puesto, tipo_usuario, id_sucursal))
    
    # Elimina el usuario de la tabla 'usuarios_historicos'
    cursor.execute('DELETE FROM usuarios_historicos WHERE id_usuario = %s', (id_usuario,))
    
    connection.commit()
    connection.close()

# Función para obtener todas las sucursales
def get_sucursales():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id_sucursal, nombre_sucursal FROM sucursales")
        sucursales = cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener sucursales: {e}")
        sucursales = []
    finally:
        cursor.close()
        conn.close()
    return sucursales