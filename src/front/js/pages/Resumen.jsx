import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import ClientTypePieChart from "../component/ClientTypePieChart.jsx";
import ServiceTypeBarChart from "../component/ServiceTypeBarChart.jsx";
import TopServicesTable from "../component/TopservicesTable.jsx";
import ClientServiceTable from "../component/ClientServiceTable.jsx";
import "../../styles/resumen.css";

const Resumen = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getServiceCountsByClientType();
    actions.getTotalServices();
    actions.getTotalClients();
  }, []);

  const publicServicesCount = store.servicesCountsByClientType["Pública"] || 0;
  const privateServicesCount = store.servicesCountsByClientType["Privada"] || 0;

  return (
    <>
      <div className="text-bg-light p-3">
        Bienvenido a la plataforma para consultar servicios del DCCE!
      </div>
      <div className="container  ">
        <div className="row justify-content-md-center ">
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Cantidad de servicios Publicos</h5>
                <p className="card-text text-end">{publicServicesCount}</p>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Cantidad de servicios Privados</h5>
                <p className="card-text text-end">{privateServicesCount}</p>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Cantidad de servicios</h5>
                <p className="card-text text-end">{store.totalServices}</p>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Cantidad de Clientes</h5>
                <p className="card-text text-end">{store.totalClients}</p>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Aprovisionamiento Mes pasado</h5>
                <p className="card-text text-end">{store.totalClients}</p>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Aprovisionamiento Mes Actual</h5>
                <p className="card-text text-end">{store.totalClients}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <ClientTypePieChart />
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="card">
              <div className="card-body">
                <ServiceTypeBarChart />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Top Servicios</h5>
                <TopServicesTable />
              </div>
            </div>
          </div>
        </div>
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
