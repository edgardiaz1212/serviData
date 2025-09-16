# TODO: Agregar gráfica de torta y fecha de contrato en DetalleCliente

## Pasos a completar:

1. **Crear componente ClientServicesPieChart.jsx**
   - Crear un componente de gráfica de torta que muestre la distribución de servicios del cliente por tipo_servicio.
   - Usar react-chartjs-2 con Pie chart.
   - Recibir servicesData como prop y calcular los conteos.

2. **Editar DetalleCliente.jsx**
   - Agregar la fecha de creación del cliente (fecha_creacion_cliente) en la sección de datos del cliente.
   - Importar y agregar el componente ClientServicesPieChart en la página, pasando servicesData.
   - Asegurar que la gráfica sea pequeña (usar estilos apropiados).

3. **Probar la implementación**
   - Verificar que la fecha se muestre correctamente.
   - Verificar que la gráfica renderice con los datos correctos.
   - Ajustar estilos si es necesario.
