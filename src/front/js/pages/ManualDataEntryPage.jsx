import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import InputClienteServicio from "../component/InputClienteServicio.jsx";
import InputService from "../component/InputService.jsx";

const ManualDataEntryPageFinal = () => {
  const { state } = useLocation();
  const { clientData } = state || {}; // Get clientData from navigation state
  const { actions, store } = useContext(Context);

  return (
    <div className="container">
      <h3>Paso 2</h3>
      {clientData ? (
        <InputService clientData={clientData} /> // Render InputService if client data exists
      ) : (
        <InputClienteServicio /> // Render InputClienteServicio if no client data
      )}
    </div>
  );
};

export default ManualDataEntryPageFinal;