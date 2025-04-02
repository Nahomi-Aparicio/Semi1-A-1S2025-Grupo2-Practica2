import React, { useState, useEffect } from 'react';
import API_BASE_URL  from '../config';

const Card = ({id,nombre, descripcion, fecha, completed }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(completed);
  const [showEditModal, setShowEditModal] = useState(false);

  const ver = () => {
    setShowModal(true);
  };


  
  const editt = () => {
    setShowEditModal(true);
  };

  const Completar = async () => {

    try {
        const response = await fetch(`${API_BASE_URL}/completar_tarea/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (response.ok) {
          setIsCompleted(true);

            console.log("Tarea completada con éxito", data);
        } else {
            alert(data.message || "No se pudo completar la tarea");
        }
    } catch (error) {
        console.error("Error al completar la tarea:", error);
        alert("Hubo un problema con el servidor");
    }
};

  const Desmarcar = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/descompletar_tarea/${id}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json"
          }
      });

      const data = await response.json();

      if (response.ok) {
          console.log("Tarea desmarcada con éxito", data);
          setIsCompleted(false);
      } else {
          alert(data.message || "No se pudo completar la tarea");
      }
  } catch (error) {
      console.error("Error al completar la tarea:", error);
      alert("Hubo un problema con el servidor");
  }
  };

  // Estados para la edición
  const [editNombre, setEditNombre] = useState(nombre);
  const [editDescripcion, setEditDescripcion] = useState(descripcion);

  const editarTarea = async () => {
 
    try {
      const response = await fetch(`${API_BASE_URL}/crear_tarea/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          titulo: editNombre,
          descripcion: editDescripcion,
         
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Tarea editada con éxito");
        setShowEditModal(false);
        window.location.reload();
      } else {
        alert(data.message || "No se pudo editar la tarea");
      }
    } catch (error) {
      console.error("Error al editar la tarea:", error);
      alert("Hubo un problema con el servidor");
    }
  };


  const eliminar = async () => {
    try {
    
      const response = await fetch(`${API_BASE_URL}/eliminar_tarea/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        alert("Tarea eliminada con éxito");
        window.location.reload();
      } else {
        alert("No se pudo eliminar la tarea");
      }  
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      alert("Hubo un problema con el servidor");
    }
  };
   

  const textStyle = isCompleted ? { textDecoration: 'line-through', opacity: 0.6 , cursor: "not-allowed",} : {};
 

  return (
    <>
      <div className="card" style={{ width: '18rem', margin: '10px', height: '12rem', backgroundColor: 'rgb(180, 177, 177)' }}>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h5 className="card-title" style={{ color: '#093443', fontWeight: 'bold', fontSize: '25px', ...textStyle }}>{nombre}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary" style={{ fontWeight: 'bold', fontSize: '18px', ...textStyle }}>{fecha}</h6>
          <p
            className="card-text"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'white',
              fontSize: '18px',
              ...textStyle
            }}
          >
            {descripcion}
          </p>
          <div style={{ marginTop: 'auto' }}>
            <a className="card-link"  onClick={editt}
            style={{ color: '#f47a28', fontWeight: 'bold', fontSize: '15px', ...textStyle }}>Editar</a>
            <a className="card-link" onClick={ver} style={{ color: 'rgb(18, 85, 48)', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>Ver</a>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '500px', textAlign: 'center' }}>
            <h2 style={{ color: '#093443', fontWeight: 'bold', fontSize: '35px' }}>{nombre}</h2>
            <h3 style={{ fontWeight: 'bold', fontSize: '25px' }}>{fecha}</h3>
            <p style={{ fontWeight: 'bold', fontSize: '20px', color: '#555' }}>{descripcion}</p>

            <div className="row justify-content-evenly">
              {isCompleted ? (
                <div className="col-4">
                  <button onClick={Desmarcar} style={{ padding: '5px 10px', backgroundColor: ' #093443', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                    Desmarcar
                  </button>

                </div>
              ) : (
                <div className="col-4">
                  <button onClick={Completar} style={{ padding: '5px 10px', backgroundColor: ' #093443', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                    Marcar
                  </button>
                </div>
              )}

              <div className="col-4">
                <button  onClick={eliminar}style={{ padding: '5px 10px', backgroundColor: '#9c4541', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }} >
                  Eliminar
                </button>
              </div>
              <div className="col-4">
                <button onClick={() => setShowModal(false)} style={{ padding: '5px 10px', backgroundColor: 'rgb(202, 135, 58)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{showEditModal && (
  <div className="modal" style={{
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center'
  }}>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '20px', 
      borderRadius: '8px', 
      width: '500px', 
      textAlign: 'center' 
    }}>
      <h2>Editar Tarea</h2>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre:</label>
        <input 
          type="text" 
          value={editNombre} 
          onChange={(e) => setEditNombre(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd',backgroundColor: 'rgb(145, 142, 142)' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descripción:</label>
        <textarea 
          value={editDescripcion} 
          onChange={(e) => setEditDescripcion(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px',backgroundColor: 'rgb(145, 142, 142)'}}
        />
      </div>
     
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <button 
          onClick={editarTarea}
          style={{ 
            padding: '8px 15px', 
            backgroundColor: '#093443', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold' 
          }}
        >
          Guardar
        </button>
        <button 
          onClick={() => setShowEditModal(false)}
          style={{ 
            padding: '8px 15px', 
            backgroundColor: 'rgb(202, 135, 58)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold' 
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}



    </>
  );
};

export default Card;
