import React, { useState } from 'react';
import { Search } from 'lucide-react'
import TotalClient from '../component/TotalCLient.jsx'; // Asegúrate de que la ruta sea correcta
import BB8Button from '../component/BB8Button.jsx';
import "../../styles/clientes.css"
const Clientes = () => {
  const [clientType, setClientType] = useState('Privada');
  const [searchQuery, setSearchQuery] = useState('');

  const handleClientTypeChange = (event) => {
    setClientType(event.target.id === 'btnradio1' ? 'Privada' : 'Publica');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className='container vh-100'>
      <h1>Clientes</h1>
      <h5>Selecciona para detalles</h5>
      {/* <BB8Button/> */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" checked={clientType === 'Privada'} onChange={handleClientTypeChange} />
          <label className="btn btn-outline-primary" htmlFor="btnradio1">Privada</label>

          <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" checked={clientType === 'Publica'} onChange={handleClientTypeChange} />
          <label className="btn btn-outline-primary" htmlFor="btnradio2">Publica</label>
        </div>
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <div className="input-group-text" id="btnGroupAddon"><Search /></div>
          <input type="text" className="form-control" placeholder="Busqueda" aria-label="Input group example" aria-describedby="btnGroupAddon" value={searchQuery} onChange={handleSearchChange} />
        </div>
      </div>
      <TotalClient clientType={clientType} searchQuery={searchQuery} />
    </div>
  );
};

export default Clientes;