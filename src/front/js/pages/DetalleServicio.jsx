import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import ModalDocumentLoad from '../component/ModalDocumentLoad.jsx';



const DetalleServicio = () => {
  const { serviceId } = useParams();
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [store.isAuthenticated, navigate]);

  const [serviceData, setServiceData] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);


  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const service = await actions.getServiceById(serviceId);
        // Verificar si service es un array y extraer el primer elemento si es necesario
        const serviceObject = Array.isArray(service) ? service[0] : service;
        setServiceData(serviceObject);
      } catch (error) {
        console.error("Error fetching service data", error);
      } 
    };
    fetchServiceData();
  }, [serviceId]);

  if (!serviceData) {
    return <div>Loading...</div>;
  }
  const handleEditClick = () => {
    navigate(`/editar-servicio/${serviceId}`);
  };

  return (
    <>
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Detalles del Servicio</h2>
        
        <div>
          <button className="btn btn-primary me-2" onClick={handleEditClick}>
            Editar Datos
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowDocumentModal(true)}
          >
            Gestionar Documentos
          </button>
        </div>

      </div>
      <h5>Ultimo status</h5>
      <div className="col-md-6 mb-3">
          <p>{serviceData.estado_servicio}</p>
        </div>

      <h3>Datos de identificación del servicio</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <p><strong>Dominio:</strong> {serviceData.dominio}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Tipo de Servicio:</strong> {serviceData.tipo_servicio}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Hostname:</strong> {serviceData.hostname}</p>
        </div>
      </div>

      <h3>Estado y contratación</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <p><strong>Estado:</strong> {serviceData.estado}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Contrato:</strong> {serviceData.contrato}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Plan Aprovisionado:</strong> {serviceData.plan_aprovisionado}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Plan Facturado:</strong> {serviceData.plan_facturado}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Detalle del Plan:</strong> {serviceData.detalle_plan}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Facturado:</strong> {serviceData.facturado}</p>
        </div>
      </div>

      <h3>Recursos del servidor</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <p><strong>Cores:</strong> {serviceData.cores}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Sockets:</strong> {serviceData.sockets}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>RAM (GB):</strong> {serviceData.ram}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>HDD (GB):</strong> {serviceData.hdd}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>CPU (GHz):</strong> {serviceData.cpu}</p>
        </div>
      </div>

      <h3>Datos de red</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <p><strong>IP Privada:</strong> {serviceData.ip_privada}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>VLAN:</strong> {serviceData.vlan}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>IPAM:</strong> {serviceData.ipam}</p>
        </div>
      </div>

      <h3>Infraestructura</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <p><strong>Datastore:</strong> {serviceData.datastore}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Nombre del Servidor:</strong> {serviceData.nombre_servidor}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Marca del Servidor:</strong> {serviceData.marca_servidor}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Modelo del Servidor:</strong> {serviceData.modelo_servidor}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Nombre del Nodo:</strong> {serviceData.nombre_nodo}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Nombre de la Plataforma:</strong> {serviceData.nombre_plataforma}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Tipo de Servidor:</strong> {serviceData.tipo_servidor}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Ubicación:</strong> {serviceData.ubicacion}</p>
        </div>
      </div>

      <h3>Otros</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <p><strong>Estado de Energía:</strong> {serviceData.powerstate}</p>
        </div>
        <div className="col-md-6 mb-3">
          <p><strong>Comentarios:</strong> {serviceData.comentarios}</p>
        </div>
        <ModalDocumentLoad
          entityType="service"
          entityId={serviceId}
          show={showDocumentModal}
          onClose={() => setShowDocumentModal(false)}
        />

      </div>
      <button className="btn btn-secondary" onClick={() => navigate('/clientes')}>Volver</button>
    
    </div>
    </>
  );
};

export default DetalleServicio;
