import type { Metadata } from 'next'
import './fonts.css'
import { FullScreen } from './full-screen'
import './globals.scss'
import './page.scss'
import './player/page.scss'

export const metadata: Metadata = {
  title: '로봇판타지아',
  description: '배민 음악 로봇판타지아',
  openGraph: {
    type: 'website',
    images: ['https://robotfantasia.com/og_image.png'],
    title: '로봇판타지아',
    description: '배민 음악 로봇판타지아',
    locale: 'ko',
    siteName: '로봇판타지아',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko-KR">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        {children}
        <div className="cross-fade" />
        <FullScreen />
      </body>
    </html>
  )
}
