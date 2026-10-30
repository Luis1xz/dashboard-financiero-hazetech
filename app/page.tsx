'use client'

import { useId, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  FileCheck2,
  Filter,
  Info,
  LayoutDashboard,
  Layers,
  Lock,
  LogOut,
  Menu,
  PieChart,
  Plus,
  ReceiptText,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  WalletCards,
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
  registeredBy: 'Luis Alfonso Herrera' | 'Yoinner Gándara'
  status: 'Pendiente' | 'Aprobado' | 'Rechazado'
  approvals: {
    luis: 'Pendiente' | 'Aprobado' | 'Rechazado'
    yoinner: 'Pendiente' | 'Aprobado' | 'Rechazado'
  }
}

const CATEGORIES = [
  'Desarrollo Web & SaaS',
  'Inteligencia Artificial & Automatización',
  'Infraestructura Cloud & Servidores',
  'Hardware HazeCard NFC',
  'Marketing & Pauta Digital',
  'Nómina & Honorarios',
  'Herramientas & Licencias',
  'Gastos Operativos & Administrativos',
]

const SOURCES_DESTINATIONS = [
  'Bancolombia HAZE Empresarial',
  'Tarjeta Débito Corporativa',
  'Pasarela Stripe Haze',
  'Cuenta de Ahorros Operativa',
  'Caja Menor Barranquilla',
  'Crypto / USDT Wallet',
]

export default function Page() {
  const [activeTab, setActiveTab] = useState<'resumen' | 'movimientos' | 'aprobaciones' | 'reportes' | 'configuracion'>('resumen')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showBalance, setShowBalance] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  
  // Lista de movimientos - Sin registros iniciales (mock data eliminada)
  const [movements, setMovements] = useState<FinancialMovement[]>([])

  // Filtros de movimientos
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'Ingreso' | 'Egreso'>('Todos')
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Formulario nuevo movimiento
  const [formData, setFormData] = useState({
    type: 'Ingreso' as 'Ingreso' | 'Egreso',
    concept: '',
    amount: '',
    category: CATEGORIES[0],
    sourceDestination: SOURCES_DESTINATIONS[0],
    justification: '',
    date: '',
    time: '',
    registeredBy: 'Luis Alfonso Herrera' as 'Luis Alfonso Herrera' | 'Yoinner Gándara',
  })

  // Obtener fecha y hora actual en zona local para validaciones
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)
  const currentHours = String(now.getHours()).padStart(2, '0')
  const currentMinutes = String(now.getMinutes()).padStart(2, '0')
  const currentTimeStr = `${currentHours}:${currentMinutes}`

  function notify(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 3200)
  }

  // Cálculos dinámicos
  const approvedMovements = useMemo(() => {
    return movements.filter(m => m.status === 'Aprobado')
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

  // Filtrado de movimientos para la tabla
  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      const matchType = typeFilter === 'Todos' || m.type === typeFilter
      const matchCategory = categoryFilter === 'Todas' || m.category === categoryFilter
      const matchSearch = searchQuery.trim() === '' || 
        m.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sourceDestination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.justification.toLowerCase().includes(searchQuery.toLowerCase())
      return matchType && matchCategory && matchSearch
    })
  }, [movements, typeFilter, categoryFilter, searchQuery])

  // Desglose por categoría para gráficos y distribución
  const categoryDistribution = useMemo(() => {
    const expensesByCategory: Record<string, number> = {}
    approvedMovements.filter(m => m.type === 'Egreso').forEach(m => {
      expensesByCategory[m.category] = (expensesByCategory[m.category] || 0) + m.amount
    })
    
    return [
      { name: 'Operación & Cloud', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Infraestructura Cloud & Servidores'] || 0) / totalExpense) * 100) : 0, color: 'from-violet-500 to-indigo-600', dot: 'bg-violet-500' },
      { name: 'Hardware HazeCard', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Hardware HazeCard NFC'] || 0) / totalExpense) * 100) : 0, color: 'from-fuchsia-500 to-pink-500', dot: 'bg-fuchsia-500' },
      { name: 'Marketing & Ventas', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Marketing & Pauta Digital'] || 0) / totalExpense) * 100) : 0, color: 'from-purple-400 to-violet-600', dot: 'bg-purple-400' },
      { name: 'Equipo & Nómina', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Nómina & Honorarios'] || 0) / totalExpense) * 100) : 0, color: 'from-pink-500 to-rose-600', dot: 'bg-pink-500' },
    ]
  }, [approvedMovements, totalExpense])

  function handleCreateMovement(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.concept.trim()) {
      notify('Por favor indica la descripción o concepto del movimiento.')
      return
    }

    const numAmount = parseFloat(formData.amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      notify('El monto debe ser un valor numérico positivo mayor a cero.')
      return
    }

    if (!formData.date || !formData.time) {
      notify('Debes especificar la fecha y hora del movimiento.')
      return
    }

    // Validación estricta: No permitir fechas y horas futuras
    const selectedDate = new Date(`${formData.date}T${formData.time}`)
    const currentDate = new Date()

    if (formData.date > todayStr) {
      notify('La fecha no puede ser posterior al día actual.')
      return
    }

    if (selectedDate.getTime() > currentDate.getTime()) {
      notify('La hora especificada no puede ser posterior al momento actual.')
      return
    }

    if (!formData.justification.trim()) {
      notify('Por favor agrega una breve justificación de la operación.')
      return
    }

    // El fundador que crea el movimiento auto-aprueba su parte; el otro queda pendiente
    const isLuis = formData.registeredBy === 'Luis Alfonso Herrera'
    const newMovement: FinancialMovement = {
      id: 'HAZE-' + Math.floor(100000 + Math.random() * 900000),
      type: formData.type,
      concept: formData.concept.trim(),
      amount: numAmount,
      category: formData.category,
      sourceDestination: formData.sourceDestination,
      justification: formData.justification.trim(),
      date: formData.date,
      time: formData.time,
      registeredBy: formData.registeredBy,
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
      category: CATEGORIES[0],
      sourceDestination: SOURCES_DESTINATIONS[0],
      justification: '',
      date: '',
      time: '',
      registeredBy: 'Luis Alfonso Herrera',
    })
    notify('Movimiento registrado. Pendiente de la segunda firma.')
  }

  function handleApprove(id: string, founder: 'luis' | 'yoinner') {
    setMovements(prev => prev.map(m => {
      if (m.id !== id) return m
      const newApprovals = {
        ...m.approvals,
        [founder]: 'Aprobado' as const,
      }
      const isApproved = newApprovals.luis === 'Aprobado' && newApprovals.yoinner === 'Aprobado'
      return {
        ...m,
        approvals: newApprovals,
        status: isApproved ? 'Aprobado' : 'Pendiente',
      }
    }))
    notify(`Aprobación registrada por ${founder === 'luis' ? 'Luis Alfonso Herrera' : 'Yoinner Gándara'}.`)
  }

  function handleReject(id: string, founder: 'luis' | 'yoinner') {
    setMovements(prev => prev.map(m => {
      if (m.id !== id) return m
      return {
        ...m,
        approvals: {
          ...m.approvals,
          [founder]: 'Rechazado' as const,
        },
        status: 'Rechazado' as const,
      }
    }))
    notify(`Movimiento rechazado por ${founder === 'luis' ? 'Luis Alfonso Herrera' : 'Yoinner Gándara'}.`)
  }

  function exportCSV() {
    if (movements.length === 0) {
      notify('No hay movimientos registrados para exportar.')
      return
    }
    const headers = ['ID,Tipo,Concepto,Monto,Categoria,Origen_Destino,Justificacion,Fecha,Hora,Responsable,Estado,Aprobacion_Luis,Aprobacion_Yoinner\n']
    const rows = movements.map(m => 
      `"${m.id}","${m.type}","${m.concept}","${m.amount}","${m.category}","${m.sourceDestination}","${m.justification}","${m.date}","${m.time}","${m.registeredBy}","${m.status}","${m.approvals.luis}","${m.approvals.yoinner}"`
    )
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `haze-finance-report-${todayStr}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    notify('Reporte financiero exportado con éxito.')
  }

  return (
    <div className="relative flex min-h-screen bg-[#050508] text-[#f4f4f7] selection:bg-purple-600/30 selection:text-purple-200">
      {/* Fondo tecnológico con sutil resplandor HAZE */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-purple-900/15 via-fuchsia-950/10 to-transparent blur-[140px]" />
        <div className="absolute top-[60%] -left-[20%] w-[600px] h-[600px] bg-purple-950/10 blur-[160px]" />
        <div className="absolute top-[40%] -right-[20%] w-[600px] h-[600px] bg-fuchsia-950/10 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Sidebar de navegación para escritorio */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-white/[0.08] bg-[#07080f]/80 backdrop-blur-xl lg:flex">
        {/* Logo & Marca Haze */}
        <div className="flex items-center gap-3.5 px-6 py-6 border-b border-white/[0.06]">
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white">HAZE</span>
              <span className="size-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" />
              <span className="text-xs font-bold text-zinc-400">CO</span>
            </div>
            <p className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400">Founder OS · CRM</p>
          </div>
        </div>

        {/* Menú de navegación */}
        <div className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Gestión Financiera
            </p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('resumen')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
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
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Análisis y Control
            </p>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('reportes')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'reportes'
                    ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.15)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <BarChart3 size={17} className={activeTab === 'reportes' ? 'text-violet-400' : 'text-zinc-400'} />
                <span>Reportes</span>
              </button>

              <button
                onClick={() => setActiveTab('configuracion')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'configuracion'
                    ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.15)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Settings2 size={17} className={activeTab === 'configuracion' ? 'text-violet-400' : 'text-zinc-400'} />
                <span>Configuración</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Perfil de los Fundadores en el Footer */}
        <div className="p-4 border-t border-white/[0.06] bg-[#090a12]/50">
          <div className="flex items-center gap-3 p-2.5 rounded-xl border border-white/[0.06] bg-[#0c0d16]/80">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-xs font-black text-white">
              HAZE
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Luis & Yoinner</p>
              <p className="text-[10px] text-zinc-400 truncate">Fundadores · hazetech.co</p>
            </div>
            <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" title="Protocolo Mancomunado Activo" />
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="relative flex-1 lg:pl-[260px] flex flex-col min-w-0 z-10">
        {/* Header superior */}
        <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-white/[0.08] bg-[#050508]/80 px-4 md:px-8 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white lg:hidden"
              aria-label="Menú"
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  HAZE Finance Cloud · {todayStr}
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-white">
                Dashboard CRM <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Financiero</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => notify('No hay notificaciones sin leer. Sistema conciliado.')}
              className="relative p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white transition"
              aria-label="Notificaciones"
            >
              <Bell size={18} />
              {pendingMovements.length > 0 && (
                <span className="absolute top-2 right-2 size-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" />
              )}
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(147,51,234,0.35)] transition-all active:scale-[0.98]"
            >
              <Plus size={16} />
              <span>Nuevo movimiento</span>
            </button>
          </div>
        </header>

        {/* Contenedor central */}
        <main className="flex-1 p-4 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
          {/* SECCIÓN 1: RESUMEN */}
          {activeTab === 'resumen' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Saludo & Hero Status */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 rounded-full border border-purple-500/30 bg-purple-950/30 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                    <ShieldCheck size={12} className="text-fuchsia-400" />
                    Protocolo de Doble Firma Activo · hazetech.co
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                    Control financiero <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">para fundadores.</span>
                  </h2>
                  <p className="mt-1 text-xs md:text-sm text-zinc-400 max-w-xl">
                    Cada egreso e ingreso es validado por Luis Alfonso Herrera y Yoinner Gándara para máxima transparencia en la operación.
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

              {/* Tarjetas de Métricas Principales */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Balance Disponible */}
                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 hover:border-violet-500/30 transition shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Balance disponible</p>
                    <div className="p-2 rounded-xl bg-violet-950/40 border border-violet-500/20 text-violet-400">
                      <Wallet size={18} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl md:text-3xl font-black text-white tracking-tight">
                      {showBalance ? `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-400 flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      {movements.length === 0 ? 'Sin registros iniciales' : `${approvedMovements.length} movimientos conciliados`}
                    </p>
                  </div>
                </div>

                {/* Ingresos del Mes */}
                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 hover:border-emerald-500/30 transition shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Ingresos aprobados</p>
                    <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl md:text-3xl font-black text-emerald-400 tracking-tight">
                      {showBalance ? `$${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-400">
                      {approvedMovements.filter(m => m.type === 'Ingreso').length} ingresos confirmados
                    </p>
                  </div>
                </div>

                {/* Egresos del Mes */}
                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 hover:border-rose-500/30 transition shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Egresos aprobados</p>
                    <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-400">
                      <ArrowDownRight size={18} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl md:text-3xl font-black text-rose-400 tracking-tight">
                      {showBalance ? `$${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-400">
                      {approvedMovements.filter(m => m.type === 'Egreso').length} egresos operacionales
                    </p>
                  </div>
                </div>

                {/* Pendientes de Aprobación */}
                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 hover:border-amber-500/30 transition shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Por aprobar</p>
                    <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/20 text-amber-400">
                      <ShieldAlert size={18} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl md:text-3xl font-black text-amber-400 tracking-tight">
                      {pendingMovements.length < 10 ? `0${pendingMovements.length}` : pendingMovements.length}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-400">
                      {pendingMovements.length === 0 ? 'Sin solicitudes pendientes' : 'Requiere firma de fundadores'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gráficos: Flujo de caja & Distribución */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Flujo de Caja Semestral */}
                <div className="xl:col-span-2 p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-white">Flujo de Caja · HAZE Finance</p>
                      <p className="text-xs text-zinc-400">Ingresos vs. Egresos conciliados (Últimos 6 meses)</p>
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

                  {/* Barras de Gráfica Minimalista */}
                  <div className="pt-6 pb-2">
                    <div className="flex items-end justify-between gap-3 h-[200px] border-b border-white/[0.08] px-2">
                      {['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct'].map((month, idx) => {
                        // Si hay movimientos en el mes actual (Oct), calcula una altura representativa
                        const isCurrentMonth = month === 'Oct'
                        const incomeHeight = isCurrentMonth && totalIncome > 0 ? 'h-32' : 'h-3'
                        const expenseHeight = isCurrentMonth && totalExpense > 0 ? 'h-24' : 'h-3'
                        return (
                          <div key={month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                            <div className="flex items-end gap-1.5 h-full">
                              <div
                                className={`w-3.5 sm:w-4 rounded-t-md bg-gradient-to-t from-violet-600 to-indigo-500 transition-all ${incomeHeight} group-hover:brightness-125`}
                                title={`Ingresos ${month}: $${isCurrentMonth ? totalIncome.toFixed(2) : '0.00'}`}
                              />
                              <div
                                className={`w-3.5 sm:w-4 rounded-t-md bg-gradient-to-t from-fuchsia-600 to-pink-500 transition-all ${expenseHeight} group-hover:brightness-125`}
                                title={`Egresos ${month}: $${isCurrentMonth ? totalExpense.toFixed(2) : '0.00'}`}
                              />
                            </div>
                            <span className={`text-[11px] font-semibold ${isCurrentMonth ? 'text-violet-400 font-bold' : 'text-zinc-400'}`}>
                              {month}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 text-center">
                    {movements.length === 0
                      ? 'Sin registros iniciales. Los nuevos movimientos registrados alimentarán la curva en tiempo real.'
                      : 'Datos calculados a partir de los registros conciliados de la empresa.'}
                  </p>
                </div>

                {/* Distribución Financiera de Gastos */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-white">Distribución de Gastos</p>
                        <p className="text-xs text-zinc-400">Porcentajes por categoría</p>
                      </div>
                      <CircleDollarSign size={20} className="text-fuchsia-400" />
                    </div>

                    {/* Donut Chart Visual */}
                    <div className="my-6 flex items-center justify-center">
                      <div className="relative flex size-[150px] items-center justify-center rounded-full bg-gradient-to-tr from-violet-600/20 via-fuchsia-600/20 to-purple-600/10 p-3 border border-white/[0.08]">
                        <div className="flex size-full flex-col items-center justify-center rounded-full bg-[#07080f] border border-white/[0.06] shadow-inner text-center">
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total</span>
                          <span className="text-lg font-black text-white">
                            ${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Leyendas y Porcentajes */}
                    <div className="space-y-2.5">
                      {categoryDistribution.map(cat => (
                        <div key={cat.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-zinc-300">
                            <span className={`size-2.5 rounded-full ${cat.dot}`} />
                            <span>{cat.name}</span>
                          </div>
                          <span className="font-bold text-white">{cat.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-[11px] text-zinc-400">
                    <p className="flex items-center gap-1.5 text-zinc-300 font-semibold mb-1">
                      <Info size={13} className="text-violet-400" /> Criterio de distribución
                    </p>
                    Los costos se agrupan automáticamente según la categoría seleccionada al momento de cargar cada egreso.
                  </div>
                </div>
              </div>

              {/* Actividad Reciente */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 overflow-hidden">
                <div className="p-5 md:p-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black text-white">Actividad Reciente</h3>
                    <p className="text-xs text-zinc-400">Historial de operaciones y estado de aprobación</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {(['Todos', 'Ingreso', 'Egreso'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setTypeFilter(tab)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          typeFilter === tab
                            ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.35)]'
                            : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredMovements.length === 0 ? (
                  <div className="py-16 px-4 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.08] text-zinc-400 mb-3">
                      <ReceiptText size={24} />
                    </div>
                    <p className="text-sm font-bold text-white">Sin movimientos registrados</p>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                      No hay registros visibles en este momento. Utiliza el botón de &ldquo;Nuevo movimiento&rdquo; para registrar ingresos o egresos.
                    </p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-bold transition"
                    >
                      <Plus size={14} /> Registrar primer movimiento
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
                          <th className="px-4 py-3.5">Registrado por</th>
                          <th className="px-4 py-3.5">Doble Firma</th>
                          <th className="px-6 py-3.5 text-right">Importe</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {filteredMovements.map(item => (
                          <tr key={item.id} className="hover:bg-white/[0.02] transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                                  item.type === 'Ingreso'
                                    ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-950/50 text-rose-400 border border-rose-500/30'
                                }`}>
                                  {item.type === 'Ingreso' ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                                </span>
                                <div>
                                  <p className="font-bold text-white">{item.concept}</p>
                                  <p className="text-[10px] text-zinc-400">{item.date} · {item.time}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-zinc-300">{item.category}</td>
                            <td className="px-4 py-4 text-zinc-400">{item.sourceDestination}</td>
                            <td className="px-4 py-4 font-medium text-zinc-300">{item.registeredBy}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    item.status === 'Aprobado'
                                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                                      : item.status === 'Rechazado'
                                      ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                                      : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                                  }`}
                                >
                                  {item.status}
                                </span>
                                <span className="text-[10px] text-zinc-400">
                                  (L: {item.approvals.luis[0]} / Y: {item.approvals.yoinner[0]})
                                </span>
                              </div>
                            </td>
                            <td className={`px-6 py-4 text-right font-black text-sm ${
                              item.type === 'Ingreso' ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {item.type === 'Ingreso' ? '+' : '-'}${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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

          {/* SECCIÓN 2: INGRESOS Y EGRESOS */}
          {activeTab === 'movimientos' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90">
                <div>
                  <h2 className="text-xl font-black text-white">Registro de Ingresos y Egresos</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Control pormenorizado de todas las entradas y salidas de capital de HAZE.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-xs font-semibold text-zinc-200 transition"
                  >
                    <Download size={15} />
                    <span>Exportar CSV</span>
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

              {/* Filtros avanzados */}
              <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/70 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar por concepto, origen o justificación..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0d16] text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Todas">Todas las categorías</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <div className="flex items-center rounded-xl border border-white/[0.08] bg-black/40 p-1">
                    {(['Todos', 'Ingreso', 'Egreso'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setTypeFilter(tab)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          typeFilter === tab
                            ? 'bg-violet-600 text-white'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Listado de movimientos */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 overflow-hidden">
                {filteredMovements.length === 0 ? (
                  <div className="py-20 px-4 text-center">
                    <ReceiptText size={32} className="mx-auto text-zinc-400 mb-3" />
                    <p className="text-sm font-bold text-white">No se encontraron movimientos</p>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                      {movements.length === 0
                        ? 'Actualmente no hay transacciones en el historial. El panel está listo para recibir operaciones reales.'
                        : 'No hay operaciones que coincidan con los filtros aplicados.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#080911] text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-white/[0.06]">
                        <tr>
                          <th className="px-6 py-3.5">ID / Fecha</th>
                          <th className="px-4 py-3.5">Concepto & Justificación</th>
                          <th className="px-4 py-3.5">Categoría</th>
                          <th className="px-4 py-3.5">Origen / Destino</th>
                          <th className="px-4 py-3.5">Autor</th>
                          <th className="px-4 py-3.5">Estado</th>
                          <th className="px-6 py-3.5 text-right">Monto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {filteredMovements.map(m => (
                          <tr key={m.id} className="hover:bg-white/[0.02] transition">
                            <td className="px-6 py-4">
                              <p className="font-mono text-[11px] font-bold text-violet-400">{m.id}</p>
                              <p className="text-[10px] text-zinc-400">{m.date} {m.time}</p>
                            </td>
                            <td className="px-4 py-4 max-w-xs">
                              <p className="font-bold text-white">{m.concept}</p>
                              <p className="text-[11px] text-zinc-400 truncate mt-0.5">{m.justification}</p>
                            </td>
                            <td className="px-4 py-4 text-zinc-300">{m.category}</td>
                            <td className="px-4 py-4 text-zinc-400">{m.sourceDestination}</td>
                            <td className="px-4 py-4 text-zinc-300 font-medium">{m.registeredBy}</td>
                            <td className="px-4 py-4">
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
                            </td>
                            <td className={`px-6 py-4 text-right font-black text-sm ${
                              m.type === 'Ingreso' ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {m.type === 'Ingreso' ? '+' : '-'}${m.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                    <Lock size={12} /> Doble Validación Mancomunada Obligatoria
                  </div>
                  <h2 className="text-xl font-black text-white">Pendientes de Aprobación</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Cualquier movimiento financiero de HAZE requiere la confirmación explícita de ambos fundadores para materializarse en el balance.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-bold text-zinc-300">
                    {pendingMovements.length} requerimientos activos
                  </span>
                </div>
              </div>

              {pendingMovements.length === 0 ? (
                <div className="py-20 px-4 text-center rounded-2xl border border-white/[0.08] bg-[#0c0d16]/60">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 mb-3">
                    <CheckCircle2 size={28} />
                  </div>
                  <p className="text-base font-bold text-white">Todo al día. No hay pendientes de aprobación.</p>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                    Todas las operaciones registradas han sido validadas por Luis Alfonso Herrera y Yoinner Gándara o no existen solicitudes activas.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingMovements.map(item => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 space-y-4 hover:border-violet-500/30 transition shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-[10px] text-zinc-400">{item.id} · {item.date} {item.time}</span>
                          <h3 className="text-sm font-black text-white mt-0.5">{item.concept}</h3>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                          item.type === 'Ingreso'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                        }`}>
                          {item.type === 'Ingreso' ? '+' : '-'}${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                        <div className="pt-1.5 border-t border-white/[0.06] text-zinc-300">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Justificación:</p>
                          <p className="text-[11px] text-zinc-300 mt-0.5 italic">&ldquo;{item.justification}&rdquo;</p>
                        </div>
                      </div>

                      {/* Estado de las dos firmas de aprobación */}
                      <div className="pt-2 border-t border-white/[0.06] space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          Firmas Requeridas
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {/* Luis Alfonso Herrera */}
                          <div className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                            <p className="text-[11px] font-bold text-white">Luis Alfonso H.</p>
                            <p className="text-[10px] text-zinc-400 mb-2">Co-Founder</p>
                            {item.approvals.luis === 'Aprobado' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                <Check size={12} /> Aprobado
                              </span>
                            ) : (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleApprove(item.id, 'luis')}
                                  className="flex-1 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 transition"
                                >
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => handleReject(item.id, 'luis')}
                                  className="py-1 px-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-[10px] border border-rose-500/30 transition"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Yoinner Gándara */}
                          <div className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                            <p className="text-[11px] font-bold text-white">Yoinner Gándara</p>
                            <p className="text-[10px] text-zinc-400 mb-2">Co-Founder</p>
                            {item.approvals.yoinner === 'Aprobado' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                <Check size={12} /> Aprobado
                              </span>
                            ) : (
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleApprove(item.id, 'yoinner')}
                                  className="flex-1 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 transition"
                                >
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => handleReject(item.id, 'yoinner')}
                                  className="py-1 px-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-[10px] border border-rose-500/30 transition"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
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
                  <p className="text-xs text-zinc-400 mt-0.5">Métricas de rentabilidad, margen operativo y flujo de capital para los socios.</p>
                </div>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg transition"
                >
                  <Download size={15} />
                  <span>Descargar Balance (CSV)</span>
                </button>
              </div>

              {/* KPI Cards de Rendimiento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Margen Operativo</p>
                  <p className="text-2xl font-black text-white mt-2">
                    {totalIncome > 0 ? `${(((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)}%` : '0.0%'}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">Rentabilidad neta sobre ingresos brutos</p>
                </div>

                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Operaciones Conciliadas</p>
                  <p className="text-2xl font-black text-violet-400 mt-2">{approvedMovements.length}</p>
                  <p className="text-[11px] text-zinc-400 mt-1">Validado por Luis y Yoinner</p>
                </div>

                <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Tasa de Quema (Burn Rate)</p>
                  <p className="text-2xl font-black text-fuchsia-400 mt-2">${totalExpense.toFixed(2)}</p>
                  <p className="text-[11px] text-zinc-400 mt-1">Gasto operativo en el ciclo actual</p>
                </div>
              </div>

              {/* Resumen de Categorías */}
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 space-y-4">
                <h3 className="text-sm font-black text-white">Desglose Consolidado por Categoría</h3>
                <div className="space-y-3">
                  {CATEGORIES.map(category => {
                    const count = approvedMovements.filter(m => m.category === category).length
                    const sum = approvedMovements
                      .filter(m => m.category === category)
                      .reduce((acc, m) => acc + (m.type === 'Ingreso' ? m.amount : -m.amount), 0)
                    return (
                      <div key={category} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                        <span className="text-xs font-semibold text-zinc-200">{category}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] text-zinc-400">{count} movimientos</span>
                          <span className={`text-xs font-black ${sum >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {sum >= 0 ? '+' : ''}${sum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN 5: CONFIGURACIÓN */}
          {activeTab === 'configuracion' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90">
                <h2 className="text-xl font-black text-white">Configuración del CRM Financiero</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Parámetros del sistema, identidad de HAZE y protocolo de seguridad mancomunada.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Corporativa */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="text-violet-400" size={20} />
                    <h3 className="text-sm font-bold text-white">Identidad Corporativa</h3>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-zinc-400 font-medium">Empresa:</p>
                      <p className="text-white font-bold">HAZE Technologies (hazetech.co)</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 font-medium">Ubicación:</p>
                      <p className="text-white font-bold">Barranquilla, Atlántico, Colombia</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 font-medium">Líneas de Negocio:</p>
                      <p className="text-zinc-300">Desarrollo Web & SaaS, Inteligencia Artificial, Tarjetas NFC HazeCard</p>
                    </div>
                  </div>
                </div>

                {/* Socios Fundadores */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0c0d16]/90 space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="text-fuchsia-400" size={20} />
                    <h3 className="text-sm font-bold text-white">Socios Fundadores Autorizados</h3>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div>
                        <p className="font-bold text-white">Luis Alfonso Herrera</p>
                        <p className="text-[10px] text-zinc-400">Co-Fundador · Administrador</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Firmante A
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div>
                        <p className="font-bold text-white">Yoinner Gándara</p>
                        <p className="text-[10px] text-zinc-400">Co-Fundador · Administrador</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Firmante B
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Protocolo de Seguridad */}
              <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-950/10 space-y-3">
                <div className="flex items-center gap-2 text-violet-300">
                  <ShieldCheck size={18} />
                  <h4 className="text-sm font-bold">Protocolo de Doble Aprobación Mancomunada</h4>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Para mantener estricta integridad en las finanzas de la startup, ningún ingreso o egreso puede ser registrado unilateralmente. Cada movimiento creado requiere la firma digital cruzada del segundo fundador antes de impactar el balance de HAZE.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: NUEVO MOVIMIENTO FINANCIERO */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0c0d16] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Cabecera del Modal */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-base font-black text-white">Registrar Movimiento Financiero</h3>
                <p className="text-xs text-zinc-400">Ingreso o Egreso para control y validación de los fundadores.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleCreateMovement} className="space-y-4">
              {/* Selector de Tipo (Ingreso / Egreso) */}
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

              {/* Concepto / Descripción */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Concepto o Descripción <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.concept}
                  onChange={e => setFormData({ ...formData, concept: e.target.value })}
                  placeholder="Ej. Pago de cliente SaaS / Servidores AWS / HazeCards"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Monto / Importe */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Monto / Importe ($ USD o COP) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Categoría y Origen/Destino */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0d16] text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">Origen / Destino</label>
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
              </div>

              {/* Fecha y Hora con validación: No pueden ser futuras */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Fecha <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    max={todayStr}
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0d16] text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Hora <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0d16] text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Solicitante / Fundador */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Fundador Responsable</label>
                <select
                  value={formData.registeredBy}
                  onChange={e => setFormData({ ...formData, registeredBy: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0d16] text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="Luis Alfonso Herrera">Luis Alfonso Herrera (Co-Founder)</option>
                  <option value="Yoinner Gándara">Yoinner Gándara (Co-Founder)</option>
                </select>
              </div>

              {/* Justificación de la operación */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Justificación de la Operación <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.justification}
                  onChange={e => setFormData({ ...formData, justification: e.target.value })}
                  placeholder="Explica detalladamente el motivo comercial o la procedencia de los fondos..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:opacity-95 text-white text-xs font-black shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all"
                >
                  Enviar para Doble Aprobación
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

              <nav className="space-y-1">
                {[
                  { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
                  { id: 'movimientos', label: 'Ingresos y Egresos', icon: ReceiptText },
                  { id: 'aprobaciones', label: 'Pendientes', icon: FileCheck2 },
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
                        activeTab === item.id
                          ? 'bg-purple-600 text-white'
                          : 'text-zinc-400 hover:text-white'
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
              <p className="font-bold text-white">Luis & Yoinner</p>
              <p className="text-[10px]">HAZE Technologies · Barranquilla</p>
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
