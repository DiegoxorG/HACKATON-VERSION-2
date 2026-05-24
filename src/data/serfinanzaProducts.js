export const serfinanzaProducts = [
  {
    id: 'tarjeta-clasica',
    category: 'Tarjeta de Credito',
    name: 'Tarjeta Clasica',
    tagline: 'Tu primer Credito con Serfinanza',
    color: '#1B3A6B',
    icon: 'CreditCard',
    cupo: '$500.000 - $3.000.000',
    tasa: '26.22% E.A.',
    cuotaManejo: '$18.900 / mes',
    requisitos: [
      'Mayor de 18 anos',
      'Ingresos desde $800.000',
      'Sin reportes negativos en centrales',
      'Antiguedad laboral minima 6 meses'
    ],
    beneficios: [
      '1 punto por cada $1.000 en compras',
      'Seguro de vida hasta $20.000.000',
      'Cuotas sin interes en 200+ comercios',
      'Chip EMV + pago sin contacto NFC'
    ],
    idealFor: ['ingresos bajos', 'primer Credito', 'historial nuevo'],
    minIncome: 800000,
    maxCredits: 2
  },
  {
    id: 'tarjeta-gold',
    category: 'Tarjeta de Credito',
    name: 'Tarjeta Gold',
    tagline: 'Mas cupo, Mas beneficios',
    color: '#B8860B',
    icon: 'CreditCard',
    cupo: 'Hasta $10.000.000',
    tasa: '24.50% E.A.',
    cuotaManejo: '$28.500 / mes',
    requisitos: [
      'Mayor de 18 anos',
      'Ingresos desde $2.000.000',
      'Buen historial crediticio',
      'Antiguedad laboral minima 6 meses'
    ],
    beneficios: [
      '1 punto por cada $1.000 en compras nacionales',
      '1.5 puntos por compras internacionales',
      'Seguro de vida hasta $20.000.000',
      'Diferido en cuotas hasta 24 meses sin interes'
    ],
    idealFor: ['ingresos medios', 'viajes', 'compras grandes'],
    minIncome: 2000000,
    maxCredits: 2
  },
  {
    id: 'tarjeta-platinum',
    category: 'Tarjeta de Credito',
    name: 'Tarjeta Platinum',
    tagline: 'La experiencia financiera premium',
    color: '#4A4A4A',
    icon: 'CreditCard',
    cupo: 'Hasta $30.000.000',
    tasa: '22.00% E.A.',
    cuotaManejo: '$38.000 / mes',
    requisitos: [
      'Mayor de 18 anos',
      'Ingresos desde $5.000.000',
      'Excelente historial crediticio',
      'Antiguedad laboral minima 12 meses'
    ],
    beneficios: [
      'Acceso sala VIP aeropuertos El Dorado y Jose Maria Cordova',
      'Seguro de viaje internacional hasta USD $50.000',
      'Concierge 24/7',
      'Sin comision por conversion de moneda internacional',
      'Proteccion de precio en compras'
    ],
    idealFor: ['altos ingresos', 'viajes frecuentes', 'premium'],
    minIncome: 5000000,
    maxCredits: 1
  },
  {
    id: 'cdt-30',
    category: 'CDT',
    name: 'CDT 30 dias',
    tagline: 'Haz rendir tu dinero en el corto plazo',
    color: '#22C55E',
    icon: 'TrendingUp',
    cupo: 'Desde $500.000',
    tasa: '7.50% - 8.10% E.A.',
    cuotaManejo: 'Sin costo',
    requisitos: [
      'Ser cliente activo Serfinanza',
      'Monto minimo $500.000',
      'Cuenta de debito Serfinanza'
    ],
    beneficios: [
      'Tasa fija garantizada desde el inicio',
      'Protegido por Fogafin hasta $50.000.000',
      'Renovacion automatica disponible',
      'Certificado digital desde la App'
    ],
    idealFor: ['ahorro corto plazo', 'liquidez', 'fondo emergencia'],
    minSavings: 500000,
    minIncome: 0
  },
  {
    id: 'cdt-180',
    category: 'CDT',
    name: 'CDT 180 dias',
    tagline: 'Rentabilidad media con seguridad total',
    color: '#22C55E',
    icon: 'TrendingUp',
    cupo: 'Desde $500.000',
    tasa: '9.20% - 9.80% E.A.',
    cuotaManejo: 'Sin costo',
    requisitos: [
      'Ser cliente activo Serfinanza',
      'Monto minimo $500.000'
    ],
    beneficios: [
      'Una de las mejores tasas del mercado a 6 meses',
      'Intereses pagados al vencimiento o mensualmente',
      'Protegido por Fogafin hasta $50.000.000',
      'Puede usarse como garantia para Creditos'
    ],
    idealFor: ['ahorro mediano plazo', 'metas 6 meses', 'inversion segura'],
    minSavings: 500000,
    minIncome: 0
  },
  {
    id: 'cdt-360',
    category: 'CDT',
    name: 'CDT 360 dias',
    tagline: 'Maxima rentabilidad a un ano',
    color: '#22C55E',
    icon: 'TrendingUp',
    cupo: 'Desde $500.000',
    tasa: '10.00% - 10.60% E.A.',
    cuotaManejo: 'Sin costo',
    requisitos: [
      'Ser cliente activo Serfinanza',
      'Monto minimo $500.000'
    ],
    beneficios: [
      'Hasta 10.60% E.A. para montos mayores a $50M',
      'Renovacion automatica capital + intereses',
      'Aval para Credito de libre inversion',
      'Beneficio tributario: 35% de intereses deducibles en renta'
    ],
    idealFor: ['ahorro largo plazo', 'renta', 'jubilacion'],
    minSavings: 500000,
    minIncome: 0
  },
  {
    id: 'credito-consumo',
    category: 'Credito',
    name: 'Credito de Consumo',
    tagline: 'Financia tus proyectos personales',
    color: '#F5A623',
    icon: 'Banknote',
    cupo: 'Segun perfil crediticio',
    tasa: 'Segun perfil',
    cuotaManejo: 'Sin cuota de manejo',
    requisitos: [
      'Mayor de 18 anos',
      'Ingresos demostrables',
      'Sin reportes negativos activos',
      'Antiguedad laboral minima 6 meses'
    ],
    beneficios: [
      'Libre inversion, vehiculo o compra de cartera',
      'Seguro de vida deudor incluido',
      'Seguro de desempleo opcional',
      'Extracto mensual con historial de pagos',
      'Paz y salvo al finalizar'
    ],
    idealFor: ['deudas altas', 'compra cartera', 'vehiculo', 'libre inversion'],
    minIncome: 800000,
    maxCredits: 3
  },
  {
    id: 'app-serfinanza',
    category: 'Canal Digital',
    name: 'App Serfinanza',
    tagline: 'Tu banco en el bolsillo, 24/7',
    color: '#6366F1',
    icon: 'Smartphone',
    cupo: 'Gratuita',
    tasa: 'Sin costo',
    cuotaManejo: 'Gratis',
    requisitos: [
      'Ser cliente activo Serfinanza',
      'iOS 14+ o Android 8.0+',
      'Celular registrado en el banco'
    ],
    beneficios: [
      'Consulta saldos y movimientos en tiempo real',
      'Transferencias y pagos de servicios',
      'Descarga extractos en PDF',
      'Actualiza datos de contacto sin ir a sucursal',
      'Constituye CDTs desde el celular',
      'Bloquea tu tarjeta en segundos'
    ],
    idealFor: ['todos los clientes', 'digital', 'autogestion'],
    minIncome: 0
  }
]



