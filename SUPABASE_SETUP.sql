-- Script SQL para configurar la base de datos en Supabase
-- Ejecuta este código en el editor SQL de tu proyecto Supabase

-- ============================================
-- OPCIÓN 1: Si la tabla NO existe (Nueva instalación)
-- ============================================

-- Crear la tabla de pedidos con la estructura actualizada
CREATE TABLE IF NOT EXISTS pedidos (
  id BIGSERIAL PRIMARY KEY,
  nombre_persona TEXT NOT NULL,
  celular TEXT NOT NULL,
  iglesia TEXT NOT NULL,
  camisas JSONB NOT NULL DEFAULT '[]',
  total_camisas INTEGER NOT NULL DEFAULT 0,
  monto_pago DECIMAL(10,2),
  referencia_pago TEXT,
  fecha_pago DATE,
  pagado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- OPCIÓN 2: Si la tabla YA existe (Actualización)
-- ============================================

-- Eliminar columnas antiguas que ya no se usan
ALTER TABLE pedidos DROP COLUMN IF EXISTS tipo_camisa;
ALTER TABLE pedidos DROP COLUMN IF EXISTS nombre_camisa;
ALTER TABLE pedidos DROP COLUMN IF EXISTS tipo_directiva;
ALTER TABLE pedidos DROP COLUMN IF EXISTS tallas;
ALTER TABLE pedidos DROP COLUMN IF EXISTS nombres_camisas;

-- Agregar la nueva columna para almacenar el array de camisas
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS camisas JSONB NOT NULL DEFAULT '[]';

-- Asegurarse de que las columnas necesarias existan
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS nombre_persona TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS celular TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS iglesia TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS total_camisas INTEGER DEFAULT 0;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS monto_pago DECIMAL(10,2);
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS referencia_pago TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS fecha_pago DATE;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS pagado BOOLEAN DEFAULT FALSE;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Hacer que las columnas importantes sean NOT NULL (solo si están vacías)
UPDATE pedidos SET nombre_persona = 'Sin nombre' WHERE nombre_persona IS NULL;
UPDATE pedidos SET celular = 'Sin celular' WHERE celular IS NULL;
UPDATE pedidos SET iglesia = 'Sin iglesia' WHERE iglesia IS NULL;

ALTER TABLE pedidos ALTER COLUMN nombre_persona SET NOT NULL;
ALTER TABLE pedidos ALTER COLUMN celular SET NOT NULL;
ALTER TABLE pedidos ALTER COLUMN iglesia SET NOT NULL;

-- ============================================
-- Índices para mejorar el rendimiento
-- ============================================

CREATE INDEX IF NOT EXISTS idx_pedidos_pagado ON pedidos(pagado);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_nombre_persona ON pedidos(nombre_persona);
CREATE INDEX IF NOT EXISTS idx_pedidos_iglesia ON pedidos(iglesia);
CREATE INDEX IF NOT EXISTS idx_pedidos_camisas ON pedidos USING GIN (camisas);

-- ============================================
-- Row Level Security
-- ============================================

-- Habilitar Row Level Security
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Eliminar política anterior si existe
DROP POLICY IF EXISTS "Permitir todas las operaciones en desarrollo" ON pedidos;
DROP POLICY IF EXISTS "Permitir todo" ON pedidos;

-- Política para permitir todas las operaciones (SOLO PARA DESARROLLO)
-- En producción, debes crear políticas más restrictivas
CREATE POLICY "Permitir todas las operaciones" 
ON pedidos 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- ============================================
-- Función y Trigger para updated_at
-- ============================================

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Eliminar trigger anterior si existe
DROP TRIGGER IF EXISTS update_pedidos_updated_at ON pedidos;

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_pedidos_updated_at 
BEFORE UPDATE ON pedidos 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Comentarios en la tabla
-- ============================================

COMMENT ON TABLE pedidos IS 'Tabla para almacenar los pedidos de camisas';
COMMENT ON COLUMN pedidos.nombre_persona IS 'Nombre completo de la persona que hace el pedido';
COMMENT ON COLUMN pedidos.celular IS 'Número de celular de contacto';
COMMENT ON COLUMN pedidos.iglesia IS 'Nombre de la iglesia a la que asiste';
COMMENT ON COLUMN pedidos.camisas IS 'Array JSON con las camisas del pedido. Cada camisa tiene: tipo, talla, nombre (opcional), texto_frente (opcional)';
COMMENT ON COLUMN pedidos.total_camisas IS 'Cantidad total de camisas en el pedido';
COMMENT ON COLUMN pedidos.monto_pago IS 'Monto pagado por el pedido';
COMMENT ON COLUMN pedidos.referencia_pago IS 'Número de referencia del pago';
COMMENT ON COLUMN pedidos.fecha_pago IS 'Fecha en que se realizó el pago';
COMMENT ON COLUMN pedidos.pagado IS 'Indica si el pedido ha sido pagado completamente';

-- ============================================
-- Ejemplo de estructura de datos en camisas
-- ============================================

/*
Estructura del campo camisas (JSONB):
[
  {
    "tipo": "normal",
    "talla": "M",
    "nombre": null,
    "texto_frente": null
  },
  {
    "tipo": "directiva_zona",
    "talla": "L",
    "nombre": "Juan Pérez",
    "texto_frente": "Líder Juvenil"
  },
  {
    "tipo": "directiva_club",
    "talla": "XL",
    "nombre": null,
    "texto_frente": null
  }
]
*/
