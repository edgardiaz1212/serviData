-- Test data for clients, services, and projects in 2025
-- Client types: Publica and Privada

-- Insert clients
INSERT INTO clientes (tipo, rif, razon_social, fecha_creacion_cliente) VALUES
('Publica', 'J-12345678-9', 'Empresa Publica A', '2025-01-15 00:00:00'),
('Privada', 'J-23456789-0', 'Empresa Privada B', '2025-02-20 00:00:00'),
('Publica', 'J-34567890-1', 'Empresa Publica C', '2025-03-10 00:00:00'),
('Privada', 'J-45678901-2', 'Empresa Privada D', '2025-04-05 00:00:00'),
('Publica', 'J-56789012-3', 'Empresa Publica E', '2025-05-25 00:00:00');

-- Insert services (assuming cliente_id starts from 1 if fresh DB)
-- Adjust cliente_id if necessary
INSERT INTO servicios (cliente_id, contrato, estado_contrato, estado_servicio, tipo_servicio, descripcion, hostname, ip_publica, ram, hdd, cpu, fecha_creacion_servicio) VALUES
(1, 'CON-1-1', 'Activo', 'Nuevo', 'Hosting', 'Servicio de hosting para Empresa Publica A', 'host-1-1.example.com', '192.168.1.10', 4, 100, 2, '2025-01-20 00:00:00'),
(1, 'CON-1-2', 'Activo', 'Nuevo', 'Cloud', 'Servicio cloud para Empresa Publica A', 'host-1-2.example.com', '192.168.1.11', 8, 200, 4, '2025-02-15 00:00:00'),
(2, 'CON-2-1', 'Suspendido', 'Nuevo', 'VPS', 'VPS para Empresa Privada B', 'host-2-1.example.com', '192.168.2.10', 2, 50, 1, '2025-03-01 00:00:00'),
(3, 'CON-3-1', 'Activo', 'Nuevo', 'Dedicated Server', 'Servidor dedicado para Empresa Publica C', 'host-3-1.example.com', '192.168.3.10', 16, 500, 8, '2025-04-10 00:00:00'),
(3, 'CON-3-2', 'Cancelado', 'Nuevo', 'Domain', 'Registro de dominio para Empresa Publica C', 'host-3-2.example.com', '192.168.3.11', 1, 10, 1, '2025-05-05 00:00:00'),
(4, 'CON-4-1', 'Activo', 'Nuevo', 'Hosting', 'Hosting para Empresa Privada D', 'host-4-1.example.com', '192.168.4.10', 4, 100, 2, '2025-06-15 00:00:00'),
(5, 'CON-5-1', 'Activo', 'Nuevo', 'Cloud', 'Cloud para Empresa Publica E', 'host-5-1.example.com', '192.168.5.10', 8, 200, 4, '2025-07-20 00:00:00'),
(5, 'CON-5-2', 'Activo', 'Nuevo', 'VPS', 'VPS adicional para Empresa Publica E', 'host-5-2.example.com', '192.168.5.11', 4, 100, 2, '2025-08-10 00:00:00'),
(5, 'CON-5-3', 'Suspendido', 'Nuevo', 'Dedicated Server', 'Servidor dedicado para Empresa Publica E', 'host-5-3.example.com', '192.168.5.12', 12, 300, 6, '2025-09-05 00:00:00');

-- Insert projects
INSERT INTO projects (name, edt_structure, num_phases, start_date, end_date, total_duration, status) VALUES
('Proyecto de Migración a Cloud', '1. Planificación\n2. Desarrollo\n3. Pruebas\n4. Despliegue', 4, '2025-01-01 00:00:00', '2025-06-30 00:00:00', 181, 'En progreso'),
('Implementación de Sistema ERP', '1. Análisis de Requisitos\n2. Diseño del Sistema\n3. Desarrollo\n4. Testing\n5. Implementación', 5, '2025-02-01 00:00:00', '2025-08-31 00:00:00', 212, 'En progreso'),
('Modernización de Infraestructura', '1. Evaluación Actual\n2. Diseño de Arquitectura\n3. Migración de Datos\n4. Optimización', 4, '2025-03-01 00:00:00', '2025-09-30 00:00:00', 214, 'Planificado'),
('Proyecto de Seguridad Cibernética', '1. Auditoría de Seguridad\n2. Implementación de Controles\n3. Capacitación\n4. Monitoreo Continuo', 4, '2025-04-01 00:00:00', '2025-10-31 00:00:00', 214, 'Completado'),
('Optimización de Base de Datos', '1. Análisis de Rendimiento\n2. Optimización de Consultas\n3. Migración de Datos\n4. Validación', 4, '2025-05-01 00:00:00', '2025-11-30 00:00:00', 214, 'En progreso');

-- Insert phases for projects (assuming project_id starts from 1)
INSERT INTO phases (project_id, name, "order", start_date, end_date, duration) VALUES
-- Proyecto 1: Migración a Cloud
(1, 'Planificación', 1, '2025-01-01 00:00:00', '2025-01-31 00:00:00', 31),
(1, 'Desarrollo', 2, '2025-02-01 00:00:00', '2025-04-30 00:00:00', 90),
(1, 'Pruebas', 3, '2025-05-01 00:00:00', '2025-06-15 00:00:00', 46),
(1, 'Despliegue', 4, '2025-06-16 00:00:00', '2025-06-30 00:00:00', 15),

-- Proyecto 2: Sistema ERP
(2, 'Análisis de Requisitos', 1, '2025-02-01 00:00:00', '2025-02-28 00:00:00', 28),
(2, 'Diseño del Sistema', 2, '2025-03-01 00:00:00', '2025-04-30 00:00:00', 61),
(2, 'Desarrollo', 3, '2025-05-01 00:00:00', '2025-07-31 00:00:00', 92),
(2, 'Testing', 4, '2025-08-01 00:00:00', '2025-08-15 00:00:00', 15),
(2, 'Implementación', 5, '2025-08-16 00:00:00', '2025-08-31 00:00:00', 16),

-- Proyecto 3: Modernización de Infraestructura
(3, 'Evaluación Actual', 1, '2025-03-01 00:00:00', '2025-03-31 00:00:00', 31),
(3, 'Diseño de Arquitectura', 2, '2025-04-01 00:00:00', '2025-06-30 00:00:00', 91),
(3, 'Migración de Datos', 3, '2025-07-01 00:00:00', '2025-08-31 00:00:00', 62),
(3, 'Optimización', 4, '2025-09-01 00:00:00', '2025-09-30 00:00:00', 30),

-- Proyecto 4: Seguridad Cibernética
(4, 'Auditoría de Seguridad', 1, '2025-04-01 00:00:00', '2025-04-30 00:00:00', 30),
(4, 'Implementación de Controles', 2, '2025-05-01 00:00:00', '2025-07-31 00:00:00', 92),
(4, 'Capacitación', 3, '2025-08-01 00:00:00', '2025-09-15 00:00:00', 46),
(4, 'Monitoreo Continuo', 4, '2025-09-16 00:00:00', '2025-10-31 00:00:00', 46),

-- Proyecto 5: Optimización de Base de Datos
(5, 'Análisis de Rendimiento', 1, '2025-05-01 00:00:00', '2025-05-31 00:00:00', 31),
(5, 'Optimización de Consultas', 2, '2025-06-01 00:00:00', '2025-08-31 00:00:00', 92),
(5, 'Migración de Datos', 3, '2025-09-01 00:00:00', '2025-10-15 00:00:00', 45),
(5, 'Validación', 4, '2025-10-16 00:00:00', '2025-11-30 00:00:00', 46);

-- Insert activities for phases (assuming phase_id starts from 1)
INSERT INTO activities (phase_id, description, duration, predecessors, planned_start, planned_end, planned_percent, real_compliance, real_percent, deviation, accumulated_deviation, status) VALUES
-- Phase 1 (Planificación - Proyecto 1)
(1, 'Análisis de requisitos del sistema actual', 10, NULL, '2025-01-01 00:00:00', '2025-01-10 00:00:00', 25.0, 100.0, 25.0, 0.0, 0.0, 'Completado'),
(1, 'Evaluación de proveedores cloud', 10, '1', '2025-01-11 00:00:00', '2025-01-20 00:00:00', 25.0, 95.0, 25.0, 0.0, 0.0, 'Completado'),
(1, 'Planificación de migración', 11, '2', '2025-01-21 00:00:00', '2025-01-31 00:00:00', 50.0, 90.0, 50.0, 0.0, 0.0, 'Completado'),

-- Phase 2 (Desarrollo - Proyecto 1)
(2, 'Configuración de infraestructura cloud', 30, '3', '2025-02-01 00:00:00', '2025-03-02 00:00:00', 33.3, 85.0, 33.3, 0.0, 0.0, 'Completado'),
(2, 'Migración de aplicaciones', 30, '4', '2025-03-03 00:00:00', '2025-04-01 00:00:00', 33.3, 80.0, 33.3, 0.0, 0.0, 'Completado'),
(2, 'Configuración de redes y seguridad', 30, '5', '2025-04-02 00:00:00', '2025-04-30 00:00:00', 33.4, 75.0, 33.4, 0.0, 0.0, 'Completado'),

-- Phase 3 (Pruebas - Proyecto 1)
(3, 'Pruebas de funcionalidad', 15, '6', '2025-05-01 00:00:00', '2025-05-15 00:00:00', 32.6, 0.0, 0.0, 0.0, 0.0, 'En progreso'),
(3, 'Pruebas de rendimiento', 15, '7', '2025-05-16 00:00:00', '2025-05-30 00:00:00', 32.6, 0.0, 0.0, 0.0, 0.0, 'Pendiente'),
(3, 'Pruebas de seguridad', 16, '8', '2025-05-31 00:00:00', '2025-06-15 00:00:00', 34.8, 0.0, 0.0, 0.0, 0.0, 'Pendiente'),

-- Phase 4 (Despliegue - Proyecto 1)
(4, 'Despliegue en producción', 10, '9', '2025-06-16 00:00:00', '2025-06-25 00:00:00', 66.7, 0.0, 0.0, 0.0, 0.0, 'Pendiente'),
(4, 'Validación final', 5, '10', '2025-06-26 00:00:00', '2025-06-30 00:00:00', 33.3, 0.0, 0.0, 0.0, 0.0, 'Pendiente'),

-- Phase 5 (Análisis de Requisitos - Proyecto 2)
(5, 'Entrevistas con stakeholders', 10, NULL, '2025-02-01 00:00:00', '2025-02-10 00:00:00', 35.7, 100.0, 35.7, 0.0, 0.0, 'Completado'),
(5, 'Documentación de procesos actuales', 10, '11', '2025-02-11 00:00:00', '2025-02-20 00:00:00', 35.7, 95.0, 35.7, 0.0, 0.0, 'Completado'),
(5, 'Definición de alcance del proyecto', 8, '12', '2025-02-21 00:00:00', '2025-02-28 00:00:00', 28.6, 90.0, 28.6, 0.0, 0.0, 'Completado'),

-- Phase 6 (Diseño del Sistema - Proyecto 2)
(6, 'Diseño de arquitectura del sistema', 20, '13', '2025-03-01 00:00:00', '2025-03-20 00:00:00', 32.8, 85.0, 32.8, 0.0, 0.0, 'En progreso'),
(6, 'Diseño de base de datos', 20, '14', '2025-03-21 00:00:00', '2025-04-09 00:00:00', 32.8, 0.0, 0.0, 0.0, 0.0, 'Pendiente'),
(6, 'Diseño de interfaces de usuario', 21, '15', '2025-04-10 00:00:00', '2025-04-30 00:00:00', 34.4, 0.0, 0.0, 0.0, 0.0, 'Pendiente'),

-- Phase 7 (Evaluación Actual - Proyecto 3)
(7, 'Inventario de activos tecnológicos', 15, NULL, '2025-03-01 00:00:00', '2025-03-15 00:00:00', 48.4, 100.0, 48.4, 0.0, 0.0, 'Completado'),
(7, 'Análisis de rendimiento actual', 16, '16', '2025-03-16 00:00:00', '2025-03-31 00:00:00', 51.6, 95.0, 51.6, 0.0, 0.0, 'Completado'),

-- Phase 8 (Auditoría de Seguridad - Proyecto 4)
(8, 'Evaluación de vulnerabilidades', 15, NULL, '2025-04-01 00:00:00', '2025-04-15 00:00:00', 50.0, 100.0, 50.0, 0.0, 0.0, 'Completado'),
(8, 'Análisis de cumplimiento normativo', 15, '17', '2025-04-16 00:00:00', '2025-04-30 00:00:00', 50.0, 95.0, 50.0, 0.0, 0.0, 'Completado'),

-- Phase 9 (Análisis de Rendimiento - Proyecto 5)
(9, 'Monitoreo de consultas lentas', 15, NULL, '2025-05-01 00:00:00', '2025-05-15 00:00:00', 48.4, 100.0, 48.4, 0.0, 0.0, 'Completado'),
(9, 'Análisis de índices de base de datos', 16, '18', '2025-05-16 00:00:00', '2025-05-31 00:00:00', 51.6, 90.0, 51.6, 0.0, 0.0, 'Completado');
