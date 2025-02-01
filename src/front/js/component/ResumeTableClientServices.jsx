import React from 'react';

function ResumeTableClientServices({ clientData }) {
  return (
    <div className="table-responsive">
      <h3>Cliente: {clientData ? clientData.razon_social : 'No client selected'}</h3>
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
          {clientData && clientData.servicios && clientData.servicios.map((service, index) => (
            <tr key={index}>
              <td>{service.dominio}</td>
              <td>{service.estado}</td>
              <td>{service.tipo_servicio}</td>
              <td>{service.plan_facturado}</td>
              <td>{service.detalle_plan}</td>
              <td>{service.contrato}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResumeTableClientServices;
