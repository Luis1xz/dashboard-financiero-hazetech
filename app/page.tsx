'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Download,
  Eye,
  EyeOff,
  FileCheck2,
  Info,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Plus,
  ReceiptText,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  Users,
  Wallet,
  X,
} from 'lucide-react'

export interface FinancialMovement {
  id: string
  type: 'Ingreso' | 'Egreso'
  concept: string
  amount: number
  category: string
  sourceDestination: string
  justification: string
  date: string
  time: string
  timestamp: number
  registeredBy: 'Luis Alfonso Herrera' | 'Yoinner Gándara'
  status: 'Pendiente' | 'Aprobado' | 'Rechazado'
  approvals: {
    luis: 'Pendiente' | 'Aprobado' | 'Rechazado'
    yoinner: 'Pendiente' | 'Aprobado' | 'Rechazado'
  }
}

// Credenciales fijas de los dos fundadores de HAZE
export const FOUNDERS = [
  {
    id: 'luis',
    name: 'Luis Alfonso Herrera',
    shortName: 'Luis',
    pin: '1206',
    role: 'Co-Founder & Full Stack AI',
    badge: 'Firmante A',
  },
  {
    id: 'yoinner',
    name: 'Yoinner Gándara',
    shortName: 'Yoinner',
    pin: '1205',
    role: 'Co-Founder & AI Architect',
    badge: 'Firmante B',
  },
] as const

type FounderId = 'luis' | 'yoinner'

const INCOME_CATEGORIES = [
  'HazeCard (Tarjetas Inteligentes NFC)',
  'Desarrollo Web & Software',
  'Inteligencia Artificial & Automatización',
  'Negocio Aparte / Proyectos Especiales',
  'Consultoría & Servicios Tech',
  'Inversión / Capital de Socios',
  'Otros Ingresos',
]

const EXPENSE_CATEGORIES = [
  'Producción HazeCard NFC',
  'Infraestructura Cloud & Servidores',
  'Marketing & Pauta Publicitaria',
  'Herramientas, Licencias & APIs',
  'Nómina & Honorarios',
  'Gastos Operativos & Oficina',
  'Negocio Aparte (Costos Operativos)',
  'Otros Gastos',
]

const SOURCES_DESTINATIONS = [
  'Bancolombia HAZE Empresarial',
  'Tarjeta Débito Corporativa',
  'Pasarela Stripe Haze',
  'Cuenta de Ahorros Operativa',
  'Caja Menor Barranquilla',
  'Efectivo / Transferencia Directa',
  'Crypto / USDT Wallet',
]

export default function Page() {
  // Autenticación de fundador
  const [currentUser, setCurrentUser] = useState<FounderId | null>(null)
  const [pinInput, setPinInput] = useState('')
  const [selectedFounderForLogin, setSelectedFounderForLogin] = useState<FounderId>('luis')
  const [loginError, setLoginError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Navegación
  const [activeTab, setActiveTab] = useState<'resumen' | 'movimientos' | 'aprobaciones' | 'reportes' | 'configuracion'>('resumen')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  // Lista de movimientos financieros
  const [movements, setMovements] = useState<FinancialMovement[]>([])

  // Filtros
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'Ingreso' | 'Egreso'>('Todos')
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Formulario nuevo movimiento (Sin pedir fecha ni hora: se toman automáticamente)
  const [formData, setFormData] = useState({
    type: 'Ingreso' as 'Ingreso' | 'Egreso',
    concept: '',
    amount: '',
    category: INCOME_CATEGORIES[0],
    sourceDestination: SOURCES_DESTINATIONS[0],
    justification: '',
  })

  // Reloj en tiempo real para mostrar en el modal
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState('')

  useEffect(() => {
    setIsClient(true)
    const savedUser = localStorage.getItem('haze_founder_auth') as FounderId | null
    if (savedUser && (savedUser === 'luis' || savedUser === 'yoinner')) {
      setCurrentUser(savedUser)
    }
    const savedMovements = localStorage.getItem('haze_movements_data')
    if (savedMovements) {
      try {
        setMovements(JSON.parse(savedMovements))
      } catch {
        // En caso de datos corruptos
      }
    }

    const timer = setInterval(() => {
      const d = new Date()
      setCurrentTimeDisplay(
        d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ' · ' +
        d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Persistir movimientos en localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('haze_movements_data', JSON.stringify(movements))
    }
  }, [movements, isClient])

  // Cambiar categoría por defecto al cambiar el tipo
  useEffect(() => {
    if (formData.type === 'Ingreso') {
      setFormData(prev => ({ ...prev, category: INCOME_CATEGORIES[0] }))
    } else {
      setFormData(prev => ({ ...prev, category: EXPENSE_CATEGORIES[0] }))
    }
  }, [formData.type])

  function notify(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3200)
  }

  // Formateador de moneda en Pesos Colombianos (COP)
  function formatCOP(val: number) {
    return `$ ${val.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP`
  }

  // Login con PIN
  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const targetFounder = FOUNDERS.find(f => f.id === selectedFounderForLogin)
    if (!targetFounder) return

    if (pinInput === targetFounder.pin) {
      setCurrentUser(targetFounder.id)
      localStorage.setItem('haze_founder_auth', targetFounder.id)
      setPinInput('')
      setLoginError(false)
      notify(`Bienvenido, ${targetFounder.shortName} · Acceso de fundador verificado`)
    } else {
      setLoginError(true)
      notify('PIN incorrecto. Acceso mancomunado restringido.')
    }
  }

  function handleLogout() {
    setCurrentUser(null)
    localStorage.removeItem('haze_founder_auth')
    setPinInput('')
    notify('Sesión cerrada. Sistema asegurado con PIN.')
  }

  // REGLA CRUCIAL:
  // "necesita aprobación de ambos para poder verse y que se ponga"
  // Solo los movimientos aprobados por Luis Y por Yoinner entran al balance y al resumen general.
  const approvedMovements = useMemo(() => {
    return movements.filter(m => m.status === 'Aprobado' && m.approvals.luis === 'Aprobado' && m.approvals.yoinner === 'Aprobado')
  }, [movements])

  const pendingMovements = useMemo(() => {
    return movements.filter(m => m.status === 'Pendiente')
  }, [movements])

  const totalIncome = useMemo(() => {
    return approvedMovements
      .filter(m => m.type === 'Ingreso')
      .reduce((acc, m) => acc + m.amount, 0)
  }, [approvedMovements])

  const totalExpense = useMemo(() => {
    return approvedMovements
      .filter(m => m.type === 'Egreso')
      .reduce((acc, m) => acc + m.amount, 0)
  }, [approvedMovements])

  const balance = useMemo(() => {
    return totalIncome - totalExpense
  }, [totalIncome, totalExpense])

  // Filtrado de movimientos (para pestaña de ingresos y egresos)
  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      const matchType = typeFilter === 'Todos' || m.type === typeFilter
      const matchCategory = categoryFilter === 'Todas' || m.category === categoryFilter
      const matchSearch =
        searchQuery.trim() === '' ||
        m.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sourceDestination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.justification.toLowerCase().includes(searchQuery.toLowerCase())
      return matchType && matchCategory && matchSearch
    })
  }, [movements, typeFilter, categoryFilter, searchQuery])

  // Distribución porcentual en Pesos
  const categoryDistribution = useMemo(() => {
    const expensesByCategory: Record<string, number> = {}
    approvedMovements.filter(m => m.type === 'Egreso').forEach(m => {
      expensesByCategory[m.category] = (expensesByCategory[m.category] || 0) + m.amount
    })

    return [
      { name: 'Hardware HazeCard NFC', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Producción HazeCard NFC'] || 0) / totalExpense) * 100) : 0, dot: 'bg-fuchsia-500' },
      { name: 'Cloud & Servidores', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Infraestructura Cloud & Servidores'] || 0) / totalExpense) * 100) : 0, dot: 'bg-violet-500' },
      { name: 'Marketing & Pauta', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Marketing & Pauta Publicitaria'] || 0) / totalExpense) * 100) : 0, dot: 'bg-purple-400' },
      { name: 'Nómina & Honorarios', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Nómina & Honorarios'] || 0) / totalExpense) * 100) : 0, dot: 'bg-pink-500' },
      { name: 'Otros Rubros', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Otros Gastos'] || 0) / totalExpense) * 100) : 0, dot: 'bg-zinc-500' },
    ]
  }, [approvedMovements, totalExpense])

  // Registro de nuevo movimiento (Fecha y Hora AUTOMÁTICAS)
  function handleCreateMovement(e: React.FormEvent) {
    e.preventDefault()

    if (!currentUser) {
      notify('Debes estar autenticado para registrar movimientos.')
      return
    }

    if (!formData.concept.trim()) {
      notify('Indica la descripción o concepto del movimiento.')
      return
    }

    const numAmount = parseFloat(formData.amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      notify('El monto en pesos debe ser mayor a cero.')
      return
    }

    if (!formData.justification.trim()) {
      notify('Por favor agrega la justificación de la operación.')
      return
    }

    const currentFounderObj = FOUNDERS.find(f => f.id === currentUser)!
    const now = new Date()

    // Fecha y hora registradas AUTOMÁTICAMENTE al segundo exacto
    const autoDate = now.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const autoTime = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })

    // Quien lo crea lo pre-aprueba con su firma; el otro socio debe aprobar para que se ponga en el balance
    const isLuis = currentUser === 'luis'
    const newMovement: FinancialMovement = {
      id: 'HAZE-' + Math.floor(100000 + Math.random() * 900000),
      type: formData.type,
      concept: formData.concept.trim(),
      amount: numAmount,
      category: formData.category,
      sourceDestination: formData.sourceDestination,
      justification: formData.justification.trim(),
      date: autoDate,
      time: autoTime,
      timestamp: now.getTime(),
      registeredBy: currentFounderObj.name as any,
      status: 'Pendiente',
      approvals: {
        luis: isLuis ? 'Aprobado' : 'Pendiente',
        yoinner: !isLuis ? 'Aprobado' : 'Pendiente',
      },
    }

    setMovements(prev => [newMovement, ...prev])
    setShowModal(false)
    setFormData({
      type: 'Ingreso',
      concept: '',
      amount: '',
      category: INCOME_CATEGORIES[0],
      sourceDestination: SOURCES_DESTINATIONS[0],
      justification: '',
    })

    const otherFounder = isLuis ? 'Yoinner Gándara (1205)' : 'Luis Alfonso Herrera (1206)'
    notify(`Movimiento registrado a las ${autoTime}. Pendiente de la firma de ${otherFounder} para impactar el balance.`)
  }

  // Firmar Aprobación
  function handleApprove(id: string, founderId: FounderId) {
    if (currentUser !== founderId) {
      const reqName = founderId === 'luis' ? 'Luis Alfonso Herrera (PIN 1206)' : 'Yoinner Gándara (PIN 1205)'
      notify(`Para firmar esta aprobación debes cambiar de usuario e ingresar como ${reqName}.`)
      return
    }

    setMovements(prev =>
      prev.map(m => {
        if (m.id !== id) return m
        const newApprovals = {
          ...m.approvals,
          [founderId]: 'Aprobado' as const,
        }
        // Requiere aprobación de AMBOS para poder verse e impactar el balance
        const bothApproved = newApprovals.luis === 'Aprobado' && newApprovals.yoinner === 'Aprobado'
        return {
          ...m,
          approvals: newApprovals,
          status: bothApproved ? 'Aprobado' : 'Pendiente',
        }
      })
    )

    const founderName = founderId === 'luis' ? 'Luis Alfonso' : 'Yoinner'
    notify(`Firma de ${founderName} registrada exitosamente.`)
  }

  // Rechazar
  function handleReject(id: string, founderId: FounderId) {
    if (currentUser !== founderId) {
      const reqName = founderId === 'luis' ? 'Luis Alfonso Herrera' : 'Yoinner Gándara'
      notify(`Debes haber iniciado sesión como ${reqName} para rechazar esta operación.`)
      return
    }

    setMovements(prev =>
      prev.map(m => {
        if (m.id !== id) return m
        return {
          ...m,
          approvals: {
            ...m.approvals,
            [founderId]: 'Rechazado' as const,
          },
          status: 'Rechazado' as const,
        }
      })
    )
    notify(`Movimiento rechazado. No se sumará al balance.`)
  }

  // Exportar reporte
  function exportCSV() {
    if (approvedMovements.length === 0) {
      notify('No hay movimientos aprobados por ambos fundadores para exportar.')
      return
    }
    const headers = ['ID,Tipo,Concepto,Monto_COP,Categoria,Origen_Destino,Justificacion,Fecha,Hora,Registrado_Por,Estado\n']
    const rows = approvedMovements.map(
      m =>
        `"${m.id}","${m.type}","${m.concept}","${m.amount}","${m.category}","${m.sourceDestination}","${m.justification}","${m.date}","${m.time}","${m.registeredBy}","${m.status}"`
    )
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `haze-balance-cop-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    notify('Reporte financiero en Pesos (COP) exportado.')
  }

  // PANTALLA DE ACCESO CON PIN (Si no hay usuario activo)
  if (!currentUser) {
    return (
      <div className="relative min-h-screen bg-[#050508] text-[#f4f4f7] flex items-center justify-center p-4 selection:bg-purple-600/30">
        {/* Glow de fondo Hazetech */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-purple-900/20 via-fuchsia-950/15 to-transparent blur-[140px]" />
        </div>

        <div className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-white/[0.08] bg-[#0c0d16]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(147,51,234,0.15)] space-y-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="size-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(147,51,234,0.4)]">
              <Sparkles size={28} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">HAZE</span>
                <span className="size-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" />
                <span className="text-xs font-bold text-zinc-400">FINANCE</span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
                Founder OS · Acceso Seguro Mancomunado
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-400">
            Selecciona tu usuario de fundador e ingresa tu PIN de seguridad para acceder y firmar operaciones financieras en Pesos (COP).
          </p>

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            {/* Selección de Fundador */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Identidad de Fundador
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {FOUNDERS.map(founder => (
                  <button
                    key={founder.id}
                    type="button"
                    onClick={() => {
                      setSelectedFounderForLogin(founder.id)
                      setPinInput('')
                      setLoginError(false)
                    }}
                    className={`p-3 rounded-2xl border text-left transition ${
                      selectedFounderForLogin === founder.id
                        ? 'border-purple-500 bg-purple-950/30 text-white shadow-[0_0_15px_rgba(147,51,234,0.2)]'
                        : 'border-white/[0.06] bg-black/40 text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <p className="text-xs font-black">{founder.shortName}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{founder.badge}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Input de PIN */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  PIN de Acceso (4 dígitos)
                </label>
                <span className="text-[10px] text-purple-400 font-semibold">
                  {selectedFounderForLogin === 'luis' ? 'Clave: 1206 (Luis)' : 'Clave: 1205 (Yoinner)'}
                </span>
              </div>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  maxLength={4}
                  required
                  autoFocus
                  value={pinInput}
                  onChange={e => {
                    setPinInput(e.target.value)
                    setLoginError(false)
                  }}
                  placeholder="••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-black/60 text-center tracking-[0.5em] text-lg font-black text-white focus:outline-none transition ${
                    loginError ? 'border-rose-500 text-rose-400 animate-shake' : 'border-white/[0.1] focus:border-purple-500'
                  }`}
                />
              </div>
              {loginError && (
                <p className="text-[11px] text-rose-400 font-bold mt-1.5 flex items-center gap-1">
                  <ShieldAlert size={12} /> PIN incorrecto para {selectedFounderForLogin === 'luis' ? 'Luis' : 'Yoinner'}.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:opacity-95 text-white text-xs font-black shadow-[0_0_20px_rgba(147,51,234,0.4)] transition active:scale-[0.98]"
            >
              Desbloquear Dashboard Financiero
            </button>
          </form>

          <div className="pt-2 border-t border-white/[0.06] text-[10px] text-zinc-400">
            Protocolo de doble aprobación activo · hazetech.co
          </div>
        </div>
      </div>
    )
  }

  const activeFounderObj = FOUNDERS.find(f => f.id === currentUser)!

  return (
    <div className="relative flex min-h-screen bg-[#050508] text-[#f4f4f7] selection:bg-purple-600/30 selection:text-purple-200">
      {/* Fondo estético Hazetech */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-purple-900/15 via-fuchsia-950/10 to-transparent blur-[140px]" />
        <div className="absolute top-[60%] -left-[20%] w-[600px] h-[600px] bg-purple-950/10 blur-[160px]" />
        <div className="absolute top-[40%] -right-[20%] w-[600px] h-[600px] bg-fuchsia-950/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Sidebar fijo en escritorio */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-white/[0.08] bg-[#07080f]/85 backdrop-blur-xl lg:flex">
        {/* Logo HAZE */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white">HAZE</span>
              <span className="size-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" />
              <span className="text-xs font-bold text-zinc-400">FINANCE</span>
            </div>
            <p className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400">Founder OS · COP ($)</p>
          </div>
        </div>

        {/* Menú de Navegación */}
        <div className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Control Financiero</p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('resumen')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'resumen'
                    ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.15)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard size={17} className={activeTab === 'resumen' ? 'text-violet-400' : 'text-zinc-400'} />
                  <span>Resumen</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('movimientos')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'movimientos'
                    ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.15)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ReceiptText size={17} className={activeTab === 'movimientos' ? 'text-violet-400' : 'text-zinc-400'} />
                  <span>Ingresos y Egresos</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('aprobaciones')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'aprobaciones'
                    ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.15)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileCheck2 size={17} className={activeTab === 'aprobaciones' ? 'text-violet-400' : 'text-zinc-400'} />
                  <span>Pendientes de Aprobación</span>
                </div>
                {pendingMovements.length > 0 && (
                  <span className="flex items-center justify-center size-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                    {pendingMovements.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          <div>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Reportería</p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('reportes')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'reportes'
                    ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.15)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <BarChart3 size={17} className={activeTab === 'reportes' ? 'text-violet-400' : 'text-zinc-400'} />
                <span>Reportes Financieros</span>
              </button>

              <button
                onClick={() => setActiveTab('configuracion')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'configuracion'
                    ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.15)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Settings2 size={17} className={activeTab === 'configuracion' ? 'text-violet-400' : 'text-zinc-400'} />
                <span>Configuración & Claves</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Perfil del Fundador Autenticado */}
        <div className="p-4 border-t border-white/[0.06] bg-[#090a12]/70 space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/[0.08] bg-[#0c0d16]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-xs font-black text-white">
                {activeFounderObj.shortName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{activeFounderObj.name}</p>
                <p className="text-[10px] text-purple-400 font-semibold truncate">{activeFounderObj.badge}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/[0.05] transition"
              title="Cambiar de fundador / Bloquear con PIN"
            >
              <LogOut size={15} />
            </button>
          </div>

          <div className="flex items-center justify-between px-1 text-[10px] text-zinc-400">
            <span>Sesión verificada: PIN {activeFounderObj.pin}</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Activo
            </span>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="relative flex-1 lg:pl-[260px] flex flex-col min-w-0 z-10">
        {/* Header superior */}
        <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-white/[0.08] bg-[#050508]/85 px-4 md:px-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  {currentTimeDisplay || 'Cargando hora...'}
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-white">
                Dashboard Financiero <span className="text-purple-400">HAZE</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Indicador de Fundador Activo */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs">
              <UserCheck size={14} className="text-violet-400" />
              <span className="font-bold text-white">{activeFounderObj.shortName}</span>
              <span className="text-[10px] text-zinc-400">({activeFounderObj.badge})</span>
              <button
                onClick={handleLogout}
                className="ml-1 text-[10px] text-purple-400 hover:underline"
              >
                Cambiar
              </button>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-black shadow-[0_0_20px_rgba(147,51,234,0.35)] transition active:scale-[0.98]"
            >
              <Plus size={16} />
              <span>Nuevo movimiento</span>
            </button>
          </div>
        </header>

        {/* VISTAS PRINCIPALES */}
        <main className="flex-1 p-4 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
          {/* SECCIÓN 1: RESUMEN (Solo muestra movimientos con doble aprobación completada) */}
          {activeTab === 'resumen' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Hero Banner */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 rounded-full border border-purple-500/30 bg-purple-950/30 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                    <ShieldCheck size={12} className="text-fuchsia-400" />
                    Regla Mancomunada: Requiere Aprobación de Ambos (Luis & Yoinner)
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                    Finanzas en Pesos Colombianos <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">(COP)</span>
                  </h2>
                  <p className="mt-1 text-xs md:text-sm text-zinc-400 max-w-xl">
                    Cada ingreso y egreso solo se refleja en el balance tras la firma de Luis (1206) y Yoinner (1205).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-semibold text-zinc-300 hover:text-white transition"
                  >
                    {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{showBalance ? 'Ocultar balance' : 'Mostrar balance'}</span>
                  </button>
                </div>
              </div>

              {/* Métricas Principales en PESOS (COP) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Balance Disponible */}
                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 hover:border-violet-500/30 transition shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Balance disponible</p>
                    <div className="p-2 rounded-xl bg-violet-950/40 border border-violet-500/20 text-violet-400">
                      <Wallet size={18} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {showBalance ? formatCOP(balance) : '••••••••'}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-400 flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      {approvedMovements.length === 0
                        ? '0 movimientos con doble firma'
                        : `${approvedMovements.length} conciliados por ambos`}
                    </p>
                  </div>
                </div>

                {/* Ingresos Aprobados */}
                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 hover:border-emerald-500/30 transition shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Ingresos aprobados</p>
                    <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">
                      {showBalance ? formatCOP(totalIncome) : '••••••••'}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-400">
                      {approvedMovements.filter(m => m.type === 'Ingreso').length} ingresos validados por ambos
                    </p>
                  </div>
                </div>

                {/* Egresos Aprobados */}
                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 hover:border-rose-500/30 transition shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Egresos aprobados</p>
                    <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-400">
                      <ArrowDownRight size={18} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xl sm:text-2xl font-black text-rose-400 tracking-tight">
                      {showBalance ? formatCOP(totalExpense) : '••••••••'}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-400">
                      {approvedMovements.filter(m => m.type === 'Egreso').length} egresos autorizados
                    </p>
                  </div>
                </div>

                {/* Pendientes de Doble Aprobación */}
                <div
                  onClick={() => setActiveTab('aprobaciones')}
                  className="p-5 rounded-2xl border border-amber-500/30 bg-[#0c0d16]/90 hover:border-amber-400 transition shadow-lg relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Pendientes de Firma</p>
                    <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/20 text-amber-400">
                      <ShieldAlert size={18} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
                      {pendingMovements.length < 10 ? `0${pendingMovements.length}` : pendingMovements.length}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-400">
                      {pendingMovements.length === 0
                        ? 'Todo conciliado al 100%'
                        : 'Clic para revisar y firmar'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gráficos: Flujo en COP & Distribución */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-white">Flujo de Caja en Pesos (COP)</p>
                      <p className="text-xs text-zinc-400">Ingresos vs. Egresos con doble firma</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-violet-400">
                        <span className="size-2 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
                        <span>Ingresos</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-fuchsia-400">
                        <span className="size-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" />
                        <span>Egresos</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 pb-2">
                    <div className="flex items-end justify-between gap-3 h-[200px] border-b border-white/[0.08] px-2">
                      {['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct'].map(month => {
                        const isCurrent = month === 'Oct'
                        const incomeHeight = isCurrent && totalIncome > 0 ? 'h-32' : 'h-3'
                        const expenseHeight = isCurrent && totalExpense > 0 ? 'h-24' : 'h-3'
                        return (
                          <div key={month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                            <div className="flex items-end gap-1.5 h-full">
                              <div
                                className={`w-3.5 sm:w-4 rounded-t-md bg-gradient-to-t from-violet-600 to-indigo-500 transition-all ${incomeHeight} group-hover:brightness-125`}
                                title={`Ingresos ${month}: ${isCurrent ? formatCOP(totalIncome) : '$ 0 COP'}`}
                              />
                              <div
                                className={`w-3.5 sm:w-4 rounded-t-md bg-gradient-to-t from-fuchsia-600 to-pink-500 transition-all ${expenseHeight} group-hover:brightness-125`}
                                title={`Egresos ${month}: ${isCurrent ? formatCOP(totalExpense) : '$ 0 COP'}`}
                              />
                            </div>
                            <span className={`text-[11px] font-semibold ${isCurrent ? 'text-violet-400 font-bold' : 'text-zinc-400'}`}>
                              {month}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 text-center">
                    {approvedMovements.length === 0
                      ? 'Sin movimientos aprobados. Para verse en este gráfico se requiere la firma de Luis y Yoinner.'
                      : 'Gráfico calculado exclusivamente sobre operaciones con doble firma aprobada.'}
                  </p>
                </div>

                {/* Donut de Distribución */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-white">Distribución de Gastos</p>
                        <p className="text-xs text-zinc-400">Porcentajes en Pesos (COP)</p>
                      </div>
                      <CircleDollarSign size={20} className="text-fuchsia-400" />
                    </div>

                    <div className="my-6 flex items-center justify-center">
                      <div className="relative flex size-[150px] items-center justify-center rounded-full bg-gradient-to-tr from-violet-600/20 via-fuchsia-600/20 to-purple-600/10 p-3 border border-white/[0.08]">
                        <div className="flex size-full flex-col items-center justify-center rounded-full bg-[#07080f] border border-white/[0.06] shadow-inner text-center">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Gastos</span>
                          <span className="text-xs font-black text-white px-2 truncate max-w-full">
                            {formatCOP(totalExpense)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {categoryDistribution.map(cat => (
                        <div key={cat.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-zinc-300">
                            <span className={`size-2.5 rounded-full ${cat.dot}`} />
                            <span className="truncate max-w-[140px]">{cat.name}</span>
                          </div>
                          <span className="font-bold text-white">{cat.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-[11px] text-zinc-400">
                    Líneas de ingreso configuradas: HazeCard NFC, Software Web, Negocio Aparte e Inteligencia Artificial.
                  </div>
                </div>
              </div>

              {/* Actividad Reciente (Solo aprobados por ambos para cumplir la regla) */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 overflow-hidden">
                <div className="p-5 md:p-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black text-white">Movimientos Aprobados por Ambos</h3>
                    <p className="text-xs text-zinc-400">Operaciones con doble firma que impactan el balance en Pesos (COP)</p>
                  </div>

                  <button
                    onClick={() => setActiveTab('aprobaciones')}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5"
                  >
                    <span>Ver {pendingMovements.length} pendientes de firma</span> →
                  </button>
                </div>

                {approvedMovements.length === 0 ? (
                  <div className="py-16 px-4 text-center">
                    <ReceiptText size={28} className="mx-auto text-zinc-400 mb-3" />
                    <p className="text-sm font-bold text-white">No hay movimientos aprobados por ambos aún</p>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                      Para que una operación aparezca en el balance y en este listado, tanto Luis Alfonso (1206) como Yoinner (1205) deben dar su firma de aprobación.
                    </p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-bold transition"
                    >
                      <Plus size={14} /> Registrar nuevo movimiento
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#080911] text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-white/[0.06]">
                        <tr>
                          <th className="px-6 py-3.5">Concepto</th>
                          <th className="px-4 py-3.5">Categoría</th>
                          <th className="px-4 py-3.5">Origen / Destino</th>
                          <th className="px-4 py-3.5">Firmas</th>
                          <th className="px-6 py-3.5 text-right">Monto (COP)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {approvedMovements.map(item => (
                          <tr key={item.id} className="hover:bg-white/[0.02] transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                                    item.type === 'Ingreso'
                                      ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                                      : 'bg-rose-950/50 text-rose-400 border border-rose-500/30'
                                  }`}
                                >
                                  {item.type === 'Ingreso' ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                                </span>
                                <div>
                                  <p className="font-bold text-white">{item.concept}</p>
                                  <p className="text-[10px] text-zinc-400">
                                    {item.date} · {item.time} (Registrado automáticamente)
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-zinc-300">{item.category}</td>
                            <td className="px-4 py-4 text-zinc-400">{item.sourceDestination}</td>
                            <td className="px-4 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                                <Check size={12} /> Luis & Yoinner (Doble Firma)
                              </span>
                            </td>
                            <td
                              className={`px-6 py-4 text-right font-black text-sm ${
                                item.type === 'Ingreso' ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {item.type === 'Ingreso' ? '+' : '-'} {formatCOP(item.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECCIÓN 2: INGRESOS Y EGRESOS (Todos los movimientos con detalle) */}
          {activeTab === 'movimientos' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90">
                <div>
                  <h2 className="text-xl font-black text-white">Registro de Ingresos y Egresos (COP)</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Historial de todas las solicitudes creadas, estado de aprobación y registro exacto por hora.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-xs font-semibold text-zinc-200 transition"
                  >
                    <Download size={15} />
                    <span>Exportar Aprobados (CSV)</span>
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg transition"
                  >
                    <Plus size={15} />
                    <span>Nuevo Movimiento</span>
                  </button>
                </div>
              </div>

              {/* Filtros */}
              <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/70 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar por concepto, categoría o justificación..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center rounded-xl border border-white/[0.08] bg-black/40 p-1">
                    {(['Todos', 'Ingreso', 'Egreso'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setTypeFilter(tab)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          typeFilter === tab ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Listado */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 overflow-hidden">
                {filteredMovements.length === 0 ? (
                  <div className="py-20 px-4 text-center">
                    <ReceiptText size={32} className="mx-auto text-zinc-400 mb-3" />
                    <p className="text-sm font-bold text-white">No hay movimientos registrados</p>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                      Registra una nueva operación financiera y ambas firmas (Luis y Yoinner) serán solicitadas.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#080911] text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-white/[0.06]">
                        <tr>
                          <th className="px-6 py-3.5">ID / Hora Exacta</th>
                          <th className="px-4 py-3.5">Concepto & Justificación</th>
                          <th className="px-4 py-3.5">Categoría</th>
                          <th className="px-4 py-3.5">Origen / Destino</th>
                          <th className="px-4 py-3.5">Registrado Por</th>
                          <th className="px-4 py-3.5">Doble Firma</th>
                          <th className="px-6 py-3.5 text-right">Monto (COP)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {filteredMovements.map(m => (
                          <tr key={m.id} className="hover:bg-white/[0.02] transition">
                            <td className="px-6 py-4">
                              <p className="font-mono text-[11px] font-bold text-violet-400">{m.id}</p>
                              <p className="text-[10px] text-zinc-400">{m.date} · {m.time}</p>
                            </td>
                            <td className="px-4 py-4 max-w-xs">
                              <p className="font-bold text-white">{m.concept}</p>
                              <p className="text-[11px] text-zinc-400 truncate mt-0.5">{m.justification}</p>
                            </td>
                            <td className="px-4 py-4 text-zinc-300 font-semibold">{m.category}</td>
                            <td className="px-4 py-4 text-zinc-400">{m.sourceDestination}</td>
                            <td className="px-4 py-4 text-zinc-300">{m.registeredBy}</td>
                            <td className="px-4 py-4">
                              <div className="space-y-1">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    m.status === 'Aprobado'
                                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                                      : m.status === 'Rechazado'
                                      ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                                      : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                                  }`}
                                >
                                  {m.status}
                                </span>
                                <p className="text-[10px] text-zinc-400">
                                  Luis: <b className={m.approvals.luis === 'Aprobado' ? 'text-emerald-400' : 'text-amber-400'}>{m.approvals.luis}</b> | Yoinner: <b className={m.approvals.yoinner === 'Aprobado' ? 'text-emerald-400' : 'text-amber-400'}>{m.approvals.yoinner}</b>
                                </p>
                              </div>
                            </td>
                            <td
                              className={`px-6 py-4 text-right font-black text-sm ${
                                m.type === 'Ingreso' ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {m.type === 'Ingreso' ? '+' : '-'} {formatCOP(m.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECCIÓN 3: PENDIENTES DE APROBACIÓN */}
          {activeTab === 'aprobaciones' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full border border-amber-500/30 bg-amber-950/30 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    <Lock size={12} /> Requiere Ambas Firmas (Luis Alfonso 1206 & Yoinner 1205)
                  </div>
                  <h2 className="text-xl font-black text-white">Centro de Doble Aprobación</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Estás conectado como <b className="text-purple-300">{activeFounderObj.name}</b>. Puedes firmar tus aprobaciones correspondientes.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-bold text-zinc-300">
                    {pendingMovements.length} por validar
                  </span>
                </div>
              </div>

              {pendingMovements.length === 0 ? (
                <div className="py-20 px-4 text-center rounded-2xl border border-white/[0.08] bg-[#0c0d16]/60">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 mb-3">
                    <CheckCircle2 size={28} />
                  </div>
                  <p className="text-base font-bold text-white">No hay operaciones pendientes de firma</p>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                    Todos los ingresos y egresos registrados ya cuentan con la aprobación mutua de Luis y Yoinner, por lo que están visibles en el balance.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingMovements.map(item => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 space-y-4 shadow-lg hover:border-violet-500/30 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-[10px] text-zinc-400">{item.id} · {item.date} {item.time}</span>
                          <h3 className="text-sm font-black text-white mt-0.5">{item.concept}</h3>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                            item.type === 'Ingreso'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {item.type === 'Ingreso' ? '+' : '-'} {formatCOP(item.amount)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04] space-y-1.5 text-xs">
                        <div className="flex justify-between text-zinc-400">
                          <span>Categoría:</span>
                          <span className="font-semibold text-zinc-200">{item.category}</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Origen / Destino:</span>
                          <span className="font-semibold text-zinc-200">{item.sourceDestination}</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Solicitado por:</span>
                          <span className="font-semibold text-violet-300">{item.registeredBy}</span>
                        </div>
                        <div className="pt-1.5 border-t border-white/[0.06]">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Justificación:</p>
                          <p className="text-[11px] text-zinc-300 mt-0.5 italic">&ldquo;{item.justification}&rdquo;</p>
                        </div>
                      </div>

                      {/* Firmas requeridas */}
                      <div className="pt-2 border-t border-white/[0.06] space-y-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          Control de Aprobación Mancomunada
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {/* Firma Luis Alfonso */}
                          <div className={`p-2.5 rounded-xl border ${currentUser === 'luis' ? 'border-purple-500/40 bg-purple-950/20' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[11px] font-bold text-white">Luis Alfonso (1206)</p>
                              {currentUser === 'luis' && <span className="text-[9px] text-purple-400 font-bold">Tú</span>}
                            </div>
                            {item.approvals.luis === 'Aprobado' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                <Check size={12} /> Aprobado
                              </span>
                            ) : currentUser === 'luis' ? (
                              <div className="flex gap-1.5 mt-2">
                                <button
                                  onClick={() => handleApprove(item.id, 'luis')}
                                  className="flex-1 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition"
                                >
                                  Firmar Aprobación
                                </button>
                                <button
                                  onClick={() => handleReject(item.id, 'luis')}
                                  className="px-2 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 font-bold text-[10px] transition"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-amber-400 italic">Pendiente de Luis</span>
                            )}
                          </div>

                          {/* Firma Yoinner */}
                          <div className={`p-2.5 rounded-xl border ${currentUser === 'yoinner' ? 'border-purple-500/40 bg-purple-950/20' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[11px] font-bold text-white">Yoinner (1205)</p>
                              {currentUser === 'yoinner' && <span className="text-[9px] text-purple-400 font-bold">Tú</span>}
                            </div>
                            {item.approvals.yoinner === 'Aprobado' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                <Check size={12} /> Aprobado
                              </span>
                            ) : currentUser === 'yoinner' ? (
                              <div className="flex gap-1.5 mt-2">
                                <button
                                  onClick={() => handleApprove(item.id, 'yoinner')}
                                  className="flex-1 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition"
                                >
                                  Firmar Aprobación
                                </button>
                                <button
                                  onClick={() => handleReject(item.id, 'yoinner')}
                                  className="px-2 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 font-bold text-[10px] transition"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-amber-400 italic">Pendiente de Yoinner</span>
                            )}
                          </div>
                        </div>

                        {/* Indicador para cambiar de usuario si se requiere la otra firma */}
                        {((currentUser === 'luis' && item.approvals.yoinner === 'Pendiente') ||
                          (currentUser === 'yoinner' && item.approvals.luis === 'Pendiente')) && (
                          <div className="text-[10px] text-zinc-400 text-center pt-1">
                            Falta la firma de {currentUser === 'luis' ? 'Yoinner Gándara' : 'Luis Alfonso Herrera'}.{' '}
                            <button
                              onClick={handleLogout}
                              className="text-purple-400 font-bold hover:underline"
                            >
                              Cambiar usuario (PIN)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECCIÓN 4: REPORTES */}
          {activeTab === 'reportes' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white">Reportes Financieros · Haze Technologies</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Consolidado de operaciones con doble aprobación expresadas en Pesos Colombianos (COP).
                  </p>
                </div>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg transition"
                >
                  <Download size={15} />
                  <span>Descargar Balance (CSV)</span>
                </button>
              </div>

              {/* KPIs de Rendimiento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Margen Operativo Neto</p>
                  <p className="text-2xl font-black text-white mt-2">
                    {totalIncome > 0 ? `${(((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)}%` : '0.0%'}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">Margen real sobre ingresos aprobados</p>
                </div>

                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Ingresos COP</p>
                  <p className="text-2xl font-black text-emerald-400 mt-2">{formatCOP(totalIncome)}</p>
                  <p className="text-[11px] text-zinc-400 mt-1">Validado por ambos fundadores</p>
                </div>

                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Egresos COP</p>
                  <p className="text-2xl font-black text-rose-400 mt-2">{formatCOP(totalExpense)}</p>
                  <p className="text-[11px] text-zinc-400 mt-1">Costos y operaciones aprobadas</p>
                </div>
              </div>

              {/* Desglose por Línea de Negocio */}
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 space-y-4">
                <h3 className="text-sm font-black text-white">Desglose por Líneas de Negocio HAZE</h3>
                <div className="space-y-3">
                  {[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES.slice(0, 4)].map(cat => {
                    const count = approvedMovements.filter(m => m.category === cat).length
                    const sum = approvedMovements
                      .filter(m => m.category === cat)
                      .reduce((acc, m) => acc + (m.type === 'Ingreso' ? m.amount : -m.amount), 0)
                    return (
                      <div key={cat} className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                        <div>
                          <p className="text-xs font-bold text-zinc-200">{cat}</p>
                          <p className="text-[10px] text-zinc-400">{count} operaciones aprobadas</p>
                        </div>
                        <span className={`text-xs font-black ${sum >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {sum >= 0 ? '+' : ''} {formatCOP(sum)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 5: CONFIGURACIÓN & CLAVES */}
          {activeTab === 'configuracion' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90">
                <h2 className="text-xl font-black text-white">Configuración del CRM & Credenciales</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Parámetros de acceso, claves de fundadores y protocolo mancomunado.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Claves de los fundadores */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 space-y-4">
                  <div className="flex items-center gap-3">
                    <KeyRound className="text-violet-400" size={20} />
                    <h3 className="text-sm font-bold text-white">Claves de Fundadores</h3>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Luis Alfonso Herrera</p>
                        <p className="text-[10px] text-zinc-400">Co-Fundador · Administrador</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-black text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-500/30">
                          PIN: 1206
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Yoinner Gándara</p>
                        <p className="text-[10px] text-zinc-400">Co-Fundador · Administrador</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-black text-fuchsia-400 bg-fuchsia-950/60 px-2.5 py-1 rounded-lg border border-fuchsia-500/30">
                          PIN: 1205
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Moneda y Reglas */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="text-fuchsia-400" size={20} />
                    <h3 className="text-sm font-bold text-white">Reglas del Sistema</h3>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-zinc-400 font-medium">Moneda Activa:</p>
                      <p className="text-white font-bold text-sm">Pesos Colombianos (COP - $)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-zinc-400 font-medium">Registro Temporal:</p>
                      <p className="text-white font-bold">100% Automático al instante de guardar (sin captura manual de fecha/hora)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-zinc-400 font-medium">Condición de Balance:</p>
                      <p className="text-white font-bold">Requiere aprobación mutua de Luis y Yoinner para poder sumarse/restarse</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: NUEVO MOVIMIENTO (Fecha y hora automáticas al instante) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0c0d16] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Cabecera */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-base font-black text-white">Registrar Movimiento Financiero</h3>
                <p className="text-xs text-zinc-400">
                  Registrado por <b className="text-purple-300">{activeFounderObj.name}</b>
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Aviso de Timestamp Automático */}
            <div className="p-3 rounded-xl border border-purple-500/20 bg-purple-950/20 flex items-center gap-2.5 text-xs text-purple-200">
              <Clock size={16} className="text-fuchsia-400 shrink-0" />
              <span>
                <b>Hora y fecha automáticas:</b> Se registrará al segundo exacto ({currentTimeDisplay || 'al momento de guardar'}) sin necesidad de ingresarla manualmente.
              </span>
            </div>

            {/* Formulario */}
            <form onSubmit={handleCreateMovement} className="space-y-4">
              {/* Tipo: Ingreso / Egreso */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Tipo de Movimiento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'Ingreso' })}
                    className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      formData.type === 'Ingreso'
                        ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                        : 'bg-white/[0.03] text-zinc-400 border border-white/[0.08] hover:text-white'
                    }`}
                  >
                    <ArrowUpRight size={15} /> Ingreso (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'Egreso' })}
                    className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      formData.type === 'Egreso'
                        ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                        : 'bg-white/[0.03] text-zinc-400 border border-white/[0.08] hover:text-white'
                    }`}
                  >
                    <ArrowDownRight size={15} /> Egreso (-)
                  </button>
                </div>
              </div>

              {/* Concepto */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Concepto o Descripción <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.concept}
                  onChange={e => setFormData({ ...formData, concept: e.target.value })}
                  placeholder="Ej. Pago lote HazeCard NFC / Venta Web SaaS / Negocio aparte"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Monto en Pesos Colombianos (COP) */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Monto en Pesos Colombianos (COP) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">$ COP</span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="1.500.000"
                    className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Categoría (Cambia según si es ingreso o egreso: HazeCard, Web, Negocio aparte, etc.) */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Línea de {formData.type === 'Ingreso' ? 'Ingreso' : 'Gasto'}
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0d16] text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                >
                  {(formData.type === 'Ingreso' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Origen / Destino */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Cuenta de Origen / Destino</label>
                <select
                  value={formData.sourceDestination}
                  onChange={e => setFormData({ ...formData, sourceDestination: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0d16] text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                >
                  {SOURCES_DESTINATIONS.map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>

              {/* Justificación */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Justificación para el otro socio <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.justification}
                  onChange={e => setFormData({ ...formData, justification: e.target.value })}
                  placeholder="Detalla la procedencia del ingreso o el motivo del egreso para la aprobación mutua..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:opacity-95 text-white text-xs font-black shadow-[0_0_20px_rgba(147,51,234,0.4)] transition"
                >
                  Guardar con Hora Actual y Enviar para Doble Firma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER MÓVIL */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/80 backdrop-blur-sm">
          <div className="relative w-72 bg-[#07080f] p-5 border-r border-white/[0.08] flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white">
                    <Sparkles size={16} />
                  </div>
                  <span className="font-black text-sm text-white">HAZE<span className="text-fuchsia-500">.</span>CO</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="mb-4 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
                <p className="text-[10px] text-zinc-400">Usuario activo:</p>
                <p className="font-bold text-white">{activeFounderObj.name}</p>
                <button onClick={handleLogout} className="text-[10px] text-rose-400 hover:underline mt-1 block">
                  Cambiar usuario (PIN)
                </button>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
                  { id: 'movimientos', label: 'Ingresos y Egresos', icon: ReceiptText },
                  { id: 'aprobaciones', label: `Pendientes (${pendingMovements.length})`, icon: FileCheck2 },
                  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
                  { id: 'configuracion', label: 'Configuración', icon: Settings2 },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any)
                        setMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        activeTab === item.id ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/[0.06] text-xs text-zinc-400">
              <p className="font-bold text-white">HAZE Finance · COP</p>
              <p className="text-[10px]">Barranquilla, Colombia</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* TOAST FLOTANTE */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border border-purple-500/30 bg-[#0f101d] text-white text-xs font-semibold shadow-[0_0_25px_rgba(147,51,234,0.35)] animate-bounce-subtle">
          <Check size={16} className="text-fuchsia-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}
