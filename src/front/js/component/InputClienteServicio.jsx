import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import DatosServicio from "./DatosServicio"; // Importar el componente DatosServicio
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonSave from "./ButtonSave";

function InputClienteServicio({ onSubmit }) {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [clientData, setClientData] = useState({
    rif: "",
    razon_social: "",
    tipo: "",
  });

  const [serviceData, setServiceData] = useState({
    contrato: "",
    tipo_servicio: "",
    estado_contrato: "",
    facturado: "",
    plan_anterior: "",
    plan_facturado: "",
    plan_aprovisionado: "",
    plan_servicio: "",
    descripcion: "",
    estado_servicio: "Nuevo",
    dominio: "",
    dns_dominio: "",
    ubicacion: "",
    ubicacion_sala: "",
    cantidad_ru: "",
    cantidad_m2: "",
    cantidad_bastidores: "",
    hostname: "",
    nombre_servidor: "",
    nombre_nodo: "",
    nombre_plataforma: "",
    ram: "",
    hdd: "",
    cpu: "",
    datastore: "",
    ip_privada: "",
    ip_publica: "",
    vlan: "",
    ipam: "",
    observaciones: "",
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
    const form = e.target.closest("form");

    if (form.checkValidity() === false) {
      e.stopPropagation();
      toast.error("Por favor, complete todos los campos obligatorios.");
    } else {
      try {
        await actions.addClientAndServiceData({
          ...clientData,
          ...serviceData,
        });
        toast.success(
          "Datos del cliente y del servicio enviados correctamente"
        );
        ;
        if (onSubmit) onSubmit();

        setTimeout(() => {
          navigate("/registro");
        }, 1500);
      } catch (error) {
        toast.error("Error al enviar los datos del cliente y del servicio");
        console.error("Error submitting client and service data:", error);
      }
    }
  };

  return (
    <>
      <form
        className="row g-3 needs-validation"
        onSubmit={handleSubmit}
        noValidate
      >
        <h3>Datos del Cliente</h3>
        <div className="col-md-4">
          <label htmlFor="validationRif" className="form-label">
            RIF
          </label>
          <div className="input-group has-validation">
            <input
              className="form-control"
              type="text"
              name="rif"
              value={clientData.rif}
              onChange={handleClientChange}
              placeholder="RIF"
              id="validationRif"
              aria-describedby="inputGroupPrepend"
              required
            />
            <div className="invalid-feedback">Añada RIF.</div>
          </div>
        </div>
        <div className="col-md-4">
          <label htmlFor="validationRazonSocial" className="form-label">
            Razón Social
          </label>
          <input
            className="form-control"
            type="text"
            name="razon_social"
            value={clientData.razon_social}
            onChange={handleClientChange}
            placeholder="Razón Social"
            id="validationRazonSocial"
            required
          />
          <div className="invalid-feedback">Añada Razón Social.</div>
        </div>
        <div className="col-md-4">
          <label htmlFor="validationTipo" className="form-label">
            Tipo
          </label>
          <select
            className="form-control"
            name="tipo"
            value={clientData.tipo}
            onChange={handleClientChange}
            id="validationTipo"
            required
          >
            <option value="" disabled>
              Seleccione Tipo
            </option>
            <option value="Pública">Pública</option>
            <option value="Privada">Privada</option>
          </select>
          <div className="invalid-feedback">Seleccione Tipo.</div>
        </div>

        <DatosServicio
          clientData={clientData}
          serviceData={serviceData}
          handleChange={handleServiceChange}
        />

        <ButtonSave handleSave={handleSubmit} />
      </form>
      <ToastContainer />
    </>
  );
}

export default InputClienteServicio;
