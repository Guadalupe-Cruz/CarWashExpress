import eel
from flask import Flask
from backend import clientes, login, sucursales # Importación de módulos del backend

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
eel.expose(clientes.get_clients)
eel.expose(clientes.get_client_by_id)
eel.expose(clientes.add_client)
eel.expose(clientes.update_client)
eel.expose(clientes.delete_client)

# ---------------------------------------
# FUNCIONES PARA HISTORICOS DE CLIENTES
# ---------------------------------------
eel.expose(clientes.restore_client)
eel.expose(clientes.get_client_hts)
eel.expose(clientes.get_client_by_id_hts)

# ---------------------------------------
# FUNCIONES PARA SUCURSALES
# ---------------------------------------
eel.expose(sucursales.get_branches)

# ---------------------------------------
# FUNCIONES PARA LOGIN
# ---------------------------------------
eel.expose(login.verify_login)

# =======================================
# EJECUTAR APLICACION
# =======================================
eel.start("login.html", size=(800, 600))