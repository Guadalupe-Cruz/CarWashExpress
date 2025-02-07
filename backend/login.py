from backend.database import get_db_connection

# ==============================
# FUNCIONES PARA EL LOGIN
# ==============================

def verify_login(correo, contrasena):
    """
    Verifica las credenciales de inicio de sesión del usuario.

    Args:
        correo (str): Correo electrónico del usuario.
        contrasena (str): Contraseña del usuario.

    Proceso:
        1. Establece la conexión con la base de datos.
        2. Ejecuta una consulta SQL para buscar el usuario con las credenciales proporcionadas.
        3. Recupera la información del usuario si existe.
        4. Cierra el cursor y la conexión a la base de datos.

    Returns:
        dict: Un diccionario que indica si el inicio de sesión fue exitoso o si las credenciales son incorrectas.
            - Si es exitoso, devuelve el ID y el nombre del usuario.
            - Si no es exitoso, devuelve un mensaje de error.
    """
    # Establecer conexión con la base de datos
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Consulta SQL para verificar las credenciales del usuario
    query = "SELECT * FROM usuarios WHERE correo = %s AND contrasena = %s"
    cursor.execute(query, (correo, contrasena))
    usuario = cursor.fetchone()

    # Cerrar cursor y conexión
    cursor.close()
    connection.close()

    # Verificar si el usuario existe y retornar la respuesta correspondiente
    if usuario:
        return {"mensaje": "Login exitoso", "id": usuario['id_usuario'], "name": usuario['nombre_usuario']}
    else:
        return {"mensaje": "Credenciales incorrectas"}
