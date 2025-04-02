const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { logearme, desloguear, registrarusuario } = require('./acciones_bd');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({ message: 'API de tareas en funcionamiento en Node.js' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Usuario o contraseña no pueden ser vacíos.' });

    const log = await logearme(username, password);
    if (log) return res.json({ message: 'Login exitoso' });
    if (log === null) return res.status(400).json({ error: 'Ya hay un usuario logeado.' });

    res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
});

app.get('/logout', async (req, res) => {
    const result = await desloguear();
    if (result) return res.json({ message: 'Logout exitoso' });

    res.status(400).json({ error: 'No hay usuario logeado.' });
});

app.post('/registraruser', async (req, res) => {
    const { username, email, password, confirmpassword, imagen } = req.body;
    if (!username || !email || !password || !confirmpassword)
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });

    if (password !== confirmpassword)
        return res.status(400).json({ error: 'Las contraseñas no coinciden.' });

    const resultado = await registrarusuario(username, email, password, imagen);
    if (resultado) return res.status(201).json({ message: 'Usuario registrado exitosamente' });

    res.status(400).json({ error: 'Error al registrar el usuario' });
});

// Ruta para cargar archivos
app.post('/archivos', async (req, res) => {
    try {
        const { usuario_id, nombre_archivo, tipo_archivo, archivo_url } = req.body;
        
        if (!usuario_id || !archivo_url || !nombre_archivo) {
            return res.status(400).json({ error: 'Usuario, archivo y nombre del archivo son obligatorios.' });
        }

        const resultado = await cargarArchivo(usuario_id, nombre_archivo, tipo_archivo, archivo_url);
        if (resultado) {
            return res.status(201).json({ message: 'Archivo cargado exitosamente' });
        }
        res.status(400).json({ error: 'No se pudo cargar el archivo.' });
    } catch (error) {
        res.status(400).json({ error: 'Error al cargar archivo - ' + error.message });
    }
});

// Ruta para listar archivos del usuario
app.get('/archivos', async (req, res) => {
    try {
        const usuarioId = await obtenerUsuarioLogeado();
        if (!usuarioId) {
            return res.status(401).json({ error: 'No hay usuario logeado.' });
        }

        const archivos = await listarArchivos(usuarioId);
        if (archivos.length > 0) {
            return res.json({ archivos });
        }
        res.status(200).json({ message: 'No hay archivos disponibles.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al listar archivos - ' + error.message });
    }
});



app.listen(5000, () => console.log('Servidor corriendo en http://localhost:5000'));
