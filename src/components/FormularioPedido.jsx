import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { obtenerDolarHoy, calcularTotalPedido, formatearPrecio } from '../utils/dolarApi'
import './FormularioPedido.css'
import camisaDirectiva from '../assets/images/directiva.png'
import camisaNormal from '../assets/images/normal.png'

const TALLAS_TODAS = ['8', '12', '16', 'S', 'M', 'L', 'XL', '2XL']
const TALLAS_DIRECTIVA_ZONA = ['16', 'S', 'M', 'L', 'XL', '2XL']

function FormularioPedido() {
  const [nombrePersona, setNombrePersona] = useState('')
  const [celular, setCelular] = useState('')
  const [iglesia, setIglesia] = useState('')
  const [camisas, setCamisas] = useState([])
  const [montoPago, setMontoPago] = useState('')
  const [referenciaPago, setReferenciaPago] = useState('')
  const [fechaPago, setFechaPago] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [camisaActual, setCamisaActual] = useState(0)
  const [dolarHoy, setDolarHoy] = useState(null)

  useEffect(() => {
    cargarDolar()
  }, [])

  const cargarDolar = async () => {
    const dolar = await obtenerDolarHoy()
    setDolarHoy(dolar)
  }

  const agregarCamisa = () => {
    setCamisas([{
      id: Date.now(),
      tipo: 'normal',
      talla: '',
      nombre: '',
      textoFrente: '',
      tallaSeleccionada: false
    }, ...camisas])
    setCamisaActual(0) // Ir a la nueva camisa
  }

  const siguienteCamisa = () => {
    setCamisaActual((prev) => (prev + 1) % camisas.length)
  }

  const anteriorCamisa = () => {
    setCamisaActual((prev) => (prev - 1 + camisas.length) % camisas.length)
  }

  const irACamisa = (index) => {
    setCamisaActual(index)
    
    // Scroll animado hasta la camisa activa
    setTimeout(() => {
      const camisaElement = document.querySelector('.camisa-item.active')
      if (camisaElement) {
        camisaElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        })
      }
    }, 100)
  }

  const eliminarCamisa = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta camisa del pedido?')) {
      const nuevasCamisas = camisas.filter(c => c.id !== id)
      setCamisas(nuevasCamisas)
      // Ajustar índice si es necesario
      if (camisaActual >= nuevasCamisas.length && nuevasCamisas.length > 0) {
        setCamisaActual(nuevasCamisas.length - 1)
      } else if (nuevasCamisas.length === 0) {
        setCamisaActual(0)
      }
    }
  }

  const actualizarCamisa = (id, campo, valor) => {
    setCamisas(prevCamisas => prevCamisas.map(c => 
      c.id === id ? { ...c, [campo]: valor } : c
    ))
  }

  const seleccionarTalla = (id, talla) => {
    setCamisas(prevCamisas => prevCamisas.map(c => 
      c.id === id ? { ...c, talla: talla } : c
    ))
  }

  // Función para capitalizar cada palabra
  const capitalizarTexto = (texto) => {
    return texto
      .toLowerCase()
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ')
  }

  // Función para actualizar camisa con capitalización automática
  const actualizarCamisaConCapitalizacion = (id, campo, valor) => {
    let valorFinal = valor
    
    // Capitalizar campos de texto
    if (campo === 'nombre' || campo === 'textoFrente') {
      valorFinal = capitalizarTexto(valor)
    }
    
    actualizarCamisa(id, campo, valorFinal)
  }

  // Función para actualizar nombre de persona con capitalización
  const handleNombrePersonaChange = (valor) => {
    setNombrePersona(capitalizarTexto(valor))
  }

  const getTallasDisponibles = (tipo) => {
    return tipo === 'directiva_zona' ? TALLAS_DIRECTIVA_ZONA : TALLAS_TODAS
  }

  const calcularTotal = () => {
    return camisas.length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMensaje('')

    try {
      if (camisas.length === 0) {
        setMensaje('❌ Debes agregar al menos una camisa')
        setLoading(false)
        return
      }

      // Validar que todas las camisas tengan talla
      const camisasSinTalla = camisas.filter(c => !c.talla)
      if (camisasSinTalla.length > 0) {
        setMensaje('❌ Todas las camisas deben tener una talla seleccionada')
        setLoading(false)
        return
      }

      // Validar que las camisas de directiva tengan nombre y texto al frente
      const camisasDirectivaSinNombre = camisas.filter(c => c.tipo === 'directiva_zona' && !c.nombre)
      if (camisasDirectivaSinNombre.length > 0) {
        setMensaje('❌ Las camisas de Directiva de ZONA deben tener un nombre (detrás)')
        setLoading(false)
        return
      }

      const camisasDirectivaSinTextoFrente = camisas.filter(c => c.tipo === 'directiva_zona' && !c.textoFrente)
      if (camisasDirectivaSinTextoFrente.length > 0) {
        setMensaje('❌ Las camisas de Directiva de ZONA deben tener texto al frente')
        setLoading(false)
        return
      }

      const pedido = {
        nombre_persona: nombrePersona,
        celular: celular,
        iglesia: iglesia,
        camisas: camisas.map(c => ({
          tipo: c.tipo,
          talla: c.talla,
          nombre: c.nombre || null,
          texto_frente: c.textoFrente || null
        })),
        total_camisas: camisas.length,
        monto_pago: montoPago ? parseFloat(montoPago) : null,
        referencia_pago: referenciaPago || null,
        fecha_pago: fechaPago || null,
        pagado: !!(montoPago && referenciaPago && fechaPago),
        created_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('pedidos')
        .insert([pedido])

      if (error) throw error

      setMensaje('✅ ¡Pedido registrado exitosamente!')
      
      // Limpiar formulario
      setTimeout(() => {
        setNombrePersona('')
        setCelular('')
        setIglesia('')
        setCamisas([])
        setMontoPago('')
        setReferenciaPago('')
        setFechaPago('')
        setMensaje('')
      }, 2000)

    } catch (error) {
      console.error('Error:', error)
      setMensaje('❌ Error al registrar el pedido: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="formulario-container">
      <div className="formulario-card">
        <div className="header-section">
          <h2 className="formulario-title">Realizar Pedido</h2>
          <p className="formulario-subtitle">Selecciona tu camisa</p>
        </div>
        
        <form onSubmit={handleSubmit} className="formulario">
          {/* Botón para agregar camisas */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-title-with-counter">
                <label className="section-label">Camisas del Pedido</label>
                {camisas.length > 0 && (
                  <span className="counter-badge">
                    {camisaActual + 1}/{camisas.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn-agregar-camisa"
                onClick={agregarCamisa}
              >
                ➕ Añadir Camisa
              </button>
            </div>

            {camisas.length === 0 && (
              <div className="empty-state">
                <p>👕 No hay camisas en el pedido</p>
                <p className="empty-hint">Haz clic en "Añadir Camisa" para comenzar</p>
              </div>
            )}

            {/* Carousel de camisas */}
            <div className="carousel-container">
              {camisas.length > 1 && (
                <>
                  <button
                    type="button"
                    className="carousel-btn prev"
                    onClick={anteriorCamisa}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="carousel-btn next"
                    onClick={siguienteCamisa}
                  >
                    ›
                  </button>
                </>
              )}
              
              <div className="camisas-carousel">
                {camisas.map((camisa, index) => (
                  <div 
                    key={camisa.id} 
                    className={`camisa-item ${index === camisaActual ? 'active' : ''}`}
                    style={{ display: index === camisaActual ? 'block' : 'none' }}
                  >
                  <div className="camisa-header">
                    <h4 className="camisa-numero">Camisa #{camisas.length - index}</h4>
                    <button
                      type="button"
                      className="btn-eliminar-camisa"
                      onClick={() => eliminarCamisa(camisa.id)}
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Preview de la camisa */}
                  <div className="camisa-preview-mini">
                    <img 
                      src={camisa.tipo === 'directiva_zona' ? camisaDirectiva : camisaNormal}
                      alt={camisa.tipo === 'directiva_zona' ? 'Camisa Directiva ZONA' : 'Camisa Normal'}
                      className="preview-img-mini"
                    />
                  </div>

                  {/* Tipo de camisa */}
                  <div className="camisa-tipo-selector">
                    <button
                      type="button"
                      className={`tipo-btn ${camisa.tipo === 'normal' ? 'active' : ''}`}
                      onClick={() => actualizarCamisa(camisa.id, 'tipo', 'normal')}
                    >
                      👕 Normal
                    </button>
                    <button
                      type="button"
                      className={`tipo-btn ${camisa.tipo === 'directiva_club' ? 'active' : ''}`}
                      onClick={() => actualizarCamisa(camisa.id, 'tipo', 'directiva_club')}
                    >
                      🎖️ Dir. Club
                    </button>
                    <button
                      type="button"
                      className={`tipo-btn ${camisa.tipo === 'directiva_zona' ? 'active' : ''}`}
                      onClick={() => actualizarCamisa(camisa.id, 'tipo', 'directiva_zona')}
                    >
                      👔 Dir. ZONA
                    </button>
                  </div>

                  {/* Selector de talla */}
                  <div className="camisa-talla-section">
                    <label className="talla-section-label">Talla:</label>
                    <div className="tallas-grid-simple">
                      {getTallasDisponibles(camisa.tipo).map(talla => (
                        <button
                          key={talla}
                          type="button"
                          className={`talla-btn-simple ${camisa.talla === talla ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.preventDefault()
                            seleccionarTalla(camisa.id, talla)
                          }}
                        >
                          {talla}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Personalización para directiva zona */}
                  {camisa.tipo === 'directiva_zona' && (
                    <div className="camisa-personalizacion-zona">
                      <div className="personalizacion-item">
                        <label className="form-label">Texto al frente</label>
                        <input
                          type="text"
                          className="form-input modern"
                          value={camisa.textoFrente}
                          onChange={(e) => actualizarCamisaConCapitalizacion(camisa.id, 'textoFrente', e.target.value)}
                          placeholder="Ej: Líder Juvenil, Pastor, etc."
                          required
                        />
                      </div>
                      <div className="personalizacion-item">
                        <label className="form-label">Nombre detrás</label>
                        <input
                          type="text"
                          className="form-input modern"
                          value={camisa.nombre}
                          onChange={(e) => actualizarCamisaConCapitalizacion(camisa.id, 'nombre', e.target.value)}
                          placeholder="Ej: Juan Pérez"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {camisa.tipo === 'directiva_club' && (
                    <div className="info-box-small">
                      ℹ️ Llevará "Director" al frente
                    </div>
                  )}
                </div>
              ))}
              </div>


            </div>

            {camisas.length > 0 && (
              <>
                {/* Dólar del día */}
                {dolarHoy && (
                  <div className="dolar-info">
                    <span className="dolar-label">
                      💵 Dólar BCV [{new Date(dolarHoy.fecha).toLocaleDateString('es-VE')}]:
                    </span>
                    <span className="dolar-precio">Bs. {formatearPrecio(dolarHoy.precio)}</span>
                  </div>
                )}

                {/* Resumen de camisas por talla */}
                <div className="resumen-camisas">
                  <h4 className="resumen-title">📋 Resumen del Pedido</h4>
                  <div className="resumen-lista">
                    {camisas.map((camisa, index) => (
                      <div 
                        key={camisa.id} 
                        className="resumen-item-detalle"
                        onClick={() => irACamisa(index)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="resumen-numero">#{camisas.length - index}</div>
                        <div className="resumen-info">
                          <div className="resumen-tipo-icon">
                            {camisa.tipo === 'normal' && '👕'}
                            {camisa.tipo === 'directiva_club' && '🎖️'}
                            {camisa.tipo === 'directiva_zona' && '👔'}
                          </div>
                          <div className="resumen-detalles">
                            <div className="resumen-tipo-texto">
                              {camisa.tipo === 'normal' && 'Normal'}
                              {camisa.tipo === 'directiva_club' && 'Directiva Club'}
                              {camisa.tipo === 'directiva_zona' && 'Directiva ZONA'}
                            </div>
                            {camisa.talla && (
                              <div className="resumen-talla-texto">Talla: {camisa.talla}</div>
                            )}
                            {camisa.nombre && (
                              <div className="resumen-nombre">Nombre: {camisa.nombre}</div>
                            )}
                            {camisa.textoFrente && (
                              <div className="resumen-frente">Frente: {camisa.textoFrente}</div>
                            )}
                          </div>
                        </div>
                        {!camisa.talla && (
                          <div className="resumen-alerta">⚠️ Sin talla</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="total-summary">
                  <div className="total-row-summary">
                    <span>Total de camisas</span>
                    <span className="total-number">{camisas.length}</span>
                  </div>
                  {(() => {
                    // Filtrar solo camisas que no sean directiva de zona
                    const camisasConPrecio = camisas.filter(c => c.tipo !== 'directiva_zona')
                    const totalDolares = calcularTotalPedido(camisasConPrecio)
                    
                    if (camisasConPrecio.length > 0) {
                      return (
                        <>
                          <div className="total-row-summary">
                            <span>Total en dólares</span>
                            <span className="total-number">${totalDolares}</span>
                          </div>
                          {dolarHoy && (
                            <div className="total-row-summary destacado-bs">
                              <span>Total en bolívares</span>
                              <span className="total-number-bs">
                                Bs. {formatearPrecio(totalDolares * dolarHoy.precio)}
                              </span>
                            </div>
                          )}
                        </>
                      )
                    }
                    return null
                  })()}
                </div>
              </>
            )}
          </div>

          {/* Datos personales */}
          {camisas.length > 0 && (
            <div className="form-section">
              <label className="section-label">Información Personal</label>
              <div className="form-group">
                <label className="form-label">Nombre y Apellido</label>
                <input 
                  type="text"
                  className="form-input modern"
                  value={nombrePersona}
                  onChange={(e) => handleNombrePersonaChange(e.target.value)}
                  placeholder="Nombre Apellido"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input 
                  type="tel"
                  className="form-input modern"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  placeholder="+58 412 1234567"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Iglesia</label>
                <input 
                  type="text"
                  className="form-input modern"
                  value={iglesia}
                  onChange={(e) => setIglesia(e.target.value)}
                  placeholder="Nombre de tu iglesia"
                  required
                />
              </div>
            </div>
          )}

          {/* Información de pago */}
          {camisas.length > 0 && (
            <div className="form-section pago-section">
              <label className="section-label">💳 Información de Pago</label>
              <p className="section-hint">Opcional - Puedes registrar el pago después</p>
              
              <div className="pago-grid">
                <div className="form-group">
                  <label className="form-label">Monto pagado</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="form-input modern"
                    value={montoPago}
                    onChange={(e) => setMontoPago(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Referencia</label>
                  <input 
                    type="text"
                    className="form-input modern"
                    value={referenciaPago}
                    onChange={(e) => setReferenciaPago(e.target.value)}
                    placeholder="5 últimos dígitos"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha de pago</label>
                  <input 
                    type="date"
                    className="form-input modern"
                    value={fechaPago}
                    onChange={(e) => setFechaPago(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {mensaje && (
            <div className={`mensaje ${mensaje.includes('✅') ? 'success' : 'error'}`}>
              {mensaje}
            </div>
          )}

          {camisas.length > 0 && (
            <button 
              type="submit" 
              className="btn-submit-modern"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Procesando...
                </>
              ) : (
                <>
                  Registrar Pedido
                  <span className="arrow">→</span>
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default FormularioPedido
