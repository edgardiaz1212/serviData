import React, { useEffect, useContext, useState } from 'react';
import { Context } from '../store/appContext';

function Aprovisionados() {
  const { store, actions } = useContext(Context);
  const [newServices, setNewServices] = useState([]);

  useEffect(() => {
    const fetchNewServices = async () => {
      const services = await actions.getNewServices();
      setNewServices(services);
    };
    fetchNewServices();
  }, [actions]);

  return (
    <div className="container">
      <h2>Servicios Aprovisionados</h2>
      {newServices.length > 0 ? (
        <ul>
          {newServices.map((service) => (
            <li key={service.id}>
              {service.dominio} - {service.tipo_servicio} - {service.created_at}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay servicios nuevos aprovisionados.</p>
      )}
    </div>
  );
}

export default Aprovisionados;