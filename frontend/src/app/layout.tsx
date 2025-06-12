import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/header/Header'
import { FooterComponent } from '@/components/footer/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Starcrawler',
  description: 'Explore e gerencie repositórios do GitHub com praticidade.',
  keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'tailwindcss'],
  applicationName: 'Starcrawler',
  openGraph: {
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://raw.githubusercontent.com/alezzott/star-crawler/refs/heads/master/frontend/public/og.png',
        width: 800,
        height: 600,
      },
      {
        url: 'https://raw.githubusercontent.com/alezzott/star-crawler/refs/heads/master/frontend/public/og.png',
        width: 1800,
        height: 1600,
        alt: 'open-graph alt',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Toaster richColors position="top-right" />
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Header />
          <main className="@container px-4 py-4 sm:px-6 lg:px-8">
            {children}
          </main>
          <FooterComponent />
        </body>
      </html>
    </>
  )
}
