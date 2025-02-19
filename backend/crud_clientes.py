from fpdf import FPDF
from datetime import datetime, timedelta
import eel
from backend.database import get_db_connection

# Función para obtener todos los clientes
def get_clientes():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clientes")
    clientes = cursor.fetchall()
    connection.close()
    return clientes


# Función para agregar un nuevo cliente
def add_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO clientes (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, fecha_expiracion_membresia) VALUES (%s, %s, %s, %s, %s, %s, NOW())", (id_cliente, nombre, apellido1, apellido2, correo, telefono))
    connection.commit()
    connection.close()

# Función para actualizar un cliente
def update_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono):
    if not all([id_cliente, nombre, apellido1, apellido2, telefono]):
        raise ValueError("Todos los campos son obligatorios.")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE clientes 
            SET nombre_cliente = %s, apellido_pt = %s, apellido_mt = %s, correo = %s, telefono = %s
            WHERE id_cliente = %s
        """, (nombre, apellido1, apellido2, correo, telefono, id_cliente))
        conn.commit()
    except Exception as e:
        print(f"Error al actualizar cliente: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def delete_cliente(id_cliente):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Recuperamos el cliente antes de moverlo al histórico
    cursor.execute('SELECT id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, fecha_expiracion_membresia FROM clientes WHERE id_cliente = %s', (id_cliente,))
    cliente = cursor.fetchone()

    if cliente:
        # Insertamos el cliente en el histórico
        cursor.execute('INSERT INTO clientes_historicos (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, fecha_expiracion_membresia, fecha_borrado) VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())', 
                       (cliente[0], cliente[1], cliente[2], cliente[3], cliente[4], cliente[5]))
        
        # Eliminar el cliente de la tabla 'clientes'
        cursor.execute('DELETE FROM clientes WHERE id_cliente = %s', (id_cliente,))

    connection.commit()
    connection.close()

# Función para obtener los clientes del histórico
def get_historico_clientes():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM clientes_historicos')
    historico = cursor.fetchall()
    connection.close()
    return historico

# Función para recuperar un cliente del histórico
def recuperar_cliente(id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono):
    connection = get_db_connection()
    cursor = connection.cursor()
    
    # Insertamos el cliente de nuevo en la tabla 'clientes'
    cursor.execute('INSERT INTO clientes (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, fecha_expiracion_membresia) VALUES (%s, %s, %s, %s, %s, %s, NOW())', 
                   (id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono))
    
    # Elimina el cliente de la tabla 'clientes_historicos'
    cursor.execute('DELETE FROM clientes_historicos WHERE id_cliente = %s', (id_cliente,))
    
    connection.commit()
    connection.close()

# reporte
# Obtener correos de clientes con membresía próxima a expirar
def obtener_correos_membresias_proximas():
    conexion = get_db_connection()
    cursor = conexion.cursor()

    fecha_hoy = datetime.today().date()
    fecha_limite = fecha_hoy + timedelta(days=30)

    query = """
    SELECT correo, fecha_expiracion_membresia FROM clientes
    WHERE fecha_expiracion_membresia IS NOT NULL
    """
    
    cursor.execute(query)
    resultados = cursor.fetchall()
    
    cursor.close()
    conexion.close()

    correos_filtrados = []
    
    for correo, fecha_expiracion_membresia in resultados:
        if fecha_expiracion_membresia:
            fecha_inicio = datetime.strptime(str(fecha_expiracion_membresia).split()[0], "%Y-%m-%d").date()
            fecha_expiracion = fecha_inicio.replace(year=fecha_inicio.year + 1)  # Sumar 1 año

            if fecha_hoy <= fecha_expiracion <= fecha_limite:
                correos_filtrados.append(correo)

    if not correos_filtrados:
        print(f"No hay clientes con membresía próxima a expirar entre {fecha_hoy} y {fecha_limite}.")
    else:
        print(f"Correos obtenidos: {correos_filtrados}")  # Para depurar

    return correos_filtrados

# Exponer la función a JavaScript con Eel
class PDF(FPDF):
    def header(self):
        """Encabezado con fondo en color #7296A4, solo cubriendo el ancho del título."""
        self.set_fill_color(114, 150, 164)  # Color #7296A4 en RGB
        self.set_text_color(255, 255, 255)  # Texto blanco
        self.set_font("Arial", "B", 16)

        # Centrado en el título, pero solo con un fondo que cubra el texto
        title = "Reporte de Membresías Próximas a Vencer"
        title_width = self.get_string_width(title) + 6
        self.rect((210 - title_width) / 2, 10, title_width, 15, style='F')

        self.cell(0, 15, title, ln=True, align="C")
        self.ln(5)

    def footer(self):
        """Pie de página con número de página y fecha de generación."""
        self.set_y(-15)
        self.set_font("Arial", "I", 10)
        self.set_text_color(100)
        self.cell(0, 10, f"Página {self.page_no()} | Generado el {datetime.today().strftime('%Y-%m-%d')}", align="C")

@eel.expose
def generar_reporte_pdf():
    correos = obtener_correos_membresias_proximas()

    if not correos:
        return None  # No genera PDF si no hay datos

    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Información del reporte
    pdf.set_font("Arial", "B", 12)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(200, 10, f"Fecha de Generación: {datetime.today().strftime('%Y-%m-%d')}", ln=True, align="C")
    pdf.ln(10)

    # Tabla de correos
    pdf.set_font("Arial", "B", 12)
    pdf.set_fill_color(230, 230, 230)  # Gris claro
    pdf.cell(190, 10, "Correos Electrónicos", border=1, ln=True, align="C", fill=True)

    pdf.set_font("Arial", "", 12)
    for correo in correos:
        pdf.cell(190, 10, correo, border=1, ln=True, align="C")

    archivo_pdf = "web/reporte_correos.pdf"
    pdf.output(archivo_pdf)

    print(f"Reporte generado correctamente: {archivo_pdf}")
    return archivo_pdf