import React, { useState, useEffect } from "react";
import ResumeTableClientServices from "../component/ResumeTableClientServices.jsx";
import InputClienteServicio from "../component/InputClienteServicio.jsx";

const ManualDataEntryPage = () => {
  return (
    <>
      <div className="container">
        <h1>Registro Manual</h1>
        <div className="input-group mb-3" placeholder="Nombre del cliente">
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon1"
          >
            cambiarbutton
          </button>
          <input
            type="text"
            className="form-control"
            placeholder=""
            aria-label="Example text with button addon"
            aria-describedby="button-addon1"
          />
        </div>

        <ResumeTableClientServices />
        <InputClienteServicio />
      </div>
    </>
  );
};

export default ManualDataEntryPage;
