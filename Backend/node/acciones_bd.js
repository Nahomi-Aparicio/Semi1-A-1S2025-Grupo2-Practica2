const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const config = {
    host: 'localhost',
    user: 'root',
    password: 'mysql123',  // Cambia esto por tu contraseña de MySQL
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
async function crearTarea(usuario_id, titulo, descripcion) {
    try {
        const conexion = await conn.getConnection();
        const consulta = `INSERT INTO tareas (usuario_id, titulo, descripcion) VALUES (?, ?, ?)`;
        const [resultado] = await conexion.execute(consulta, [usuario_id, titulo, descripcion]);
        conexion.release();
        return resultado.affectedRows > 0;
    } catch (error) {
        console.error('Error al crear tarea:', error);
        return false;
    }
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


module.exports = { logearme, desloguear, registrarusuario, cargarArchivo, listarArchivos, obtenerUsuarioLogeado, crearTarea, editarTarea };
