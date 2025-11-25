-- Script para insertar pedidos existentes con montos en DÓLARES
-- Ejecuta este script en el editor SQL de Supabase

-- PRECIOS:
-- Normal/Club: $10 por camisa
-- Directiva ZONA: $7 por camisa

-- Pedido 1: Guillermo Tovar - 3 normales = $30
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Guillermo Tovar', '04247106', 'Sabanita',
  '[{"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}]'::jsonb,
  3, 30.00, '112391', '2025-11-18', true, '2025-11-18 12:00:00');

-- Pedido 2: Reyner Rivas - 2 normales = $20 (PENDIENTE)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Reyner Rivas', 'Sin número', 'Llano Alto',
  '[{"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}]'::jsonb,
  2, null, null, null, false, '2025-11-18 12:00:00');

-- Pedido 3: Margori de Romero - 2 normales = $20 (PENDIENTE)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Margori De Romero', 'Sin número', 'Maipure',
  '[{"tipo": "normal", "talla": "XL", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}]'::jsonb,
  2, null, null, null, false, '2025-11-18 12:00:00');

-- Pedido 4: María Teresa Díaz - 1 normal + 1 DZ + 1 normal = $27 (PENDIENTE)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('María Teresa Díaz', 'Sin número', 'Sabanita',
  '[{"tipo": "normal", "talla": "16", "nombre": null, "texto_frente": null},
    {"tipo": "directiva_zona", "talla": "S", "nombre": "María Teresa Díaz", "texto_frente": "Directiva"},
    {"tipo": "normal", "talla": "2XL", "nombre": null, "texto_frente": null}]'::jsonb,
  3, null, null, null, false, '2025-11-18 12:00:00');

-- Pedido 5: Pastor Nestor - 2 DZ + 1 normal = $24 (PENDIENTE)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Pastor Nestor', 'Sin número', 'Distrito',
  '[{"tipo": "directiva_zona", "talla": "M", "nombre": "Pastor Nestor", "texto_frente": "Pastor"},
    {"tipo": "directiva_zona", "talla": "16", "nombre": "Pastor Nestor", "texto_frente": "Pastor"},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}]'::jsonb,
  3, null, null, null, false, '2025-11-18 12:00:00');

-- Pedido 6: Priscila Betancourt - 1 DZ = $7 (PENDIENTE)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Priscila Betancourt', 'Sin número', 'Moreas',
  '[{"tipo": "directiva_zona", "talla": "S", "nombre": "Priscila Betancourt", "texto_frente": "Directiva"}]'::jsonb,
  1, null, null, null, false, '2025-11-18 12:00:00');

-- Pedido 7: Angye Jiménez - 1 DZ = $7 (PENDIENTE)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Angye Jiménez', 'Sin número', 'Maipure',
  '[{"tipo": "directiva_zona", "talla": "L", "nombre": "Angye Jiménez", "texto_frente": "Directiva"}]'::jsonb,
  1, null, null, null, false, '2025-11-18 12:00:00');

-- Pedido 8: Pastor Ronald - 1 DZ = $7
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Pastor Ronald', 'Sin número', 'Guarataro',
  '[{"tipo": "directiva_zona", "talla": "L", "nombre": "Pastor Ronald", "texto_frente": "Pastor"}]'::jsonb,
  1, 7.00, '364461', '2025-11-18', true, '2025-11-18 12:00:00');

-- Pedido 9: Pastor Ronald - 1 DZ = $7
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Pastor Ronald', 'Sin número', 'Guarataro',
  '[{"tipo": "directiva_zona", "talla": "16", "nombre": "Pastor Ronald", "texto_frente": "Pastor"}]'::jsonb,
  1, 7.00, '466241', '2025-11-19', true, '2025-11-19 12:00:00');

-- Pedido 10: Eduardo - 1 normal = $10 (PENDIENTE)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Eduardo', 'Sin número', 'Upata',
  '[{"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null}]'::jsonb,
  1, null, null, null, false, '2025-11-19 12:00:00');

-- Pedido 11: Pastor Ronald - 2 normales = $20 (PENDIENTE)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Pastor Ronald', 'Sin número', 'Guarataro',
  '[{"tipo": "normal", "talla": "10", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "12", "nombre": null, "texto_frente": null}]'::jsonb,
  2, null, null, null, false, '2025-11-19 12:00:00');

-- Pedido 12: Pr. Gerardo Mujíca - 2 DZ = $14 (PENDIENTE)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Pr. Gerardo Mujíca', 'Sin número', 'Guarataro',
  '[{"tipo": "directiva_zona", "talla": "XL", "nombre": "Gerardo Mujíca", "texto_frente": "Pastor"},
    {"tipo": "directiva_zona", "talla": "M", "nombre": "Gerardo Mujíca", "texto_frente": "Pastor"}]'::jsonb,
  2, null, null, null, false, '2025-11-19 12:00:00');

-- Pedido 13: Ramón Lira - 1 DZ + 1 DC = $17
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Ramón Lira', 'Sin número', 'Nazareth',
  '[{"tipo": "directiva_zona", "talla": "S", "nombre": "Ramón Lira", "texto_frente": "Directiva"},
    {"tipo": "directiva_club", "talla": "S", "nombre": null, "texto_frente": null}]'::jsonb,
  2, 17.00, '755521', '2025-11-17', true, '2025-11-17 12:00:00');

-- Pedido 14: Ramón Lira - 2 normales = $20
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Ramón Lira', 'Sin número', 'Nazareth',
  '[{"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "XL", "nombre": null, "texto_frente": null}]'::jsonb,
  2, 20.00, '983161', '2025-11-18', true, '2025-11-18 12:00:00');

-- Pedido 15: Ramón Lira - 1 normal = $10
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Ramón Lira', 'Sin número', 'Nazareth',
  '[{"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}]'::jsonb,
  1, 10.00, '296121', '2025-11-12', true, '2025-11-12 12:00:00');

-- Pedido 16: Amadeo Mussio - 3 normales = $30
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Amadeo Mussio', 'Sin número', 'Central',
  '[{"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "XL", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "2XL", "nombre": null, "texto_frente": null}]'::jsonb,
  3, 30.00, '988101', '2025-11-17', true, '2025-11-17 12:00:00');

-- Pedido 17: Dainiris - 7 normales = $70
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Dainiris', 'Sin número', 'Central',
  '[{"tipo": "normal", "talla": "16", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "16", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "XL", "nombre": null, "texto_frente": null}]'::jsonb,
  7, 70.00, '822761', '2025-11-19', true, '2025-11-19 12:00:00');

-- Pedido 18: Dainiris - 3 normales = $30
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Dainiris', 'Sin número', 'Central',
  '[{"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null}]'::jsonb,
  3, 30.00, '175451', '2025-11-21', true, '2025-11-21 12:00:00');

-- Pedido 19: Carlitos - 1 normal = $10
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Carlitos', 'Sin número', 'Llano Alto',
  '[{"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}]'::jsonb,
  1, 10.00, '159851', '2025-11-20', true, '2025-11-20 12:00:00');

-- Pedido 20: Dessire - 1 normal = $10
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Dessire', 'Sin número', 'Nueva Guayana',
  '[{"tipo": "normal", "talla": "XL", "nombre": null, "texto_frente": null}]'::jsonb,
  1, 10.00, '047991', '2025-11-20', true, '2025-11-20 12:00:00');

-- Pedido 21: Carlitos - 2 normales = $20
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Carlitos', 'Sin número', 'Llano Alto',
  '[{"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null}]'::jsonb,
  2, 20.00, '726561', '2025-11-20', true, '2025-11-20 12:00:00');

-- Pedido 22: Emmanuel Rodriguez - 1 normal = $10
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Emmanuel Rodriguez', 'Sin número', 'Nueva Guayana',
  '[{"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null}]'::jsonb,
  1, 10.00, '463831', '2025-11-20', true, '2025-11-20 12:00:00');

-- Pedido 23: Jeanmarcos Rojas - 1 normal = $10
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Jeanmarcos Rojas', 'Sin número', 'Nueva Guayana',
  '[{"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null}]'::jsonb,
  1, 10.00, '325891', '2025-11-19', true, '2025-11-19 12:00:00');

-- Pedido 24: Maiker Rojas - 1 normal = $10
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Maiker Rojas', 'Sin número', 'Nueva Guayana',
  '[{"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null}]'::jsonb,
  1, 10.00, '007471', '2025-11-19', true, '2025-11-19 12:00:00');

-- Pedido 25: Liliana Maita - 2 normales = $20
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Liliana Maita', 'Sin número', 'Sabanita',
  '[{"tipo": "normal", "talla": "16", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}]'::jsonb,
  2, 20.00, '395671', '2025-11-19', true, '2025-11-19 12:00:00');

-- Pedido 26: Rosmary Medina - 2 normales + 2 DC = $40
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Rosmary Medina', 'Sin número', 'Llano Alto',
  '[{"tipo": "normal", "talla": "12", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "12", "nombre": null, "texto_frente": null},
    {"tipo": "directiva_club", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "directiva_club", "talla": "M", "nombre": null, "texto_frente": null}]'::jsonb,
  4, 40.00, '777051', '2025-11-19', true, '2025-11-19 12:00:00');

-- Pedido 27: Deiby Berra - 1 normal = $10
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Deiby Berra', 'Sin número', 'Central',
  '[{"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}]'::jsonb,
  1, 10.00, '77871', '2025-11-18', true, '2025-11-18 12:00:00');

-- Pedido 28: Edgar Martinez - 2 normales = $20
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Edgar Martinez', 'Sin número', 'Central',
  '[{"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null}]'::jsonb,
  2, 20.00, '86661', '2025-11-19', true, '2025-11-19 12:00:00');

-- Pedido 29: Priscila Sarmiento - 1 DZ + 1 normal = $17 (PENDIENTE)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Priscila Sarmiento', 'Sin número', 'Sabanita',
  '[{"tipo": "directiva_zona", "talla": "16", "nombre": "Priscila Sarmiento", "texto_frente": "Directiva"},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}]'::jsonb,
  2, null, null, null, false, '2025-11-19 12:00:00');

-- Pedido 30: Danielis Araguache - 1 normal = $10
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES ('Danielis Araguache', 'Sin número', 'Central',
  '[{"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}]'::jsonb,
  1, 10.00, '815101', '2025-11-21', true, '2025-11-21 12:00:00');

-- Verificar los datos insertados
SELECT 
  nombre_persona, 
  iglesia, 
  total_camisas, 
  monto_pago,
  pagado,
  fecha_pago,
  created_at
FROM pedidos
ORDER BY created_at DESC;
