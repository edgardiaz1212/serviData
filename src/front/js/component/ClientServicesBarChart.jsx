import React, { useEffect, useContext } from "react";
import { Bar } from "react-chartjs-2";
import { Context } from "../store/appContext";

const ClientServicesBarChart = ({ clientType }) => {
  const { store } = useContext(Context);

  // Filtrar los datos del store según el tipo de cliente
  const serviceCountsByType = store.serviceCountsByType || {};
  const servicesForClientType = serviceCountsByType[clientType] || {};

  // Preparar los datos para el gráfico
  const data = {
    labels: Object.keys(servicesForClientType),
    datasets: [
      {
        label: `Servicios para clientes de tipo ${clientType}`,
        data: Object.values(servicesForClientType),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ClientServicesBarChart;