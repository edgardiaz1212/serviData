import React from 'react';
import { pdf, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import logo from '../../img/CDHLogo.png';

// Estilos para el PDF
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 50,
        height: 25,
        marginRight: 10,
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
const PdfDocument = ({ publicos, privados, tipoCliente }) => (
    <Document>
        {/* Página 1: Clientes Públicos */}
        {tipoCliente === "activos" || tipoCliente === "publica" ? (
            <Page style={styles.page}>
                {/* Encabezado con logo y título */}
                <View style={styles.header}>
                    <Image src={logo} style={styles.logo} />
                    <Text style={styles.title}>Clientes Públicos DCCE</Text>
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
            </Page>
        ) : null}

        {/* Página 2: Clientes Privados */}
        {tipoCliente === "activos" || tipoCliente === "privada" ? (
            <Page style={styles.page}>
                {/* Encabezado con logo y título */}
                <View style={styles.header}>
                    <Image src={logo} style={styles.logo} />
                    <Text style={styles.title}>Clientes Privados DCCE</Text>
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
        ) : null}
    </Document>
);

// Función para generar y descargar el PDF
export const generatePDF = async (publicos, privados, tipoCliente) => {
    const blob = await pdf(<PdfDocument publicos={publicos} privados={privados} tipoCliente={tipoCliente} />).toBlob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clientes-${tipoCliente}-${new Date().toLocaleDateString()}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url); // Liberar memoria
};