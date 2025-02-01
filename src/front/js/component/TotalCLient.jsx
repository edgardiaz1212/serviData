import React, { useEffect, useContext } from 'react';
import { Context } from '../store/appContext';

function TotalCLient({ clientType }) {
  const { actions, store } = useContext(Context);

  useEffect(() => {
    actions.getClientbyTipo(clientType);
  }, [clientType]);


  console.log(store.clientData)
  return (
    <>
      <div>
        <h1>Clientes del Tipo: {clientType}</h1>
        <ul>
          {store.clientData && store.clientData.length > 0 ? (
            store.clientData.map((client, index) => (
              <li key={index}>{client.razon_social}</li>
            ))
          ) : (
            <li>No clients found.</li>
          )}
        </ul>
      </div>
    </>
  );
}

export default TotalCLient;
