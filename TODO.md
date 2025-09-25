# TODO: Modificar Gráfico de Progreso del Proyecto

## Tareas Pendientes
- [x] Editar src/front/js/component/project/ProjectProgressChart.jsx para cambiar eje X a fechas planificadas
  - [x] Importar TimeScale de chart.js y registrarlo
  - [x] Modificar cálculo de datos: aplanar actividades, ordenar por planned_end, crear etiquetas de fecha
  - [x] Actualizar opciones del gráfico: eje X como escala de tiempo con título "Fechas Planificadas"
- [x] Probar el gráfico en el navegador para verificar que Y es porcentaje y X son fechas

## Notas
- Mantener Y como porcentaje acumulativo (0-100%)
- Usar fechas de fin planificadas de actividades para X
- Si no hay fechas, mostrar mensaje de "No hay datos"
