import { useState } from "react";
import "./style.css";
import { useNavigate } from 'react-router-dom';

import API_BASE_URL  from '../config';

const LoginPage = () => {

  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usuario, setUsuario] = useState("");
  const [imagen, setImagen] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    console.log(usuario);
    console.log(password);

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username:usuario, password:password })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Ingreso exitoso", data);
            navigate('/principal');
        } else {
            alert(data.message || "Usuario o contraseña incorrecta");
        }
    } catch (error) {
        console.error("Error en la autenticación:", error);
        alert("Hubo un problema con el servidor");
    }
};



  const Registrar = () => {
    console.log("Email: ", email);
    console.log("Password: ", password);
    console.log("Usuario: ", usuario);
    console.log("Imagen: ", imagen);
    console.log("Confirmar Password: ", confirmarPassword);


    

  }





  return (
    <div className={`container ${isActive ? "active" : ""}`} id="container">
      <div className="form-container sign-up">
        <form>
        <h1>Registrase</h1>
          <input type="text" placeholder="Usuario"id="Usuario"value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          <input type="text" placeholder="Email" id="Imagen"value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" id="Imagen"value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirmar Password" value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} />
          <input type="text" placeholder="Imagen"  id="Imagen"value={imagen} onChange={(e) => setImagen(e.target.value)} />

          <button type="button"onClick={Registrar} >Registrar</button>
        </form>
      </div>

      <div className="form-container sign-in">
        <form>
          <h1>Iniciar Sesion</h1>
         
          <span>Introduce tu correo y contraseña</span>
          <br></br>
          <input type="text" placeholder="Usuario" id="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          <input type="password" placeholder="Password" id="Password"value={password} onChange={(e) => setPassword(e.target.value)} />
          <br></br>
          <button type="button"onClick={login}>Iniciar Sesion</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Bienvenido!</h1>
            <p>Si ya tienes una cuenta porfavor inicia sesion</p>
            <button className="hidden" onClick={() => setIsActive(false)}>Iniciar Sesion</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>si no tienes cuenta porfavor registrate aqui</p>
            <button className="hidden" onClick={() => setIsActive(true)}>Registrarse</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
