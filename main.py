import eel
from datetime import datetime
from backend.database import get_db_connection  # Importa la función de conexión
from backend.crud_insumos import descontar_insumo as descontar_insumo_backend

from backend.crud_sucursal import (
    get_sucursales, add_sucursal, update_sucursal,
    delete_sucursal, get_historico_sucursales, recuperar_sucursal
)

from backend.crud_tipos_lavado import (
    get_tipos, add_tipo, update_tipo,
    delete_tipo, get_historico_tipos, recuperar_tipo
)

from backend.crud_insumos import (
    get_insumos, add_insumo, update_insumo,
    delete_insumo, get_historico_insumos, recuperar_insumo
)

from backend.crud_clientes import (
    get_clientes, add_cliente, update_cliente,
    delete_cliente, get_historico_clientes, recuperar_cliente
)

from backend.crud_promociones import (
    get_promociones, add_promocion, update_promocion,
    delete_promocion, get_historico_promociones, recuperar_promocion
)

from backend.crud_usuarios import (
    get_usuarios, add_usuario, update_usuario,
    delete_usuario, get_historico_usuarios, recuperar_usuario
)

from backend.crud_historial_ventas import (
    get_ventas, get_report_by_day, get_report_by_week, get_report_by_month, generate_pdf
)

from backend.crud_roles import (
    get_roles, add_rol, update_rol,
    delete_rol, get_historico_roles, recuperar_rol
)

from backend.crud_detalle_insumo import (
    get_detalles
)

eel.init("web")

# ==================== LOGIN ====================

@eel.expose
def login_usuario(correo, contrasena):
    conn = get_db_connection()
    if not conn:
        return {'success': False, 'message': 'Error de conexión a la base de datos'}
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT id_usuario, nombre_usuario
        FROM usuarios
        WHERE correo = %s AND contrasena = %s
        """
        cursor.execute(query, (correo, contrasena))
        user = cursor.fetchone()
        
        if user:
            return {'success': True, 'user': user}
        else:
            return {'success': False, 'message': 'Correo o contraseña incorrectos'}
    except Exception as e:
        return {'success': False, 'message': str(e)}
    finally:
        cursor.close()
        conn.close()

# Funciones para sucursales
@eel.expose
def obtener_sucursales():
    return get_sucursales()

@eel.expose
def agregar_sucursal(nombre, direccion):
    add_sucursal(nombre, direccion)

@eel.expose
def actualizar_sucursal(id_sucursal, nombre, direccion):
    update_sucursal(id_sucursal, nombre, direccion)

@eel.expose
def eliminar_sucursal(id_sucursal):
    delete_sucursal(id_sucursal)

@eel.expose
def obtener_historico():
    return get_historico_sucursales()

@eel.expose
def recuperar_sucursal_exposed(id_sucursal, nombre, direccion):
    recuperar_sucursal(id_sucursal, nombre, direccion)

# Funciones para tipos de lavado
@eel.expose
def obtener_tipos():
    return get_tipos()

@eel.expose
def agregar_tipo(nombre, duracion, costo):
    add_tipo(nombre, duracion, costo)

@eel.expose
def actualizar_tipo(id_lavado, nombre, duracion, costo):
    update_tipo(id_lavado, nombre, duracion, costo)

@eel.expose
def eliminar_tipo(id_lavado):
    delete_tipo(id_lavado)

@eel.expose
def obtener_historico_tipo():
    return get_historico_tipos()

@eel.expose
def recuperar_tipo_exposed(id_lavado, nombre, duracion, costo):
    recuperar_tipo(id_lavado, nombre, duracion, costo)

# Funciones para insumos
@eel.expose
def obtener_insumos():
    return get_insumos()

@eel.expose
def agregar_insumo(nombre, inventario, unidad, cantidad):
    add_insumo(nombre, inventario, unidad, cantidad)

@eel.expose
def actualizar_insumo(id_insumo, nombre, inventario, unidad, cantidad):
    update_insumo(id_insumo, nombre, inventario, unidad,cantidad)

@eel.expose
def eliminar_insumo(id_insumo):
    delete_insumo(id_insumo)

@eel.expose
def obtener_historico_insumo():
    return get_historico_insumos()

@eel.expose
def recuperar_insumo_exposed(id_insumo, nombre, inventario, unidad, cantidad):
    recuperar_insumo(id_insumo, nombre, inventario, unidad, cantidad)

#Funciones paa detalle
@eel.expose
def obtener_detalles():
    return get_detalles()

@eel.expose
def descontar_insumo(id_insumo, cantidad_descontar, id_usuario):
    return descontar_insumo_backend(id_insumo, cantidad_descontar, id_usuario)

# Funciones para clientes
@eel.expose
def obtener_clientes():
    return get_clientes()

@eel.expose
def agregar_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono):
    add_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono)

@eel.expose
def actualizar_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono):
    update_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono)

@eel.expose
def eliminar_cliente(id_cliente):
    delete_cliente(id_cliente)

@eel.expose
def obtener_historico_cliente():
    return get_historico_clientes()

@eel.expose
def recuperar_cliente_exposed(id_cliente, nombre, apellido1, apellido2, correo, telefono):
    recuperar_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono)

@eel.expose
def verificar_telefono(telefono):
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            cursor.execute("SELECT COUNT(*) FROM clientes WHERE telefono = %s", (telefono,))
            count = cursor.fetchone()[0]
            return count > 0  # Devuelve True si el teléfono ya existe
        finally:
            cursor.close()
            connection.close()
    return False  # Si la conexión falla, devuelve False


# Funciones para promociones
@eel.expose
def obtener_promociones():
    return get_promociones()

@eel.expose
def agregar_promocion(nombre, descripcion, descuento, fecha1, fecha2, id_sucursal):
    add_promocion(nombre, descripcion, descuento, fecha1, fecha2, id_sucursal)

@eel.expose
def actualizar_promocion(id_promocion, nombre, descripcion, descuento, fecha1, fecha2, id_sucursal):
    update_promocion(id_promocion, nombre, descripcion, descuento, fecha1, fecha2, id_sucursal)

@eel.expose
def eliminar_promocion(id_promocion):
    delete_promocion(id_promocion)

@eel.expose
def obtener_historico_promocion():
    return get_historico_promociones()

@eel.expose
def recuperar_promocion_exposed(id_promocion, nombre, descripcion, descuento, fecha1, fecha2, id_sucursal):
    recuperar_promocion(id_promocion, nombre, descripcion, descuento, fecha1, fecha2, id_sucursal)

# Funciones para usuarios
@eel.expose
def obtener_usuarios():
    return get_usuarios()

@eel.expose
def agregar_usuario(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal):
    add_usuario(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal)

@eel.expose
def actualizar_usuario(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal):
    update_usuario(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal)

@eel.expose
def eliminar_usuario(id_usuario):
    delete_usuario(id_usuario)

@eel.expose
def obtener_historico_usuario():
    return get_historico_usuarios()

@eel.expose
def recuperar_usuario_exposed(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal):
    recuperar_usuario(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal)

# Funciones para ventas
@eel.expose
def obtener_ventas():
    return get_ventas()

# Funciones para roles
@eel.expose
def obtener_roles():
    return get_roles()

@eel.expose
def agregar_rol(nombre):
    add_rol(nombre)

@eel.expose
def actualizar_rol(id_rol, nombre):
    update_rol(id_rol, nombre)

@eel.expose
def eliminar_rol(id_rol):
    delete_rol(id_rol)

@eel.expose
def obtener_historico_rol():
    return get_historico_roles()

@eel.expose
def recuperar_rol_exposed(id_rol, nombre):
    recuperar_rol(id_rol, nombre)
    
#Funciones para reportes
@eel.expose
def get_report_day():
    report_data = get_report_by_day()
    file_path = get_report_by_day()
    return file_path 

@eel.expose
def get_report_week():
    data = get_report_by_week()
    reporte_tipo = "semana" 
    ventas = data["ventas"]
    fecha_reporte = data["semana"]

    file_path = generate_pdf(reporte_tipo, ventas, fecha_reporte)
    return file_path

@eel.expose
def get_report_month():
    data = get_report_by_month()
    reporte_tipo = "mes"  
    ventas = data["ventas"]
    fecha_reporte = data["mes"] 

    file_path = generate_pdf(reporte_tipo, ventas, fecha_reporte)
    return file_path

eel.start("login.html", size=(1024, 768))