import React from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

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
})

const InformePDF = ({ razonSocial, rif, servicios }) => {
    const isColumnEmpty = (columnData) => {
        return columnData.every(value => !value);
    };

    const tipoServicioData = servicios.map(servicio => servicio.tipo_servicio);
    const contratoData = servicios.map(servicio => servicio.contrato);
    const dominioData = servicios.map(servicio => servicio.dominio);
    const hostnameData = servicios.map(servicio => servicio.hostname);
    const planServicioData = servicios.map(servicio => servicio.plan_servicio);
    const ramData = servicios.map(servicio => servicio.ram);
    const hddData = servicios.map(servicio => servicio.hdd);
    const cpuData = servicios.map(servicio => servicio.cpu);
    const cantidadRuData = servicios.map(servicio => servicio.cantidad_ru);
    const cantidadM2Data = servicios.map(servicio => servicio.cantidad_m2);

    return (
        <Document>
            <Page size="letter" orientation="landscape" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Centro De Datos El Hatillo</Text>
                    <Text style={styles.title}>Datos de {razonSocial} - RIF: {rif}</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        {!isColumnEmpty(tipoServicioData) && <Text style={styles.tableColHeader}>Tipo de Servicio</Text>}
                        {!isColumnEmpty(contratoData) && <Text style={styles.tableColHeader}>Contrato</Text>}
                        {!isColumnEmpty(dominioData) && <Text style={styles.tableColHeader}>Dominio</Text>}
                        {!isColumnEmpty(hostnameData) && <Text style={styles.tableColHeader}>Hostname</Text>}
                        {!isColumnEmpty(planServicioData) && <Text style={styles.tableColHeader}>Plan de Servicio</Text>}
                        {!isColumnEmpty(ramData) && <Text style={styles.tableColHeader}>RAM</Text>}
                        {!isColumnEmpty(hddData) && <Text style={styles.tableColHeader}>HDD</Text>}
                        {!isColumnEmpty(cpuData) && <Text style={styles.tableColHeader}>CPU</Text>}
                        {!isColumnEmpty(cantidadRuData) && <Text style={styles.tableColHeader}>Cantidad Unidades Rack</Text>}
                        {!isColumnEmpty(cantidadM2Data) && <Text style={styles.tableColHeader}>Cantidad m2</Text>}
                    </View>

                    {servicios.map((servicio, index) => (
                        <View key={index} style={styles.tableRow}>
                            {!isColumnEmpty(tipoServicioData) && <Text style={styles.tableCol}>{servicio.tipo_servicio || ""}</Text>}
                            {!isColumnEmpty(contratoData) && <Text style={styles.tableCol}>{servicio.contrato || ""}</Text>}
                            {!isColumnEmpty(dominioData) && <Text style={styles.tableCol}>{servicio.dominio || ""}</Text>}
                            {!isColumnEmpty(hostnameData) && <Text style={styles.tableCol}>{servicio.hostname || ""}</Text>}
                            {!isColumnEmpty(planServicioData) && <Text style={styles.tableCol}>{servicio.plan_servicio || ""}</Text>}
                            {!isColumnEmpty(ramData) && <Text style={styles.tableCol}>{servicio.ram || ""}</Text>}
                            {!isColumnEmpty(hddData) && <Text style={styles.tableCol}>{servicio.hdd || ""}</Text>}
                            {!isColumnEmpty(cpuData) && <Text style={styles.tableCol}>{servicio.cpu || ""}</Text>}
                            {!isColumnEmpty(cantidadRuData) && <Text style={styles.tableCol}>{servicio.cantidad_ru || ""}</Text>}
                            {!isColumnEmpty(cantidadM2Data) && <Text style={styles.tableCol}>{servicio.cantidad_m2 || ""}</Text>}
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