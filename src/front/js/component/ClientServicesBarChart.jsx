// src/front/js/component/ClientServicesBarChart.jsx
import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import { Context } from "../store/appContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; // Importar elementos necesarios

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ClientServicesBarChart = ({ clientType }) => {
  const { store } = useContext(Context); // No necesitamos actions si los datos se cargan en Resumen

  // Filtrar los datos del store según el tipo de cliente de forma segura
  const serviceCountsByType = store.serviceCountsByType || {};
  const servicesForClientType = serviceCountsByType[clientType] || {};

  // Extraer etiquetas (tipos de servicio) y datos (conteos)
  const labels = Object.keys(servicesForClientType);
  const dataPoints = Object.values(servicesForClientType);

  // Preparar los datos para el gráfico
  const data = {
    labels: labels,
    datasets: [
      {
        // Label más conciso para la leyenda
        label: `Cantidad`,
        data: dataPoints,
        // Puedes variar el color según el clientType si lo deseas
        backgroundColor: clientType === 'Pública' ? 'rgba(54, 162, 235, 0.6)' : 'rgba(255, 99, 132, 0.6)', // Azul para Pública, Rojo para Privada (ejemplo)
        borderColor: clientType === 'Pública' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Opciones del gráfico, incluyendo el título
  const options = {
    responsive: true, // Hacer el gráfico responsivo
    maintainAspectRatio: false, // Permitir que el contenedor CSS controle la altura
    plugins: {
      legend: {
        display: false, // Ocultar leyenda si el título ya es descriptivo
        // position: 'top', // O mostrarla si prefieres
      },
      title: { // <-- Configuración del título
        display: true, // <-- Habilitar título
        text: `Detalle Servicios Cliente ${clientType}`, // <-- Texto del título dinámico
        font: {
            size: 16 // Tamaño de fuente opcional
        }
      },
      tooltip: {
        // Puedes personalizar tooltips si es necesario
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { // Título para el eje Y
          display: true,
          text: 'Cantidad'
        },
        ticks: { // Asegurar que los ticks sean enteros
             precision: 0
        }
      },
      x: {
        title: { // Título para el eje X
          display: true,
          text: 'Tipo de Servicio'
        }
      }
    },
  };

  // Mostrar un mensaje o nada si no hay datos para este tipo de cliente
  if (labels.length === 0) {
      return <div className="text-center p-3" style={{ minHeight: '300px' }}>No hay datos de servicios para clientes de tipo {clientType}.</div>;
  }

  // Retornar el componente Bar directamente (sin div contenedor extra aquí)
  return <Bar data={data} options={options} />;
};

export default ClientServicesBarChart;
