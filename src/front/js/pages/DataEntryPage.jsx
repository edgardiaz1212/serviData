import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { Context } from "../store/appContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotebookPen } from "lucide-react";
// Import the Excel file
import excelTemplate from "../../doc/FormatoCargaBase.xlsx";

const DataEntryPage = () => {
  const { actions } = useContext(Context);
  const [excelData, setExcelData] = useState([]);
  const [estadoServicio, setEstadoServicio] = useState("Nuevo"); // Estado inicial

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Guardar los datos procesados en el estado
      setExcelData(jsonData);
      toast.success("Archivo cargado correctamente");
    };

    reader.readAsArrayBuffer(file);
  };

  const handleConfirmUpload = async () => {
    try {
      // Enviar los datos procesados al backend
      await actions.uploadExcelData(excelData, estadoServicio);
      toast.success("Datos cargados correctamente");
      // Limpiar el estado para borrar la tabla de vista previa
      setExcelData([]);
    } catch (error) {
      toast.error("Error al cargar los datos");
    }
  };

  // Function to download the Excel template
  const downloadExcelTemplate = () => {
    // Create a link element
    const link = document.createElement("a");
    // Set the href to the path of the file
    link.href = excelTemplate;
    // Set the download attribute to the name of the file
    link.download = "formato_carga_base.xlsx";
    // Add the link to the body
    document.body.appendChild(link);
    // Simulate a click on the link
    link.click();
    // Remove the link from the body
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="container text-center vh-100">
        <h1>
          <NotebookPen /> Registro de Clientes y Servicios
        </h1>
        <p>
          Utilice esta página para cargar datos de clientes y servicios desde un
          archivo Excel. Revise la vista previa antes de confirmar la carga.
        </p>
        <div className="drag-drop-area border border-success-emphasis rounded p-5">
          <p>Arrastra tu archivo Excel aquí o haz clic para seleccionar</p>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          <p className="mt-3">
            <a
              href="#"
              onClick={downloadExcelTemplate}
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              }}
            >
              Descargar formato de carga base
            </a>
          </p>
        </div>
        {excelData.length > 0 && (
          <>
            <h2>Vista Previa de los Datos</h2>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    {Object.keys(excelData[0]).map((key, index) => (
                      <th key={index}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((value, colIndex) => (
                        <td key={colIndex}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="estado_servicio">
                <strong>Estado del Servicio</strong>
              </label>
              <select
                className="form-control"
                id="estado_servicio"
                name="estado_servicio"
                value={estadoServicio}
                onChange={(e) => setEstadoServicio(e.target.value)}
              >
                <option value="Nuevo">Nuevo Aprovisionamiento</option>
                <option value="Aprovisionado">Aprovisionado</option>
                <option value="Reaprovisionado">Reaprovisionado</option>
              </select>
            </div>
            <button
              className="btn btn-success mt-3 me-2"
              onClick={handleConfirmUpload}
            >
              Correcto, Cargar
            </button>
          </>
        )}
        <Link to="/consulta-clientes-registrados">
          <button className="btn btn-secondary mt-3">
            Agregar Manualmente
          </button>
        </Link>
      </div>
      <ToastContainer />
    </>
  );
};

export default DataEntryPage;
