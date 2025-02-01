import React, { useState } from 'react';
import TotalCLient from '../component/TotalCLient.jsx';

function Clientes() {
  const [clientType, setClientType] = useState('Privada');

  const handleClientTypeChange = (event) => {
    setClientType(event.target.id === 'btnradio1' ? 'Privada' : 'Publica');
  };

  return (
    <>
      <div className='container'>
        <h1>Clientes</h1>
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" checked={clientType === 'Privada'} onChange={handleClientTypeChange} />
          <label className="btn btn-outline-primary" htmlFor="btnradio1">Privada</label>

          <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" checked={clientType === 'Publica'} onChange={handleClientTypeChange} />
          <label className="btn btn-outline-primary" htmlFor="btnradio2">Publica</label>
        </div>
        <TotalCLient clientType={clientType} />
      </div>
    </>
  );
}

export default Clientes;
