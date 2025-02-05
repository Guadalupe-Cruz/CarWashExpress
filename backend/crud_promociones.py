from backend.database import get_db_connection

# Función para obtener todas las promociones
def get_promociones():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT p.id_promocion, p.nombre_promociones, p.descripcion, p.descuento, p.fecha_inicio, p.fecha_fin, 
                   IFNULL(s.nombre_sucursal, 'Sucursal eliminada') AS nombre_sucursal
            FROM promociones p
            LEFT JOIN sucursales s ON p.id_sucursal = s.id_sucursal
        """)
        promociones = cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener promociones: {e}")
        promociones = []
    finally:
        cursor.close()
        conn.close()
    return promociones


# Función para agregar una nueva promocion
def add_promocion(nombre, descripcion, descuento, fecha1, fecha2, id_sucursal):
    if not all([nombre, descripcion, descuento, fecha1, fecha2, id_sucursal]):
        raise ValueError("Todos los campos son obligatorios, excepto el correo.")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO promociones (nombre_promociones, descripcion, descuento, fecha_inicio, fecha_fin, id_sucursal)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (nombre, descripcion, descuento, fecha1, fecha2, id_sucursal))
        conn.commit()
    except Exception as e:
        print(f"Error al agregar promocion: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

# Función para actualizar una promocion
def update_promocion(id_promocion, nombre, descripcion, descuento, fecha1, fecha2, id_sucursal):
    if not all([nombre, descripcion, descuento, fecha1, fecha2, id_sucursal]):
        raise ValueError("Todos los campos son obligatorios.")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE promociones 
            SET nombre_promociones = %s, descripcion = %s, descuento = %s, fecha_inicio = %s, fecha_fin = %s, id_sucursal = %s
            WHERE id_promocion = %s
        """, (nombre, descripcion, descuento, fecha1, fecha2, id_sucursal, id_promocion))
        conn.commit()
    except Exception as e:
        print(f"Error al actualizar promocion: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

# Función para eliminar una promocion (moverlo al histórico)
def delete_promocion(id_promocion):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos la promocion antes de moverla al histórico
    cursor.execute('SELECT id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_fin, id_sucursal FROM promociones WHERE id_promocion = %s', (id_promocion,))
    promocion = cursor.fetchone()

    if promocion:
        # Insertamos la promocion en el histórico
        cursor.execute('INSERT INTO promociones_historicos (id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_fin, id_sucursal, fecha_borrado) VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())', 
                       (promocion[0], promocion[1], promocion[2], promocion[3], promocion[4], promocion[5], promocion[6]))
        
        # Elimina la promocion de la tabla 'promociones'
        cursor.execute('DELETE FROM promociones WHERE id_promocion = %s', (id_promocion,))

    connection.commit()
    connection.close()

# Función para obtener las promociones del histórico
def get_historico_promociones():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM promociones_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para recuperar una promocion del histórico
def recuperar_promocion(id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_fin, id_sucursal ):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Insertamos la promocion de nuevo en la tabla 'promociones'
    cursor.execute('INSERT INTO promociones (id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_fin, id_sucursal) VALUES (%s, %s, %s, %s, %s, %s, %s)', 
                   (id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_fin, id_sucursal))
    
    # Elimina la promocion de la tabla 'promociones_historicos'
    cursor.execute('DELETE FROM promociones_historicos WHERE id_promocion = %s', (id_promocion,))
    
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