import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import FormularioPedido from './components/FormularioPedido'
import PanelAdmin from './components/PanelAdmin'
import VerPedido from './components/VerPedido'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">👕 Pedidos de Camisas Zona I</h1>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<FormularioPedido />} />
          <Route path="/admin" element={<PanelAdmin />} />
          <Route path="/pedido/:codigo" element={<VerPedido />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
