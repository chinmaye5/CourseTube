import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'sonner'
import './globals.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CourseTube - Learn from YouTube',
  description: 'Transform YouTube videos into structured learning courses with progress tracking and smart notes.',
  icons: {
    icon: [
      {
        url: '/newlogo.png',
        href: '/newlogo.png',
      },
    ],
    apple: [
      {
        url: '/newlogo.png',
        href: '/newlogo.png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/newlogo.png" />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-left" />
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}