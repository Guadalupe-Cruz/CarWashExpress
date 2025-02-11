from backend.database import get_db_connection
from backend.sesion import set_session, clear_session

# ==============================
# FUNCIONES PARA EL LOGIN
# ==============================

def verify_login(correo, contrasena):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT id_usuario, nombre_usuario, apellido_pt, apellido_mt, id_rol, id_sucursal 
        FROM usuarios 
        WHERE correo = %s AND contrasena = %s
    """
    cursor.execute(query, (correo, contrasena))
    usuario = cursor.fetchone()

    cursor.close()
    connection.close()

    if usuario:
        # Concatenar nombre completo
        nombre_completo = f"{usuario['nombre_usuario']} {usuario['apellido_pt']} {usuario['apellido_mt']}"

        # Guardar en la sesión
        usuario['nombre_completo'] = nombre_completo
        set_session(usuario)

        return {
            "mensaje": "Login exitoso",
            "id_usuario": usuario['id_usuario'],
            "nombre_usuario": nombre_completo,
            "id_rol": usuario['id_rol'],
            "id_sucursal": usuario['id_sucursal']
        }
    else:
        return {"mensaje": "Credenciales incorrectas"}
    

def logout():
    clear_session()
    return 'login.html'