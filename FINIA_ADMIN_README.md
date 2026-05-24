# FinIA Admin — Panel de Administración Bancaria

**FinIA Admin** es el panel de control para asesores y administrativos de Serfinanza Colombia. Permite gestionar portafolios de clientes, analizar riesgos financieros y recibir recomendaciones de IA en tiempo real.

## Acceso

### Credenciales Demo
- **Email:** `admin@serfinanza.com`
- **Contraseña:** `admin123`

Navega a: `http://localhost:5173/admin/login`

## Funcionalidades

### 1. Dashboard (`/admin/dashboard`)
- **KPIs en tiempo real:** Total de clientes, clientes en riesgo alto/crítico, mora promedio, salud promedio
- **Distribución de riesgo:** Gráfico de dona con 4 niveles de riesgo
- **Tendencia del portafolio:** Línea de evolución de salud y % en mora (últimos 6 meses)
- **Alertas críticas:** Top 5 clientes con mayor riesgo de mora
- **Requieren contacto:** Clientes con última contacto hace más de 2 semanas

### 2. Gestión de Clientes (`/admin/clients`)
- **Tabla de clientes** con 10 clientes por página
- **Filtros funcionales:**
  - Búsqueda por nombre, email o ID
  - Nivel de riesgo (bajo/moderado/alto/crítico)
  - Historial de pago (al día/tarde/no pago)
  - Ciudad
- **Ordenamiento por:** Salud financiera, probabilidad de mora, nombre, último contacto
- **Indicadores visuales:** Barra de endeudamiento, gauge de probabilidad de mora, badge de riesgo
- **Exportar a CSV:** Descarga lista completa de clientes

### 3. Detalle de Cliente (`/admin/client/:id`)
- **Perfil completo:** Datos personales, financieros, ocupación, ciudad
- **Medidor de salud financiera** (0-100) con color semántico
- **Métricas clave:**
  - Ingreso/gastos mensuales
  - Capacidad de pago
  - Endeudamiento (%)
  - Probabilidad de mora (%)
  - Fondo de emergencia (meses)
- **Créditos activos:** Lista con monto, cuota, estado (al día/tarde/no pago)
- **Alertas activas:** Banner rojo con alertas urgentes
- **Reporte IA:** Análisis automático con Claude (resumen, fortalezas, alertas, recomendaciones, proyección 6 meses)
- **Notas privadas:** Editor de notas con historial persistente en localStorage
- **Acciones rápidas:**
  - Generar reporte con IA
  - Consultar con IA Analyst
  - Botón para llamar (tel:// scheme)

### 4. IA Analyst (`/admin/analyst`)
- **Chat conversacional** con contexto completo del portafolio
- **Contexto del cliente** (si se llama con query param `?client=CLI-001`)
- **Preguntas rápidas sugeridas:**
  - "¿Quiénes tienen mayor riesgo de mora este mes?"
  - "¿Qué clientes debo contactar esta semana?"
  - "¿Hay patrones preocupantes en el portafolio?"
  - (más si hay cliente en foco)
- **Historial de chats** persistente (últimos 10)
- **Respuestas de IA** adaptadas al contexto real del portafolio
- Botón para limpiar chat

### 5. Reportes (`/admin/reports`)
- **4 tipos de reportes:**
  1. **Resumen ejecutivo del portafolio** — Análisis general, KPIs, recomendaciones
  2. **Clientes en riesgo crítico** — Detalle de clientes críticos y acciones urgentes
  3. **Análisis por segmento** — Ocupación, geografía, estrategias diferenciadas
  4. **Proyección de mora** — Predicción 6 meses, escenarios con/sin intervención

- Cada reporte incluye:
  - Resumen ejecutivo
  - Hallazgos clave (puntos concretos)
  - Recomendaciones accionables
  - Proyección futura

- **Opciones:**
  - Regenerar reporte
  - Descargar como archivo (.txt)
  
- **Historial:** Últimos 5 reportes generados

### 6. Perfil (`/admin/profile`)
- Información de la sesión actual
- Rol y email del asesor
- Botón para cerrar sesión

## Datos Mock

**18 clientes** con datos realistas:
- 5 en riesgo **bajo** (28%)
- 6 en riesgo **moderado** (33%)
- 5 en riesgo **alto** (28%)
- 2 en riesgo **crítico** (11%)

Cada cliente tiene:
- Datos personales (nombre, email, teléfono, ocupación, ciudad)
- Datos financieros (ingresos, gastos, ahorros, créditos)
- Métricas de riesgo (salud, endeudamiento, probabilidad mora)
- Historial de contacto
- Alertas activas
- Créditos activos con estado de pago

## Paleta de Colores (Dark Mode)

```
Fondo:           #0f172a (muy oscuro)
Cards:           #1e293b (gris oscuro)
Border:          #334155 (gris)
Primario:        #1a56db (azul instituc.)
Éxito/Bajo:      #0e9f6e (verde)
Warning/Moderado:#e3a008 (amarillo)
Alto:            #f97316 (naranja)
Crítico/Peligro: #e02424 (rojo)
Texto principal: #f1f5f9 (gris claro)
Texto secundario:#94a3b8 (gris tenue)
```

## Estructura de Archivos

```
src/
├── AppAdmin.jsx                  # App principal con router
├── main.jsx                      # Entry point (elige Admin vs Cliente)
├── context/
│   └── AdminContext.jsx          # Estado global + filtros
├── screens/
│   ├── AdminLogin.jsx            # Login admin
│   ├── AdminDashboard.jsx        # KPIs y gráficos
│   ├── ClientList.jsx            # Tabla con filtros
│   ├── ClientDetail.jsx          # Perfil cliente + reporte IA
│   ├── AIAnalyst.jsx             # Chat con IA
│   ├── Reports.jsx               # Generador de reportes
│   └── AdminProfile.jsx          # Perfil del asesor
├── components/
│   ├── AdminShell.jsx            # Layout principal
│   ├── RiskBadge.jsx             # Badge de riesgo
│   ├── HealthGauge.jsx           # Medidor de salud
│   └── NoteEditor.jsx            # Editor de notas
├── utils/
│   ├── adminFinance.js           # Cálculos financieros
│   └── finance.js                # Financiero del cliente
├── services/
│   └── claudeService.js          # Integración Claude (reutilizada)
└── data/
    └── mockClients.js            # 18 clientes simulados
```

## Persistencia

Todos los datos se guardan en **localStorage**:
- `finia_admin_session` — Sesión del admin
- `finia_notes_${clientId}` — Notas por cliente
- `finia_admin_chats` — Historial de chats IA
- `finia_reports` — Últimos reportes generados

## Responsividad

- **Desktop:** Layout de 2 columnas, sidebar fijo, tablas horizontales
- **Tablet:** Layout 1.5 columnas, nav colapsable
- **Mobile:** Layout de 1 columna, bottom nav, tablas adaptadas

## Semántica Visual

| Color | Significado |
|-------|-----------|
| 🟢 Verde | Bajo riesgo, estable, éxito |
| 🟡 Amarillo | Riesgo moderado, atención requerida |
| 🟠 Naranja | Alto riesgo, acción recomendada |
| 🔴 Rojo | Riesgo crítico, intervención urgente |

## Flujos Principales

### 1. Verificar cartera
1. Ir a Dashboard → Ver KPIs y alertas
2. Filtrar por riesgo alto/crítico
3. Identificar clientes que requieren contacto

### 2. Analizar cliente específico
1. Ir a Clientes → Buscar/filtrar → Click en fila
2. Ver perfil, métricas, historial de créditos
3. Generar reporte IA
4. Guardar notas privadas
5. (Opcional) Abrir chat IA para profundizar

### 3. Tomar decisiones
1. Usar IA Analyst para: "¿A quién debo llamar?"
2. Leer proyecciones y recomendaciones
3. Ejecutar acciones (llamar, refinanciar, etc.)
4. Registrar seguimiento en notas

### 4. Reportar
1. Ir a Reportes → Seleccionar tipo
2. Generar con IA
3. Revisar hallazgos y recomendaciones
4. Descargar para presentación

## Próximas Fases (No incluidas en MVP)

- [ ] Integración real con API Claude (actualmente mock)
- [ ] Backend PostgreSQL para persistencia
- [ ] Autenticación con OAuth/SSO
- [ ] Exportación a PDF con branding Serfinanza
- [ ] Historial de auditoría (quién hizo qué, cuándo)
- [ ] Notificaciones push para alertas críticas
- [ ] Machine Learning de verdad (no reglas heurísticas)
- [ ] Integración con core bancario (consultar créditos reales)
- [ ] Multi-asesor con asignación de cartera
- [ ] Dashboard de KPIs por asesor

---

**FinIA Admin** — Herramienta de trabajo real para asesores bancarios. Impulsado por IA. Diseñado para eficiencia.
