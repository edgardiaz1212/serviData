import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom"; // Import Link for navigation

function DataEntryPage() {
  return (
    <>
      <div className="container text-center">
        <h1>Registro de Datos</h1>
        <div className="drag-drop-area">
          <p>Arrastra tu archivo Excel aquí o haz clic para seleccionar</p>
          <input type="file" accept=".xlsx, .xls" />
        </div>
        <Link to="/manual-data-entry">
          <button className="btn btn-success mt-3">Añadir datos manualmente</button>
        </Link>
      </div>
    </>
  );
}

export default DataEntryPage;
