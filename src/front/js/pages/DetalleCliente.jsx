import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import ModalDocumentLoad from "../component/ModalDocumentLoad.jsx";
import ServiceCard from "../component/ServiceCard.jsx"; // Nuevo componente para servicios

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

    useEffect(() => {
        if (!store.isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [store.isAuthenticated, navigate]);

    useEffect(() => {
        if (!propClientData) {
            const fetchClientAndServices = async () => {
                setLoading(true);
                try {
                    const client = await actions.getClientById(clientId);
                    setClientData(client);
                    const services = await actions.getServicebyClient(clientId);
                    setServicesData(services || []);
                } catch (error) {
                    setError("Error al cargar los datos del cliente y servicios");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
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
        <div className="container vh-100">
            <div className="d-flex justify-content-between align-items-center">
                <h3>Detalles del Cliente {clientData ? clientData.razon_social : ""}</h3>
                {store.user?.role === "Admin" && (
                    <button className="btn btn-primary" onClick={handleEditUserClick}>
                        Editar Usuario
                    </button>
                )}
            </div>
            <div className="container border-bottom">
                <div className="row justify-content-between">
                    <div className="col-7">
                        <h5>Datos del Cliente</h5>
                        {clientData && (
                            <>
                                <p><strong>RIF:</strong> {clientData.rif}</p>
                                <p><strong>Razón Social:</strong> {clientData.razon_social}</p>
                                <p><strong>Tipo:</strong> {clientData.tipo}</p>
                            </>
                        )}
                    </div>
                    <div className="col-3">
                        <div className="card text-bg-success text-center">
                            <div className="card-body">{store.activeServiceCount} Servicios activos</div>
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
                    <button>Descargar Informe</button>
                </div>
                <ul className="list-group">
                    {filteredServices.length > 0 ? (
                        filteredServices.map((service, index) => (
                        <>
                            <ServiceCard
                                key={index}
                                service={service}
                                onClick={() => handleServiceClick(service.id)}
                            />
                            
                            </>
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