import React, { useEffect, useContext } from 'react';
import { Context } from "../store/appContext";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ServiceTypeBarChart = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getServiceCountsByType();
  }, []);

  const serviceCountsByType = store.serviceCountsByType || {}; // Default to empty object if undefined or null


  const labels = [];
  const datasets = [];

  Object.keys(serviceCountsByType).forEach(clienteTipo => {
    Object.keys(serviceCountsByType[clienteTipo]).forEach(servicioTipo => {
      if (!labels.includes(servicioTipo)) {
        labels.push(servicioTipo);
      }
    });
  });

  Object.keys(serviceCountsByType).forEach(clienteTipo => {
    const data = labels.map(servicioTipo => serviceCountsByType[clienteTipo][servicioTipo] || 0);
    datasets.push({
      label: clienteTipo,
      data: data,
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
      borderWidth: 1,
    });
  });

  const data = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permitir que el gráfico se redimensione sin mantener la relación de aspecto
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cantidad de Servicios por Tipo de Servicio y Tipo de Cliente',
      },
    },
  };

  return (
    <div style={{ height: '400px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ServiceTypeBarChart;