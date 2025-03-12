import React from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import logo from '../../img/CDHLogo.png';
// Estilos para el PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    table: {
        display: "table",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
    },
    tableRow: {
        flexDirection: "row",
    },
    tableColHeader: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        backgroundColor: "#f2f2f2",
        padding: 5,
        fontWeight: "bold",
    },
    tableCol: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000",
        padding: 5,
    },
});

// Componente para el PDF
const InformePDF = ({ razonSocial, rif, servicios }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Encabezado con logo y título */}
            <View style={styles.header}>
                <Image src={logo} style={styles.logo} /> {/* Cambia la ruta del logo */}
                <Text style={styles.title}>Datos de {razonSocial} - RIF: {rif}</Text>
            </View>

            {/* Tabla de servicios */}
            <View style={styles.table}>
                {/* Encabezado de la tabla */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableColHeader}>Tipo de Servicio</Text>
                    <Text style={styles.tableColHeader}>Contrato</Text>
                    <Text style={styles.tableColHeader}>Dominio</Text>
                    <Text style={styles.tableColHeader}>Estado</Text>
                </View>

                {/* Filas de la tabla */}
                {servicios.map((servicio, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.tableCol}>{servicio.tipo_servicio}</Text>
                        <Text style={styles.tableCol}>{servicio.contrato}</Text>
                        <Text style={styles.tableCol}>{servicio.dominio}</Text>
                        <Text style={styles.tableCol}>{servicio.estado_servicio}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

// Componente principal para generar el PDF
const GenerarInformePDF = ({ razonSocial, rif, servicios }) => (
    <PDFDownloadLink
        document={<InformePDF razonSocial={razonSocial} rif={rif} servicios={servicios} />}
        fileName={`informe-${razonSocial}.pdf`}
    >
        {({ loading }) => (loading ? "Generando PDF..." : "Descargar Informe PDF")}
    </PDFDownloadLink>
);

export default GenerarInformePDF;