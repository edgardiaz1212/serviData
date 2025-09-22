# TODO - Corrección accumulated_deviation

## Problema
El campo `accumulated_deviation` se está calculando incorrectamente a nivel de actividad cuando debería estar solo a nivel de proyecto.

## Plan de Corrección

### ✅ Completado
- [x] Análisis del problema identificado
- [x] Plan de corrección aprobado por el usuario

### 🔄 En Progreso
- [ ] Remover campo `accumulated_deviation` de la clase `Activity` en `src/api/models.py`
- [ ] Actualizar función `update_accumulated_deviations()` en `src/api/routes.py`
- [ ] Modificar función `update_activity_progress()` en `src/api/routes.py`
- [ ] Verificar que el frontend funcione correctamente

### 📋 Pendiente
- [ ] Probar la actualización de progreso de actividades
- [ ] Verificar cálculo correcto de desviación acumulada a nivel de proyecto
- [ ] Confirmar que no se rompió funcionalidad existente
