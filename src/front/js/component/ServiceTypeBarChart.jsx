import React, { useEffect, useContext } from 'react';
import { Context } from "../store/appContext";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ServiceTypeBarChart = () => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    // Considera si esta llamada es redundante si ya se hace en Resumen.jsx
    // Si Resumen.jsx ya la llama, puedes quitar este useEffect.
    if (!store.serviceCountsByType || Object.keys(store.serviceCountsByType).length === 0) {
        actions.getServiceCountsByType();
    }
  }, [actions, store.serviceCountsByType]); // Añadir dependencias

  const serviceCountsByType = store.serviceCountsByType || {};

  const labels = [];
  const datasets = [];
  const clientColors = {}; // Para asignar colores consistentes por tipo de cliente

  // Paleta de colores base (puedes expandirla o usar una librería)
  const colorPalette = [
    'rgba(54, 162, 235, 0.6)', // Azul
    'rgba(255, 99, 132, 0.6)', // Rojo
    'rgba(255, 206, 86, 0.6)', // Amarillo
    'rgba(75, 192, 192, 0.6)', // Verde azulado
    'rgba(153, 102, 255, 0.6)', // Púrpura
    'rgba(255, 159, 64, 0.6)'  // Naranja
  ];
  let colorIndex = 0;

  // Obtener todos los tipos de servicio únicos primero
  Object.keys(serviceCountsByType).forEach(clienteTipo => {
    Object.keys(serviceCountsByType[clienteTipo]).forEach(servicioTipo => {
      if (!labels.includes(servicioTipo)) {
        labels.push(servicioTipo);
      }
    });
  });
  labels.sort(); // Ordenar alfabéticamente los tipos de servicio

  // Crear los datasets por tipo de cliente
  Object.keys(serviceCountsByType).forEach(clienteTipo => {
    // Asignar un color si no lo tiene ya
    if (!clientColors[clienteTipo]) {
        clientColors[clienteTipo] = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;
    }
    const backgroundColor = clientColors[clienteTipo];
    // Crear borde ligeramente más oscuro
    const borderColor = backgroundColor.replace('0.6', '1');

    const data = labels.map(servicioTipo => serviceCountsByType[clienteTipo][servicioTipo] || 0);
    datasets.push({
      label: clienteTipo, // Usar el tipo de cliente como etiqueta del dataset
      data: data,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 1,
    });
  });

  const data = {
    labels: labels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Correcto: permite que CSS controle la altura
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Servicios por Tipo y Cliente', // Título más corto
        font: { size: 16 } // Puedes ajustar el tamaño
      },
      tooltip: {
        mode: 'index', // Muestra tooltips para todas las barras en ese índice
        intersect: false,
      }
    },
    scales: { // Opcional: apilar las barras si tiene sentido
        x: {
            stacked: true, // Apila barras del mismo tipo de servicio
            title: { display: true, text: 'Tipo de Servicio' }
        },
        y: {
            stacked: true, // Apila barras del mismo tipo de servicio
            beginAtZero: true,
            title: { display: true, text: 'Cantidad' }
        }
    }
  };

  // Retorna directamente el componente Bar, sin el div con altura fija
  return <Bar data={data} options={options} />;
};

export default ServiceTypeBarChart;
