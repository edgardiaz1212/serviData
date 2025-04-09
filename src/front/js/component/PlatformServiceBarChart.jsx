// src/front/js/component/PlatformServiceBarChart.jsx
import React, { useContext, useEffect } from 'react';
import { Context } from "../store/appContext";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const PlatformServiceBarChart = () => {
    const { store, actions } = useContext(Context);

    // Opcional: Si quieres que este componente específico dispare la carga de datos
    // aunque es mejor hacerlo en la página principal (Resumen.jsx) como ya lo tienes.
    // useEffect(() => {
    //     if (!store.serviceCountsByPlatform || store.serviceCountsByPlatform.length === 0) {
    //         actions.getServiceCountsByPlatform();
    //     }
    // }, []); // Dependencia vacía para que se ejecute solo una vez al montar

    // Preparar datos para la gráfica
    const chartData = {
        labels: store.serviceCountsByPlatform?.map(item => item.nombre_plataforma) || [],
        datasets: [
            {
                label: 'Cantidad de Servicios',
                data: store.serviceCountsByPlatform?.map(item => item.count) || [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color de las barras
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Opciones de la gráfica
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // Posición de la leyenda
            },
            title: {
                display: true,
                text: 'Servicios por Plataforma', // Título de la gráfica
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true, // Empezar el eje Y en 0
                title: {
                    display: true,
                    text: 'Cantidad' // Título del eje Y
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Plataforma' // Título del eje X
                }
            }
        },
    };

    // Mostrar mensaje si no hay datos
    if (!store.serviceCountsByPlatform || store.serviceCountsByPlatform.length === 0) {
        // Puedes decidir si mostrar un mensaje de carga o simplemente nada
        // Si la acción se llama en Resumen.jsx, puede que brevemente no haya datos
        return <div className="text-center p-3">Cargando datos de plataformas...</div>;
        // O podrías retornar null si prefieres no mostrar nada hasta que haya datos
        // return null;
    }

    return <Bar options={chartOptions} data={chartData} />;
};

export default PlatformServiceBarChart;
