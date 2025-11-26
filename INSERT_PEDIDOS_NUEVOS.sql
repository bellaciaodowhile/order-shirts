-- Script para insertar pedidos nuevos
-- Ejecuta este script en el editor SQL de Supabase
-- DZ = Directiva ZONA, DC = Directiva Club

-- Pedido 1: Guillermo Tovar - PAGADO
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
  7106.00,
  '11239',
  '2025-11-18',
  true,
  '2025-11-18 10:00:00'
);

-- Pedido 2: Reyner Rivas - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Reyner Rivas',
  '',
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
  '2025-11-18 10:00:00'
);

-- Pedido 3: Margori de Romero - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Margori De Romero',
  '',
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
  '2025-11-18 10:00:00'
);

-- Pedido 4: María Teresa Díaz - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'María Teresa Díaz',
  '',
  'Sabanita',
  '[
    {"tipo": "normal", "talla": "16", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "16", "nombre": null, "texto_frente": null},
    {"tipo": "directiva_zona", "talla": "S", "nombre": "María Teresa Díaz", "texto_frente": "Líder"},
    {"tipo": "normal", "talla": "2XL", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  4,
  null,
  null,
  null,
  false,
  '2025-11-18 10:00:00'
);

-- Pedido 5: Pastor Nestor - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Pastor Nestor',
  '',
  'Distrito',
  '[
    {"tipo": "directiva_zona", "talla": "M", "nombre": "Pr. Nestor Chirguita", "texto_frente": "Pastor"},
    {"tipo": "directiva_zona", "talla": "16", "nombre": "Belkis Aguilera", "texto_frente": "Directiva"},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  3,
  null,
  null,
  null,
  false,
  '2025-11-18 10:00:00'
);

-- Pedido 6: Priscila Betancourt - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Priscila Betancourt',
  '',
  'Moreas',
  '[
    {"tipo": "directiva_zona", "talla": "S", "nombre": "Priscila Betancourt", "texto_frente": "Líder"}
  ]'::jsonb,
  1,
  null,
  null,
  null,
  false,
  '2025-11-18 10:00:00'
);

-- Pedido 7: Angye Jiménez - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Angye Jiménez',
  '',
  'Maipure',
  '[
    {"tipo": "directiva_zona", "talla": "L", "nombre": "Angye Jiménez", "texto_frente": "Líder"}
  ]'::jsonb,
  1,
  null,
  null,
  null,
  false,
  '2025-11-18 10:00:00'
);

-- Pedido 8: Pastor Ronald (DZ:1-L) - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Pastor Ronald',
  '',
  'Guarataro',
  '[
    {"tipo": "directiva_zona", "talla": "L", "nombre": "Pastor Ronald", "texto_frente": "Pastor"}
  ]'::jsonb,
  1,
  2368.40,
  '36446',
  '2025-11-18',
  true,
  '2025-11-18 10:00:00'
);

-- Pedido 9: Pastor Ronald (DZ:1-16) - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Pastor Ronald',
  '',
  'Guarataro',
  '[
    {"tipo": "directiva_zona", "talla": "16", "nombre": "Pastor Ronald", "texto_frente": "Pastor"}
  ]'::jsonb,
  1,
  951.00,
  '46624',
  '2025-11-19',
  true,
  '2025-11-19 10:00:00'
);

-- Pedido 10: Eduardo - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Eduardo',
  '',
  'Upata',
  '[
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  null,
  null,
  null,
  false,
  '2025-11-19 10:00:00'
);

-- Pedido 11: Pastor Ronald (1-10, 1-12) - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Pastor Ronald',
  '',
  'Guarataro',
  '[
    {"tipo": "normal", "talla": "10", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "12", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  3382.12,
  '29128',
  '2025-11-23',
  true,
  '2025-11-23 10:00:00'
);

-- Pedido 12: Pr. Misael - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Pr. Misael',
  '',
  'Central',
  '[
    {"tipo": "directiva_zona", "talla": "M", "nombre": "Pr. Misael Hernández", "texto_frente": "Pastor"},
    {"tipo": "directiva_zona", "talla": "M", "nombre": "Estefany Gil", "texto_frente": "Directiva"}
  ]'::jsonb,
  2,
  null,
  null,
  null,
  false,
  '2025-11-23 10:00:00'
);

-- Pedido 13: Pr. Gerardo Mujíca - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Pr. Gerardo Mujíca',
  '',
  'Guarataro',
  '[
    {"tipo": "directiva_zona", "talla": "XL", "nombre": "Pr. Gerardo Mujíca", "texto_frente": "Pastor"},
    {"tipo": "directiva_zona", "talla": "M", "nombre": "Pr. Gerardo Mujíca", "texto_frente": "Pastor"}
  ]'::jsonb,
  2,
  null,
  null,
  null,
  false,
  '2025-11-23 10:00:00'
);

-- Pedido 14: Ramón Lira (DZ:1-S, DC:1-S) - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Ramón Lira',
  '',
  'Nazareth',
  '[
    {"tipo": "directiva_zona", "talla": "S", "nombre": "Ramón Lira", "texto_frente": "Líder"},
    {"tipo": "directiva_club", "talla": "S", "nombre": "Ramón Lira", "texto_frente": null}
  ]'::jsonb,
  2,
  4740.00,
  '75552',
  '2025-11-17',
  true,
  '2025-11-17 10:00:00'
);

-- Pedido 15: Ramón Lira (1-M, 1-XL) - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Ramón Lira',
  '',
  'Nazareth',
  '[
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "XL", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  4736.00,
  '98316',
  '2025-11-18',
  true,
  '2025-11-18 10:00:00'
);

-- Pedido 16: Ramón Lira (1-S) - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Ramón Lira',
  '',
  'Nazareth',
  '[
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2370.00,
  '29612',
  '2025-11-12',
  true,
  '2025-11-12 10:00:00'
);

-- Pedido 17: Amadeo Mussio - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Amadeo Mussio',
  '',
  'Central',
  '[
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "XL", "nombre": null, "texto_frente": null},
    {"tipo": "directiva_zona", "talla": "2XL", "nombre": "Amadeo Mussio", "texto_frente": "Líder"}
  ]'::jsonb,
  3,
  6620.00,
  '98810',
  '2025-11-17',
  true,
  '2025-11-17 10:00:00'
);

-- Pedido 18: Dainiris (6 camisas) - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Dainiris',
  '',
  'Central',
  '[
    {"tipo": "normal", "talla": "16", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "16", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "XL", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  7,
  16600.00,
  '82276',
  '2025-11-19',
  true,
  '2025-11-19 10:00:00'
);

-- Pedido 19: Dainiris (2-L, 1-M) - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Dainiris',
  '',
  'Central',
  '[
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  3,
  7250.00,
  '17545',
  '2025-11-21',
  true,
  '2025-11-21 10:00:00'
);

-- Pedido 20: Carlitos (1-S) - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Carlitos',
  '',
  'Llano Alto',
  '[
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2403.20,
  '15985',
  '2025-11-20',
  true,
  '2025-11-20 10:00:00'
);

-- Pedido 21: Dessire - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Dessire',
  '',
  'Nueva Guayana',
  '[
    {"tipo": "normal", "talla": "XL", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2403.20,
  '4799',
  '2025-11-20',
  true,
  '2025-11-20 10:00:00'
);

-- Pedido 22: Carlitos (1-M, 1-L) - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Carlitos',
  '',
  'Llano Alto',
  '[
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  4880.00,
  '72656',
  '2025-11-20',
  true,
  '2025-11-20 10:00:00'
);

-- Pedido 23: Emmanuel Rodriguez - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Emmanuel Rodriguez',
  '',
  'Nueva Guayana',
  '[
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2380.00,
  '46383',
  '2025-11-20',
  true,
  '2025-11-20 10:00:00'
);

-- Pedido 24: Jeanmarcos Rojas - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Jeanmarcos Rojas',
  '',
  'Nueva Guayana',
  '[
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2403.20,
  '32589',
  '2025-11-19',
  true,
  '2025-11-19 10:00:00'
);

-- Pedido 25: Maiker Rojas - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Maiker Rojas',
  '',
  'Nueva Guayana',
  '[
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2410.00,
  '747',
  '2025-11-19',
  true,
  '2025-11-19 10:00:00'
);

-- Pedido 26: Liliana Maita - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Liliana Maita',
  '',
  'Sabanita',
  '[
    {"tipo": "normal", "talla": "16", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  4780.00,
  '39567',
  '2025-11-19',
  true,
  '2025-11-19 10:00:00'
);

-- Pedido 27: Rosmary Medina - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Rosmary Medina',
  '',
  'Llano Alto',
  '[
    {"tipo": "normal", "talla": "12", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "12", "nombre": null, "texto_frente": null},
    {"tipo": "directiva_club", "talla": "M", "nombre": "Rosmary Medina", "texto_frente": null},
    {"tipo": "directiva_club", "talla": "M", "nombre": "Rosmary Medina", "texto_frente": null}
  ]'::jsonb,
  4,
  9510.02,
  '77705',
  '2025-11-19',
  true,
  '2025-11-19 10:00:00'
);

-- Pedido 28: Deiby Berra - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Deiby Berra',
  '',
  'Central',
  '[
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2368.39,
  '7787',
  '2025-11-18',
  true,
  '2025-11-18 10:00:00'
);

-- Pedido 29: Edgar Martinez - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Edgar Martinez',
  '',
  'Central',
  '[
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  4755.00,
  '8666',
  '2025-11-19',
  true,
  '2025-11-19 10:00:00'
);

-- Pedido 30: Priscila Sarmiento - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Priscila Sarmiento',
  '',
  'Sabanita',
  '[
    {"tipo": "directiva_zona", "talla": "16", "nombre": "Priscila Sarmiento", "texto_frente": "Líder"},
    {"tipo": "directiva_zona", "talla": "S", "nombre": "Priscila Sarmiento", "texto_frente": "Líder"}
  ]'::jsonb,
  2,
  null,
  null,
  null,
  false,
  '2025-11-19 10:00:00'
);

-- Pedido 31: Danielis Araguache - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Danielis Araguache',
  '',
  'Central',
  '[
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2420.00,
  '81510',
  '2025-11-21',
  true,
  '2025-11-21 10:00:00'
);

-- Pedido 32: Yeni Aguilar - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Yeni Aguilar',
  '',
  'Soledad',
  '[
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null},
    {"tipo": "directiva_zona", "talla": "M", "nombre": "Yeni Aguilar", "texto_frente": "Líder"}
  ]'::jsonb,
  2,
  null,
  null,
  null,
  false,
  '2025-11-21 10:00:00'
);

-- Pedido 33: Patricia - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Patricia',
  '',
  'Soledad',
  '[
    {"tipo": "directiva_club", "talla": "M", "nombre": "Patricia", "texto_frente": null},
    {"tipo": "normal", "talla": "10", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  2,
  null,
  null,
  null,
  false,
  '2025-11-21 10:00:00'
);

-- Pedido 34: Dori - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Dori',
  '',
  'Soledad',
  '[
    {"tipo": "normal", "talla": "L", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  null,
  null,
  null,
  false,
  '2025-11-21 10:00:00'
);

-- Pedido 35: Francisca - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Francisca',
  '',
  'Soledad',
  '[
    {"tipo": "normal", "talla": "M", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  null,
  null,
  null,
  false,
  '2025-11-21 10:00:00'
);

-- Pedido 36: David Romero - PENDIENTE
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'David Romero',
  '',
  'Brisas Orinoco',
  '[
    {"tipo": "directiva_zona", "talla": "XL", "nombre": "David Romero", "texto_frente": "Líder"}
  ]'::jsonb,
  1,
  null,
  null,
  null,
  false,
  '2025-11-21 10:00:00'
);

-- Pedido 37: Gabriel Salge - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Gabriel Salge',
  '',
  'Distrito',
  '[
    {"tipo": "directiva_zona", "talla": "S", "nombre": "Gabriel Salge", "texto_frente": "Líder"}
  ]'::jsonb,
  1,
  2415.78,
  '37899',
  '2025-11-24',
  true,
  '2025-11-24 10:00:00'
);

-- Pedido 38: Leidy de Medina - PAGADO
INSERT INTO pedidos (nombre_persona, celular, iglesia, camisas, total_camisas, monto_pago, referencia_pago, fecha_pago, pagado, created_at)
VALUES (
  'Leidy De Medina',
  '',
  'Llano Alto',
  '[
    {"tipo": "normal", "talla": "S", "nombre": null, "texto_frente": null}
  ]'::jsonb,
  1,
  2431.10,
  '39702',
  '2025-11-25',
  true,
  '2025-11-25 10:00:00'
);
