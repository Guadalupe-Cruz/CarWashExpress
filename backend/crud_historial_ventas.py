from backend.database import get_db_connection
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import os
from datetime import datetime
from datetime import datetime, timedelta

# Función para obtener todos los ventas
def get_ventas():
    try:
        with get_db_connection() as conn, conn.cursor(dictionary=True) as cursor:
            cursor.execute("""
                SELECT v.id_historial, v.tiempo_inicio, v.tiempo_fin, v.monto_pagado, v.metodo_pago, v.fecha_pago,
                IFNULL(t.nombre_lavado, 'Tipo de lavado eliminado') AS nombre_lavado,
                IFNULL(c.nombre_cliente, 'Cliente eliminado') AS nombre_cliente 
                FROM historial_ventas v 
                LEFT JOIN tipos_lavado t ON v.id_lavado = t.id_lavado
                LEFT JOIN clientes c ON v.id_cliente = c.id_cliente;
                """)
            return cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener ventas: {e}")
        return []

# Función para obtener todos los clientes
def get_clientes():
    try:
        with get_db_connection() as conn, conn.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT id_cliente, nombre_cliente FROM clientes")
            return cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener clientes: {e}")
        return []

# Función para obtener todos los tipos de lavado
def get_tipos():
    try:
        with get_db_connection() as conn, conn.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT id_lavado, nombre_lavado FROM tipos_lavado")
            return cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener tipos: {e}")
        return []

#Funcion para los reportes
def get_report_by_day():
    today = datetime.today().date()
    formatted_today = today.strftime("%d-%m-%Y")  # Formato: día-mes-año

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM historial_ventas 
        WHERE DATE(fecha_pago) = %s
    """, (today,))
    ventas = cursor.fetchall()
    cursor.close()
    connection.close()

    #Llamamos a generate_pdf() con los 3 parámetros correctos
    pdf_path = generate_pdf("dia", ventas, formatted_today)

    return pdf_path


# Función para obtener las ventas por semana
def get_report_by_week():
    today = datetime.today()
    start_of_week = today - timedelta(days=today.weekday())  # Lunes de esta semana
    week_number = today.isocalendar()[1]  # Número de la semana actual
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM historial_ventas 
        WHERE fecha_pago BETWEEN %s AND %s
    """, (start_of_week, today))
    ventas = cursor.fetchall()
    cursor.close()
    connection.close()
    
    # Agregar título con el número de semana
    return {"semana": f"Semana {week_number}", "ventas": ventas}


# Función para obtener las ventas por mes
def get_report_by_month():
    today = datetime.today()
    start_of_month = today.replace(day=1)
    month_name = today.strftime("%B")  # Nombre completo del mes
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM historial_ventas 
        WHERE MONTH(fecha_pago) = %s AND YEAR(fecha_pago) = %s
    """, (today.month, today.year))
    ventas = cursor.fetchall()
    cursor.close()
    connection.close()
    
    # Agregar título con el nombre del mes
    return {"mes": f"Mes: {month_name}", "ventas": ventas}


# Función para generar el reporte en PDF
def generate_pdf(reporte_tipo, ventas, fecha_reporte):
    connection = get_db_connection()
    cursor = connection.cursor()

    # Obtener datos de ventas según el tipo de reporte
    if reporte_tipo == 'dia':
        fecha_reporte = datetime.today().strftime("%d-%m-%Y")
        query = '''
            SELECT h.fecha_pago, c.nombre_cliente AS cliente, t.nombre_lavado AS tipo_lavado,
                   h.monto_pagado, h.metodo_pago, h.tiempo_inicio, h.tiempo_fin
            FROM historial_ventas h
            JOIN clientes c ON h.id_cliente = c.id_cliente
            JOIN tipos_lavado t ON h.id_lavado = t.id_lavado
            WHERE DATE(h.fecha_pago) = CURDATE()
        '''
    elif reporte_tipo == 'semana':
        start_week = (datetime.today() - timedelta(days=datetime.today().weekday())).strftime("%d-%m-%Y")
        end_week = (datetime.today() + timedelta(days=6 - datetime.today().weekday())).strftime("%d-%m-%Y")
        fecha_reporte = f"{start_week} - {end_week}"
        query = '''
            SELECT h.fecha_pago, c.nombre_cliente AS cliente, t.nombre_lavado AS tipo_lavado,
                   h.monto_pagado, h.metodo_pago, h.tiempo_inicio, h.tiempo_fin
            FROM historial_ventas h
            JOIN clientes c ON h.id_cliente = c.id_cliente
            JOIN tipos_lavado t ON h.id_lavado = t.id_lavado
            WHERE YEARWEEK(h.fecha_pago, 1) = YEARWEEK(CURDATE(), 1)
        '''
    elif reporte_tipo == 'mes':
        month_name = datetime.today().strftime("%B %Y")
        fecha_reporte = month_name
        query = '''
            SELECT h.fecha_pago, c.nombre_cliente AS cliente, t.nombre_lavado AS tipo_lavado,
                   h.monto_pagado, h.metodo_pago, h.tiempo_inicio, h.tiempo_fin
            FROM historial_ventas h
            JOIN clientes c ON h.id_cliente = c.id_cliente
            JOIN tipos_lavado t ON h.id_lavado = t.id_lavado
            WHERE MONTH(h.fecha_pago) = MONTH(CURDATE()) AND YEAR(h.fecha_pago) = YEAR(CURDATE())
        '''
    else:
        raise ValueError("Tipo de reporte no válido")
    
    cursor.execute(query)
    ventas = cursor.fetchall()
    cursor.close()
    connection.close()

    # Crear PDF
    pdf_filename = f"reporte_{reporte_tipo}.pdf"
    pdf_path = os.path.join(os.getcwd(), pdf_filename)
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    
    # Estilos
    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(colors.darkblue)
    c.drawString(150, height - 50, "Reporte de Ventas - CARWASHEXPRESS")

    # Agregar la fecha del reporte
    c.setFont("Helvetica", 12)
    c.setFillColor(colors.black)
    c.drawString(50, height - 80, f"Fecha del Reporte: {fecha_reporte}")  # Aquí se imprime la fecha

    c.drawString(50, height - 100, "---------------------------------------------")
    
    # Detalle de las ventas
    y_position = height - 130
    total_ingresos = 0
    line_spacing = 20  # Espacio entre líneas
    block_spacing = 30  # Espacio entre bloques de ventas
    
    for venta in ventas:
        fecha, cliente, tipo_lavado, monto, metodo_pago, inicio, fin = venta
        total_ingresos += monto
        
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y_position, f"Cliente: {cliente}")
        
        c.setFont("Helvetica", 11)
        c.drawString(50, y_position - line_spacing, f"Fecha: {fecha}")
        c.drawString(50, y_position - 2 * line_spacing, f"Tipo Lavado: {tipo_lavado}")
        c.drawString(50, y_position - 3 * line_spacing, f"Monto: ${monto:.2f}")
        c.drawString(50, y_position - 4 * line_spacing, f"Método: {metodo_pago}")
        c.drawString(50, y_position - 5 * line_spacing, f"Duración: {inicio} - {fin}")
        c.drawString(50, y_position - 6 * line_spacing, "___________________________________________________________")
        
        y_position -= 6 * line_spacing + block_spacing
        if y_position < 100:
            c.showPage()
            c.setFont("Helvetica", 12)
            y_position = height - 50
    
    # Total de ingresos
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(colors.red)
    c.drawString(50, y_position - 30, f"Total Ingresos: ${total_ingresos:.2f}")
    
    c.save()
    return pdf_filename
