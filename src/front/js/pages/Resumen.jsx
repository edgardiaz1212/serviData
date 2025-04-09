// src/front/js/pages/Resumen.jsx
import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import ClientTypePieChart from "../component/ClientTypePieChart.jsx";
import ServiceTypeBarChart from "../component/ServiceTypeBarChart.jsx";
import TopServicesTable from "../component/TopservicesTable.jsx";
import ClientServiceTable from "../component/ClientServiceTable.jsx";
import "../../styles/resumen.css";
import ClientServicesBarChart from "../component/ClientServicesBarChart.jsx";
import PlatformServiceBarChart from "../component/PlatformServiceBarChart.jsx";
import NewServicesLineChart from "../component/NewServicesLineChart.jsx"; // <-- 1. Importar el nuevo gráfico

const Resumen = () => {
  const { store, actions } = useContext(Context);

  // Cargar todos los datos necesarios al montar el componente
  useEffect(() => {
    // Llamadas existentes
    actions.getServiceCountsByClientType("Pública");
    actions.getServiceCountsByClientType("Privada");
    actions.getTotalServices();
    actions.getTotalClients();
    actions.getNewServicesCurrentMonth();
    actions.getNewServicesPastMonth();
    actions.getServiceCountsByPlatform();
    // --- Nueva llamada ---
    actions.getNewServicesMonthlyTrend(); // <-- 2. Llamar a la nueva acción
    // --- Fin Nueva llamada ---
  }, []); // El array vacío asegura que se ejecute solo una vez

  // Cálculos para las tarjetas (sin cambios)
  const publicServicesCount = store.serviceCountsByClientType?.["Pública"] || 0;
  const privateServicesCount =
    store.serviceCountsByClientType?.["Privada"] || 0;
  const newServicesCurrentMonthCount = (store.newServicesCurrentMonth || [])
    .length;
  const newServicesPastMonthCount = (store.newServicesLastMonth || []).length;


  return (
    <>
      <div className="text-bg-light p-3">
        <strong>
          Resumen de servicios del DCCE: Datos clave y análisis para una gestión
          eficiente.
        </strong>
      </div>
      <div className="container">
        {/* --- Tarjetas --- */}
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
                <p className="card-text text-end">{store.totalServices || 0}</p>
              </div>
            </div>
          </div>

          {/* Tarjeta para total de clientes */}
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Cantidad total de Clientes</h5>
                <p className="card-text text-end">{store.totalClients || 0}</p>
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
        {/* --- Fin Tarjetas --- */}


        {/* --- Gráficos y Tablas --- */}
        <div className="row mt-2">
          {/* Columna Izquierda/Principal (Gráficos) */}
          <div className="col-lg-9"> {/* Ajustado a col-lg-9 para dar espacio a la tabla */}
            {/* Fila 1: Pie + Bar */}
            <div className="row p-2">
              <div className="col-md-5">
                <div className="card h-100"> {/* h-100 para intentar alinear alturas */}
                  <div className="card-body d-flex flex-column">
                    <ClientTypePieChart />
                  </div>
                </div>
              </div>
              <div className="col-md-7">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <ServiceTypeBarChart />
                  </div>
                </div>
              </div>
            </div>

            {/* Fila 2: Bar (Pública) + Bar (Privada) */}
            <div className="row p-2">
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <ClientServicesBarChart clientType="Pública" />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <ClientServicesBarChart clientType="Privada" />
                  </div>
                </div>
              </div>
            </div>

            {/* Fila 3: Bar (Plataforma) + Line (Tendencia Mensual) */}
            <div className="row p-2">
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <PlatformServiceBarChart />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">                    {/* <-- 3. Renderizar el nuevo gráfico --> */}
                    <NewServicesLineChart />
                  </div>
                </div>
              </div>
            </div>

          </div>
          {/* --- Fin Columna Izquierda/Principal --- */}

          {/* Columna Derecha (Tabla Top Servicios) */}
          <div className="col-lg-3"> {/* Ajustado a col-lg-3 */}
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Top Servicios</h5>
                <div className="flex-grow-1" style={{ overflowY: 'auto' }}> {/* Permite scroll si la tabla es muy larga */}
                   <TopServicesTable />
                </div>
              </div>
            </div>
          </div>
          {/* --- Fin Columna Derecha --- */}
        </div>
        {/* --- Fin Gráficos y Tablas --- */}


        {/* --- Tabla Inferior (Servicios por Cliente) --- */}
        <div className="row mt-2">
          <div className="col-12">
             <div className="card">
                <ClientServiceTable />
             </div>
          </div>
        </div>
        {/* --- Fin Tabla Inferior --- */}

      </div> {/* Fin container */}
    </>
  );
};

export default Resumen;
