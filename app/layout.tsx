import { ClerkProvider } from '@clerk/nextjs'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import './globals.css'


const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'CourseTube - Master Any Skill via YouTube',
  description: 'The premium learning experience. Transform YouTube into a structured academic environment with progress tracking and smart notes.',
  icons: {
    icon: [
      {
        url: '/logo.png',
        href: '/logo.png',
      },
    ],
    apple: [
      {
        url: '/logo.png',
        href: '/logo.png',
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
      <html lang="en">
        <head>
          <link rel="icon" href="/logo.png" />
        </head>
        <body className={`${jakarta.className} bg-background text-foreground antialiased`}>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}