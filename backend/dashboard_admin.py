from backend.database import get_db_connection
from datetime import datetime

# ==========================================
# FUNCIÓN PARA OBTENER DATOS DEL DASHBOARD
# ==========================================

def obtener_datos_dashboard():
    """
    Obtiene los datos del día actual para el dashboard.

    Esta función consulta la vista 'vw_resumen_pagos_admin' para obtener los datos de pagos,
    filtra la información correspondiente a la fecha actual y devuelve un resumen.

    Returns:
        list: Lista con un diccionario que contiene el resumen de los datos del día actual.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Obtener todos los datos de la vista VW_ResumenPagos
    cursor.execute("SELECT * FROM vw_resumen_pagos_admin")
    datos = cursor.fetchall()

    # Obtener la fecha actual en formato 'YYYY-MM-DD'
    fecha_actual = datetime.now().strftime('%Y-%m-%d')

    # Filtrar los datos correspondientes al día actual
    datos_hoy = next((item for item in datos if item['fecha'] and str(item['fecha']) == fecha_actual), None)

    # Si no hay datos para hoy, establecer valores predeterminados en 0
    if not datos_hoy:
        datos_hoy = {
            'total_pagado': 0,
            'total_pagos': 0,
            'cliente_general': 0,
            'clientes_con_membresia': 0,
            'fecha': fecha_actual  # Incluye la fecha actual para evitar valores nulos
        }
    else:
        # Convertir la fecha de tipo datetime.date a string para su correcta visualización
        datos_hoy['fecha'] = datos_hoy['fecha'].strftime('%Y-%m-%d')

    # Asegurar el formato correcto de los datos numéricos
    datos_hoy['total_pagado'] = float(datos_hoy['total_pagado'])  # Convertir a float
    datos_hoy['total_pagos'] = int(datos_hoy['total_pagos'])      # Convertir a entero

    # Cerrar la conexión con la base de datos
    cursor.close()
    connection.close()

    # Devolver los datos del día actual en una lista
    return [datos_hoy]

# ==================================================
# FUNCIÓN PARA OBTENER TODOS LOS DATOS DEL DASHBOARD
# ==================================================

def obtener_todos_los_datos():
    """
    Obtiene todos los datos de la vista 'vw_resumen_pagos_admin'.

    Esta función consulta la vista 'vw_resumen_pagos_admin' para obtener un historial completo de pagos,
    asegurando que las fechas estén en el formato adecuado y los valores numéricos correctamente tipados.

    Returns:
        list: Lista de diccionarios con todos los datos de pagos registrados.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Consultar todos los registros de la vista vw_resumen_pagos_admin
    cursor.execute("SELECT * FROM vw_resumen_pagos_admin")
    datos = cursor.fetchall()

    # Formatear la fecha y asegurar el tipo de los valores numéricos
    for item in datos:
        if item['fecha']:
            item['fecha'] = item['fecha'].strftime('%Y-%m-%d')  # Convertir la fecha a formato YYYY-MM-DD

        # Convertir el valor de 'total_pagado' a float para precisión en cálculos
        item['total_pagado'] = float(item['total_pagado'])

    # Cerrar la conexión con la base de datos
    cursor.close()
    connection.close()

    # Devolver la lista completa de datos
    return datos
