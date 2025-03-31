import React, { useState } from 'react';

const Card = ({ nombre, descripcion, fecha, completed }) => {
  const [showModal, setShowModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(completed);
  const [showModal1, setShowModal1] = useState(false);

  const ver = () => {
    setShowModal(true);
  };

  const Completar = () => {
    setIsCompleted(true);
  };

  const Desmarcar = () => {
    setIsCompleted(false);
  };

  const editar = () => {
    setShowModal1(true);
  };

  const textStyle = isCompleted ? { textDecoration: 'line-through', opacity: 0.6 , cursor: "not-allowed",} : {};
  const handleEditar = (e) => {
    if (isCompleted) {
      e.preventDefault(); 
      return;
    }
    editar(); 
  };
  

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
            <a className="card-link"  onClick={handleEditar}  style={{ color: '#f47a28', fontWeight: 'bold', fontSize: '15px', ...textStyle }}>Editar</a>
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
                <button style={{ padding: '5px 10px', backgroundColor: '#9c4541', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }} >
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

      {showModal1 && (
        <div className="modal" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '500px', textAlign: 'center' }}>
            <h2 style={{ color: '#093443', fontWeight: 'bold', fontSize: '35px' }}>{nombre}</h2>
            <h3 style={{ fontWeight: 'bold', fontSize: '25px' }}>{fecha}</h3>
            <p style={{ fontWeight: 'bold', fontSize: '20px', color: '#555' }}>{descripcion}</p>

           
              <div className="col-4">
                <button onClick={() => setShowModal1(false)} style={{ padding: '5px 10px', backgroundColor: 'rgb(202, 135, 58)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                  Cerrar
                </button>
              </div>
           
          </div>
        </div>
      )}



    </>
  );
};

export default Card;
