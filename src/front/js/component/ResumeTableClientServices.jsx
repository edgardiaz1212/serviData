import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../store/appContext'; // Import Context to access actions

function ResumeTableClientServices({ clientData }) {
  const { actions } = useContext(Context); // Access actions from context
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      if (clientData && clientData.id) {
        const servicesResponse = await actions.getServicebyClient(clientData.id);
        setServicesData(servicesResponse);
      }
    };

    fetchServices();
  }, [clientData]);

  return (
    <div className=" container table-responsive">
      <h3>Otros Servicios del Cliente: {clientData ? clientData.razon_social : 'No client selected'}</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Dominio</th>
            <th>Estado</th>
            <th>Tipo de Servicio</th>
            <th>Plan Facturado</th>
            <th>Detalle del Plan</th>
            <th>Contrato</th>
          </tr>
        </thead>
        <tbody>
          {servicesData.length > 0 ? (
            servicesData.map((service, index) => (
              <tr key={index}>
                <td>{service.dominio}</td>
                <td>{service.estado}</td>
                <td>{service.tipo_servicio}</td>
                <td>{service.plan_facturado}</td>
                <td>{service.detalle_plan}</td>
                <td>{service.contrato}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No se encontraron servicios de este cliente.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ResumeTableClientServices;
