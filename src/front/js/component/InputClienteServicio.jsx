import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import DatosServicio from '../component/DatosServicio.jsx'; // Importar el componente DatosServicio

function InputClienteServicio({ onSubmit }) {
  const { actions } = useContext(Context);

  const [clientData, setClientData] = useState({
    rif: "",
    razon_social: "",
    tipo: "",
  });

  const [serviceData, setServiceData] = useState({
    dominio: "",
    tipo_servicio: "",
    hostname: "",
    estado: "",
    contrato: "",
    plan_aprovisionado: "",
    plan_facturado: "",
    detalle_plan: "",
    facturado: "",
    cores: "",
    sockets: "",
    ram: "",
    hdd: "",
    cpu: "",
    ip_privada: "",
    vlan: "",
    ipam: "",
    datastore: "",
    nombre_servidor: "",
    marca_servidor: "",
    modelo_servidor: "",
    nombre_nodo: "",
    nombre_plataforma: "",
    tipo_servidor: "",
    ubicacion: "",
    powerstate: "",
    comentarios: "",
  });

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actions.addClientAndServiceData({  ...clientData, ...serviceData });
      console.log('Client and Service data submitted:', { clientData, serviceData });
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error('Error submitting client and service data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Datos del Cliente</h3>
      <input
        type="text"
        name="rif"
        value={clientData.rif}
        onChange={handleClientChange}
        placeholder="RIF"
      />
      <input
        type="text"
        name="razon_social"
        value={clientData.razon_social}
        onChange={handleClientChange}
        placeholder="Razón Social"
      />
     <select
        name="tipo"
        value={clientData.tipo}
        onChange={handleClientChange}
      >
        <option value="" disabled>Seleccione Tipo</option>
        <option value="Pública">Pública</option>
        <option value="Privada">Privada</option>
      </select>

      <DatosServicio
        clientData={clientData}
        serviceData={serviceData}
        handleChange={handleServiceChange}
      />

      <button className="btn btn-success mt-2" type="submit">
        Guardar
      </button>
    </form>
  );
}

export default InputClienteServicio;
