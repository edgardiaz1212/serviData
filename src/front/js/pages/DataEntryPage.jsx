import React from 'react';

function DataEntryPage() {
  return (
    <div>
      <h1>Registro de Datos</h1>
      <div className="drag-drop-area">
        <p>Arrastra tu archivo Excel aquí o haz clic para seleccionar</p>
        <input type="file" accept=".xlsx, .xls" />
      </div>
      <button className="btn btn-success mt-3">Añadir datos manualmente</button>
    </div>
  );
}

export default DataEntryPage;
