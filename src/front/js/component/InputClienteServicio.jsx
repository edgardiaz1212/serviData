import React, { useState, useEffect } from 'react';

function InputClienteServicio({ clientData, onSubmit }) {
  const [rif, setRif] = useState(clientData ? clientData.rif : '');
  const [razonSocial, setRazonSocial] = useState(clientData ? clientData.razon_social : '');
  const [tipo, setTipo] = useState(clientData ? clientData.tipo : '');
  const [serviceData, setServiceData] = useState({
    dominio: '',
    tipo_servicio: '',
    hostname: '',
    estado: '',
    contrato: '',
    plan_aprovisionado: '',
    plan_facturado: '',
    detalle_plan: '',
    sockets: '',
    powerstate: '',
    ip_privada: '',
    vlan: '',
    ipam: '',
    datastore: '',
    nombre_servidor: '',
    marca_servidor: '',
    modelo_servidor: '',
    nombre_nodo: '',
    nombre_plataforma: '',
    ram: '',
    hdd: '',
    cpu: '',
    tipo_servidor: '',
    ubicacion: '',
    facturado: '',
    comentarios: '',
    cliente_id: clientData ? clientData.id : null,
  });

  useEffect(() => {
    if (clientData) {
      setRif(clientData.rif);
      setRazonSocial(clientData.razon_social);
      setTipo(clientData.tipo);
    }
  }, [clientData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rif') setRif(value);
    if (name === 'razonSocial') setRazonSocial(value);
    if (name === 'tipo') setTipo(value);
    else setServiceData({ ...serviceData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(serviceData);
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <h3>Datos del Cliente</h3>
      <input type="text" name="rif" value={rif} onChange={handleChange} placeholder="RIF" disabled={!!clientData} />
      <input type="text" name="razonSocial" value={razonSocial} onChange={handleChange} placeholder="Razón Social" disabled={!!clientData} />
      <select name="tipo" value={tipo} onChange={handleChange} disabled={!!clientData}>
        <option value="">Seleccione Tipo</option>
        <option value="Publica">Pública</option>
        <option value="Privada">Privada</option>
      </select>

      <h3>Datos de identificación del servicio</h3>
      <input type="text" name="dominio" onChange={handleChange} placeholder="Dominio" />
      <input type="text" name="tipo_servicio" onChange={handleChange} placeholder="Tipo de Servicio" />
      <input type="text" name="hostname" onChange={handleChange} placeholder="Hostname" />

      <h3>Estado y contratación</h3>
      <input type="text" name="estado" onChange={handleChange} placeholder="Estado" />
      <input type="text" name="contrato" onChange={handleChange} placeholder="Contrato" />
      <input type="text" name="plan_aprovisionado" onChange={handleChange} placeholder="Plan Aprovisionado" />
      <input type="text" name="plan_facturado" onChange={handleChange} placeholder="Plan Facturado" />
      <input type="text" name="detalle_plan" onChange={handleChange} placeholder="Detalle del Plan" />
      <input type="text" name="facturado" onChange={handleChange} placeholder="Facturado" />

      <h3>Recursos del servidor</h3>
      <input type="number" name="cores" onChange={handleChange} placeholder="Cores" />
      <input type="number" name="sockets" onChange={handleChange} placeholder="Sockets" />
      <input type="number" name="ram" onChange={handleChange} placeholder="RAM (GB)" />
      <input type="number" name="hdd" onChange={handleChange} placeholder="HDD (GB)" />
      <input type="number" name="cpu" onChange={handleChange} placeholder="CPU (GHz)" />

      <h3>Datos de red</h3>
      <input type="text" name="ip_privada" onChange={handleChange} placeholder="IP Privada" />
      <input type="text" name="vlan" onChange={handleChange} placeholder="VLAN" />
      <input type="text" name="ipam" onChange={handleChange} placeholder="IPAM" />

      <h3>Infraestructura</h3>
      <input type="text" name="datastore" onChange={handleChange} placeholder="Datastore" />
      <input type="text" name="nombre_servidor" onChange={handleChange} placeholder="Nombre del Servidor" />
      <input type="text" name="marca_servidor" onChange={handleChange} placeholder="Marca del Servidor" />
      <input type="text" name="modelo_servidor" onChange={handleChange} placeholder="Modelo del Servidor" />
      <input type="text" name="nombre_nodo" onChange={handleChange} placeholder="Nombre del Nodo" />
      <input type="text" name="nombre_plataforma" onChange={handleChange} placeholder="Nombre de la Plataforma" />
      <input type="text" name="tipo_servidor" onChange={handleChange} placeholder="Tipo de Servidor" />
      <input type="text" name="ubicacion" onChange={handleChange} placeholder="Ubicación" />

      <h3>Otros</h3>
      <input type="text" name="powerstate" onChange={handleChange} placeholder="Estado de Energía" />
      <input type="text" name="comentarios" onChange={handleChange} placeholder="Comentarios" />

      
    </form>
    <button className='btn btn-success mt-2' type="submit">Guardar</button>
    </>
  );
}

export default InputClienteServicio;
