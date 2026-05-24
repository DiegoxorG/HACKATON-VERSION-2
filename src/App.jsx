import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Splash from './screens/Splash'
import Login from './screens/Login'
import Register from './screens/Register'
import Welcome from './screens/Welcome'
import Dashboard from './screens/Dashboard'
import AIAdvisor from './screens/AIAdvisor'
import CreditAnalyzer from './screens/CreditAnalyzer'
import BankReport from './screens/BankReport'
import Profile from './screens/Profile'
import Score from './screens/Score'
import Products from './screens/Products'
import Expenses from './screens/Expenses'

// Wrapper de protección para rutas autenticadas en la app de cliente.
// Si no hay sesión de usuario activa, redirige al splash/login.
const Protected = ({ children }) => {
  const { user } = useApp()
  return user ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    // AppProvider centraliza sesión y acciones globales de usuario.
    <AppProvider>
      {/* Router exclusivo para el flujo de cliente */}
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome" element={<Welcome />} />

          {/* Rutas privadas (requieren usuario autenticado) */}
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/expenses" element={<Protected><Expenses /></Protected>} />
          <Route path="/advisor" element={<Protected><AIAdvisor /></Protected>} />
          <Route path="/credits" element={<Protected><CreditAnalyzer /></Protected>} />
          <Route path="/products" element={<Protected><Products /></Protected>} />
          <Route path="/reports" element={<Protected><BankReport /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/score" element={<Protected><Score /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
