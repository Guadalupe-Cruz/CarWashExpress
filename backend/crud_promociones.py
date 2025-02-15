from backend.database import get_db_connection

# Función para obtener todas las promociones
def get_promociones():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_fin 
            FROM promociones
        """)
        promociones = cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener promociones: {e}")
        promociones = []
    finally:
        cursor.close()
        conn.close()
    return promociones

# Función para agregar una nueva promoción
def add_promocion(nombre, descripcion, descuento, fecha1, fecha2):
    if not all([nombre, descripcion, descuento, fecha1, fecha2]):
        raise ValueError("Todos los campos son obligatorios.")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO promociones (nombre_promociones, descripcion, descuento, fecha_inicio, fecha_fin)
            VALUES (%s, %s, %s, %s, %s)
        """, (nombre, descripcion, descuento, fecha1, fecha2))
        conn.commit()
    except Exception as e:
        print(f"Error al agregar promoción: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

# Función para actualizar una promoción
def update_promocion(id_promocion, nombre, descripcion, descuento, fecha1, fecha2):
    if not all([nombre, descripcion, descuento, fecha1, fecha2]):
        raise ValueError("Todos los campos son obligatorios.")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE promociones 
            SET nombre_promociones = %s, descripcion = %s, descuento = %s, fecha_inicio = %s, fecha_fin = %s
            WHERE id_promocion = %s
        """, (nombre, descripcion, descuento, fecha1, fecha2, id_promocion))
        conn.commit()
    except Exception as e:
        print(f"Error al actualizar promoción: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

# Función para eliminar una promoción (moverlo al histórico)
def delete_promocion(id_promocion):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    cursor.execute('SELECT id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_fin FROM promociones WHERE id_promocion = %s', (id_promocion,))
    promocion = cursor.fetchone()

    if promocion:
        cursor.execute('INSERT INTO promociones_historicos (id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_fin, fecha_borrado) VALUES (%s, %s, %s, %s, %s, %s, NOW())', 
                       (promocion[0], promocion[1], promocion[2], promocion[3], promocion[4], promocion[5]))
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

# Función para recuperar una promoción del histórico
def recuperar_promocion(id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_fin):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    cursor.execute('INSERT INTO promociones (id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_fin) VALUES (%s, %s, %s, %s, %s, %s)', 
                   (id_promocion, nombre_promociones, descripcion, descuento, fecha_inicio, fecha_fin))
    cursor.execute('DELETE FROM promociones_historicos WHERE id_promocion = %s', (id_promocion,))
    
    connection.commit()
    connection.close()
