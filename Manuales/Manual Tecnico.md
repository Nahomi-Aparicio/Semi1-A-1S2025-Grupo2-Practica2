# Manual Tecnico
## **Objetivos:**

- **General:** Desarrollar una aplicación de gestión de tareas y administración de archivos en la nube utilizando distintos proveedores de servicios, para que los estudiantes adquieran experiencia práctica en despliegue y comprendan las diferencias y complejidades entre los servicios de Azure y AWS.
  
- **Específicos:**  
  - Desplegar una aplicación completamente en la nube.  
  - Familiarizarse con el desarrollo en la nube con diferentes proveedores.  
  - Comparar la complejidad en la implementación de servicios de Azure y AWS.

## **Descripción:**

La aplicación **TaskFlow + CloudDrive** permite a los usuarios gestionar tareas y almacenar archivos en la nube. Se compone de dos funcionalidades principales:  
1. **Gestión de Tareas:** Los usuarios pueden crear, editar, completar y organizar tareas.  
2. **Administrador de Archivos:** Los usuarios pueden subir y visualizar archivos en la nube.

Los estudiantes implementarán esta aplicación en **Azure** y **AWS**, utilizando servicios equivalentes en ambas plataformas.

## BACKEND
En este proyecto se hicieros dos API REST con lenguajes diferentes, pero con los mismos endpoints. Una se realizo en **python** y la otra en **Node.js**. Ambas API tienen los mismos endpoints, pero con diferentes implementaciones. A continuación se describen los endpoints de ambas API.

### API REST en Python
Para la API REST en Python se utilizo el framework **Flask**. A continuación se describe el codigo de la API REST en Python:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

from acciones_bd import (
    logearme, desloguear, crear_tarea, editar_tarea,
    registrarusuario, cargar_archivo, listar_archivos,
    obtener_usuario_logeado, completar_tarea, eliminar_tarea,
    obtenerinfologeado, listar_tareas,descompletar_tarea
)

app = Flask(__name__)
CORS(app)

@app.route('/') 
def index():
    return jsonify({'message': 'API de tareas en funcionamiento en python'}), 200

@app.route('/login', methods=['POST'])#------------------------------
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'error': 'Usuario o contraseña no pueden ser vacíos.'}), 400
    
    log = logearme(username, password)
    if log:
        return jsonify({'message': 'Login exitoso'}), 200
    elif log is None:
        return jsonify({'error': 'Ya hay un usuario logeado.'}), 400
    else:
        return jsonify({'error': 'Usuario o contraseña incorrectos.'}), 401

@app.route('/logout', methods=['GET'])#------------------------------
def logout():
    try:
        res = desloguear()
        if res:
            return jsonify({'message': 'Logout exitoso'}), 200
        else:
            return jsonify({'error': 'No hay usuario logeado.'}), 400
    except Exception as e:
        return jsonify({'error': 'Error al desloguear - ' + str(e)}), 400
    
@app.route('/getuser', methods=['GET'])#------------------------------
def get_user():
    try:
        respuesta=obtenerinfologeado()
        if respuesta:
            return jsonify(respuesta), 200
        else:
            return jsonify({'error': 'No hay usuario logeado.'}), 400
    except Exception as e:
        return jsonify({'error': 'Error al obtener información del usuario - ' + str(e)}), 400

@app.route('/registraruser', methods=['POST'])#------------------------------
def registraruser():
    try:
        username = request.json.get('username')
        email = request.json.get('email')
        password = request.json.get('password')
        confirmpassword = request.json.get('confirmpassword')
        imagen = request.json.get('imagen')

        if not username or not email or not password or not confirmpassword:
            return jsonify({'error': 'Todos los campos son obligatorios.'}), 400
        if password != confirmpassword:
            return jsonify({'error': 'Las contraseñas no coinciden.'}), 400
        
        resultado = registrarusuario(username, email, password, imagen)
        if resultado:
            return jsonify({'message': 'Usuario registrado exitosamente'}), 201
        else:
            return jsonify({'error': 'Error al registrar el usuario'}), 400
    except Exception as e:
        return jsonify({'error': 'Error en el registro - ' + str(e)}), 400

@app.route('/crear_tarea', methods=['POST'])#------------------------------
def crear_nueva_tarea():
    try:
        
        usuario_id = request.json.get('usuario_id')
        titulo = request.json.get('titulo')
        descripcion = request.json.get('descripcion')
        fecha_creacion = request.json.get('fecha_creacion')  
        
        print(titulo, descripcion, fecha_creacion, usuario_id)
        # Validación de campos
        if not usuario_id or not titulo or not fecha_creacion:
            return jsonify({'message': 'El usuario, el título y la fecha son obligatorios'}), 400
        
        resultado = crear_tarea(usuario_id, titulo, descripcion, fecha_creacion)
        if resultado:
            return jsonify({'message': 'Tarea creada exitosamente'}), 201
        else:
            return jsonify({'message': 'No se pudo crear la tarea'}), 400
    except Exception as e:
        return jsonify({'message': 'Error al crear tarea - ' + str(e)}), 400

#editar tareas
@app.route('/crear_tarea/<int:tarea_id>', methods=['PATCH']) #------------------------------
def actualizar_tarea(tarea_id):
    try:
        titulo = request.json.get('titulo')  
        descripcion = request.json.get('descripcion')  
        
        if titulo is None and descripcion is None:
            return jsonify({'message': 'Debe proporcionar al menos un campo para actualizar'}), 400

        resultado = editar_tarea(tarea_id, titulo, descripcion)
        if resultado:
            return jsonify({'message': 'Tarea actualizada exitosamente'}), 200
        else:
            return jsonify({'message': 'No se pudo actualizar la tarea o no existe'}), 400
    except Exception as e:
        return jsonify({'message': 'Error al actualizar tarea - ' + str(e)}), 400
    

@app.route('/archivos', methods=['POST'])#------------------------------
def cargar_archivo_endpoint():
    try:
        usuario_id = request.json.get('usuario_id')
        archivo_url = request.json.get('archivo_url')
        nombre_archivo = request.json.get('nombre_archivo')
        tipo_archivo = request.json.get('tipo_archivo')

        if not usuario_id or not archivo_url or not nombre_archivo:
            return jsonify({'error': 'Usuario, archivo y nombre del archivo son obligatorios.'}), 400
        
        resultado = cargar_archivo(usuario_id, nombre_archivo, tipo_archivo, archivo_url)
        if resultado:
            return jsonify({'message': 'Archivo cargado exitosamente'}), 201
        else:
            return jsonify({'error': 'No se pudo cargar el archivo.'}), 400
    except Exception as e:
        return jsonify({'error': 'Error al cargar archivo - ' + str(e)}), 400

@app.route('/archivos', methods=['GET'])#------------------------------
def listar_archivos_endpoint():
    try:
        usuario_id = obtener_usuario_logeado()
        if not usuario_id:
            return jsonify({'error': 'No hay usuario logeado.'}), 401

        archivos = listar_archivos(usuario_id)
        print(archivos)
        if archivos:
            return jsonify({'archivos': archivos}), 200
        else:
            return jsonify({'message': 'No hay archivos disponibles.'}), 200
    except Exception as e:
        return jsonify({'error': 'Error al listar archivos - ' + str(e)}), 500
    
@app.route('/completar_tarea/<int:tarea_id>', methods=['PATCH']) #------------------------------
def completar_tarea_endpoint(tarea_id):
    try:
        result = completar_tarea(tarea_id)
        if result:
            return jsonify({'message': 'Tarea marcada como completada'}), 200
        else:
            return jsonify({'message': 'No se pudo marcar la tarea o no existe'}), 400
    except Exception as e:
        return jsonify({'message': 'Error al marcar tarea como completada - ' + str(e)}), 500

@app.route('/descompletar_tarea/<int:tarea_id>', methods=['PATCH']) #------------------------------
def descompletar_tarea_endpoint(tarea_id):
    print(tarea_id)
    try:
        result = descompletar_tarea(tarea_id)
        if result:
            return jsonify({'message': 'Tarea marcada como pendiente'}), 200
        else:
            return jsonify({'message': 'No se pudo desmarcar la tarea o no existe'}), 400
    except Exception as e:
        return jsonify({'message': 'Error al marcar tarea como pendiente - ' + str(e)}), 500

@app.route('/eliminar_tarea/<int:tarea_id>', methods=['DELETE'])#------------------------------
def eliminar_tarea_endpoint(tarea_id):
    print(tarea_id)
    try:
        result = eliminar_tarea(tarea_id)
        if result:
            return jsonify({'message': 'Tarea eliminada exitosamente'}), 200
        else:
            return jsonify({'message': 'No se pudo eliminar la tarea o no existe'}), 400
    except Exception as e:
        return jsonify({'message': 'Error al eliminar tarea - ' + str(e)}), 500

# Endpoint para listar tareas
@app.route('/tareas', methods=['GET'])#------------------------------
def listar_tareas_endpoint():
    try:
        usuario_id = obtener_usuario_logeado()
        if not usuario_id:
            return jsonify({'error': 'No hay usuario logeado.'}), 401

        tareas = listar_tareas(usuario_id)
        print(tareas)
        if tareas:
            return jsonify({'tareas': tareas}), 200
        else:
            return jsonify({'message': 'No hay tareas disponibles.'}), 200
    except Exception as e:
        return jsonify({'error': 'Error al listar tareas - ' + str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

### API REST en Node.js
Para la API REST en Node.js se utilizo el framework **Express**. A continuación se describe el codigo de la API REST en Node.js:

```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
    logearme, desloguear, registrarusuario,
    crearTarea, editarTarea,
    cargarArchivo, listarArchivos, obtenerUsuarioLogeado,
    completarTarea, eliminarTarea,
    obtenerUser,listar_tareas,descompletar_tarea
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



// Ruta para listar archivos del usuario
app.get('/tareas', async (req, res) => {
    try {
        const usuarioId = await obtenerUsuarioLogeado();
        if (!usuarioId) {
            return res.status(401).json({ error: 'No hay usuario logeado.' });
        }

        const tareas = await listar_tareas(usuarioId);
        console.log(tareas);
        if (tareas.length > 0) {
            return res.json({ 'tareas': tareas });
        }

        res.status(200).json({ message: 'No hay tareas disponibles.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al listar tareas - ' + error.message });
    }
});


// Marcar tarea como completada
app.patch('/descompletar_tarea/:tarea_id', async (req, res) => {
    try {
        const { tarea_id } = req.params;
        const result = await descompletar_tarea(tarea_id);
        if (result) {
            return res.status(200).json({ message: 'Tarea marcada como incompleta' });
        } else {
            return res.status(400).json({ message: 'No se pudo marcar la tarea o no existe' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al marcar tarea como incompleta - ' + error.message });
    }
});


app.listen(5000, () => console.log('Servidor corriendo en http://localhost:5000'));
```

## FRONTEND
El frontend de la aplicacion fue realizado en **React + Vite**. Se hicieron varias vistas para la aplicacion, pero las principales son las siguientes:
- **Login**: Vista para iniciar sesion en la aplicacion. Permite ingresar el nombre de usuario y la contraseña. Si el usuario no existe, se le da la opcion de registrarse.
- **Registro**: Vista para registrarse en la aplicacion. Permite ingresar el nombre de usuario, email, contraseña y confirmar la contraseña. Si el usuario ya existe, se le informa al usuario que el nombre de usuario ya esta en uso.
- **Dashboard**: Vista principal de la aplicacion. Permite ver las tareas y los archivos del usuario. Desde esta vista se pueden crear, editar y eliminar tareas. Ademas, se pueden subir archivos a la nube.
- **Tareas**: Vista para ver las tareas del usuario. Permite ver las tareas pendientes y completadas. Desde esta vista se pueden crear, editar y eliminar tareas.
- **Archivos**: Vista para ver los archivos del usuario. Permite ver los archivos subidos a la nube. Desde esta vista se pueden subir archivos a la nube y eliminarlos.

Aqui esta un codigo de ejemplo de la vista principal de la aplicacion:

```javascript
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Principal.css"; 
import ArchivosSection from "../components/ArchivosSection";
import API_BASE_URL  from '../config';
import { useNavigate } from 'react-router-dom';

import TaskSection from "../components/TaskSection";
const Principal = () => {

  const [activeContent, setActiveContent] = useState('TAREAS');

  const handleClick = (content) => {
    setActiveContent(content === activeContent ? activeContent : content);   };

    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [imagen, setImagen] = useState(null);


    useEffect(() => {


      const getuser = async () => {
        try {
        
          const response = await fetch(`${API_BASE_URL}/getuser`, {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          const data = await response.json();
          console.log(data.imagen_perfil_url);
          setUsuario(data.id);
          setImagen(data.imagen_perfil_url);
          
      } catch (error) {
          alert(`Hubo un problema con el servidor: ${error.message}`);
      }
    };

  getuser();
}, []);

    const logout = async () => {
      try {
          const response = await fetch(`${API_BASE_URL}/logout`, { method: "GET" });
  
          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Error ${response.status}: ${errorText}`);
          }
  
          navigate('/');
      } catch (error) {
          console.error("Error en logout:", error);
          alert(`Hubo un problema con el servidor: ${error.message}`);
      }
  };

  return (
    <div className="wrapper d-flex align-items-center">     
      <nav id="sidebar">
        <div className="p-4 pt-5">          
          <a  className="img logo rounded-circle mb-5" style={{ backgroundImage: "url(" + imagen + ")" }}>
          </a>
          <h3>TaskFlow + CloudDrive
            </h3>

          <ul className="list-unstyled components mb-5">
            <li>
              <a href="#" onClick={() => handleClick("TAREAS")}>
              TAREAS
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleClick("ARCHIVOS")}>
                ARCHIVOS
              </a>
            </li>
          </ul>

          
          <div className="footer" style={{position: 'absolute', bottom: '0', width: '100%'}}>
            <button className="btn " onClick={logout} style={{width: '90%', backgroundColor: '#093443', color: 'white'}}>Cerrar Sesion</button>
            <p>
              Copyright &copy;
              <script>document.write(new Date().getFullYear());</script> All rights reserved
            </p>
          </div>
        </div>
      </nav>

      <div id="content" className="p-4 p-md-5">
        {activeContent === "TAREAS" && (
          <div>
            <TaskSection />
          </div>
        )}
        {activeContent === "ARCHIVOS" && (
          <div>
            <ArchivosSection />
          </div>
        )}
      </div>
    </div>
  );
};

export default Principal;
```

En esta vista se puede ver el menu lateral, donde se pueden ver las opciones de tareas y archivos. Ademas, se puede ver la imagen de perfil del usuario logeado. En la parte inferior se encuentra el boton de cerrar sesion.

## BASE DE DATOS
La base de datos utilizada para la aplicacion fue **MySQL**. Se utilizo una base de datos publica en AWS para almacenar los datos de la aplicacion. La base de datos contiene las siguientes tablas:

```sql
CREATE DATABASE taskflow_cloud;

USE taskflow_cloud;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL, -- Debe almacenarse encriptada
    imagen_perfil_url TEXT
);

-- Tabla de tareas
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    completada BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de archivos
CREATE TABLE archivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    tipo_archivo VARCHAR(50),
    url_archivo TEXT NOT NULL,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);


CREATE TABLE userlogeado (
    id TINYINT NOT NULL DEFAULT 1,
    usuario_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);


INSERT INTO usuarios (nombre_usuario, correo, contrasena, imagen_perfil_url)
VALUES ('usuario1', 'usuario1@example.com', SHA2('123', 256), NULL);

INSERT INTO usuarios (nombre_usuario, correo, contrasena, imagen_perfil_url)
VALUES ('usuario2', 'usuario2@example.com', SHA2('123', 256), NULL);
    
```

Para fines de prueba tambien se insertaron unos usuarios de prueba.


## Servicios en la nube utilizados
Para este proyecto utilizamos dos servicios en la nube, **AWS** y **Azure**. A continuacion se describen los servicios utilizados en cada uno de ellos:

### Servicios de AWS

1. **IAM (Identity and Access Management):**  
    Se utilizó IAM para gestionar los permisos y roles necesarios para los servicios de AWS. Esto incluye la creación de roles para las instancias EC2, permisos para acceder a S3 y RDS, y políticas para garantizar la seguridad de los recursos.

2. **EC2 (Elastic Compute Cloud):**  
    Se desplegaron instancias EC2 para alojar las APIs REST desarrolladas en Python y Node.js. Estas instancias se configuraron con los entornos necesarios para ejecutar las aplicaciones y se aseguraron mediante grupos de seguridad.

3. **Load Balancer:**  
    Se implementó un Load Balancer para distribuir el tráfico entre las instancias EC2. Esto garantiza alta disponibilidad y balanceo de carga para las APIs REST, mejorando la experiencia del usuario.

4. **S3 (Simple Storage Service):**  
    Se utilizó S3 para almacenar los archivos subidos por los usuarios. Este servicio proporciona almacenamiento escalable y seguro, además de permitir la integración con otros servicios de AWS.

5. **RDS (Relational Database Service):**  
    La base de datos MySQL se alojó en RDS para garantizar alta disponibilidad, escalabilidad y facilidad de administración. Esto permitió centralizar los datos de usuarios, tareas y archivos.

6. **Lambda:**  
    Se utilizaron funciones Lambda para tareas específicas, como procesar eventos relacionados con la subida de archivos o ejecutar tareas en segundo plano. Esto permitió reducir la carga en las instancias EC2.

7. **API Gateway:**  
    API Gateway se utilizó para exponer las APIs REST de manera segura y escalable. Este servicio permitió gestionar las solicitudes entrantes, aplicar políticas de seguridad y realizar transformaciones de datos si era necesario.


### Servicios de Azure
1. **Azure VM (Virtual Machines):**  
    Se utilizaron máquinas virtuales en Azure para alojar las APIs REST desarrolladas en Python y Node.js. Estas VMs se configuraron con los entornos necesarios para ejecutar las aplicaciones y se aseguraron mediante reglas de red y grupos de seguridad.

2. **Azure Load Balancer:**  
    Se implementó un Azure Load Balancer para distribuir el tráfico entre las máquinas virtuales. Esto garantizó alta disponibilidad y balanceo de carga para las APIs REST, mejorando la experiencia del usuario y asegurando la continuidad del servicio.

3. **Azure Blob Storage:**  
    Azure Blob Storage se utilizó para almacenar los archivos subidos por los usuarios. Este servicio proporciona almacenamiento escalable y seguro, además de permitir la integración con otros servicios de Azure, como Azure Functions.

4. **Azure Functions:**  
    Se utilizaron Azure Functions para tareas específicas, como procesar eventos relacionados con la subida de archivos o ejecutar tareas en segundo plano. Esto permitió reducir la carga en las máquinas virtuales y aprovechar un modelo de computación sin servidor.

5. **Azure API Management:**  
    Azure API Management se utilizó para exponer las APIs REST de manera segura y escalable. Este servicio permitió gestionar las solicitudes entrantes, aplicar políticas de seguridad, realizar transformaciones de datos y monitorear el uso de las APIs.


## Conclusiones
- La implementación de la aplicación en ambos proveedores de servicios en la nube permitió a los estudiantes comprender las diferencias y similitudes entre AWS y Azure, así como las complejidades asociadas con cada uno.
- Se destacó la importancia de la gestión de identidades y accesos, así como la seguridad en la nube, al utilizar servicios como IAM en AWS.



