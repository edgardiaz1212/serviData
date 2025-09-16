// src/front/js/component/NewServicesYearlyLineChart.jsx
import React, { useContext, useMemo } from 'react';
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
    Legend,
);

const NewServicesYearlyLineChart = () => {
    const { store } = useContext(Context);

    const processedData = useMemo(() => {
        const rawData = Array.isArray(store.newServicesYearlyTrend) ? store.newServicesYearlyTrend : [];

        const sortedData = [...rawData].sort((a, b) => {
            if (a.year < b.year) return -1;
            if (a.year > b.year) return 1;
            return 0;
        });

        const labels = sortedData.map(item => item.year.toString());
        const dataPoints = sortedData.map(item => item.count);

        return { labels, dataPoints };
    }, [store.newServicesYearlyTrend]);

    const chartData = {
        labels: processedData.labels,
        datasets: [
            {
                label: 'Nuevos Servicios Aprovisionados',
                data: processedData.dataPoints,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Servicios Nuevos Aprovisionados por Año',
                font: {
                    size: 16
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Cantidad de Servicios'
                },
                ticks: {
                    precision: 0
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Año'
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    if (!store.newServicesYearlyTrend || store.newServicesYearlyTrend.length === 0) {
        return <div className="text-center p-3" style={{ minHeight: '300px' }}>Cargando datos de tendencia anual...</div>;
    }

    return (
        <div style={{ position: 'relative', height: '300px' }}>
            <Bar options={chartOptions} data={chartData} />
        </div>
    );
};

export default NewServicesYearlyLineChart;
