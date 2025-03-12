import React from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import logo from '../../img/CDHLogo.png';

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
        // borderStyle: "solid",
        // borderWidth: 1,
        // borderColor: "#000",
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

const InformePDF = ({ razonSocial, rif, servicios }) => {
    // Función para verificar si una columna está vacía o contiene solo ceros
    const isColumnEmpty = (columnData) => {
        return columnData.every(value => !value);
    };

    // Extraer datos de las columnas
    const tipoServicioData = servicios.map(servicio => servicio.tipo_servicio);
    const contratoData = servicios.map(servicio => servicio.contrato);
    const dominioData = servicios.map(servicio => servicio.dominio);
    const estadoServicioData = servicios.map(servicio => servicio.estado_servicio);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image src={logo} style={styles.logo} />
                    <Text style={styles.title}>Datos de {razonSocial} - RIF: {rif}</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        {!isColumnEmpty(tipoServicioData) && <Text style={styles.tableColHeader}>Tipo de Servicio</Text>}
                        {!isColumnEmpty(contratoData) && <Text style={styles.tableColHeader}>Contrato</Text>}
                        {!isColumnEmpty(dominioData) && <Text style={styles.tableColHeader}>Dominio</Text>}
                        {!isColumnEmpty(estadoServicioData) && <Text style={styles.tableColHeader}>Estado</Text>}
                    </View>

                    {servicios.map((servicio, index) => (
                        <View key={index} style={styles.tableRow}>
                            {!isColumnEmpty(tipoServicioData) && <Text style={styles.tableCol}>{servicio.tipo_servicio || ""}</Text>}
                            {!isColumnEmpty(contratoData) && <Text style={styles.tableCol}>{servicio.contrato || ""}</Text>}
                            {!isColumnEmpty(dominioData) && <Text style={styles.tableCol}>{servicio.dominio || ""}</Text>}
                            {!isColumnEmpty(estadoServicioData) && <Text style={styles.tableCol}>{servicio.estado_servicio || ""}</Text>}
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

const GenerarInformePDF = ({ razonSocial, rif, servicios }) => (
    <PDFDownloadLink
        document={<InformePDF razonSocial={razonSocial} rif={rif} servicios={servicios} />}
        fileName={`informe-${razonSocial}.pdf`}
    >
        {({ loading }) => (loading ? "Generando PDF..." : "Descargar Informe PDF")}
    </PDFDownloadLink>
);

export default GenerarInformePDF;