import eel
import mysql.connector

# ==============================
# CONEXIÓN A LA BASE DE DATOS
# ==============================
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',          # Cambia esto por tu host
        user='root',               # Cambia esto por tu usuario
        password='',                # Cambia esto por tu contraseña
        database='db_carwashexpress'    # Cambia esto por tu base de datos
    )

# ==============================
# FUNCIONES PARA EL LOGIN
# ==============================

def verify_login(correo, contrasena):
    """Realiza el inicio de sesion para los usuarios."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = "SELECT * FROM usuarios WHERE correo = %s AND contrasena = %s"
    cursor.execute(query, (correo, contrasena))
    usuario = cursor.fetchone()
    
    cursor.close()
    connection.close()
    
    if usuario:
        return {"mensaje": "Login exitoso", "id": usuario['id_usuario'], "name": usuario['nombre_usuario']}
    else:
        return {"mensaje": "Credenciales incorrectas"}
