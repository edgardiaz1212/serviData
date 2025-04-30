import React, { useEffect, useContext } from 'react';
import { Context } from "../store/appContext";

const ClientServiceTable = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getServiceCountsByType();
  }, []); // Added actions to dependency array for exhaustive-deps rule

  const serviceCountsByType = store.serviceCountsByType || {};
  const clienteTipos = Object.keys(serviceCountsByType);
  const servicioTipos = [...new Set(clienteTipos.flatMap(clienteTipo => Object.keys(serviceCountsByType[clienteTipo])))];

  servicioTipos.sort();

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-bordered">
        {/* Ensure no whitespace between thead and tr */}
        <thead className="table-light">
          <tr>
            <th scope="col" style={{ position: 'sticky', left: 0, backgroundColor: '#f8f9fa', zIndex: 1 }}>
              Tipo Cliente / Servicio
            </th>
            {servicioTipos.map((servicioTipo) => ( // Removed index as key when servicioTipo is unique enough
              <th scope="col" key={servicioTipo} className="text-center">{servicioTipo}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clienteTipos.map((clienteTipo) => ( // Removed index as key when clienteTipo is unique enough
            <tr key={clienteTipo}>
              <td style={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }}>
                <strong>{clienteTipo}</strong>
              </td>
              {servicioTipos.map((servicioTipo) => ( // Removed index as key
                <td key={`${clienteTipo}-${servicioTipo}`} className="text-center"> {/* Use a more robust key */}
                  {serviceCountsByType[clienteTipo]?.[servicioTipo] || 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientServiceTable;
