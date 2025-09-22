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
INSERT INTO projects (name, num_phases, start_date, end_date, total_duration, status) VALUES
('Migración a Cloud Pública', 3, '2025-01-15', '2025-04-15', 90, 'En Progreso'),
('Implementación de Sistema de Respaldo', 4, '2025-02-01', '2025-06-30', 150, 'Planificado'),
('Actualización de Infraestructura de Red', 2, '2025-03-01', '2025-05-01', 60, 'En Progreso'),
('Desarrollo de Plataforma E-commerce', 5, '2025-01-01', '2025-08-01', 210, 'En Progreso'),
('Optimización de Base de Datos', 3, '2025-04-01', '2025-07-01', 90, 'Planificado');

-- Insert phases for projects
INSERT INTO phases (project_id, name, "order", start_date, end_date, duration) VALUES
-- Phases for Project 1: Migración a Cloud Pública
(1, 'Planificación y Análisis', 1, '2025-01-15', '2025-02-14', 30),
(1, 'Configuración de Infraestructura', 2, '2025-02-15', '2025-03-14', 28),
(1, 'Migración de Datos y Aplicaciones', 3, '2025-03-15', '2025-04-15', 31),

-- Phases for Project 2: Implementación de Sistema de Respaldo
(2, 'Evaluación de Requerimientos', 1, '2025-02-01', '2025-02-28', 28),
(2, 'Diseño de la Solución', 2, '2025-03-01', '2025-03-31', 30),
(2, 'Implementación', 3, '2025-04-01', '2025-05-15', 45),
(2, 'Pruebas y Validación', 4, '2025-05-16', '2025-06-30', 45),

-- Phases for Project 3: Actualización de Infraestructura de Red
(3, 'Evaluación Actual', 1, '2025-03-01', '2025-03-31', 30),
(3, 'Diseño e Implementación', 2, '2025-04-01', '2025-05-01', 30),

-- Phases for Project 4: Desarrollo de Plataforma E-commerce
(4, 'Análisis y Diseño', 1, '2025-01-01', '2025-02-15', 45),
(4, 'Desarrollo Frontend', 2, '2025-02-16', '2025-04-15', 60),
(4, 'Desarrollo Backend', 3, '2025-04-16', '2025-06-15', 60),
(4, 'Integración y Testing', 4, '2025-06-16', '2025-07-15', 30),
(4, 'Despliegue y Monitoreo', 5, '2025-07-16', '2025-08-01', 16),

-- Phases for Project 5: Optimización de Base de Datos
(5, 'Análisis de Rendimiento', 1, '2025-04-01', '2025-04-30', 30),
(5, 'Optimización de Consultas', 2, '2025-05-01', '2025-06-01', 31),
(5, 'Reestructuración de Índices', 3, '2025-06-02', '2025-07-01', 29);

-- Insert activities for phases
INSERT INTO activities (phase_id, description, duration, predecessors, planned_start, planned_end, planned_percent, real_compliance) VALUES
-- Activities for Phase 1 of Project 1
(1, 'Análisis de requisitos actuales', 10, NULL, '2025-01-15', '2025-01-24', 33.33, 100.00),
(1, 'Evaluación de proveedores cloud', 10, '1', '2025-01-25', '2025-02-03', 33.33, 80.00),
(1, 'Planificación de recursos', 10, '2', '2025-02-04', '2025-02-14', 33.34, 60.00),

-- Activities for Phase 2 of Project 1
(2, 'Configuración de red y seguridad', 14, '3', '2025-02-15', '2025-02-28', 50.00, 90.00),
(2, 'Instalación de servidores', 14, '4', '2025-03-01', '2025-03-14', 50.00, 70.00),

-- Activities for Phase 3 of Project 1
(3, 'Migración de base de datos', 15, '5', '2025-03-15', '2025-03-29', 48.39, 50.00),
(3, 'Migración de aplicaciones', 10, '6', '2025-03-30', '2025-04-08', 32.26, 30.00),
(3, 'Pruebas de funcionalidad', 6, '7', '2025-04-09', '2025-04-15', 19.35, 0.00),

-- Activities for Phase 1 of Project 2
(4, 'Análisis de datos críticos', 14, NULL, '2025-02-01', '2025-02-14', 50.00, 100.00),
(4, 'Evaluación de herramientas de respaldo', 14, '8', '2025-02-15', '2025-02-28', 50.00, 90.00),

-- Activities for Phase 2 of Project 2
(5, 'Diseño de arquitectura de respaldo', 15, '9', '2025-03-01', '2025-03-15', 50.00, 80.00),
(5, 'Selección de hardware y software', 15, '10', '2025-03-16', '2025-03-31', 50.00, 60.00),

-- Activities for Phase 3 of Project 2
(6, 'Instalación de sistema de respaldo', 20, '11', '2025-04-01', '2025-04-20', 44.44, 70.00),
(6, 'Configuración de políticas', 15, '12', '2025-04-21', '2025-05-05', 33.33, 50.00),
(6, 'Configuración de monitoreo', 10, '13', '2025-05-06', '2025-05-15', 22.22, 30.00),

-- Activities for Phase 4 of Project 2
(7, 'Pruebas de restauración', 20, '14', '2025-05-16', '2025-06-04', 44.44, 0.00),
(7, 'Documentación del sistema', 15, '15', '2025-06-05', '2025-06-19', 33.33, 0.00),
(7, 'Entrenamiento del equipo', 10, '16', '2025-06-20', '2025-06-30', 22.22, 0.00),

-- Activities for Phase 1 of Project 3
(8, 'Auditoría de infraestructura actual', 15, NULL, '2025-03-01', '2025-03-15', 50.00, 100.00),
(8, 'Identificación de bottlenecks', 15, '17', '2025-03-16', '2025-03-31', 50.00, 80.00),

-- Activities for Phase 2 of Project 3
(9, 'Diseño de nueva topología', 15, '18', '2025-04-01', '2025-04-15', 50.00, 60.00),
(9, 'Implementación de mejoras', 15, '19', '2025-04-16', '2025-05-01', 50.00, 40.00),

-- Activities for Phase 1 of Project 4
(10, 'Análisis de requerimientos de negocio', 20, NULL, '2025-01-01', '2025-01-20', 44.44, 100.00),
(10, 'Diseño de arquitectura del sistema', 15, '20', '2025-01-21', '2025-02-04', 33.33, 90.00),
(10, 'Creación de mockups y prototipos', 10, '21', '2025-02-05', '2025-02-15', 22.22, 70.00),

-- Activities for Phase 2 of Project 4
(11, 'Desarrollo de componentes UI', 25, '22', '2025-02-16', '2025-03-12', 41.67, 80.00),
(11, 'Implementación de navegación', 20, '23', '2025-03-13', '2025-04-01', 33.33, 60.00),
(11, 'Integración con APIs', 15, '24', '2025-04-02', '2025-04-15', 25.00, 40.00),

-- Activities for Phase 3 of Project 4
(12, 'Desarrollo de servicios backend', 25, '25', '2025-04-16', '2025-05-10', 41.67, 50.00),
(12, 'Implementación de base de datos', 20, '26', '2025-05-11', '2025-05-30', 33.33, 30.00),
(12, 'Configuración de seguridad', 15, '27', '2025-05-31', '2025-06-15', 25.00, 20.00),

-- Activities for Phase 4 of Project 4
(13, 'Testing de integración', 15, '28', '2025-06-16', '2025-06-30', 50.00, 0.00),
(13, 'Testing de performance', 10, '29', '2025-07-01', '2025-07-10', 33.33, 0.00),
(13, 'Testing de seguridad', 5, '30', '2025-07-11', '2025-07-15', 16.67, 0.00),

-- Activities for Phase 5 of Project 4
(14, 'Configuración de servidores de producción', 8, '31', '2025-07-16', '2025-07-23', 50.00, 0.00),
(14, 'Despliegue de aplicación', 5, '32', '2025-07-24', '2025-07-28', 31.25, 0.00),
(14, 'Configuración de monitoreo', 3, '33', '2025-07-29', '2025-08-01', 18.75, 0.00),

-- Activities for Phase 1 of Project 5
(15, 'Análisis de consultas lentas', 15, NULL, '2025-04-01', '2025-04-15', 50.00, 90.00),
(15, 'Identificación de cuellos de botella', 15, '34', '2025-04-16', '2025-04-30', 50.00, 70.00),

-- Activities for Phase 2 of Project 5
(16, 'Reescritura de consultas ineficientes', 15, '35', '2025-05-01', '2025-05-15', 48.39, 60.00),
(16, 'Optimización de procedimientos almacenados', 16, '36', '2025-05-16', '2025-06-01', 51.61, 40.00),

-- Activities for Phase 3 of Project 5
(17, 'Análisis de índices existentes', 10, '37', '2025-06-02', '2025-06-11', 34.48, 30.00),
(17, 'Creación de nuevos índices', 10, '38', '2025-06-12', '2025-06-21', 34.48, 20.00),
(17, 'Eliminación de índices redundantes', 9, '39', '2025-06-22', '2025-07-01', 31.03, 0.00);
