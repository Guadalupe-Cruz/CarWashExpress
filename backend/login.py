import eel
import mysql.connector

# ==============================
# CONEXIÓN A LA BASE DE DATOS
# ==============================
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',          # Cambia esto por tu host
        user='root',               # Cambia esto por tu usuario
        password='',               # Cambia esto por tu contraseña
        database='db_carwashexpress',    # Cambia esto por tu base de datos
        charset='utf8mb4',
        collation='utf8mb4_general_ci'  # Cambié la collation a una compatible
    )

# ==============================
# FUNCIONES PARA EL LOGIN
# ==============================

def verify_login(correo, contrasena):
    """Realiza el inicio de sesión para los usuarios."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = "SELECT * FROM usuarios WHERE correo = %s AND contrasena = %s"
    cursor.execute(query, (correo, contrasena))
    usuario = cursor.fetchone()
    
    cursor.close()
    connection.close()
    
    if usuario:
        tipo_usuario = usuario['tipo_usuario']  # Asegúrate que el campo tipo_usuario exista en la tabla
        if tipo_usuario == "Administrador":
            return {"mensaje": "Login exitoso", "id": usuario['id_usuario'], "name": usuario['nombre_usuario'], "role": "admin"}
        elif tipo_usuario == "SuperUsuario":
            return {"mensaje": "Login exitoso", "id": usuario['id_usuario'], "name": usuario['nombre_usuario'], "role": "superuser"}
        else:
            return {"mensaje": "Tipo de usuario no reconocido"}
    else:
        return {"mensaje": "Credenciales incorrectas"}

# Exponer la función a Eel
eel.expose(verify_login)
