import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import ResumeTableClientServices from "../component/ResumeTableClientServices.jsx";
import InputClienteServicio from "../component/InputClienteServicio.jsx";

const ManualDataEntryPage = () => {
  const { actions, store } = useContext(Context);
  
  const [clientData, setClientData] = useState(null);
  const [servicesData, setServicesData] = useState([]); // New state for services
  const [buttonText, setButtonText] = useState("Crear");
  const [showComponents, setShowComponents] = useState(false);
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (e) => {
    const name = e.target.value;
    setName(name);

    if (name.length > 1) { // Fetch suggestions if input length is greater than 1
      const suggestionsResponse = await actions.fetchClientSuggestions(name);
      setSuggestions(suggestionsResponse);
    } else {
      setSuggestions([]);
    }

    if (name) {
      try {
        const response = await actions.fetchClientData(name);
        if (response.length > 0) {
          setClientData(response[0]);
          setButtonText("Agregar");

          // Fetch services for the selected client
          const servicesResponse = await actions.getServicebyClient(response[0].id); // Assuming client ID is available
          setServicesData(servicesResponse); // Set the services data
        } else {
          setClientData(null);
          setButtonText("Crear");
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    } else {
      setClientData(null);
      setButtonText("Crear");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setName(suggestion.razon_social);
    setClientData(suggestion);
    setSuggestions([]);
    setButtonText("Agregar");
    setShowComponents(true);
  };

  const handleShowComponents = () => {
    setShowComponents(true);
  };

  const handleServiceSubmit = async (serviceData) => {
    try {
      const response = await actions.addServiceData(serviceData);
      if (response) {
        console.log("Service data saved successfully:", response);
      }
    } catch (error) {
      console.error("Error saving service data:", error);
    }
  };

  return (
    <>
      <div className="container">
        <h1>Registro Manual</h1>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del cliente"
            value={name}
            onChange={handleInputChange}
            aria-label="Example text with button addon"
            aria-describedby="button-addon1"
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon1"
            onClick={handleShowComponents}
          >
            {buttonText}
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion.razon_social}
              </li>
            ))}
          </ul>
        )}
        {showComponents && clientData && <ResumeTableClientServices clientData={{ ...clientData, servicios: servicesData }} />}
        {showComponents && (
          <>
            <InputClienteServicio clientData={clientData} onSubmit={handleServiceSubmit} />
          </>
        )}
      </div>
    </>
  );
};

export default ManualDataEntryPage;
