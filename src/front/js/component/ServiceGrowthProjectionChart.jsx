// src/front/js/component/ServiceGrowthProjectionChart.jsx
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

// Función para formatear meses de proyección
const formatProjectionLabel = (month) => {
    if (!month || typeof month !== 'string') {
        return month;
    }
    // Asumimos formato '2023-01' o similar
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'short' }).format(date);
};

const ServiceGrowthProjectionChart = () => {
    const { store } = useContext(Context);

    const processedData = useMemo(() => {
        // The API returns an object with projections array
        const projections = store.serviceGrowthProjection?.projections || [];

        const sortedData = [...projections].sort((a, b) => {
            if (a.month < b.month) return -1;
            if (a.month > b.month) return 1;
            return 0;
        });

        const labels = sortedData.map(item => formatProjectionLabel(item.month));
        const dataPoints = sortedData.map(item => item.count); // API uses 'count', not 'projected_count'

        return { labels, dataPoints };
    }, [store.serviceGrowthProjection]);

    const chartData = {
        labels: processedData.labels,
        datasets: [
            {
                label: 'Proyección de Crecimiento',
                data: processedData.dataPoints,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
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
                text: 'Proyección de Crecimiento de Servicios (6 Meses)',
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
                    text: 'Cantidad Proyectada'
                },
                ticks: {
                    precision: 0
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Mes'
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

    if (!store.serviceGrowthProjection || !store.serviceGrowthProjection.projections || store.serviceGrowthProjection.projections.length === 0) {
        return <div className="text-center p-3" style={{ minHeight: '300px' }}>Cargando datos de proyección de crecimiento...</div>;
    }

    return (
        <div style={{ position: 'relative', height: '300px' }}>
            <Bar options={chartOptions} data={chartData} />
        </div>
    );
};

export default ServiceGrowthProjectionChart;
