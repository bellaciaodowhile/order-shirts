import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import * as XLSX from 'xlsx'
import './PanelEntregas.css'

function PanelEntregas({ standalone = false }) {
  const [camisas, setCamisas] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTalla, setFiltroTalla] = useState('todas')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [mostrarModalPedido, setMostrarModalPedido] = useState(false)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [loadingPedido, setLoadingPedido] = useState(false)
  const [resumenAbierto, setResumenAbierto] = useState(false)
  const [pedidosExpandidos, setPedidosExpandidos] = useState({})
  const [camisasSeleccionadas, setCamisasSeleccionadas] = useState({}) // {pedidoId: [camisaId1, camisaId2]}
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false)
  const [pedidoAConfirmar, setPedidoAConfirmar] = useState(null)
  const [mostrarModalDeshacer, setMostrarModalDeshacer] = useState(false)
  const [camisaADeshacer, setCamisaADeshacer] = useState(null)
  const [procesandoEntrega, setProcesandoEntrega] = useState(false)
  const [entregaExitosa, setEntregaExitosa] = useState(false)
  const [cantidadEntregada, setCantidadEntregada] = useState(0)
  const [procesandoDeshacer, setProcesandoDeshacer] = useState(false)
  const [deshacerExitoso, setDeshacerExitoso] = useState(false)
  const [mostrarModalDeshacerPedido, setMostrarModalDeshacerPedido] = useState(false)
  const [pedidoADeshacer, setPedidoADeshacer] = useState(null)
  const [filtroPago, setFiltroPago] = useState('todos')
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  useEffect(() => {
    cargarCamisas()
  }, [])

  const cargarCamisas = async () => {
    try {
      const { data, error } = await supabase
        .from('entregas_camisas')
        .select(`
          *,
          pedidos (
            nombre_persona,
            celular,
            iglesia,
            codigo_unico,
            pagado
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCamisas(data || [])
    } catch (error) {
      console.error('Error al cargar camisas:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSeleccionCamisa = (pedidoId, camisaId) => {
    setCamisasSeleccionadas(prev => {
      const seleccionadas = prev[pedidoId] || []
      const yaSeleccionada = seleccionadas.includes(camisaId)
      
      if (yaSeleccionada) {
        return {
          ...prev,
          [pedidoId]: seleccionadas.filter(id => id !== camisaId)
        }
      } else {
        return {
          ...prev,
          [pedidoId]: [...seleccionadas, camisaId]
        }
      }
    })
  }

  const abrirModalConfirmacion = (pedido) => {
    setPedidoAConfirmar(pedido)
    setMostrarModalConfirmacion(true)
  }

  const cerrarModalConfirmacion = () => {
    setMostrarModalConfirmacion(false)
    setPedidoAConfirmar(null)
  }

  const confirmarEntregas = async () => {
    if (!pedidoAConfirmar) return

    const seleccionadas = camisasSeleccionadas[pedidoAConfirmar.pedidoId] || []
    if (seleccionadas.length === 0) {
      alert('⚠️ No has seleccionado ninguna camisa')
      return
    }

    setProcesandoEntrega(true)
    setEntregaExitosa(false)

    try {
      const { error } = await supabase
        .from('entregas_camisas')
        .update({
          entregada: true,
          fecha_entrega: new Date().toISOString(),
          entregado_por: null
        })
        .in('id', seleccionadas)

      if (error) throw error

      // Limpiar selección
      setCamisasSeleccionadas(prev => ({
        ...prev,
        [pedidoAConfirmar.pedidoId]: []
      }))

      setCantidadEntregada(seleccionadas.length)
      setProcesandoEntrega(false)
      setEntregaExitosa(true)

      // Recargar datos
      await cargarCamisas()

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        cerrarModalConfirmacion()
        setEntregaExitosa(false)
      }, 2000)
    } catch (error) {
      console.error('Error:', error)
      setProcesandoEntrega(false)
      alert('❌ Error al confirmar entregas')
    }
  }

  const abrirModalDeshacer = (camisa) => {
    setCamisaADeshacer(camisa)
    setMostrarModalDeshacer(true)
  }

  const cerrarModalDeshacer = () => {
    setMostrarModalDeshacer(false)
    setCamisaADeshacer(null)
  }

  const deshacerEntrega = async () => {
    const codigo = prompt('🔐 Ingresa el código de seguridad para deshacer la entrega:')
    
    if (codigo !== 'leonel') {
      alert('❌ Código incorrecto')
      return
    }

    if (!camisaADeshacer) return

    setProcesandoDeshacer(true)
    setDeshacerExitoso(false)

    try {
      const { error } = await supabase
        .from('entregas_camisas')
        .update({
          entregada: false,
          fecha_entrega: null,
          entregado_por: null
        })
        .eq('id', camisaADeshacer.id)

      if (error) throw error

      setProcesandoDeshacer(false)
      setDeshacerExitoso(true)

      await cargarCamisas()

      setTimeout(() => {
        cerrarModalDeshacer()
        setDeshacerExitoso(false)
      }, 2000)
    } catch (error) {
      console.error('Error:', error)
      setProcesandoDeshacer(false)
      alert('❌ Error al deshacer entrega')
    }
  }

  const abrirModalDeshacerPedido = (pedido) => {
    setPedidoADeshacer(pedido)
    setMostrarModalDeshacerPedido(true)
  }

  const cerrarModalDeshacerPedido = () => {
    setMostrarModalDeshacerPedido(false)
    setPedidoADeshacer(null)
  }

  const deshacerPedidoCompleto = async () => {
    const codigo = prompt('🔐 Ingresa el código de seguridad para deshacer todas las entregas del pedido:')
    
    if (codigo !== 'leonel') {
      alert('❌ Código incorrecto')
      return
    }

    if (!pedidoADeshacer) return

    const camisasEntregadas = pedidoADeshacer.camisas.filter(c => c.entregada)
    if (camisasEntregadas.length === 0) {
      alert('⚠️ No hay camisas entregadas en este pedido')
      return
    }

    setProcesandoDeshacer(true)
    setDeshacerExitoso(false)

    try {
      const { error } = await supabase
        .from('entregas_camisas')
        .update({
          entregada: false,
          fecha_entrega: null,
          entregado_por: null
        })
        .in('id', camisasEntregadas.map(c => c.id))

      if (error) throw error

      setProcesandoDeshacer(false)
      setDeshacerExitoso(true)
      setCantidadEntregada(camisasEntregadas.length)

      await cargarCamisas()

      setTimeout(() => {
        cerrarModalDeshacerPedido()
        setDeshacerExitoso(false)
      }, 2000)
    } catch (error) {
      console.error('Error:', error)
      setProcesandoDeshacer(false)
      alert('❌ Error al deshacer entregas del pedido')
    }
  }

  const togglePedidoExpandido = (pedidoId) => {
    setPedidosExpandidos(prev => ({
      ...prev,
      [pedidoId]: !prev[pedidoId]
    }))
  }

  const reiniciarFiltros = () => {
    setBusqueda('')
    setFiltroTalla('todas')
    setFiltroTipo('todos')
    setFiltroEstado('todos')
    setFiltroPago('todos')
  }

  const verPedidoCompleto = async (codigoUnico) => {
    setLoadingPedido(true)
    setMostrarModalPedido(true)
    
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('codigo_unico', codigoUnico)
        .single()

      if (error) throw error
      setPedidoSeleccionado(data)
    } catch (error) {
      console.error('Error al cargar pedido:', error)
      alert('❌ Error al cargar el pedido')
      setMostrarModalPedido(false)
    } finally {
      setLoadingPedido(false)
    }
  }

  const cerrarModalPedido = () => {
    setMostrarModalPedido(false)
    setPedidoSeleccionado(null)
  }

  const exportarReporteExcel = () => {
    const datosExportar = camisasFiltradas.map(camisa => ({
      'Persona': camisa.pedidos?.nombre_persona || 'N/A',
      'Iglesia': camisa.pedidos?.iglesia || 'N/A',
      'Celular': camisa.pedidos?.celular || 'N/A',
      'Tipo': camisa.tipo_camisa === 'normal' ? '👕 Normal' :
              camisa.tipo_camisa === 'directiva_club' ? '🎖️ Dir. Club' :
              '👔 Dir. ZONA',
      'Talla': camisa.talla,
      'Nombre Camisa': camisa.nombre_camisa || '',
      'Texto Frente': camisa.texto_frente || '',
      'Estado': camisa.entregada ? 'Entregada' : 'Pendiente',
      'Fecha Entrega': camisa.fecha_entrega ? 
        new Date(camisa.fecha_entrega).toLocaleString('es-ES') : '',
      'Entregado Por': camisa.entregado_por || ''
    }))

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(datosExportar)
    
    const colWidths = [
      { wch: 25 }, // Persona
      { wch: 25 }, // Iglesia
      { wch: 15 }, // Celular
      { wch: 18 }, // Tipo
      { wch: 8 },  // Talla
      { wch: 20 }, // Nombre Camisa
      { wch: 20 }, // Texto Frente
      { wch: 12 }, // Estado
      { wch: 20 }, // Fecha Entrega
      { wch: 20 }  // Entregado Por
    ]
    ws['!cols'] = colWidths
    
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte Entregas')
    XLSX.writeFile(wb, `reporte_entregas_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const camisasFiltradas = camisas.filter(camisa => {
    // Filtro por búsqueda (nombre de persona, código único, nombre en camisa)
    const cumpleBusqueda = !busqueda || 
      camisa.pedidos?.nombre_persona.toLowerCase().includes(busqueda.toLowerCase()) ||
      camisa.pedidos?.codigo_unico?.toLowerCase().includes(busqueda.toLowerCase()) ||
      camisa.pedidos?.iglesia?.toLowerCase().includes(busqueda.toLowerCase()) ||
      camisa.nombre_camisa?.toLowerCase().includes(busqueda.toLowerCase())

    // Filtro por talla
    const cumpleTalla = filtroTalla === 'todas' || camisa.talla === filtroTalla

    // Filtro por tipo
    const cumpleTipo = filtroTipo === 'todos' || camisa.tipo_camisa === filtroTipo

    // Filtro por estado
    const cumpleEstado = 
      filtroEstado === 'todos' ||
      (filtroEstado === 'entregadas' && camisa.entregada) ||
      (filtroEstado === 'pendientes' && !camisa.entregada)

    // Filtro por pago
    const cumplePago = 
      filtroPago === 'todos' ||
      (filtroPago === 'pagadas' && camisa.pedidos?.pagado) ||
      (filtroPago === 'no_pagadas' && !camisa.pedidos?.pagado)

    return cumpleBusqueda && cumpleTalla && cumpleTipo && cumpleEstado && cumplePago
  })

  // Estadísticas de camisas (basadas en filtros)
  const stats = {
    total: camisasFiltradas.length,
    entregadas: camisasFiltradas.filter(c => c.entregada).length,
    pendientes: camisasFiltradas.filter(c => !c.entregada).length
  }

  // Estadísticas de pedidos (agrupando por pedido_id, basadas en filtros)
  const pedidosUnicosFiltrados = [...new Set(camisasFiltradas.map(c => c.pedido_id))]
  const pedidosStats = {
    total: pedidosUnicosFiltrados.length,
    entregados: pedidosUnicosFiltrados.filter(pedidoId => {
      const camisasPedido = camisasFiltradas.filter(c => c.pedido_id === pedidoId)
      return camisasPedido.length > 0 && camisasPedido.every(c => c.entregada)
    }).length,
    pendientes: pedidosUnicosFiltrados.filter(pedidoId => {
      const camisasPedido = camisasFiltradas.filter(c => c.pedido_id === pedidoId)
      return camisasPedido.some(c => !c.entregada)
    }).length
  }

  // Agrupar camisas por pedido
  const pedidosAgrupados = camisasFiltradas.reduce((acc, camisa) => {
    const pedidoId = camisa.pedido_id
    if (!acc[pedidoId]) {
      acc[pedidoId] = {
        pedidoId: pedidoId,
        nombrePersona: camisa.pedidos?.nombre_persona,
        iglesia: camisa.pedidos?.iglesia,
        celular: camisa.pedidos?.celular,
        codigoUnico: camisa.pedidos?.codigo_unico,
        pagado: camisa.pedidos?.pagado,
        camisas: []
      }
    }
    acc[pedidoId].camisas.push(camisa)
    return acc
  }, {})

  const pedidosArray = Object.values(pedidosAgrupados).sort((a, b) => {
    // Ordenar por estado: pendientes primero
    const aCompleto = a.camisas.every(c => c.entregada)
    const bCompleto = b.camisas.every(c => c.entregada)
    if (aCompleto !== bCompleto) return aCompleto ? 1 : -1
    return a.nombrePersona.localeCompare(b.nombrePersona)
  })

  // Resumen por tallas (solo de las filtradas)
  const resumenPorTallas = camisasFiltradas.reduce((acc, camisa) => {
    const key = `${camisa.tipo_camisa}-${camisa.talla}`
    if (!acc[key]) {
      acc[key] = {
        tipo: camisa.tipo_camisa,
        talla: camisa.talla,
        total: 0,
        entregadas: 0,
        pendientes: 0
      }
    }
    acc[key].total++
    if (camisa.entregada) {
      acc[key].entregadas++
    } else {
      acc[key].pendientes++
    }
    return acc
  }, {})

  const resumenArray = Object.values(resumenPorTallas).sort((a, b) => {
    if (a.tipo !== b.tipo) return a.tipo.localeCompare(b.tipo)
    return a.talla.localeCompare(b.talla)
  })

  if (loading) {
    return (
      <div className={standalone ? "panel-entregas-container" : ""}>
        <div className="loading">⏳ Cargando camisas...</div>
      </div>
    )
  }

  const ContenedorPrincipal = standalone ? 'div' : React.Fragment
  const propsContenedor = standalone ? { className: "panel-entregas-container" } : {}

  return (
    <ContenedorPrincipal {...propsContenedor}>
      <div className="panel-entregas-header">
        <h2>Panel de Entregas</h2>
        
        {/* Estadísticas de Camisas */}
        <div className="stats-section">
          <h3 className="stats-section-title">👕 Camisas</h3>
          <div className="stats-entregas">
            <div className="stat-entrega">
              <span className="stat-numero">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-entrega success">
              <span className="stat-numero">{stats.entregadas}</span>
              <span className="stat-label">Entregadas</span>
            </div>
            <div className="stat-entrega warning">
              <span className="stat-numero">{stats.pendientes}</span>
              <span className="stat-label">Pendientes</span>
            </div>
          </div>
        </div>

        {/* Estadísticas de Pedidos */}
        <div className="stats-section">
          <h3 className="stats-section-title">📦 Pedidos</h3>
          <div className="stats-entregas">
            <div className="stat-entrega">
              <span className="stat-numero">{pedidosStats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-entrega success">
              <span className="stat-numero">{pedidosStats.entregados}</span>
              <span className="stat-label">Completos</span>
            </div>
            <div className="stat-entrega warning">
              <span className="stat-numero">{pedidosStats.pendientes}</span>
              <span className="stat-label">Incompletos</span>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y botón de filtros */}
        <div className="barra-busqueda-filtros">
          <input
            type="text"
            className="busqueda-entregas"
            placeholder="🔍 Buscar por nombre, código, iglesia..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button 
            className={`btn-toggle-filtros ${filtrosAbiertos ? 'activo' : ''}`}
            onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
            title="Filtros"
          >
            🔍 Filtros {filtrosAbiertos ? '▼' : '▶'}
          </button>
        </div>

        {/* Filtros colapsables */}
        {filtrosAbiertos && (
          <div className="filtros-entregas-colapsables">
            <select
              className="filtro-select"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="pendientes">Pendientes</option>
              <option value="entregadas">Entregadas</option>
            </select>

            <select
              className="filtro-select"
              value={filtroPago}
              onChange={(e) => setFiltroPago(e.target.value)}
            >
              <option value="todos">Todos los pagos</option>
              <option value="pagadas">💳 Pagadas</option>
              <option value="no_pagadas">💰 No Pagadas</option>
            </select>

            <select
              className="filtro-select"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="todos">Todos los tipos</option>
              <option value="normal">👕 Normal</option>
              <option value="directiva_club">🎖️ Dir. Club</option>
              <option value="directiva_zona">👔 Dir. ZONA</option>
            </select>

            <select
              className="filtro-select"
              value={filtroTalla}
              onChange={(e) => setFiltroTalla(e.target.value)}
            >
              <option value="todas">Todas las tallas</option>
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="16">16</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="2XL">2XL</option>
            </select>
          </div>
        )}

        {/* Acciones de filtros */}
        <div className="acciones-entregas-container">
          <button 
            className="btn-reiniciar-filtros"
            onClick={reiniciarFiltros}
            disabled={!busqueda && filtroTalla === 'todas' && filtroTipo === 'todos' && filtroEstado === 'todos' && filtroPago === 'todos'}
          >
            🔄 Reiniciar Filtros
          </button>
          <button 
            className="btn-exportar-entregas"
            onClick={exportarReporteExcel}
            disabled={camisasFiltradas.length === 0}
          >
            📥 Exportar Reporte Excel
          </button>
        </div>
      </div>

      {/* Resumen por tallas - Accordion */}
      {resumenArray.length > 0 && (
        <div className="resumen-tallas-entregas">
          <button 
            className="resumen-accordion-header"
            onClick={() => setResumenAbierto(!resumenAbierto)}
          >
            <span className="resumen-accordion-titulo">
              📊 Resumen por Tallas ({resumenArray.length} combinaciones)
            </span>
            <span className="resumen-accordion-icon">
              {resumenAbierto ? '▼' : '▶'}
            </span>
          </button>
          
          {resumenAbierto && (
            <div className="resumen-tallas-grid">
              {resumenArray.map((item, index) => (
                <div key={index} className="resumen-talla-card">
                  <div className="resumen-talla-header">
                    <span className="resumen-tipo">
                      {item.tipo === 'normal' && '👕'}
                      {item.tipo === 'directiva_club' && '🎖️'}
                      {item.tipo === 'directiva_zona' && '👔'}
                    </span>
                    <span className="resumen-talla-valor">Talla {item.talla}</span>
                  </div>
                  <div className="resumen-talla-stats">
                    <div className="resumen-stat">
                      <span className="resumen-stat-label">Total:</span>
                      <span className="resumen-stat-numero">{item.total}</span>
                    </div>
                    <div className="resumen-stat success">
                      <span className="resumen-stat-label">Entregadas:</span>
                      <span className="resumen-stat-numero">{item.entregadas}</span>
                    </div>
                    <div className="resumen-stat warning">
                      <span className="resumen-stat-label">Pendientes:</span>
                      <span className="resumen-stat-numero">{item.pendientes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lista de Pedidos */}
      <div className="pedidos-entregas-lista">
        {pedidosArray.length === 0 ? (
          <div className="no-pedidos">
            <p>📭 No hay pedidos que mostrar con estos filtros</p>
          </div>
        ) : (
          pedidosArray.map(pedido => {
            const todasEntregadas = pedido.camisas.every(c => c.entregada)
            const algunaEntregada = pedido.camisas.some(c => c.entregada)
            const expandido = pedidosExpandidos[pedido.pedidoId]
            
            return (
              <div 
                key={pedido.pedidoId} 
                className={`pedido-entrega-card ${todasEntregadas ? 'completo' : algunaEntregada ? 'parcial' : 'pendiente'}`}
              >
                {/* Header del Pedido */}
                <div className="pedido-entrega-header" onClick={() => togglePedidoExpandido(pedido.pedidoId)}>
                  <div className="pedido-info-principal">
                    <div className="pedido-nombre-iglesia">
                      <h3>{pedido.nombrePersona}</h3>
                      <span className="pedido-iglesia">{pedido.iglesia}</span>
                    </div>
                    <div className="pedido-badges">
                      {pedido.codigoUnico && (
                        <span className="badge-codigo">🔑 {pedido.codigoUnico}</span>
                      )}
                      <span className={`badge-pago ${pedido.pagado ? 'pagado' : 'no-pagado'}`}>
                        {pedido.pagado ? '💳 Pagado' : '💰 Sin Pagar'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pedido-stats-header">
                    <span className="pedido-progreso">
                      {pedido.camisas.filter(c => c.entregada).length} / {pedido.camisas.length} camisas
                    </span>
                    <span className={`badge-estado-pedido ${todasEntregadas ? 'completo' : 'pendiente'}`}>
                      {todasEntregadas ? '✅ Completo' : '⏳ Pendiente'}
                    </span>
                    <span className="icono-expandir">{expandido ? '▼' : '▶'}</span>
                  </div>
                </div>

                {/* Lista de Camisas (Expandible) */}
                {expandido && (
                  <div className="pedido-camisas-lista">
                    {pedido.camisas.map((camisa, index) => {
                      const seleccionadas = camisasSeleccionadas[pedido.pedidoId] || []
                      const estaSeleccionada = seleccionadas.includes(camisa.id)
                      
                      return (
                        <div key={camisa.id} className={`camisa-item-checkbox ${camisa.entregada ? 'entregada' : estaSeleccionada ? 'seleccionada' : ''}`}>
                          <label className="camisa-checkbox-container">
                            <input
                              type="checkbox"
                              checked={camisa.entregada || estaSeleccionada}
                              onChange={() => !camisa.entregada && toggleSeleccionCamisa(pedido.pedidoId, camisa.id)}
                              disabled={camisa.entregada}
                              className="camisa-checkbox"
                            />
                            <span className="checkbox-custom"></span>
                            
                            <div className="camisa-info-checkbox">
                              <span className="camisa-numero">Camisa #{index + 1}</span>
                              <div className="camisa-detalles-inline">
                                <span className="camisa-tipo-icon">
                                  {camisa.tipo_camisa === 'normal' && '👕'}
                                  {camisa.tipo_camisa === 'directiva_club' && '🎖️'}
                                  {camisa.tipo_camisa === 'directiva_zona' && '👔'}
                                </span>
                                <span className="camisa-talla-badge">Talla {camisa.talla}</span>
                                {camisa.nombre_camisa && (
                                  <span className="camisa-nombre-text">• {camisa.nombre_camisa}</span>
                                )}
                                {camisa.texto_frente && (
                                  <span className="camisa-texto-text">• {camisa.texto_frente}</span>
                                )}
                              </div>
                              {camisa.entregada && camisa.fecha_entrega && (
                                <div className="camisa-entregada-info">
                                  <span className="camisa-fecha-entrega">
                                    ✅ {new Date(camisa.fecha_entrega).toLocaleDateString('es-ES')}
                                  </span>
                                  <button
                                    className="btn-deshacer-mini"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      abrirModalDeshacer(camisa)
                                    }}
                                    title="Deshacer entrega"
                                  >
                                    ↩️
                                  </button>
                                </div>
                              )}
                            </div>
                          </label>
                        </div>
                      )
                    })}
                    
                    {/* Botones de Acción */}
                    <div className="pedido-acciones-footer">
                      {(camisasSeleccionadas[pedido.pedidoId] || []).length > 0 && (
                        <button 
                          className="btn-confirmar-entregas"
                          onClick={() => abrirModalConfirmacion(pedido)}
                        >
                          ✅ Confirmar Entrega ({(camisasSeleccionadas[pedido.pedidoId] || []).length})
                        </button>
                      )}
                      <button 
                        className="btn-ver-pedido-completo-inline"
                        onClick={() => verPedidoCompleto(pedido.codigoUnico)}
                      >
                        👁️ Ver Pedido Completo
                      </button>
                      {algunaEntregada && (
                        <button 
                          className="btn-deshacer-pedido-completo"
                          onClick={() => abrirModalDeshacerPedido(pedido)}
                        >
                          ↩️ Deshacer Pedido Completo
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Modal de Pedido Completo */}
      {mostrarModalPedido && (
        <div className="modal-overlay-pedido" onClick={cerrarModalPedido}>
          <div className="modal-content-pedido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-pedido">
              <h3 className="modal-title-pedido">📄 Pedido Completo</h3>
              <button className="modal-close-pedido" onClick={cerrarModalPedido}>✕</button>
            </div>

            <div className="modal-body-pedido">
              {loadingPedido ? (
                <div className="loading-pedido">⏳ Cargando pedido...</div>
              ) : pedidoSeleccionado ? (
                <>
                  <div className="info-pedido-modal">
                    <div className="info-row-modal">
                      <span className="info-label-modal">👤 Nombre:</span>
                      <span className="info-valor-modal">{pedidoSeleccionado.nombre_persona}</span>
                    </div>
                    <div className="info-row-modal">
                      <span className="info-label-modal">📱 Celular:</span>
                      <span className="info-valor-modal">{pedidoSeleccionado.celular}</span>
                    </div>
                    <div className="info-row-modal">
                      <span className="info-label-modal">⛪ Iglesia:</span>
                      <span className="info-valor-modal">{pedidoSeleccionado.iglesia}</span>
                    </div>
                    {pedidoSeleccionado.codigo_unico && (
                      <div className="info-row-modal">
                        <span className="info-label-modal">🔑 Código:</span>
                        <span className="info-valor-modal codigo-unico-modal">{pedidoSeleccionado.codigo_unico}</span>
                      </div>
                    )}
                    <div className="info-row-modal">
                      <span className="info-label-modal">📅 Fecha:</span>
                      <span className="info-valor-modal">
                        {new Date(pedidoSeleccionado.created_at).toLocaleString('es-ES')}
                      </span>
                    </div>
                    <div className="info-row-modal">
                      <span className="info-label-modal">💳 Estado:</span>
                      <span className={`badge-modal ${pedidoSeleccionado.pagado ? 'pagado' : 'pendiente'}`}>
                        {pedidoSeleccionado.pagado ? '✅ Pagado' : '⏳ Pendiente'}
                      </span>
                    </div>
                  </div>

                  <div className="camisas-pedido-modal">
                    <h4 className="camisas-titulo-modal">👕 Camisas del Pedido</h4>
                    {pedidoSeleccionado.camisas && pedidoSeleccionado.camisas.map((camisa, index) => (
                      <div key={index} className="camisa-item-modal">
                        <div className="camisa-numero-modal">Camisa #{index + 1}</div>
                        <div className="camisa-detalles-modal">
                          <div className="detalle-modal">
                            <span className="detalle-label-modal">Tipo:</span>
                            <span className="detalle-valor-modal">
                              {camisa.tipo === 'normal' && '👕 Normal'}
                              {camisa.tipo === 'directiva_club' && '🎖️ Dir. Club'}
                              {camisa.tipo === 'directiva_zona' && '👔 Dir. ZONA'}
                            </span>
                          </div>
                          <div className="detalle-modal">
                            <span className="detalle-label-modal">Talla:</span>
                            <span className="detalle-valor-modal talla-modal">{camisa.talla}</span>
                          </div>
                          {camisa.texto_frente && (
                            <div className="detalle-modal">
                              <span className="detalle-label-modal">Texto Frente:</span>
                              <span className="detalle-valor-modal">{camisa.texto_frente}</span>
                            </div>
                          )}
                          {camisa.nombre && (
                            <div className="detalle-modal">
                              <span className="detalle-label-modal">Nombre Detrás:</span>
                              <span className="detalle-valor-modal">{camisa.nombre}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="totales-pedido-modal">
                    <div className="total-row-modal">
                      <span>🎽 Total de camisas:</span>
                      <span className="total-valor-modal">{pedidoSeleccionado.total_camisas}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="error-pedido">❌ No se pudo cargar el pedido</div>
              )}
            </div>

            <div className="modal-footer-pedido">
              <button 
                className="btn-compartir-pedido"
                onClick={() => {
                  const url = `${window.location.origin}/pedido/${pedidoSeleccionado.codigo_unico}`
                  navigator.clipboard.writeText(url)
                  alert('✅ Link copiado al portapapeles')
                }}
              >
                🔗 Compartir Link
              </button>
              <button 
                className="btn-cerrar-modal-pedido"
                onClick={cerrarModalPedido}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Entregas */}
      {mostrarModalConfirmacion && pedidoAConfirmar && (
        <div className="modal-overlay-confirmacion" onClick={cerrarModalConfirmacion}>
          <div className="modal-content-confirmacion" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-confirmacion">
              <h3 className="modal-title-confirmacion">✅ Confirmar Entregas</h3>
              <button className="modal-close-confirmacion" onClick={cerrarModalConfirmacion}>✕</button>
            </div>

            <div className="modal-body-confirmacion">
              {procesandoEntrega ? (
                <div className="estado-procesando">
                  <div className="spinner-container">
                    <div className="spinner"></div>
                  </div>
                  <p className="texto-procesando">Procesando entregas...</p>
                </div>
              ) : entregaExitosa ? (
                <div className="estado-exitoso">
                  <div className="icono-exito">✅</div>
                  <h3 className="titulo-exito">¡Entrega Confirmada!</h3>
                  <p className="texto-exito">
                    {cantidadEntregada} camisa{cantidadEntregada > 1 ? 's' : ''} marcada{cantidadEntregada > 1 ? 's' : ''} como entregada{cantidadEntregada > 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <>
                  <div className="info-pedido-confirmacion">
                    <h4>👤 {pedidoAConfirmar.nombrePersona}</h4>
                    <p>⛪ {pedidoAConfirmar.iglesia}</p>
                  </div>

                  <div className="camisas-confirmacion-section">
                    <h5 className="section-title-confirmacion">✅ Camisas a entregar ({(camisasSeleccionadas[pedidoAConfirmar.pedidoId] || []).length}):</h5>
                    <div className="camisas-lista-confirmacion">
                      {pedidoAConfirmar.camisas
                        .filter(c => (camisasSeleccionadas[pedidoAConfirmar.pedidoId] || []).includes(c.id))
                        .map((camisa, index) => (
                          <div key={camisa.id} className="camisa-confirmacion-item success">
                            <span className="camisa-icon">
                              {camisa.tipo_camisa === 'normal' && '👕'}
                              {camisa.tipo_camisa === 'directiva_club' && '🎖️'}
                              {camisa.tipo_camisa === 'directiva_zona' && '👔'}
                            </span>
                            <span>Talla {camisa.talla}</span>
                            {camisa.nombre_camisa && <span>• {camisa.nombre_camisa}</span>}
                          </div>
                        ))}
                    </div>
                  </div>

                  {pedidoAConfirmar.camisas.filter(c => !c.entregada && !(camisasSeleccionadas[pedidoAConfirmar.pedidoId] || []).includes(c.id)).length > 0 && (
                    <div className="camisas-confirmacion-section">
                      <h5 className="section-title-confirmacion warning">⏳ Camisas pendientes ({pedidoAConfirmar.camisas.filter(c => !c.entregada && !(camisasSeleccionadas[pedidoAConfirmar.pedidoId] || []).includes(c.id)).length}):</h5>
                      <div className="camisas-lista-confirmacion">
                        {pedidoAConfirmar.camisas
                          .filter(c => !c.entregada && !(camisasSeleccionadas[pedidoAConfirmar.pedidoId] || []).includes(c.id))
                          .map((camisa, index) => (
                            <div key={camisa.id} className="camisa-confirmacion-item warning">
                              <span className="camisa-icon">
                                {camisa.tipo_camisa === 'normal' && '👕'}
                                {camisa.tipo_camisa === 'directiva_club' && '🎖️'}
                                {camisa.tipo_camisa === 'directiva_zona' && '👔'}
                              </span>
                              <span>Talla {camisa.talla}</span>
                              {camisa.nombre_camisa && <span>• {camisa.nombre_camisa}</span>}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {!procesandoEntrega && !entregaExitosa && (
              <div className="modal-footer-confirmacion">
                <button 
                  className="btn-cancelar-confirmacion"
                  onClick={cerrarModalConfirmacion}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-confirmar-entrega"
                  onClick={confirmarEntregas}
                >
                  ✅ Confirmar Entrega
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Deshacer Entrega */}
      {mostrarModalDeshacer && camisaADeshacer && (
        <div className="modal-overlay-deshacer" onClick={cerrarModalDeshacer}>
          <div className="modal-content-deshacer" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-deshacer">
              <h3 className="modal-title-deshacer">⚠️ Deshacer Entrega</h3>
              <button className="modal-close-deshacer" onClick={cerrarModalDeshacer}>✕</button>
            </div>

            <div className="modal-body-deshacer">
              {procesandoDeshacer ? (
                <div className="estado-procesando">
                  <div className="spinner-container">
                    <div className="spinner"></div>
                  </div>
                  <p className="texto-procesando">Deshaciendo entrega...</p>
                </div>
              ) : deshacerExitoso ? (
                <div className="estado-exitoso">
                  <div className="icono-exito">✅</div>
                  <h3 className="titulo-exito">¡Entrega Deshecha!</h3>
                  <p className="texto-exito">La camisa ha sido marcada como pendiente</p>
                </div>
              ) : (
                <>
                  <div className="icono-advertencia">
                    <span className="icono-warning">⚠️</span>
                  </div>
                  <p className="texto-advertencia">
                    ¿Estás seguro de deshacer la entrega de esta camisa?
                  </p>
                  <div className="info-camisa-deshacer">
                    <p><strong>Tipo:</strong> {
                      camisaADeshacer.tipo_camisa === 'normal' ? '👕 Normal' :
                      camisaADeshacer.tipo_camisa === 'directiva_club' ? '🎖️ Dir. Club' :
                      '👔 Dir. ZONA'
                    }</p>
                    <p><strong>Talla:</strong> {camisaADeshacer.talla}</p>
                    {camisaADeshacer.nombre_camisa && <p><strong>Nombre:</strong> {camisaADeshacer.nombre_camisa}</p>}
                  </div>
                  <p className="nota-seguridad">
                    🔐 Se te pedirá un código de seguridad para confirmar esta acción.
                  </p>
                </>
              )}
            </div>

            {!procesandoDeshacer && !deshacerExitoso && (
              <div className="modal-footer-deshacer">
                <button 
                  className="btn-cancelar-deshacer"
                  onClick={cerrarModalDeshacer}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-confirmar-deshacer"
                  onClick={deshacerEntrega}
                >
                  ↩️ Deshacer Entrega
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Deshacer Pedido Completo */}
      {mostrarModalDeshacerPedido && pedidoADeshacer && (
        <div className="modal-overlay-deshacer" onClick={cerrarModalDeshacerPedido}>
          <div className="modal-content-deshacer" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-deshacer">
              <h3 className="modal-title-deshacer">⚠️ Deshacer Pedido Completo</h3>
              <button className="modal-close-deshacer" onClick={cerrarModalDeshacerPedido}>✕</button>
            </div>

            <div className="modal-body-deshacer">
              {procesandoDeshacer ? (
                <div className="estado-procesando">
                  <div className="spinner-container">
                    <div className="spinner"></div>
                  </div>
                  <p className="texto-procesando">Deshaciendo entregas del pedido...</p>
                </div>
              ) : deshacerExitoso ? (
                <div className="estado-exitoso">
                  <div className="icono-exito">✅</div>
                  <h3 className="titulo-exito">¡Pedido Deshecho!</h3>
                  <p className="texto-exito">
                    {cantidadEntregada} camisa{cantidadEntregada > 1 ? 's' : ''} marcada{cantidadEntregada > 1 ? 's' : ''} como pendiente{cantidadEntregada > 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <>
                  <div className="icono-advertencia">
                    <span className="icono-warning">⚠️</span>
                  </div>
                  <p className="texto-advertencia">
                    ¿Estás seguro de deshacer TODAS las entregas de este pedido?
                  </p>
                  <div className="info-camisa-deshacer">
                    <p><strong>Persona:</strong> {pedidoADeshacer.nombrePersona}</p>
                    <p><strong>Iglesia:</strong> {pedidoADeshacer.iglesia}</p>
                    <p><strong>Camisas entregadas:</strong> {pedidoADeshacer.camisas.filter(c => c.entregada).length}</p>
                  </div>
                  <p className="nota-seguridad">
                    🔐 Se te pedirá un código de seguridad para confirmar esta acción.
                  </p>
                </>
              )}
            </div>

            {!procesandoDeshacer && !deshacerExitoso && (
              <div className="modal-footer-deshacer">
                <button 
                  className="btn-cancelar-deshacer"
                  onClick={cerrarModalDeshacerPedido}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-confirmar-deshacer"
                  onClick={deshacerPedidoCompleto}
                >
                  ↩️ Deshacer Pedido Completo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </ContenedorPrincipal>
  )
}

export default PanelEntregas
