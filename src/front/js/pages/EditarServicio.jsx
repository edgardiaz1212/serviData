import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Context } from '../store/appContext';
import DatosServicio from '../component/DatosServicio.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ButtonSave from '../component/ButtonSave.jsx';
import ButtonDelete from '../component/ButtonDelete.jsx';

function EditarServicio() {
    const { serviceId } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation(); // Use location to get state
    const [serviceData, setServiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const clientId = location.state?.clientId; // Get clientId from state

    useEffect(() => {
        if (!store.isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [store.isAuthenticated, navigate]);

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const service = await actions.getServiceById(serviceId);
                const serviceObject = Array.isArray(service) ? service[0] : service;
                setServiceData(serviceObject);
            } catch (error) {
                setError('Error al cargar los datos del servicio');
                console.error(error);
            } finally {
                setLoading(false);
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
            const numericServiceId = Number(serviceId);
            if (isNaN(numericServiceId)) {
                throw new Error('Invalid service ID. It must be a number.');
            }
            const result = await actions.updateServiceData(numericServiceId, serviceData);
            if (result.error) {
                throw new Error(result.message);
            }
            toast.success('Servicio actualizado con éxito');
            setTimeout(() => {
                navigate(`/detalle-servicio/${serviceId}`);
            }, 1500);
        } catch (error) {
            toast.error('Error al actualizar el servicio');
            console.error(error);
        }
    };

    const handleDelete = async () => {
        try {
            const numericServiceId = Number(serviceId);
            if (isNaN(numericServiceId)) {
                throw new Error('Invalid service ID. It must be a number.');
            }
            const result = await actions.deleteService(numericServiceId);
            if (result.error) {
                throw new Error(result.message);
            }
            toast.success('Servicio eliminado con éxito');
            setTimeout(() => {
                navigate(`/detalle-cliente/${clientId}`);
            }, 1000);
        } catch (error) {
            toast.error('Error al eliminar el servicio');
            console.error(error);
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <h2>Editar Servicio</h2>
            <DatosServicio serviceData={serviceData} handleChange={handleChange} />
            <div className="d-flex gap-2">
                <ButtonSave handleSave={handleSave} />
                <ButtonDelete handleDelete={handleDelete} />
            </div>
            <button className="btn btn-secondary mt-3 ms-2" onClick={() => navigate(`/detalle-servicio/${serviceId}`)}>Cancelar</button>
            <ToastContainer />
        </div>
    );
}

export default EditarServicio;