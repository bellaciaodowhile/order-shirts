# 🎽 Sistema de Pedidos de Camisas

Sistema completo para gestionar pedidos de camisas con diferentes tipos (Directiva de ZONA, Directiva de Club, Miembro Normal) usando React y Supabase.

## 🚀 Características

- ✅ Formulario de pedidos con validación
- ✅ Tres tipos de camisas con personalizaciones diferentes
- ✅ Selección de tallas múltiples (8, 12, 16, S, M, L, XL, 2XL)
- ✅ Gestión de pagos (opcional al momento del pedido)
- ✅ Panel administrativo con estadísticas
- ✅ Filtros y búsqueda de pedidos
- ✅ Diseño responsive y moderno
- ✅ Indicadores de estado de pago

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- Cuenta en Supabase

## 🛠️ Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto

### 2. Crear la tabla en Supabase

Ejecuta este SQL en el editor SQL de Supabase:

```sql
CREATE TABLE pedidos (
  id BIGSERIAL PRIMARY KEY,
  tipo_camisa TEXT NOT NULL,
  nombre_persona TEXT NOT NULL,
  celular TEXT NOT NULL,
  iglesia TEXT NOT NULL,
  nombre_camisa TEXT,
  tipo_directiva TEXT,
  tallas JSONB NOT NULL,
  total_camisas INTEGER NOT NULL,
  monto_pago DECIMAL(10,2),
  referencia_pago TEXT,
  fecha_pago DATE,
  pagado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (opcional para desarrollo)
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas las operaciones (solo para desarrollo)
CREATE POLICY "Permitir todo" ON pedidos FOR ALL USING (true);
```

### 3. Obtener credenciales

1. Ve a Settings > API en tu proyecto de Supabase
2. Copia la URL del proyecto
3. Copia la clave anon/public

## 🔧 Instalación

1. Clona o descarga el proyecto

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre tu navegador en `http://localhost:5173`

## 📱 Uso del Sistema

### Hacer un Pedido

1. Selecciona el tipo de camisa:
   - **Directiva de ZONA**: Permite personalizar con nombre detrás y tipo de directiva al frente
   - **Directiva de Club**: Incluye "Director" al frente y nombre detrás
   - **Miembro Normal**: Camisa sin personalizaciones

2. Completa los datos personales:
   - Nombre completo
   - Número de celular
   - Iglesia

3. Selecciona tallas y cantidades

4. (Opcional) Ingresa información de pago:
   - Monto pagado
   - Referencia de pago
   - Fecha de pago

5. Haz clic en "Registrar Pedido"

### Panel Administrativo

- Ver todos los pedidos
- Filtrar por estado (Todos, Pagados, Pendientes)
- Buscar por nombre, iglesia o celular
- Marcar pedidos como pagados
- Eliminar pedidos
- Ver estadísticas generales

## 🎨 Personalización

### Cambiar imágenes de camisas

Edita el archivo `src/components/FormularioPedido.jsx` y reemplaza las URLs de las imágenes:

```jsx
<img 
  src={tipoCamisa === 'normal' 
    ? 'URL_DE_TU_IMAGEN_NORMAL'
    : 'URL_DE_TU_IMAGEN_DIRECTIVA'
  }
  alt="Vista previa de camisa"
/>
```

### Modificar tallas disponibles

En `src/components/FormularioPedido.jsx`, edita el array:

```jsx
const TALLAS = ['8', '12', '16', 'S', 'M', 'L', 'XL', '2XL']
```

## 📦 Construcción para Producción

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/`

## 🔒 Seguridad

Para producción, configura políticas de seguridad adecuadas en Supabase:

```sql
-- Eliminar la política permisiva
DROP POLICY "Permitir todo" ON pedidos;

-- Crear políticas específicas según tus necesidades
CREATE POLICY "Permitir lectura" ON pedidos FOR SELECT USING (true);
CREATE POLICY "Permitir inserción" ON pedidos FOR INSERT WITH CHECK (true);
-- etc.
```

## 🤝 Soporte

Si tienes problemas:
1. Verifica que las credenciales de Supabase sean correctas
2. Asegúrate de que la tabla esté creada correctamente
3. Revisa la consola del navegador para errores

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y comercial.
