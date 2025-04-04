import React, { useState, useEffect } from 'react';
import CardArchivos from "./CardArchivos";
import './style.css';
import API_BASE_URL  from '../config';

const ArchivosSection = () => {
 


 

  const [usuario, setUsuario] = useState(null);
  const [tasks, setTasks] = useState([]);


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
        console.log(data.id);
        setUsuario(data.id);
        
    } catch (error) {
        alert(`Hubo un problema con el servidor: ${error.message}`);
    }
  };

  const archivos = async () => {
    try {
      
        const response = await fetch(`${API_BASE_URL}/archivos`, {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
          },
        });
       

        const data = await response.json();
        console.log(data, "archivos");

        if (data.archivos) {
          
    
      setTasks(data.archivos);
    } 
       
        
    } catch (error) {
        console.error("Error en logout:", error);
        alert(`Hubo un problema con el servidor: ${error.message}`);
    }
};
archivos();
getuser();
}, []);


const archivossubir = async (file) => {
  try {
      if (!file) {
          alert("Por favor, selecciona un archivo.");
          return;
      }

      const formData = {
          usuario_id: usuario,
          archivo_url: 'https://i.pinimg.com/736x/8b/69/d6/8b69d6444596d4741c3d9182c62f9d3b.jpg',
          nombre_archivo: file.name,
          tipo_archivo: file.type,
      };

      const response = await fetch(`${API_BASE_URL}/archivos`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
      });

      if (!response.ok) {
          throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      alert("Archivo subido con éxito");
  } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Hubo un problema con el servidor");
  }
};


  const css = `
    .hide-scrollbar {
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  `;

  return (
    <div
      style={{
        marginLeft: "-200px",
        padding: "20px",
        width: "1650px",
        height: "884px",
      }}
    >
      <style>{css}</style>

      <h2 style={{ textAlign: "center", color: "#aa5148" ,fontWeight: 'bold', fontSize: '35px' }}>SECCION DE ARCHIVOS</h2>

      <div className="file-input-wrapper">
      <input 
    type="file" 
    id="file"
    onChange={(e) => {
        const file = e.target.files[0]; // Obtiene el archivo seleccionado
        if (file) {
            document.querySelector('.file-input-name').textContent = `Nombre: ${file.name} | Tipo: ${file.type}`;
            archivossubir(file); // Llamar la función para subir archivo
        } else {
            document.querySelector('.file-input-name').textContent = "Ningún archivo seleccionado";
        }
    }}
/>

  <label htmlFor="simple-file-upload" className="file-input-btn">
    Seleccionar archivo
  </label>
  <div className="file-input-name">Ningún archivo seleccionado</div>
</div>

      
      <div
        className="hide-scrollbar"
        style={{
          height: "750px",
          maxHeight: "750px",
          overflowY: "auto", 
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "1px",
          marginTop: "20px",
        }}
      > {tasks.map((task) => (
        <CardArchivos
        key={task.id}  
        id={task.id}  
        nombre={task.nombre_archivo}  
        archivo={task.tipo_archivo}  
        url={task.url_archivo}
      
        />
      ))}
    </div>


    </div>
  );
};

export default ArchivosSection;
