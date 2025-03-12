import React, { useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';


const Aprovisionados = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [store.isAuthenticated, navigate]);


  useEffect(() => {
    actions.getNewServicesCurrentMonth();
  }, []);

  const filteredNewServices = store.newServicesCurrentMonth.filter(service => service.estado_servicio === 'Nuevo');
  const filteredReaprovServices = store.newServicesCurrentMonth.filter(service => service.estado_servicio === 'Reaprovisionado');
  const filteredRetiredServices = store.newServicesCurrentMonth.filter(service => service.estado_servicio === 'Retirado');
  
  
  return (
  <>

    <div className="container">
<h5>Datos del mes en curso</h5>

      <h2>Servicios Nuevos Aprovisionados</h2>
      {filteredNewServices && filteredNewServices.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Tipo de Servicio</th>
                <th>Dominio</th>
                
                <th>Hostname</th>
                <th>Razón Social</th>
                <th>Rif</th>
              </tr>
            </thead>
            <tbody>
              {filteredNewServices.map((service, index) => (
                <tr key={index}>
                  <td>{service.tipo_servicio}</td>
                  <td>{service.dominio}</td>
                 
                  <td>{service.hostname}</td>
                  <td>{service.cliente.razon_social}</td>
                  <td>{service.cliente.rif}</td>
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
                
                <th>Hostname</th>
                <th>Razón Social</th>
                <th>Rif</th>
              </tr>
            </thead>
            <tbody>
              {filteredReaprovServices.map((service, index) => (
                <tr key={index}>
                  <td>{service.tipo_servicio}</td>
                  <td>{service.dominio}</td>
                  
                  <td>{service.hostname}</td>
                  <td>{service.razon_social}</td>
                  <td>{service.cliente.rif}</td>
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
                
                <th>Hostname</th>
                <th>Razón Social</th>
                <th>Rif</th>
              </tr>
            </thead>
            <tbody>
              {filteredRetiredServices.map((service, index) => (
                <tr key={index}>
                  <td>{service.tipo_servicio}</td>
                  <td>{service.dominio}</td>
                  
                  <td>{service.hostname}</td>
                  <td>{service.razon_social}</td>
                  <td>{service.cliente.rif}</td>
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
