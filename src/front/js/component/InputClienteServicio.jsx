import React from 'react';

function InputClienteServicio({ clientData }) {
  return (
    <>
      <h3>Datos del Cliente</h3>
      <input type="text" value={clientData ? clientData.rif : ''} readOnly={!!clientData} placeholder="RIF" />
      <input type="text" value={clientData ? clientData.razon_social : ''} readOnly={!!clientData} placeholder="Razón Social" />
      <select defaultValue={clientData ? clientData.tipo : ''} disabled={!!clientData}>
        <option value="">Seleccione Tipo</option>
        <option value="publica">Pública</option>
        <option value="privada">Privada</option>
      </select>

      <h3>Datos de identificación del servicio</h3>
      <input type="text" placeholder="Dominio" />
      <input type="text" placeholder="Tipo de Servicio" />
      <input type="text" placeholder="Hostname" />

      <h3>Estado y contratación</h3>
      <input type="text" placeholder="Estado" />
      <input type="text" placeholder="Contrato" />
      <input type="text" placeholder="Plan Aprovisionado" />
      <input type="text" placeholder="Plan Facturado" />
      <input type="text" placeholder="Detalle del Plan" />
      <input type="text" placeholder="Facturado" />

      <h3>Recursos del servidor</h3>
      <input type="number" placeholder="Cores" />
      <input type="number" placeholder="Sockets" />
      <input type="number" placeholder="RAM (GB)" />
      <input type="number" placeholder="HDD (GB)" />
      <input type="number" placeholder="CPU (GHz)" />

      <h3>Datos de red</h3>
      <input type="text" placeholder="IP Privada" />
      <input type="text" placeholder="VLAN" />
      <input type="text" placeholder="IPAM" />

      <h3>Infraestructura</h3>
      <input type="text" placeholder="Datastore" />
      <input type="text" placeholder="Nombre del Servidor" />
      <input type="text" placeholder="Marca del Servidor" />
      <input type="text" placeholder="Modelo del Servidor" />
      <input type="text" placeholder="Nombre del Nodo" />
      <input type="text" placeholder="Nombre de la Plataforma" />
      <input type="text" placeholder="Tipo de Servidor" />
      <input type="text" placeholder="Ubicación" />

      <h3>Otros</h3>
      <input type="text" placeholder="Estado de Energía" />
      <input type="text" placeholder="Observaciones" />
      <input type="text" placeholder="Comentarios" />
    </>
  );
}

export default InputClienteServicio;
