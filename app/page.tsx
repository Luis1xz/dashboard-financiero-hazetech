'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
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
  Compass,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  FileCheck2,
  Filter,
  Flame,
  Info,
  KeyRound,
  LayoutDashboard,
  LineChart,
  ListTodo,
  Lock,
  LogOut,
  Menu,
  Percent,
  PieChart,
  Plus,
  ReceiptText,
  RotateCcw,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trash2,
  User,
  UserCheck,
  Users,
  Volume2,
  VolumeX,
  Wallet,
  X,
  Zap,
} from 'lucide-react'

// MODELOS DE DATOS
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

export interface InvestmentStage {
  id: string
  projectName: string
  stage: 'Fase Semilla' | 'Desarrollo & Prototipo' | 'Producción Lote' | 'Escalamiento & Ventas' | 'Maduración'
  investedAmount: number
  returnedAmount: number
  investor: 'Ambos (Capital HAZE)' | 'Luis Alfonso Herrera' | 'Yoinner Gándara'
  date: string
  time: string
  status: 'En Ejecución' | 'Recuperando' | 'Rentable' | 'Completado'
  notes: string
}

export interface FinancialTask {
  id: string
  title: string
  estimatedAmount?: number
  priority: 'Alta' | 'Media' | 'Baja'
  assignedTo: 'Luis' | 'Yoinner' | 'Ambos'
  dueDate?: string
  completed: boolean
  createdAt: string
}

// Credenciales fijas de los dos fundadores (CLAVES OCULTAS EN LA UI)
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
  'Desarrollo Web & Software SaaS',
  'Inteligencia Artificial & Automatización',
  'Negocio Aparte / Proyectos Especiales',
  'Retorno de Inversión / Dividendos',
  'Consultoría & Servicios Tech',
  'Inversión / Aporte de Socios',
  'Otros Ingresos',
]

const EXPENSE_CATEGORIES = [
  'Inversión en Nuevas Etapas / Proyectos',
  'Producción Lote HazeCard NFC',
  'Infraestructura Cloud & Servidores',
  'Marketing, Pauta & Expansión',
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
  'Cuenta Operativa de Ahorros',
  'Caja Menor Barranquilla',
  'Fondo de Inversión HAZE',
  'Crypto / USDT Wallet',
]

// SINTETIZADOR DE AUDIO WEB AUDIO API (Sonidos futuristas fintech)
class SoundManager {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('haze_sound_enabled')
      if (stored !== null) this.enabled = stored === 'true'
    }
  }

  public isEnabled() {
    return this.enabled
  }

  public toggle() {
    this.enabled = !this.enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('haze_sound_enabled', String(this.enabled))
    }
    if (this.enabled) this.playPop()
    return this.enabled
  }

  private getContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) this.ctx = new AudioCtx()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  public playPop() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(850, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05)
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.05)
  }

  public playSuccess() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const notes = [587.33, 880] // D5 -> A5 chord
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + idx * 0.08)
      gain.gain.setValueAtTime(0.15, now + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + idx * 0.08)
      osc.stop(now + idx * 0.08 + 0.35)
    })
  }

  public playCash() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const chords = [523.25, 659.25, 783.99, 1046.5] // C E G C
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.05)
      gain.gain.setValueAtTime(0.1, now + idx * 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + idx * 0.05)
      osc.stop(now + idx * 0.05 + 0.25)
    })
  }

  public playReject() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.linearRampToValueAtTime(180, now + 0.15)
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(now + 0.15)
  }
}

const sounds = new SoundManager()

export default function Page() {
  // Autenticación de fundador
  const [currentUser, setCurrentUser] = useState<FounderId | null>(null)
  const [pinInput, setPinInput] = useState('')
  const [selectedFounderForLogin, setSelectedFounderForLogin] = useState<FounderId>('luis')
  const [loginError, setLoginError] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Navegación
  const [activeTab, setActiveTab] = useState<'resumen' | 'movimientos' | 'aprobaciones' | 'inversiones' | 'pendientes' | 'reportes' | 'configuracion'>('resumen')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showInvestmentModal, setShowInvestmentModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedInvestmentForReturn, setSelectedInvestmentForReturn] = useState<InvestmentStage | null>(null)
  const [showBalance, setShowBalance] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  // Lista de Movimientos Financieros
  const [movements, setMovements] = useState<FinancialMovement[]>([])

  // Lista de Inversiones por Etapa (ROI)
  const [investments, setInvestments] = useState<InvestmentStage[]>([])

  // Lista de Tareas / Pendientes
  const [tasks, setTasks] = useState<FinancialTask[]>([])

  // Filtros
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'Ingreso' | 'Egreso'>('Todos')
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [taskFilter, setTaskFilter] = useState<'Todos' | 'Pendientes' | 'Completados'>('Todos')

  // Formulario nuevo movimiento
  const [formData, setFormData] = useState({
    type: 'Ingreso' as 'Ingreso' | 'Egreso',
    concept: '',
    amount: '',
    category: INCOME_CATEGORIES[0],
    sourceDestination: SOURCES_DESTINATIONS[0],
    justification: '',
  })

  // Formulario nueva inversión
  const [investForm, setInvestForm] = useState({
    projectName: '',
    stage: 'Fase Semilla' as InvestmentStage['stage'],
    investedAmount: '',
    investor: 'Ambos (Capital HAZE)' as InvestmentStage['investor'],
    notes: '',
  })

  // Formulario retorno de inversión
  const [returnForm, setReturnForm] = useState({
    returnAmount: '',
    notes: '',
  })

  // Formulario nueva tarea financiera
  const [taskForm, setTaskForm] = useState({
    title: '',
    estimatedAmount: '',
    priority: 'Alta' as 'Alta' | 'Media' | 'Baja',
    assignedTo: 'Ambos' as 'Luis' | 'Yoinner' | 'Ambos',
    dueDate: '',
  })

  // Reloj en tiempo real
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState('')

  useEffect(() => {
    setIsClient(true)
    setSoundEnabled(sounds.isEnabled())

    const savedUser = localStorage.getItem('haze_founder_auth') as FounderId | null
    if (savedUser && (savedUser === 'luis' || savedUser === 'yoinner')) {
      setCurrentUser(savedUser)
    }

    const savedMovements = localStorage.getItem('haze_movements_data')
    if (savedMovements) {
      try {
        setMovements(JSON.parse(savedMovements))
      } catch {}
    }

    const savedInvestments = localStorage.getItem('haze_investments_data')
    if (savedInvestments) {
      try {
        setInvestments(JSON.parse(savedInvestments))
      } catch {}
    }

    const savedTasks = localStorage.getItem('haze_tasks_data')
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch {}
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

  // Persistencia
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('haze_movements_data', JSON.stringify(movements))
    }
  }, [movements, isClient])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('haze_investments_data', JSON.stringify(investments))
    }
  }, [investments, isClient])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('haze_tasks_data', JSON.stringify(tasks))
    }
  }, [tasks, isClient])

  useEffect(() => {
    if (formData.type === 'Ingreso') {
      setFormData(prev => ({ ...prev, category: INCOME_CATEGORIES[0] }))
    } else {
      setFormData(prev => ({ ...prev, category: EXPENSE_CATEGORIES[0] }))
    }
  }, [formData.type])

  function notify(msg: string, type: 'pop' | 'success' | 'reject' | 'cash' = 'pop') {
    setToast(msg)
    if (type === 'success') sounds.playSuccess()
    else if (type === 'cash') sounds.playCash()
    else if (type === 'reject') sounds.playReject()
    else sounds.playPop()
    window.setTimeout(() => setToast(null), 3500)
  }

  function formatCOP(val: number) {
    return `$ ${val.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP`
  }

  // Login con PIN seguro (Sin mostrar clave en pantalla)
  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const targetFounder = FOUNDERS.find(f => f.id === selectedFounderForLogin)
    if (!targetFounder) return

    if (pinInput === targetFounder.pin) {
      setCurrentUser(targetFounder.id)
      localStorage.setItem('haze_founder_auth', targetFounder.id)
      setPinInput('')
      setLoginError(false)
      notify(`Bienvenido, ${targetFounder.shortName} · Acceso de fundador verificado`, 'success')
    } else {
      setLoginError(true)
      notify('PIN incorrecto. Acceso mancomunado restringido.', 'reject')
    }
  }

  function handleLogout() {
    sounds.playPop()
    setCurrentUser(null)
    localStorage.removeItem('haze_founder_auth')
    setPinInput('')
    notify('Sesión asegurada con PIN.', 'reject')
  }

  // Regla: Solo movimientos aprobados por ambos impactan el balance
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

  // Estadísticas globales de Inversión & ROI
  const investmentStats = useMemo(() => {
    const totalInvested = investments.reduce((acc, i) => acc + i.investedAmount, 0)
    const totalReturned = investments.reduce((acc, i) => acc + i.returnedAmount, 0)
    const netProfit = totalReturned - totalInvested
    const overallROI = totalInvested > 0 ? ((totalReturned - totalInvested) / totalInvested) * 100 : 0
    const multiple = totalInvested > 0 ? (totalReturned / totalInvested) : 0
    return {
      totalInvested,
      totalReturned,
      netProfit,
      overallROI,
      multiple,
    }
  }, [investments])

  // Filtrado de movimientos
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

  // Tareas filtradas
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (taskFilter === 'Pendientes') return !t.completed
      if (taskFilter === 'Completados') return t.completed
      return true
    })
  }, [tasks, taskFilter])

  // Distribución de Gastos
  const categoryDistribution = useMemo(() => {
    const expensesByCategory: Record<string, number> = {}
    approvedMovements.filter(m => m.type === 'Egreso').forEach(m => {
      expensesByCategory[m.category] = (expensesByCategory[m.category] || 0) + m.amount
    })

    return [
      { name: 'Hardware HazeCard NFC', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Producción Lote HazeCard NFC'] || 0) / totalExpense) * 100) : 0, dot: 'bg-emerald-400' },
      { name: 'Inversión en Proyectos', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Inversión en Nuevas Etapas / Proyectos'] || 0) / totalExpense) * 100) : 0, dot: 'bg-violet-400' },
      { name: 'Cloud & Servidores', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Infraestructura Cloud & Servidores'] || 0) / totalExpense) * 100) : 0, dot: 'bg-fuchsia-400' },
      { name: 'Marketing & Expansión', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Marketing, Pauta & Expansión'] || 0) / totalExpense) * 100) : 0, dot: 'bg-pink-400' },
      { name: 'Nómina & Honorarios', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Nómina & Honorarios'] || 0) / totalExpense) * 100) : 0, dot: 'bg-amber-400' },
      { name: 'Otros Gastos', percent: totalExpense > 0 ? Math.round(((expensesByCategory['Otros Gastos'] || 0) / totalExpense) * 100) : 0, dot: 'bg-zinc-500' },
    ]
  }, [approvedMovements, totalExpense])

  // CREAR MOVIMIENTO (Fecha y hora automáticas al instante)
  function handleCreateMovement(e: React.FormEvent) {
    e.preventDefault()

    if (!currentUser) {
      notify('Debes estar autenticado para registrar movimientos.', 'reject')
      return
    }

    if (!formData.concept.trim()) {
      notify('Indica la descripción o concepto.', 'reject')
      return
    }

    const numAmount = parseFloat(formData.amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      notify('El monto en pesos debe ser mayor a cero.', 'reject')
      return
    }

    if (!formData.justification.trim()) {
      notify('Por favor agrega la justificación de la operación.', 'reject')
      return
    }

    const currentFounderObj = FOUNDERS.find(f => f.id === currentUser)!
    const now = new Date()

    const autoDate = now.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const autoTime = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })

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

    const otherFounder = isLuis ? 'Yoinner Gándara' : 'Luis Alfonso Herrera'
    notify(`Registrado con éxito a las ${autoTime}. Pendiente de la firma de ${otherFounder}.`, 'pop')
  }

  // FIRMAR APROBACIÓN
  function handleApprove(id: string, founderId: FounderId) {
    if (currentUser !== founderId) {
      const reqName = founderId === 'luis' ? 'Luis Alfonso Herrera' : 'Yoinner Gándara'
      notify(`Para firmar debes cambiar de usuario e ingresar como ${reqName}.`, 'reject')
      return
    }

    setMovements(prev =>
      prev.map(m => {
        if (m.id !== id) return m
        const newApprovals = {
          ...m.approvals,
          [founderId]: 'Aprobado' as const,
        }
        const bothApproved = newApprovals.luis === 'Aprobado' && newApprovals.yoinner === 'Aprobado'
        return {
          ...m,
          approvals: newApprovals,
          status: bothApproved ? 'Aprobado' : 'Pendiente',
        }
      })
    )

    const founderName = founderId === 'luis' ? 'Luis Alfonso' : 'Yoinner'
    notify(`Firma de ${founderName} validada. ¡Operación conciliada!`, 'success')
  }

  // RECHAZAR
  function handleReject(id: string, founderId: FounderId) {
    if (currentUser !== founderId) {
      notify(`Solo el firmante autorizado puede rechazar.`, 'reject')
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
    notify(`Operación rechazada. No se sumará al balance.`, 'reject')
  }

  // CREAR INVERSIÓN POR ETAPA
  function handleCreateInvestment(e: React.FormEvent) {
    e.preventDefault()
    const numAmount = parseFloat(investForm.investedAmount)
    if (!investForm.projectName.trim() || isNaN(numAmount) || numAmount <= 0) {
      notify('Por favor completa los datos de la inversión.', 'reject')
      return
    }

    const now = new Date()
    const autoDate = now.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const autoTime = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })

    const newInvest: InvestmentStage = {
      id: 'INV-' + Math.floor(1000 + Math.random() * 9000),
      projectName: investForm.projectName.trim(),
      stage: investForm.stage,
      investedAmount: numAmount,
      returnedAmount: 0,
      investor: investForm.investor,
      date: autoDate,
      time: autoTime,
      status: 'En Ejecución',
      notes: investForm.notes.trim() || 'Inversión de capital para impulso comercial.',
    }

    // Registrar automáticamente también como Egreso para la contabilidad (pendiente de doble firma)
    const newMovement: FinancialMovement = {
      id: 'HAZE-' + Math.floor(100000 + Math.random() * 900000),
      type: 'Egreso',
      concept: `Inversión: ${newInvest.projectName} (${newInvest.stage})`,
      amount: numAmount,
      category: 'Inversión en Nuevas Etapas / Proyectos',
      sourceDestination: 'Fondo de Inversión HAZE',
      justification: `Capital inyectado en etapa: ${newInvest.stage}. Destinado a retornos de ganancia futuros.`,
      date: autoDate,
      time: autoTime,
      timestamp: now.getTime(),
      registeredBy: currentUser === 'luis' ? 'Luis Alfonso Herrera' : 'Yoinner Gándara',
      status: 'Pendiente',
      approvals: {
        luis: currentUser === 'luis' ? 'Aprobado' : 'Pendiente',
        yoinner: currentUser === 'yoinner' ? 'Aprobado' : 'Pendiente',
      },
    }

    setInvestments(prev => [newInvest, ...prev])
    setMovements(prev => [newMovement, ...prev])
    setShowInvestmentModal(false)
    setInvestForm({
      projectName: '',
      stage: 'Fase Semilla',
      investedAmount: '',
      investor: 'Ambos (Capital HAZE)',
      notes: '',
    })
    notify('Inversión creada y registrada en egresos para doble aprobación.', 'success')
  }

  // REGISTRAR RETORNO DE INVERSIÓN / GANANCIA
  function handleRegisterReturn(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedInvestmentForReturn) return
    const returnAmount = parseFloat(returnForm.returnAmount)
    if (isNaN(returnAmount) || returnAmount <= 0) {
      notify('Indica un monto de retorno válido.', 'reject')
      return
    }

    const now = new Date()
    const autoDate = now.toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const autoTime = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })

    setInvestments(prev =>
      prev.map(inv => {
        if (inv.id !== selectedInvestmentForReturn.id) return inv
        const newReturned = inv.returnedAmount + returnAmount
        let newStatus: InvestmentStage['status'] = 'Recuperando'
        if (newReturned >= inv.investedAmount) {
          newStatus = newReturned > inv.investedAmount ? 'Rentable' : 'Completado'
        }
        return {
          ...inv,
          returnedAmount: newReturned,
          status: newStatus,
        }
      })
    )

    // Crear Ingreso correspondiente para el balance
    const newMovement: FinancialMovement = {
      id: 'HAZE-' + Math.floor(100000 + Math.random() * 900000),
      type: 'Ingreso',
      concept: `Retorno Ganancia: ${selectedInvestmentForReturn.projectName}`,
      amount: returnAmount,
      category: 'Retorno de Inversión / Dividendos',
      sourceDestination: 'Bancolombia HAZE Empresarial',
      justification: `Retorno de capital o ganancia sobre la inversión ${selectedInvestmentForReturn.id}. ${returnForm.notes}`,
      date: autoDate,
      time: autoTime,
      timestamp: now.getTime(),
      registeredBy: currentUser === 'luis' ? 'Luis Alfonso Herrera' : 'Yoinner Gándara',
      status: 'Pendiente',
      approvals: {
        luis: currentUser === 'luis' ? 'Aprobado' : 'Pendiente',
        yoinner: currentUser === 'yoinner' ? 'Aprobado' : 'Pendiente',
      },
    }

    setMovements(prev => [newMovement, ...prev])
    setShowReturnModal(false)
    setReturnForm({ returnAmount: '', notes: '' })
    setSelectedInvestmentForReturn(null)
    notify(`Retorno de ${formatCOP(returnAmount)} registrado. Enviado a doble firma.`, 'cash')
  }

  // TAREAS / PENDIENTES
  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!taskForm.title.trim()) {
      notify('Por favor escribe el título del pendiente.', 'reject')
      return
    }

    const newTask: FinancialTask = {
      id: 'TSK-' + Math.floor(1000 + Math.random() * 9000),
      title: taskForm.title.trim(),
      estimatedAmount: taskForm.estimatedAmount ? parseFloat(taskForm.estimatedAmount) : undefined,
      priority: taskForm.priority,
      assignedTo: taskForm.assignedTo,
      dueDate: taskForm.dueDate || undefined,
      completed: false,
      createdAt: new Date().toLocaleDateString('es-CO'),
    }

    setTasks(prev => [newTask, ...prev])
    setShowTaskModal(false)
    setTaskForm({
      title: '',
      estimatedAmount: '',
      priority: 'Alta',
      assignedTo: 'Ambos',
      dueDate: '',
    })
    notify('Pendiente agregado a la lista de compromisos.', 'pop')
  }

  function toggleTask(id: string) {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t
        const nextState = !t.completed
        if (nextState) sounds.playSuccess()
        else sounds.playPop()
        return { ...t, completed: nextState }
      })
    )
  }

  function deleteTask(id: string) {
    sounds.playReject()
    setTasks(prev => prev.filter(t => t.id !== id))
    notify('Pendiente eliminado.', 'reject')
  }

  function exportCSV() {
    if (approvedMovements.length === 0) {
      notify('No hay movimientos aprobados para exportar.', 'reject')
      return
    }
    const headers = ['ID,Tipo,Concepto,Monto_COP,Categoria,Origen_Destino,Justificacion,Fecha,Hora,Registrado_Por\n']
    const rows = approvedMovements.map(
      m =>
        `"${m.id}","${m.type}","${m.concept}","${m.amount}","${m.category}","${m.sourceDestination}","${m.justification}","${m.date}","${m.time}","${m.registeredBy}"`
    )
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `haze-balance-pro-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    notify('Reporte exportado en Pesos (COP).', 'cash')
  }

  // PANTALLA DE ACCESO CON PIN SEGURO (CLAVES 100% OCULTAS)
  if (!currentUser) {
    return (
      <div className="relative min-h-screen bg-[#040508] text-[#f4f4f8] flex items-center justify-center p-4 selection:bg-purple-600/30">
        {/* Luces y Efecto Liquid Glass Ambiental */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-purple-900/20 via-emerald-950/15 to-transparent blur-[160px]" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-fuchsia-950/20 blur-[140px]" />
        </div>

        <div className="relative z-10 w-full max-w-md p-8 rounded-3xl liquid-glass liquid-shimmer space-y-6 text-center">
          {/* Logo Oficial Recortado en Círculo */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative size-24 rounded-full p-1 bg-gradient-to-tr from-emerald-500 via-violet-500 to-amber-500 shadow-[0_0_35px_rgba(16,185,129,0.35)] animate-pulse-glow">
              <div className="relative size-full rounded-full overflow-hidden bg-black">
                <Image
                  src="/haze-logo-circle.png"
                  alt="HAZE Logo"
                  width={96}
                  height={96}
                  priority
                  className="size-full object-cover"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white">HAZE</span>
                <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">FINANCE</span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
                Founder OS · Acceso Seguro Mancomunado
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-400">
            Ingresa como fundador para gestionar el balance, auditar inversiones con ROI y firmar operaciones en Pesos (COP).
          </p>

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Seleccionar Fundador
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {FOUNDERS.map(founder => (
                  <button
                    key={founder.id}
                    type="button"
                    onClick={() => {
                      sounds.playPop()
                      setSelectedFounderForLogin(founder.id)
                      setPinInput('')
                      setLoginError(false)
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      selectedFounderForLogin === founder.id
                        ? 'border-purple-500/80 bg-purple-950/40 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]'
                        : 'border-white/[0.06] bg-black/40 text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <p className="text-xs font-black">{founder.shortName}</p>
                    <p className="text-[10px] text-zinc-400">{founder.badge}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* PIN INPUT OCULTO (Sin mostrar la clave en el texto) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  PIN Secreto de Fundador
                </label>
                <span className="text-[10px] text-zinc-400">4 dígitos confidenciales</span>
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
                  className={`w-full pl-10 pr-4 py-3.5 rounded-xl border bg-black/60 text-center tracking-[0.6em] text-xl font-black text-white focus:outline-none transition ${
                    loginError ? 'border-rose-500 text-rose-400 animate-shake' : 'border-white/[0.12] focus:border-purple-500'
                  }`}
                />
              </div>
              {loginError && (
                <p className="text-[11px] text-rose-400 font-bold mt-2 flex items-center gap-1.5">
                  <ShieldAlert size={14} /> PIN incorrecto. Clave protegida.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-emerald-500 hover:opacity-95 text-white text-xs font-black shadow-[0_0_25px_rgba(147,51,234,0.4)] transition active:scale-[0.98]"
            >
              Desbloquear Dashboard Financiero
            </button>
          </form>

          <div className="pt-2 border-t border-white/[0.06] text-[10px] text-zinc-400 flex items-center justify-center gap-2">
            <Lock size={12} className="text-emerald-400" /> Control Mancomunado · hazetech.co
          </div>
        </div>
      </div>
    )
  }

  const activeFounderObj = FOUNDERS.find(f => f.id === currentUser)!

  return (
    <div className="relative flex min-h-screen bg-[#040508] text-[#f4f4f8] selection:bg-purple-600/30 selection:text-purple-200">
      {/* Luces y Efecto Liquid Glass Ambiental */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-purple-900/15 via-emerald-950/10 to-transparent blur-[160px]" />
        <div className="absolute top-[60%] -left-[20%] w-[650px] h-[650px] bg-purple-950/15 blur-[180px]" />
        <div className="absolute top-[40%] -right-[20%] w-[650px] h-[650px] bg-emerald-950/10 blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Sidebar fijo en escritorio */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[265px] flex-col border-r border-white/[0.08] bg-[#07080f]/80 backdrop-blur-2xl lg:flex">
        {/* Logo Circular Oficial HAZE */}
        <div className="flex items-center gap-3.5 px-6 py-5 border-b border-white/[0.06]">
          <div className="relative size-11 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-violet-500 to-amber-500 shadow-[0_0_20px_rgba(16,185,129,0.35)] shrink-0">
            <div className="size-full rounded-full overflow-hidden bg-black">
              <Image
                src="/haze-logo-circle.png"
                alt="HAZE Logo"
                width={44}
                height={44}
                priority
                className="size-full object-cover"
              />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white">HAZE</span>
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              <span className="text-[11px] font-bold text-zinc-400">FINANCE</span>
            </div>
            <p className="text-[10px] font-bold tracking-wider uppercase text-purple-400 truncate">Founder OS · COP</p>
          </div>
        </div>

        {/* Menú de Navegación con Efecto Glass */}
        <div className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
          <div>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Módulos Financieros</p>
            <nav className="space-y-1">
              {[
                { id: 'resumen', label: 'Resumen Ejecutivo', icon: LayoutDashboard },
                { id: 'movimientos', label: 'Ingresos y Egresos', icon: ReceiptText },
                { id: 'inversiones', label: 'Inversiones & ROI', icon: TrendingUp, badge: 'PRO' },
                { id: 'pendientes', label: 'Lista de Compromisos', icon: ListTodo, count: tasks.filter(t => !t.completed).length },
                { id: 'aprobaciones', label: 'Pendientes de Firma', icon: FileCheck2, count: pendingMovements.length },
              ].map(item => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sounds.playPop()
                      setActiveTab(item.id as any)
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600/25 to-emerald-600/15 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.2)]'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={17} className={isActive ? 'text-emerald-400' : 'text-zinc-400'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-black text-[9px] border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span className="size-5 flex items-center justify-center rounded-full bg-amber-500 text-black text-[10px] font-black shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                        {item.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Reportería & Sistema</p>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  sounds.playPop()
                  setActiveTab('reportes')
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'reportes'
                    ? 'bg-gradient-to-r from-violet-600/25 to-emerald-600/15 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.2)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <BarChart3 size={17} className={activeTab === 'reportes' ? 'text-emerald-400' : 'text-zinc-400'} />
                <span>Reportes Financieros</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop()
                  setActiveTab('configuracion')
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'configuracion'
                    ? 'bg-gradient-to-r from-violet-600/25 to-emerald-600/15 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.2)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Settings2 size={17} className={activeTab === 'configuracion' ? 'text-emerald-400' : 'text-zinc-400'} />
                <span>Configuración & Claves</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Perfil del Fundador Autenticado */}
        <div className="p-4 border-t border-white/[0.06] bg-[#090a12]/70 space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-2xl liquid-glass">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-violet-600 text-xs font-black text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]">
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
              title="Bloquear sesión con PIN"
            >
              <LogOut size={15} />
            </button>
          </div>

          <div className="flex items-center justify-between px-1 text-[10px] text-zinc-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Conectado
            </span>
            <button
              onClick={handleLogout}
              className="text-purple-400 hover:underline font-bold"
            >
              Cambiar socio
            </button>
          </div>
        </div>
      </aside>

      {/* Contenedor Principal */}
      <div className="relative flex-1 lg:pl-[265px] flex flex-col min-w-0 z-10">
        {/* Header superior */}
        <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-white/[0.08] bg-[#040508]/85 px-4 md:px-8 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playPop()
                setMobileMenuOpen(true)
              }}
              className="p-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full overflow-hidden border border-white/[0.1] lg:hidden">
                <Image src="/haze-logo-circle.png" alt="Logo" width={32} height={32} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    {currentTimeDisplay || 'Barranquilla · COP'}
                  </span>
                </div>
                <h1 className="text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Dashboard Financiero</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                    Liquid Pro
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Toggle de Sonido */}
            <button
              onClick={() => {
                const next = sounds.toggle()
                setSoundEnabled(next)
                notify(next ? 'Sonidos activados 🔊' : 'Sonidos desactivados 🔇')
              }}
              className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white transition"
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar efectos de sonido'}
            >
              {soundEnabled ? <Volume2 size={16} className="text-emerald-400" /> : <VolumeX size={16} />}
            </button>

            {/* Indicador de Fundador Activo */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs">
              <UserCheck size={14} className="text-emerald-400" />
              <span className="font-bold text-white">{activeFounderObj.shortName}</span>
              <button
                onClick={handleLogout}
                className="ml-1 text-[10px] text-purple-400 hover:underline"
              >
                (Cambiar)
              </button>
            </div>

            <button
              onClick={() => {
                sounds.playPop()
                setShowModal(true)
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-violet-600 to-fuchsia-600 hover:opacity-95 text-white text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition active:scale-[0.98]"
            >
              <Plus size={16} />
              <span>Nuevo movimiento</span>
            </button>
          </div>
        </header>

        {/* VISTAS PRINCIPALES */}
        <main className="flex-1 p-4 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
          {/* SECCIÓN 1: RESUMEN EJECUTIVO */}
          {activeTab === 'resumen' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Hero Liquid Glass */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 rounded-3xl liquid-glass liquid-glass-accent">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    Protocolo de Doble Firma Mancomunada Activo (Luis & Yoinner)
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                    Finanzas & Capital <span className="bg-gradient-to-r from-emerald-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Haze Technologies</span>
                  </h2>
                  <p className="mt-1 text-xs md:text-sm text-zinc-400 max-w-xl">
                    Control mancomunado en Pesos (COP). Retornos de inversión, compromisos financieros y auditoría en tiempo real.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sounds.playPop()
                      setShowBalance(!showBalance)
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-semibold text-zinc-300 hover:text-white transition"
                  >
                    {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{showBalance ? 'Ocultar balance' : 'Mostrar balance'}</span>
                  </button>
                </div>
              </div>

              {/* 4 Métricas Principales en PESOS (COP) con Liquid Glass */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Balance Disponible */}
                <div className="p-5 rounded-3xl liquid-glass hover:border-emerald-500/40 transition shadow-lg relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Balance Disponible</p>
                    <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">
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
                <div className="p-5 rounded-3xl liquid-glass hover:border-emerald-500/40 transition shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Ingresos Validados</p>
                    <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">
                      {showBalance ? formatCOP(totalIncome) : '••••••••'}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-400">
                      {approvedMovements.filter(m => m.type === 'Ingreso').length} ingresos con firma mutua
                    </p>
                  </div>
                </div>

                {/* Egresos Aprobados */}
                <div className="p-5 rounded-3xl liquid-glass hover:border-rose-500/40 transition shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Egresos Validados</p>
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

                {/* Inversión & ROI Global */}
                <div
                  onClick={() => {
                    sounds.playPop()
                    setActiveTab('inversiones')
                  }}
                  className="p-5 rounded-3xl liquid-glass hover:border-violet-500/40 transition shadow-lg relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-purple-300">ROI Inversiones</p>
                    <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/20 text-purple-400">
                      <TrendingUp size={18} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className={`text-xl sm:text-2xl font-black tracking-tight ${investmentStats.overallROI >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {investmentStats.overallROI > 0 ? '+' : ''}{investmentStats.overallROI.toFixed(1)}%
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-400">
                      {investments.length} etapas · {investmentStats.multiple.toFixed(2)}x retorno
                    </p>
                  </div>
                </div>
              </div>

              {/* Gráficas: Flujo en COP & Distribución */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Flujo de Caja Semestral SVG Interactivo */}
                <div className="xl:col-span-2 p-6 rounded-3xl liquid-glass space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-white">Flujo de Caja · Semestral (COP)</p>
                      <p className="text-xs text-zinc-400">Ingresos vs. Egresos conciliados</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                        <span>Ingresos</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-fuchsia-400">
                        <span className="size-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" />
                        <span>Egresos</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 pb-2">
                    <div className="flex items-end justify-between gap-3 h-[210px] border-b border-white/[0.08] px-2">
                      {['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct'].map(month => {
                        const isCurrent = month === 'Oct'
                        const incomeHeight = isCurrent && totalIncome > 0 ? 'h-36' : 'h-3'
                        const expenseHeight = isCurrent && totalExpense > 0 ? 'h-24' : 'h-3'
                        return (
                          <div key={month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                            <div className="flex items-end gap-1.5 h-full">
                              <div
                                className={`w-3.5 sm:w-5 rounded-t-lg bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400 transition-all ${incomeHeight} group-hover:brightness-125 shadow-[0_0_15px_rgba(16,185,129,0.25)]`}
                                title={`Ingresos ${month}: ${isCurrent ? formatCOP(totalIncome) : '$ 0 COP'}`}
                              />
                              <div
                                className={`w-3.5 sm:w-5 rounded-t-lg bg-gradient-to-t from-fuchsia-600 to-pink-500 transition-all ${expenseHeight} group-hover:brightness-125 shadow-[0_0_15px_rgba(217,70,239,0.25)]`}
                                title={`Egresos ${month}: ${isCurrent ? formatCOP(totalExpense) : '$ 0 COP'}`}
                              />
                            </div>
                            <span className={`text-[11px] font-semibold ${isCurrent ? 'text-emerald-400 font-bold' : 'text-zinc-400'}`}>
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
                <div className="p-6 rounded-3xl liquid-glass flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-white">Distribución de Gastos</p>
                        <p className="text-xs text-zinc-400">Porcentajes en Pesos (COP)</p>
                      </div>
                      <CircleDollarSign size={20} className="text-emerald-400" />
                    </div>

                    <div className="my-6 flex items-center justify-center">
                      <div className="relative flex size-[155px] items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500/20 via-violet-500/20 to-fuchsia-500/20 p-3 border border-white/[0.08] shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                        <div className="flex size-full flex-col items-center justify-center rounded-full bg-[#05060c] border border-white/[0.06] shadow-inner text-center">
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

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-zinc-400">
                    Líneas de negocio: HazeCard NFC, Software SaaS, Negocio Aparte y Proyectos de Inversión.
                  </div>
                </div>
              </div>

              {/* Mini Widget de Compromisos y Tareas Financieras */}
              <div className="p-6 rounded-3xl liquid-glass space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ListTodo className="text-emerald-400" size={18} />
                    <div>
                      <h3 className="text-sm font-black text-white">Compromisos & Tareas Financieras</h3>
                      <p className="text-xs text-zinc-400">Pendientes inmediatos para los fundadores</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playPop()
                      setShowTaskModal(true)
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-purple-200 text-xs font-bold transition"
                  >
                    <Plus size={14} /> Agregar Pendiente
                  </button>
                </div>

                {tasks.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-3 italic text-center">
                    No hay compromisos anotados. Agrega pagos, facturas o tareas por realizar con el botón superior.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                          task.completed
                            ? 'border-emerald-500/20 bg-emerald-950/10 opacity-60'
                            : 'border-white/[0.08] bg-black/40 hover:border-purple-500/40'
                        }`}
                      >
                        <div className={`mt-0.5 size-4 rounded-md border flex items-center justify-center ${
                          task.completed ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-400'
                        }`}>
                          {task.completed && <Check size={12} strokeWidth={3} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold ${task.completed ? 'line-through text-zinc-400' : 'text-white'}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400">
                            {task.estimatedAmount && <span className="font-semibold text-emerald-400">{formatCOP(task.estimatedAmount)}</span>}
                            <span>Para: {task.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECCIÓN 2: INGRESOS Y EGRESOS */}
          {activeTab === 'movimientos' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl liquid-glass">
                <div>
                  <h2 className="text-xl font-black text-white">Registro de Ingresos y Egresos (COP)</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Historial de todas las solicitudes, hora de registro automática y control mancomunado.
                  </p>
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
                    onClick={() => {
                      sounds.playPop()
                      setShowModal(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg transition"
                  >
                    <Plus size={15} />
                    <span>Nuevo Movimiento</span>
                  </button>
                </div>
              </div>

              {/* Filtros */}
              <div className="p-4 rounded-3xl liquid-glass flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
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
                        onClick={() => {
                          sounds.playPop()
                          setTypeFilter(tab)
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          typeFilter === tab ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Listado */}
              <div className="rounded-3xl liquid-glass overflow-hidden">
                {filteredMovements.length === 0 ? (
                  <div className="py-20 px-4 text-center">
                    <ReceiptText size={32} className="mx-auto text-zinc-400 mb-3" />
                    <p className="text-sm font-bold text-white">No hay movimientos registrados</p>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                      Registra una operación financiera para que ambos fundadores (Luis y Yoinner) la firmen.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#080911]/90 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-white/[0.06]">
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
                              <p className="font-mono text-[11px] font-bold text-purple-400">{m.id}</p>
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

          {/* SECCIÓN 3: INVERSIONES & RETORNO DE GANANCIAS (ROI) */}
          {activeTab === 'inversiones' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl liquid-glass liquid-glass-accent">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    <TrendingUp size={12} /> Capital Invertido & Retorno de Ganancias
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white">Inversiones por Etapa (ROI)</h2>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                    Invertimos dinero extraído del balance para producir lotes, escalar software o impulsar negocios. Aquí calculamos exactamente cuánto porcentaje de retorno y beneficio estamos generando.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sounds.playPop()
                    setShowInvestmentModal(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition"
                >
                  <Plus size={16} />
                  <span>+ Invertir en Nueva Etapa</span>
                </button>
              </div>

              {/* Métricas de Rendimiento de Inversiones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl liquid-glass">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Invertido</p>
                  <p className="text-xl font-black text-white mt-2">{formatCOP(investmentStats.totalInvested)}</p>
                  <p className="text-[10px] text-zinc-400 mt-1">Extraído del balance para proyectos</p>
                </div>

                <div className="p-5 rounded-3xl liquid-glass">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Retornado</p>
                  <p className="text-xl font-black text-emerald-400 mt-2">{formatCOP(investmentStats.totalReturned)}</p>
                  <p className="text-[10px] text-zinc-400 mt-1">Ganancias brutas ingresadas</p>
                </div>

                <div className="p-5 rounded-3xl liquid-glass">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Ganancia Neta</p>
                  <p className={`text-xl font-black mt-2 ${investmentStats.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {investmentStats.netProfit >= 0 ? '+' : ''}{formatCOP(investmentStats.netProfit)}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">Beneficio neto para los fundadores</p>
                </div>

                <div className="p-5 rounded-3xl liquid-glass">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">ROI Global & Múltiplo</p>
                  <p className={`text-xl font-black mt-2 ${investmentStats.overallROI >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {investmentStats.overallROI >= 0 ? '+' : ''}{investmentStats.overallROI.toFixed(1)}% ({investmentStats.multiple.toFixed(2)}x)
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">Rendimiento global sobre capital</p>
                </div>
              </div>

              {/* Lista de Inversiones Activas */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-white">Etapas y Proyectos en Inversión</h3>

                {investments.length === 0 ? (
                  <div className="py-20 px-4 text-center rounded-3xl liquid-glass">
                    <TrendingUp size={36} className="mx-auto text-emerald-400/60 mb-3" />
                    <p className="text-base font-bold text-white">Aún no hay etapas de inversión registradas</p>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                      Comienza registrando la primera inversión en un lote de HazeCards, desarrollo de software o negocio aparte para medir su retorno y porcentaje de ganancia.
                    </p>
                    <button
                      onClick={() => {
                        sounds.playPop()
                        setShowInvestmentModal(true)
                      }}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition"
                    >
                      <Plus size={14} /> Invertir primer capital
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {investments.map(inv => {
                      const recoveryPercent = inv.investedAmount > 0 ? Math.min(100, Math.round((inv.returnedAmount / inv.investedAmount) * 100)) : 0
                      const roi = inv.investedAmount > 0 ? (((inv.returnedAmount - inv.investedAmount) / inv.investedAmount) * 100).toFixed(1) : '0.0'
                      const profit = inv.returnedAmount - inv.investedAmount

                      return (
                        <div key={inv.id} className="p-6 rounded-3xl liquid-glass space-y-4 relative overflow-hidden">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-purple-400">{inv.id}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-300 border border-white/[0.06]">
                                  {inv.stage}
                                </span>
                              </div>
                              <h4 className="text-base font-black text-white mt-1">{inv.projectName}</h4>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                              inv.status === 'Rentable'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                                : inv.status === 'Recuperando'
                                ? 'bg-teal-950/60 text-teal-300 border border-teal-500/30'
                                : 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                            }`}>
                              {inv.status}
                            </span>
                          </div>

                          {/* Comparativa Invertido vs Retornado */}
                          <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-black/40 border border-white/[0.04] text-xs">
                            <div>
                              <p className="text-[10px] text-zinc-400">Capital Invertido:</p>
                              <p className="font-black text-white">{formatCOP(inv.investedAmount)}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-zinc-400">Retorno Recaudado:</p>
                              <p className="font-black text-emerald-400">{formatCOP(inv.returnedAmount)}</p>
                            </div>
                          </div>

                          {/* Barra de Progreso de Retorno */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="text-[11px] text-zinc-400">Recuperación de Capital:</span>
                              <span className="font-bold text-white">{recoveryPercent}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 transition-all shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                style={{ width: `${recoveryPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Métricas de Ganancia Neta y ROI */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                            <div>
                              <p className="text-[10px] text-zinc-400">Ganancia Neta:</p>
                              <p className={`font-black ${profit >= 0 ? 'text-emerald-400' : 'text-zinc-300'}`}>
                                {profit >= 0 ? '+' : ''}{formatCOP(profit)}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-[10px] text-zinc-400">Retorno (ROI):</p>
                              <p className={`font-black text-sm ${parseFloat(roi) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {parseFloat(roi) >= 0 ? '+' : ''}{roi}%
                              </p>
                            </div>
                          </div>

                          {/* Botón para ingresar ganancia / retorno */}
                          <button
                            onClick={() => {
                              sounds.playPop()
                              setSelectedInvestmentForReturn(inv)
                              setShowReturnModal(true)
                            }}
                            className="w-full py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition flex items-center justify-center gap-2"
                          >
                            <DollarSign size={14} /> + Registrar Retorno o Ganancia
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECCIÓN 4: LISTA DE PENDIENTES & COMPROMISOS FINANCIEROS */}
          {activeTab === 'pendientes' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl liquid-glass">
                <div>
                  <h2 className="text-xl font-black text-white">Lista de Compromisos & Pendientes Financieros</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Anota pagos de proveedores, cobros por realizar, renovaciones de software y pendientes de Luis y Yoinner.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sounds.playPop()
                    setShowTaskModal(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg transition"
                >
                  <Plus size={16} />
                  <span>+ Agregar Pendiente</span>
                </button>
              </div>

              {/* Filtro de tareas */}
              <div className="flex items-center gap-2">
                {(['Todos', 'Pendientes', 'Completados'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => {
                      sounds.playPop()
                      setTaskFilter(tab)
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      taskFilter === tab
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Lista */}
              {filteredTasks.length === 0 ? (
                <div className="py-20 px-4 text-center rounded-3xl liquid-glass">
                  <ListTodo size={36} className="mx-auto text-zinc-400 mb-3" />
                  <p className="text-base font-bold text-white">No hay pendientes en esta vista</p>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
                    Crea un nuevo compromiso o pago futuro para mantener organizada la operación financiera de HAZE.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map(task => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl liquid-glass flex items-center justify-between gap-4 transition ${
                        task.completed ? 'opacity-60 bg-white/[0.01]' : 'hover:border-purple-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`size-6 rounded-lg border flex items-center justify-center transition shrink-0 ${
                            task.completed
                              ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                              : 'border-white/[0.2] bg-black/40 hover:border-purple-500'
                          }`}
                        >
                          {task.completed && <Check size={14} strokeWidth={3} />}
                        </button>
                        <div className="min-w-0">
                          <p className={`text-sm font-bold ${task.completed ? 'line-through text-zinc-400' : 'text-white'}`}>
                            {task.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-zinc-400">
                            {task.estimatedAmount && (
                              <span className="font-semibold text-emerald-400">
                                {formatCOP(task.estimatedAmount)}
                              </span>
                            )}
                            <span>·</span>
                            <span>Asignado: <b className="text-zinc-200">{task.assignedTo}</b></span>
                            {task.dueDate && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1 text-purple-300">
                                  <Calendar size={11} /> {task.dueDate}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          task.priority === 'Alta'
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                            : task.priority === 'Media'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {task.priority}
                        </span>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/[0.05] transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECCIÓN 5: PENDIENTES DE DOBLE APROBACIÓN */}
          {activeTab === 'aprobaciones' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 rounded-3xl liquid-glass flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full border border-amber-500/30 bg-amber-950/30 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    <Lock size={12} /> Requiere Ambas Firmas (Luis & Yoinner)
                  </div>
                  <h2 className="text-xl font-black text-white">Centro de Doble Aprobación</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Estás conectado como <b className="text-purple-300">{activeFounderObj.name}</b>. Puedes validar tus firmas correspondientes.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-bold text-zinc-300">
                    {pendingMovements.length} por validar
                  </span>
                </div>
              </div>

              {pendingMovements.length === 0 ? (
                <div className="py-20 px-4 text-center rounded-3xl liquid-glass">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 mb-3">
                    <CheckCircle2 size={28} />
                  </div>
                  <p className="text-base font-bold text-white">No hay operaciones pendientes de firma</p>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                    Todos los ingresos y egresos registrados ya cuentan con la aprobación mutua de Luis y Yoinner y se reflejan en el balance.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingMovements.map(item => (
                    <div
                      key={item.id}
                      className="p-5 rounded-3xl liquid-glass space-y-4 shadow-lg hover:border-violet-500/40 transition"
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

                      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.04] space-y-1.5 text-xs">
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
                          <span className="font-semibold text-purple-300">{item.registeredBy}</span>
                        </div>
                        <div className="pt-1.5 border-t border-white/[0.06]">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Justificación:</p>
                          <p className="text-[11px] text-zinc-300 mt-0.5 italic">&ldquo;{item.justification}&rdquo;</p>
                        </div>
                      </div>

                      {/* Firmas requeridas */}
                      <div className="pt-2 border-t border-white/[0.06] space-y-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          Firmas Mancomunadas Requeridas
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {/* Luis Alfonso */}
                          <div className={`p-2.5 rounded-xl border ${currentUser === 'luis' ? 'border-purple-500/50 bg-purple-950/30' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[11px] font-bold text-white">Luis Alfonso</p>
                              {currentUser === 'luis' && <span className="text-[9px] text-emerald-400 font-bold">Tú</span>}
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

                          {/* Yoinner */}
                          <div className={`p-2.5 rounded-xl border ${currentUser === 'yoinner' ? 'border-purple-500/50 bg-purple-950/30' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-[11px] font-bold text-white">Yoinner</p>
                              {currentUser === 'yoinner' && <span className="text-[9px] text-emerald-400 font-bold">Tú</span>}
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

                        {((currentUser === 'luis' && item.approvals.yoinner === 'Pendiente') ||
                          (currentUser === 'yoinner' && item.approvals.luis === 'Pendiente')) && (
                          <div className="text-[10px] text-zinc-400 text-center pt-1">
                            Falta la firma del otro fundador.{' '}
                            <button
                              onClick={handleLogout}
                              className="text-purple-400 font-bold hover:underline"
                            >
                              Cambiar socio (PIN)
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

          {/* SECCIÓN 6: REPORTES */}
          {activeTab === 'reportes' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 rounded-3xl liquid-glass flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white">Reportes Financieros · Haze Technologies</h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Consolidado de operaciones con doble aprobación expresadas en Pesos Colombianos (COP).
                  </p>
                </div>
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg transition"
                >
                  <Download size={15} />
                  <span>Descargar Balance (CSV)</span>
                </button>
              </div>

              {/* KPIs de Rendimiento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl liquid-glass">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Margen Operativo Neto</p>
                  <p className="text-2xl font-black text-white mt-2">
                    {totalIncome > 0 ? `${(((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)}%` : '0.0%'}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">Margen real sobre ingresos aprobados</p>
                </div>

                <div className="p-5 rounded-3xl liquid-glass">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Ingresos COP</p>
                  <p className="text-2xl font-black text-emerald-400 mt-2">{formatCOP(totalIncome)}</p>
                  <p className="text-[11px] text-zinc-400 mt-1">Validado por ambos fundadores</p>
                </div>

                <div className="p-5 rounded-3xl liquid-glass">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Egresos COP</p>
                  <p className="text-2xl font-black text-rose-400 mt-2">{formatCOP(totalExpense)}</p>
                  <p className="text-[11px] text-zinc-400 mt-1">Costos y operaciones aprobadas</p>
                </div>
              </div>

              {/* Desglose por Línea */}
              <div className="p-6 rounded-3xl liquid-glass space-y-4">
                <h3 className="text-sm font-black text-white">Desglose por Líneas de Negocio HAZE</h3>
                <div className="space-y-3">
                  {[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES.slice(0, 4)].map(cat => {
                    const count = approvedMovements.filter(m => m.category === cat).length
                    const sum = approvedMovements
                      .filter(m => m.category === cat)
                      .reduce((acc, m) => acc + (m.type === 'Ingreso' ? m.amount : -m.amount), 0)
                    return (
                      <div key={cat} className="flex items-center justify-between p-3.5 rounded-2xl border border-white/[0.04] bg-white/[0.01]">
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

          {/* SECCIÓN 7: CONFIGURACIÓN & CLAVES (OCULTAS) */}
          {activeTab === 'configuracion' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 rounded-3xl liquid-glass">
                <h2 className="text-xl font-black text-white">Configuración del CRM & Credenciales</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Parámetros de acceso, claves confidenciales y protocolo mancomunado.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Claves Protegidas */}
                <div className="p-6 rounded-3xl liquid-glass space-y-4">
                  <div className="flex items-center gap-3">
                    <KeyRound className="text-emerald-400" size={20} />
                    <h3 className="text-sm font-bold text-white">Claves de Fundadores</h3>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Luis Alfonso Herrera</p>
                        <p className="text-[10px] text-zinc-400">Co-Fundador · Administrador</p>
                      </div>
                      <span className="font-mono text-xs font-black text-purple-300 bg-purple-950/60 px-3 py-1 rounded-xl border border-purple-500/30">
                        PIN: ••••
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white">Yoinner Gándara</p>
                        <p className="text-[10px] text-zinc-400">Co-Fundador · Administrador</p>
                      </div>
                      <span className="font-mono text-xs font-black text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-500/30">
                        PIN: ••••
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reglas del Sistema */}
                <div className="p-6 rounded-3xl liquid-glass space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="text-purple-400" size={20} />
                    <h3 className="text-sm font-bold text-white">Parámetros Financieros</h3>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-zinc-400 font-medium">Moneda Activa:</p>
                      <p className="text-white font-bold text-sm">Pesos Colombianos (COP - $)</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-zinc-400 font-medium">Registro Temporal:</p>
                      <p className="text-white font-bold">100% Automático al instante de guardar (sin captura manual)</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-zinc-400 font-medium">Condición de Balance:</p>
                      <p className="text-white font-bold">Requiere aprobación mutua de Luis y Yoinner</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: NUEVO MOVIMIENTO FINANCIERO (Fecha y hora automáticas) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl liquid-glass p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
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

            <div className="p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 flex items-center gap-2.5 text-xs text-emerald-200">
              <Clock size={16} className="text-emerald-400 shrink-0" />
              <span>
                <b>Hora y fecha automáticas:</b> Se registrará al instante ({currentTimeDisplay || 'en tiempo real'}) sin pedir fecha manual.
              </span>
            </div>

            <form onSubmit={handleCreateMovement} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Tipo de Movimiento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop()
                      setFormData({ ...formData, type: 'Ingreso' })
                    }}
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
                    onClick={() => {
                      sounds.playPop()
                      setFormData({ ...formData, type: 'Egreso' })
                    }}
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

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Concepto o Descripción <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.concept}
                  onChange={e => setFormData({ ...formData, concept: e.target.value })}
                  placeholder="Ej. Venta lote HazeCard / Contrato Web SaaS / Pago AWS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500"
                />
              </div>

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

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Justificación para el otro socio <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.justification}
                  onChange={e => setFormData({ ...formData, justification: e.target.value })}
                  placeholder="Detalla el motivo del gasto o la procedencia del ingreso para mutuo acuerdo..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-violet-600 to-fuchsia-600 hover:opacity-95 text-white text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.4)] transition"
                >
                  Guardar con Hora Actual y Enviar para Doble Firma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: NUEVA INVERSIÓN POR ETAPA */}
      {showInvestmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl liquid-glass p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-base font-black text-white">Invertir Capital en Nueva Etapa</h3>
                <p className="text-xs text-zinc-400">Extrae dinero del balance para generar retorno y ganancia.</p>
              </div>
              <button
                onClick={() => setShowInvestmentModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvestment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Nombre del Proyecto o Etapa</label>
                <input
                  type="text"
                  required
                  value={investForm.projectName}
                  onChange={e => setInvestForm({ ...investForm, projectName: e.target.value })}
                  placeholder="Ej. Producción Lote HazeCard v2 / Nueva Plataforma SaaS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">Fase / Etapa</label>
                  <select
                    value={investForm.stage}
                    onChange={e => setInvestForm({ ...investForm, stage: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0d16] text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Fase Semilla">Fase Semilla</option>
                    <option value="Desarrollo & Prototipo">Desarrollo & Prototipo</option>
                    <option value="Producción Lote">Producción Lote</option>
                    <option value="Escalamiento & Ventas">Escalamiento & Ventas</option>
                    <option value="Maduración">Maduración</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">Capital Extraído</label>
                  <select
                    value={investForm.investor}
                    onChange={e => setInvestForm({ ...investForm, investor: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0d16] text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Ambos (Capital HAZE)">Ambos (Capital HAZE)</option>
                    <option value="Luis Alfonso Herrera">Luis Alfonso Herrera</option>
                    <option value="Yoinner Gándara">Yoinner Gándara</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Monto Invertido en Pesos (COP)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">$ COP</span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={investForm.investedAmount}
                    onChange={e => setInvestForm({ ...investForm, investedAmount: e.target.value })}
                    placeholder="2.000.000"
                    className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Notas y Proyección de Retorno</label>
                <textarea
                  rows={2}
                  value={investForm.notes}
                  onChange={e => setInvestForm({ ...investForm, notes: e.target.value })}
                  placeholder="Estimación de ganancias esperadas, clientes pactados o detalles de inversión..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition"
              >
                Inyectar Capital y Enviar a Doble Firma
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REGISTRAR RETORNO DE GANANCIA */}
      {showReturnModal && selectedInvestmentForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl liquid-glass p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-base font-black text-white">Registrar Retorno / Ganancia</h3>
                <p className="text-xs text-zinc-400">Sobre: {selectedInvestmentForReturn.projectName}</p>
              </div>
              <button
                onClick={() => setShowReturnModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterReturn} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Monto de Retorno o Ganancia (COP)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">$ COP</span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={returnForm.returnAmount}
                    onChange={e => setReturnForm({ ...returnForm, returnAmount: e.target.value })}
                    placeholder="500.000"
                    className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Detalles del Retorno</label>
                <textarea
                  rows={2}
                  value={returnForm.notes}
                  onChange={e => setReturnForm({ ...returnForm, notes: e.target.value })}
                  placeholder="Venta del lote completada, pago cliente fase 2, dividendos..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition"
              >
                Acreditar Ganancia al Proyecto
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: NUEVO PENDIENTE / COMPROMISO */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl liquid-glass p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-base font-black text-white">Nuevo Compromiso Financiero</h3>
                <p className="text-xs text-zinc-400">Anota una tarea, cobro o pago pendiente.</p>
              </div>
              <button onClick={() => setShowTaskModal(false)} className="p-1.5 rounded-lg text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Título del Pendiente</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Ej. Pagar servidores AWS / Facturar cliente HazeCard"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">Prioridad</label>
                  <select
                    value={taskForm.priority}
                    onChange={e => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0d16] text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">Asignado a</label>
                  <select
                    value={taskForm.assignedTo}
                    onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0d16] text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Ambos">Ambos</option>
                    <option value="Luis">Luis</option>
                    <option value="Yoinner">Yoinner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Monto Estimado en COP (Opcional)</label>
                <input
                  type="number"
                  step="1"
                  value={taskForm.estimatedAmount}
                  onChange={e => setTaskForm({ ...taskForm, estimatedAmount: e.target.value })}
                  placeholder="$ 0 COP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-black/40 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">Fecha Límite Estimada (Opcional)</label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-white/[0.08] bg-[#0c0d16] text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-black shadow-[0_0_20px_rgba(147,51,234,0.3)] transition"
              >
                Añadir Compromiso
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER MÓVIL */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/80 backdrop-blur-md">
          <div className="relative w-72 bg-[#07080f] p-5 border-r border-white/[0.08] flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full overflow-hidden border border-white/[0.1]">
                    <Image src="/haze-logo-circle.png" alt="Logo" width={32} height={32} />
                  </div>
                  <span className="font-black text-sm text-white">HAZE<span className="text-emerald-400">.</span>CO</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="mb-4 p-3 rounded-2xl liquid-glass text-xs">
                <p className="text-[10px] text-zinc-400">Fundador activo:</p>
                <p className="font-bold text-white">{activeFounderObj.name}</p>
                <button onClick={handleLogout} className="text-[10px] text-purple-400 hover:underline mt-1 block font-semibold">
                  Cambiar usuario (PIN)
                </button>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'resumen', label: 'Resumen', icon: LayoutDashboard },
                  { id: 'movimientos', label: 'Ingresos y Egresos', icon: ReceiptText },
                  { id: 'inversiones', label: 'Inversiones & ROI', icon: TrendingUp },
                  { id: 'pendientes', label: `Compromisos (${tasks.filter(t => !t.completed).length})`, icon: ListTodo },
                  { id: 'aprobaciones', label: `Pendientes Firma (${pendingMovements.length})`, icon: FileCheck2 },
                  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
                  { id: 'configuracion', label: 'Configuración', icon: Settings2 },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        sounds.playPop()
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
              <p className="font-bold text-white">HAZE Technologies</p>
              <p className="text-[10px]">Barranquilla, Colombia</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* TOAST FLOTANTE */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl liquid-glass border border-emerald-500/30 text-white text-xs font-semibold shadow-[0_0_25px_rgba(16,185,129,0.35)] animate-bounce-subtle">
          <Sparkles size={16} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}
