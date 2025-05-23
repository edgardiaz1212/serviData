import * as XLSX from "xlsx";

// Función para contar servicios por tipo, excluyendo los retirados
const countServicesByType = (servicios) => {
  const counts = {};

  servicios.forEach((servicio) => {
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
export const generateExcelServiciosActivos = async (actions) => {
    try {
      // Obtener todos los servicios activos
      const serviciosActivos = await actions.getServiciosActivos();
  
      // Crear la hoja de cálculo
      const wsData = [
        ["Cliente", "Tipo de Cliente", "Tipo de Servicio", "Cantidad"],
      ];
  
      // Agrupar servicios por cliente y tipo de cliente
      const groupedServices = {};
      serviciosActivos.forEach((servicio) => {
        const cliente = servicio.cliente; // Asumiendo que el servicio tiene un campo `cliente`
        if (!groupedServices[cliente.id]) {
          groupedServices[cliente.id] = {
            razon_social: cliente.razon_social,
            tipo: cliente.tipo,
            servicios: [],
          };
        }
        groupedServices[cliente.id].servicios.push(servicio);
      });
  
      // Agregar datos agrupados a la hoja de cálculo
      for (const clienteId in groupedServices) {
        const cliente = groupedServices[clienteId];
        const counts = countServicesByType(cliente.servicios);
        for (const [tipoServicio, count] of Object.entries(counts)) {
          wsData.push([cliente.razon_social, cliente.tipo, tipoServicio, count]);
        }
      }
  
      // Crear el libro de Excel
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Servicios Activos");
  
      // Descargar el archivo
      XLSX.writeFile(
        wb,
        `servicios-activos-${new Date().toLocaleDateString()}.xlsx`
      );
    } catch (error) {
      console.error("Error generando Excel:", error);
      throw error;
    }
  };
// Función para generar y descargar el Excel de Servicios Pública
 
      // Filtrar servicios públicos
      export const generateExcelServiciosPublica = async (actions) => {
        try {
          // Obtener todos los servicios activos
          const serviciosActivos = await actions.getServiciosActivos();
      
          // Filtrar servicios privados
          const serviciosPrivados = serviciosActivos.filter(
            (servicio) => servicio.cliente.tipo === "Pública"
          );
      
          // Crear la hoja de cálculo
          const wsData = [["Razón Social", "Tipo de Servicio", "Cantidad"]];
      
          // Agrupar servicios por cliente
          const groupedServices = {};
          serviciosPrivados.forEach((servicio) => {
            const cliente = servicio.cliente;
            if (!groupedServices[cliente.id]) {
              groupedServices[cliente.id] = {
                razon_social: cliente.razon_social,
                servicios: [],
              };
            }
            groupedServices[cliente.id].servicios.push(servicio);
          });
      
          // Contar servicios por tipo para cada cliente
          for (const clienteId in groupedServices) {
            const cliente = groupedServices[clienteId];
            const counts = countServicesByType(cliente.servicios);
            for (const [tipoServicio, count] of Object.entries(counts)) {
              wsData.push([cliente.razon_social, tipoServicio, count]);
            }
          }
      
          // Crear el libro de Excel
          const ws = XLSX.utils.aoa_to_sheet(wsData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Servicios Pública");
      
          // Descargar el archivo
          XLSX.writeFile(
            wb,
            `servicios-publica-${new Date().toLocaleDateString()}.xlsx`
          );
        } catch (error) {
          console.error("Error generando Excel:", error);
          throw error;
        }
      };

// Función para generar y descargar el Excel de Servicios Privada
export const generateExcelServiciosPrivada = async (actions) => {
    try {
      // Obtener todos los servicios activos
      const serviciosActivos = await actions.getServiciosActivos();
  
      // Filtrar servicios privados
      const serviciosPrivados = serviciosActivos.filter(
        (servicio) => servicio.cliente.tipo === "Privada"
      );
  
      // Crear la hoja de cálculo
      const wsData = [["Razón Social", "Tipo de Servicio", "Cantidad"]];
  
      // Agrupar servicios por cliente
      const groupedServices = {};
      serviciosPrivados.forEach((servicio) => {
        const cliente = servicio.cliente;
        if (!groupedServices[cliente.id]) {
          groupedServices[cliente.id] = {
            razon_social: cliente.razon_social,
            servicios: [],
          };
        }
        groupedServices[cliente.id].servicios.push(servicio);
      });
  
      // Contar servicios por tipo para cada cliente
      for (const clienteId in groupedServices) {
        const cliente = groupedServices[clienteId];
        const counts = countServicesByType(cliente.servicios);
        for (const [tipoServicio, count] of Object.entries(counts)) {
          wsData.push([cliente.razon_social, tipoServicio, count]);
        }
      }
  
      // Crear el libro de Excel
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Servicios Privada");
  
      // Descargar el archivo
      XLSX.writeFile(
        wb,
        `servicios-privada-${new Date().toLocaleDateString()}.xlsx`
      );
    } catch (error) {
      console.error("Error generando Excel:", error);
      throw error;
    }
  };

// Función para obtener el mes y año actual
const getCurrentMonthAndYear = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1, // Mes actual (1-12)
    year: now.getFullYear(), // Año actual
  };
};

// Función para generar el Excel de Servicios Retirados por Mes en Curso
export const generateExcelServiciosRetiradosMesActual = async (actions) => {
  const { month, year } = getCurrentMonthAndYear();

  // Obtener servicios retirados en el mes actual
  const serviciosRetirados = await actions.getServiciosRetiradosPorMes(
    month,
    year
  );

  // Crear la hoja de cálculo
  const wsData = [
    [
      "Razón Social",
      "RIF",
      "Tipo de Servicio",
      "Contrato",
      "Dominio",
      "Hostname",
      "Plan Facturado",
      "Dominio",
      "Hostname",
      "IP Publica",
      "IP Privada",
    ],
  ];

  // Agregar datos
  serviciosRetirados.forEach((servicio) => {
    wsData.push([
      servicio.cliente.razon_social,
      servicio.cliente.rif,
      servicio.tipo_servicio,
      String(servicio.contrato || ''), ,
      servicio.plan_facturado,
      servicio.dominio,
      servicio.hostname,
      servicio.ip_publica,
      servicio.ip_privada,
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
export const generateExcelServiciosAprovisionadosMesActual = async (
  actions
) => {
  const { month, year } = getCurrentMonthAndYear();

  // Obtener servicios aprovisionados en el mes actual
  const serviciosAprovisionados =
    await actions.getServiciosAprovisionadosPorMes(month, year);

  // Crear la hoja de cálculo
  const wsData = [
    [
      "Razón Social",
      "RIF",
      "Tipo de Servicio",
      "Contrato",
      "Dominio",
      "Hostname",
      "Plan Facturado",
      "Dominio",
      "Hostname",
      "IP Publica",
      "IP Privada",
    ],
  ];

  // Agregar datos
  serviciosAprovisionados.forEach((servicio) => {
    wsData.push([
      servicio.cliente.razon_social,
      servicio.cliente.rif,
      servicio.tipo_servicio,
      String(servicio.contrato || ''), ,
      servicio.plan_facturado,
      servicio.dominio,
      servicio.hostname,
      servicio.ip_publica,
      servicio.ip_privada,
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
  const serviciosPorMes = await actions.getServiciosAprovisionadosPorMesAnual(
    year
  );

  // Crear la hoja de cálculo
  const wsData = [
    [
      "Mes",
      "Razón Social",
      "RIF",
      "Tipo de Servicio",
      "Contrato",
      "Dominio",
      "Hostname",
      "Plan Facturado",
      "Dominio",
      "Hostname",
      "IP Publica",
      "IP Privada",
    ],
  ];

  // Agregar datos
  serviciosPorMes.forEach((grupo) => {
    const mes = grupo.mes;
    grupo.servicios.forEach((servicio) => {
      wsData.push([
        mes,
        servicio.cliente.razon_social,
        servicio.cliente.rif,
        servicio.tipo_servicio,
        String(servicio.contrato || ''), ,
        servicio.plan_facturado,
        servicio.dominio,
        servicio.hostname,
        servicio.ip_publica,
        servicio.ip_privada,
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
      [
        "Año",
        "Razón Social",
        "RIF",
        "Tipo de Servicio",
        "Contrato",
        "Dominio",
        "Hostname",
        "Plan Facturado",
        "Dominio",
        "Hostname",
        "IP Publica",
        "IP Privada",
      ],
    ];

    // Agregar datos
    serviciosPorAno.forEach((grupo) => {
      const ano = grupo.ano; // Obtener el año
      grupo.servicios.forEach((servicio) => {
        // Validar que servicio.cliente exista
        if (servicio.cliente) {
          wsData.push([
            ano,
            servicio.cliente.razon_social,
            servicio.cliente.rif,
            servicio.tipo_servicio,
            String(servicio.contrato || ''), ,
            servicio.plan_facturado,
            servicio.dominio,
            servicio.hostname,
            servicio.ip_publica,
            servicio.ip_privada,
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

// Función para generar el Excel de Todos Servicios y clientes


export const generarExcelDataCompleta = async (actions) => {
    try {
        // Obtener servicios y clientes
        const dataCompleta = await actions.getCompleteClientServices();
        const { clientes, servicios } = dataCompleta;

        // Crear la hoja de clientes
        const clientesWsData = [
            ["Razón Social", "Tipo", "RIF", "Fecha de Creación", "Fecha de Actualización"],
        ];
        clientes.forEach(cliente => {
            clientesWsData.push([
                cliente.razon_social,
                cliente.tipo,
                cliente.rif,
                cliente.created_at ? new Date(cliente.created_at).toLocaleString() : '',
                cliente.updated_at ? new Date(cliente.updated_at).toLocaleString() : '',
            ]);
        });

        // Crear la hoja de servicios
        const serviciosWsData = [
            [
                "Razón Social", "Contrato", "Tipo de Servicio", "Estado del Contrato", "Facturado",
                "Plan Anterior", "Plan Facturado", "Plan Aprovisionado", "Plan de Servicio", "Descripción", "Estado del Servicio",
                "Dominio", "DNS del Dominio", "Ubicación", "Ubicación en la Sala", "Cantidad de RU", "Cantidad de m2", "Cantidad de Bastidores",
                "Hostname", "Nombre del Servidor", "Nombre del Nodo", "Nombre de la Plataforma", "RAM (GB)", "HDD (GB)", "CPU (GHz)", "Datastore",
                "IP Privada", "IP Pública", "VLAN", "IPAM", "Observaciones", "Comentarios", "Fecha de Creación", "Fecha de Actualización"
            ],
        ];
        servicios.forEach(servicio => {
            serviciosWsData.push([
                servicio.cliente ? servicio.cliente.razon_social : '',
                String(servicio.contrato || ''), ,
                servicio.tipo_servicio,
                servicio.estado_contrato,
                servicio.facturado,
                servicio.plan_anterior,
                servicio.plan_facturado,
                servicio.plan_aprovisionado,
                servicio.plan_servicio,
                servicio.descripcion,
                servicio.estado_servicio,
                servicio.dominio,
                servicio.dns_dominio,
                servicio.ubicacion,
                servicio.ubicacion_sala,
                servicio.cantidad_ru,
                servicio.cantidad_m2,
                servicio.cantidad_bastidores,
                servicio.hostname,
                servicio.nombre_servidor,
                servicio.nombre_nodo,
                servicio.nombre_plataforma,
                servicio.ram,
                servicio.hdd,
                servicio.cpu,
                servicio.datastore,
                servicio.ip_privada,
                servicio.ip_publica,
                servicio.vlan,
                servicio.ipam,
                servicio.observaciones,
                servicio.comentarios,
                servicio.created_at ? new Date(servicio.created_at).toLocaleString() : '',
                servicio.updated_at ? new Date(servicio.updated_at).toLocaleString() : '',
            ]);
        });

        // Crear las hojas de Excel
        const clientesWs = XLSX.utils.aoa_to_sheet(clientesWsData);
        const serviciosWs = XLSX.utils.aoa_to_sheet(serviciosWsData);

        // Agregar filtros a la primera fila
        clientesWs['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: 0, c: clientesWsData[0].length - 1 } }) };
        serviciosWs['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: 0, c: serviciosWsData[0].length - 1 } }) };

        // Crear el libro de Excel
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, clientesWs, "Clientes");
        XLSX.utils.book_append_sheet(wb, serviciosWs, "Servicios");

        // Descargar el archivo
        XLSX.writeFile(wb, `datos-completos-${new Date().toLocaleDateString()}.xlsx`);
    } catch (error) {
        console.error("Error generando Excel:", error);
        throw error;
    }
};

