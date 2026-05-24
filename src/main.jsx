import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AppAdmin from './AppAdmin'
import './index.css'

// Determinar si es admin o cliente basado en la URL
const isAdmin = window.location.pathname.includes('/admin')
const AppToRender = isAdmin ? AppAdmin : App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppToRender />
  </React.StrictMode>
)


