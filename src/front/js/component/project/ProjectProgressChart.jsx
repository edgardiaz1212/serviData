import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-luxon';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const ProjectProgressChart = ({ project }) => {
    if (!project || !project.phases) {
        return <div className="text-center text-gray-500">No hay datos para mostrar el gráfico</div>;
    }

    // Collect all activities
    const activities = [];
    project.phases.forEach(phase => {
        if (phase.activities) {
            activities.push(...phase.activities);
        }
    });

    if (activities.length === 0) {
        return <div className="text-center text-gray-500">No hay actividades para mostrar el gráfico</div>;
    }

    // Calculate planned progress
    const activitiesWithPlanned = activities.filter(a => a.planned_end);
    activitiesWithPlanned.sort((a, b) => new Date(a.planned_end) - new Date(b.planned_end));
    let cumulativePlanned = 0;
    const plannedData = [];
    activitiesWithPlanned.forEach(activity => {
        cumulativePlanned += activity.planned_percent || 0;
        const date = new Date(activity.planned_end);
        plannedData.push({ x: date, y: Number(cumulativePlanned.toFixed(2)) });
    });

    // Calculate real progress
    const activitiesWithCompletion = activities.filter(a => a.completion_date);
    activitiesWithCompletion.sort((a, b) => new Date(a.completion_date) - new Date(b.completion_date));
    let cumulativeReal = 0;
    const realData = [];
    activitiesWithCompletion.forEach(activity => {
        cumulativeReal += activity.real_compliance || 0;
        const date = new Date(activity.completion_date);
        realData.push({ x: date, y: Number(cumulativeReal.toFixed(2)) });
    });

    const data = {
        datasets: [
            {
                label: 'Progreso Planificado (%)',
                data: plannedData,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: false,
                borderWidth: 2,
                pointRadius: 6,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
            },
            {
                label: 'Progreso Real (%)',
                data: realData,
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: false,
                borderWidth: 4,
                pointRadius: 8,
                pointBackgroundColor: 'rgb(16, 185, 129)',
                pointBorderColor: '#fff',
                pointBorderWidth: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Curva S - Progreso del Proyecto: ${project.name}`,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
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
                    text: 'Progreso (%)'
                }
            },
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM DD'
                    }
                },
                title: {
                    display: true,
                    text: 'Fechas'
                }
            }
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <Line data={data} options={options} />
        </div>
    );
};

export default ProjectProgressChart;
