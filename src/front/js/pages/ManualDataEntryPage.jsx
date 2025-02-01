import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import ResumeTableClientServices from "../component/ResumeTableClientServices.jsx";
import InputClienteServicio from "../component/InputClienteServicio.jsx";

const ManualDataEntryPage = () => {
  const { actions, store } = useContext(Context);
  
  const [clientData, setClientData] = useState(null);
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

  const handleSaveData = async () => {
    if (clientData) {
      try {
        const response = await actions.addClientData(clientData);
        if (response) {
          console.log("Client data saved successfully:", response);
        }
      } catch (error) {
        console.error("Error saving client data:", error);
      }
    } else {
      console.warn("No client data to save.");
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
        {showComponents && clientData && <ResumeTableClientServices clientData={clientData} />}
        {showComponents && (
          <>
            <InputClienteServicio clientData={clientData} handleChange={handleInputChange} />
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSaveData}
            >
              Guardar
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default ManualDataEntryPage;
