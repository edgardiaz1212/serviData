import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generatePDF } from '../component/PDFGenerator.jsx';
import { generateExcelServiciosActivos, generateExcelServiciosPublica, generateExcelServiciosPrivada } from '../component/ExcelGenerator.jsx';

function Reportes() {
    const { actions, store } = useContext(Context);
    const { isAuthenticated } = store;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Función para generar el PDF
    const handleGeneratePDF = async (tipoCliente) => {
        setLoading(true);
        try {
            let publicos = [];
            let privados = [];

            // Obtener todos los clientes
            const allClients = await actions.fetchClientData('');

            // Filtrar clientes según el tipo
            if (tipoCliente === "activos") {
                publicos = allClients.filter(cliente => cliente.tipo === "Pública");
                privados = allClients.filter(cliente => cliente.tipo === "Privada");
            } else if (tipoCliente === "publica") {
                publicos = allClients.filter(cliente => cliente.tipo === "Pública");
            } else if (tipoCliente === "privada") {
                privados = allClients.filter(cliente => cliente.tipo === "Privada");
            }

            // Generar y descargar el PDF
            await generatePDF(publicos, privados, tipoCliente);
        } catch (error) {
            toast.error('Error obteniendo datos de clientes: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para generar el Excel de Servicios Activos
    const handleGenerateExcelServiciosActivos = async () => {
        setLoading(true);
        try {
            // Obtener todos los clientes
            const allClients = await actions.fetchClientData('');

            // Filtrar clientes públicos y privados
            const clientesPublicos = allClients.filter(cliente => cliente.tipo === "Pública");
            const clientesPrivados = allClients.filter(cliente => cliente.tipo === "Privada");

            // Validar datos
            if (!Array.isArray(clientesPublicos) || !Array.isArray(clientesPrivados)) {
                throw new Error("Los datos de clientes deben ser arrays válidos");
            }

            // Generar el Excel
            await generateExcelServiciosActivos(clientesPublicos, clientesPrivados, actions);
        } catch (error) {
            toast.error('Error generando Excel: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para generar el Excel de Servicios Pública
    const handleGenerateExcelServiciosPublica = async () => {
        setLoading(true);
        try {
            // Obtener todos los clientes
            const allClients = await actions.fetchClientData('');

            // Filtrar clientes públicos
            const clientesPublicos = allClients.filter(cliente => cliente.tipo === "Pública");

            // Validar datos
            if (!Array.isArray(clientesPublicos)) {
                throw new Error("Los datos de clientes deben ser arrays válidos");
            }

            // Generar el Excel
            await generateExcelServiciosPublica(clientesPublicos, actions);
        } catch (error) {
            toast.error('Error generando Excel: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para generar el Excel de Servicios Privada
    const handleGenerateExcelServiciosPrivada = async () => {
        setLoading(true);
        try {
            // Obtener todos los clientes
            const allClients = await actions.fetchClientData('');

            // Filtrar clientes privados
            const clientesPrivados = allClients.filter(cliente => cliente.tipo === "Privada");

            // Validar datos
            if (!Array.isArray(clientesPrivados)) {
                throw new Error("Los datos de clientes deben ser arrays válidos");
            }

            // Generar el Excel
            await generateExcelServiciosPrivada(clientesPrivados, actions);
        } catch (error) {
            toast.error('Error generando Excel: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="container">
                <h1>Reportes</h1>
                <div className="row justify-content-between">
                    <div className="col-auto">
                        <h3>Clientes</h3>
                        <div className="col-auto">
                            {/* Botón para Clientes Activos */}
                            <p
                                className="pdf-link"
                                onClick={() => handleGeneratePDF("activos")}
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            >
                                Listado Clientes activos (pdf)
                            </p>

                            {/* Botón para Clientes Públicos */}
                            <p
                                className="pdf-link"
                                onClick={() => handleGeneratePDF("publica")}
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            >
                                Listado Clientes Pública (pdf)
                            </p>

                            {/* Botón para Clientes Privados */}
                            <p
                                className="pdf-link"
                                onClick={() => handleGeneratePDF("privada")}
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            >
                                Listado Clientes Privada (pdf)
                            </p>
                        </div>
                        <div className="col-auto">
                            <h3>Servicios</h3>
                            <p
                                className="pdf-link"
                                onClick={handleGenerateExcelServiciosActivos}
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            >
                                Servicios activos (xls)
                            </p>
                            <p
                                className="pdf-link"
                                onClick={handleGenerateExcelServiciosPublica}
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            >
                                Servicios Pública (xls)
                            </p>
                            <p
                                className="pdf-link"
                                onClick={handleGenerateExcelServiciosPrivada}
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            >
                                Servicios Privada (xls)
                            </p>
                            <p>Servicios retirados por mes (xls)</p>
                            <p>Servicios aprovisionados por mes en curso (xls)</p>
                            <p>Servicios aprovisionados por mes (xls)</p>
                            <p>Servicios aprovisionados por año (xls)</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Reportes;