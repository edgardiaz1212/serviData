import React from 'react';

function TotalCLient({ clientType }) {
  // Sample data for demonstration purposes
  const clients = {
    Privada: [
      { id: 1, name: 'Cliente Privado 1', service: 'Servicio A' },
      { id: 2, name: 'Cliente Privado 2', service: 'Servicio B' },
    ],
    Publica: [
      { id: 3, name: 'Cliente Publico 1', service: 'Servicio C' },
      { id: 4, name: 'Cliente Publico 2', service: 'Servicio D' },
    ],
  };

  const clientData = clients[clientType] || [];

  return (
    <div>
      <h2>Clientes {clientType}</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Servicio</th>
          </tr>
        </thead>
        <tbody>
          {clientData.map(client => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.name}</td>
              <td>{client.service}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TotalCLient;
