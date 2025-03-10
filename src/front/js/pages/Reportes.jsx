import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Reportes() {
    const { actions, store } = useContext(Context);
    const { isAuthenticated } = store;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pdfData, setPdfData] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const generateClientesActivosPDF = async () => {
        setLoading(true);
        try {
            // Obtener datos de clientes públicos y privados
            const publicos = await actions.getClientbyTipo('Pública');
            const privados = await actions.getClientbyTipo('Privada');

            // Preparar los datos para el PDF
            setPdfData({ publicos, privados });
        } catch (error) {
            toast.error('Error obteniendo datos de clientes: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Definir estilos para el PDF
    const styles = StyleSheet.create({
        page: {
            padding: 30,
            fontSize: 12,
        },
        section: {
            marginBottom: 20,
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        table: {
            display: 'table',
            width: 'auto',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#000',
        },
        tableRow: {
            margin: 'auto',
            flexDirection: 'row',
        },
        tableCol: {
            width: '50%',
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#000',
            padding: 5,
        },
    });

    // Componente PDF
    const PdfDocument = ({ publicos, privados }) => (
        <Document>
            <Page style={styles.page}>
                {/* Título */}
                <View style={styles.section}>
                    <Text style={styles.title}>Clientes Activos DCCE</Text>
                </View>

                {/* Tabla Clientes Públicos */}
                <View style={styles.section}>
                    <Text style={styles.title}>Clientes Públicos:</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, { fontWeight: 'bold' }]}>Razón Social</Text>
                            <Text style={[styles.tableCol, { fontWeight: 'bold' }]}>RIF</Text>
                        </View>
                        {publicos.map((cliente, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCol}>{cliente.razon_social}</Text>
                                <Text style={styles.tableCol}>{cliente.rif}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Tabla Clientes Privados */}
                <View style={styles.section}>
                    <Text style={styles.title}>Clientes Privados:</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCol, { fontWeight: 'bold' }]}>Razón Social</Text>
                            <Text style={[styles.tableCol, { fontWeight: 'bold' }]}>RIF</Text>
                        </View>
                        {privados.map((cliente, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCol}>{cliente.razon_social}</Text>
                                <Text style={styles.tableCol}>{cliente.rif}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );

    return (
        <>
            <ToastContainer />
            <div className="container">
                <h1>Reportes</h1>
                <div className="row justify-content-between">
                    <div className="col-auto">
                        <h3>Clientes</h3>
                        <div className="col-auto">
                            {pdfData ? (
                                <PDFDownloadLink
                                    document={<PdfDocument publicos={pdfData.publicos} privados={pdfData.privados} />}
                                    fileName={`clientes-activos-${new Date().toLocaleDateString()}.pdf`}
                                >
                                    {({ blob, url, loading, error }) =>
                                        loading ? 'Generando PDF...' : 'Descargar PDF'
                                    }
                                </PDFDownloadLink>
                            ) : (
                                <p
                                    className="pdf-link"
                                    onClick={generateClientesActivosPDF}
                                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                >
                                    Listado Clientes activos (pdf)
                                </p>
                            )}
                            <p>Listado Clientes Pública (pdf)</p>
                            <p>Listado Clientes Privada (pdf)</p>
                        </div>
                        <div className="col-auto">
                            <h3>Servicios</h3>
                            <p>Servicios activos</p>
                            <p>Servicios Pública</p>
                            <p>Servicios Privada</p>
                            <p>Servicios retirados por mes</p>
                            <p>Servicios aprovisionados por mes en curso</p>
                            <p>Servicios aprovisionados por mes</p>
                            <p>Servicios aprovisionados por año</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Reportes;