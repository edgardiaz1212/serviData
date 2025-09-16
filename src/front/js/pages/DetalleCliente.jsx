import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import ModalDocumentLoad from "../component/ModalDocumentLoad.jsx";
import ServiceCard from "../component/ServiceCard.jsx";
import GenerarInformePDF from "../component/GenerarInformePDF.jsx"; // Importa el nuevo componente
import ClientServicesPieChart from "../component/ClientServicesPieChart.jsx";
import { FileText, Pencil, Building2, Landmark } from "lucide-react";

function DetalleCliente({ clientData: propClientData }) {
  const { clientId } = useParams();
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [clientData, setClientData] = useState(propClientData || null);
  const [servicesData, setServicesData] = useState([]);
  const [filter, setFilter] = useState("activos");
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasDocument, setHasDocument] = useState(false);
  const [refresh, setRefresh] = useState(false); // New state to force re-render

  useEffect(() => {
    if (!store.isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [store.isAuthenticated, navigate]);

  useEffect(() => {
    const fetchClientAndServices = async () => {
      setLoading(true);
      try {
        const client = await actions.getClientById(clientId);
        setClientData(client);
        const services = await actions.getServicebyClient(clientId);
        setServicesData(services || []);
        const exists = await actions.checkDocumentExists("client", clientId);
        setHasDocument(exists);
      } catch (error) {
        setError("Error al cargar los datos del cliente y servicios");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (!propClientData) {
      fetchClientAndServices();
    }
  }, [clientId, propClientData, refresh]); // Add refresh to the dependency array

  const handleServiceClick = (serviceId) => {
    navigate(`/detalle-servicio/${serviceId}`);
  };

  const handleEditUserClick = () => {
    navigate(`/editar-cliente/${clientId}`);
  };

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

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h3>Detalles del Cliente </h3>
        {store.user?.role === "Admin" && (
          <button className="btn btn-primary" onClick={handleEditUserClick}>
            <Pencil size={20} strokeWidth={1.75} />
            Editar Cliente
          </button>
        )}
      </div>
      <div className="container border-bottom">
        <div className="row justify-content-between p-3 ">
          <div className="col-7">
            <div className="d-flex align-items-center mb-2">
              {clientData.tipo === "Privada" ? (
                <Building2 className="h-6 w-6" />
              ) : (
                <Landmark className="h-6 w-6" />
              )}
              {clientData.tipo}
            </div>

            <h4>{clientData ? clientData.razon_social : ""}</h4>
            {clientData && (
              <>
                <p>
                  <strong>RIF:</strong> {clientData.rif}
                </p>
                <p>
                  <strong>Fecha de Contrato:</strong>{" "}
                  {clientData.fecha_creacion_cliente
                    ? new Date(
                        clientData.fecha_creacion_cliente
                      ).toLocaleDateString("es-ES")
                    : "No disponible"}
                </p>
              </>
            )}
            <div className="border border-success rounded p-2 m-2">
              {store.activeServiceCount} Servicios activos
            </div>
          </div>

          <div className=" col-3 mt-3">
            <ClientServicesPieChart servicesData={servicesData} />
          </div>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => setShowDocumentModal(true)}
        >
          Gestionar Documentos
          <FileText />
          {hasDocument && (
            <span className="badge bg-success ms-2">Cargado</span>
          )}
          {!hasDocument && <span className="badge bg-danger ms-2">Vacío</span>}
        </button>
      </div>
      <div>
        <h5>Servicios</h5>
        <div className="form-group">
          <label htmlFor="filter">Mostrar servicios:</label>
          <select
            id="filter"
            className="form-control col-3"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="activos">Activos</option>
            <option value="retirados">Retirados</option>
          </select>
          {/* Botón para generar el informe */}
          {filteredServices.length > 0 && (
            <GenerarInformePDF
              razonSocial={clientData.razon_social}
              rif={clientData.rif}
              servicios={filteredServices}
            />
          )}
        </div>
        <ul className="list-group">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <ServiceCard
                key={index}
                service={service}
                onClick={() => handleServiceClick(service.id)}
              />
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
        onDocumentChange={() => setRefresh(!refresh)} // Toggle refresh state
      />
    </div>
  );
}

export default DetalleCliente;
