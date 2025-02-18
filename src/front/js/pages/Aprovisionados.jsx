import React, { useEffect, useContext } from 'react';
import { Context } from '../store/appContext';

const Aprovisionados = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getNewServicesCurrentMonth();
  }, []);

  const filteredNewServices = store.newServicesCurrentMonth.filter(service => service.estado_servicio === 'Nuevo');
  const filteredReaprovServices = store.newServicesCurrentMonth.filter(service => service.estado_servicio === 'Reaprovisionado');
  const filteredRetiredServices = store.newServicesCurrentMonth.filter(service => service.estado_servicio === 'Retirado');
  
  return (
  <>
    <div className="container">
      <h2>Servicios Aprovisionados</h2>
      {filteredNewServices && filteredNewServices.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Tipo de Servicio</th>
                <th>Dominio</th>
                <th>Estado</th>
                <th>Hostname</th>
                <th>Razón Social</th>
              </tr>
            </thead>
            <tbody>
              {filteredNewServices.map((service, index) => (
                <tr key={index}>
                  <td>{service.tipo_servicio}</td>
                  <td>{service.dominio}</td>
                  <td>{service.estado}</td>
                  <td>{service.hostname}</td>
                  <td>{service.razon_social}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No hay servicios aprovisionados.</p>
      )}



<h2>Servicios Reaprovisionados</h2>
      {filteredReaprovServices && filteredReaprovServices.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Tipo de Servicio</th>
                <th>Dominio</th>
                <th>Estado</th>
                <th>Hostname</th>
                <th>Razón Social</th>
              </tr>
            </thead>
            <tbody>
              {filteredReaprovServices.map((service, index) => (
                <tr key={index}>
                  <td>{service.tipo_servicio}</td>
                  <td>{service.dominio}</td>
                  <td>{service.estado}</td>
                  <td>{service.hostname}</td>
                  <td>{service.razon_social}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No hay servicios Reaprovisionados.</p>
      )}

<h2>Servicios Retirados</h2>
      {filteredRetiredServices && filteredRetiredServices.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Tipo de Servicio</th>
                <th>Dominio</th>
                <th>Estado</th>
                <th>Hostname</th>
                <th>Razón Social</th>
              </tr>
            </thead>
            <tbody>
              {filteredRetiredServices.map((service, index) => (
                <tr key={index}>
                  <td>{service.tipo_servicio}</td>
                  <td>{service.dominio}</td>
                  <td>{service.estado}</td>
                  <td>{service.hostname}</td>
                  <td>{service.razon_social}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No hay servicios Retirados.</p>
      )}


    </div>
    </>
  );
};

export default Aprovisionados;
