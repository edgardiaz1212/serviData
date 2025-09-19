import React from 'react';
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

const ProjectProgressChart = ({ project }) => {
    const generateSCurveData = () => {
        if (!project.start_date || !project.end_date) {
            return { labels: [], plannedData: [], actualData: [] };
        }

        const startDate = new Date(project.start_date);
        const endDate = new Date(project.end_date);
        const today = new Date();

        // Generate weekly data points
        const weeks = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            weeks.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 7); // Add one week
        }

        // Ensure end date is included
        if (weeks[weeks.length - 1].getTime() !== endDate.getTime()) {
            weeks.push(new Date(endDate));
        }

        const totalDuration = endDate.getTime() - startDate.getTime();
        const labels = weeks.map(week => week.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }));

        // Planned progress (linear)
        const plannedData = weeks.map(week => {
            const elapsed = week.getTime() - startDate.getTime();
            const progress = Math.min((elapsed / totalDuration) * 100, 100);
            return Math.round(progress * 100) / 100; // Round to 2 decimal places
        });

        // Actual progress (S-curve approximation)
        // For simplicity, assume actual progress follows planned until current date, then plateaus
        const actualData = weeks.map((week, index) => {
            if (week <= today) {
                // If the week is in the past or current, use actual progress
                const elapsed = Math.min(today.getTime() - startDate.getTime(), totalDuration);
                const baseProgress = (elapsed / totalDuration) * 100;
                // Apply S-curve factor (sigmoid-like)
                const sCurveProgress = 100 / (1 + Math.exp(-0.1 * (baseProgress - 50)));
                return Math.min(sCurveProgress, project.avance_real || 0);
            } else {
                // Future weeks show current actual progress
                return project.avance_real || 0;
            }
        });

        return { labels, plannedData, actualData };
    };

    const { labels, plannedData, actualData } = generateSCurveData();

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Avance Planificado (%)',
                data: plannedData,
                fill: false,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgb(54, 162, 235)',
                tension: 0.4,
                pointRadius: 3,
            },
            {
                label: 'Avance Real (%)',
                data: actualData,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgb(255, 99, 132)',
                tension: 0.4,
                pointRadius: 3,
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
                text: 'Curva S - Avance del Proyecto',
                font: {
                    size: 16
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Avance (%)'
                },
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Tiempo'
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

    if (!project.start_date || !project.end_date) {
        return <div className="text-center p-3" style={{ minHeight: '300px' }}>
            No hay fechas definidas para mostrar la curva S
        </div>;
    }

    return (
        <div style={{ position: 'relative', height: '400px' }}>
            <Line options={chartOptions} data={chartData} />
        </div>
    );
};

export default ProjectProgressChart;
