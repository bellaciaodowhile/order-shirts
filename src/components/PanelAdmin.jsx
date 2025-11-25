import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import * as XLSX from 'xlsx'
import { obtenerDolarHoy, calcularTotalPedido, formatearPrecio } from '../utils/dolarApi'
import './PanelAdmin.css'

function PanelAdmin() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [dolarHoy, setDolarHoy] = useState(null)

  useEffect(() => {
    cargarPedidos()
    cargarDolar()
  }, [])

  const cargarDolar = async () => {
    const dolar = await obtenerDolarHoy()
    setDolarHoy(dolar)
  }

  const cargarPedidos = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPedidos(data || [])
    } catch (error) {
      console.error('Error al cargar pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  const marcarComoPagado = async (id) => {
    if (!confirm('¿Estás seguro de marcar este pedido como pagado?')) return

    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ pagado: true })
        .eq('id', id)

      if (error) throw error
      cargarPedidos()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar el pedido')
    }
  }

  const eliminarPedido = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este pedido?')) return

    try {
      const { error } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', id)

      if (error) throw error
      cargarPedidos()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar el pedido')
    }
  }

  const enviarConfirmacionPago = (pedido) => {
    // Generar resumen del pedido
    let resumen = `✅ *PAGO CONFIRMADO*\n\n`
    resumen += `Hola ${pedido.nombre_persona},\n\n`
    resumen += `Tu pago ha sido confirmado exitosamente. 🎉\n\n`
    resumen += `📋 *RESUMEN DE TU PEDIDO:*\n\n`
    
    // Listar camisas
    if (pedido.camisas && pedido.camisas.length > 0) {
      pedido.camisas.forEach((camisa, index) => {
        resumen += `*Camisa ${index + 1}:*\n`
        resumen += `• Tipo: ${
          camisa.tipo === 'normal' ? 'Normal' :
          camisa.tipo === 'directiva_club' ? 'Directiva Club' :
          'Directiva ZONA'
        }\n`
        resumen += `• Talla: ${camisa.talla}\n`
        if (camisa.texto_frente) {
          resumen += `• Texto al frente: ${camisa.texto_frente}\n`
        }
        if (camisa.nombre) {
          resumen += `• Nombre detrás: ${camisa.nombre}\n`
        }
        resumen += `\n`
      })
    }
    
    resumen += `📊 *Total de camisas:* ${pedido.total_camisas}\n\n`
    
    // Calcular total si hay camisas
    if (pedido.camisas && pedido.camisas.length > 0) {
      const totalDolares = calcularTotalPedido(pedido.camisas)
      resumen += `💵 *Total:* $${formatearPrecio(totalDolares)}\n`
      
      if (dolarHoy) {
        const totalBs = totalDolares * dolarHoy.precio
        resumen += `💰 *Total en Bs:* ${formatearPrecio(totalBs)}\n`
      }
    }
    
    resumen += `\n¡Gracias por tu pedido! 🙏`
    
    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(resumen)
    const numeroLimpio = pedido.celular.replace(/[^0-9]/g, '')
    const urlWhatsApp = `https://wa.me/${numeroLimpio}?text=${mensajeCodificado}`
    
    // Abrir WhatsApp en nueva pestaña
    window.open(urlWhatsApp, '_blank')
  }

  const pedidosFiltrados = pedidos.filter(pedido => {
    const cumpleFiltro = 
      filtro === 'todos' ||
      (filtro === 'pagados' && pedido.pagado) ||
      (filtro === 'pendientes' && !pedido.pagado)

    const cumpleBusqueda = 
      pedido.nombre_persona.toLowerCase().includes(busqueda.toLowerCase()) ||
      pedido.iglesia.toLowerCase().includes(busqueda.toLowerCase()) ||
      pedido.celular.includes(busqueda)

    // Filtro por fecha
    let cumpleFecha = true
    if (fechaInicio || fechaFin) {
      const fechaPedido = new Date(pedido.created_at)
      
      if (fechaInicio) {
        const inicio = new Date(fechaInicio)
        inicio.setHours(0, 0, 0, 0)
        if (fechaPedido < inicio) cumpleFecha = false
      }
      
      if (fechaFin) {
        const fin = new Date(fechaFin)
        fin.setHours(23, 59, 59, 999)
        if (fechaPedido > fin) cumpleFecha = false
      }
    }

    return cumpleFiltro && cumpleBusqueda && cumpleFecha
  })

  // Calcular estadísticas detalladas
  const estadisticas = {
    // Pedidos
    totalPedidos: pedidos.length,
    pedidosPagados: pedidos.filter(p => p.pagado).length,
    pedidosPendientes: pedidos.filter(p => !p.pagado).length,
    
    // Camisas totales
    totalCamisas: pedidos.reduce((sum, p) => sum + p.total_camisas, 0),
    
    // Camisas pagadas y pendientes
    camisasPagadas: pedidos
      .filter(p => p.pagado)
      .reduce((sum, p) => sum + p.total_camisas, 0),
    camisasPendientes: pedidos
      .filter(p => !p.pagado)
      .reduce((sum, p) => sum + p.total_camisas, 0),
    
    // Camisas por tipo
    camisasNormales: pedidos.reduce((sum, p) => {
      if (p.camisas && Array.isArray(p.camisas)) {
        return sum + p.camisas.filter(c => c.tipo === 'normal').length
      }
      return sum
    }, 0),
    camisasDirectivaClub: pedidos.reduce((sum, p) => {
      if (p.camisas && Array.isArray(p.camisas)) {
        return sum + p.camisas.filter(c => c.tipo === 'directiva_club').length
      }
      return sum
    }, 0),
    camisasDirectivaZona: pedidos.reduce((sum, p) => {
      if (p.camisas && Array.isArray(p.camisas)) {
        return sum + p.camisas.filter(c => c.tipo === 'directiva_zona').length
      }
      return sum
    }, 0)
  }

  // Calcular totales en dólares (solo pedidos pagados)
  const totalDolaresPagados = pedidos
    .filter(p => p.pagado)
    .reduce((sum, p) => {
      if (p.camisas && Array.isArray(p.camisas)) {
        return sum + calcularTotalPedido(p.camisas)
      }
      return sum
    }, 0)

  const totalBolivaresPagados = dolarHoy ? totalDolaresPagados * dolarHoy.precio : 0

  const exportarCamisasExcel = () => {
    // Recopilar todas las camisas de todos los pedidos
    const todasLasCamisas = []
    
    pedidosFiltrados.forEach(pedido => {
      if (pedido.camisas && Array.isArray(pedido.camisas)) {
        pedido.camisas.forEach(camisa => {
          todasLasCamisas.push({
            'Persona': pedido.nombre_persona,
            'Iglesia': pedido.iglesia,
            'Celular': pedido.celular,
            'Tipo Camisa': camisa.tipo === 'normal' ? 'Normal' : 
                          camisa.tipo === 'directiva_club' ? 'Directiva Club' : 
                          'Directiva ZONA',
            'Talla': camisa.talla,
            'Nombre Detrás': camisa.nombre || '',
            'Texto Frente': camisa.texto_frente || '',
            'Pagado': pedido.pagado ? 'Sí' : 'No'
          })
        })
      }
    })

    // Crear libro de Excel
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(todasLasCamisas)
    
    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 25 }, // Persona
      { wch: 25 }, // Iglesia
      { wch: 15 }, // Celular
      { wch: 18 }, // Tipo Camisa
      { wch: 8 },  // Talla
      { wch: 25 }, // Nombre Detrás
      { wch: 20 }, // Texto Frente
      { wch: 10 }  // Pagado
    ]
    ws['!cols'] = colWidths
    
    XLSX.utils.book_append_sheet(wb, ws, 'Detalle Camisas')
    
    // Descargar archivo
    XLSX.writeFile(wb, `camisas_detalle_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportarResumenExcel = () => {
    // Agrupar camisas por tipo y talla
    const resumen = {}
    
    pedidosFiltrados.forEach(pedido => {
      if (pedido.camisas && Array.isArray(pedido.camisas)) {
        pedido.camisas.forEach(camisa => {
          const tipo = camisa.tipo === 'normal' ? 'Normal' : 
                      camisa.tipo === 'directiva_club' ? 'Directiva Club' : 
                      'Directiva ZONA'
          const key = `${tipo} - Talla ${camisa.talla}`
          
          if (!resumen[key]) {
            resumen[key] = {
              tipo: tipo,
              talla: camisa.talla,
              cantidad: 0,
              nombres: []
            }
          }
          
          resumen[key].cantidad++
          
          // Agregar nombres para directivas de ZONA
          if (camisa.tipo === 'directiva_zona' && camisa.nombre) {
            resumen[key].nombres.push(`${camisa.nombre} (${camisa.texto_frente || 'Sin texto'})`)
          }
        })
      }
    })

    // Convertir a array para Excel
    const resumenArray = Object.values(resumen).map(item => ({
      'Tipo': item.tipo,
      'Talla': item.talla,
      'Cantidad': item.cantidad,
      'Nombres/Detalles': item.nombres.join('; ')
    }))

    // Crear libro de Excel
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(resumenArray)
    
    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 18 }, // Tipo
      { wch: 8 },  // Talla
      { wch: 10 }, // Cantidad
      { wch: 60 }  // Nombres/Detalles
    ]
    ws['!cols'] = colWidths
    
    XLSX.utils.book_append_sheet(wb, ws, 'Resumen por Talla')
    
    // Descargar archivo
    XLSX.writeFile(wb, `resumen_tallas_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  if (loading) {
    return (
      <div className="panel-container">
        <div className="loading">⏳ Cargando pedidos...</div>
      </div>
    )
  }

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2 className="panel-title">📊 Panel de Administración</h2>
        
        {/* Totales Principales */}
        <div className="totales-principales">
          <div className="total-principal-card">
            <div className="total-principal-label">💵 Total Pagado (USD)</div>
            <div className="total-principal-valor">${formatearPrecio(totalDolaresPagados)}</div>
          </div>
          {dolarHoy && (
            <div className="total-principal-card bolivares">
              <div className="total-principal-label">💰 Total Pagado (Bs)</div>
              <div className="total-principal-valor">Bs. {formatearPrecio(totalBolivaresPagados)}</div>
            </div>
          )}
        </div>

        {/* Dólar del día */}
        {dolarHoy && (
          <div className="dolar-banner">
            <span className="dolar-label">
              💵 Dólar BCV [{new Date(dolarHoy.fecha).toLocaleDateString('es-VE')}]:
            </span>
            <span className="dolar-precio">Bs. {formatearPrecio(dolarHoy.precio)}</span>
          </div>
        )}

        {/* Estadísticas de Pedidos */}
        <div className="estadisticas-section">
          <h3 className="stats-title">📦 Pedidos</h3>
          <div className="estadisticas">
            <div className="stat-card">
              <div className="stat-number">{estadisticas.totalPedidos}</div>
              <div className="stat-label">Total Pedidos</div>
            </div>
            <div className="stat-card success">
              <div className="stat-number">{estadisticas.pedidosPagados}</div>
              <div className="stat-label">Pagados</div>
            </div>
            <div className="stat-card warning">
              <div className="stat-number">{estadisticas.pedidosPendientes}</div>
              <div className="stat-label">Pendientes</div>
            </div>
          </div>
        </div>

        {/* Estadísticas de Camisas - Lista Simple */}
        <div className="estadisticas-lista">
          <h3 className="stats-title">👕 Estadísticas de Camisas</h3>
          <div className="stats-simple-container">
            <div className="stat-item-simple">
              <span className="stat-label-simple">Total de camisas:</span>
              <span className="stat-value-simple">{estadisticas.totalCamisas}</span>
            </div>
            <div className="stat-item-simple success-text">
              <span className="stat-label-simple">Camisas pagadas:</span>
              <span className="stat-value-simple">{estadisticas.camisasPagadas}</span>
            </div>
            <div className="stat-item-simple warning-text">
              <span className="stat-label-simple">Camisas pendientes:</span>
              <span className="stat-value-simple">{estadisticas.camisasPendientes}</span>
            </div>
          </div>
        </div>

        {/* Estadísticas por Tipo de Camisa - Lista Simple */}
        <div className="estadisticas-lista">
          <h3 className="stats-title">📊 Por Tipo de Camisa</h3>
          <div className="stats-simple-container">
            <div className="stat-item-simple tipo-normal-text">
              <span className="stat-label-simple">👕 Normales:</span>
              <span className="stat-value-simple">{estadisticas.camisasNormales}</span>
            </div>
            <div className="stat-item-simple tipo-club-text">
              <span className="stat-label-simple">🎖️ Directiva Club:</span>
              <span className="stat-value-simple">{estadisticas.camisasDirectivaClub}</span>
            </div>
            <div className="stat-item-simple tipo-zona-text">
              <span className="stat-label-simple">👔 Directiva ZONA:</span>
              <span className="stat-value-simple">{estadisticas.camisasDirectivaZona}</span>
            </div>
          </div>
        </div>

        <div className="controles">
          <input 
            type="text"
            className="busqueda-input"
            placeholder="🔍 Buscar por nombre, iglesia o celular..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {/* Filtros por fecha */}
          <div className="filtros-fecha">
            <div className="fecha-input-group">
              <label className="fecha-label">📅 Desde:</label>
              <input 
                type="date"
                className="fecha-input"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="fecha-input-group">
              <label className="fecha-label">📅 Hasta:</label>
              <input 
                type="date"
                className="fecha-input"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            {(fechaInicio || fechaFin) && (
              <button 
                className="btn-limpiar-fechas"
                onClick={() => {
                  setFechaInicio('')
                  setFechaFin('')
                }}
              >
                🗑️ Limpiar
              </button>
            )}
          </div>
          
          <div className="filtros">
            <button 
              className={`filtro-btn ${filtro === 'todos' ? 'active' : ''}`}
              onClick={() => setFiltro('todos')}
            >
              Todos
            </button>
            <button 
              className={`filtro-btn ${filtro === 'pagados' ? 'active' : ''}`}
              onClick={() => setFiltro('pagados')}
            >
              Pagados
            </button>
            <button 
              className={`filtro-btn ${filtro === 'pendientes' ? 'active' : ''}`}
              onClick={() => setFiltro('pendientes')}
            >
              Pendientes
            </button>
          </div>

          <div className="exportar-section">
            <button 
              className="btn-exportar"
              onClick={exportarCamisasExcel}
              disabled={pedidosFiltrados.length === 0}
            >
              📥 Exportar Detalle (Excel)
            </button>
            <button 
              className="btn-exportar secondary"
              onClick={exportarResumenExcel}
              disabled={pedidosFiltrados.length === 0}
            >
              📊 Exportar Resumen (Excel)
            </button>
          </div>
        </div>
      </div>

      <div className="pedidos-lista">
        {pedidosFiltrados.length === 0 ? (
          <div className="no-pedidos">
            <p>📭 No hay pedidos que mostrar</p>
          </div>
        ) : (
          pedidosFiltrados.map(pedido => (
            <div key={pedido.id} className={`pedido-card ${pedido.pagado ? 'pagado' : 'pendiente'}`}>
              <div className="pedido-header">
                <div className="pedido-info">
                  <h3 className="pedido-nombre">{pedido.nombre_persona}</h3>
                  <span className={`pedido-badge ${pedido.pagado ? 'badge-success' : 'badge-warning'}`}>
                    {pedido.pagado ? '✅ Pagado' : '⏳ Pendiente de Pago'}
                  </span>
                </div>
                <div className="pedido-acciones">
                  {!pedido.pagado && (
                    <button 
                      className="btn-accion btn-pagar"
                      onClick={() => marcarComoPagado(pedido.id)}
                      title="Marcar como pagado"
                    >
                      Marcar como pagado 💳
                    </button>
                  )}
                  <button 
                    className="btn-accion btn-eliminar"
                    onClick={() => eliminarPedido(pedido.id)}
                    title="Eliminar pedido"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="pedido-detalles">
                <div className="detalle-row">
                  <span className="detalle-label">📱 Celular:</span>
                  <div className="celular-actions">
                    <span className="detalle-valor">{pedido.celular}</span>
                    <div className="contact-buttons">
                      <a 
                        href={`tel:${pedido.celular}`}
                        className="btn-contact phone"
                        title="Llamar"
                      >
                        📞
                      </a>
                      <a 
                        href={`https://wa.me/${pedido.celular.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-contact whatsapp"
                        title="WhatsApp"
                      >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </a>
                      <button
                        className="btn-confirmar-pago"
                        onClick={() => enviarConfirmacionPago(pedido)}
                        disabled={!pedido.pagado}
                        title={pedido.pagado ? "Enviar confirmación de pago" : "El pedido debe estar marcado como pagado"}
                      >
                        ✅ Pago Confirmado
                      </button>
                    </div>
                  </div>
                </div>
                <div className="detalle-row">
                  <span className="detalle-label">⛪ Iglesia:</span>
                  <span className="detalle-valor">{pedido.iglesia}</span>
                </div>

                {/* Lista de camisas */}
                <div className="detalle-row">
                  <span className="detalle-label">👕 Camisas del pedido:</span>
                </div>
                <div className="camisas-lista-admin">
                  {pedido.camisas && pedido.camisas.map((camisa, index) => {
                    const precioCamisa = camisa.tipo === 'directiva_zona' ? 7 : 10
                    return (
                      <div key={index} className="camisa-item-admin">
                        <div className="camisa-numero-admin">Camisa #{index + 1}</div>
                        <div className="camisa-detalles-admin">
                          <span className="camisa-tipo-badge">
                            {camisa.tipo === 'normal' && '👕 Normal'}
                            {camisa.tipo === 'directiva_club' && '🎖️ Dir. Club'}
                            {camisa.tipo === 'directiva_zona' && '👔 Dir. ZONA'}
                          </span>
                          <span className="camisa-talla-badge">Talla: {camisa.talla}</span>
                          <span className="camisa-precio-badge">${precioCamisa}</span>
                          {camisa.texto_frente && (
                            <div className="camisa-personalizacion">
                              <strong>Frente:</strong> {camisa.texto_frente}
                            </div>
                          )}
                          {camisa.nombre && (
                            <div className="camisa-personalizacion">
                              <strong>Detrás:</strong> {camisa.nombre}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Cálculo de totales */}
                {pedido.camisas && pedido.camisas.length > 0 && (
                  <div className="totales-pedido">
                    <div className="total-row">
                      <span>🎽 Total camisas:</span>
                      <span className="total-valor">{pedido.total_camisas}</span>
                    </div>
                    <div className="total-row">
                      <span>💵 Total en dólares:</span>
                      <span className="total-valor">${calcularTotalPedido(pedido.camisas)}</span>
                    </div>
                    {dolarHoy && (
                      <div className="total-row destacado">
                        <span>💰 Total en bolívares:</span>
                        <span className="total-valor-bs">
                          Bs. {formatearPrecio(calcularTotalPedido(pedido.camisas) * dolarHoy.precio)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {pedido.monto_pago && (
                  <>
                    <div className="detalle-row">
                      <span className="detalle-label">💰 Monto:</span>
                      <span className="detalle-valor">{pedido.monto_pago} Bs</span>
                    </div>
                    <div className="detalle-row">
                      <span className="detalle-label">🔢 Referencia:</span>
                      <span className="detalle-valor">{pedido.referencia_pago}</span>
                    </div>
                    <div className="detalle-row">
                      <span className="detalle-label">📅 Fecha pago:</span>
                      <span className="detalle-valor">{pedido.fecha_pago}</span>
                    </div>
                  </>
                )}

                <div className="detalle-row">
                  <span className="detalle-label">🕐 Fecha pedido:</span>
                  <span className="detalle-valor">
                    {new Date(pedido.created_at).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default PanelAdmin
