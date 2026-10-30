import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Memoria volátil de respaldo en el runtime
let memoryDb: any = null

function getDbFilePath(): string {
  const localDataDir = path.join(process.cwd(), 'data')
  try {
    if (!fs.existsSync(localDataDir)) {
      fs.mkdirSync(localDataDir, { recursive: true })
    }
    return path.join(localDataDir, 'haze-db.json')
  } catch {
    return path.join('/tmp', 'haze-db.json')
  }
}

// BASE DE DATOS LIMPIA (SIN MOCK DATA)
const DEFAULT_DB = {
  movements: [],
  investments: [],
  tasks: [],
  notifications: [
    {
      id: 'NOTIF-INIT-1',
      title: '💎 Dashboard Financiero HAZE Activo',
      message: 'Base de datos limpia y lista para operaciones reales. Control mancomunado (Luis y Yoinner) activo.',
      time: 'Ahora',
      type: 'approved',
      read: false,
    },
  ],
}

// Lista negra de IDs de prueba anteriores para purgar si existieran
const MOCK_IDS = new Set([
  'HAZE-910245',
  'HAZE-834912',
  'HAZE-742918',
  'HAZE-621849',
  'INV-101',
  'INV-102',
  'TASK-1',
  'TASK-2',
  'TASK-3',
])

function readData() {
  if (memoryDb) {
    // Purgar mock data de memoria si existiera
    memoryDb.movements = (memoryDb.movements || []).filter((m: any) => !MOCK_IDS.has(m.id))
    memoryDb.investments = (memoryDb.investments || []).filter((i: any) => !MOCK_IDS.has(i.id))
    memoryDb.tasks = (memoryDb.tasks || []).filter((t: any) => !MOCK_IDS.has(t.id))
    return memoryDb
  }

  const filePath = getDbFilePath()
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8')
      const parsed = JSON.parse(raw)
      parsed.movements = (parsed.movements || []).filter((m: any) => !MOCK_IDS.has(m.id))
      parsed.investments = (parsed.investments || []).filter((i: any) => !MOCK_IDS.has(i.id))
      parsed.tasks = (parsed.tasks || []).filter((t: any) => !MOCK_IDS.has(t.id))
      memoryDb = parsed
      return parsed
    }
  } catch (err) {
    console.warn('Error reading db file:', err)
  }

  writeData(DEFAULT_DB)
  return DEFAULT_DB
}

function writeData(data: any) {
  // Limpiar cualquier mock data antes de escribir
  data.movements = (data.movements || []).filter((m: any) => !MOCK_IDS.has(m.id))
  data.investments = (data.investments || []).filter((i: any) => !MOCK_IDS.has(i.id))
  data.tasks = (data.tasks || []).filter((t: any) => !MOCK_IDS.has(t.id))

  memoryDb = data
  const filePath = getDbFilePath()
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
  } catch (err) {
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

    if (body.action === 'purge_mock_data') {
      writeData(DEFAULT_DB)
      return NextResponse.json({ success: true, data: DEFAULT_DB })
    }

    // Filtrar cualquier mock data entrante
    const cleanMovements = (body.movements || []).filter((m: any) => !MOCK_IDS.has(m.id))
    const cleanInvestments = (body.investments || []).filter((i: any) => !MOCK_IDS.has(i.id))
    const cleanTasks = (body.tasks || []).filter((t: any) => !MOCK_IDS.has(t.id))
    const cleanNotifications = (body.notifications || []).slice(0, 50)

    const updatedData = {
      movements: cleanMovements,
      investments: cleanInvestments,
      tasks: cleanTasks,
      notifications: cleanNotifications,
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
