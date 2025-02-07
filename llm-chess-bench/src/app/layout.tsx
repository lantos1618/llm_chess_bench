import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeToggle from '@/components/ThemeToggle'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LLM Chess Benchmark',
  description: 'Chess benchmark system for LLM personalities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            try {
              let theme = localStorage.getItem('theme-storage') ? 
                JSON.parse(localStorage.getItem('theme-storage')).state.theme : 
                'system';
              
              if (theme === 'system') {
                theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 
                  'dark' : 'light';
              }
              
              document.documentElement.classList.toggle('dark', theme === 'dark');
              
              window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', (e) => {
                  if (localStorage.getItem('theme-storage') &&
                      JSON.parse(localStorage.getItem('theme-storage')).state.theme === 'system') {
                    document.documentElement.classList.toggle('dark', e.matches);
                  }
                });
            } catch (e) {
              console.log('Theme initialization error:', e);
            }
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-bg text-text transition-colors`}>
        <nav className="bg-surface shadow-lg transition-colors">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-text">LLM Chess</span>
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <a 
                    href="/" 
                    className="inline-flex items-center px-1 pt-1 text-primary hover:text-accent"
                  >
                    Personalities
                  </a>
                  <a 
                    href="/games" 
                    className="inline-flex items-center px-1 pt-1 text-secondary hover:text-primary"
                  >
                    Games
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  )
}
