import React, { useState, useEffect } from 'react';

const CardArchivos = ({ id, nombre, archivo }) => {
  const [imgSrc, setImgSrc] = useState('');
  const textStyle = {};

  useEffect(() => {
    console.log(archivo, nombre, id);
   
    // Obtener el tipo de archivo
    const fileType = archivo.split('/')[0]; // "application" o "image"

    if (fileType === 'image' ) {
      setImgSrc('https://i.pinimg.com/736x/df/22/13/df2213c30f4397e9292e20f99583f304.jpg'); 

    } else  {
      
      setImgSrc('https://i.pinimg.com/736x/7d/3e/1c/7d3e1c075ba161cd833e783629d2a6a9.jpg');
    }
  }, [archivo]); 

  return (
    <div className="card" style={{ width: '16rem', margin: '20px', height: '18rem',justifyItems: 'center', alignItems: 'center' }}>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {imgSrc && (
          <img
            src={imgSrc}
            className="card-img-top"
            alt={`Icono de ${archivo}`}
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
        )}
        <h5 className="card-title" style={{ color: '#093443', fontWeight: 'bold', fontSize: '15px', ...textStyle }}>
          {nombre}
        </h5>
      </div>
    </div>
  );
};

export default CardArchivos;