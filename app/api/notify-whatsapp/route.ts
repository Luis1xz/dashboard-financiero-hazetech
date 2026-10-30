import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { title, concept, amount, type, registeredBy, status, webhookUrl } = await req.json()

    const formattedAmount = amount
      ? `$ ${Number(amount).toLocaleString('es-CO', { minimumFractionDigits: 0 })} COP`
      : ''

    const messageText = [
      '🔔 *ALERTA FINANCIERA HAZE TECH*',
      '',
      `📌 *Operación:* ${concept || title || 'Nuevo Movimiento'}`,
      formattedAmount ? `💰 *Monto:* ${formattedAmount}` : null,
      type ? `🏷️ *Tipo:* ${type}` : null,
      registeredBy ? `👤 *Registrado por:* ${registeredBy}` : null,
      status ? `⏳ *Estado:* ${status}` : '⏳ *Estado:* Requiere aprobación mutua de Luis y Yoinner',
      '',
      '👉 *Revisar y firmar en el Dashboard:*',
      'https://dashboard-financiero-hazetech.vercel.app',
      '',
      '_Control Mancomunado HAZE (Luis & Yoinner)_',
    ]
      .filter(Boolean)
      .join('\n')

    const directWhatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`

    // Si los fundadores tienen un webhook de bot configurado (CallMeBot, Evolution API, Green API, etc.)
    if (webhookUrl && typeof webhookUrl === 'string' && webhookUrl.startsWith('http')) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageText, text: messageText }),
        })
      } catch (err) {
        console.warn('Error enviando al webhook de WhatsApp:', err)
      }
    }

    return NextResponse.json({
      success: true,
      messageText,
      directWhatsAppUrl,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 })
  }
}
