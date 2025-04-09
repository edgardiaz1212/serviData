// src/front/js/component/NewServicesLineChart.jsx
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
    TimeScale, // Necesario si usas adaptadores de fecha, aunque aquí usaremos categorías
} from 'chart.js';
// Opcional: Importar adaptador de fecha si prefieres ejes de tiempo reales
// import 'chartjs-adapter-date-fns'; // o 'chartjs-adapter-moment', etc.
// import { es } from 'date-fns/locale'; // Para formato en español

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    // TimeScale // Registrar si usas adaptador de fecha
);

// Función para formatear 'YYYY-MM' a 'Mmm YYYY' (ej: 'Ene 2023')
const formatMonthLabel = (yearMonth) => {
    if (!yearMonth || typeof yearMonth !== 'string' || !yearMonth.includes('-')) {
        return yearMonth; // Devuelve original si no es el formato esperado
    }
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1); // Meses son 0-indexados
    // Usar Intl para formato localizado y abreviado
    return new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'short' }).format(date);
};


const NewServicesLineChart = () => {
    const { store } = useContext(Context); // No necesitamos actions aquí si se llaman desde Resumen

    // Usamos useMemo para procesar los datos solo cuando cambien en el store
    const processedData = useMemo(() => {
        // Asumimos que store.newServicesMonthlyTrend es [{ month: 'YYYY-MM', count: N }, ...]
        const rawData = store.newServicesMonthlyTrend || [];

        // 1. Asegurarse de que los datos estén ordenados por mes
        const sortedData = [...rawData].sort((a, b) => {
            // Comparar como cadenas 'YYYY-MM' funciona para orden cronológico
            if (a.month < b.month) return -1;
            if (a.month > b.month) return 1;
            return 0;
        });

        // 2. Extraer etiquetas (meses formateados) y datos (conteos)
        const labels = sortedData.map(item => formatMonthLabel(item.month));
        const dataPoints = sortedData.map(item => item.count);

        return { labels, dataPoints };

    }, [store.newServicesMonthlyTrend]); // Dependencia: recalcular si cambian los datos

    // Preparar datos para la gráfica
    const chartData = {
        labels: processedData.labels,
        datasets: [
            {
                label: 'Nuevos Servicios Aprovisionados',
                data: processedData.dataPoints,
                fill: false, // No rellenar área bajo la línea
                borderColor: 'rgb(54, 162, 235)', // Color de la línea (azul)
                tension: 0.1 // Suavidad de la curva (0 para líneas rectas)
            },
        ],
    };

    // Opciones de la gráfica
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Permite controlar mejor la altura
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Servicios Nuevos Aprovisionados por Mes', // Título de la gráfica
                font: {
                    size: 16
                }
            },
            tooltip: {
                mode: 'index', // Muestra tooltip para todos los puntos en el mismo índice (mes)
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
                // Sugerir que los ticks sean enteros si los números son bajos
                ticks: {
                    precision: 0
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Mes'
                },
                // Rotar etiquetas si son muchas para evitar solapamiento
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                }
            }
        },
        interaction: { // Mejora la interacción con el tooltip
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    // Mostrar mensaje si no hay datos o están cargando
    if (!store.newServicesMonthlyTrend || store.newServicesMonthlyTrend.length === 0) {
        return <div className="text-center p-3" style={{ minHeight: '300px' }}>Cargando datos de tendencia mensual...</div>;
    }

    // Definir una altura mínima o específica para el contenedor del gráfico
    return (
        <div style={{ position: 'relative', height: '300px' }}> {/* Ajusta la altura según necesites */}
            <Line options={chartOptions} data={chartData} />
        </div>
    );
};

export default NewServicesLineChart;
