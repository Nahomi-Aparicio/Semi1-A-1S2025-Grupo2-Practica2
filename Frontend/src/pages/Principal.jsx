import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Principal.css"; // Asegúrate de tener tus estilos adicionales aquí si es necesario

const Principal = () => {
  // Estado para gestionar qué contenido se debe mostrar
  const [activeContent, setActiveContent] = useState(null);

  // Función para manejar el clic en el menú
  const handleClick = (content) => {
    setActiveContent(content === activeContent ? null : content); // Cambia el contenido visible
  };

  return (
    <div className="wrapper d-flex align-items-center">     
      <nav id="sidebar">
        <div className="p-4 pt-5">          
          <a  className="img logo rounded-circle mb-5" style={{ backgroundImage: "url('https://i.pinimg.com/736x/0a/32/86/0a32866eb3bbed287809dbda147189bd.jpg')" }}>
          </a>
          <h3>TaskFlow + CloudDrive
            </h3>

          <ul className="list-unstyled components mb-5">
            <li>
              <a href="#" onClick={() => handleClick("hello")}>
              TAREAS
              </a>
            </li>
            <li>
              <a href="#" onClick={() => handleClick("files")}>
                ARCHIVOS
              </a>
            </li>
          </ul>

          
          <div className="footer">
            <p>
              Copyright &copy;
              <script>document.write(new Date().getFullYear());</script> All rights reserved
            </p>
          </div>
        </div>
      </nav>

      <div id="content" className="p-4 p-md-5">
        <h2 className="mb-4">Sidebar #01</h2>
        <p>Este es el contenido de la página principaffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffl</p>
        {activeContent === "hello" && (
          <div>
            <p>esto es un hola lalallala</p>
          </div>
        )}
        {activeContent === "files" && (
          <div>
            <p>aqui puedes ver tus archivos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Principal;
