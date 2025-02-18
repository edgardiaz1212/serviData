import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";

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
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Aprovisionados del Mes</h5>
          <p className="card-text text-end">dato</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Aprovisionados del Mes pasado</h5>
          <p className="card-text text-end">dato</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Reprovisionados del Mes</h5>
          <p className="card-text text-end">dato</p>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Retirados del Mes</h5>
          <p className="card-text text-end">dato</p>
        </div>
      </div>

      <h2>Clientes Aprovisionados</h2>
      {newServices.length > 0 ? (
        <ul>
          {newServices.map((service) => (
            <li key={service.id}>
              Dominio:{service.dominio} - Servicio: {service.tipo_servicio} -
              Fecha: {service.created_at}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay servicios nuevos aprovisionados.</p>
      )}

<h2>Clientes Reaprovisionados</h2>


<h2>Clientes Retirados</h2>
    </div>
  );
}

export default Aprovisionados;
