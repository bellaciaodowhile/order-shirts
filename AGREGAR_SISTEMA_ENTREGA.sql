-- Script para agregar sistema de entrega de camisas
-- Ejecuta este código en el editor SQL de Supabase

-- ============================================
-- AGREGAR CAMPOS DE ENTREGA A LA TABLA PEDIDOS
-- ============================================

-- Agregar columnas para el sistema de entrega
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS entregado BOOLEAN DEFAULT FALSE;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS fecha_entrega TIMESTAMP WITH TIME ZONE;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS entregado_por TEXT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS notas_entrega TEXT;

-- Crear índice para búsquedas rápidas por estado de entrega
CREATE INDEX IF NOT EXISTS idx_pedidos_entregado ON pedidos(entregado);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha_entrega ON pedidos(fecha_entrega DESC);

-- ============================================
-- TABLA PARA DETALLE DE ENTREGA POR CAMISA
-- ============================================

-- Crear tabla para registrar la entrega individual de cada camisa
CREATE TABLE IF NOT EXISTS entregas_camisas (
  id BIGSERIAL PRIMARY KEY,
  pedido_id BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  camisa_index INTEGER NOT NULL,
  tipo_camisa TEXT NOT NULL,
  talla TEXT NOT NULL,
  nombre_camisa TEXT,
  texto_frente TEXT,
  entregada BOOLEAN DEFAULT FALSE,
  fecha_entrega TIMESTAMP WITH TIME ZONE,
  entregado_por TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para la tabla de entregas
CREATE INDEX IF NOT EXISTS idx_entregas_pedido_id ON entregas_camisas(pedido_id);
CREATE INDEX IF NOT EXISTS idx_entregas_entregada ON entregas_camisas(entregada);
CREATE INDEX IF NOT EXISTS idx_entregas_tipo_camisa ON entregas_camisas(tipo_camisa);
CREATE INDEX IF NOT EXISTS idx_entregas_talla ON entregas_camisas(talla);

-- ============================================
-- FUNCIÓN PARA SINCRONIZAR ENTREGAS
-- ============================================

-- Función para crear registros de entrega cuando se crea un pedido
CREATE OR REPLACE FUNCTION crear_registros_entrega()
RETURNS TRIGGER AS $$
DECLARE
  camisa JSONB;
  idx INTEGER := 0;
BEGIN
  -- Iterar sobre cada camisa del pedido
  FOR camisa IN SELECT * FROM jsonb_array_elements(NEW.camisas)
  LOOP
    INSERT INTO entregas_camisas (
      pedido_id,
      camisa_index,
      tipo_camisa,
      talla,
      nombre_camisa,
      texto_frente,
      entregada
    ) VALUES (
      NEW.id,
      idx,
      camisa->>'tipo',
      camisa->>'talla',
      camisa->>'nombre',
      camisa->>'texto_frente',
      FALSE
    );
    idx := idx + 1;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eliminar trigger anterior si existe
DROP TRIGGER IF EXISTS trigger_crear_registros_entrega ON pedidos;

-- Crear trigger para nuevos pedidos
CREATE TRIGGER trigger_crear_registros_entrega
AFTER INSERT ON pedidos
FOR EACH ROW
EXECUTE FUNCTION crear_registros_entrega();

-- ============================================
-- FUNCIÓN PARA ACTUALIZAR ESTADO DE PEDIDO
-- ============================================

-- Función para actualizar el estado de entrega del pedido
CREATE OR REPLACE FUNCTION actualizar_estado_entrega_pedido()
RETURNS TRIGGER AS $$
DECLARE
  total_camisas INTEGER;
  camisas_entregadas INTEGER;
BEGIN
  -- Contar total de camisas y camisas entregadas
  SELECT COUNT(*), COUNT(*) FILTER (WHERE entregada = TRUE)
  INTO total_camisas, camisas_entregadas
  FROM entregas_camisas
  WHERE pedido_id = NEW.pedido_id;
  
  -- Si todas las camisas están entregadas, marcar el pedido como entregado
  IF total_camisas = camisas_entregadas THEN
    UPDATE pedidos
    SET entregado = TRUE,
        fecha_entrega = NOW()
    WHERE id = NEW.pedido_id;
  ELSE
    UPDATE pedidos
    SET entregado = FALSE,
        fecha_entrega = NULL
    WHERE id = NEW.pedido_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eliminar trigger anterior si existe
DROP TRIGGER IF EXISTS trigger_actualizar_estado_entrega ON entregas_camisas;

-- Crear trigger para actualizar estado del pedido
CREATE TRIGGER trigger_actualizar_estado_entrega
AFTER INSERT OR UPDATE ON entregas_camisas
FOR EACH ROW
EXECUTE FUNCTION actualizar_estado_entrega_pedido();

-- ============================================
-- CREAR REGISTROS DE ENTREGA PARA PEDIDOS EXISTENTES
-- ============================================

-- Crear registros de entrega para pedidos que ya existen
DO $$
DECLARE
  pedido_record RECORD;
  camisa JSONB;
  idx INTEGER;
BEGIN
  FOR pedido_record IN SELECT id, camisas FROM pedidos WHERE camisas IS NOT NULL
  LOOP
    idx := 0;
    FOR camisa IN SELECT * FROM jsonb_array_elements(pedido_record.camisas)
    LOOP
      -- Verificar si ya existe el registro
      IF NOT EXISTS (
        SELECT 1 FROM entregas_camisas 
        WHERE pedido_id = pedido_record.id AND camisa_index = idx
      ) THEN
        INSERT INTO entregas_camisas (
          pedido_id,
          camisa_index,
          tipo_camisa,
          talla,
          nombre_camisa,
          texto_frente,
          entregada
        ) VALUES (
          pedido_record.id,
          idx,
          camisa->>'tipo',
          camisa->>'talla',
          camisa->>'nombre',
          camisa->>'texto_frente',
          FALSE
        );
      END IF;
      idx := idx + 1;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- COMENTARIOS EN LAS COLUMNAS
-- ============================================

COMMENT ON COLUMN pedidos.entregado IS 'Indica si todas las camisas del pedido han sido entregadas';
COMMENT ON COLUMN pedidos.fecha_entrega IS 'Fecha en que se completó la entrega de todas las camisas';
COMMENT ON COLUMN pedidos.entregado_por IS 'Nombre de la persona que entregó el pedido';
COMMENT ON COLUMN pedidos.notas_entrega IS 'Notas adicionales sobre la entrega';

COMMENT ON TABLE entregas_camisas IS 'Tabla para registrar la entrega individual de cada camisa';
COMMENT ON COLUMN entregas_camisas.pedido_id IS 'ID del pedido al que pertenece la camisa';
COMMENT ON COLUMN entregas_camisas.camisa_index IS 'Índice de la camisa en el array del pedido';
COMMENT ON COLUMN entregas_camisas.entregada IS 'Indica si esta camisa específica ha sido entregada';
COMMENT ON COLUMN entregas_camisas.fecha_entrega IS 'Fecha en que se entregó esta camisa';
COMMENT ON COLUMN entregas_camisas.entregado_por IS 'Nombre de quien entregó esta camisa';
