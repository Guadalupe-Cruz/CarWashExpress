import eel
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

eel.init("web")

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
def agregar_insumo(nombre, inventario, fecha, cantidad):
    add_insumo(nombre, inventario, fecha, cantidad)

@eel.expose
def actualizar_insumo(id_insumo, nombre, inventario, fecha, cantidad):
    update_insumo(id_insumo, nombre, inventario, fecha, cantidad)

@eel.expose
def eliminar_insumo(id_insumo):
    delete_insumo(id_insumo)

@eel.expose
def obtener_historico_insumo():
    return get_historico_insumos()

@eel.expose
def recuperar_insumo_exposed(id_insumo, nombre, inventario, fecha, cantidad):
    recuperar_insumo(id_insumo, nombre, inventario, fecha, cantidad)

# Funciones para clientes
@eel.expose
def obtener_clientes():
    return get_clientes()

@eel.expose
def agregar_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono, id_sucursal):
    add_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono, id_sucursal)

@eel.expose
def actualizar_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono, id_sucursal):
    update_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono, id_sucursal)

@eel.expose
def eliminar_cliente(id_cliente):
    delete_cliente(id_cliente)

@eel.expose
def obtener_historico_cliente():
    return get_historico_clientes()

@eel.expose
def recuperar_cliente_exposed(id_cliente, nombre, apellido1, apellido2, correo, telefono, id_sucursal):
    recuperar_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono, id_sucursal)


eel.start("pages/superusuario/sucursal/sucursal.html", size=(1024, 768))