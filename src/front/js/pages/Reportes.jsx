import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generatePDF } from '../component/PDFGenerator.jsx';
import {
    generateExcelServiciosActivos,
    generateExcelServiciosPublica,
    generateExcelServiciosPrivada,
    generateExcelServiciosRetiradosMesActual,
    generateExcelServiciosAprovisionadosMesActual,
    generateExcelServiciosAprovisionadosPorMes,
    generateExcelServiciosAprovisionadosPorAno,
    generarExcelDataCompleta,
} from '../component/ExcelGenerator.jsx';
import {FileChartLine} from 'lucide-react';

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

            // Obtener datos según el tipo de cliente
            if (tipoCliente === "activos") {
                publicos = await actions.getClientbyTipo('Pública');
                privados = await actions.getClientbyTipo('Privada');
            } else if (tipoCliente === "publica") {
                publicos = await actions.getClientbyTipo('Pública');
            } else if (tipoCliente === "privada") {
                privados = await actions.getClientbyTipo('Privada');
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
          await generateExcelServiciosActivos(actions);
        } catch (error) {
          toast.error('Error generando Excel: ' + error.message);
        } finally {
          setLoading(false);
        }
      };
      // Función para generar el Excel de Servicios Publica
      const handleGenerateExcelServiciosPublica = async () => {
        setLoading(true);
        try {
          await generateExcelServiciosPublica(actions);
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
          await generateExcelServiciosPrivada(actions);
        } catch (error) {
          toast.error('Error generando Excel: ' + error.message);
        } finally {
          setLoading(false);
        }
      };

    // Función para generar el Excel de Servicios Retirados por Mes en Curso
    const handleGenerateExcelServiciosRetiradosMesActual = async () => {
        setLoading(true);
        try {
            await generateExcelServiciosRetiradosMesActual(actions);
        } catch (error) {
            toast.error('Error generando Excel: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para generar el Excel de Servicios Aprovisionados por Mes en Curso
    const handleGenerateExcelServiciosAprovisionadosMesActual = async () => {
        setLoading(true);
        try {
            await generateExcelServiciosAprovisionadosMesActual(actions);
        } catch (error) {
            toast.error('Error generando Excel: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para generar el Excel de Servicios Aprovisionados por Mes (Año Actual)
    const handleGenerateExcelServiciosAprovisionadosPorMes = async () => {
        setLoading(true);
        try {
            await generateExcelServiciosAprovisionadosPorMes(actions);
        } catch (error) {
            toast.error('Error generando Excel: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para generar el Excel de Servicios Aprovisionados por Año
    const handleGenerateExcelServiciosAprovisionadosPorAno = async () => {
        setLoading(true);
        try {
            await generateExcelServiciosAprovisionadosPorAno(actions);
        } catch (error) {
            toast.error('Error generando Excel: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para generar el Excel de Servicios Aprovisionados por Año
    const handleGenerateExcelDataCompleta = async () => {
        setLoading(true);
        try {
            await generarExcelDataCompleta(actions);
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
                <h1><FileChartLine /> Reportes</h1>
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
                            <p
                                className="pdf-link"
                                onClick={handleGenerateExcelServiciosRetiradosMesActual}
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            >
                                Servicios retirados por mes en curso (xls)
                            </p>
                            <p
                                className="pdf-link"
                                onClick={handleGenerateExcelServiciosAprovisionadosMesActual}
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            >
                                Servicios Nuevos aprovisionados por mes en curso (xls)
                            </p>
                            <p
                                className="pdf-link"
                                onClick={handleGenerateExcelServiciosAprovisionadosPorMes}
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            >
                                Servicios Nuevos aprovisionados por mes (xls)
                            </p>
                            <p
                                className="pdf-link"
                                onClick={handleGenerateExcelServiciosAprovisionadosPorAno}
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            >
                                Servicios Nuevos aprovisionados por año (xls)
                            
                            </p>
                            <p
                                className="pdf-link"
                                onClick={handleGenerateExcelDataCompleta}
                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                            >
                                Todos los servicios  (xls)
                            
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Reportes;