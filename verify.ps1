# Verificación segura del proyecto FinIA Admin (Windows)
# Uso: .\verify.ps1

Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🔐 VERIFICACIÓN SEGURA - FINÍA ADMIN MVP" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Node.js
Write-Host "[1] Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js NO instalado. Descarga desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# 2. Verificar npm
Write-Host ""
Write-Host "[2] Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✅ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ npm NO instalado" -ForegroundColor Red
    exit 1
}

# 3. Auditar dependencias
Write-Host ""
Write-Host "[3] Auditando vulnerabilidades..." -ForegroundColor Yellow
$auditOutput = npm audit --json 2>&1
if ($auditOutput -match "vulnerabilities") {
    Write-Host "  ⚠️  Vulnerabilidades encontradas" -ForegroundColor Yellow
    npm audit --short
    Write-Host ""
    Write-Host "  Ejecutar: npm audit fix" -ForegroundColor Yellow
} else {
    Write-Host "  ✅ No hay vulnerabilidades críticas" -ForegroundColor Green
}

# 4. Verificar node_modules
Write-Host ""
Write-Host "[4] Verificando node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules" -PathType Container) {
    $count = (Get-ChildItem -Path "node_modules" -Recurse -Directory | Measure-Object).Count
    Write-Host "  ✅ node_modules encontrado (~$count directorios)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  node_modules NO encontrado" -ForegroundColor Yellow
    Write-Host "  Ejecutar: npm install" -ForegroundColor Yellow
}

# 5. Verificar estructura de archivos
Write-Host ""
Write-Host "[5] Verificando estructura del proyecto..." -ForegroundColor Yellow
$requiredDirs = @("src", "src\screens", "src\components", "src\context", "src\utils", "src\data")
foreach ($dir in $requiredDirs) {
    if (Test-Path $dir -PathType Container) {
        Write-Host "  ✅ $dir encontrado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $dir NO encontrado" -ForegroundColor Red
    }
}

# 6. Verificar archivos clave
Write-Host ""
Write-Host "[6] Verificando archivos clave..." -ForegroundColor Yellow
$requiredFiles = @("package.json", "vite.config.js", "tailwind.config.js", "src\main.jsx", "src\AppAdmin.jsx")
foreach ($file in $requiredFiles) {
    if (Test-Path $file -PathType Leaf) {
        Write-Host "  ✅ $file encontrado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file NO encontrado" -ForegroundColor Red
    }
}

# 7. Verificar documentación
Write-Host ""
Write-Host "[7] Verificando documentación..." -ForegroundColor Yellow
$docs = @("INDEX.md", "QUICK_START.md", "TESTING_GUIDE.md", "PRESENTATION_GUIDE.md")
foreach ($doc in $docs) {
    if (Test-Path $doc -PathType Leaf) {
        Write-Host "  ✅ $doc encontrado" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  $doc NO encontrado (opcional)" -ForegroundColor Yellow
    }
}

# 8. Verificar Git
Write-Host ""
Write-Host "[8] Verificando Git..." -ForegroundColor Yellow
if (Test-Path ".git" -PathType Container) {
    try {
        $commits = git log --oneline | Measure-Object -Line | Select-Object -ExpandProperty Lines
        Write-Host "  ✅ Repositorio Git encontrado ($commits commits)" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️  Git NO funciona correctamente" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠️  Git NO inicializado (opcional)" -ForegroundColor Yellow
}

# 9. Verificar puerto disponible
Write-Host ""
Write-Host "[9] Verificando puerto 5173..." -ForegroundColor Yellow
$portInUse = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "  ⚠️  Puerto 5173 YA ESTÁ EN USO" -ForegroundColor Yellow
    Write-Host "  Ejecutar: npm run dev -- --port 5174" -ForegroundColor Yellow
} else {
    Write-Host "  ✅ Puerto 5173 disponible" -ForegroundColor Green
}

# 10. Build check
Write-Host ""
Write-Host "[10] Verificando build..." -ForegroundColor Yellow
$packageJson = Get-Content package.json
if ($packageJson -match '"build"') {
    Write-Host "  ✅ Script build encontrado en package.json" -ForegroundColor Green
} else {
    Write-Host "  ❌ Script build NO encontrado" -ForegroundColor Red
}

# Resumen final
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ VERIFICACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 SIGUIENTES PASOS:" -ForegroundColor Green
Write-Host ""
Write-Host "   1. npm install           (si no está hecho)" -ForegroundColor White
Write-Host "   2. npm run dev           (inicia servidor)" -ForegroundColor White
Write-Host "   3. Abre navegador:" -ForegroundColor White
Write-Host "      http://localhost:5173/admin/login" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Credenciales:" -ForegroundColor White
Write-Host "   Email:    admin@serfinanza.com" -ForegroundColor Cyan
Write-Host "   Password: admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
