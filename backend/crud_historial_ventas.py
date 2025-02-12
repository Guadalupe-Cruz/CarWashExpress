from backend.database import get_db_connection

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
