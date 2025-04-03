
import React, { useState, useEffect } from 'react';
import API_BASE_URL  from '../config';

const CreateTaskModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Si el modal no está abierto, no se renderiza.



  const [Título, setTítulo] = useState("");
  const [Descripción, setDescripción] = useState("");
  const [datetime, setdatetime] = useState(new Date().toISOString().slice(0, 16));
  const [Usuario, setUsuario] = useState(null);
 
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

getuser();
}, []);

const crear_tarea = async () => {
  if (!Usuario) {
    alert("El usuario no ha sido cargado aún.");
    return;
  }

  if (datetime === "") {
    const currentDateTime = new Date().toISOString().slice(0, 16);
    setdatetime(currentDateTime);
  }
  console.log(datetime);

  try {
    const formData = {
      usuario_id: Usuario,
      titulo: Título,
      descripcion: Descripción,
      fecha_creacion: datetime
    };

    const response = await fetch(`${API_BASE_URL}/crear_tarea`, {
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
    alert("Tarea Escrita con éxito");
    
    setTítulo("");
    setDescripción("");
    setdatetime("");
    onClose(); 
  } catch (error) {
    alert("Hubo un problema con el servidor");
  }
};




  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Crear Nueva Tarea</h2>

        <input type="text" placeholder="Título de la tarea" id="Título"value={Título}onChange={(e) => setTítulo(e.target.value)} style={styles.input} />
        <textarea placeholder="Descripción de la tarea"  id="Descripción"value={Descripción} onChange={(e) => setDescripción(e.target.value)}style={styles.textarea} />
        <input type="datetime-local" id="datetime"value={datetime}  style={styles.input}onChange={(e) => setdatetime(e.target.value)} />

        <div style={styles.buttonContainer}>
          <button style={styles.createButton} onClick={() => crear_tarea() }> Crear</button>
          <button style={styles.cancelButton} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center'
  },
  title: {
    marginBottom: '15px',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    minHeight: '80px'
  },
  buttonContainer: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default CreateTaskModal;
