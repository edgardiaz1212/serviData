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
      // Transform Excel data to match backend column names
      const transformedData = excelData.map(row => {
        return {
          // Map from Excel column names to backend expected names
          tipo: row["Tipo"],
          rif: row["RIF"],
          razon_social: row["Razón Social"],
          contrato: row["Contrato"],
          tipo_servicio: row["Tipo de Servicio"],
          estado_contrato: row["Estado del Contrato"],
          facturado: row["Facturado"],
          plan_anterior: row["Plan Anterior"],
          plan_facturado: row["Plan Facturado"],
          plan_aprovisionado: row["Plan Aprovisionado"],
          plan_servicio: row["Plan de Servicio"],
          descripcion: row["Descripción"],
          estado_servicio: row["Estado del Servicio"],
          dominio: row["Dominio"],
          dns_dominio: row["DNS del Dominio"],
          ubicacion: row["Ubicación"],
          ubicacion_sala: row["Ubicación en la Sala"],
          cantidad_ru: row["Cantidad de RU"],
          cantidad_m2: row["Cantidad de m2"],
          cantidad_bastidores: row["Cantidad de Bastidores"],
          hostname: row["Hostname"],
          nombre_servidor: row["Nombre del Servidor"],
          nombre_nodo: row["Nombre del Nodo"],
          nombre_plataforma: row["Nombre de la Plataforma"],
          ram: row["RAM (GB)"],
          hdd: row["HDD (GB)"],
          cpu: row["CPU (GHz)"],
          datastore: row["Datastore"],
          ip_privada: row["IP Privada"],
          ip_publica: row["IP Pública"],
          vlan: row["VLAN"],
          ipam: row["IPAM"],
          observaciones: row["Observaciones"],
          comentarios: row["Comentarios"]
        };
      });
  
      // Log what we're sending to verify format
      console.log("Sending transformed data:", { data: transformedData, estado_servicio: estadoServicio });
      
      // Send the transformed data to the backend
      await actions.uploadExcelData(transformedData, estadoServicio);
      toast.success("Datos cargados correctamente");
      setExcelData([]);
    } catch (error) {
      console.error("Detailed error:", error);
      toast.error(`Error al cargar los datos: ${error.message}`);
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
