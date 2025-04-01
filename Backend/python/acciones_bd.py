import mysql.connector

# Configuración de la conexión a la base de datos
config = {
    'user': 'root',         # Reemplaza por tu usuario de MySQL
    'password': 'reyes',   # Reemplaza por tu contraseña de MySQL
    'host': 'localhost',
    'database': 'taskflow_cloud'
}

def get_connection():
    """Establece y retorna una conexión a la base de datos."""
    return mysql.connector.connect(**config)


def logearme(username, password):
    try:
        print(username,password,'logearme')
        conn = get_connection()
        cursor = conn.cursor()

        # Verificar si el usuario existe y la contraseña es correcta.
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
            # Usuario no encontrado o credenciales incorrectas.
            return False

        user_id = result[0]

        # Verificar si ya hay un usuario logeado en la tabla.
        cursor.execute("SELECT usuario_id FROM userlogeado WHERE id = 1;")
        registro = cursor.fetchone()
        if registro:
            print("SI HAY REGISTRO")
            if registro[0] == user_id:
                # El mismo usuario ya está logeado, no es necesario insertar.
                print("El usuario ya está logeado.")
                return None
            else:
                # Se actualiza el registro con el nuevo usuario.
                cursor.execute("UPDATE userlogeado SET usuario_id = %s WHERE id = 1;", (user_id,))
                conn.commit()
                print("Se actualizó el usuario logeado.")
        else:
            # No existe registro, se inserta el usuario logeado.
            cursor.execute("INSERT INTO userlogeado (id, usuario_id) VALUES (1, %s);", (user_id,))
            conn.commit()
            cursor.close()
            conn.close()
            print("Usuario logeado con éxito.")

        return True

    except Exception as e:
        print("Error al logear:", e)
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
        

        consulta = consulta.rstrip(", ") + " WHERE id = %s"
        valores.append(tarea_id)
        
        ejecutar.execute(consulta, tuple(valores))
        conexion.commit()
        ejecutar.close()
        conexion.close()
        
        return ejecutar.rowcount > 0  
    except Exception as e:
        print(f"Error al editar tarea: {e}")
        return False
