import React from 'react';
import { servicios } from './TipoServicios.jsx'; // Importar la lista de servicios

function DatosServicio({ clientData, serviceData, handleChange }) {
  return (
    <>
      <h3>Datos de identificación del servicio</h3>
      {clientData && <h4>Cliente: {clientData.razon_social}</h4>} {/* Display client's razon social */}
      <input
        type="text"
        name="dominio"
        value={serviceData.dominio}
        onChange={handleChange}
        placeholder="Dominio"
      />
      <select
        name="tipo_servicio"
        value={serviceData.tipo_servicio}
        onChange={handleChange}
      >
        <option value="" disabled>Seleccione Tipo de Servicio</option>
        {servicios.map((servicio, index) => (
          <option key={index} value={servicio}>{servicio}</option>
        ))}
      </select>
      <input
        type="text"
        name="hostname"
        value={serviceData.hostname}
        onChange={handleChange}
        placeholder="Hostname"
      />
      <input
        type="text"
        name="estado"
        value={serviceData.estado}
        onChange={handleChange}
        placeholder="Estado"
      />
      <input
        type="text"
        name="contrato"
        value={serviceData.contrato}
        onChange={handleChange}
        placeholder="Contrato"
      />
      <input
        type="text"
        name="plan_aprovisionado"
        value={serviceData.plan_aprovisionado}
        onChange={handleChange}
        placeholder="Plan Aprovisionado"
      />
      <input
        type="text"
        name="plan_facturado"
        value={serviceData.plan_facturado}
        onChange={handleChange}
        placeholder="Plan Facturado"
      />
      <input
        type="text"
        name="detalle_plan"
        value={serviceData.detalle_plan}
        onChange={handleChange}
        placeholder="Detalle del Plan"
      />
      <input
        type="text"
        name="facturado"
        value={serviceData.facturado}
        onChange={handleChange}
        placeholder="Facturado"
      />
      <input
        type="text"
        name="cores"
        value={serviceData.cores}
        onChange={handleChange}
        placeholder="Cores"
      />
      <input
        type="text"
        name="sockets"
        value={serviceData.sockets}
        onChange={handleChange}
        placeholder="Sockets"
      />
      <input
        type="text"
        name="ram"
        value={serviceData.ram}
        onChange={handleChange}
        placeholder="RAM"
      />
      <input
        type="text"
        name="hdd"
        value={serviceData.hdd}
        onChange={handleChange}
        placeholder="HDD"
      />
      <input
        type="text"
        name="cpu"
        value={serviceData.cpu}
        onChange={handleChange}
        placeholder="CPU"
      />
      <input
        type="text"
        name="ip_privada"
        value={serviceData.ip_privada}
        onChange={handleChange}
        placeholder="IP Privada"
      />
      <input
        type="text"
        name="vlan"
        value={serviceData.vlan}
        onChange={handleChange}
        placeholder="VLAN"
      />
      <input
        type="text"
        name="ipam"
        value={serviceData.ipam}
        onChange={handleChange}
        placeholder="IPAM"
      />
      <input
        type="text"
        name="datastore"
        value={serviceData.datastore}
        onChange={handleChange}
        placeholder="Datastore"
      />
      <input
        type="text"
        name="nombre_servidor"
        value={serviceData.nombre_servidor}
        onChange={handleChange}
        placeholder="Nombre del Servidor"
      />
      <input
        type="text"
        name="marca_servidor"
        value={serviceData.marca_servidor}
        onChange={handleChange}
        placeholder="Marca del Servidor"
      />
      <input
        type="text"
        name="modelo_servidor"
        value={serviceData.modelo_servidor}
        onChange={handleChange}
        placeholder="Modelo del Servidor"
      />
      <input
        type="text"
        name="nombre_nodo"
        value={serviceData.nombre_nodo}
        onChange={handleChange}
        placeholder="Nombre del Nodo"
      />
      <input
        type="text"
        name="nombre_plataforma"
        value={serviceData.nombre_plataforma}
        onChange={handleChange}
        placeholder="Nombre de la Plataforma"
      />
      <input
        type="text"
        name="tipo_servidor"
        value={serviceData.tipo_servidor}
        onChange={handleChange}
        placeholder="Tipo de Servidor"
      />
      <input
        type="text"
        name="ubicacion"
        value={serviceData.ubicacion}
        onChange={handleChange}
        placeholder="Ubicación"
      />
      <input
        type="text"
        name="powerstate"
        value={serviceData.powerstate}
        onChange={handleChange}
        placeholder="Powerstate"
      />
      <textarea
        name="comentarios"
        value={serviceData.comentarios}
        onChange={handleChange}
        placeholder="Comentarios"
      />
    </>
  );
}

export default DatosServicio;