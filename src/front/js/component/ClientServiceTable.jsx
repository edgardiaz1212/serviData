import React, { useEffect, useContext } from 'react';
import { Context } from "../store/appContext";

const ClientServiceTable = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getClientServiceCounts();
  }, []);

  const clientServiceCounts = store.clientServiceCounts || {};

  const clienteTipos = Object.keys(clientServiceCounts);
  const servicioTipos = [...new Set(clienteTipos.flatMap(clienteTipo => Object.keys(clientServiceCounts[clienteTipo])))];

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Tipo de Cliente / Tipo de Servicio</th>
            {servicioTipos.map((servicioTipo, index) => (
              <th scope="col" key={index}>{servicioTipo}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clienteTipos.map((clienteTipo, index) => (
            <tr key={index}>
              <td>{clienteTipo}</td>
              {servicioTipos.map((servicioTipo, index) => (
                <td key={index}>{clientServiceCounts[clienteTipo][servicioTipo] || 0}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientServiceTable;