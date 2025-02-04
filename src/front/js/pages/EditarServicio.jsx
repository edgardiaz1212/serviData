import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import DatosServicio from '../component/DatosServicio';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditarServicio() {
  const { serviceId } = useParams();
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      const service = await actions.getServiceById(serviceId);
      console.log('service:', service);
      setServiceData(service);
    };
    fetchServiceData();
  }, [serviceId, actions]);

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
        await actions.updateServiceData(serviceId, serviceData);
        toast.success('Datos del servicio actualizados correctamente');
        navigate(`/detalle-cliente/${serviceData.cliente_id}`);
      } catch (error) {
        toast.error('Error al actualizar los datos del servicio');
        console.error('Error updating service data:', error);
      }
    }
    e.target.classList.add('was-validated');
  };

  return (
    <div className="container vh-100'">
      <h3>Editar Servicio</h3>
      {serviceData && (
        <form className="row g-3 needs-validation" onSubmit={handleSubmit} noValidate>
          <DatosServicio
            serviceData={serviceData}
            handleChange={handleChange}
          />
          <button className="btn btn-success mt-2" type="submit">
            Guardar
          </button>
          <button className="btn btn-secondary mt-2" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </form>
      )}
      <ToastContainer />
    </div>
  );
}

export default EditarServicio;