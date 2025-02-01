import React, { useState, useEffect , useContext } from "react";
import { Context } from "../store/appContext";
import ResumeTableClientServices from "../component/ResumeTableClientServices.jsx";
import InputClienteServicio from "../component/InputClienteServicio.jsx";
import { fetchClientData } from "../store/flux"; // Import the fetch function

const ManualDataEntryPage = () => {
  const { actions, store } = useContext(Context);
  const [clientName, setClientName] = useState("");
  const [clientData, setClientData] = useState(null);
  const [buttonText, setButtonText] = useState("Crear");

  const handleInputChange = async (e) => {
    const name = e.target.value;
    setClientName(name);

    if (name) {
      try {
        const response = await actions.fetchClientData(name); // Use the fetch function
        if (response.length > 0) {
          setClientData(response[0]); // Assuming the first result is the desired client
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



  return (
    <>
      <div className="container">
        <h1>Registro Manual</h1>
        <div className="input-group mb-3">
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon1"
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

        {clientData && <ResumeTableClientServices clientData={clientData} />}
        <InputClienteServicio clientData={clientData} />
      </div>
    </>
  );
};

export default ManualDataEntryPage;
