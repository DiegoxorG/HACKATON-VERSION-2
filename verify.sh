#!/bin/bash
# Verificación segura del proyecto FinIA Admin
# Uso: ./verify.sh

echo "════════════════════════════════════════════════════════════════"
echo "  🔐 VERIFICACIÓN SEGURA - FINÍA ADMIN MVP"
echo "════════════════════════════════════════════════════════════════"
echo ""

# 1. Verificar Node.js
echo "[1] Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "  ✅ Node.js encontrado: $NODE_VERSION"
else
    echo "  ❌ Node.js NO instalado. Descarga desde https://nodejs.org/"
    exit 1
fi

# 2. Verificar npm
echo ""
echo "[2] Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "  ✅ npm encontrado: $NPM_VERSION"
else
    echo "  ❌ npm NO instalado"
    exit 1
fi

# 3. Auditar dependencias
echo ""
echo "[3] Auditando vulnerabilidades..."
npm audit --json > /tmp/audit.json 2>&1
VULNERABILITIES=$(grep -c "vulnerabilities" /tmp/audit.json)

if [ "$VULNERABILITIES" -gt 0 ]; then
    echo "  ⚠️  Vulnerabilidades encontradas:"
    npm audit --short
    echo ""
    echo "  Ejecutar: npm audit fix"
else
    echo "  ✅ No hay vulnerabilidades críticas"
fi

# 4. Verificar node_modules
echo ""
echo "[4] Verificando node_modules..."
if [ -d "node_modules" ]; then
    COUNT=$(find node_modules -type d | wc -l)
    echo "  ✅ node_modules encontrado ($COUNT directorios)"
else
    echo "  ⚠️  node_modules NO encontrado"
    echo "  Ejecutar: npm install"
fi

# 5. Verificar estructura de archivos
echo ""
echo "[5] Verificando estructura del proyecto..."
FILES_OK=true

for dir in "src" "public" "src/screens" "src/components" "src/context" "src/utils" "src/data"; do
    if [ -d "$dir" ]; then
        echo "  ✅ $dir encontrado"
    else
        echo "  ❌ $dir NO encontrado"
        FILES_OK=false
    fi
done

# 6. Verificar archivos clave
echo ""
echo "[6] Verificando archivos clave..."
for file in "package.json" "vite.config.js" "tailwind.config.js" "src/main.jsx" "src/AppAdmin.jsx"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file encontrado"
    else
        echo "  ❌ $file NO encontrado"
        FILES_OK=false
    fi
done

# 7. Verificar documentación
echo ""
echo "[7] Verificando documentación..."
for doc in "INDEX.md" "QUICK_START.md" "TESTING_GUIDE.md" "PRESENTATION_GUIDE.md"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $doc encontrado"
    else
        echo "  ⚠️  $doc NO encontrado (opcional)"
    fi
done

# 8. Verificar Git
echo ""
echo "[8] Verificando Git..."
if [ -d ".git" ]; then
    COMMITS=$(git log --oneline | wc -l)
    echo "  ✅ Repositorio Git encontrado ($COMMITS commits)"
else
    echo "  ⚠️  Git NO inicializado (opcional)"
fi

# 9. Verificar puerto disponible
echo ""
echo "[9] Verificando puerto 5173..."
if lsof -i :5173 &> /dev/null; then
    echo "  ⚠️  Puerto 5173 YA ESTÁ EN USO"
    echo "  Ejecutar: npm run dev -- --port 5174"
else
    echo "  ✅ Puerto 5173 disponible"
fi

# 10. Build check
echo ""
echo "[10] Verificando build (sin compilar)..."
if grep -q "build" package.json; then
    echo "  ✅ Script build encontrado en package.json"
else
    echo "  ❌ Script build NO encontrado"
fi

# Resumen final
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  ✅ VERIFICACIÓN COMPLETADA"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🚀 SIGUIENTES PASOS:"
echo ""
echo "   1. npm install           (si no está hecho)"
echo "   2. npm run dev           (inicia servidor)"
echo "   3. Abre navegador:"
echo "      http://localhost:5173/admin/login"
echo ""
echo "   Credenciales:"
echo "   Email:    admin@serfinanza.com"
echo "   Password: admin123"
echo ""
echo "════════════════════════════════════════════════════════════════"
