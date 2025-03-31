import React, { useState } from "react";
import CardArchivos from "./CardArchivos";
import './style.css';

const ArchivosSection = () => {
 


  const tasks = [
    { id: 1, nombre: "Gol", archivo:'pdf' },
    { id: 2, nombre: "Gol", archivo:'pdf' },
    { id: 3, nombre: "Gol", archivo:'img' },
    { id: 1, nombre: "Gol", archivo:'pdf' },
    { id: 2, nombre: "Gol", archivo:'pdf' },
    { id: 3, nombre: "Gol", archivo:'img' }, { id: 1, nombre: "Gol", archivo:'pdf' },
    { id: 2, nombre: "Gol", archivo:'pdf' },
    { id: 3, nombre: "Gol", archivo:'img' }, { id: 1, nombre: "Gol", archivo:'pdf' },
    { id: 2, nombre: "Gol", archivo:'pdf' },
    { id: 3, nombre: "Gol", archivo:'img' },

  ];


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
   
      const fileName = e.target.files[0]?.name || 'Ningún archivo seleccionado';
      document.querySelector('.file-input-name').textContent = fileName;
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
          nombre={task.nombre}
          archivo={task.archivo}
         
        />
      ))}
    </div>


    </div>
  );
};

export default ArchivosSection;
