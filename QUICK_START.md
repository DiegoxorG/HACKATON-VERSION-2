# 🚀 FinIA Admin — Guía Rápida de Inicio

## ¿Qué es FinIA Admin?

Panel de administración bancaria para asesores de Serfinanza Colombia. Gestiona portafolios de clientes, analiza riesgos financieros y recibe recomendaciones de IA en tiempo real.

---

## 🔓 Acceso Rápido

### URL
```
http://localhost:5173/admin/login
```

### Credenciales Demo
```
Email:    admin@serfinanza.com
Contraseña: admin123
```

---

## 📊 6 Pantallas Principales

### 1. **Dashboard** (`/admin/dashboard`)
Resumen ejecutivo con KPIs en tiempo real:
- Total clientes
- Clientes en riesgo alto/crítico
- Mora promedio del portafolio
- Salud financiera promedio

Incluye gráficos:
- Distribución de riesgo (pie chart)
- Tendencia 6 meses (line chart)

### 2. **Clientes** (`/admin/clients`)
Tabla de 18 clientes con filtros funcionales:
- 🔍 Búsqueda por nombre/email/ID
- 🎯 Filtrar por nivel de riesgo
- 📊 Filtrar por historial de pago
- 🗺️ Filtrar por ciudad
- 📈 Ordenar por: salud, mora, nombre, último contacto
- 📥 Exportar a CSV

### 3. **Detalle Cliente** (`/admin/client/:id`)
Perfil completo de cada cliente:
- Información personal y financiera
- Medidor de salud (0-100)
- Créditos activos
- Alertas
- **Reporte IA** (generado automático)
- **Notas privadas** (guardar/eliminar)
- Botón para llamar
- Acceso rápido a IA Analyst

### 4. **IA Analyst** (`/admin/analyst`)
Chat inteligente con contexto del portafolio:
- Preguntas sugeridas:
  - "¿Quiénes tienen mayor riesgo de mora?"
  - "¿Qué clientes debo contactar?"
  - "¿Hay patrones preocupantes?"
- Historial persistente
- Respuestas contextuadas

### 5. **Reportes** (`/admin/reports`)
Generador de 4 tipos de reportes:
1. Resumen ejecutivo del portafolio
2. Clientes en riesgo crítico
3. Análisis por segmento (ocupación, geografía)
4. Proyección de mora (6 meses)

Cada reporte incluye:
- Resumen
- Hallazgos clave
- Recomendaciones
- Proyección futura
- Descarga como archivo

### 6. **Perfil** (`/admin/profile`)
Información de tu sesión:
- Email del asesor
- Rol (Asesor Bancario)
- Fecha/hora de login
- Botón Cerrar sesión

---

## 🎯 Flujos de Trabajo Típicos

### Flujo 1: Verificar clientes urgentes
```
1. Ir a Dashboard
2. Revisar "Clientes en riesgo alto/crítico" (rojo)
3. Hacer clic en cliente
4. Ver "Reporte IA" con recomendaciones
5. Guardar nota privada
6. Llamar al cliente (botón tel://)
```

### Flujo 2: Generar reporte ejecutivo
```
1. Ir a Reportes
2. Seleccionar "Resumen ejecutivo del portafolio"
3. Hacer clic "Generar reporte con IA"
4. Revisar hallazgos y recomendaciones
5. Descargar archivo
```

### Flujo 3: Encontrar patrones en el portafolio
```
1. Ir a IA Analyst
2. Hacer clic en "¿Hay patrones preocupantes?"
3. Leer análisis de IA
4. Obtener recomendaciones concretas
```

### Flujo 4: Filtrar y actuar sobre clientes moderados
```
1. Ir a Clientes
2. Filtrar: Nivel de riesgo = "Moderado"
3. Ordenar por: "Último contacto"
4. Contactar a los más antiguos
5. Guardar notas en cada cliente
```

---

## 🎨 Interpretación de Colores

| Color | Significado | Acción |
|-------|-------------|--------|
| 🟢 Verde | Bajo riesgo / Estable | Seguimiento trimestral |
| 🟡 Amarillo | Riesgo moderado | Contacto mensual |
| 🟠 Naranja | Riesgo alto | Contacto semanal |
| 🔴 Rojo | Riesgo crítico | **Contacto INMEDIATO** |

---

## 📋 18 Clientes Demo

**Bajo riesgo (5):**
- María Fernanda Torres (82/100)
- Carlos Alberto Mendoza (88/100)
- Ana Lucía Rodríguez (85/100)
- Juan Pablo Cifuentes (80/100)
- Patricia Gómez López (84/100)

**Moderado (6):**
- Roberto Silva Martínez (62/100)
- Catalina Herrera Pérez (65/100)
- Hernán Díaz Ramírez (58/100) ⚠️ mora
- Gabriela Naranjo Soto (68/100)
- Alejandra Peña Castellanos (63/100)
- Fernando Castillo López (67/100)

**Alto (5):**
- Miguel Ángel Ruiz Torres (38/100) 🔴
- Lorena González Beltrán (25/100) 🔴
- Víctor Manuel Ochoa (42/100)
- Mónica Andrea Vargas (35/100) 🔴
- Douglas Jiménez Salinas (18/100) 🔴

**Crítico (2):**
- Emilio Gómez Cañas (5/100) 🔴🔴
- Rosario Martínez Durán (8/100) 🔴🔴

---

## 🔧 Funciones Avanzadas

### Filtros Persistentes
Los filtros se mantienen mientras navegas (almacenados en React context)

### Notas Privadas
- Guardar notas por cliente
- Se persisten en localStorage
- Historial completo con fecha/hora
- Opción de eliminar

### Reporte IA
- Análisis automático por cliente
- Incluye probabilidad de pago
- Recomendaciones personalizadas
- Proyección 6 meses

### Chat IA
- Acceso a contexto completo del portafolio
- Respuestas reales basadas en datos mock
- Historial guardado (últimos 10 chats)

### Exportar Datos
- Tabla de clientes → CSV
- Reportes → Archivo .txt

---

## ⚙️ Tecnología

- **React 18** — UI
- **Vite 5** — Bundler
- **TailwindCSS 3** — Dark mode profesional
- **Recharts** — Gráficos
- **React Router 6** — Navegación
- **localStorage** — Persistencia

---

## 📍 URLs Importantes

| Página | URL |
|--------|-----|
| Login | `/admin/login` |
| Dashboard | `/admin/dashboard` |
| Clientes | `/admin/clients` |
| Cliente #1 | `/admin/client/CLI-001` |
| IA Analyst | `/admin/analyst` |
| Reportes | `/admin/reports` |
| Perfil | `/admin/profile` |

---

## 🎓 Tips de Uso

1. **Empezar con Dashboard** — Obtén visión general de la cartera
2. **Revisar críticos** — Clientes en rojo requieren acción inmediata
3. **Usar IA Analyst** — Haz preguntas específicas, te dará recomendaciones
4. **Guardar notas** — Registra todas las acciones en notas privadas
5. **Exportar reportes** — Para compartir con superiores o juntas

---

## ⚠️ Datos Importantes

- Sesión guardada en localStorage (persiste al recargar)
- Notas por cliente (separadas por ID de cliente)
- Historial de chats IA (últimos 10)
- Reportes generados (últimos 5)
- Todo local, sin backend real en MVP

---

## ❓ Preguntas Frecuentes

**¿Cómo cambio el rango de fechas en gráficos?**
Los gráficos muestran últimos 6 meses simulados. Próximas versiones tendrán rangos personalizables.

**¿Puedo añadir clientes nuevos?**
En este MVP, los 18 clientes son fijos. El backend futuro permitirá CRUD completo.

**¿Dónde se guardan los datos?**
Todo en localStorage del navegador. Cierra sesión del navegador → pierdes datos locales pero sesión persiste.

**¿Puedo usar en móvil?**
Sí, responsive. Bottom nav reemplaza sidebar en mobile.

**¿Cuántos clientes puedo gestionar?**
18 en demo. Backend futuro escala a miles.

---

## 🚀 Próximas Versiones

- [ ] Integración real con Claude API
- [ ] Backend PostgreSQL
- [ ] Autenticación real (OAuth)
- [ ] Exportar a PDF
- [ ] Auditoría completa
- [ ] Multi-asesor
- [ ] Notificaciones push

---

## 📞 Soporte

**Build OK:** ✅ `npm run build` exitoso
**Dev mode:** `npm run dev` en http://localhost:5173
**Credenciales:** admin@serfinanza.com / admin123

---

**¡Bienvenido a FinIA Admin!** 🎉

Panel profesional, moderno y funcional para gestionar tu portafolio con inteligencia artificial.
