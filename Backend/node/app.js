const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
    logearme, desloguear, registrarusuario,
    crearTarea, editarTarea,
    cargarArchivo, listarArchivos, obtenerUsuarioLogeado,
    completarTarea, eliminarTarea,
    obtenerUser
} = require('./acciones_bd');


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

app.get('/getuser', async (req, res) => {
    try {
        // Obtener la información del usuario logeado
        const usuario = await obtenerUser();
        if (usuario) {
            return res.json(usuario); // Retorna la información del usuario
        } else {
            return res.status(400).json({ error: 'No hay usuario logeado.' });
        }
    } catch (error) {
        console.error('Error al obtener usuario logeado:', error);
        return res.status(500).json({ error: 'Error al obtener información del usuario.' });
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

// Crear tarea
app.post('/crear_tarea', async (req, res) => {
  try {
    const { usuario_id, titulo, descripcion, fecha_creacion } = req.body;

    // Verificar que todos los campos sean proporcionados
    if (!usuario_id || !titulo || !fecha_creacion) {
      return res.status(400).json({ message: 'El usuario, el título y la fecha son obligatorios' });
    }

    const resultado = await crearTarea(usuario_id, titulo, descripcion, fecha_creacion);
    if (resultado) {
      return res.status(201).json({ message: 'Tarea creada exitosamente' });
    } else {
      return res.status(400).json({ message: 'No se pudo crear la tarea' });
    }
  } catch (e) {
    console.error('Error al crear tarea:', e);
    return res.status(500).json({ message: 'Error al crear tarea' });
  }
});

// Editar tarea
app.patch('/crear_tarea/:tarea_id', async (req, res) => {
    try {
        const { tarea_id } = req.params;
        const { titulo, descripcion } = req.body;

        if (!titulo && !descripcion) {
            return res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar' });
        }

        const resultado = await editarTarea(tarea_id, titulo, descripcion);
        if (resultado) {
            return res.status(200).json({ message: 'Tarea actualizada exitosamente' });
        } else {
            return res.status(400).json({ message: 'No se pudo actualizar la tarea o no existe' });
        }
    } catch (error) {
        return res.status(400).json({ message: `Error al actualizar tarea - ${error.message}` });
    }
});

// Marcar tarea como completada
app.patch('/completar_tarea/:tarea_id', async (req, res) => {
    try {
        const { tarea_id } = req.params;
        const result = await completarTarea(tarea_id);
        if (result) {
            return res.status(200).json({ message: 'Tarea marcada como completada' });
        } else {
            return res.status(400).json({ message: 'No se pudo marcar la tarea o no existe' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al marcar tarea como completada - ' + error.message });
    }
});

// Eliminar tarea
app.delete('/eliminar_tarea/:tarea_id', async (req, res) => {
    try {
        const { tarea_id } = req.params;
        const result = await eliminarTarea(tarea_id);
        if (result) {
            return res.status(200).json({ message: 'Tarea eliminada exitosamente' });
        } else {
            return res.status(400).json({ message: 'No se pudo eliminar la tarea o no existe' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar tarea - ' + error.message });
    }
});

app.listen(5000, () => console.log('Servidor corriendo en http://localhost:5000'));
