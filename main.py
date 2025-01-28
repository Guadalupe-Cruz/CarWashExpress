import eel
from flask import Flask
from backend import clientes, login, sucursales # Importación de módulos del backend

# Crear instancia de la aplicación Flask
app = Flask(__name__)

# Inicializar Eel
eel.init("web")

# -------- Exponer todas las funciones necesarias --------

# Funciones clientes
eel.expose(clientes.get_clients)
eel.expose(clientes.get_client_by_id)
eel.expose(clientes.add_client)
eel.expose(clientes.update_client)

# Funciones sucursales
eel.expose(sucursales.get_branches)

# Funciones Login
eel.expose(login.verify_login)

# Ejecutar la aplicación
eel.start("login.html", size=(800, 600))