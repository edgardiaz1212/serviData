import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

function TotalClient({ clientType, searchQuery }) {
  const { actions, store } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    actions.getClientbyTipo(clientType);
  }, [clientType]);

  const filteredClients = store.clientData.filter(client =>
    client.razon_social.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClientClick = (clientId) => {
    navigate(`/detalle-cliente/${clientId}`);
  };

  return (
    <div className="d-flex justify-content-center">
      <ul className="list-group w-50" style={{ maxWidth: '600px' }}>
        {filteredClients.length > 0 ? (
          filteredClients.map((client, index) => (
            <div
              key={index}
              className="list-group-item list-group-item-action"
              onClick={() => handleClientClick(client.id)}
            >
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