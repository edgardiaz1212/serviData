import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import ClientTypePieChart from "../component/ClientTypePieChart.jsx";
import ServiceTypeBarChart from "../component/ServiceTypeBarChart.jsx";
import TopServicesTable from "../component/TopservicesTable.jsx";
import ClientServiceTable from "../component/ClientServiceTable.jsx";
import "../../styles/resumen.css";
import ClientServicesBarChart from "../component/ClientServicesBarChart.jsx";

const Resumen = () => {
  const { store, actions } = useContext(Context);

  // Cargar datos al montar el componente
  useEffect(() => {
    actions.getServiceCountsByClientType();
    actions.getTotalServices();
    actions.getTotalClients();
    actions.getNewServicesCurrentMonth();
    actions.getNewServicesPastMonth();
  }, []);

  // Validar si servicesCountsByClientType está definido
  const publicServicesCount =
    store.serviceCountsByClientType?.["Pública"] || 0;
    console.log(publicServicesCount);
  const privateServicesCount =
    store.serviceCountsByClientType?.["Privada"] || 0;
    console.log(privateServicesCount);

  // Validar si newServicesCurrentMonth y newServicesPastMonth están definidos
  const newServicesCurrentMonthCount = (store.newServicesCurrentMonth || [])
    .length;
  const newServicesPastMonthCount = (store.newServicesPastMonth || []).length;

  return (
    <>
      <div className="text-bg-light p-3">
        Bienvenido a la plataforma para consultar servicios del DCCE!
      </div>
      <div className="container">
        <div className="row justify-content-md-center">
          {/* Tarjeta para servicios públicos */}
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Pública. Cantidad de servicios</h5>
                <p className="card-text text-end">{publicServicesCount}</p>
              </div>
            </div>
          </div>

          {/* Tarjeta para servicios privados */}
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Privada. Cantidad de servicios</h5>
                <p className="card-text text-end">{privateServicesCount}</p>
              </div>
            </div>
          </div>

          {/* Tarjeta para total de servicios */}
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Cantidad Total de servicios</h5>
                <p className="card-text text-end">
                  {store.totalServices || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta para total de clientes */}
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Cantidad total de Clientes</h5>
                <p className="card-text text-end">
                  {store.totalClients || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta para servicios aprovisionados el mes pasado */}
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Aprovisionado Mes Pasado</h5>
                <p className="card-text text-end">
                  {newServicesPastMonthCount}
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta para servicios aprovisionados el mes actual */}
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Aprovisionado Mes Actual</h5>
                <p className="card-text text-end">
                  {newServicesCurrentMonthCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos y tablas */}
        <div className="row mt-2">
          <div className="col">
            <div className="row p-2">
              {/* Gráfico de tipos de clientes */}
              <div className="col-md-5">
                <div className="card">
                  <div className="card-body">
                    <ClientTypePieChart />
                  </div>
                </div>
              </div>

              {/* Gráfico de tipos de servicios */}
              <div className="col-md-7">
                <div className="card">
                  <div className="card-body">
                    <ServiceTypeBarChart />
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos de servicios por tipo de cliente */}
            <div className="row p-2">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <ClientServicesBarChart clientType="Pública" />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <ClientServicesBarChart clientType="Privada" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de top servicios */}
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Top Servicios</h5>
                <TopServicesTable />
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de servicios por cliente */}
        <div className="row mt-2">
          <div className="card">
            <ClientServiceTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default Resumen;