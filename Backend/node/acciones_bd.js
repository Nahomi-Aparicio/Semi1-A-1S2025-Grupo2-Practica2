const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const config = {
    host: 'localhost',
    user: 'root',
    password: '123456789',  // Cambia esto por tu contraseña de MySQL
    database: 'taskflow_cloud'
};

// Crear la conexión
const conn = mysql.createPool(config).promise();

// Función para logearse
async function logearme(username, password) {
    try {
        console.log(username, password, 'logearme');
        const [rows] = await conn.execute(
            `SELECT id FROM usuarios WHERE nombre_usuario = ? AND contrasena = SHA2(?, 256) LIMIT 1`,
            [username, password]
        );

        if (rows.length === 0) return false; // Usuario no encontrado

        const userId = rows[0].id;

        // Verificar si ya hay un usuario logeado
        const [logged] = await conn.execute(`SELECT usuario_id FROM userlogeado WHERE id = 1`);
        if (logged.length > 0) {
            if (logged[0].usuario_id === userId) return null; // Ya está logeado
            await conn.execute(`UPDATE userlogeado SET usuario_id = ? WHERE id = 1`, [userId]);
        } else {
            await conn.execute(`INSERT INTO userlogeado (id, usuario_id) VALUES (1, ?)`, [userId]);
        }

        return true;
    } catch (error) {
        console.error('Error en logearme:', error);
        return false;
    }
}

// Función para desloguearse
async function desloguear() {
    try {
        const [result] = await conn.execute(`DELETE FROM userlogeado WHERE id = 1`);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error en desloguear:', error);
        return false;
    }
}

// Función para registrar usuario
async function registrarusuario(username, email, password, imagen) {
    try {
        // Verificar si el usuario ya existe
        const [exist] = await conn.execute(`SELECT COUNT(*) AS count FROM usuarios WHERE nombre_usuario = ?`, [username]);
        if (exist[0].count > 0) return false;

        // Registrar usuario
        await conn.execute(
            `INSERT INTO usuarios (nombre_usuario, correo, contrasena, imagen_perfil_url) VALUES (?, ?, SHA2(?, 256), ?)`,
            [username, email, password, imagen]
        );
        return true;
    } catch (error) {
        console.error('Error en registrarusuario:', error);
        return false;
    }
}


// Función para obtener la información del usuario logeado
async function obtenerUser() {
    try {
        // Verificar si hay un usuario logeado
        const [logged] = await conn.execute(`SELECT usuario_id FROM userlogeado WHERE id = 1`);
        if (logged.length === 0) {
            return null; // No hay usuario logeado
        }

        const userId = logged[0].usuario_id;

        // Obtener información del usuario logeado desde la tabla usuarios
        const [user] = await conn.execute(`SELECT id, nombre_usuario, correo, imagen_perfil_url FROM usuarios WHERE id = ?`, [userId]);

        if (user.length === 0) {
            return null; // No se encontró el usuario
        }

        // Retornar la información del usuario
        return user[0];
    } catch (error) {
        console.error('Error al obtener usuario logeado:', error);
        return null;
    }
}


async function cargarArchivo(usuario_id, nombre_archivo, tipo_archivo, archivo_url) {
    try {
        await conn.execute(
            `INSERT INTO archivos (usuario_id, nombre_archivo, tipo_archivo, url_archivo) 
            VALUES (?, ?, ?, ?)`,
            [usuario_id, nombre_archivo, tipo_archivo, archivo_url]
        );
        return true;
    } catch (error) {
        console.error('Error al cargar archivo:', error);
        return false;
    }
}

async function listarArchivos(usuarioId) {
    try {
        const [archivos] = await conn.execute(
            `SELECT * FROM archivos WHERE usuario_id = ?`,
            [usuarioId]
        );
        return archivos;
    } catch (error) {
        console.error('Error al listar archivos:', error);
        return [];
    }
}


async function obtenerUsuarioLogeado() {
    try {
        const [result] = await conn.execute(
            `SELECT usuario_id FROM userlogeado WHERE id = 1`
        );
        return result[0]?.usuario_id || null;
    } catch (error) {
        console.error('Error al obtener usuario logeado:', error);
        return null;
    }
}



// Crear tarea
function crearTarea(usuario_id, titulo, descripcion, fecha_creacion) {
    return new Promise((resolve, reject) => {
      const consulta = `
        INSERT INTO tareas (usuario_id, titulo, descripcion, fecha_creacion) 
        VALUES (?, ?, ?, ?)
      `;
      // Cambiar 'conexion' por 'conn' para utilizar la conexión correctamente
      conn.execute(consulta, [usuario_id, titulo, descripcion, fecha_creacion])
        .then(() => resolve(true))
        .catch(err => {
          console.log('Error al crear tarea:', err);
          reject(false);
        });
    });
  }
  

// Editar tarea
async function editarTarea(tarea_id, titulo, descripcion) {
    try {
        const conexion = await conn.getConnection();
        let consulta = 'UPDATE tareas SET ';
        let valores = [];
        
        if (titulo) {
            consulta += 'titulo = ?, ';
            valores.push(titulo);
        }
        if (descripcion) {
            consulta += 'descripcion = ?, ';
            valores.push(descripcion);
        }
        if (valores.length === 0) return false;

        consulta = consulta.slice(0, -2) + ' WHERE id = ?';
        valores.push(tarea_id);

        const [resultado] = await conexion.execute(consulta, valores);
        conexion.release();
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Error al editar tarea:', error);
        return false;
    }
}

// Marcar tarea como completada
async function completarTarea(tarea_id) {
    try {
        const conexion = await conn.getConnection();
        const [resultado] = await conexion.execute(
            `UPDATE tareas SET completada = TRUE WHERE id = ?`,
            [tarea_id]
        );
        conexion.release();
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Error al completar tarea:', error);
        return false;
    }
}

// Eliminar tarea
async function eliminarTarea(tarea_id) {
    try {
        const conexion = await conn.getConnection();
        const [resultado] = await conexion.execute(
            `DELETE FROM tareas WHERE id = ?`,
            [tarea_id]
        );
        conexion.release();
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        return false;
    }
}

async function listar_tareas(usuarioId) {
    try {
        const [tareas] = await conn.execute(
            `SELECT * FROM tareas WHERE usuario_id = ?`,
            [usuarioId]
        );
        
        // Formatear la fecha como dd/mm/aaaa
        tareas.forEach(tarea => {
            if (tarea.fecha_creacion) {
                const fecha = new Date(tarea.fecha_creacion);
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                const anio = fecha.getFullYear();
                tarea.fecha_creacion = `${dia}/${mes}/${anio}`;
            }
        });
        return tareas;
    } catch (error) {
        console.error('Error al listar tareas:', error);
        return [];
    }
}
async function descompletar_tarea(tarea_id) {
    try {
        const conexion = await conn.getConnection();
        const [resultado] = await conexion.execute(
            `UPDATE tareas SET completada = FALSE WHERE id = ?`,
            [tarea_id]
        );
        conexion.release();
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Error al completar tarea:', error);
        return false;
    }
}

module.exports = {
    logearme, desloguear, registrarusuario,
    cargarArchivo, listarArchivos, obtenerUsuarioLogeado,
    crearTarea, editarTarea,
    completarTarea, eliminarTarea, obtenerUser,listar_tareas,descompletar_tarea
};