# 🔐 Guía Segura de Testing — FinIA Admin

## Forma Más Segura de Correr y Probar el Proyecto

---

## 1️⃣ PREPARACIÓN DEL AMBIENTE

### 1.1 Verificar Node.js y npm

```bash
# Verificar versiones instaladas
node --version          # Debe ser 18+
npm --version           # Debe ser 9+

# Si no tienes o necesitas actualizar:
# Descarga desde: https://nodejs.org/
```

✅ **Seguridad:** Usa versiones LTS (Long-Term Support)
✅ **Verificación:** Ambas deben estar en PATH

### 1.2 Auditar Dependencias

```bash
# Verificar vulnerabilidades en node_modules
npm audit

# Ver detalles de vulnerabilidades
npm audit --detailed

# Corregir automáticamente lo que se pueda
npm audit fix

# Corregir forzado (más agresivo)
npm audit fix --force
```

✅ **Seguridad:** Ejecuta esto ANTES de npm install/start
⚠️ **Nota:** Si hay vulnerabilidades críticas, contáctame

### 1.3 Limpiar Ambiente Previo

```bash
# Si ejecutaste el proyecto antes:

# 1. Eliminar cache npm
npm cache clean --force

# 2. Eliminar node_modules
rm -r node_modules

# 3. Eliminar package-lock.json (opcional)
# Esto fuerza reinstalación limpia
rm package-lock.json

# 4. Reinstalar dependencias LIMPIO
npm install
```

✅ **Seguridad:** Esto evita conflictos de versiones

---

## 2️⃣ INSTALACIÓN SEGURA

### 2.1 Instalar Dependencias

```bash
# Cambiar a directorio del proyecto
cd c:\Users\User\Desktop\HACKATON-VERSION-2

# Instalar dependencias de forma segura
npm install

# Verificar que se instalaron correctamente
npm list --depth=0
```

### 2.2 Verificar Integridad

```bash
# Ver qué se instaló
npm list

# Ver solo dependencias directas
npm list --depth=0

# Ver tamaño total
npm list --size
```

✅ **Seguridad:** Si hay errores, npm te lo dirá claramente

---

## 3️⃣ EJECUCIÓN SEGURA

### 3.1 Ejecutar en Modo Desarrollo

```bash
# Forma 1: DEV MODE (con reload automático)
npm run dev

# Forma 2: BUILD + PREVIEW (simula producción)
npm run build && npm run preview

# Forma 3: BUILD SOLO (sin ejecutar)
npm run build
```

### 3.2 Elegir Según tu Necesidad

| Comando | Uso | Velocidad | Seguridad |
|---------|-----|-----------|-----------|
| `npm run dev` | Desarrollo + testing local | ⚡ Rápido | ✅ Alto |
| `npm run build` | Generar producción | 🔧 Normal | ✅ Muy Alto |
| `npm run preview` | Ver build compilado | 📦 Probando | ✅✅ Muy Alto |

**RECOMENDADO:** `npm run dev` para testing
**PARA PRESENTACIÓN:** `npm run build` + `npm run preview`

### 3.3 Puertos Seguros

```
VITE dev server:    http://localhost:5173
FastAPI backend:    http://localhost:8000
```

✅ **Seguridad:** Ambos en localhost (no expuesto a internet)

---

## 4️⃣ TESTING SEGURO

### 4.1 Verificar que Corre Correctamente

```bash
# Terminal 1: Iniciar dev server
npm run dev

# Espera este mensaje:
# ✓ built in XXXms
# → Local: http://localhost:5173/
```

### 4.2 Acceder en Navegador

```
1. Abre navegador
2. Navega a: http://localhost:5173/admin/login
3. Ingresa:
   Email:    admin@serfinanza.com
   Password: admin123
4. Deberías ver Dashboard
```

✅ **Seguridad:** Todo local, datos no se envían a internet

### 4.3 Pruebas Básicas (Checklist)

```
[ ] Login funciona con credenciales
[ ] Dashboard carga (4 KPIs + gráficos)
[ ] Tabla de clientes aparece (18 clientes)
[ ] Filtros funcionan (búsqueda, riesgo, ciudad)
[ ] Click en cliente → Detalle se abre
[ ] Botón "Generar Reporte" genera JSON
[ ] Notas privadas guardan/cargan
[ ] Chat IA responde a preguntas
[ ] Exportar CSV descarga archivo
[ ] Logout limpia sesión
[ ] Responsive en móvil (F12 → toggle device)
```

---

## 5️⃣ VALIDACIÓN DE SEGURIDAD

### 5.1 Verificar localStorage

```javascript
// Abre Console (F12 → Console)
// Copia esto y pega en console:

localStorage.getItem('finia_admin_session')
// Debe mostrar tu sesión (datos locales)

localStorage.getItem('finia_notes_CLI-001')
// Debe mostrar notas guardadas (si existen)

// Para ver TODO lo almacenado:
Object.keys(localStorage).forEach(key => {
  console.log(key, localStorage.getItem(key))
})
```

✅ **Seguridad:** Todo en navegador local, no servidor

### 5.2 Verificar Red

```
F12 → Network tab

1. Recarga página (Ctrl+Shift+R)
2. Deberías ver:
   ✅ GET index.html (0 errores)
   ✅ GET index-XXXXX.js (0 errores)
   ✅ GET index-XXXXX.css (0 errores)
   ❌ NO debe haber POST/GET a servidores externos

3. Status 200/304 para todos
```

✅ **Seguridad:** Nada se envía a servidores externos

### 5.3 Verificar Consola (No Errores)

```
F12 → Console tab

Busca:
❌ NO debe haber errores en rojo
⚠️ OK si hay warnings (amarillos)
ℹ️ OK si hay info (azules)
```

---

## 6️⃣ BUILD SEGURO PARA PRODUCCIÓN

### 6.1 Generar Build Producción

```bash
# 1. Limpiar build anterior (opcional)
rm -r dist

# 2. Generar build optimizado
npm run build

# Espera este output:
# ✓ built in 7.32s
# dist/index.html         0.39 kB
# dist/assets/index-XXX.css   27.31 kB
# dist/assets/index-XXX.js   726.08 kB
```

✅ **Seguridad:** Build compilado y optimizado

### 6.2 Validar Build

```bash
# Ver contenido del build
ls -la dist/

# Debe contener:
# - index.html
# - assets/index-XXXXX.css
# - assets/index-XXXXX.js
```

### 6.3 Probar Build Producción

```bash
# Vista previa del build (como si estuviera en servidor)
npm run preview

# Abre: http://localhost:4173
# Prueba exactamente igual que dev
```

✅ **Seguridad:** Verifica que build funciona igual que dev

---

## 7️⃣ TESTING MANUAL COMPLETO

### 7.1 Checklist de Funcionalidades

```
AUTENTICACIÓN:
  [ ] Login con credenciales correctas funciona
  [ ] Login con credenciales incorrectas rechaza
  [ ] Cerrar sesión limpia localStorage
  [ ] Sesión persiste al recargar página

DASHBOARD:
  [ ] 4 KPIs muestran números correctos
  [ ] PieChart muestra distribución correcta
  [ ] LineChart muestra tendencia 6 meses
  [ ] Click en "Top 5 en mora" navega a cliente

TABLA CLIENTES:
  [ ] Carga 18 clientes totales
  [ ] Paginación: 10 por página
  [ ] Filtro búsqueda: busca por nombre/email/ID
  [ ] Filtro riesgo: muestra solo selected
  [ ] Filtro historial: solo al día/tarde/no pago
  [ ] Filtro ciudad: solo selected
  [ ] Orden: salud/mora/nombre funcionan
  [ ] Exportar CSV: descarga archivo
  [ ] Health gauge en cada fila: color correcto

DETALLE CLIENTE:
  [ ] Carga datos correctos del cliente
  [ ] Medidor salud muestra número 0-100
  [ ] Créditos: lista activos con estado
  [ ] Botón generar reporte: genera JSON
  [ ] Reporte: contiene hallazgos + recomendaciones
  [ ] Notas: guardar + listar historial
  [ ] Notas: eliminar funciona
  [ ] Botón llamar: abre tel://

IA ANALYST:
  [ ] Chat carga historial anterior
  [ ] Preguntas sugeridas aparecen
  [ ] Click pregunta: genera respuesta
  [ ] Respuesta es contextual
  [ ] Historial se guarda

REPORTES:
  [ ] 4 tipos de reportes aparecen
  [ ] Click generar: crea reporte
  [ ] Reporte contiene: título, hallazgos, recomendaciones
  [ ] Botón descargar: baja .txt
  [ ] Historial guarda últimos 5

RESPONSIVE:
  [ ] Desktop (1920px): todo visible
  [ ] Tablet (768px): layout adapta
  [ ] Mobile (375px): bottom nav en lugar sidebar
  [ ] Todos botones clickeables
```

---

## 8️⃣ TESTING DE SEGURIDAD

### 8.1 Verificar No Hay Datos Sensibles

```bash
# 1. Revisar localStorage
# (Ya hecho arriba en 5.1)

# 2. Buscar palabras clave en código
grep -r "password" src/
grep -r "api_key" src/
grep -r "secret" src/
# No debe encontrar nada comprometedor
```

✅ **Seguridad:** No hay credenciales reales en código

### 8.2 Verificar CORS (No hay problemas de origen)

```
F12 → Network → Recargar

Busca líneas roja que digan:
"CORS error" o "Access-Control-Allow-Origin"

❌ Si aparece: problema de CORS
✅ Si no aparece: OK (es local)
```

### 8.3 Verificar No Hay Inyección XSS

```javascript
// En console, intenta esto:
localStorage.setItem('test', '<script>alert("xss")</script>')
// Recarga página
// Si NO aparece alert: ✅ seguro

// React sanitiza automáticamente, así que deberías estar bien
```

---

## 9️⃣ TROUBLESHOOTING SEGURO

### Problema: "Port already in use"

```bash
# Encontrar proceso en puerto 5173
netstat -ano | findstr :5173

# Matar proceso (reemplaza PID)
taskkill /PID XXXXX /F

# O simplemente usar otro puerto:
npm run dev -- --port 5174
```

### Problema: "Module not found"

```bash
# Solución 1: Limpiar cache
npm cache clean --force

# Solución 2: Reinstalar todo
rm -r node_modules package-lock.json
npm install

# Solución 3: Verificar integridad
npm ci  # (en lugar de npm install)
```

### Problema: "Build fails"

```bash
# Ver error completo
npm run build 2>&1

# Si dice "Vite error", revisar:
# 1. ¿Tienes todos los archivos en src/?
# 2. ¿Algún archivo .js tiene syntax error?
# 3. ¿Las rutas de import son correctas?

# Validar sintaxis
npm run build -- --mode development
```

### Problema: "Datos no se guardan"

```bash
# Verificar localStorage habilitado
F12 → Application → Storage → Local Storage

# Si está vacío:
# 1. ¿Permitiste localStorage?
# 2. ¿Está en modo incógnito? (no guarda)
# 3. ¿Limpiaste cache del navegador?

# Solución: Abre normal (no incógnito)
```

---

## 🔟 FORM SEGURO DE EJECUTAR

### OPCIÓN A: Desarrollo Local (RECOMENDADO)

```bash
# Terminal 1
cd c:\Users\User\Desktop\HACKATON-VERSION-2
npm install
npm run dev

# Terminal 2 (opcional, solo si necesitas backend)
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

✅ **Pros:** Rápido, hot reload, full debug
⚠️ **Cons:** Solo en localhost

### OPCIÓN B: Build + Preview (SEGURIDAD MÁXIMA)

```bash
# 1. Generar build
npm run build

# 2. Probar build
npm run preview

# 3. Probar en navegador
# http://localhost:4173

# 4. Validar que todo funciona igual que dev
```

✅ **Pros:** Simula producción exactamente
✅ **Pros:** Máxima seguridad
⚠️ **Cons:** Sin hot reload

### OPCIÓN C: Deploy Local Docker (AVANZADO)

```bash
# Si tienes Docker:
docker build -t finia-admin .
docker run -p 3000:80 finia-admin

# http://localhost:3000
```

---

## ✅ CHECKLIST FINAL ANTES DE USAR

- [ ] Node 18+ instalado
- [ ] npm audit pasado (sin críticos)
- [ ] npm install limpio (sin errores)
- [ ] npm run dev funciona
- [ ] http://localhost:5173/admin/login carga
- [ ] Login funciona con creds
- [ ] Dashboard muestra datos
- [ ] No hay errores en F12 Console
- [ ] localStorage guarda datos
- [ ] Filtros funcionan
- [ ] Reporte IA genera JSON
- [ ] Notas guardan/cargan
- [ ] Exportar CSV funciona

---

## 🚨 ADVERTENCIAS DE SEGURIDAD

### ⚠️ NUNCA HAGAS ESTO

```bash
# ❌ No correr con npm install -g
npm install -g finia-admin

# ❌ No cambiar credenciales en localStorage
# (puede romper app)

# ❌ No subir dist/ a versión control
# (ya está en .gitignore)

# ❌ No dejes npm run dev corriendo permanentemente
# (usa npm run build para producción)

# ❌ No abras el proyecto en modo incógnito
# (localStorage no funciona)

# ❌ No hagas git commit con node_modules
# (está en .gitignore, así que OK)
```

### ✅ SIEMPRE HAZ ESTO

```bash
# ✅ Ejecuta npm audit regularmente
npm audit

# ✅ Mantén dependencias actualizadas
npm update

# ✅ Usa package-lock.json en Git
git status

# ✅ Limpia cache antes de instalar
npm cache clean --force

# ✅ Verifica que tu puerto es local
# http://localhost:XXXX (no IP pública)

# ✅ Usa HTTPS en producción
# (build solo genera assets, necesitas servidor)
```

---

## 📊 RESUMEN SEGURIDAD

| Aspecto | Desarrollo | Producción |
|---------|-----------|-----------|
| Comando | `npm run dev` | `npm run build` + deploy |
| Acceso | localhost:5173 | Tu servidor HTTPS |
| Datos | localStorage | Backend seguro |
| Secrets | Ninguno (mock) | Backend OAuth |
| Build | Fast, debug | Optimizado, minified |
| Testing | Hot reload | Preview primero |

---

## 🎯 FLUJO RECOMENDADO

```
1. npm install (1x)
   ↓
2. npm run dev (desarrollo)
   ├─ Testear
   ├─ Editar código
   ├─ Hot reload automático
   └─ Repetir
   ↓
3. npm run build (cuando termines)
   ↓
4. npm run preview (validar build)
   ├─ Pruebas finales
   └─ Si OK → Proceder a deploy
   ↓
5. Desplegar dist/ a servidor
```

---

## 📞 SOPORTE RÁPIDO

| Problema | Solución |
|----------|----------|
| No corre | `npm install` + `npm run dev` |
| Puertos ocupados | Cambiar puerto o matar proceso |
| Errores en console | Limpiar cache + reinstalar |
| localhost rechaza | Verificar firewall |
| localStorage vacío | Modo incógnito → Normal |
| Build falla | Ver error completo + revisar src/ |

---

## 🏁 LISTO

Ahora tienes la forma más segura de:
✅ Instalar dependencias
✅ Ejecutar en desarrollo
✅ Testear funcionalidades
✅ Generar build
✅ Verificar seguridad
✅ Deployar con confianza

**¡Comienza con: `npm run dev`** 🚀
