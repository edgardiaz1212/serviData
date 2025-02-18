import React from 'react';
import { servicios } from './TipoServicios';

const DatosServicio = ({ serviceData, handleChange }) => {
  return (
    <div>
      <h3>Datos de identificación del servicio</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="dominio" className="form-label">Dominio</label>
          <input
            type="text"
            name="dominio"
            value={serviceData.dominio}
            onChange={handleChange}
            placeholder="Dominio"
            className="form-control"
            id="dominio"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="tipo_servicio" className="form-label">Tipo de Servicio</label>
          <select
            name="tipo_servicio"
            value={serviceData.tipo_servicio}
            onChange={handleChange}
            className="form-control"
            id="tipo_servicio"
          >
            <option value="">Seleccione un tipo de servicio</option>
            {servicios.map((servicio, index) => (
              <option key={index} value={servicio}>
                {servicio}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="hostname" className="form-label">Hostname</label>
          <input
            type="text"
            name="hostname"
            value={serviceData.hostname}
            onChange={handleChange}
            placeholder="Hostname"
            className="form-control"
            id="hostname"
          />
        </div>
      </div>

      <h3>Estado y contratación</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="estado" className="form-label">Estado</label>
          <input
            type="text"
            name="estado"
            value={serviceData.estado}
            onChange={handleChange}
            placeholder="Estado"
            className="form-control"
            id="estado"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="contrato" className="form-label">Contrato</label>
          <input
            type="text"
            name="contrato"
            value={serviceData.contrato}
            onChange={handleChange}
            placeholder="Contrato"
            className="form-control"
            id="contrato"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="plan_aprovisionado" className="form-label">Plan Aprovisionado</label>
          <input
            type="text"
            name="plan_aprovisionado"
            value={serviceData.plan_aprovisionado}
            onChange={handleChange}
            placeholder="Plan Aprovisionado"
            className="form-control"
            id="plan_aprovisionado"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="plan_facturado" className="form-label">Plan Facturado</label>
          <input
            type="text"
            name="plan_facturado"
            value={serviceData.plan_facturado}
            onChange={handleChange}
            placeholder="Plan Facturado"
            className="form-control"
            id="plan_facturado"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="detalle_plan" className="form-label">Detalle del Plan</label>
          <input
            type="text"
            name="detalle_plan"
            value={serviceData.detalle_plan}
            onChange={handleChange}
            placeholder="Detalle del Plan"
            className="form-control"
            id="detalle_plan"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="facturado" className="form-label">Facturado</label>
          <input
            type="text"
            name="facturado"
            value={serviceData.facturado}
            onChange={handleChange}
            placeholder="Facturado"
            className="form-control"
            id="facturado"
          />
        </div>
      </div>

      <h3>Recursos del servidor</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="cores" className="form-label">Cores</label>
          <input
            type="number"
            name="cores"
            value={serviceData.cores}
            onChange={handleChange}
            placeholder="Cores"
            className="form-control"
            id="cores"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="sockets" className="form-label">Sockets</label>
          <input
            type="number"
            name="sockets"
            value={serviceData.sockets}
            onChange={handleChange}
            placeholder="Sockets"
            className="form-control"
            id="sockets"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="ram" className="form-label">RAM (GB)</label>
          <input
            type="number"
            name="ram"
            value={serviceData.ram}
            onChange={handleChange}
            placeholder="RAM (GB)"
            className="form-control"
            id="ram"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="hdd" className="form-label">HDD (GB)</label>
          <input
            type="number"
            name="hdd"
            value={serviceData.hdd}
            onChange={handleChange}
            placeholder="HDD (GB)"
            className="form-control"
            id="hdd"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="cpu" className="form-label">CPU (GHz)</label>
          <input
            type="number"
            name="cpu"
            value={serviceData.cpu}
            onChange={handleChange}
            placeholder="CPU (GHz)"
            className="form-control"
            id="cpu"
          />
        </div>
      </div>

      <h3>Datos de red</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="ip_privada" className="form-label">IP Privada</label>
          <input
            type="text"
            name="ip_privada"
            value={serviceData.ip_privada}
            onChange={handleChange}
            placeholder="IP Privada"
            className="form-control"
            id="ip_privada"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="vlan" className="form-label">VLAN</label>
          <input
            type="text"
            name="vlan"
            value={serviceData.vlan}
            onChange={handleChange}
            placeholder="VLAN"
            className="form-control"
            id="vlan"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="ipam" className="form-label">IPAM</label>
          <input
            type="text"
            name="ipam"
            value={serviceData.ipam}
            onChange={handleChange}
            placeholder="IPAM"
            className="form-control"
            id="ipam"
          />
        </div>
      </div>

      <h3>Infraestructura</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="datastore" className="form-label">Datastore</label>
          <input
            type="text"
            name="datastore"
            value={serviceData.datastore}
            onChange={handleChange}
            placeholder="Datastore"
            className="form-control"
            id="datastore"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="nombre_servidor" className="form-label">Nombre del Servidor</label>
          <input
            type="text"
            name="nombre_servidor"
            value={serviceData.nombre_servidor}
            onChange={handleChange}
            placeholder="Nombre del Servidor"
            className="form-control"
            id="nombre_servidor"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="marca_servidor" className="form-label">Marca del Servidor</label>
          <input
            type="text"
            name="marca_servidor"
            value={serviceData.marca_servidor}
            onChange={handleChange}
            placeholder="Marca del Servidor"
            className="form-control"
            id="marca_servidor"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="modelo_servidor" className="form-label">Modelo del Servidor</label>
          <input
            type="text"
            name="modelo_servidor"
            value={serviceData.modelo_servidor}
            onChange={handleChange}
            placeholder="Modelo del Servidor"
            className="form-control"
            id="modelo_servidor"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="nombre_nodo" className="form-label">Nombre del Nodo</label>
          <input
            type="text"
            name="nombre_nodo"
            value={serviceData.nombre_nodo}
            onChange={handleChange}
            placeholder="Nombre del Nodo"
            className="form-control"
            id="nombre_nodo"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="nombre_plataforma" className="form-label">Nombre de la Plataforma</label>
          <input
            type="text"
            name="nombre_plataforma"
            value={serviceData.nombre_plataforma}
            onChange={handleChange}
            placeholder="Nombre de la Plataforma"
            className="form-control"
            id="nombre_plataforma"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="tipo_servidor" className="form-label">Tipo de Servidor</label>
          <input
            type="text"
            name="tipo_servidor"
            value={serviceData.tipo_servidor}
            onChange={handleChange}
            placeholder="Tipo de Servidor"
            className="form-control"
            id="tipo_servidor"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="ubicacion" className="form-label">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            value={serviceData.ubicacion}
            onChange={handleChange}
            placeholder="Ubicación"
            className="form-control"
            id="ubicacion"
          />
        </div>
      </div>

      <h3>Otros</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="powerstate" className="form-label">Estado de Energía</label>
          <input
            type="text"
            name="powerstate"
            value={serviceData.powerstate}
            onChange={handleChange}
            placeholder="Estado de Energía"
            className="form-control"
            id="powerstate"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="comentarios" className="form-label">Comentarios</label>
          <textarea
            name="comentarios"
            value={serviceData.comentarios}
            onChange={handleChange}
            placeholder="Comentarios"
            className="form-control"
            id="comentarios"
          />
        </div>


      </div>

      <div className="form-group mt-3">
          <label htmlFor="estado_servicio">Estado del Servicio</label>
          <select
            className="form-control"
            id="estado_servicio"
            name="estado_servicio"
            value={serviceData.estado_servicio}
            onChange={handleChange}
          >
            <option value="Nuevo">Nuevo Aprovisionamiento</option>
            <option value="Aprovisionado">Aprovisionado</option>
            <option value="Reaprovisionado">Reaprovisionado</option>
            <option value="Retirado">Retirado</option>
          </select>
        </div>
    </div>
  );
};

export default DatosServicio;