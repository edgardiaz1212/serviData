import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import ResumeTableClientServices from "../component/ResumeTableClientServices.jsx";
import InputClienteServicio from "../component/InputClienteServicio.jsx";

const ManualDataEntryPage = () => {
  const { actions, store } = useContext(Context);
  const [clientName, setClientName] = useState("");
  const [clientData, setClientData] = useState(null);
  const [buttonText, setButtonText] = useState("Crear");
  const [showComponents, setShowComponents] = useState(false);

  const handleInputChange = async (e) => {
    const name = e.target.value;
    setClientName(name);

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

  const handleButtonClick = () => {
    setShowComponents(!showComponents);
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

  const handleChange = (field, value) => {
    setClientData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <>
      <div className="container">
        <h1>Registro Manual</h1>
        <div className="input-group mb-3">
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon1"
            onClick={handleButtonClick}
          >
            {buttonText}
          </button>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del cliente"
            value={clientName}
            onChange={handleInputChange}
            aria-label="Example text with button addon"
            aria-describedby="button-addon1"
          />
        </div>

        {showComponents && clientData && <ResumeTableClientServices clientData={clientData} />}
        {showComponents && (
          <>
            <InputClienteServicio clientData={clientData} handleChange={handleChange} />
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
