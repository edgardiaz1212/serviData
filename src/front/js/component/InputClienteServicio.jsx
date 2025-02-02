import React, { useState } from "react";
import { useContext } from "react";
import { Context } from "../store/appContext";

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
    sockets: "",
    powerstate: "",
    ip_privada: "",
    vlan: "",
    ipam: "",
    datastore: "",
    nombre_servidor: "",
    marca_servidor: "",
    modelo_servidor: "",
    nombre_nodo: "",
    nombre_plataforma: "",
    ram: "",
    hdd: "",
    cpu: "",
    tipo_servidor: "",
    ubicacion: "",
    facturado: "",
    comentarios: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in clientData) {
      setClientData((prevState) => ({ ...prevState, [name]: value }));
    } else {
      setServiceData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actions.addClientAndServiceData({ ...clientData, ...serviceData }); // Send data to backend
      console.log('Client and service data submitted:', { ...clientData, ...serviceData });
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
        onChange={handleChange}
        placeholder="RIF"
      />
      <input
        type="text"
        name="razon_social"
        value={clientData.razon_social}
        onChange={handleChange}
        placeholder="Razón Social"
      />
      <select
        name="tipo"
        value={clientData.tipo}
        onChange={handleChange}
      >
        <option value="">Seleccione Tipo</option>
        <option value="Publica">Pública</option>
        <option value="Privada">Privada</option>
      </select>

      <h3>Datos de identificación del servicio</h3>
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

export default InputClienteServicio;
