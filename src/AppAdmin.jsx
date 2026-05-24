import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { AdminProvider, useAdmin } from './context/AdminContext'
import AdminDashboard from './screens/AdminDashboard'
import AdminLogin from './screens/AdminLogin'
import AdminProfile from './screens/AdminProfile'
import AIAnalyst from './screens/AIAnalyst'
import ClientDetail from './screens/ClientDetail'
import ClientList from './screens/ClientList'
import Reports from './screens/Reports'

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const { admin } = useAdmin()

  useEffect(() => {
    if (!admin) {
      const session = localStorage.getItem('finia_admin_session')
      if (!session) navigate('/admin/login')
    }
  }, [admin, navigate])

  return admin ? children : null
}

function AppRoutes() {
  const { admin, setAdmin } = useAdmin()

  useEffect(() => {
    const session = localStorage.getItem('finia_admin_session')
    if (session && !admin) {
      setAdmin(JSON.parse(session))
    }
  }, [admin, setAdmin])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/clients"
        element={
          <ProtectedRoute>
            <ClientList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/client/:id"
        element={
          <ProtectedRoute>
            <ClientDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analyst"
        element={
          <ProtectedRoute>
            <AIAnalyst />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AdminProvider>
  )
}
