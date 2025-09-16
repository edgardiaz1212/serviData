import React from 'react';
import { servicios } from './TipoServicios';
import { File, Settings, CheckCircle, DollarSign, Calendar, Clock, AlertTriangle, Cpu, HardDrive, MemoryStick, MapPin, Globe, Server, MessageSquare, Edit3 } from 'lucide-react';

const DatosServicio = ({ serviceData, handleChange }) => {
  return (
    <div>
      <h3>Datos de Identificación y Contrato</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="contrato" className="form-label"><File size={16} /> Contrato</label>
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
          <label htmlFor="tipo_servicio" className="form-label"><Settings size={16} /> Tipo de Servicio</label>
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
          <label htmlFor="estado_contrato" className="form-label"><CheckCircle size={16} /> Estado del Contrato</label>
          <input
            type="text"
            name="estado_contrato"
            value={serviceData.estado_contrato}
            onChange={handleChange}
            placeholder="Estado del Contrato"
            className="form-control"
            id="estado_contrato"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="fecha_creacion_servicio" className="form-label"><Calendar size={16} /> Fecha de Creación del Servicio</label>
          <input
            type="date"
            name="fecha_creacion_servicio"
            value={serviceData.fecha_creacion_servicio}
            onChange={handleChange}
            className="form-control"
            id="fecha_creacion_servicio"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="facturado" className="form-label"><DollarSign size={16} /> Facturado</label>
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

      <h3>Información del Servicio/Plan</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="plan_anterior" className="form-label"><AlertTriangle size={16} /> Plan Anterior</label>
          <input
            type="text"
            name="plan_anterior"
            value={serviceData.plan_anterior}
            onChange={handleChange}
            placeholder="Plan Anterior"
            className="form-control"
            id="plan_anterior"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="plan_facturado" className="form-label"><DollarSign size={16} /> Plan Facturado</label>
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
          <label htmlFor="plan_aprovisionado" className="form-label"><Settings size={16} /> Plan Aprovisionado</label>
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
          <label htmlFor="plan_servicio" className="form-label"><CheckCircle size={16} /> Plan de Servicio</label>
          <input
            type="text"
            name="plan_servicio"
            value={serviceData.plan_servicio}
            onChange={handleChange}
            placeholder="Plan de Servicio"
            className="form-control"
            id="plan_servicio"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="descripcion" className="form-label"><File size={16} /> Descripción</label>
          <input
            type="text"
            name="descripcion"
            value={serviceData.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="form-control"
            id="descripcion"
          />
        </div>
        <div className="form-group mt-3 col-md-6 mb-3">
          <label htmlFor="estado_servicio"><CheckCircle size={16} /> Estado del Servicio</label>
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

      <h3>Información de Dominio y DNS</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="dominio" className="form-label"><Globe size={16} /> Dominio</label>
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
          <label htmlFor="dns_dominio" className="form-label"><Server size={16} /> DNS del Dominio</label>
          <input
            type="text"
            name="dns_dominio"
            value={serviceData.dns_dominio}
            onChange={handleChange}
            placeholder="DNS del Dominio"
            className="form-control"
            id="dns_dominio"
          />
        </div>
      </div>

      <h3>Ubicación y Espacio Físico</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="ubicacion" className="form-label"><MapPin size={16} /> Ubicación</label>
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
        <div className="col-md-6 mb-3">
          <label htmlFor="ubicacion_sala" className="form-label"><MapPin size={16} /> Ubicación en la Sala</label>
          <input
            type="text"
            name="ubicacion_sala"
            value={serviceData.ubicacion_sala}
            onChange={handleChange}
            placeholder="Ubicación en la Sala"
            className="form-control"
            id="ubicacion_sala"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="cantidad_ru" className="form-label"><Settings size={16} /> Cantidad de RU</label>
          <input
            type="number"
            name="cantidad_ru"
            value={serviceData.cantidad_ru}
            onChange={handleChange}
            placeholder="Cantidad de RU"
            className="form-control"
            id="cantidad_ru"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="cantidad_m2" className="form-label"><Settings size={16} /> Cantidad de m2</label>
          <input
            type="number"
            name="cantidad_m2"
            value={serviceData.cantidad_m2}
            onChange={handleChange}
            placeholder="Cantidad de m2"
            className="form-control"
            id="cantidad_m2"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="cantidad_bastidores" className="form-label"><Settings size={16} /> Cantidad de Bastidores</label>
          <input
            type="number"
            name="cantidad_bastidores"
            value={serviceData.cantidad_bastidores}
            onChange={handleChange}
            placeholder="Cantidad de Bastidores"
            className="form-control"
            id="cantidad_bastidores"
          />
        </div>
      </div>

      <h3>Información de Hardware/Infraestructura</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="hostname" className="form-label"><Server size={16} /> Hostname</label>
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
        <div className="col-md-6 mb-3">
          <label htmlFor="nombre_servidor" className="form-label"><Server size={16} /> Nombre del Servidor</label>
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
          <label htmlFor="nombre_nodo" className="form-label"><Server size={16} /> Nombre del Nodo</label>
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
          <label htmlFor="nombre_plataforma" className="form-label"><Server size={16} /> Nombre de la Plataforma</label>
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
          <label htmlFor="ram" className="form-label"><MemoryStick size={16} /> RAM (GB)</label>
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
          <label htmlFor="hdd" className="form-label"><HardDrive size={16} /> HDD (GB)</label>
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
          <label htmlFor="cpu" className="form-label"><Cpu size={16} /> CPU (GHz)</label>
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
        <div className="col-md-6 mb-3">
          <label htmlFor="datastore" className="form-label"><HardDrive size={16} /> Datastore</label>
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
      </div>

      <h3>Red e IP</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="ip_privada" className="form-label"><Server size={16} /> IP Privada</label>
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
          <label htmlFor="ip_publica" className="form-label"><Globe size={16} /> IP Publica</label>
          <input
            type="text"
            name="ip_publica"
            value={serviceData.ip_publica}
            onChange={handleChange}
            placeholder="IP Publica"
            className="form-control"
            id="ip_publica"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="vlan" className="form-label"><Settings size={16} /> VLAN</label>
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
          <label htmlFor="ipam" className="form-label"><Settings size={16} /> IPAM</label>
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

      <h3>Observaciones y Comentarios</h3>
      <div className="row">
        <div className="col-md-12 mb-3">
          <label htmlFor="observaciones" className="form-label"><MessageSquare size={16} /> Observaciones</label>
          <textarea
            name="observaciones"
            value={serviceData.observaciones}
            onChange={handleChange}
            placeholder="Observaciones"
            className="form-control"
            id="observaciones"
          />
        </div>
        <div className="col-md-12 mb-3">
          <label htmlFor="comentarios" className="form-label"><Edit3 size={16} /> Comentarios</label>
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

    </div>
  );
};

export default DatosServicio;