from backend.database import get_db_connection

# ==============================
# FUNCIONES CRUD PARA SUCURSALES
# ==============================

def get_branches():
    """
    Obtiene la lista de todas las sucursales registradas en la base de datos.

    Proceso:
        1. Establece la conexión con la base de datos.
        2. Ejecuta la consulta SQL para obtener todas las sucursales.
        3. Recupera los resultados en formato de diccionario.
        4. Cierra el cursor y la conexión a la base de datos.

    Returns:
        list: Lista de diccionarios que contiene la información de cada sucursal.
    """
    # Establecer conexión con la base de datos
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Ejecutar consulta SQL para obtener todas las sucursales
    cursor.execute("SELECT * FROM sucursales")
    sucursales = cursor.fetchall()

    # Cerrar cursor y conexión
    cursor.close()
    connection.close()

    # Retornar la lista de sucursales
    return sucursales
