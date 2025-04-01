from flask import Flask, request, jsonify
from flask_cors import CORS
from acciones_bd import logearme

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    #Obtenemos del json el username y password
    username = request.json.get('username')
    password = request.json.get('password')
    #Validamos que el username y password no sean nulos 
    if not username or not password:
        return jsonify({'error': 'Usuario o contraseña no pueden ser vacíos.'}), 400
    
    log=logearme(username, password)
    if log:
        return jsonify({'message': 'Login exitoso'}), 200
    elif log is None:
        return jsonify({'error': 'Ya hay un usuario logeado.'}), 400
    else:
        return jsonify({'error': 'Usuario o contraseña incorrectos.'}), 401
    

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)