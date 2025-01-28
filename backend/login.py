import eel
import mysql.connector

# Función para obtener la conexión a la base de datos
def get_db_connection():
    connection = mysql.connector.connect(
        host='localhost',           # Cambia esto por tu host
        user='root',          # Cambia esto por tu usuario
        password='',   # Cambia esto por tu contraseña
        database='db_autolavado' # Cambia esto por tu base de datos
    )
    return connection

# Funcion para verificar las credenciales del usuario en la base de datos.

def verify_login(correo, contrasena):
    
    # Conexión a la base de datos
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Consulta para verificar el usuario
    query = "SELECT * FROM usuarios WHERE correo = %s AND contrasena = %s"
    cursor.execute(query, (correo, contrasena))

    # Obtener el primer resultado de la consulta
    usuario = cursor.fetchone()
    
    # Cerrar cursor y conexión para liberar recursos
    cursor.close()
    connection.close()
    
    # Verificar si el usuario fue encontrado
    if usuario:
        return {"mensaje": "Login exitoso", "id": usuario['id_usuario'], "name": usuario['nombre']}
    else:
        return {"mensaje": "Credenciales incorrectas"}
