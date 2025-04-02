import React, { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";
import Card from "./Card";

const TaskSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

 
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  const tasks = [
    { id: 1, nombre: "Gol", descripcion: "Esta es una tarea", fecha: "19/02/2001", completed: false },
    { id: 2, nombre: "Gol", descripcion: "Esta es una tarea", fecha: "19/02/2001", completed: true },

  ];

  /*
  const Cretareas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          
      });

      const data = await response.json();

      if (response.ok) {
          console.log("Ingreso exitoso", data);
          

          

      } else {
          alert(data.message || "No hay tareas creadas");
      }
  } catch (error) {
      
      alert("Hubo un problema con el servidor");
  }
};
*/

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

      <h2 style={{ textAlign: "center", color: "#aa5148" ,fontWeight: 'bold', fontSize: '35px' }}>SECCION DE TAREAS</h2>

      <div>
        <button
          className="btn"
          onClick={toggleModal}
          style={{
            backgroundColor: "#0E2f4E",
            marginTop: "10px",
            width: "300px",
            color: "rgb(250, 240, 253)",
            fontWeight: "bold",
          }}
        >
          <i className="fa fa-plus fa-lg fa-inverse" aria-hidden="true"></i> Crear Tarea
        </button>
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
      >
        {tasks.map((task) => (
          <Card
            key={task.id}
            nombre={task.nombre}
            descripcion={task.descripcion}
            fecha={task.fecha}
            completed={task.completed}
          />
        ))}
      </div>

      <CreateTaskModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default TaskSection;
