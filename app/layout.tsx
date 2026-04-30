import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const barlow = Barlow({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-barlow'
})

const barlowCondensed = Barlow_Condensed({ 
  subsets: ["latin"],
  weight: ['500', '600', '700', '800'],
  variable: '--font-barlow-condensed'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono'
})

export const metadata: Metadata = {
  title: 'The Session Method | Institutional Trading System',
  description: 'The complete futures & forex trading system for 60%+ win rates, institutional sweep mastery, and DOM-confirmed entries — built for serious day traders.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable} ${jetbrainsMono.variable}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18126609251"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18126609251');
          `}
        </Script>
      </head>
      <body className="antialiased bg-[#070C11]">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
