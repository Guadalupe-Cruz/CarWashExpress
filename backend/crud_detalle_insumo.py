from backend.database import get_db_connection


# Función para obtener todos los detalles
def get_detalles():
    try:
        with get_db_connection() as conn, conn.cursor(dictionary=True) as cursor:
            cursor.execute("""
                SELECT d.id_detalle, d.cantidad_descontada, d.fecha_descuento AS fecha_descuento,
                       IFNULL(i.nombre_insumo, 'Insumo eliminado') AS nombre_insumo,
                       IFNULL(u.nombre_usuario, 'Usuario eliminado') AS nombre_usuario
                FROM detalle_insumo d
                LEFT JOIN insumos i ON d.id_insumo = i.id_insumo
                LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
            """)
            return cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener detalles: {e}")
        return []


# Función para obtener todos los insumos
def get_insumos():
    try:
        with get_db_connection() as conn, conn.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT id_insumo, nombre_insumo FROM insumos")
            return cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener insumos: {e}")
        return []

# Función para obtener todos los usuarios
def get_usuarios():
    try:
        with get_db_connection() as conn, conn.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT id_usuario, nombre_usuario FROM usuarios")
            return cursor.fetchall()
    except Exception as e:
        print(f"Error al obtener usuarios: {e}")
        return []