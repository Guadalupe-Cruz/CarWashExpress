import eel
from flask import Flask
from backend import clientes_admin, insumos_admin, login, pagos_historial_lavados_admin, sucursales, pagos, dashboard, usuarios_admin # Importación de módulos del backend

# Crear instancia de la aplicación Flask
app = Flask(__name__)

# Inicializar Eel
eel.init("web")

# =======================================
# EXPONER TODAS LA FUNCIONES NECESARIAS
# =======================================

# ---------------------------------------
# FUNCIONES PARA CLIENTES
# ---------------------------------------
eel.expose(clientes_admin.get_clients)
eel.expose(clientes_admin.get_client_by_id)
eel.expose(clientes_admin.add_client)
eel.expose(clientes_admin.update_client)
eel.expose(clientes_admin.delete_client)

# ---------------------------------------
# FUNCIONES PARA HISTORICOS DE CLIENTES
# ---------------------------------------
eel.expose(clientes_admin.restore_client)
eel.expose(clientes_admin.get_client_hts)
eel.expose(clientes_admin.get_client_by_id_hts)

# ---------------------------------------
# FUNCIONES PARA HISTORIAL DE LAVADOS
# ---------------------------------------
eel.expose(pagos_historial_lavados_admin.get_wash_history)
eel.expose(pagos_historial_lavados_admin.get_wash_history_historical)

# ---------------------------------------
# FUNCIONES PARA PAGOS
# ---------------------------------------
eel.expose(pagos.get_payments)
eel.expose(pagos.get_payments_historical)

# ---------------------------------------
# FUNCIONES PARA USUARIOS
# ---------------------------------------
eel.expose(usuarios_admin.get_users)
eel.expose(usuarios_admin.get_users_historical)

# ---------------------------------------
# FUNCIONES PARA INSUMOS
# ---------------------------------------
eel.expose(insumos_admin.get_insumos)
eel.expose(insumos_admin.add_insumo)
eel.expose(insumos_admin.update_insumo)
eel.expose(insumos_admin.delete_insumos)
eel.expose(insumos_admin.get_insumo_by_id)
eel.expose(insumos_admin.restore_insumos)
eel.expose(insumos_admin.get_insumos_historical)
eel.expose(insumos_admin.actualizar_insumos)

# ---------------------------------------
# FUNCIONES PARA SUCURSALES
# ---------------------------------------
eel.expose(sucursales.get_branches)

# ---------------------------------------
# FUNCIONES PARA LOGIN
# ---------------------------------------
eel.expose(login.verify_login)

# ---------------------------------------
# FUNCIONES PARA DASHBOARD
# ---------------------------------------
eel.expose(dashboard.obtener_datos_dashboard)
eel.expose(dashboard.obtener_todos_los_datos)

# =======================================
# EJECUTAR APLICACION
# =======================================
eel.start("login.html", size=(1024, 768))