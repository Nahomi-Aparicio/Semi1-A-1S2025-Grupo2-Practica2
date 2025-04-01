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

app.listen(5000, () => console.log('Servidor corriendo en http://localhost:5000'));
