import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../store/appContext';


function DetalleCliente() {
  const { clientId } = useParams();
  const { actions } = useContext(Context);
  const [clientData, setClientData] = useState(null);
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    const fetchClientAndServices = async () => {
      const client = await actions.getClientById(clientId);
      setClientData(client);
      const services = await actions.getServicebyClient(clientId);
      setServicesData(services);
    };
    fetchClientAndServices();
  }, [clientId, actions]);

  const renderServiceDetail = (label, value) => {
    return value ? (
      <p className="mb-1"><strong>{label}:</strong> {value}</p>
    ) : null;
  };

  return (
    <div className="container">
      <h3>Servicios del Cliente {clientData ? clientData.razon_social : ''}</h3>
      <ul className="list-group">
        {servicesData.length > 0 ? (
          servicesData.map((service, index) => (
            <div key={index} className="list-group-item list-group-item-action">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{service.nombre_servicio || 'Servicio'}</h5>
              </div>
              {renderServiceDetail('Dominio', service.dominio)}
              {renderServiceDetail('Estado', service.estado)}
              {renderServiceDetail('Tipo de Servicio', service.tipo_servicio)}
              {renderServiceDetail('Hostname', service.hostname)}
              {renderServiceDetail('Cores', service.cores)}
              {renderServiceDetail('Contrato', service.contrato)}
              {renderServiceDetail('Plan Aprovisionado', service.plan_aprovisionado)}
              {renderServiceDetail('Plan Facturado', service.plan_facturado)}
              {renderServiceDetail('Detalle del Plan', service.detalle_plan)}
              {renderServiceDetail('Sockets', service.sockets)}
              {renderServiceDetail('Powerstate', service.powerstate)}
              {renderServiceDetail('IP Privada', service.ip_privada)}
              {renderServiceDetail('VLAN', service.vlan)}
              {renderServiceDetail('IPAM', service.ipam)}
              {renderServiceDetail('Datastore', service.datastore)}
              {renderServiceDetail('Nombre del Servidor', service.nombre_servidor)}
              {renderServiceDetail('Marca del Servidor', service.marca_servidor)}
              {renderServiceDetail('Modelo del Servidor', service.modelo_servidor)}
              {renderServiceDetail('Nombre del Nodo', service.nombre_nodo)}
              {renderServiceDetail('Nombre de la Plataforma', service.nombre_plataforma)}
              {renderServiceDetail('RAM', service.ram)}
              {renderServiceDetail('HDD', service.hdd)}
              {renderServiceDetail('CPU', service.cpu)}
              {renderServiceDetail('Tipo de Servidor', service.tipo_servidor)}
              {renderServiceDetail('Ubicación', service.ubicacion)}
              {renderServiceDetail('Observaciones', service.observaciones)}
              {renderServiceDetail('Facturado', service.facturado)}
              {renderServiceDetail('Comentarios', service.comentarios)}
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