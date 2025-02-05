import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';
import ResumeTableClientServices from '../component/ResumeTableClientServices.jsx';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ConsultaClientesRegistrados() {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [clientData, setClientData] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showButton, setShowButton] = useState(false);

  const handleInputChange = async (e) => {
    const inputName = e.target.value;
    setName(inputName);

    if (inputName.length > 1) {
      const suggestionsResponse = await actions.fetchClientSuggestions(inputName);
      setSuggestions(suggestionsResponse);
    } else {
      setSuggestions([]);
      setClientData(null);
      setServicesData([]);
      setShowButton(false);
    }
  };

  const handleConsultationClick = async () => {
    if (name.length > 0) {
      const clientResponse = await actions.fetchClientSuggestions(name);
      if (clientResponse.length > 0) {
        setClientData(clientResponse[0]);
        const servicesResponse = await actions.getServicebyClient(clientResponse[0].id);
        setServicesData(servicesResponse);
        setShowButton(true);
        if (servicesResponse.length === 0) {
          toast.info("Cliente encontrado, pero no tiene servicios registrados.");
        }
      } else {
        toast.info("Cliente no encontrado. Puedes añadir un nuevo cliente.");
        setTimeout(() => {
          navigate("/manual-data-entry");
        }, 1500);
      }
    } else {
      toast.error("Por favor, ingrese un nombre de cliente.");
    }
  };

  const handleAddClientClick = () => {
    if (clientData) {
      navigate("/manual-data-entry", { state: { clientData, isExisting: true } });
    } else {
      navigate("/manual-data-entry", { state: { isExisting: false } });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container vh-100">
        <h3>Paso 1</h3>
        <h5>Validacion Cliente</h5>
        <div className="d-flex justify-content-center">
          <div className="input-group mb-3 w-50"> {/* Ajusta el ancho aquí */}
            <input
              type="text"
              className="form-control"
              placeholder="Nombre del cliente"
              value={name}
              onChange={handleInputChange}
              aria-label="Nombre del cliente"
            />
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleConsultationClick}
            >
              Consultar
            </button>
          </div>
        </div>
        {suggestions.length > 0 && (
          <div className="d-flex justify-content-center">
            <ul className="list-group w-50"> {/* Mismo ancho que el input */}
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setName(suggestion.razon_social);
                    setClientData(suggestion);
                    setSuggestions([]);
                    setShowButton(true);
                  }}
                >
                  {suggestion.razon_social}
                </li>
              ))}
            </ul>
          </div>
        )}
        {clientData && (
          <>
            {showButton && (
              <button
                className="btn btn-success"
                type="button"
                onClick={handleAddClientClick}
              >
                Añadir Datos
              </button>
            )}
            {servicesData.length > 0 ? (
              <ResumeTableClientServices clientData={clientData} servicesData={servicesData} />
            ) : (
              <p>Cliente encontrado, pero no tiene servicios registrados.</p>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default ConsultaClientesRegistrados;