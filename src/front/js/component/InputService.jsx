import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext'; // Import Context to access actions
import DatosServicio from '../component/DatosServicio.jsx'; // Import DatosServicio component
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function InputService({ clientData }) {
  const navigate = useNavigate(); // Initialize navigate for navigation
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
    estado_servicio: 'nuevo', // Estado inicial
  });

    const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.target.checkValidity() === false) {
      e.stopPropagation();
      toast.error('Por favor, complete todos los campos obligatorios.');
    } else {
      try {
        await actions.addServiceData({ ...serviceData, cliente_id: clientData.id}); // Send data to backend
        toast.success('Datos del servicio enviados correctamente');
      
        setTimeout(() => {
          navigate("/data-registro"); // Redirect to Manual Data Entry if client not found
        }, 1500)
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
       
        
        <button className="btn btn-success mt-2 w-25" type="submit">
          Guardar
        </button>
      </form>
      <ToastContainer />
    </>
  );
}

export default InputService;