import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom"; // Import Link for navigation
import * as XLSX from "xlsx";

function DataEntryPage() {
  const { actions } = useContext(Context);
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Enviar los datos procesados al backend
      await actions.uploadExcelData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <div className="container text-center">
        <h1>Registro de Datos</h1>
        <div className="drag-drop-area border border-ligth p-5">
          <p>Arrastra tu archivo Excel aquí o haz clic para seleccionar</p>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload}/>
        </div>
        <Link to="/manual-data-entry">
          <button className="btn btn-success mt-3">Añadir datos manualmente</button>
        </Link>
      </div>
    </>
  );
}

export default DataEntryPage;
