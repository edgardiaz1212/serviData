import React from 'react';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register the required components
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
    const data = {
        labels: ['Usuario 1', 'Usuario 2'],
        datasets: [
            {
                data: [50, 50], // Example data
                backgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    const barData = {
        labels: ['Servicio 1', 'Servicio 2', 'Servicio 3', 'Servicio 4', 'Servicio 5', 'Servicio 6', 'Servicio 7', 'Servicio 8', 'Servicio 9', 'Servicio 10'],
        datasets: [
            {
                label: 'Usuario 1',
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Example data
                backgroundColor: '#36A2EB',
            },
            {
                label: 'Usuario 2',
                data: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1], // Example data
                backgroundColor: '#FF6384',
            },
        ],
    };

    return (
        <div>
            <h1>Bienvenido al Panel de Control</h1>
            <table>
                <thead>
                    <tr>
                        <th>Servicio</th>
                        <th>Usuario 1</th>
                        <th>Usuario 2</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Servicio 1</td><td>1</td><td>10</td></tr>
                    <tr><td>Servicio 2</td><td>2</td><td>9</td></tr>
                    <tr><td>Servicio 3</td><td>3</td><td>8</td></tr>
                    <tr><td>Servicio 4</td><td>4</td><td>7</td></tr>
                    <tr><td>Servicio 5</td><td>5</td><td>6</td></tr>
                    <tr><td>Servicio 6</td><td>6</td><td>5</td></tr>
                    <tr><td>Servicio 7</td><td>7</td><td>4</td></tr>
                    <tr><td>Servicio 8</td><td>8</td><td>3</td></tr>
                    <tr><td>Servicio 9</td><td>9</td><td>2</td></tr>
                    <tr><td>Servicio 10</td><td>10</td><td>1</td></tr>
                </tbody>
            </table>
            <div>
                <h2>Distribución de Servicios</h2>
                <Pie data={data} />
            </div>
            <div>
                <h2>Distribución por Servicios</h2>
                <Bar data={barData} />
            </div>
        </div>  
    );
};

export default Dashboard;
