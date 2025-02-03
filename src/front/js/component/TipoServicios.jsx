import React from 'react'
export const servicios = [
    'Hw Linux',
    'Bd Mysql',
    'Hw Windows',
    'Bd Sql Server',
    'Mensajería',
    'Ddv',
    'Vmware',
    'Proxmox',
    'Hospedaje Dedicado Físico',
    'Respaldo y Recuperación',
    'Colocation Ru',
  ];
function TipoServicios() {
    
  
    return (
    <> 
          Servicios
          <ul>
            {servicios.map((servicio, index) => (
              <li key={index}>{servicio}</li>
            ))}
          </ul>
        </>
  )
}

export default TipoServicios