-- Script para insertar pedidos existentes
-- Ejecuta este script en el editor SQL de Supabase

-- NOTA: Los precios del dólar se calcularon basándose en los montos en Bs proporcionados
-- Dólar 18/11/25: ~47.11 Bs (promedio calculado de varios pagos)
-- Dólar 19/11/25: ~47.75 Bs (promedio calculado)
-- Dólar 20/11/25: ~48.06 Bs (promedio calculado)
-- Dólar 21/11/25: ~48.40 Bs (promedio calculado)
-- Dólar 17/11/25: ~47.00 Bs (promedio calculado)
-- Dólar 12/11/25: ~47.40 Bs (promedio calculado)

-- Pedido 1: Guillermo Tovar - 3 camisas normales = $30
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Guillermo Tovar',
  '04247106',
  'Sabanita',
  '[
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  3,
  30.00,
  '112391',
  '2025-11-18',
  true,
  '2025-11-18 12:00:00'
);

-- Pedido 2: Reyner Rivas
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Reyner Rivas',
  'Sin número',
  'Llano Alto',
  '[
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  null,
  null,
  null,
  false,
  '2025-11-18 12:00:00'
);

-- Pedido 3: Margori de Romero
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Margori De Romero',
  'Sin número',
  'Maipure',
  '[
    {"tipo": "normal", "talla": "XL", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  null,
  null,
  null,
  false,
  '2025-11-18 12:00:00'
);

-- Pedido 4: María Teresa Díaz
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'María Teresa Díaz',
  'Sin número',
  'Sabanita',
  '[
    {"tipo": "normal", "talla": "16", "nombre": null, "texto_frente": null},
    {"tipo": "directiva_zona", "talla": "S", "nombre": "María Teresa Díaz", "texto_frente": "Directiva"},
    {"tipo": "normal", "talla": "2XL", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  3,
  null,
  null,
  null,
  false,
  '2025-11-18 12:00:00'
);

-- Pedido 5: Pastor Nestor
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Pastor Nestor',
  'Sin número',
  'Distrito',
  '[
    {"tipo": "directiva_zona", "talla": "M", "nombre": "Pastor Nestor", "texto_frente": "Pastor"},
    {"tipo": "directiva_zona", "talla": "16", "nombre": "Pastor Nestor", "texto_frente": "Pastor"},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  3,
  null,
  null,
  null,
  false,
  '2025-11-18 12:00:00'
);

-- Pedido 6: Priscila Betancourt
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Priscila Betancourt',
  'Sin número',
  'Moreas',
  '[
    {"tipo": "directiva_zona", "talla": "S", "nombre": "Priscila Betancourt", "texto_frente": "Directiva"}
  ]'::jsonb,
  1,
  null,
  null,
  null,
  false,
  '2025-11-18 12:00:00'
);

-- Pedido 7: Angye Jiménez
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Angye Jiménez',
  'Sin número',
  'Maipure',
  '[
    {"tipo": "directiva_zona", "talla": "L", "nombre": "Angye Jiménez", "texto_frente": "Directiva"}
  ]'::jsonb,
  1,
  null,
  null,
  null,
  false,
  '2025-11-18 12:00:00'
);

-- Pedido 8: Pastor Ronald (Pedido 1) - 1 DZ = $7
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Pastor Ronald',
  'Sin número',
  'Guarataro',
  '[
    {"tipo": "directiva_zona", "talla": "L", "nombre": "Pastor Ronald", "texto_frente": "Pastor"}
  ]'::jsonb,
  1,
  7.00,
  '364461',
  '2025-11-18',
  true,
  '2025-11-18 12:00:00'
);

-- Pedido 9: Pastor Ronald (Pedido 2) - 1 DZ = $7
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Pastor Ronald',
  'Sin número',
  'Guarataro',
  '[
    {"tipo": "directiva_zona", "talla": "16", "nombre": "Pastor Ronald", "texto_frente": "Pastor"}
  ]'::jsonb,
  1,
  7.00,
  '466241',
  '2025-11-19',
  true,
  '2025-11-19 12:00:00'
);

-- Pedido 10: Eduardo
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Eduardo',
  'Sin número',
  'Upata',
  '[
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  null,
  null,
  null,
  false,
  '2025-11-19 12:00:00'
);

-- Pedido 11: Pastor Ronald (Pedido 3)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Pastor Ronald',
  'Sin número',
  'Guarataro',
  '[
    {"tipo": "normal", "talla": "10", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "12", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  null,
  null,
  null,
  false,
  '2025-11-19 12:00:00'
);

-- Pedido 12: Pr. Gerardo Mujíca
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Pr. Gerardo Mujíca',
  'Sin número',
  'Guarataro',
  '[
    {"tipo": "directiva_zona", "talla": "XL", "nombre": "Gerardo Mujíca", "texto_frente": "Pastor"},
    {"tipo": "directiva_zona", "talla": "M", "nombre": "Gerardo Mujíca", "texto_frente": "Pastor"}
  ]'::jsonb,
  2,
  null,
  null,
  null,
  false,
  '2025-11-19 12:00:00'
);

-- Pedido 13: Ramón Lira (Pedido 1)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Ramón Lira',
  'Sin número',
  'Nazareth',
  '[
    {"tipo": "directiva_zona", "talla": "S", "nombre": "Ramón Lira", "texto_frente": "Directiva"},
    {"tipo": "directiva_club", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  4740,
  '755521',
  '2025-11-17',
  true,
  '2025-11-17 12:00:00'
);

-- Pedido 14: Ramón Lira (Pedido 2)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Ramón Lira',
  'Sin número',
  'Nazareth',
  '[
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "XL", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  4736,
  '983161',
  '2025-11-18',
  true,
  '2025-11-18 12:00:00'
);

-- Pedido 15: Ramón Lira (Pedido 3)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Ramón Lira',
  'Sin número',
  'Nazareth',
  '[
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2370,
  '296121',
  '2025-11-12',
  true,
  '2025-11-12 12:00:00'
);

-- Pedido 16: Amadeo Mussio
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Amadeo Mussio',
  'Sin número',
  'Central',
  '[
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "XL", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "2XL", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  3,
  6620,
  '988101',
  '2025-11-17',
  true,
  '2025-11-17 12:00:00'
);

-- Pedido 17: Dainiris (Pedido 1)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Dainiris',
  'Sin número',
  'Central',
  '[
    {"tipo": "normal", "talla": "16", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "16", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "XL", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  7,
  16600,
  '822761',
  '2025-11-19',
  true,
  '2025-11-19 12:00:00'
);

-- Pedido 18: Dainiris (Pedido 2)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Dainiris',
  'Sin número',
  'Central',
  '[
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  3,
  7250,
  '175451',
  '2025-11-21',
  true,
  '2025-11-21 12:00:00'
);

-- Pedido 19: Carlitos (Pedido 1)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Carlitos',
  'Sin número',
  'Llano Alto',
  '[
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2403.20,
  '159851',
  '2025-11-20',
  true,
  '2025-11-20 12:00:00'
);

-- Pedido 20: Dessire
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Dessire',
  'Sin número',
  'Nueva Guayana',
  '[
    {"tipo": "normal", "talla": "XL", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2403.20,
  '047991',
  '2025-11-20',
  true,
  '2025-11-20 12:00:00'
);

-- Pedido 21: Carlitos (Pedido 2)
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Carlitos',
  'Sin número',
  'Llano Alto',
  '[
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  4880,
  '726561',
  '2025-11-20',
  true,
  '2025-11-20 12:00:00'
);

-- Pedido 22: Emmanuel Rodriguez
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Emmanuel Rodriguez',
  'Sin número',
  'Nueva Guayana',
  '[
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2380,
  '463831',
  '2025-11-20',
  true,
  '2025-11-20 12:00:00'
);

-- Pedido 23: Jeanmarcos Rojas
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Jeanmarcos Rojas',
  'Sin número',
  'Nueva Guayana',
  '[
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2403.20,
  '325891',
  '2025-11-19',
  true,
  '2025-11-19 12:00:00'
);

-- Pedido 24: Maiker Rojas
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Maiker Rojas',
  'Sin número',
  'Nueva Guayana',
  '[
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2410,
  '007471',
  '2025-11-19',
  true,
  '2025-11-19 12:00:00'
);

-- Pedido 25: Liliana Maita
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Liliana Maita',
  'Sin número',
  'Sabanita',
  '[
    {"tipo": "normal", "talla": "16", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  4780,
  '395671',
  '2025-11-19',
  true,
  '2025-11-19 12:00:00'
);

-- Pedido 26: Rosmary Medina
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Rosmary Medina',
  'Sin número',
  'Llano Alto',
  '[
    {"tipo": "normal", "talla": "12", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "12", "nombre": null, "texto_frente": null},
    {"tipo": "directiva_club", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "directiva_club", "talla": "M", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  4,
  9510.02,
  '777051',
  '2025-11-19',
  true,
  '2025-11-19 12:00:00'
);

-- Pedido 27: Deiby Berra
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Deiby Berra',
  'Sin número',
  'Central',
  '[
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2368.39,
  '77871',
  '2025-11-18',
  true,
  '2025-11-18 12:00:00'
);

-- Pedido 28: Edgar Martinez
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Edgar Martinez',
  'Sin número',
  'Central',
  '[
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  4755,
  '86661',
  '2025-11-19',
  true,
  '2025-11-19 12:00:00'
);

-- Pedido 29: Priscila Sarmiento
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Priscila Sarmiento',
  'Sin número',
  'Sabanita',
  '[
    {"tipo": "directiva_zona", "talla": "16", "nombre": "Priscila Sarmiento", "texto_frente": "Directiva"},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  null,
  null,
  null,
  false,
  '2025-11-19 12:00:00'
);

-- Pedido 30: Danielis Araguache
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Danielis Araguache',
  'Sin número',
  'Central',
  '[
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2420,
  '815101',
  '2025-11-21',
  true,
  '2025-11-21 12:00:00'
);

-- Verificar los datos insertados
SELECT 
  nombre_persona, 
  iglesia, 
  total_camisas, 
  pagado,
  monto_pago,
  created_at
FROM pedidos
ORDER BY created_at DESC;
