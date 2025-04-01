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

module.exports = { logearme, desloguear, registrarusuario };
