import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';


Chart.register(ArcElement, Tooltip, Legend);

const ClientServicesPieChart = ({ servicesData }) => {
  if (!servicesData || servicesData.length === 0) {
    return <p>No hay datos de servicios para mostrar.</p>;
  }

  // Count services by tipo_servicio
  const serviceTypeCounts = servicesData.reduce((acc, service) => {
    const type = service.tipo_servicio || 'Desconocido';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(serviceTypeCounts),
    datasets: [
      {
        data: Object.values(serviceTypeCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: '50%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          font: {
            size: 10,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '200px', height: '200px' }} >
      <h6 className="text-center">Distribución de Servicios Activos</h6>
      <Pie data={data} options={options} />
    </div>
  );
};

export default ClientServicesPieChart;
