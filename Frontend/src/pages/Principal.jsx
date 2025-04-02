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
