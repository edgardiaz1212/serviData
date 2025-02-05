import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../store/appContext';
import DetalleCliente from './DetalleCliente';

const DetalleServicio = () => {
  const { serviceId } = useParams();
  const { actions } = useContext(Context);
  const [serviceData, setServiceData] = useState(null);
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const fetchServiceAndClientData = async () => {
      try {
        const service = await actions.getServiceById(serviceId);
        console.log("fluxserv", service);
        setServiceData(service);

        // if (service ) {
        //   const client = await actions.getClientById(service.cliente_id);
        //   setClientData(client);
        //   console.log("fluxcliente", client);
        // }
      } catch (error) {
        console.error("Error fetching service or client data", error);
      }
    };
    fetchServiceAndClientData();
  }, [serviceId, actions]);


  if (!serviceData ) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Detalles del Servicio</h2>
      <p><strong>Dominio:</strong> {serviceData.dominio}</p>
      <p><strong>Estado:</strong> {serviceData.estado}</p>
      <p><strong>Tipo de Servicio:</strong> {serviceData.tipo_servicio}</p>
      <p><strong>Hostname:</strong> {serviceData.hostname}</p>
      <p><strong>Cores:</strong> {serviceData.cores}</p>
      <p><strong>Contrato:</strong> {serviceData.contrato}</p>
      <p><strong>Plan Aprovisionado:</strong> {serviceData.plan_aprovisionado}</p>
      <p><strong>Plan Facturado:</strong> {serviceData.plan_facturado}</p>
      <p><strong>Detalle del Plan:</strong> {serviceData.detalle_plan}</p>
      <p><strong>Sockets:</strong> {serviceData.sockets}</p>
      <p><strong>Powerstate:</strong> {serviceData.powerstate}</p>
      <p><strong>IP Privada:</strong> {serviceData.ip_privada}</p>
      <p><strong>VLAN:</strong> {serviceData.vlan}</p>
      <p><strong>IPAM:</strong> {serviceData.ipam}</p>
      <p><strong>Datastore:</strong> {serviceData.datastore}</p>
      <p><strong>Nombre del Servidor:</strong> {serviceData.nombre_servidor}</p>
      <p><strong>Marca del Servidor:</strong> {serviceData.marca_servidor}</p>
      <p><strong>Modelo del Servidor:</strong> {serviceData.modelo_servidor}</p>
      <p><strong>Nombre del Nodo:</strong> {serviceData.nombre_nodo}</p>
      <p><strong>Nombre de la Plataforma:</strong> {serviceData.nombre_plataforma}</p>
      <p><strong>RAM:</strong> {serviceData.ram}</p>
      <p><strong>HDD:</strong> {serviceData.hdd}</p>
      <p><strong>CPU:</strong> {serviceData.cpu}</p>
      <p><strong>Tipo de Servidor:</strong> {serviceData.tipo_servidor}</p>
      <p><strong>Ubicación:</strong> {serviceData.ubicacion}</p>
      <p><strong>Observaciones:</strong> {serviceData.observaciones}</p>
      <p><strong>Facturado:</strong> {serviceData.facturado}</p>
      <p><strong>Comentarios:</strong> {serviceData.comentarios}</p>

      <h2>Detalles del Cliente</h2>
      <DetalleCliente clientData={clientData} />
    </div>
  );
};

export default DetalleServicio;