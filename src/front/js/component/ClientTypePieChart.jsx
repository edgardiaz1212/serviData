import React, { useContext, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Context } from '../store/appContext';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables);
Chart.register(ChartDataLabels);

const ClientTypePieChart = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getClientCountsByType();
  }, [actions]);

  const data = {
    labels: Object.keys(store.clientCountsByType),
    datasets: [
      {
        data: Object.values(store.clientCountsByType),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 163, 235, 0.47)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 163, 235, 1)',
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
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const total = tooltipItem.dataset.data.reduce((acc, value) => acc + value, 0);
            const currentValue = tooltipItem.raw;
            const percentage = ((currentValue / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}%`;
          },
        },
      },
      datalabels: {
        formatter: (value, ctx) => {
          const total = ctx.chart.data.datasets[0].data.reduce((acc, value) => acc + value, 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`;
        },
        color: '#fff',
      },
    },
  };

  return (
    <div>
      <p>Distribución de Clientes por Tipo</p>
      <Pie data={data} options={options} />
    </div>
  );
};

export default ClientTypePieChart;
