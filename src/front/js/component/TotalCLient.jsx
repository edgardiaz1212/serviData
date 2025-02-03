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
        <ul className="list-group">
          {store.clientData && store.clientData.length > 0 ? (
            store.clientData.map((client, index) => (
            <>
            
              <div className="list-group-item list-group-item-action">
              <div className="d-flex w-100 justify-content-between">
      <h5 className="mb-1" key={index}>{client.razon_social}</h5>
            </div>
            <p className="mb-1">RIF: {client.rif}</p>
            {/* <small>{client.tipo}</small> */}

    </div>
            </>  
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
