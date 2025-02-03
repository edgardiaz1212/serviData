import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext'; // Import Context to access actions
import DatosServicio from '../component/DatosServicio.jsx'; // Import DatosServicio component

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
      <DatosServicio
        clientData={clientData}
        serviceData={serviceData}
        handleChange={handleChange}
      />
      <button className="btn btn-success mt-2" type="submit">
        Guardar
      </button>
    </form>
  );
}

export default InputService;