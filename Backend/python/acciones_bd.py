import mysql.connector

# Configuración de la conexión a la base de datos
config = {
    'user': 'root',         
    'password': 'mysql123',  
    'host': 'localhost',
    'database': 'taskflow_cloud'
}

def get_connection():
    """Establece y retorna una conexión a la base de datos."""
    return mysql.connector.connect(**config)


def obtener_usuario_logeado():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT usuario_id FROM userlogeado WHERE id = 1;")
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        return result[0] if result else None

    except Exception as e:
        print("Error al obtener usuario logeado:", e)
        return None
    

def logearme(username, password):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT id 
            FROM usuarios 
            WHERE nombre_usuario = %s 
              AND contrasena = SHA2(%s, 256)
            LIMIT 1;
        """
        cursor.execute(query, (username, password))
        result = cursor.fetchone()
        if not result:
            return False

        user_id = result[0]

        cursor.execute("SELECT usuario_id FROM userlogeado WHERE id = 1;")
        registro = cursor.fetchone()
        if registro:
            if registro[0] == user_id:
                return None
            else:
                cursor.execute("UPDATE userlogeado SET usuario_id = %s WHERE id = 1;", (user_id,))
                conn.commit()
        else:
            cursor.execute("INSERT INTO userlogeado (id, usuario_id) VALUES (1, %s);", (user_id,))
            conn.commit()

        cursor.close()
        conn.close()
        return True

    except Exception as e:
        print("Error al logear:", e)
        return False

def desloguear():
    try:
        conexion = get_connection()
        cursor = conexion.cursor()

        cursor.execute("DELETE FROM userlogeado WHERE id = 1;")
        filas_afectadas = cursor.rowcount

        if filas_afectadas == 0:
            cursor.close()
            conexion.close()
            return False

        conexion.commit()
        cursor.close()
        conexion.close()
        return True

    except Exception as e:
        print("Error al desloguear:", e)
        if conexion:
            conexion.rollback()
        return False

def crear_tarea(usuario_id, titulo, descripcion):
    try:
        conexion = get_connection()
        ejecutar = conexion.cursor()
        consulta = """
            INSERT INTO tareas (usuario_id, titulo, descripcion) 
            VALUES (%s, %s, %s)
        """
        ejecutar.execute(consulta, (usuario_id, titulo, descripcion))
        conexion.commit()
        ejecutar.close()
        conexion.close()
        return True
    except Exception as e:
        print(f"Error al crear tarea: {e}")
        return False
    

def editar_tarea(tarea_id, titulo=None, descripcion=None):
    try:
        conexion = get_connection()
        ejecutar = conexion.cursor()

        valores = []
        consulta = "UPDATE tareas SET "

        if titulo is not None:
            consulta += "titulo = %s, "
            valores.append(titulo)

        if descripcion is not None:
            consulta += "descripcion = %s, "
            valores.append(descripcion)

        if not valores:
            print("No hay valores para actualizar")
            return False  

        consulta = consulta.rstrip(", ") + " WHERE id = %s"
        valores.append(tarea_id)

        ejecutar.execute(consulta, tuple(valores))
        conexion.commit()

        filas_afectadas = ejecutar.rowcount

        ejecutar.close()
        conexion.close()

        return filas_afectadas > 0
    except Exception as e:
        print(f"Error al editar tarea: {e}")
        return False

def registrarusuario(username, email, password, imagen):
    try:
        conexion = get_connection()
        ejecutar = conexion.cursor()

        consulta_verificacion = "SELECT COUNT(*) FROM usuarios WHERE nombre_usuario = %s"
        ejecutar.execute(consulta_verificacion, (username,))
        existe_usuario = ejecutar.fetchone()[0]

        if existe_usuario > 0:
            ejecutar.close()
            conexion.close()
            return False

        consulta = """
            INSERT INTO usuarios (nombre_usuario, correo, contrasena, imagen_perfil_url) 
            VALUES (%s, %s, SHA2(%s, 256), %s)
        """
        
        ejecutar.execute(consulta, (username, email, password, imagen))
        conexion.commit()

        ejecutar.close()
        conexion.close()
        return True

    except Exception as e:
        print(f"Error al registrar usuario: {e}")
        if conexion:
            conexion.rollback()
        return False

# Cargar archivo
def cargar_archivo(usuario_id, nombre_archivo, tipo_archivo, archivo_url):
    try:
        conexion = get_connection()
        ejecutar = conexion.cursor()

        consulta = """
            INSERT INTO archivos (usuario_id, nombre_archivo, tipo_archivo, url_archivo) 
            VALUES (%s, %s, %s, %s)
        """
        ejecutar.execute(consulta, (usuario_id, nombre_archivo, tipo_archivo, archivo_url))
        conexion.commit()

        ejecutar.close()
        conexion.close()
        return True

    except Exception as e:
        print(f"Error al cargar archivo: {e}")
        if conexion:
            conexion.rollback()
        return False

# Listar archivos
def listar_archivos(usuario_id):
    try:
        conexion = get_connection()
        ejecutar = conexion.cursor()

        consulta = "SELECT * FROM archivos WHERE usuario_id = %s"
        ejecutar.execute(consulta, (usuario_id,))
        archivos = ejecutar.fetchall()

        ejecutar.close()
        conexion.close()

        return archivos if archivos else []

    except Exception as e:
        print(f"Error al listar archivos: {e}")
        return []
    
# Marcar tarea como completada
def completar_tarea(tarea_id):
    try:
        conexion = get_connection()
        ejecutar = conexion.cursor()
        consulta = "UPDATE tareas SET completada = TRUE WHERE id = %s"
        ejecutar.execute(consulta, (tarea_id,))
        conexion.commit()
        filas_afectadas = ejecutar.rowcount
        ejecutar.close()
        conexion.close()
        return filas_afectadas > 0
    except Exception as e:
        print(f"Error al completar tarea: {e}")
        if conexion:
            conexion.rollback()
        return False

# Eliminar tarea
def eliminar_tarea(tarea_id):
    try:
        conexion = get_connection()
        ejecutar = conexion.cursor()
        consulta = "DELETE FROM tareas WHERE id = %s"
        ejecutar.execute(consulta, (tarea_id,))
        conexion.commit()
        filas_afectadas = ejecutar.rowcount
        ejecutar.close()
        conexion.close()
        return filas_afectadas > 0
    except Exception as e:
        print(f"Error al eliminar tarea: {e}")
        if conexion:
            conexion.rollback()
        return False
