// Utilidad para obtener el precio del dólar desde DolarAPI Venezuela

const API_URL = 'https://ve.dolarapi.com/v1/dolares/oficial'

// Cache para evitar múltiples llamadas
let cacheData = null
let cacheTime = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export const obtenerDolarHoy = async () => {
  try {
    // Si hay cache válido, usarlo
    if (cacheData && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
      return cacheData
    }

    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('Error al obtener el precio del dólar')
    }

    const data = await response.json()
    
    // La API devuelve un objeto con el precio oficial del BCV
    // Formato: {"promedio": 50.23, "fechaActualizacion": "2024-11-24T10:00:00.000Z", ...}
    if (data && data.promedio) {
      const dolarData = {
        precio: parseFloat(data.promedio),
        fecha: data.fechaActualizacion,
        titulo: 'BCV Oficial'
      }
      
      // Guardar en cache
      cacheData = dolarData
      cacheTime = Date.now()
      
      return dolarData
    }

    throw new Error('Formato de respuesta inválido')
  } catch (error) {
    console.error('Error al obtener dólar:', error)
    // Retornar un valor por defecto en caso de error
    return {
      precio: 50.00, // Valor por defecto
      fecha: new Date().toISOString(),
      titulo: 'BCV (Valor por defecto)',
      error: true
    }
  }
}

// Función para obtener el dólar de una fecha específica (simulado)
// Nota: La API no proporciona histórico, así que usamos el valor actual
export const obtenerDolarPorFecha = async (fecha) => {
  // Por ahora retornamos el valor actual ya que la API no tiene histórico
  // En producción, deberías guardar el valor del dólar en tu base de datos
  // cuando se registra el pago
  return await obtenerDolarHoy()
}

// Precios de las camisas en dólares
export const PRECIOS_CAMISAS = {
  normal: 10,
  directiva_club: 10,
  directiva_zona: 7
}

export const calcularPrecioCamisa = (tipo) => {
  return PRECIOS_CAMISAS[tipo] || 10
}

export const calcularTotalPedido = (camisas) => {
  return camisas.reduce((total, camisa) => {
    return total + calcularPrecioCamisa(camisa.tipo)
  }, 0)
}

export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(precio)
}
