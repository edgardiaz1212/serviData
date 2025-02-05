import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

function DetalleCliente() {
  const { clientId } = useParams();
  const { actions } = useContext(Context);
  const navigate = useNavigate();
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

  const handleServiceClick = (serviceId) => {
    navigate(`/detalle-servicio/${serviceId}`);
  };

  const renderServiceDetail = (label, value) => {
    return value ? (
      <p className="mb-1">
        <strong>{label}:</strong> {value}
      </p>
    ) : null;
  };

  return (
    <div className="container vh-100">
      <h3 className="text-center">
        Detalles del Cliente {clientData ? clientData.razon_social : ""}
      </h3>

      <h5 className="text">Datos del Cliente</h5>
      <div className="d-flex justify-content-center">
        <div className="w-50">
          {" "}
          {/* Ajusta el ancho aquí */}
          {clientData && (
            <>
              <div className="card m-3">
                <div className="card-body">
                  {renderServiceDetail("RIF", clientData.rif)}
                  {renderServiceDetail("Razón Social", clientData.razon_social)}
                  {renderServiceDetail("Tipo", clientData.tipo)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div>
        <h5 className="text">Servicios</h5>
        <ul className="list-group">
          {servicesData.length > 0 ? (
            servicesData.map((service, index) => (
              <div
                key={index}
                className="list-group-item list-group-item-action"
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="">
                  <h5 className="mb-1">
                    {service.plan_aprovisionado || "Servicio"}
                  </h5>
                </div>
                <div className="d-flex justify-content-between ">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Identificacion</h5>
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

                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Estado</h5>
                      <div className="card-text">
                        {renderServiceDetail("Estado", service.estado)}
                        {renderServiceDetail("Contrato", service.contrato)}
                        {renderServiceDetail(
                          "Plan Aprovisionado",
                          service.plan_aprovisionado
                        )}
                        {renderServiceDetail(
                          "Plan Facturado",
                          service.plan_facturado
                        )}
                        {renderServiceDetail(
                          "Detalle del Plan",
                          service.detalle_plan
                        )}
                        {renderServiceDetail("Facturado", service.facturado)}
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Recursos</h5>
                      <div className="card-text">
                        {renderServiceDetail("Cores", service.cores)}

                        {renderServiceDetail("Sockets", service.sockets)}
                        {renderServiceDetail("RAM", service.ram)}
                        {renderServiceDetail("HDD", service.hdd)}
                        {renderServiceDetail("CPU", service.cpu)}
                      </div>
                    </div>
                  </div>
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
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Infraestructura</h5>
                      <div className="card-text">
                        {renderServiceDetail("Datastore", service.datastore)}
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

                        {renderServiceDetail(
                          "Tipo de Servidor",
                          service.tipo_servidor
                        )}
                        {renderServiceDetail("Ubicación", service.ubicacion)}
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Otros</h5>
                      <div className="card-text">
                        {renderServiceDetail("Powerstate", service.powerstate)}
                        {renderServiceDetail(
                          "Observaciones",
                          service.observaciones
                        )}

                        {renderServiceDetail(
                          "Comentarios",
                          service.comentarios
                        )}
                      </div>
                    </div>
                  </div>
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
      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Regresar
        </button>
      </div>
    </div>
  );
}

export default DetalleCliente;
