'use client'

import { Menu, Moon, Palette, Search, Sun, Type, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { type Accent, useCustomization } from '@/components/theme/CustomizationProvider'

const categories = [
  { label: 'All', value: '', href: '/#latest-posts' },
  { label: 'Science', value: 'science', href: '/?category=science#latest-posts' },
  { label: 'Tech', value: 'tech', href: '/?category=tech#latest-posts' },
  { label: 'Others', value: 'others', href: '/?category=others#latest-posts' },
]

const accentOptions: Array<{ label: string; value: Accent }> = [
  { label: 'Indigo Violet', value: 'violet' },
  { label: 'Cyberpunk Emerald', value: 'emerald' },
  { label: 'Minimalist Slate', value: 'slate' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { accent, font, setAccent, setFont } = useCustomization()
  const { resolvedTheme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const activeCategory = pathname === '/' ? (searchParams.get('category') ?? '') : null

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setSearchOpen(false)
      }
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, searchOpen])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            className="group flex shrink-0 items-center gap-2 rounded-lg font-ui text-lg font-black tracking-[-0.04em] text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            href="/"
            aria-label="DevBite Blogs home"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-accent text-sm font-black text-white shadow-sm shadow-accent/25 transition-transform group-hover:-rotate-3">
              D
            </span>
            <span>
              DevBite <span className="text-accent">Blogs</span>
            </span>
          </Link>

          <nav className="ml-5 hidden items-center gap-1 lg:flex" aria-label="Post categories">
            {categories.map((category) => {
              const active = activeCategory === category.value
              return (
                <Link
                  className={`rounded-lg px-3 py-2 font-ui text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    active
                      ? 'bg-accent-soft text-accent'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  href={category.href}
                  key={category.label}
                  aria-current={active ? 'page' : undefined}
                >
                  {category.label}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-1 md:flex">
            <button
              className="icon-button"
              onClick={() => setSearchOpen(true)}
              type="button"
              aria-label="Search posts"
            >
              <Search aria-hidden="true" size={18} />
            </button>

            <label className="relative ml-1 hidden items-center xl:flex">
              <Palette
                aria-hidden="true"
                className="pointer-events-none absolute left-2.5 text-muted-foreground"
                size={16}
              />
              <span className="sr-only">Accent color scheme</span>
              <select
                className="h-9 cursor-pointer appearance-none rounded-lg border border-border bg-card pr-7 pl-8 font-ui text-xs font-semibold text-foreground outline-none transition hover:border-accent focus:ring-2 focus:ring-accent/20"
                onChange={(event) => setAccent(event.target.value as Accent)}
                value={accent}
              >
                {accentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="icon-button"
              onClick={() => setFont(font === 'sans' ? 'serif' : 'sans')}
              title="Toggle reading typography"
              type="button"
              aria-label="Toggle reading typography"
            >
              <Type aria-hidden="true" size={18} />
            </button>

            <button
              className="icon-button"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              type="button"
              aria-label="Toggle color theme"
            >
              <Sun aria-hidden="true" className="hidden dark:block" size={18} />
              <Moon aria-hidden="true" className="dark:hidden" size={18} />
            </button>
          </div>

          <button
            className="icon-button ml-auto md:hidden"
            onClick={() => setMenuOpen(true)}
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <Menu aria-hidden="true" size={21} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            type="button"
            aria-label="Close navigation menu"
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(88vw,24rem)] flex-col border-l border-border bg-background p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-ui text-lg font-black tracking-tight">Explore DevBite</span>
              <button
                className="icon-button"
                onClick={() => setMenuOpen(false)}
                type="button"
                aria-label="Close navigation menu"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </div>

            <button
              className="mt-8 flex h-11 items-center gap-3 rounded-xl border border-border bg-muted px-4 text-left font-ui text-sm text-muted-foreground"
              onClick={() => {
                setMenuOpen(false)
                setSearchOpen(true)
              }}
              type="button"
            >
              <Search aria-hidden="true" size={18} /> Search articles
            </button>

            <nav className="mt-6 grid gap-1" aria-label="Mobile post categories">
              {categories.map((category) => {
                const active = activeCategory === category.value
                return (
                  <Link
                    className={`rounded-xl px-4 py-3 font-ui text-base font-semibold ${
                      active ? 'bg-accent-soft text-accent' : 'text-foreground hover:bg-muted'
                    }`}
                    href={category.href}
                    key={category.label}
                    onClick={() => setMenuOpen(false)}
                  >
                    {category.label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto grid gap-4 border-t border-border pt-6">
              <label className="grid gap-2 font-ui text-sm font-semibold text-muted-foreground">
                Accent scheme
                <select
                  className="h-11 rounded-xl border border-border bg-card px-3 text-foreground outline-none focus:ring-2 focus:ring-accent/25"
                  onChange={(event) => setAccent(event.target.value as Accent)}
                  value={accent}
                >
                  {accentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="control-button"
                  onClick={() => setFont(font === 'sans' ? 'serif' : 'sans')}
                  type="button"
                  aria-label="Toggle reading typography"
                >
                  <Type aria-hidden="true" size={17} /> Typography
                </button>
                <button
                  className="control-button"
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  type="button"
                  aria-label="Toggle color theme"
                >
                  <Sun aria-hidden="true" className="hidden dark:block" size={17} />
                  <Moon aria-hidden="true" className="dark:hidden" size={17} />
                  Theme
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/55 px-4 pt-[14vh] backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-title"
        >
          <button
            className="absolute inset-0"
            onClick={() => setSearchOpen(false)}
            type="button"
            aria-label="Close search"
          />
          <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-ui text-xs font-bold tracking-widest text-accent uppercase">
                  Search
                </p>
                <h2 className="mt-1 text-xl font-bold text-foreground" id="search-title">
                  Find your next idea
                </h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setSearchOpen(false)}
                type="button"
                aria-label="Close search"
              >
                <X aria-hidden="true" size={19} />
              </button>
            </div>
            <form action="/" className="flex gap-2">
              <label className="relative min-w-0 flex-1">
                <Search
                  aria-hidden="true"
                  className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <span className="sr-only">Search articles</span>
                <input
                  autoFocus
                  className="h-12 w-full rounded-xl border border-border bg-background pr-4 pl-11 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-accent focus:ring-4 focus:ring-accent/10"
                  defaultValue={searchParams.get('q') ?? ''}
                  name="q"
                  placeholder="Search titles or summaries…"
                  type="search"
                />
              </label>
              <button className="primary-button px-5" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export function SiteHeaderFallback() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link className="font-ui text-lg font-black tracking-tight" href="/">
          DevBite <span className="text-accent">Blogs</span>
        </Link>
      </div>
    </header>
  )
}
