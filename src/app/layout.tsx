import type { Metadata } from 'next'
import './fonts.css'
import './globals.scss'
import './page.scss'

export const metadata: Metadata = {
  title: '로봇 판타지아',
  description: '배민 음악 로봇 판타지아',
  openGraph: {
    type: 'website',
    images: ['https://robotfantasia.com/og_image.png'],
    title: '로봇 판타지아',
    description: '배민 음악 로봇 판타지아',
    locale: 'ko',
    siteName: '로봇 판타지아',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko-KR">
      <body>{children}</body>
    </html>
  )
}
