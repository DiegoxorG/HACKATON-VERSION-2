import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AppAdmin from './AppAdmin'
import './index.css'

// Punto de entrada único del frontend.
// El proyecto mantiene dos "subapps":
// - Cliente final (App)
// - Panel administrativo (AppAdmin)
// Aquí seleccionamos cuál renderizar según la ruta actual.
const isAdmin = window.location.pathname.includes('/admin')
const AppToRender = isAdmin ? AppAdmin : App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppToRender />
  </React.StrictMode>
)


