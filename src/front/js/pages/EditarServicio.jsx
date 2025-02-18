import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import DatosServicio from '../component/DatosServicio';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditarServicio = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { actions } = useContext(Context);
  const [serviceData, setServiceData] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const data = await actions.getServiceById(serviceId);
        setServiceData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchServiceData();
  }, [serviceId, actions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const numericServiceId = Number(serviceId); // Convertir serviceId a número
      if (isNaN(numericServiceId)) {
        throw new Error("Invalid service ID. It must be a number.");
      }
      const result = await actions.updateServiceData(numericServiceId, serviceData);
      if (result.error) {
        throw new Error(result.message);
      }
      toast.success('Servicio actualizado con éxito');
      navigate(`/detalle-servicio/${serviceId}`);
    } catch (error) {
      toast.error('Error al actualizar el servicio');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const numericServiceId = Number(serviceId); // Convertir serviceId a número
      if (isNaN(numericServiceId)) {
        throw new Error("Invalid service ID. It must be a number.");
      }
      const result = await actions.deleteService(numericServiceId);
      if (result.error) {
        throw new Error(result.message);
      }
      toast.success('Servicio eliminado con éxito');
      setTimeout(() => {
        navigate(-2);
      }, 1000);
    } catch (error) {
      toast.error('Error al eliminar el servicio');
      console.error(error);
    }
  };
  const handleRetire = async () => {
    try {
      await actions.updateServiceData(serviceId, { ...serviceData, estado_servicio: 'retirado' });
      toast.success('Servicio retirado correctamente');
      navigate(`/detalle-servicio/${serviceId}`);
    } catch (error) {
      toast.error('Error al retirar el servicio');
      console.error(error);
    }
  };
  if (!serviceData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Editar Servicio</h2>
      <DatosServicio serviceData={serviceData} handleChange={handleChange} />
      <button className="btn btn-primary mt-3" onClick={handleSave}>
        Guardar
      </button>
      <button className="btn btn-outline-danger mt-3 ms-2" onClick={handleRetire}>
        Retirar Servicio
      </button>
      <button className="btn btn-danger mt-3 ms-2" onClick={handleDelete}>
        Eliminar
      </button>
      <button className="btn btn-secondary mt-3 ms-2" onClick={() => navigate(`/detalle-servicio/${serviceId}`)}>Cancelar</button>
      <ToastContainer />
    </div>
  );
};

export default EditarServicio;