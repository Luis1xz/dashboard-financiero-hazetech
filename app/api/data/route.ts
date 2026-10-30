import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Memoria volátil de respaldo en el runtime
let memoryDb: any = null

function getDbFilePath(): string {
  // En local o contenedor con disco escribible: ./data/haze-db.json
  const localDataDir = path.join(process.cwd(), 'data')
  try {
    if (!fs.existsSync(localDataDir)) {
      fs.mkdirSync(localDataDir, { recursive: true })
    }
    return path.join(localDataDir, 'haze-db.json')
  } catch {
    // Si falla (por ejemplo en Vercel Serverless read-only), usamos /tmp
    return path.join('/tmp', 'haze-db.json')
  }
}

const DEFAULT_DB = {
  movements: [
    {
      id: 'HAZE-910245',
      type: 'Ingreso',
      concept: 'Inyección de Capital Fundadores · Fase Semilla HAZE',
      amount: 15000000,
      category: 'Capital Propio de Fundadores',
      sourceDestination: 'Bancolombia HAZE Tech',
      justification: 'Aporte de capital semilla para desarrollo y operaciones iniciales.',
      date: '28/10/2026',
      time: '09:00 a. m.',
      timestamp: 1793167200000,
      registeredBy: 'Luis Alfonso Herrera',
      status: 'Aprobado',
      approvals: {
        luis: 'Aprobado',
        yoinner: 'Aprobado',
      },
    },
    {
      id: 'HAZE-834912',
      type: 'Ingreso',
      concept: 'Recaudo Facturación HazeCard NFC Pro',
      amount: 1850000,
      category: 'Venta HazeCard NFC',
      sourceDestination: 'Pasarela Stripe / Wompi',
      justification: 'Venta de lotes empresariales de tarjetas inteligentes NFC.',
      date: '29/10/2026',
      time: '11:30 a. m.',
      timestamp: 1793262600000,
      registeredBy: 'Yoinner Gándara',
      status: 'Aprobado',
      approvals: {
        luis: 'Aprobado',
        yoinner: 'Aprobado',
      },
    },
    {
      id: 'HAZE-742918',
      type: 'Ingreso',
      concept: 'Suscripciones Mensuales Plataforma Hazetech.co',
      amount: 3200000,
      category: 'Desarrollo Software / SaaS',
      sourceDestination: 'Bancolombia HAZE Tech',
      justification: 'Planes empresariales recurrentes de software.',
      date: '29/10/2026',
      time: '03:15 p. m.',
      timestamp: 1793276100000,
      registeredBy: 'Luis Alfonso Herrera',
      status: 'Aprobado',
      approvals: {
        luis: 'Aprobado',
        yoinner: 'Aprobado',
      },
    },
    {
      id: 'HAZE-621849',
      type: 'Egreso',
      concept: 'Infraestructura Cloud, Hosting & Servidores AWS/Vercel',
      amount: 450000,
      category: 'Infraestructura Tecnológica & Servidores',
      sourceDestination: 'HazeCard NFC Débito',
      justification: 'Renovación de servidores y dominios corporativos hazetech.co.',
      date: '29/10/2026',
      time: '05:40 p. m.',
      timestamp: 1793284800000,
      registeredBy: 'Yoinner Gándara',
      status: 'Aprobado',
      approvals: {
        luis: 'Aprobado',
        yoinner: 'Aprobado',
      },
    },
  ],
  investments: [
    {
      id: 'INV-101',
      projectName: 'Producción y Chips NFC HazeCard Platinum',
      stage: 'Fase Semilla',
      investedAmount: 5000000,
      returnedAmount: 11000000,
      investor: 'Ambos (Capital HAZE)',
      date: '15/10/2026',
      time: '10:00 a. m.',
      status: 'Completado',
      notes: 'Inversión en manufactura de tarjetas NFC de lujo con tecnología de contacto.',
    },
    {
      id: 'INV-102',
      projectName: 'Plataforma SaaS hazetech.co & CRM Fundadores',
      stage: 'Crecimiento Inicial',
      investedAmount: 3500000,
      returnedAmount: 5200000,
      investor: 'Ambos (Capital HAZE)',
      date: '20/10/2026',
      time: '02:30 p. m.',
      status: 'En Ejecución',
      notes: 'Desarrollo del motor de software y pasarelas de pago automatizadas.',
    },
  ],
  tasks: [
    {
      id: 'TASK-1',
      title: 'Conciliar corte semanal de ventas HazeCard NFC',
      estimatedAmount: 2500000,
      priority: 'Alta',
      assignedTo: 'Ambos',
      completed: false,
      dueDate: '2026-11-05',
      createdAt: '29/10/2026',
    },
    {
      id: 'TASK-2',
      title: 'Aprobar pago de licencias de desarrollo y dominios hazetech.co',
      estimatedAmount: 450000,
      priority: 'Media',
      assignedTo: 'Luis',
      completed: true,
      dueDate: '2026-10-31',
      createdAt: '28/10/2026',
    },
    {
      id: 'TASK-3',
      title: 'Revisión de retorno de ganancias para reinversión en inventario',
      estimatedAmount: 6000000,
      priority: 'Alta',
      assignedTo: 'Yoinner',
      completed: false,
      dueDate: '2026-11-10',
      createdAt: '29/10/2026',
    },
  ],
  notifications: [
    {
      id: 'NOTIF-INIT-1',
      title: '💎 Base de Datos Permanente Conectada',
      message: 'Todos los registros financieros, inversiones y firmas de Luis y Yoinner quedan respaldados permanentemente.',
      time: 'Ahora',
      timestamp: Date.now(),
      type: 'approved',
      amount: 15000000,
      read: false,
    },
  ],
}

function readData() {
  if (memoryDb) return memoryDb

  const filePath = getDbFilePath()
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8')
      const parsed = JSON.parse(raw)
      memoryDb = parsed
      return parsed
    }
  } catch (err) {
    console.warn('Error reading db file:', err)
  }

  // Si no existe, inicializamos con los valores por defecto
  writeData(DEFAULT_DB)
  return DEFAULT_DB
}

function writeData(data: any) {
  memoryDb = data
  const filePath = getDbFilePath()
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
  } catch (err) {
    // Si falla en ruta normal, intenta en /tmp
    try {
      fs.writeFileSync(path.join('/tmp', 'haze-db.json'), JSON.stringify(data, null, 2), 'utf8')
    } catch {}
  }
}

export async function GET() {
  const data = readData()
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const current = readData()

    // Realizar un merge inteligente por IDs para que NADA se sobreescriba ni se borre
    const mergedMovements = [...(body.movements || [])]
    // Asegurar que movimientos previos que no venían en el payload no se pierdan
    current.movements?.forEach((existing: any) => {
      if (!mergedMovements.some((m: any) => m.id === existing.id)) {
        mergedMovements.push(existing)
      }
    })

    const mergedInvestments = [...(body.investments || [])]
    current.investments?.forEach((existing: any) => {
      if (!mergedInvestments.some((inv: any) => inv.id === existing.id)) {
        mergedInvestments.push(existing)
      }
    })

    const mergedTasks = [...(body.tasks || [])]
    current.tasks?.forEach((existing: any) => {
      if (!mergedTasks.some((t: any) => t.id === existing.id)) {
        mergedTasks.push(existing)
      }
    })

    const mergedNotifications = [...(body.notifications || [])]
    current.notifications?.forEach((existing: any) => {
      if (!mergedNotifications.some((n: any) => n.id === existing.id)) {
        mergedNotifications.push(existing)
      }
    })

    const updatedData = {
      movements: mergedMovements,
      investments: mergedInvestments,
      tasks: mergedTasks,
      notifications: mergedNotifications.slice(0, 50), // Mantener las 50 más recientes
      lastUpdated: Date.now(),
    }

    writeData(updatedData)

    return NextResponse.json({ success: true, data: updatedData }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Error guardando datos' }, { status: 500 })
  }
}
