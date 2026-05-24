# FORMA MAS SEGURA DE CORRER TU PROYECTO

## TL;DR (Rápido)

```bash
# 1. Abrir PowerShell o Terminal
cd c:\Users\User\Desktop\HACKATON-VERSION-2

# 2. Instalar dependencias (primera vez)
npm install

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir navegador
http://localhost:5173/admin/login

# Credenciales:
Email: admin@serfinanza.com
Password: admin123
```

---

## PASO A PASO SEGURO

### PASO 1: Verificar Environment

```bash
# Verifica versiones
node --version    # Debe ser 18+
npm --version     # Debe ser 9+

# Si no tienes, descarga desde:
# https://nodejs.org/
```

### PASO 2: Limpiar Cache (Primera Vez)

```bash
# Limpiar cache npm
npm cache clean --force

# (Opcional) Eliminar node_modules si exists
# del node_modules /S /Q
# del package-lock.json
```

### PASO 3: Instalar Dependencias

```bash
# Cambiar a directorio
cd c:\Users\User\Desktop\HACKATON-VERSION-2

# Instalar
npm install

# Debe terminar sin errores rojos
# Verifica: debe crear carpeta node_modules
```

### PASO 4: Verificar Integridad

```bash
# Revisar vulnerabilidades
npm audit

# Si hay vulnerabilidades:
npm audit fix

# Si fix no resuelve todo:
# Contacta a soporte
```

### PASO 5: Correr en Desarrollo

```bash
# Terminal 1:
npm run dev

# Espera este mensaje:
# VITE v5.4.21 ready in XXX ms
# Local: http://localhost:5173/
```

### PASO 6: Acceder desde Navegador

```
1. Abre navegador (Chrome, Firefox, Edge)
2. Ve a: http://localhost:5173/admin/login
3. Espera que cargue (10-20 segundos primera vez)
4. Inicia sesión:
   Email: admin@serfinanza.com
   Password: admin123
```

### PASO 7: Probar Funcionalidades Clave

```
[ ] Login funcionó
[ ] Dashboard carga (ves 4 números)
[ ] Tabla de clientes aparece (18 clientes)
[ ] Puedes filtrar por riesgo
[ ] Click en cliente abre detalle
[ ] Generador de reportes funciona
[ ] Puedes guardar notas
```

---

## 3 FORMAS DE EJECUTAR

### FORMA 1: DESARROLLO (RECOMENDADO)

```bash
npm run dev
# Abre: http://localhost:5173
# Pros: Rápido, hot reload, full debug
# Cons: Solo local
```

### FORMA 2: PRODUCCIÓN (SEGURO)

```bash
npm run build      # Genera dist/
npm run preview    # Prueba build
# Abre: http://localhost:4173
# Pros: Simula servidor real
# Cons: Sin hot reload
```

### FORMA 3: VALIDAR SOLO

```bash
npm run build      # Si termina sin errores, OK
# Pros: Verifica que build funciona
# Cons: No ejecuta servidor
```

---

## VERIFICACIÓN SEGURIDAD

### Verificar No Hay Errores

```
F12 (Abre DevTools)
-> Console tab
-> Busca errores en ROJO
-> OK si hay warnings amarillos
```

### Verificar Datos Locales

```
F12 -> Application -> Storage -> Local Storage
-> Debes ver: finia_admin_session
-> Esto confirma que datos se guardan localmente
```

### Verificar Network OK

```
F12 -> Network tab
-> Recarga página (Ctrl+R)
-> Debe haber:
   - index.html (200)
   - .js files (200)
   - .css files (200)
-> NO debe haber rojo (errores)
```

---

## TROUBLESHOOTING RÁPIDO

| Problema | Solución |
|----------|----------|
| "Port already in use" | `npm run dev -- --port 5174` |
| "Module not found" | `npm install` (completo) |
| "npm ERR!" | Limpiar: `npm cache clean --force` |
| No carga página | ¿Esperar 10s? First load es lento |
| Datos no se guardan | ¿Modo incógnito? Cambiar a normal |
| Build fails | Ver error completo: `npm run build 2>&1` |

---

## COMANDOS DISPONIBLES

```bash
npm run dev          # Desarrollo (recomendado)
npm run build        # Build producción
npm run preview      # Preview del build
npm audit            # Verificar seguridad
npm install          # Instalar dependencias
npm update           # Actualizar dependencias
npm cache clean      # Limpiar cache
```

---

## CHECKLIST ANTES DE USAR

- [ ] Node.js 18+ instalado
- [ ] npm install completado sin errores
- [ ] npm audit pasó
- [ ] npm run dev corre sin errores
- [ ] http://localhost:5173 accesible
- [ ] Login funciona
- [ ] Dashboard muestra datos

---

## DOCUMENTACIÓN RELACIONADA

- **TESTING_GUIDE.md** - Guía completa testing
- **QUICK_START.md** - Guía rápida para asesores
- **PRESENTATION_GUIDE.md** - Script para presentar
- **INDEX.md** - Navegación de todas las docs

---

## SIGUIENTE

1. Ejecuta: `npm run dev`
2. Abre: http://localhost:5173/admin/login
3. Ingresa credenciales
4. ¡Disfruta! 🚀

---

*Forma más segura: desarrollo local → testing → build → producción*
