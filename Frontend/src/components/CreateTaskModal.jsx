import React from 'react';

const CreateTaskModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // Si el modal no está abierto, no se renderiza.

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Crear Nueva Tarea</h2>

        <input type="text" placeholder="Título de la tarea" style={styles.input} />
        <textarea placeholder="Descripción de la tarea" style={styles.textarea} />
        <input type="datetime-local" style={styles.input} />

        <div style={styles.buttonContainer}>
          <button style={styles.createButton}>Crear</button>
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
