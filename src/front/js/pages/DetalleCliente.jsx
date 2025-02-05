import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

function DetalleCliente({ clientData: propClientData }) {
  const { clientId } = useParams();
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(propClientData || null);
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    if (!propClientData) {
      const fetchClientAndServices = async () => {
        const client = await actions.getClientById(clientId);
        setClientData(client);
        const services = await actions.getServicebyClient(clientId);
        setServicesData(services);
      };
      fetchClientAndServices();
    }
  }, [clientId, actions, propClientData]);

  const handleServiceClick = (serviceId) => {
    navigate(`/detalle-servicio/${serviceId}`);
  };

  const renderServiceDetail = (label, value) => {
    return value ? (
      <p className="mb-1"><strong>{label}:</strong> {value}</p>
    ) : null;
  };

  const hasIdentificationDetails = (service) => {
    return service.dominio || service.tipo_servicio || service.hostname;
  };

  const hasStateDetails = (service) => {
    return service.estado || service.contrato;
  };

  const hasResourceDetails = (service) => {
    return service.cores || service.ram || service.hdd || service.cpu;
  };

  const hasNetworkDetails = (service) => {
    return service.ip_privada || service.vlan || service.ipam;
  };

  const hasInfrastructureDetails = (service) => {
    return service.nombre_servidor || service.marca_servidor || service.modelo_servidor || service.nombre_nodo || service.nombre_plataforma;
  };

  const hasOtherDetails = (service) => {
    return service.ubicacion || service.observaciones || service.facturado || service.comentarios;
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
                  <h5 className="mb-1">{service.tipo_servicio || "Servicio"}</h5>
                </div>
                <div className="d-flex justify-content-between">
                  {hasIdentificationDetails(service) && (
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Identificación</h5>
                        <div className="card-text">
                          {renderServiceDetail("Dominio", service.dominio)}
                          {renderServiceDetail("Tipo de Servicio", service.tipo_servicio)}
                          {renderServiceDetail("Hostname", service.hostname)}
                        </div>
                      </div>
                    </div>
                  )}
                  {hasStateDetails(service) && (
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Estado</h5>
                        <div className="card-text">
                          {renderServiceDetail("Estado", service.estado)}
                          {renderServiceDetail("Contrato", service.contrato)}
                        </div>
                      </div>
                    </div>
                  )}
                  {hasResourceDetails(service) && (
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Recursos</h5>
                        <div className="card-text">
                          {renderServiceDetail("Cores", service.cores)}
                          {renderServiceDetail("RAM", service.ram)}
                          {renderServiceDetail("HDD", service.hdd)}
                          {renderServiceDetail("CPU", service.cpu)}
                        </div>
                      </div>
                    </div>
                  )}
                  {hasNetworkDetails(service) && (
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Red</h5>
                        <div className="card-text">
                          {renderServiceDetail("IP Privada", service.ip_privada)}
                          {renderServiceDetail("VLAN", service.vlan)}
                          {renderServiceDetail("IPAM", service.ipam)}
                        </div>
                      </div>
                    </div>
                  )}
                  {hasInfrastructureDetails(service) && (
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Infraestructura</h5>
                        <div className="card-text">
                          {renderServiceDetail("Nombre del Servidor", service.nombre_servidor)}
                          {renderServiceDetail("Marca del Servidor", service.marca_servidor)}
                          {renderServiceDetail("Modelo del Servidor", service.modelo_servidor)}
                          {renderServiceDetail("Nombre del Nodo", service.nombre_nodo)}
                          {renderServiceDetail("Nombre de la Plataforma", service.nombre_plataforma)}
                        </div>
                      </div>
                    </div>
                  )}
                  {hasOtherDetails(service) && (
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Otros</h5>
                        <div className="card-text">
                          {renderServiceDetail("Ubicación", service.ubicacion)}
                          {renderServiceDetail("Observaciones", service.observaciones)}
                          {renderServiceDetail("Facturado", service.facturado)}
                          {renderServiceDetail("Comentarios", service.comentarios)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <li className="list-group-item">No hay servicios registrados para este cliente.</li>
          )}
        </ul>
      </div>
      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Regresar</button>
    </div>
  );
}

export default DetalleCliente;
