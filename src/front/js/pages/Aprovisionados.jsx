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
  }, []);

  return (
    <div className="container">
      <h2>Servicios Aprovisionados del Mes</h2>
      {newServices.length > 0 ? (
        <ul>
          {newServices.map((service) => (
            <li key={service.id}>
              Dominio:{service.dominio} - Servicio: {service.tipo_servicio} - Fecha: {service.created_at}
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