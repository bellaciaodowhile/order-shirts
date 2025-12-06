import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { obtenerDolarHoy, calcularTotalPedido, formatearPrecio } from '../utils/dolarApi'
import './VerPedido.css'

function VerPedido() {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const [pedido, setPedido] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dolarHoy, setDolarHoy] = useState(null)
  const [mostrarFormPago, setMostrarFormPago] = useState(false)
  const [montoPago, setMontoPago] = useState('')
  const [referenciaPago, setReferenciaPago] = useState('')
  const [fechaPago, setFechaPago] = useState('')
  const [entregasCamisas, setEntregasCamisas] = useState([])

  useEffect(() => {
    cargarPedido()
    cargarDolar()
  }, [codigo])

  const cargarDolar = async () => {
    const dolar = await obtenerDolarHoy()
    setDolarHoy(dolar)
  }

  const cargarPedido = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('codigo_unico', codigo)
        .single()

      if (error) throw error
      
      if (!data) {
        setError('Pedido no encontrado')
      } else {
        setPedido(data)
        // Cargar entregas de camisas
        await cargarEntregasCamisas(data.id)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('No se pudo cargar el pedido. Verifica el código.')
    } finally {
      setLoading(false)
    }
  }

  const cargarEntregasCamisas = async (pedidoId) => {
    try {
      const { data, error } = await supabase
        .from('entregas_camisas')
        .select('*')
        .eq('pedido_id', pedidoId)

      if (error) throw error
      setEntregasCamisas(data || [])
    } catch (error) {
      console.error('Error al cargar entregas:', error)
    }
  }

  const registrarPago = async () => {
    if (!montoPago || !referenciaPago || !fechaPago) {
      alert('Por favor completa todos los campos del pago')
      return
    }

    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ 
          pagado: true,
          monto_pago: parseFloat(montoPago),
          referencia_pago: referenciaPago,
          fecha_pago: fechaPago
        })
        .eq('id', pedido.id)

      if (error) throw error
      
      alert('✅ Pago registrado exitosamente')
      cargarPedido()
      setMostrarFormPago(false)
      setMontoPago('')
      setReferenciaPago('')
      setFechaPago('')
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error al registrar el pago: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="ver-pedido-container">
        <div className="loading-pedido">⏳ Cargando pedido...</div>
      </div>
    )
  }

  if (error || !pedido) {
    return (
      <div className="ver-pedido-container">
        <div className="error-pedido">
          <h2>❌ {error || 'Pedido no encontrado'}</h2>
          <p>Verifica que el código sea correcto</p>
          <button className="btn-volver" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="ver-pedido-container">
      <div className="ver-pedido-card">
        <div className="pedido-header-ver">
          <h2>📋 Resumen de tu Pedido</h2>
          <span className={`estado-badge ${pedido.pagado ? 'pagado' : 'pendiente'}`}>
            {pedido.pagado ? '✅ Pagado' : '⏳ Pendiente de Pago'}
          </span>
        </div>

        <div className="pedido-info-ver">
          <div className="info-row-ver">
            <span className="info-label-ver">👤 Nombre:</span>
            <span className="info-value-ver">{pedido.nombre_persona}</span>
          </div>
          <div className="info-row-ver">
            <span className="info-label-ver">⛪ Iglesia:</span>
            <span className="info-value-ver">{pedido.iglesia}</span>
          </div>
          <div className="info-row-ver">
            <span className="info-label-ver">📱 Celular:</span>
            <span className="info-value-ver">{pedido.celular}</span>
          </div>
          <div className="info-row-ver">
            <span className="info-label-ver">🔑 Código:</span>
            <span className="info-value-ver codigo-unico">{pedido.codigo_unico}</span>
          </div>
        </div>

        <div className="camisas-section-ver">
          <h3>👕 Camisas del Pedido ({pedido.total_camisas})</h3>
          <div className="camisas-lista-ver">
            {pedido.camisas && pedido.camisas.map((camisa, index) => {
              // Buscar si esta camisa está entregada
              const entregaCamisa = entregasCamisas.find(e => 
                e.tipo_camisa === camisa.tipo && 
                e.talla === camisa.talla && 
                e.nombre_camisa === camisa.nombre &&
                e.texto_frente === camisa.texto_frente
              )
              const estaEntregada = entregaCamisa?.entregada || false

              return (
                <div key={index} className={`camisa-item-ver ${estaEntregada ? 'entregada' : ''}`}>
                  <div className="camisa-numero-ver">#{index + 1}</div>
                  <div className="camisa-detalles-ver">
                    <div className="camisa-header-info">
                      <div className="camisa-tipo-ver">
                        {camisa.tipo === 'normal' && '👕 Normal'}
                        {camisa.tipo === 'directiva_club' && '🎖️ Directiva Club'}
                        {camisa.tipo === 'directiva_zona' && '👔 Directiva ZONA'}
                      </div>
                      {estaEntregada && (
                        <span className="tag-entregada">✅ Entregada</span>
                      )}
                    </div>
                    <div className="camisa-talla-ver">Talla: {camisa.talla}</div>
                    {camisa.texto_frente && (
                      <div className="camisa-texto-ver">Frente: {camisa.texto_frente}</div>
                    )}
                    {camisa.nombre && (
                      <div className="camisa-texto-ver">Detrás: {camisa.nombre}</div>
                    )}
                    {estaEntregada && entregaCamisa.fecha_entrega && (
                      <div className="camisa-fecha-entrega-ver">
                        📅 {new Date(entregaCamisa.fecha_entrega).toLocaleDateString('es-ES')}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {pedido.camisas && pedido.camisas.length > 0 && (
          <div className="totales-ver">
            <div className="total-row-ver">
              <span>💵 Total en dólares:</span>
              <span className="total-valor-ver">${calcularTotalPedido(pedido.camisas)}</span>
            </div>
            {dolarHoy && !pedido.pagado && (
              <div className="total-row-ver destacado-ver">
                <span>💰 Total en bolívares:</span>
                <span className="total-valor-bs-ver">
                  Bs. {formatearPrecio(calcularTotalPedido(pedido.camisas) * dolarHoy.precio)}
                </span>
              </div>
            )}
          </div>
        )}

        {!pedido.pagado && (
          <div className="pago-section-ver">
            {!mostrarFormPago ? (
              <button 
                className="btn-registrar-pago"
                onClick={() => setMostrarFormPago(true)}
              >
                💳 Registrar Pago
              </button>
            ) : (
              <div className="form-pago-ver">
                <h3>💳 Registrar Información de Pago</h3>
                <div className="form-group-ver">
                  <label>Monto Pagado (Bs) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={montoPago}
                    onChange={(e) => setMontoPago(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group-ver">
                  <label>Referencia de Pago *</label>
                  <input 
                    type="text"
                    value={referenciaPago}
                    onChange={(e) => setReferenciaPago(e.target.value)}
                    placeholder="Últimos 4-6 dígitos"
                  />
                </div>
                <div className="form-group-ver">
                  <label>Fecha de Pago *</label>
                  <input 
                    type="date"
                    value={fechaPago}
                    onChange={(e) => setFechaPago(e.target.value)}
                  />
                </div>
                <div className="form-actions-ver">
                  <button 
                    className="btn-cancelar-ver"
                    onClick={() => setMostrarFormPago(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="btn-confirmar-ver"
                    onClick={registrarPago}
                  >
                    ✅ Confirmar Pago
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {pedido.pagado && pedido.monto_pago && (
          <div className="pago-info-ver">
            <h3>✅ Información de Pago</h3>
            <div className="info-row-ver">
              <span className="info-label-ver">💰 Monto:</span>
              <span className="info-value-ver">Bs. {pedido.monto_pago}</span>
            </div>
            <div className="info-row-ver">
              <span className="info-label-ver">🔢 Referencia:</span>
              <span className="info-value-ver">{pedido.referencia_pago}</span>
            </div>
            <div className="info-row-ver">
              <span className="info-label-ver">📅 Fecha:</span>
              <span className="info-value-ver">{pedido.fecha_pago}</span>
            </div>
          </div>
        )}

        <div className="acciones-ver">
          <button className="btn-volver" onClick={() => navigate('/')}>
            ← Volver al inicio
          </button>
          <button className="btn-nuevo-pedido" onClick={() => navigate('/')}>
            ➕ Hacer otro pedido
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerPedido
