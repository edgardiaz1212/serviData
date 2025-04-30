import React, { useEffect, useContext } from 'react';
import { Context } from "../store/appContext";

const ClientServiceTable = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    // Llama a la acción correcta para obtener los datos
    actions.getServiceCountsByType();
  }, []); // Se ejecuta solo al montar

  // Accede a la clave correcta en el store
  const serviceCountsByType = store.serviceCountsByType || {}; // Cambiado de clientServiceCounts a serviceCountsByType

  // La lógica para obtener los tipos de cliente y servicio sigue siendo válida
  // ya que la estructura de datos es la misma ({ ClienteTipo: { ServicioTipo: count } })
  const clienteTipos = Object.keys(serviceCountsByType);
  const servicioTipos = [...new Set(clienteTipos.flatMap(clienteTipo => Object.keys(serviceCountsByType[clienteTipo])))];

  // Ordenar los tipos de servicio alfabéticamente para consistencia
  servicioTipos.sort();

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-bordered"> {/* Añadidas clases para mejor estilo */}
        <thead className="table-light"> {/* Encabezado con fondo claro */}
          <tr>
            <th scope="col" style={{ position: 'sticky', left: 0, backgroundColor: '#f8f9fa', zIndex: 1 }}> {/* Celda fija */}
              Tipo Cliente / Servicio
            </th>
            {/* Mapea los tipos de servicio ordenados */}
            {servicioTipos.map((servicioTipo, index) => (
              <th scope="col" key={index} className="text-center">{servicioTipo}</th> // Centrar texto
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Mapea los tipos de cliente */}
          {clienteTipos.map((clienteTipo, index) => (
            <tr key={index}>
              <td style={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }}> {/* Celda fija */}
                <strong>{clienteTipo}</strong> {/* Nombre del tipo de cliente en negrita */}
              </td>
              {/* Mapea los tipos de servicio para obtener el conteo */}
              {servicioTipos.map((servicioTipo, index) => (
                <td key={index} className="text-center"> {/* Centrar texto */}
                  {/* Accede usando la variable correcta */}
                  {serviceCountsByType[clienteTipo]?.[servicioTipo] || 0} {/* Usa optional chaining por si un tipo de servicio no existe para un tipo de cliente */}
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
