import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../store/appContext';

function DetalleCliente() {
  const { clientId } = useParams();
  const { actions } = useContext(Context);
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const services = await actions.getServicebyClient(clientId);
      console.log(services);
      setServicesData(services);
    };
    fetchServices();
  }, [clientId, actions]);

  return (
    <div className="container">
      <h3>Servicios del Cliente</h3>
      <ul className="list-group">
        {servicesData.length > 0 ? (
          servicesData.map((service, index) => (
            <div key={index} className="list-group-item list-group-item-action">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{service.nombre_servicio}</h5>
              </div>
              <p className="mb-1">Descripción: {service.hostname}</p>
            </div>
          ))
        ) : (
          <li className="list-group-item">No hay servicios registrados para este cliente.</li>
        )}
      </ul>
      <button className="btn btn-secondary" onClick={() => window.history.back()}>Regresar</button>
    </div>
  );
}

export default DetalleCliente;