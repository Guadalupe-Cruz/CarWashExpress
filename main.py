import eel
from flask import Flask
from backend import (
    clientes_admin, dashboard_admin, insumos_admin, login,
    pagos_historial_lavados_admin, sucursales_admin, usuarios_admin,
    sesion, descuentos_isumos_admin, ventas_admin
)

# Crear instancia de la aplicación Flask
app = Flask(__name__)

# Inicializar Eel
eel.init("web")

# =======================================
# FUNCIÓN PARA EXPONER MÚLTIPLES FUNCIONES
# =======================================
def exponer_funciones(modulo, funciones):
    for funcion in funciones:
        eel.expose(getattr(modulo, funcion))

# ---------------------------------------
# EXPOSICIÓN DE FUNCIONES AGRUPADAS
# ---------------------------------------
exponer_funciones(clientes_admin, [
    "get_clients", "get_client_by_id", "add_client", "update_client", "delete_client",
    "restore_client", "get_client_hts", "get_client_by_id_hts"
])

exponer_funciones(pagos_historial_lavados_admin, [
    "get_wash_history", "get_wash_history_historical", "search_wash_count_by_id"
])

exponer_funciones(usuarios_admin, [
    "get_users", "get_users_historical"
])

exponer_funciones(insumos_admin, [
    "get_insumos", "add_insumo", "update_insumo", "delete_insumos",
    "get_insumo_by_id", "restore_insumos", "get_insumos_historical",
    "actualizar_insumos"
])

exponer_funciones(sucursales_admin, ["get_branches"])

exponer_funciones(login, ["verify_login"])

exponer_funciones(dashboard_admin, [
    "obtener_datos_dashboard", "obtener_todos_los_datos"
])

exponer_funciones(descuentos_isumos_admin, ["get_descuentos_insumos"])

exponer_funciones(ventas_admin, [
    "cierre_caja", "cierre_caja_mes"
])

exponer_funciones(sesion, [
    "get_session", "set_session", "clear_session"
])

# =======================================
# EJECUTAR APLICACIÓN
# =======================================
eel.start("login.html", size=(1024, 768))
