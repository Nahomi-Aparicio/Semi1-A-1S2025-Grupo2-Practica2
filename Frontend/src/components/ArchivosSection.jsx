import React, { useState, useEffect } from 'react';
import CardArchivos from "./CardArchivos";
import './style.css';
import API_BASE_URL  from '../config';

const ArchivosSection = () => {
  const [usuario, setUsuario] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // Para manejar el archivo seleccionado
  const [uploadUrl, setUploadUrl] = useState(""); // Para almacenar la URL del archivo subido
  const [error, setError] = useState(""); // Para mostrar mensajes de error

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
        setUsuario(data.id);
        
      } catch (error) {
        alert(`Hubo un problema con el servidor: ${error.message}`);
      }
    };

    

    getuser();
    archivos();
  }, []);

  const archivos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/archivos`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setTasks(data.archivos || []);
      
    } catch (error) {
      console.error("Error en archivos:", error);
      alert(`Hubo un problema con el servidor: ${error.message}`);
    }
  };

  // Función para convertir el archivo a Base64
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

  // Función para manejar la subida del archivo
  const handleUpload = async () => {
    if (!selectedFile) return alert("Por favor selecciona un archivo.");

    const fileType = selectedFile.type;
    let uploadUrl = "";

    // Validación del tipo de archivo
    if (fileType.startsWith("image/")) {
      uploadUrl = "https://s4dhs0pk34.execute-api.us-east-2.amazonaws.com/subir"; // URL para imágenes
    } else if (fileType === "text/plain") {
      uploadUrl = "https://s4dhs0pk34.execute-api.us-east-2.amazonaws.com/subir/subirarchivo"; // URL para archivos de texto
    } else {
      setError("Tipo de archivo no permitido. Solo se permiten imágenes y archivos de texto.");
      return;
    }

    // Si es una imagen o texto, proceder con la subida
    try {
      // Convertir el archivo a Base64
      const base64File = await toBase64(selectedFile);

      // Preparar el payload para la subida
      const payload = {
        file: base64File,
        filename: selectedFile.name,
      };

      // Subir el archivo a API Gateway
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.body) {
        const parsedBody = JSON.parse(data.body);
        if (parsedBody.url) {
          setUploadUrl(parsedBody.url); // Obtener la URL del archivo subido
          setError(""); // Limpiar mensaje de error si la subida es exitosa
        } else {
          setError("Hubo un problema al obtener la URL del archivo.");
        }
      } else {
        setError("Hubo un error al subir el archivo.");
      }
    } catch (error) {
      console.error("Error en la subida:", error);
      setError("Hubo un problema con la subida del archivo.");
    }
  };

  // Función para manejar la subida del archivo al backend
  const archivossubir = async () => {
    if (!selectedFile || !uploadUrl) return;

    const formData = {
      usuario_id: usuario,
      archivo_url: uploadUrl, // Usamos la URL obtenida desde la API Gateway
      nombre_archivo: selectedFile.name,
      tipo_archivo: selectedFile.type,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/archivos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      alert("Archivo subido con éxito");
      archivos();
      //recargamos la pagina
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Hubo un problema con el servidor.");
    }
  };

  return (
    <div style={{ marginLeft: "-200px", padding: "20px", width: "1650px", height: "884px" }}>
      <h2 style={{ textAlign: "center", color: "#aa5148", fontWeight: 'bold', fontSize: '35px' }}>SECCION DE ARCHIVOS</h2>

      {/* File input y validación */}
      <div className="file-input-wrapper">
        <input
          type="file"
          id="file"
          onChange={(e) => {
            const file = e.target.files[0];
            setSelectedFile(file); // Guardamos el archivo seleccionado
            if (file) {
              document.querySelector('.file-input-name').textContent = `Nombre: ${file.name} | Tipo: ${file.type}`;
              setError(""); // Limpiar cualquier error al seleccionar un archivo
            } else {
              document.querySelector('.file-input-name').textContent = "Ningún archivo seleccionado";
              setError(""); // Limpiar cualquier error si no hay archivo seleccionado
            }
          }}
        />
        <label htmlFor="simple-file-upload" className="file-input-btn">
          Seleccionar archivo
        </label>
        <div className="file-input-name">Ningún archivo seleccionado</div>
      </div>

      {/* Mostrar mensaje de error si lo hay */}
      {error && <div style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</div>}

      {/* Botón para subir el archivo */}
      <button
        onClick={handleUpload}
        style={{ display: 'block', margin: '20px auto', backgroundColor: '#093443', color: 'white' }}
      >
        Subir Archivo
      </button>

      {/* Mostrar URL del archivo subido */}
      {uploadUrl && (
        <p>
          Archivo subido: <a href={uploadUrl} target="_blank" rel="noopener noreferrer">{uploadUrl}</a>
        </p>
      )}

      {/* Mostrar botón para registrar archivo solo si la URL está disponible */}
      {uploadUrl && (
        <button
          onClick={archivossubir}
          style={{ display: 'block', margin: '20px auto', backgroundColor: '#093443', color: 'white' }}
        >
          Registrar Archivo
        </button>
      )}

      {/* Mostrar los archivos existentes */}
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
      >
        {tasks.map((task) => (
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
