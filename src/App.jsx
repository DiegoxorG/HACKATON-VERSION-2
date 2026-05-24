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

const Protected = ({ children }) => {
  const { user } = useApp()
  return user ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/advisor" element={<Protected><AIAdvisor /></Protected>} />
          <Route path="/credits" element={<Protected><CreditAnalyzer /></Protected>} />
          <Route path="/reports" element={<Protected><BankReport /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/score" element={<Protected><Score /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
