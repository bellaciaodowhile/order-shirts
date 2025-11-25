import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import FormularioPedido from './components/FormularioPedido'
import PanelAdmin from './components/PanelAdmin'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">👕 Pedidos de Camisas Zona I</h1>
            {/* <div className="nav-links">
              <Link to="/" className="nav-link">Hacer Pedido</Link>
              <Link to="/admin" className="nav-link">Panel Admin</Link>
            </div> */}
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<FormularioPedido />} />
          <Route path="/admin" element={<PanelAdmin />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
