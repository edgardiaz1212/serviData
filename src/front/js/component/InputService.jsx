import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext'; // Import Context to access actions

function InputService({ clientData }) {
  const { actions } = useContext(Context); // Access actions from context
  const [serviceData, setServiceData] = useState({
    dominio: '',
    tipo_servicio: '',
    hostname: '',
    estado: '',
    contrato: '',
    plan_aprovisionado: '',
    plan_facturado: '',
    detalle_plan: '',
    facturado: '',
    cores: '',
    sockets: '',
    ram: '',
    hdd: '',
    cpu: '',
    ip_privada: '',
    vlan: '',
    ipam: '',
    datastore: '',
    nombre_servidor: '',
    marca_servidor: '',
    modelo_servidor: '',
    nombre_nodo: '',
    nombre_plataforma: '',
    tipo_servidor: '',
    ubicacion: '',
    powerstate: '',
    comentarios: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actions.addServiceData({ ...serviceData, cliente_id: clientData.id }); // Send data to backend
      console.log('Service data submitted:', serviceData);
    } catch (error) {
      console.error('Error submitting service data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Datos de identificación del servicio</h3>
      {clientData && <h4>Cliente: {clientData.razon_social}</h4>} {/* Display client's razon social */}
      <input
        type="text"
        name="dominio"
        value={serviceData.dominio}
        onChange={handleChange}
        placeholder="Dominio"
      />
      <input
        type="text"
        name="tipo_servicio"
        value={serviceData.tipo_servicio}
        onChange={handleChange}
        placeholder="Tipo de Servicio"
      />
      <input
        type="text"
        name="hostname"
        value={serviceData.hostname}
        onChange={handleChange}
        placeholder="Hostname"
      />
      {/* Additional input fields for other service data */}
      <button className="btn btn-success mt-2" type="submit">
        Guardar
      </button>
    </form>
  );
}

export default InputService;
