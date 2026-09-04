'use client'

import { ThemeProvider } from 'next-themes'

import { CustomizationProvider } from './CustomizationProvider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CustomizationProvider>{children}</CustomizationProvider>
    </ThemeProvider>
  )
}
