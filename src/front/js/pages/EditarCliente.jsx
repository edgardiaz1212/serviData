import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditarCliente = () => {
  const { clientId } = useParams();
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      const client = await actions.getClientById(clientId);
      setClientData(client);
    };
    fetchClientData();
  }, [clientId, actions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    try {
        const numericClientId = Number(clientId); // Convertir clientId a número
        if (isNaN(numericClientId)) {
          throw new Error("Invalid client ID. It must be a number.");
        }
        const result = await actions.updateClientData(numericClientId, clientData);
        if (result.error) {
          throw new Error(result.message);
        }
        toast.success('Cliente actualizado con éxito');
        navigate(`/detalle-cliente/${clientId}`);
      } catch (error) {
        toast.error('Error al actualizar el cliente');
        console.error(error);
      }
    };

  if (!clientData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Editar Cliente</h2>
      <div className="mb-3">
        <label htmlFor="razon_social" className="form-label">Razón Social</label>
        <input
          type="text"
          className="form-control"
          id="razon_social"
          name="razon_social"
          value={clientData.razon_social}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="rif" className="form-label">RIF</label>
        <input
          type="text"
          className="form-control"
          id="rif"
          name="rif"
          value={clientData.rif}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="tipo" className="form-label">Tipo</label>
        <input
          type="text"
          className="form-control"
          id="tipo"
          name="tipo"
          value={clientData.tipo}
          onChange={handleChange}
        />
      </div>
      <button className="btn btn-primary mt-3" onClick={handleSave}>
        Guardar
      </button>
      <button className='btn btn-secondary mt-3 ms-2' onClick={() => navigate(`/detalle-cliente/${clientId}`)}>Regresar</button>
        
      <ToastContainer />
    </div>
  );
};

export default EditarCliente;