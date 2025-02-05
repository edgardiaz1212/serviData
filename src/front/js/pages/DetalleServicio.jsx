import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

const DetalleServicio = () => {
  const { serviceId } = useParams();
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(null);
console.log('serviceId:', serviceId); 
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
  }, [serviceId, actions]);

  if (!serviceData) {
    return <div>Loading...</div>;
  }console.log('serviceData:', serviceData);

  const handleEditClick = () => {
    navigate(`/editar-servicio/${serviceId}`);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Detalles del Servicio</h2>
        <button className="btn btn-primary" onClick={handleEditClick}>
          Editar
        </button>
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
      </div>
    </div>
  );
};

export default DetalleServicio;