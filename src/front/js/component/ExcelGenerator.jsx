import * as XLSX from 'xlsx';

// Función para generar y descargar el Excel de Servicios Activos
export const generateExcelServiciosActivos = async (clientesPublicos, clientesPrivados, servicios) => {
    // Crear la hoja de cálculo
    const wsData = [
        ["Cliente", "Tipo de Servicio", "Total de Servicios Activos"],
    ];

    // Agregar datos de clientes públicos
    clientesPublicos.forEach(cliente => {
        servicios.forEach(servicio => {
            wsData.push([cliente.razon_social, servicio.tipo_servicio, servicio.count]);
        });
    });

    // Agregar datos de clientes privados
    clientesPrivados.forEach(cliente => {
        servicios.forEach(servicio => {
            wsData.push([cliente.razon_social, servicio.tipo_servicio, servicio.count]);
        });
    });

    // Crear el libro de Excel
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Servicios Activos");

    // Descargar el archivo
    XLSX.writeFile(wb, `servicios-activos-${new Date().toLocaleDateString()}.xlsx`);
};

// Función para generar y descargar el Excel de Servicios Pública
export const generateExcelServiciosPublica = async (clientesPublicos, servicios) => {
    // Crear la hoja de cálculo
    const wsData = [
        ["Razón Social", "Tipo de Servicio", "Cantidad"],
    ];

    // Agregar datos
    clientesPublicos.forEach(cliente => {
        servicios.forEach(servicio => {
            wsData.push([cliente.razon_social, servicio.tipo_servicio, servicio.count]);
        });
    });

    // Crear el libro de Excel
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Servicios Pública");

    // Descargar el archivo
    XLSX.writeFile(wb, `servicios-publica-${new Date().toLocaleDateString()}.xlsx`);
};

// Función para generar y descargar el Excel de Servicios Privada
export const generateExcelServiciosPrivada = async (clientesPrivados, servicios) => {
    // Crear la hoja de cálculo
    const wsData = [
        ["Razón Social", "Tipo de Servicio", "Cantidad"],
    ];

    // Agregar datos
    clientesPrivados.forEach(cliente => {
        servicios.forEach(servicio => {
            wsData.push([cliente.razon_social, servicio.tipo_servicio, servicio.count]);
        });
    });

    // Crear el libro de Excel
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Servicios Privada");

    // Descargar el archivo
    XLSX.writeFile(wb, `servicios-privada-${new Date().toLocaleDateString()}.xlsx`);
};