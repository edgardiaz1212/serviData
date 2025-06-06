import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { Search } from 'lucide-react'
import TotalClient from '../component/TotalCLient.jsx'; // Asegúrate de que la ruta sea correcta
import "../../styles/clientes.css"
import {UsersRound} from 'lucide-react';
const Clientes = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [store.isAuthenticated, navigate]);

  const [clientType, setClientType] = useState('Privada');
  const [searchQuery, setSearchQuery] = useState('');

  const handleClientTypeChange = (event) => {
    setClientType(event.target.id === 'btnradio1' ? 'Privada' : 'Pública');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className='container'>
      <h1><UsersRound /> Clientes</h1>
      <p>Visualice y gestione los clientes registrados. Filtre por tipo (Privada/Pública) y utilice la búsqueda para encontrar clientes específicos.</p>
      <h5>Selecciona para detalles</h5>
     
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" checked={clientType === 'Privada'} onChange={handleClientTypeChange} />
          <label className="btn btn-outline-primary" htmlFor="btnradio1">Privada</label>

          <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" checked={clientType === 'Pública'} onChange={handleClientTypeChange} />
          <label className="btn btn-outline-primary" htmlFor="btnradio2">Pública</label>
        </div>
        <div className="input-group" style={{ maxWidth: '250px' }}>
          <div className="input-group-text" id="btnGroupAddon"><Search /></div>
          <input type="text" className="form-control" placeholder="Razon Social o RIF" aria-label="Input group example" aria-describedby="btnGroupAddon" value={searchQuery} onChange={handleSearchChange} />
        </div>
      </div>
      <TotalClient clientType={clientType} searchQuery={searchQuery} />
    </div>
  );
};

export default Clientes;
