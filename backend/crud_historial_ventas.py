from backend.database import get_db_connection
from fpdf import FPDF
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
# Función para obtener las ventas por día
def get_report_by_day():
    today = datetime.today().date()
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM historial_ventas 
        WHERE DATE(fecha_pago) = %s
    """, (today,))
    ventas = cursor.fetchall()
    cursor.close()
    connection.close()
    return ventas

# Función para obtener las ventas por semana
def get_report_by_week():
    today = datetime.today()
    start_of_week = today - timedelta(days=today.weekday())  # Lunes de esta semana
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM historial_ventas 
        WHERE fecha_pago BETWEEN %s AND %s
    """, (start_of_week, today))
    ventas = cursor.fetchall()
    cursor.close()
    connection.close()
    return ventas

# Función para obtener las ventas por mes
def get_report_by_month():
    today = datetime.today()
    start_of_month = today.replace(day=1)
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
        SELECT * FROM historial_ventas 
        WHERE MONTH(fecha_pago) = %s AND YEAR(fecha_pago) = %s
    """, (today.month, today.year))
    ventas = cursor.fetchall()
    cursor.close()
    connection.close()
    return ventas

# Función para generar el reporte en PDF
def generate_pdf(report_data, report_type):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', size=12)

    pdf.cell(200, 10, f'Reporte de Ventas - {report_type}', ln=True, align='C')
    pdf.ln(10)

    # Encabezado de la tabla
    pdf.cell(30, 10, 'ID Venta', border=1)
    pdf.cell(30, 10, 'Fecha Inicio', border=1)
    pdf.cell(30, 10, 'Fecha Fin', border=1)
    pdf.cell(40, 10, 'Monto Pagado', border=1)
    pdf.cell(30, 10, 'Método Pago', border=1)
    pdf.cell(30, 10, 'Fecha Pago', border=1)
    pdf.ln(10)

    # Datos del reporte
    for venta in report_data:
        pdf.cell(30, 10, str(venta['id_historial']), border=1)
        pdf.cell(30, 10, str(venta['tiempo_inicio']), border=1)
        pdf.cell(30, 10, str(venta['tiempo_fin']), border=1)
        pdf.cell(40, 10, str(venta['monto_pagado']), border=1)
        pdf.cell(30, 10, str(venta['metodo_pago']), border=1)
        pdf.cell(30, 10, str(venta['fecha_pago']), border=1)
        pdf.ln(10)

    # Guardar el archivo PDF
    file_name = f"reporte_ventas_{report_type}.pdf"
    pdf.output(file_name)
    return file_name