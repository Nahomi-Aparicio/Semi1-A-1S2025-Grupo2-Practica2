from flask import Flask, request, jsonify
from flask_cors import CORS
from acciones_bd import (
    logearme, desloguear, crear_tarea, editar_tarea,
    registrarusuario, cargar_archivo, listar_archivos,
    obtener_usuario_logeado, completar_tarea, eliminar_tarea,
    obtenerinfologeado
)

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return jsonify({'message': 'API de tareas en funcionamiento en python'}), 200

@app.route('/login', methods=['POST'])
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

@app.route('/logout', methods=['GET'])
def logout():
    try:
        res = desloguear()
        if res:
            return jsonify({'message': 'Logout exitoso'}), 200
        else:
            return jsonify({'error': 'No hay usuario logeado.'}), 400
    except Exception as e:
        return jsonify({'error': 'Error al desloguear - ' + str(e)}), 400
    


@app.route('/getuser', methods=['GET'])
def get_user():
    try:
        respuesta=obtenerinfologeado()
        if respuesta:
            return jsonify(respuesta), 200
        else:
            return jsonify({'error': 'No hay usuario logeado.'}), 400
    except Exception as e:
        return jsonify({'error': 'Error al obtener información del usuario - ' + str(e)}), 400

@app.route('/registraruser', methods=['POST'])
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


#crear tareas
@app.route('/crear_tarea', methods=['POST'])
def crear_nueva_tarea():
    try:
        usuario_id = request.json.get('usuario_id')
        titulo = request.json.get('titulo')
        descripcion = request.json.get('descripcion')
        
        if not usuario_id or not titulo:
            return jsonify({'message': 'El usuario y el título son obligatorios'}), 400
        
        resultado = crear_tarea(usuario_id, titulo, descripcion)
        if resultado:
            return jsonify({'message': 'Tarea creada exitosamente'}), 201
        else:
            return jsonify({'message': 'No se pudo crear la tarea'}), 400
    except Exception as e:
        return jsonify({'message': 'Error al crear tarea - ' + str(e)}), 400

#editar tareas
@app.route('/crear_tarea/<int:tarea_id>', methods=['PATCH'])
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
    

@app.route('/archivos', methods=['POST'])
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

@app.route('/archivos', methods=['GET'])
def listar_archivos_endpoint():
    try:
        usuario_id = obtener_usuario_logeado()
        if not usuario_id:
            return jsonify({'error': 'No hay usuario logeado.'}), 401

        archivos = listar_archivos(usuario_id)
        if archivos:
            return jsonify({'archivos': archivos}), 200
        else:
            return jsonify({'message': 'No hay archivos disponibles.'}), 200
    except Exception as e:
        return jsonify({'error': 'Error al listar archivos - ' + str(e)}), 500
    
@app.route('/completar_tarea/<int:tarea_id>', methods=['PATCH'])
def completar_tarea_endpoint(tarea_id):
    try:
        result = completar_tarea(tarea_id)
        if result:
            return jsonify({'message': 'Tarea marcada como completada'}), 200
        else:
            return jsonify({'message': 'No se pudo marcar la tarea o no existe'}), 400
    except Exception as e:
        return jsonify({'message': 'Error al marcar tarea como completada - ' + str(e)}), 500


@app.route('/eliminar_tarea/<int:tarea_id>', methods=['DELETE'])
def eliminar_tarea_endpoint(tarea_id):
    try:
        result = eliminar_tarea(tarea_id)
        if result:
            return jsonify({'message': 'Tarea eliminada exitosamente'}), 200
        else:
            return jsonify({'message': 'No se pudo eliminar la tarea o no existe'}), 400
    except Exception as e:
        return jsonify({'message': 'Error al eliminar tarea - ' + str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)