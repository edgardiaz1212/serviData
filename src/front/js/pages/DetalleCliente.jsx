import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import ModalDocumentLoad from "../component/ModalDocumentLoad.jsx";



function DetalleCliente({ clientData: propClientData }) {
  const { clientId } = useParams();
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [store.isAuthenticated, navigate]);

  const [clientData, setClientData] = useState(propClientData || null);
  const [servicesData, setServicesData] = useState([]);
  const [filter, setFilter] = useState("activos"); // Estado para el filtro
   const [showDocumentModal, setShowDocumentModal] = useState(false);

  useEffect(() => {
    if (!propClientData) {
      const fetchClientAndServices = async () => {
        const client = await actions.getClientById(clientId);
        setClientData(client);
        const services = await actions.getServicebyClient(clientId);
        setServicesData(services || []);
      };
      fetchClientAndServices();
    }
  }, [clientId, propClientData]);

  const handleServiceClick = (serviceId) => {
    navigate(`/detalle-servicio/${serviceId}`);
  };

  const handleEditUserClick = () => {
    navigate(`/editar-cliente/${clientId}`);
  };

  const renderServiceDetail = (label, value) => {
    if (!value || value === 0) return null;
    return (
      <p>
        <strong>{label}:</strong> {value}
      </p>
    );
  };

  const hasIdentificationDetails = (service) => {
    return service.dominio || service.tipo_servicio || service.hostname;
  };

  const hasStateDetails = (service) => {
    return service.estado || service.contrato;
  };

  const hasResourceDetails = (service) => {
    return (
      service.cores !== 0 ||
      service.ram !== 0 ||
      service.hdd !== 0 ||
      service.cpu !== 0
    );
  };

  const hasNetworkDetails = (service) => {
    return (
      (service.ip_privada && service.ip_privada !== 0) ||
      (service.vlan && service.vlan !== 0) ||
      (service.ipam && service.ipam !== 0)
    );
  };

  const hasInfrastructureDetails = (service) => {
    return (
      service.nombre_servidor ||
      service.marca_servidor ||
      service.modelo_servidor ||
      service.nombre_nodo ||
      service.nombre_plataforma
    );
  };

  const hasOtherDetails = (service) => {
    return (
      service.ubicacion ||
      service.observaciones ||
      service.facturado ||
      service.comentarios
    );
  };

  // const getServiceItemClass = (service) => {
  //   const { estado_servicio, updated_at } = service;
  //   let className = 'list-group-item';

  //   if (estado_servicio === 'Nuevo' ) {
  //     className += ' list-group-item-success';
  //   } else if (estado_servicio === 'Reaprovisionado' ) {
  //     className += ' list-group-item-warning';
  //   }
  //   else if (estado_servicio === 'Aprovisionado') {
  //     className += ' list-group';

  //   }

  //  return className;
  // };

  const filteredServices = servicesData.filter((service) => {
    if (filter === "activos") {
      return ["Nuevo", "Aprovisionado", "Reaprovisionado"].includes(
        service.estado_servicio
      );
    } else if (filter === "retirados") {
      return service.estado_servicio === "Retirado";
    }
    return true;
  });

  return (
    <div className="container vh-100'">
      <div className="d-flex justify-content-between align-items-center ">
        <h3>
          Detalles del Cliente {clientData ? clientData.razon_social : ""}
        </h3>
        {store.user?.role === "Admin" && (
          <button className="btn btn-primary" onClick={handleEditUserClick}>
            Editar Usuario
          </button>
        )}
      </div>
      <div className="container border-bottom">
        <div className="row justify-content-between">
          <div className="col-7 ">
            <h5>Datos del Cliente</h5>
            {clientData && (
              <>
                {renderServiceDetail("RIF", clientData.rif)}
                {renderServiceDetail("Razón Social", clientData.razon_social)}
                {renderServiceDetail("Tipo", clientData.tipo)}
              </>
            )}
          </div>
          <div className="col-3">
            <div className="card text-bg-success text-center ">
              <div className="card-body"> {store.activeServiceCount} Servicios activos </div>
              
            </div>
          </div>
        </div>
        <button 
            className="btn btn-secondary"
            onClick={() => setShowDocumentModal(true)}
          >
            Gestionar Documentos
          </button>
      </div>
      <div>
        <h5>Servicios</h5>
        <div className="form-group ">
          <label htmlFor="filter">Mostrar servicios:</label>
          <select
            id="filter"
            className="form-control  col-3"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="activos">Activos</option>
            <option value="retirados">Retirados</option>
          </select>
        </div>
        <ul className="list-group">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <div
                key={index}
                className="list-group-item list-group-item-action"
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">
                    {service.tipo_servicio || "Servicio"}
                  </h5>
                </div>
                <div className="d-flex justify-content-between">
                  {hasIdentificationDetails(service) && (
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Identificación</h5>
                        <div className="card-text">
                          {renderServiceDetail("Dominio", service.dominio)}
                          {renderServiceDetail(
                            "Tipo de Servicio",
                            service.tipo_servicio
                          )}
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
                          {renderServiceDetail(
                            "IP Privada",
                            service.ip_privada
                          )}
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
                          {renderServiceDetail(
                            "Nombre del Servidor",
                            service.nombre_servidor
                          )}
                          {renderServiceDetail(
                            "Marca del Servidor",
                            service.marca_servidor
                          )}
                          {renderServiceDetail(
                            "Modelo del Servidor",
                            service.modelo_servidor
                          )}
                          {renderServiceDetail(
                            "Nombre del Nodo",
                            service.nombre_nodo
                          )}
                          {renderServiceDetail(
                            "Nombre de la Plataforma",
                            service.nombre_plataforma
                          )}
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
                          {renderServiceDetail(
                            "Observaciones",
                            service.observaciones
                          )}
                          {renderServiceDetail("Facturado", service.facturado)}
                          {renderServiceDetail(
                            "Comentarios",
                            service.comentarios
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <li className="list-group-item">
              No hay servicios registrados para este cliente.
            </li>
          )}
        </ul>
      </div>
      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate("/clientes")}
      >
        Regresar
      </button>
      <ModalDocumentLoad
          entityType="client"
          entityId={clientId}
          show={showDocumentModal}
          onClose={() => setShowDocumentModal(false)}
        />
    </div>
  );
}

export default DetalleCliente;
