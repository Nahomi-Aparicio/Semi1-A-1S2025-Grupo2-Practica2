import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Principal.css"; 
import ArchivosSection from "../components/ArchivosSection";


import TaskSection from "../components/TaskSection";
const Principal = () => {

  const [activeContent, setActiveContent] = useState('TAREAS');

  const handleClick = (content) => {
    setActiveContent(content === activeContent ? activeContent : content);   };

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

          
          <div className="footer">
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
