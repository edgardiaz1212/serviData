import React, { useEffect, useContext } from 'react';
import { Context } from "../store/appContext";

const TopServicesTable = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getTopServices();
  }, []);

  return (
    <div className="table-responsive ">
      <table className="table  table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">Tipo de Servicio</th>
            <th scope="col">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {store.topServices.map((service, index) => (
            <tr key={index}>
              <td>{service.tipo_servicio}</td>
              <td>{service.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopServicesTable;