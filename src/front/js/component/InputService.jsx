import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext'; // Import Context to access actions
import DatosServicio from '../component/DatosServicio.jsx'; // Import DatosServicio component
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ButtonSave from './ButtonSave.jsx';

function InputService({ clientData }) {
  const navigate = useNavigate(); // Initialize navigate for navigation
  const { actions } = useContext(Context); // Access actions from context
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
    fecha_creacion_servicio: "", // Add service creation date
  });

    const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target.closest('form');
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      toast.error('Por favor, complete todos los campos obligatorios.');
    } else {
      try {
        await actions.addServiceData({ ...serviceData, cliente_id: clientData.id });
        toast.success('Datos del servicio enviados correctamente');
      
        setTimeout(() => {
          navigate("/registro");
        }, 1500);
      } catch (error) {
        toast.error('Error al enviar los datos del servicio');
        console.error('Error submitting service data:', error);
      }
    }
  };

  return (
    <>
      <form className="row g-3 needs-validation" onSubmit={handleSubmit} noValidate>
        <h3>Cliente : {clientData.razon_social}</h3>
        <DatosServicio
          clientData={clientData}
          serviceData={serviceData}
          handleChange={handleChange}
        />
       
        <ButtonSave handleSave={handleSubmit} />
        
      </form>
      <ToastContainer />
    </>
  );
}

export default InputService;