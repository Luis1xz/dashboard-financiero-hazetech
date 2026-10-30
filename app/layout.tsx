import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HAZE Finance | Founder OS · Control Financiero Mancomunado',
  description: 'Dashboard CRM financiero para los fundadores de Haze Technologies (hazetech.co). Control de ingresos, egresos, reportería y doble aprobación.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#050508',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#050508] text-[#f4f4f7] antialiased">
        {children}
      </body>
    </html>
  )
}
