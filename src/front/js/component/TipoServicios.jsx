import React from 'react'
export const servicios = [
    'HW LINUX',
    'BD MYSQL',
    'HW WINDOWS',
    'BD SQL SERVER',
    'MENSAJERIA',
    'DDV',
    'HOSPEDAJE DEDICADO',
    'RESPALDO Y RECUPERACION',
    'COLOCATION RU',
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