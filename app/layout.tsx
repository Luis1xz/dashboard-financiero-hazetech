import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HAZE Finance | Founder OS · Control Financiero e Inversiones',
  description: 'Sistema CRM financiero, control mancomunado e inversiones para los fundadores de Haze Technologies (hazetech.co).',
  icons: {
    icon: [
      {
        url: '/haze-logo-circle.png',
        type: 'image/png',
      },
      {
        url: '/icon-dark-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#040508',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="icon" href="/haze-logo-circle.png" type="image/png" />
      </head>
      <body className="min-h-screen bg-[#040508] text-[#f4f4f8] antialiased">
        {children}
      </body>
    </html>
  )
}
