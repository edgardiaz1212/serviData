import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Context } from '../store/appContext';

const DataEntryPage = () => {
  const { actions } = useContext(Context);
  const [excelData, setExcelData] = useState([]);

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
    };

    reader.readAsArrayBuffer(file);
  };

  const handleConfirmUpload = async () => {
    // Enviar los datos procesados al backend
    await actions.uploadExcelData(excelData);
  };

  return (
    <>
      <div className="container text-center vh-100">
        <h1>Registro de Clientes y Servicios</h1>
        <div className="drag-drop-area border border-light p-5">
          <p>Arrastra tu archivo Excel aquí o haz clic para seleccionar</p>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
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
            <button className="btn btn-success mt-3" onClick={handleConfirmUpload}>
              Correcto, Cargar
            </button>
          </>
        )}
        <Link to="/consulta-clientes-registrados">
          <button className="btn btn-secondary mt-3">Agregar Manualmente</button>
        </Link>
      </div>
    </>
  );
};

export default DataEntryPage;
