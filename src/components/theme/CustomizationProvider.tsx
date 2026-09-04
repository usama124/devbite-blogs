'use client'

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react'

export type Accent = 'violet' | 'emerald' | 'slate'
export type FontPreference = 'sans' | 'serif'

type CustomizationContextValue = {
  accent: Accent
  font: FontPreference
  setAccent: (accent: Accent) => void
  setFont: (font: FontPreference) => void
}

const CustomizationContext = createContext<CustomizationContextValue | null>(null)

const accents: Accent[] = ['violet', 'emerald', 'slate']
const preferenceEvent = 'devbite-preference-change'

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener(preferenceEvent, onStoreChange)
  return () => window.removeEventListener(preferenceEvent, onStoreChange)
}

const getSnapshot = () => {
  const accent = document.documentElement.dataset.accent
  const font = document.documentElement.dataset.font
  return `${accent ?? 'violet'}:${font ?? 'sans'}`
}

const getServerSnapshot = () => 'violet:sans'

export function CustomizationProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [savedAccent, savedFont] = snapshot.split(':')
  const accent = accents.includes(savedAccent as Accent) ? (savedAccent as Accent) : 'violet'
  const font: FontPreference = savedFont === 'serif' ? 'serif' : 'sans'

  const setAccent = useCallback((value: Accent) => {
    document.documentElement.dataset.accent = value
    window.localStorage.setItem('devbite-accent', value)
    window.dispatchEvent(new Event(preferenceEvent))
  }, [])

  const setFont = useCallback((value: FontPreference) => {
    document.documentElement.dataset.font = value
    window.localStorage.setItem('devbite-font', value)
    window.dispatchEvent(new Event(preferenceEvent))
  }, [])

  const value = useMemo(
    () => ({ accent, font, setAccent, setFont }),
    [accent, font, setAccent, setFont],
  )

  return <CustomizationContext.Provider value={value}>{children}</CustomizationContext.Provider>
}

export function useCustomization() {
  const value = useContext(CustomizationContext)
  if (!value) throw new Error('useCustomization must be used within CustomizationProvider')
  return value
}
