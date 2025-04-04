import { useState, useRef } from "react";
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
  const [previewURL, setPreviewURL] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

  const fileInputRef = useRef(null); // Ref para el input file

  const navigate = useNavigate();

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });

  const handleUpload = async () => {
    if (!selectedFile) return alert("Seleccione un archivo");
    try {
      const base64File = await toBase64(selectedFile);
      const payload = {
        file: base64File,
        filename: selectedFile.name
      };

      const response = await fetch('https://s4dhs0pk34.execute-api.us-east-2.amazonaws.com/subir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      const parsedBody = data.body ? JSON.parse(data.body) : data;

      if (parsedBody.url) {
        setImagen(parsedBody.url); // Asignar URL al campo imagen
        setIsUploaded(true);
        setUploadMessage("Imagen subida correctamente ✅");
      } else {
        console.error("No se recibió URL desde API Gateway", parsedBody.message);
        setUploadMessage("Error: " + parsedBody.message);
      }
    } catch (error) {
      console.error("Error en la subida:", error);
      setUploadMessage("Error en la subida: " + error.message);
    }
  };

  const login = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: usuario, password: password })
      });

      const data = await response.json();

      if (response.ok) {
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

  const Registrar = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/registraruser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: usuario,
          email: email,
          password: password,
          confirmpassword: confirmarPassword,
          imagen: imagen
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Registro exitoso");

        // Limpiar formulario
        setPassword("");
        setEmail("");
        setUsuario("");
        setImagen("");
        setConfirmarPassword("");
        setSelectedFile(null);
        setPreviewURL("");
        setUploadMessage("");
        setIsUploaded(false);
        fileInputRef.current.value = ""; // 👈 limpiar input file
      } else {
        alert(data.message || "Hubo un error al registrar");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Hubo un problema con el servidor");
    }
  };

  return (
    <div className={`container ${isActive ? "active" : ""}`} id="container">
      <div className="form-container sign-up">
        <form>
          <h1>Registrarse</h1>
          <input type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirmar Password" value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} />
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.txt"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                const file = e.target.files[0];
                setSelectedFile(file);
                setIsUploaded(false);
                setUploadMessage("");
                const localURL = URL.createObjectURL(file);
                setPreviewURL(localURL);
              }
            }}
          />

          {previewURL && (
            <div>
              <img src={previewURL} alt="Preview" style={{ width: '100px', marginTop: '10px', borderRadius: '5px' }} />
            </div>
          )}

          <button type="button" onClick={handleUpload} style={{ marginTop: '10px' }}>
            Subir
          </button>

          {uploadMessage && <p>{uploadMessage}</p>}

          <button type="button" onClick={Registrar} disabled={!isUploaded} style={{ marginTop: '10px' }}>
            Registrar
          </button>
        </form>
      </div>

      <div className="form-container sign-in">
        <form>
          <h1>Iniciar Sesión</h1>
          <span>Introduce tu usuario y contraseña</span>
          <br />
          <input type="text" placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button type="button" onClick={login}>Iniciar Sesión</button>
        </form>
      </div>

      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Bienvenido!</h1>
            <p>Si ya tienes una cuenta por favor inicia sesión</p>
            <button className="hidden" onClick={() => setIsActive(false)}>Iniciar Sesión</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hola, Amigo!</h1>
            <p>Si no tienes cuenta por favor regístrate aquí</p>
            <button className="hidden" onClick={() => setIsActive(true)}>Registrarse</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
