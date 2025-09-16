import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Context } from '../store/appContext';
import ModalDocumentLoad from '../component/ModalDocumentLoad.jsx';
import { FileText, Pencil, File, Settings, CheckCircle, DollarSign, Calendar, Clock, AlertTriangle, Cpu, HardDrive, MemoryStick, MapPin, Globe, Server, MessageSquare, Edit3 } from 'lucide-react';

const DetalleServicio = () => {
  const { serviceId } = useParams();
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!store.isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [store.isAuthenticated, navigate]);

  const [serviceData, setServiceData] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [hasDocument, setHasDocument] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false); // New state to force re-render

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Nuevo':
        return 'bg-success';
      case 'Suspendido':
        return 'bg-danger';
      case 'Activo':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  };

  useEffect(() => {
    const fetchServiceData = async () => {
      setLoading(true);
      try {
        const service = await actions.getServiceById(serviceId);
        const serviceObject = Array.isArray(service) ? service[0] : service;
        setServiceData(serviceObject);
        const exists = await actions.checkDocumentExists("service", serviceId);
        setHasDocument(exists);
      } catch (error) {
        setError("Error al cargar los datos del servicio");
        console.error("Error fetching service data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceData();
  }, [serviceId, refresh]); // Add refresh to the dependency array

  const handleEditClick = () => {
    navigate(`/editar-servicio/${serviceId}`, { state: { clientId: serviceData.cliente_id } }); // Pass clientId in state
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  // Add a check for serviceData before rendering
  if (!serviceData) {
    return <div>Cargando detalles del servicio...</div>; // Or any other placeholder
  }

  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Detalle del Servicio {serviceData.tipo_servicio}</h2>
          <div>
            <button className="btn btn-primary me-2" onClick={handleEditClick}>
              <Pencil size={20} strokeWidth={1.75} />
              Editar
            </button>
            <button
              className="btn btn-secondary me-2"
              onClick={() => setShowDocumentModal(true)}
            >
              Gestionar Documentos
              <FileText />
              {hasDocument && <span className="badge bg-success ms-2">Cargado</span>}
              {!hasDocument && <span className="badge bg-danger ms-2">Vacío</span>}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate(`/detalle-cliente/${serviceData.cliente.id}`)}>Regresar</button>
          </div>
        </div>
        <h5>Último status</h5>
        <div className="col-md-6 mb-3">
        <p>{serviceData.estado_servicio}</p>

          
        </div>

        <h3>Datos de Identificación y Contrato</h3>
        <div className="row">
          <div className="col-md-6 mb-3">
            <p><File size={16} /> <strong>Contrato:</strong> {serviceData.contrato}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p><Settings size={16} /> <strong>Tipo de Servicio:</strong> {serviceData.tipo_servicio}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p><CheckCircle size={16} /> <strong>Estado del Contrato:</strong> <span className={`badge ${getStatusBadge(serviceData.estado_contrato)}`}>{serviceData.estado_contrato}</span></p>
          </div>
          <div className="col-md-6 mb-3">
            <p><DollarSign size={16} /> <strong>Facturado:</strong> {serviceData.facturado}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p><Calendar size={16} /> <strong>Fecha de Alta:</strong> {serviceData.fecha_alta || 'N/A'}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p><Clock size={16} /> <strong>Última Modificación:</strong> {serviceData.fecha_modificacion || 'N/A'}</p>
          </div>
        </div>

        <h3>Información del Servicio/Plan</h3>
        <div className="card mb-3">
          <div className="card-header">Resumen de Planes</div>
          <div className="card-body">
            <p><strong>Plan de Servicio (Actual):</strong> {serviceData.plan_servicio}</p>
            <p><strong>Plan Anterior:</strong> {serviceData.plan_anterior} {serviceData.plan_anterior !== serviceData.plan_servicio && <AlertTriangle size={16} color="red" />}</p>
            <p><strong>Plan Facturado:</strong> {serviceData.plan_facturado} {serviceData.plan_facturado !== serviceData.plan_servicio && <AlertTriangle size={16} color="orange" />}</p>
            <p><strong>Plan Aprovisionado:</strong> {serviceData.plan_aprovisionado} {serviceData.plan_aprovisionado !== serviceData.plan_servicio && <AlertTriangle size={16} color="blue" />}</p>
          </div>
        </div>
        <div className="row">
          
        
          <div className="col-md-6 mb-3">
            <p><strong>Descripción:</strong> {serviceData.descripcion}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p><strong>Estado del Servicio:</strong> <span className={`badge ${getStatusBadge(serviceData.estado_servicio)}`}>{serviceData.estado_servicio}</span></p>
          </div>
        </div>

        <h3>Información de Dominio y DNS</h3>
        <div className="row">
          <div className="col-md-6 mb-3">
            <p><strong>Dominio:</strong> {serviceData.dominio}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p><strong>DNS del Dominio:</strong> {serviceData.dns_dominio}</p>
          </div>
        </div>

        <h3>Ubicación y Espacio Físico</h3>
        <div className="card mb-3">
          <div className="card-header">
            <MapPin size={16} /> Ubicación Física
          </div>
          <div className="card-body">
            <p><strong>Ubicación:</strong> {serviceData.ubicacion}</p>
            <p><strong>Ubicación en la Sala:</strong> {serviceData.ubicacion_sala}</p>
            <p><strong>Cantidad de RU:</strong> {serviceData.cantidad_ru}</p>
            <p><strong>Cantidad de m2:</strong> {serviceData.cantidad_m2}</p>
            <p><strong>Cantidad de Bastidores:</strong> {serviceData.cantidad_bastidores}</p>
          </div>
        </div>

        <h3>Información de Hardware/Infraestructura</h3>
        <div className="row mb-3">
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <MemoryStick size={32} />
                <h5 className="card-title">RAM</h5>
                <p className="card-text display-4">{serviceData.ram} GB</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <HardDrive size={32} />
                <h5 className="card-title">HDD</h5>
                <p className="card-text display-4">{serviceData.hdd} GB</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <Cpu size={32} />
                <h5 className="card-title">CPU</h5>
                <p className="card-text display-4">{serviceData.cpu} GHz</p>
              </div>
            </div>
          </div>
        </div>
        <table className="table table-sm mb-3">
          <thead>
            <tr>
              <th>Hostname</th>
              <th>Nombre del Nodo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{serviceData.hostname}</td>
              <td>{serviceData.nombre_nodo}</td>
            </tr>
          </tbody>
        </table>
        <div className="row">
          <div className="col-md-6 mb-3">
            <p><strong>Nombre del Servidor:</strong> {serviceData.nombre_servidor}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p><strong>Nombre de la Plataforma:</strong> {serviceData.nombre_plataforma}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p><strong>Datastore:</strong> {serviceData.datastore}</p>
          </div>
        </div>

        <h3>Red e IP</h3>
        <div className="row mb-3">
          <div className="col-md-6">
            <p><Globe size={16} /> <strong>IP Pública:</strong> {serviceData.ip_publica}</p>
          </div>
          <div className="col-md-6">
            <p><Server size={16} /> <strong>IP Privada:</strong> {serviceData.ip_privada}</p>
          </div>
        </div>
        {(serviceData.vlan || serviceData.ipam) && (
          <div className="card mb-3">
            <div className="card-header">Configuración de red</div>
            <div className="card-body">
              {serviceData.vlan && <p><strong>VLAN:</strong> {serviceData.vlan}</p>}
              {serviceData.ipam && <p><strong>IPAM:</strong> {serviceData.ipam}</p>}
            </div>
          </div>
        )}

        <h3>Observaciones y Comentarios</h3>
        <div className="row">
          <div className="col-md-6 mb-3">
            <p><MessageSquare size={16} /> <strong>Observaciones:</strong> {serviceData.observaciones}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p><Edit3 size={16} /> <strong>Comentarios:</strong> {serviceData.comentarios}</p>
          </div>
        </div>

        <ModalDocumentLoad
          entityType="service"
          entityId={serviceId}
          show={showDocumentModal}
          onClose={() => setShowDocumentModal(false)}
          onDocumentChange={() => setRefresh(!refresh)} // Toggle refresh state
        />
      </div>
    </>
  );
};

export default DetalleServicio;
