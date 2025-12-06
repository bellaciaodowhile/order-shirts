# 🎽 Sistema de Pedidos de Camisas

Sistema completo para gestionar pedidos de camisas con diferentes tipos (Directiva de ZONA, Directiva de Club, Miembro Normal) usando React y Supabase.

## 🚀 Características

- ✅ Formulario de pedidos con validación
- ✅ Tres tipos de camisas con personalizaciones diferentes
- ✅ Selección de tallas múltiples (8, 10, 12, 16, S, M, L, XL, 2XL)
- ✅ Gestión de pagos (opcional al momento del pedido)
- ✅ Panel administrativo con estadísticas detalladas
- ✅ **Panel de entregas con seguimiento individual de camisas**
- ✅ Filtros y búsqueda avanzada de pedidos
- ✅ Exportación a Excel (detalle y resumen)
- ✅ Códigos QR para cada pedido
- ✅ Diseño responsive y moderno
- ✅ Indicadores de estado de pago y entrega

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

### Panel Administrativo (Ruta: `/admin`)

El panel administrativo incluye dos pestañas integradas:

#### 📊 Pestaña Administración
- Ver todos los pedidos con detalles completos
- Filtrar por estado de pago (Todos, Pagados, Pendientes)
- Filtrar por tipo de camisa
- Buscar por nombre, iglesia, celular o texto en camisas
- Filtrar por rango de fechas
- Marcar pedidos como pagados con referencia
- Editar camisas de pedidos existentes
- Eliminar pedidos
- Ver estadísticas detalladas (pedidos, camisas, tipos)
- Exportar a Excel (detalle completo y resumen por tallas)
- Generar y descargar códigos QR
- Enviar confirmación de pago por WhatsApp
- Ver totales en dólares y bolívares

#### 📦 Pestaña Entregas
- **Seguimiento individual de cada camisa**
- Filtros por estado (Pendientes, Entregadas, Todos)
- Filtros por tipo de camisa y talla
- Búsqueda por nombre, código único o iglesia
- Marcar camisas individuales como entregadas
- Marcar múltiples camisas como entregadas
- Desmarcar entregas (revertir)
- Ver resumen por tallas con estadísticas
- Exportar reporte de entregas a Excel
- Ver pedido completo desde cada camisa
- Estadísticas en tiempo real (total, entregadas, pendientes)

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

## 📦 Sistema de Entregas

El sistema incluye un módulo completo para gestionar la entrega de camisas:

### Configuración Inicial

1. Ejecuta el script SQL `AGREGAR_SISTEMA_ENTREGA.sql` en Supabase
2. Esto creará:
   - Tabla `entregas_camisas` para seguimiento individual
   - Triggers automáticos para sincronizar entregas
   - Índices para búsquedas rápidas

### Funcionalidades del Panel de Entregas

**Gestión Individual:**
- Cada camisa de cada pedido se registra individualmente
- Permite marcar entregas una por una
- Registra quién entregó y cuándo
- Permite desmarcar entregas si hay errores

**Filtros Avanzados:**
- Por estado: Pendientes, Entregadas, Todos
- Por tipo de camisa: Normal, Directiva Club, Directiva ZONA
- Por talla: Todas las tallas disponibles
- Búsqueda por nombre, código único o iglesia

**Acciones Masivas:**
- Marcar todas las camisas filtradas como entregadas
- Útil para entregas grupales

**Reportes:**
- Resumen visual por tallas con estadísticas
- Exportación a Excel con todos los detalles
- Estadísticas en tiempo real

### Flujo de Trabajo Recomendado

1. **Recepción del Pedido**: Se crea en el formulario
2. **Confirmación de Pago**: Se marca en el panel administrativo
3. **Preparación**: Se revisan las camisas en el panel de entregas
4. **Entrega**: Se marcan como entregadas individualmente o en grupo
5. **Seguimiento**: Se puede ver el historial completo

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
