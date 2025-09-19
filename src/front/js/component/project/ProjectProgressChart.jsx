import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProjectProgressChart = ({ project }) => {
    if (!project || !project.phases) {
        return <div className="text-center text-gray-500">No hay datos para mostrar el gráfico</div>;
    }

    // Calculate cumulative planned progress
    const plannedData = [];
    const realData = [];
    const labels = [];
    let cumulativePlanned = 0;
    let cumulativeReal = 0;

    project.phases.forEach((phase, phaseIndex) => {
        if (phase.activities && phase.activities.length > 0) {
            phase.activities.forEach((activity, activityIndex) => {
                const label = `${phase.name} - ${activity.description}`;
                labels.push(label);

                // Planned progress (assuming linear distribution)
                const plannedPercent = activity.planned_percent || 0;
                cumulativePlanned += plannedPercent;
                plannedData.push(cumulativePlanned);

                // Real progress
                const realPercent = activity.real_percent || 0;
                cumulativeReal += realPercent;
                realData.push(cumulativeReal);
            });
        } else {
            // If no activities, use phase-level data
            const label = phase.name;
            labels.push(label);

            const plannedPercent = (phase.duration / project.total_duration) * 100;
            cumulativePlanned += plannedPercent;
            plannedData.push(cumulativePlanned);

            const realPercent = (phase.duration / project.total_duration) * 100; // Placeholder
            cumulativeReal += realPercent;
            realData.push(cumulativeReal);
        }
    });

    const data = {
        labels,
        datasets: [
            {
                label: 'Progreso Planificado (%)',
                data: plannedData,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.1,
                fill: false,
            },
            {
                label: 'Progreso Real (%)',
                data: realData,
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.1,
                fill: false,
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
                title: {
                    display: true,
                    text: 'Actividades/Fases'
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
