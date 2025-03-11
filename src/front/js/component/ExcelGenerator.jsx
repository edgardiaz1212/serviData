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

// Función para obtener el mes y año actual
const getCurrentMonthAndYear = () => {
    const now = new Date();
    return {
        month: now.getMonth() + 1, // Mes actual (1-12)
        year: now.getFullYear(),   // Año actual
    };
};

// Función para generar el Excel de Servicios Retirados por Mes en Curso
export const generateExcelServiciosRetiradosMesActual = async (actions) => {
    const { month, year } = getCurrentMonthAndYear();

    // Obtener servicios retirados en el mes actual
    const serviciosRetirados = await actions.getServiciosRetiradosPorMes(month, year);

    // Crear la hoja de cálculo
    const wsData = [
        ["Razón Social", "RIF", "Contrato", "Dominio", "Hostname", "Tipo de Servicio"],
    ];

    // Agregar datos
    serviciosRetirados.forEach(servicio => {
        wsData.push([
            servicio.cliente.razon_social,
            servicio.cliente.rif,
            servicio.contrato,
            servicio.dominio,
            servicio.hostname,
            servicio.tipo_servicio,
        ]);
    });

    // Crear el libro de Excel
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Servicios Retirados");

    // Descargar el archivo
    XLSX.writeFile(wb, `servicios-retirados-${month}-${year}.xlsx`);
};

// Función para generar el Excel de Servicios Aprovisionados por Mes en Curso
export const generateExcelServiciosAprovisionadosMesActual = async (actions) => {
    const { month, year } = getCurrentMonthAndYear();

    // Obtener servicios aprovisionados en el mes actual
    const serviciosAprovisionados = await actions.getServiciosAprovisionadosPorMes(month, year);

    // Crear la hoja de cálculo
    const wsData = [
        ["Razón Social", "RIF", "Contrato", "Dominio", "Hostname", "Tipo de Servicio"],
    ];

    // Agregar datos
    serviciosAprovisionados.forEach(servicio => {
        wsData.push([
            servicio.cliente.razon_social,
            servicio.cliente.rif,
            servicio.contrato,
            servicio.dominio,
            servicio.hostname,
            servicio.tipo_servicio,
        ]);
    });

    // Crear el libro de Excel
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Servicios Aprovisionados");

    // Descargar el archivo
    XLSX.writeFile(wb, `servicios-aprovisionados-${month}-${year}.xlsx`);
};

// Función para generar el Excel de Servicios Aprovisionados por Mes (Año Actual)
export const generateExcelServiciosAprovisionadosPorMes = async (actions) => {
    const year = new Date().getFullYear();

    // Obtener servicios aprovisionados por mes en el año actual
    const serviciosPorMes = await actions.getServiciosAprovisionadosPorMesAnual(year);

    // Crear la hoja de cálculo
    const wsData = [
        ["Mes", "Razón Social", "RIF", "Contrato", "Dominio", "Hostname", "Tipo de Servicio"],
    ];

    // Agregar datos
    serviciosPorMes.forEach(grupo => {
        const mes = grupo.mes;
        grupo.servicios.forEach(servicio => {
            wsData.push([
                mes,
                servicio.cliente.razon_social,
                servicio.cliente.rif,
                servicio.contrato,
                servicio.dominio,
                servicio.hostname,
                servicio.tipo_servicio,
            ]);
        });
    });

    // Crear el libro de Excel
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Servicios por Mes");

    // Descargar el archivo
    XLSX.writeFile(wb, `servicios-aprovisionados-por-mes-${year}.xlsx`);
};
// Función para generar el Excel de Servicios Aprovisionados por Año
export const generateExcelServiciosAprovisionadosPorAno = async (actions) => {
    try {
        // Obtener servicios aprovisionados por año
        const serviciosPorAno = await actions.getServiciosAprovisionadosPorAno();

        // Crear la hoja de cálculo
        const wsData = [
            ["Año", "Razón Social", "RIF", "Contrato", "Dominio", "Hostname", "Tipo de Servicio"],
        ];

        // Agregar datos
        serviciosPorAno.forEach(grupo => {
            const ano = grupo.ano;  // Obtener el año
            grupo.servicios.forEach(servicio => {
                // Validar que servicio.cliente exista
                if (servicio.cliente) {
                    wsData.push([
                        ano,
                        servicio.cliente.razon_social,
                        servicio.cliente.rif,
                        servicio.contrato,
                        servicio.dominio,
                        servicio.hostname,
                        servicio.tipo_servicio,
                    ]);
                } else {
                    console.warn("Servicio sin cliente:", servicio);
                }
            });
        });

        // Crear el libro de Excel
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Servicios por Año");

        // Descargar el archivo
        XLSX.writeFile(wb, `servicios-aprovisionados-por-ano.xlsx`);
    } catch (error) {
        console.error("Error generando Excel:", error);
        throw error;
    }
};