-- Script para agregar el campo codigo_unico a la tabla pedidos
-- Ejecuta este código en el editor SQL de Supabase

-- Agregar la columna codigo_unico
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS codigo_unico TEXT UNIQUE;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_pedidos_codigo_unico ON pedidos(codigo_unico);

-- Función para generar código único
CREATE OR REPLACE FUNCTION generar_codigo_unico()
RETURNS TEXT AS $$
DECLARE
  codigo TEXT;
  existe BOOLEAN;
BEGIN
  LOOP
    -- Generar código de 8 caracteres alfanuméricos
    codigo := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    
    -- Verificar si ya existe
    SELECT EXISTS(SELECT 1 FROM pedidos WHERE codigo_unico = codigo) INTO existe;
    
    -- Si no existe, salir del loop
    IF NOT existe THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN codigo;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar código único automáticamente al insertar
CREATE OR REPLACE FUNCTION asignar_codigo_unico()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.codigo_unico IS NULL THEN
    NEW.codigo_unico := generar_codigo_unico();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eliminar trigger anterior si existe
DROP TRIGGER IF EXISTS trigger_asignar_codigo_unico ON pedidos;

-- Crear trigger
CREATE TRIGGER trigger_asignar_codigo_unico
BEFORE INSERT ON pedidos
FOR EACH ROW
EXECUTE FUNCTION asignar_codigo_unico();

-- Generar códigos únicos para pedidos existentes que no tengan
UPDATE pedidos 
SET codigo_unico = generar_codigo_unico()
WHERE codigo_unico IS NULL;

-- Comentario en la columna
COMMENT ON COLUMN pedidos.codigo_unico IS 'Código único de 8 caracteres para acceder al pedido';
