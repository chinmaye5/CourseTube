import { ClerkProvider } from '@clerk/nextjs'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
})

export const metadata = {
  title: 'CourseTube — Turn YouTube into structured courses',
  description:
    'CourseTube transforms YouTube videos and playlists into structured learning courses with chapter navigation, progress tracking, and timestamped notes.',
  metadataBase: new URL('https://coursetube.app'),
  openGraph: {
    title: 'CourseTube — Turn YouTube into structured courses',
    description:
      'Structured learning from any YouTube video. Chapters, progress tracking, and timestamped notes.',
    type: 'website',
  },
  icons: {
    icon: [{ url: '/newlogo.png', href: '/newlogo.png' }],
    apple: [{ url: '/newlogo.png', href: '/newlogo.png' }],
  },
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${geistMono.variable} bg-background`} suppressHydrationWarning>
        <head>
          <link rel="icon" href="/newlogo.png" />
        </head>
        <body className="font-sans antialiased">
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-right" />
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
