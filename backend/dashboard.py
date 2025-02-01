import eel
import mysql.connector
from datetime import datetime

# ==============================
# CONEXIÓN A LA BASE DE DATOS
# ==============================
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='',
        database='db_carwashexpress'
    )

# ==========================================
# FUNCIÓN PARA OBTENER DATOS DEL DASHBOARD
# ==========================================
def obtener_datos_dashboard():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Obtener datos de la vista VW_ResumenPagos
    cursor.execute("SELECT * FROM VW_ResumenPagos")
    datos = cursor.fetchall()

    # Obtener la fecha actual
    fecha_actual = datetime.now().strftime('%Y-%m-%d')

    # Filtrar los datos del día actual (conversión a str)
    datos_hoy = next((item for item in datos if item['fecha'] and str(item['fecha']) == fecha_actual), None)

    # Si no hay datos para hoy, establecer valores en 0
    if not datos_hoy:
        datos_hoy = {
            'total_pagado': 0,
            'total_pagos': 0,
            'cliente_general': 0,
            'clientes_con_membresia': 0,
            'fecha': fecha_actual  # Incluye la fecha actual para no tener valores null
        }
    else:
        # Asegurarse de convertir la fecha de tipo datetime.date a string
        datos_hoy['fecha'] = datos_hoy['fecha'].strftime('%Y-%m-%d')  # Convierte la fecha al formato deseado
    
    # Formatear los valores de 'total_pagado' y 'total_pagos' antes de enviarlos
    datos_hoy['total_pagado'] = float(datos_hoy['total_pagado'])
    datos_hoy['total_pagos'] = int(datos_hoy['total_pagos'])
    
    cursor.close()
    connection.close()

    # Devolver los datos como un solo objeto
    return [datos_hoy]

def obtener_todos_los_datos():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Obtener todos los datos de la vista VW_ResumenPagos
    cursor.execute("SELECT * FROM VW_ResumenPagos")
    datos = cursor.fetchall()

    # Asegurarse de que las fechas estén en el formato adecuado
    for item in datos:
        if item['fecha']:
            item['fecha'] = item['fecha'].strftime('%Y-%m-%d')  # Convertir la fecha a formato YYYY-MM-DD
    
        # Asegurarse de que los valores de 'total_pagado' sean tipo float
        item['total_pagado'] = float(item['total_pagado'])

    cursor.close()
    connection.close()

    # Devolver todos los datos
    return datos
