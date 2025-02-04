import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

function DetalleCliente() {
  const { clientId } = useParams();
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    const fetchClientAndServices = async () => {
      const client = await actions.fetchClientData(clientId);
      console.log("useClientdetalle",client);
      setClientData(client);
      const services = await actions.getServicebyClient(clientId);
      setServicesData(services);
      console.log("useClientserv",services);
    };
    fetchClientAndServices();
  }, [clientId, actions]);

  const handleServiceClick = (serviceId) => {
    navigate(`/detalle-servicio/${serviceId}`)
    console.log(serviceId);
  };

  const renderServiceDetail = (label, value) => {
    return value ? (
      <p className="mb-1"><strong>{label}:</strong> {value}</p>
    ) : null;
  };

  return (
    <div className="container vh-100'">
      <h3>Detalles del Cliente {clientData ? clientData.razon_social : ''}</h3>
      <div>
        <h5>Datos del Cliente</h5>
        {clientData && (
          <>
            {renderServiceDetail('RIF', clientData.rif)}
            {renderServiceDetail('Razón Social', clientData.razon_social)}
            {renderServiceDetail('Tipo', clientData.tipo)}
          </>
        )}
      </div>
      <div>
        <h5>Servicios</h5>
        <ul className="list-group">
          {servicesData.length > 0 ? (
            servicesData.map((service, index) => (
              <div
                key={index}
                className="list-group-item list-group-item-action"
                onClick={() => handleServiceClick(service.id)}
              >
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
      </div>
      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Cancelar</button>
    </div>
  );
}

export default DetalleCliente;