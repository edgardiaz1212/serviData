import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';
import ResumeTableClientServices from '../component/ResumeTableClientServices.jsx'; // Assuming this component exists for displaying services
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ConsultaClientesRegistrados() {
  const { actions } = useContext(Context);
  const navigate = useNavigate(); // Initialize navigate for navigation
  const [name, setName] = useState('');
  const [clientData, setClientData] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // State for suggestions
  const [showButton, setShowButton] = useState(false); // State for button visibility

  const handleInputChange = async (e) => {
    const inputName = e.target.value;
    setName(inputName);

    if (inputName.length > 1) {
      const suggestionsResponse = await actions.fetchClientSuggestions(inputName);
      setSuggestions(suggestionsResponse);
    } else {
      setSuggestions([]);
      setClientData(null); // Clear client data when input is empty
      setServicesData([]); // Clear services data when input is empty
      setShowButton(false); // Hide the button when input is empty
    }
  };

  const handleConsultationClick = async () => {
    if (name.length > 0) {
      const clientResponse = await actions.fetchClientSuggestions(name); // Assuming this fetches client data
      if (clientResponse.length > 0) {
        setClientData(clientResponse[0]); // Assuming we take the first suggestion
        const servicesResponse = await actions.getServicebyClient(clientResponse[0].id);
        setServicesData(servicesResponse);
        setShowButton(true); // Show the button after a successful consultation
      } else {
        toast.info("Cliente no encontrado. Puedes añadir un nuevo cliente.");
        setTimeout(() => {
          navigate("/manual-data-entry"); // Redirect to Manual Data Entry if client not found
        }, 1500); // Redirect to Manual Data Entry if client not found
      }
    } else {
      toast.error("Por favor, ingrese un nombre de cliente.");
    }
  };

  const handleAddClientClick = () => {
    if (clientData) {
      navigate("/manual-data-entry", { state: { clientData, isExisting: true } }); // Redirect to Manual Data Entry with existing client data
    } else {
      navigate("/manual-data-entry", { state: { isExisting: false } }); // Redirect to Manual Data Entry without client data
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container">
        <h3>Paso 1</h3>
        <h5>Validacion Cliente</h5>
        <div className="input-group mb-3">
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
        {suggestions.length > 0 && (
          <ul className="list-group">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="list-group-item list-group-item-action"
                onClick={() => {
                  setName(suggestion.razon_social);
                  setClientData(suggestion);
                  setSuggestions([]);
                  setShowButton(true); // Show the button when a suggestion is selected
                }}
              >
                {suggestion.razon_social}
              </li>
            ))}
          </ul>
        )}
        {showButton && (
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleAddClientClick}
          >
            Añadir Datos
          </button>
        )}
        {clientData && servicesData.length > 0 && ( // Only render if there are services
          <ResumeTableClientServices clientData={clientData} servicesData={servicesData} />
        )}
      </div>
    </>
  );
}

export default ConsultaClientesRegistrados;