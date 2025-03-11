import * as XLSX from 'xlsx';


// Función para contar servicios por tipo, excluyendo los retirados
const countServicesByType = (servicios) => {
    const counts = {};

    servicios.forEach(servicio => {
        // Filtrar servicios que no estén retirados
        if (servicio.estado_servicio !== "Retirado") {
            const tipoServicio = servicio.tipo_servicio;
            if (!counts[tipoServicio]) {
                counts[tipoServicio] = 0;
            }
            counts[tipoServicio]++;
        }
    });

    return counts;
};

// Función para generar y descargar el Excel de Servicios Activos
export const generateExcelServiciosActivos = async (clientesPublicos, clientesPrivados, actions) => {
    // Crear la hoja de cálculo
    const wsData = [
        ["Cliente", "Tipo de Cliente", "Tipo de Servicio", "Cantidad"],
    ];

    // Agregar datos de clientes públicos
    for (const cliente of clientesPublicos) {
        const servicios = await actions.getServicebyClient(cliente.id);
        const counts = countServicesByType(servicios);

        for (const [tipoServicio, count] of Object.entries(counts)) {
            wsData.push([
                cliente.razon_social,
                "Pública",
                tipoServicio,
                count,
            ]);
        }
    }

    // Agregar datos de clientes privados
    for (const cliente of clientesPrivados) {
        const servicios = await actions.getServicebyClient(cliente.id);
        const counts = countServicesByType(servicios);

        for (const [tipoServicio, count] of Object.entries(counts)) {
            wsData.push([
                cliente.razon_social,
                "Privada",
                tipoServicio,
                count,
            ]);
        }
    }

    // Crear el libro de Excel
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Servicios Activos");

    // Descargar el archivo
    XLSX.writeFile(wb, `servicios-activos-${new Date().toLocaleDateString()}.xlsx`);
};

// Función para generar y descargar el Excel de Servicios Pública
export const generateExcelServiciosPublica = async (clientesPublicos, actions) => {
    // Crear la hoja de cálculo
    const wsData = [
        ["Razón Social", "Tipo de Servicio", "Cantidad"],
    ];

    // Agregar datos de clientes públicos
    for (const cliente of clientesPublicos) {
        const servicios = await actions.getServicebyClient(cliente.id);
        const counts = countServicesByType(servicios);

        for (const [tipoServicio, count] of Object.entries(counts)) {
            wsData.push([
                cliente.razon_social,
                tipoServicio,
                count,
            ]);
        }
    }

    // Crear el libro de Excel
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Servicios Pública");

    // Descargar el archivo
    XLSX.writeFile(wb, `servicios-publica-${new Date().toLocaleDateString()}.xlsx`);
};

// Función para generar y descargar el Excel de Servicios Privada
export const generateExcelServiciosPrivada = async (clientesPrivados, actions) => {
    // Crear la hoja de cálculo
    const wsData = [
        ["Razón Social", "Tipo de Servicio", "Cantidad"],
    ];

    // Agregar datos de clientes privados
    for (const cliente of clientesPrivados) {
        const servicios = await actions.getServicebyClient(cliente.id);
        const counts = countServicesByType(servicios);

        for (const [tipoServicio, count] of Object.entries(counts)) {
            wsData.push([
                cliente.razon_social,
                tipoServicio,
                count,
            ]);
        }
    }

    // Crear el libro de Excel
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Servicios Privada");

    // Descargar el archivo
    XLSX.writeFile(wb, `servicios-privada-${new Date().toLocaleDateString()}.xlsx`);
};