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
def add_insumo(nombre, inventario, unidad, cantidad):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO insumos (nombre_insumo, inventario, unidades, cantidad_minima, fecha_suministro) VALUES (%s, %s, %s, %s, NOW())", (nombre, inventario, unidad, cantidad))
    connection.commit()
    connection.close()

# Función para actualizar un insumo
def update_insumo(id_insumo, nombre, inventario, unidad, cantidad):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE insumos SET nombre_insumo=%s, inventario=%s, unidades=%s, cantidad_minima=%s WHERE id_insumo=%s",
                   (nombre, inventario, unidad, cantidad, id_insumo))
    connection.commit()
    connection.close()

# Función para eliminar un insumo (moverlo al histórico)
def delete_insumo(id_insumo):
    connection = get_db_connection()
    cursor = connection.cursor()

    # Recuperamos el insumo antes de moverlo al histórico
    cursor.execute('SELECT id_insumo, nombre_insumo, inventario, unidades, cantidad_minima, fecha_suministro FROM insumos WHERE id_insumo = %s', (id_insumo,))
    insumo = cursor.fetchone()

    if insumo:
        # Insertamos el insumo en el histórico manteniendo la fecha_suministro original
        cursor.execute('''
            INSERT INTO insumos_historicos (id_insumo, nombre_insumo, inventario, unidades, cantidad_minima, fecha_suministro, fecha_borrado) 
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
        ''', (insumo[0], insumo[1], insumo[2], insumo[3], insumo[4], insumo[5]))

        # Eliminamos el insumo de la tabla 'insumos'
        cursor.execute('DELETE FROM insumos WHERE id_insumo = %s', (id_insumo,))

    connection.commit()
    cursor.close()
    connection.close()

# Función para obtener los insumos del histórico
def get_historico_insumos():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute('SELECT * FROM insumos_historicos')
    historico = cursor.fetchall()

    cursor.close()
    connection.close()
    return historico

# Función para recuperar un insumo del histórico
def recuperar_insumo(id_insumo, nombre_insumo, inventario, unidades, cantidad_minima):
    connection = get_db_connection()
    cursor = connection.cursor()

    # Insertamos el insumo de nuevo en la tabla 'insumos' con la fecha actual
    cursor.execute('''
        INSERT INTO insumos (id_insumo, nombre_insumo, inventario, unidades, cantidad_minima, fecha_suministro) 
        VALUES (%s, %s, %s, %s, %s, NOW())
    ''', (id_insumo, nombre_insumo, inventario, unidades, cantidad_minima))

    # Eliminamos el insumo de la tabla 'insumos_historicos'
    cursor.execute('DELETE FROM insumos_historicos WHERE id_insumo = %s', (id_insumo,))

    connection.commit()
    cursor.close()
    connection.close()

#Descontar
def descontar_insumo(id_insumo, cantidad_descontar, id_usuario):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        print(f"Intentando descontar {cantidad_descontar} del insumo {id_insumo} por el usuario {id_usuario}")

        # Obtener el inventario actual
        cursor.execute("SELECT inventario FROM insumos WHERE id_insumo = %s", (id_insumo,))
        result = cursor.fetchone()

        if not result:
            print("Error: Insumo no encontrado.")
            return {"success": False, "message": "Insumo no encontrado."}

        inventario_actual = result[0]
        print(f"Inventario actual: {inventario_actual}")

        if cantidad_descontar > inventario_actual:
            print("Error: No hay suficiente inventario.")
            return {"success": False, "message": "No hay suficiente inventario."}

        # Descontar del inventario
        nuevo_inventario = inventario_actual - cantidad_descontar
        cursor.execute("UPDATE insumos SET inventario = %s WHERE id_insumo = %s", (nuevo_inventario, id_insumo))

        # Registrar en detalle_insumo
        cursor.execute(
            """
            INSERT INTO detalle_insumo (cantidad_descontada, id_insumo, id_usuario, fecha_descuento)
            VALUES (%s, %s, %s, NOW())
            """,
            (cantidad_descontar, id_insumo, id_usuario)
        )

        connection.commit()
        print("Descuento realizado correctamente.")
        return {"success": True, "message": "Descuento realizado correctamente."}

    except Exception as e:
        connection.rollback()
        print(f"Error en el backend: {e}")
        return {"success": False, "message": str(e)}

    finally:
        cursor.close()
        connection.close()
