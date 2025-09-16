-- Test data for clients and services in 2025
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
