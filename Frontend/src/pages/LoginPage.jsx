import { useState } from "react";
import "./style.css";
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usuario, setUsuario] = useState("");
  const [imagen, setImagen] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const navigate = useNavigate();

  // =========================
  // FUNCIONES
  // =========================

  // Convertir archivo a base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });

  // Subir archivo a API Gateway
  const handleFileUpload = async (file) => {
    if (!file) return alert("Seleccione un archivo");

    try {
      const base64File = await toBase64(file);
      const payload = {
        file: base64File,
        filename: file.name
      };

      const response = await fetch('https://s4dhs0pk34.execute-api.us-east-2.amazonaws.com/subir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      const parsedBody = data.body ? JSON.parse(data.body) : data;

      if (parsedBody.url) {
        setImagen(parsedBody.url); // ✅ Guardamos la URL devuelta
        setUploadMessage("Archivo subido correctamente");
        // limpiamos el input de archivo
        setSelectedFile(null);
        console.log("Archivo subido:", parsedBody.url);
      } else {
        setUploadMessage("Error al subir el archivo: " + parsedBody.message);
        console.error(parsedBody);
      }
    } catch (error) {
      console.error("Error en la subida:", error);
      setUploadMessage("Error en la subida: " + error.message);
    }
  };

  // Login
  const login = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usuario, password: password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Ingreso exitoso", data);
        setPassword("");
        setEmail("");
        setUsuario("");
        navigate('/principal');
      } else {
        alert(data.message || "Usuario o contraseña incorrecta");
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      alert("Hubo un problema con el servidor");
    }
  };

  // Registro
  const Registrar = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/registraruser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usuario, email: email, password: password, confirmpassword: confirmarPassword, imagen: imagen })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registro exitoso", data);
        setPassword("");
        setEmail("");
        setUsuario("");
        setImagen("");
        setConfirmarPassword("");
        setUploadMessage("");

        alert(data.message || "Registro exitoso");
      } else {
        alert(data.message || "Datos inválidos o usuario existente");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Hubo un problema con el servidor");
    }
  };

  // =========================
  // VISTA
  // =========================

  return (
    <div className={`container ${isActive ? "active" : ""}`} id="container">

      {/* Formulario de Registro */}
      <div className="form-container sign-up">
        <form>
          <h1>Registrarse</h1>
          <input type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirmar Password" value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} />

          {/* Input de archivo */}
          <input
            type="file"
            accept="image/*,.txt"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                const file = e.target.files[0];
                setSelectedFile(file);
                handleFileUpload(file);
              }
            }}
          />

          {/* Mensaje de subida */}
          {uploadMessage && <p>{uploadMessage}</p>}

          <button type="button" onClick={Registrar}>Registrar</button>
        </form>
      </div>

      {/* Formulario de Login */}
      <div className="form-container sign-in">
        <form>
          <h1>Iniciar Sesión</h1>
          <span>Introduce tu usuario y contraseña</span>
          <input type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" onClick={login}>Iniciar Sesión</button>
        </form>
      </div>

      {/* Toggle */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>¡Bienvenido!</h1>
            <p>Si ya tienes una cuenta por favor inicia sesión</p>
            <button className="hidden" onClick={() => setIsActive(false)}>Iniciar Sesión</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>¡Hola, Amigo!</h1>
            <p>Si no tienes cuenta por favor regístrate aquí</p>
            <button className="hidden" onClick={() => setIsActive(true)}>Registrarse</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
