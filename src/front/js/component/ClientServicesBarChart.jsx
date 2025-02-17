import React, { useEffect, useContext, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Context } from "../store/appContext";

const ClientServicesBarChart = ({ clientType }) => {
  const { actions } = useContext(Context);
  const [services, setServices] = useState({});

  useEffect(() => {
    const fetchServices = async () => {
      const data = await actions.getServiceCountsByClientType(clientType);
      setServices(data || {});
    };

    fetchServices();
  }, [clientType]);

  const data = {
    labels: Object.keys(services),
    datasets: [
      {
        label: `Servicios para clientes de tipo ${clientType}`,
        data: Object.values(services),
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