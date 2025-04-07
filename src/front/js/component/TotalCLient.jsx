import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

function TotalClient({ clientType, searchQuery }) {
  const { actions, store } = useContext(Context);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 25;

  useEffect(() => {
    actions.getClientbyTipo(clientType);
    setCurrentPage(1); // Reset to first page when clientType changes
  }, [clientType]);

  const filteredClients = store.clientData.filter(client => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    return (
      client.razon_social.toLowerCase().includes(lowerCaseSearchQuery) ||
      client.rif.toLowerCase().includes(lowerCaseSearchQuery)
    );
  });

  const handleClientClick = (clientId) => {
    navigate(`/detalle-cliente/${clientId}`);
  };

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <ul className="list-group w-50" style={{ maxWidth: '600px' }}>
        {currentClients.length > 0 ? (
          currentClients.map((client, index) => (
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
          <li className="list-group-item">No clientes registrados.</li>
        )}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Page navigation">
          <ul className="pagination mt-3">
            {Array.from({ length: totalPages }).map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default TotalClient;
