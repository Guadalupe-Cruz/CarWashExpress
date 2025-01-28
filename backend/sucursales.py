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

# Funcion para obtener todas las sucursales
def get_branches():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM sucursales")
    sucursales = cursor.fetchall()
    cursor.close()
    connection.close()
    return sucursales