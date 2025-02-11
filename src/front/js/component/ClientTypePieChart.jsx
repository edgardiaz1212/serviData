import React, { useEffect, useContext } from 'react';
import { Context } from "../store/appContext";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ClientTypePieChart = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getClientCountsByType();
  }, []);

  const data = {
    labels: Object.keys(store.clientCountsByType),
    datasets: [
      {
        label: 'Cantidad de Clientes',
        data: Object.values(store.clientCountsByType),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permitir que el gráfico se redimensione sin mantener la relación de aspecto
    plugins: {
      title: {
        display: true,
        text: 'Distribución de Clientes por Tipo',
        font: {
          size: 12,
        },
      },
    },
  };

  return (
    <div style={{ height: '400px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default ClientTypePieChart;