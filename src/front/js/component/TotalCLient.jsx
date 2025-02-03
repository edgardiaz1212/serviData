import React, { useEffect, useContext } from 'react';
import { Context } from '../store/appContext';

function TotalClient({ clientType, searchQuery }) {
  const { actions, store } = useContext(Context);

  useEffect(() => {
    actions.getClientbyTipo(clientType);
  }, [clientType]);

  const filteredClients = store.clientData.filter(client =>
    client.razon_social.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Clientes del Tipo: {clientType}</h1>
      <ul className="list-group">
        {filteredClients.length > 0 ? (
          filteredClients.map((client, index) => (
            <div key={index} className="list-group-item list-group-item-action">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{client.razon_social}</h5>
              </div>
              <p className="mb-1">RIF: {client.rif}</p>
            </div>
          ))
        ) : (
          <li className="list-group-item">Cliente no registrado.</li>
        )}
      </ul>
    </div>
  );
}

export default TotalClient;