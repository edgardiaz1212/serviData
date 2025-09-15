// src/front/js/component/NewServicesQuarterlyLineChart.jsx
import React, { useContext, useMemo } from 'react';
import { Context } from "../store/appContext";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

// Función para formatear trimestre (ej: 'Q1 2023')
const formatQuarterLabel = (quarter) => {
    if (!quarter || typeof quarter !== 'string') {
        return quarter;
    }
    // Asumimos formato 'Q1-2023' o similar
    return quarter.replace('-', ' ');
};

const NewServicesQuarterlyLineChart = () => {
    const { store } = useContext(Context);

    const processedData = useMemo(() => {
        const rawData = Array.isArray(store.newServicesQuarterlyTrend) ? store.newServicesQuarterlyTrend : [];

        const sortedData = [...rawData].sort((a, b) => {
            if (a.quarter < b.quarter) return -1;
            if (a.quarter > b.quarter) return 1;
            return 0;
        });

        const labels = sortedData.map(item => formatQuarterLabel(item.quarter));
        const dataPoints = sortedData.map(item => item.count);

        return { labels, dataPoints };
    }, [store.newServicesQuarterlyTrend]);

    const chartData = {
        labels: processedData.labels,
        datasets: [
            {
                label: 'Nuevos Servicios Aprovisionados',
                data: processedData.dataPoints,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
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
                text: 'Servicios Nuevos Aprovisionados por Trimestre',
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
                    text: 'Trimestre'
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

    if (!store.newServicesQuarterlyTrend || store.newServicesQuarterlyTrend.length === 0) {
        return <div className="text-center p-3" style={{ minHeight: '300px' }}>Cargando datos de tendencia trimestral...</div>;
    }

    return (
        <div style={{ position: 'relative', height: '300px' }}>
            <Line options={chartOptions} data={chartData} />
        </div>
    );
};

export default NewServicesQuarterlyLineChart;
