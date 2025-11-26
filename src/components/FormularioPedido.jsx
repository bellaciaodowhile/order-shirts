import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import { obtenerDolarHoy, calcularTotalPedido, formatearPrecio } from '../utils/dolarApi'
import { QRCodeSVG } from 'qrcode.react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import './FormularioPedido.css'
import camisaDirectiva from '../assets/images/directiva.png'
import camisaNormal from '../assets/images/normal.png'

const TALLAS_TODAS = ['8', '10', '12', '16', 'S', 'M', 'L', 'XL', '2XL']
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
  const [mostrarModal, setMostrarModal] = useState(false)
  const [pedidoCreado, setPedidoCreado] = useState(null)
  const [mostrarQR, setMostrarQR] = useState(false)
  const [mostrarPantallaInicial, setMostrarPantallaInicial] = useState(true)
  const [codigoIngresado, setCodigoIngresado] = useState('')
  const [buscandoPedido, setBuscandoPedido] = useState(false)
  const [mostrarEscaner, setMostrarEscaner] = useState(false)
  const scannerRef = useRef(null)

  useEffect(() => {
    cargarDolar()
  }, [])

  const cargarDolar = async () => {
    const dolar = await obtenerDolarHoy()
    setDolarHoy(dolar)
  }

  const buscarPedidoPorCodigo = async () => {
    if (!codigoIngresado.trim()) {
      alert('Por favor ingresa un código')
      return
    }

    setBuscandoPedido(true)
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('codigo_unico', codigoIngresado.trim().toUpperCase())
        .single()

      if (error || !data) {
        alert('❌ Código no encontrado. Verifica que sea correcto.')
        return
      }

      // Redirigir a la página del pedido
      window.location.href = `/pedido/${data.codigo_unico}`
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error al buscar el pedido')
    } finally {
      setBuscandoPedido(false)
    }
  }

  const hacerNuevoPedido = () => {
    setMostrarPantallaInicial(false)
  }

  const abrirEscaner = () => {
    setMostrarEscaner(true)
  }

  const cerrarEscaner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear()
      scannerRef.current = null
    }
    setMostrarEscaner(false)
  }

  useEffect(() => {
    if (mostrarEscaner && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { 
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      )

      scanner.render(
        (decodedText) => {
          // Extraer el código del URL escaneado
          const match = decodedText.match(/\/pedido\/([A-Z0-9]{8})/)
          
          if (match && match[1]) {
            const codigo = match[1]
            scanner.clear()
            setMostrarEscaner(false)
            window.location.href = `/pedido/${codigo}`
          } else {
            alert('❌ QR no válido. Asegúrate de escanear el QR de tu pedido.')
          }
        },
        (error) => {
          // Ignorar errores de escaneo continuo
          console.log(error)
        }
      )

      scannerRef.current = scanner
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [mostrarEscaner])

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

  const abrirModalConfirmacion = (e) => {
    e.preventDefault()
    setMensaje('')

    // Validaciones antes de abrir el modal
    try {
      if (camisas.length === 0) {
        setMensaje('❌ Debes agregar al menos una camisa')
        return
      }

      // Validar que todas las camisas tengan talla
      const camisasSinTalla = camisas.filter(c => !c.talla)
      if (camisasSinTalla.length > 0) {
        setMensaje('❌ Todas las camisas deben tener una talla seleccionada')
        return
      }

      // Validar que las camisas de directiva tengan nombre y texto al frente
      const camisasDirectivaSinNombre = camisas.filter(c => c.tipo === 'directiva_zona' && !c.nombre)
      if (camisasDirectivaSinNombre.length > 0) {
        setMensaje('❌ Las camisas de Directiva de ZONA deben tener un nombre (detrás)')
        return
      }

      const camisasDirectivaSinTextoFrente = camisas.filter(c => c.tipo === 'directiva_zona' && !c.textoFrente)
      if (camisasDirectivaSinTextoFrente.length > 0) {
        setMensaje('❌ Las camisas de Directiva de ZONA deben tener texto al frente')
        return
      }

      // Si todas las validaciones pasan, abrir el modal
      setMostrarModal(true)
    } catch (error) {
      console.error('Error en validación:', error)
      setMensaje('❌ Error al validar el pedido')
    }
  }

  const confirmarPedido = async () => {
    setLoading(true)
    setMostrarModal(false)
    setMensaje('')

    try {

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

      const { data, error } = await supabase
        .from('pedidos')
        .insert([pedido])
        .select()
        .single()

      if (error) throw error

      // Guardar el pedido creado y mostrar el QR
      setPedidoCreado(data)
      setMostrarQR(true)
      setMensaje('✅ ¡Pedido registrado exitosamente!')

    } catch (error) {
      console.error('Error:', error)
      setMensaje('❌ Error al registrar el pedido: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const cerrarModal = () => {
    setMostrarModal(false)
  }

  const cerrarQR = () => {
    setMostrarQR(false)
    setPedidoCreado(null)
    // Limpiar formulario
    setNombrePersona('')
    setCelular('')
    setIglesia('')
    setCamisas([])
    setMontoPago('')
    setReferenciaPago('')
    setFechaPago('')
    setMensaje('')
  }

  const descargarQR = () => {
    const svg = document.getElementById('qr-code-svg')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      
      const downloadLink = document.createElement('a')
      downloadLink.download = `pedido-${pedidoCreado.codigo_unico}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  // Si está en la pantalla inicial, mostrar opciones
  if (mostrarPantallaInicial) {
    return (
      <div className="formulario-container">
        <div className="pantalla-inicial-card">
          <div className="pantalla-inicial-header">
            <h2>👕 Bienvenido</h2>
            <p>¿Qué deseas hacer?</p>
          </div>

          <div className="pantalla-inicial-opciones">
            <div className="opcion-card">
              <div className="opcion-icon">🆕</div>
              <h3>Hacer un Nuevo Pedido</h3>
              <p>Crea un pedido nuevo de camisas</p>
              <button 
                className="btn-opcion"
                onClick={hacerNuevoPedido}
              >
                Comenzar Pedido
              </button>
            </div>

            <div className="separador-o">O</div>

            <div className="opcion-card">
              <div className="opcion-icon">🔍</div>
              <h3>Ver mi Pedido Existente</h3>
              <p>Ingresa tu código único o escanea el QR</p>
              
              <div className="codigo-input-group">
                <input
                  type="text"
                  className="codigo-input"
                  placeholder="Ej: ABC12345"
                  value={codigoIngresado}
                  onChange={(e) => setCodigoIngresado(e.target.value.toUpperCase())}
                  maxLength={8}
                />
                <button 
                  className="btn-buscar-codigo"
                  onClick={buscarPedidoPorCodigo}
                  disabled={buscandoPedido}
                >
                  {buscandoPedido ? '⏳' : '🔍'} Buscar
                </button>
              </div>

              <div className="separador-texto">O</div>

              <button 
                className="btn-escanear-qr"
                onClick={abrirEscaner}
              >
                📷 Escanear QR con Cámara
              </button>
            </div>
          </div>

          <div className="info-footer">
            <p>
              <strong>¿No tienes un código?</strong> Haz un nuevo pedido y recibirás un código único y QR para gestionar tu pedido.
            </p>
          </div>
        </div>

        {/* Modal del Escáner de QR */}
        {mostrarEscaner && (
          <div className="modal-overlay" onClick={cerrarEscaner}>
            <div className="modal-escaner" onClick={(e) => e.stopPropagation()}>
              <div className="modal-escaner-header">
                <h3>📷 Escanea tu QR</h3>
                <button className="btn-cerrar-escaner" onClick={cerrarEscaner}>✕</button>
              </div>
              <div className="modal-escaner-body">
                <p className="escaner-instruccion">
                  Coloca el QR de tu pedido frente a la cámara
                </p>
                <div id="qr-reader" className="escaner-container"></div>
                <p className="escaner-ayuda">
                  💡 Asegúrate de dar permisos de cámara a tu navegador
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="formulario-container">
      <div className="formulario-card">
        <div className="header-section">
          <button 
            className="btn-volver-inicio"
            onClick={() => setMostrarPantallaInicial(true)}
            type="button"
          >
            ← Volver
          </button>
          <h2 className="formulario-title">Realizar Pedido</h2>
          <p className="formulario-subtitle">Selecciona tu camisa</p>
        </div>
        
        <form onSubmit={abrirModalConfirmacion} className="formulario">
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

        {/* Modal de Confirmación */}
        {mostrarModal && (
          <div className="modal-overlay" onClick={cerrarModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">📋 Confirmar Pedido</h3>
                <button className="modal-close" onClick={cerrarModal}>✕</button>
              </div>

              <div className="modal-body">
                {/* Información Personal */}
                <div className="modal-section">
                  <h4 className="modal-section-title">👤 Información Personal</h4>
                  <div className="modal-info-grid">
                    <div className="modal-info-item">
                      <span className="modal-label">Nombre:</span>
                      <span className="modal-value">{nombrePersona}</span>
                    </div>
                    <div className="modal-info-item">
                      <span className="modal-label">Celular:</span>
                      <span className="modal-value">{celular}</span>
                    </div>
                    <div className="modal-info-item">
                      <span className="modal-label">Iglesia:</span>
                      <span className="modal-value">{iglesia}</span>
                    </div>
                  </div>
                </div>

                {/* Camisas del Pedido */}
                <div className="modal-section">
                  <h4 className="modal-section-title">👕 Camisas del Pedido ({camisas.length})</h4>
                  <div className="modal-camisas-lista">
                    {camisas.map((camisa, index) => (
                      <div key={camisa.id} className="modal-camisa-item">
                        <div className="modal-camisa-header">
                          <span className="modal-camisa-numero">Camisa #{camisas.length - index}</span>
                          <span className="modal-camisa-tipo">
                            {camisa.tipo === 'normal' && '👕 Normal'}
                            {camisa.tipo === 'directiva_club' && '🎖️ Directiva Club'}
                            {camisa.tipo === 'directiva_zona' && '👔 Directiva ZONA'}
                          </span>
                        </div>
                        <div className="modal-camisa-detalles">
                          <div className="modal-detalle-row">
                            <span className="modal-detalle-label">Talla:</span>
                            <span className="modal-detalle-value">{camisa.talla}</span>
                          </div>
                          {camisa.textoFrente && (
                            <div className="modal-detalle-row">
                              <span className="modal-detalle-label">Texto al frente:</span>
                              <span className="modal-detalle-value">{camisa.textoFrente}</span>
                            </div>
                          )}
                          {camisa.nombre && (
                            <div className="modal-detalle-row">
                              <span className="modal-detalle-label">Nombre detrás:</span>
                              <span className="modal-detalle-value">{camisa.nombre}</span>
                            </div>
                          )}
                          {camisa.tipo === 'directiva_club' && (
                            <div className="modal-detalle-row">
                              <span className="modal-detalle-label">Texto al frente:</span>
                              <span className="modal-detalle-value">Director</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totales */}
                <div className="modal-section">
                  <h4 className="modal-section-title">💰 Totales</h4>
                  <div className="modal-totales">
                    <div className="modal-total-row">
                      <span className="modal-total-label">Total de camisas:</span>
                      <span className="modal-total-value">{camisas.length}</span>
                    </div>
                    {(() => {
                      const camisasConPrecio = camisas.filter(c => c.tipo !== 'directiva_zona')
                      const totalDolares = calcularTotalPedido(camisasConPrecio)
                      
                      if (camisasConPrecio.length > 0) {
                        return (
                          <>
                            <div className="modal-total-row">
                              <span className="modal-total-label">Total en dólares:</span>
                              <span className="modal-total-value destacado">${totalDolares}</span>
                            </div>
                            {dolarHoy && (
                              <div className="modal-total-row">
                                <span className="modal-total-label">Total en bolívares:</span>
                                <span className="modal-total-value destacado-bs">
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
                </div>

                {/* Información de Pago (si existe) */}
                {(montoPago || referenciaPago || fechaPago) && (
                  <div className="modal-section">
                    <h4 className="modal-section-title">💳 Información de Pago</h4>
                    <div className="modal-info-grid">
                      {montoPago && (
                        <div className="modal-info-item">
                          <span className="modal-label">Monto:</span>
                          <span className="modal-value">{montoPago} Bs</span>
                        </div>
                      )}
                      {referenciaPago && (
                        <div className="modal-info-item">
                          <span className="modal-label">Referencia:</span>
                          <span className="modal-value">{referenciaPago}</span>
                        </div>
                      )}
                      {fechaPago && (
                        <div className="modal-info-item">
                          <span className="modal-label">Fecha:</span>
                          <span className="modal-value">{fechaPago}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-modal-cancelar"
                  onClick={cerrarModal}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn-modal-confirmar"
                  onClick={confirmarPedido}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      ✅ Confirmar Pedido
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de QR y Código Único */}
        {mostrarQR && pedidoCreado && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && cerrarQR()}>
            <div className="modal-qr-content">
              <div className="modal-qr-header">
                <h3>✅ ¡Pedido Registrado Exitosamente!</h3>
              </div>

              <div className="modal-qr-body">
                <div className="qr-importante">
                  <h4>⚠️ IMPORTANTE - GUARDA ESTA INFORMACIÓN</h4>
                  <p>Este código QR y el código único te permitirán:</p>
                  <ul>
                    <li>✅ Ver el resumen de tu pedido</li>
                    <li>➕ Agregar más camisas si lo necesitas</li>
                    <li>💳 Registrar los datos de pago</li>
                  </ul>
                  <p className="qr-advertencia">
                    <strong>¡Guarda este QR o el código! Lo necesitarás para gestionar tu pedido.</strong>
                  </p>
                </div>

                <div className="qr-code-section">
                  <h4>📱 Escanea este QR</h4>
                  <div className="qr-code-container">
                    <QRCodeSVG 
                      id="qr-code-svg"
                      value={`${window.location.origin}/pedido/${pedidoCreado.codigo_unico}`}
                      size={256}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <button className="btn-descargar-qr" onClick={descargarQR}>
                    📥 Descargar QR
                  </button>
                </div>

                <div className="codigo-section">
                  <h4>🔑 O usa este código único</h4>
                  <div className="codigo-display">
                    <span className="codigo-texto">{pedidoCreado.codigo_unico}</span>
                    <button 
                      className="btn-copiar-codigo"
                      onClick={() => {
                        navigator.clipboard.writeText(pedidoCreado.codigo_unico)
                        alert('✅ Código copiado al portapapeles')
                      }}
                    >
                      📋 Copiar
                    </button>
                  </div>
                </div>

                <div className="resumen-pedido-qr">
                  <h4>📋 Resumen de tu Pedido</h4>
                  <div className="resumen-info-qr">
                    <p><strong>Nombre:</strong> {pedidoCreado.nombre_persona}</p>
                    <p><strong>Iglesia:</strong> {pedidoCreado.iglesia}</p>
                    <p><strong>Total de camisas:</strong> {pedidoCreado.total_camisas}</p>
                    {pedidoCreado.camisas && pedidoCreado.camisas.length > 0 && (
                      <p><strong>Total:</strong> ${calcularTotalPedido(pedidoCreado.camisas)}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-qr-footer">
                <button className="btn-cerrar-qr" onClick={cerrarQR}>
                  ✅ Entendido, Hacer Otro Pedido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FormularioPedido
