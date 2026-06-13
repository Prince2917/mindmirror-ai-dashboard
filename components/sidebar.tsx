'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  HeartPulse,
  NotebookPen,
  TrendingUp,
  Sparkles,
  ClipboardList,
  BarChart3,
  Brain,
  Menu,
  X,
  Play,
  Zap,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const nav = [
  { href: '/dashboard', label: 'Digital Twin', icon: LayoutDashboard },
  { href: '/dashboard/check-in', label: 'Daily Check-In', icon: HeartPulse },
  { href: '/dashboard/journal', label: 'AI Journal', icon: NotebookPen },
  { href: '/dashboard/insights', label: 'Predictive Insights', icon: TrendingUp },
  { href: '/dashboard/future-self', label: 'Future Self', icon: Sparkles },
  { href: '/dashboard/action-plan', label: 'Action Plan', icon: ClipboardList },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
]

// Global demo mode state (simple approach for hackathon)
let globalDemoMode = false
const listeners: Set<(value: boolean) => void> = new Set()

export function toggleDemoMode() {
  globalDemoMode = !globalDemoMode
  listeners.forEach(listener => listener(globalDemoMode))
  if (typeof window !== 'undefined') {
    localStorage.setItem('demoMode', String(globalDemoMode))
  }
}

export function useDemoMode() {
  const [isDemo, setIsDemo] = useState(globalDemoMode)

  const handleToggle = () => {
    toggleDemoMode()
  }

  // Listen for changes
  if (typeof window !== 'undefined') {
    // Initialize from localStorage if available
    if (globalDemoMode === false && localStorage.getItem('demoMode') === 'true') {
      globalDemoMode = true
    }
  }

  return { isEnabled: isDemo, toggle: handleToggle }
}

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  // Initialize demo mode from localStorage
  useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true') {
      setDemoMode(true)
      globalDemoMode = true
    }
  })

  const handleDemoToggle = () => {
    const newValue = !demoMode
    setDemoMode(newValue)
    globalDemoMode = newValue
    if (typeof window !== 'undefined') {
      localStorage.setItem('demoMode', String(newValue))
    }
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
        <Brand demoMode={demoMode} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg glass p-2 text-foreground"
          aria-label="Toggle navigation"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl lg:static lg:flex',
          open ? 'flex' : 'hidden',
        )}
      >
        <div className="hidden px-6 py-6 lg:block">
          <Brand demoMode={demoMode} />
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {nav.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground',
                )}
              >
                <Icon className={cn('size-4.5', active && 'text-primary')} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Judge Demo Mode Toggle */}
        <div className="px-3 py-3 border-t border-border mx-3 rounded-lg bg-primary/5">
          <button
            type="button"
            onClick={handleDemoToggle}
            className="w-full flex items-center gap-3 rounded-xl p-2 transition-all hover:bg-primary/10"
          >
            <div className={cn(
              'flex size-9 items-center justify-center rounded-lg transition-all',
              demoMode ? 'bg-chart-1/20 text-chart-1' : 'bg-secondary text-muted-foreground'
            )}>
              {demoMode ? <Zap className="size-4.5" /> : <Play className="size-4.5" />}
            </div>
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">Judge Demo</span>
                {demoMode && (
                  <Badge variant="default" className="text-xs bg-chart-1">ON</Badge>
                )}
              </div>
              <span className="truncate text-xs text-muted-foreground">
                {demoMode ? 'Full demo active' : 'Enable demo mode'}
              </span>
            </div>
          </button>
          {demoMode && (
            <div className="mt-2 rounded-lg bg-chart-1/10 px-3 py-2 text-xs text-muted-foreground">
              Analytics & predictions populated with 90-day demo data
            </div>
          )}
        </div>

        <div className="px-3 pb-6">
          <Link
            href="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl glass px-3 py-3 transition-colors hover:bg-sidebar-accent/50"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              AR
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">Avery Rivera</span>
              <span className="block truncate text-xs text-muted-foreground">View profile</span>
            </span>
          </Link>
        </div>
      </aside>
    </>
  )
}

function Brand({ demoMode }: { demoMode: boolean }) {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/30">
        <Brain className={cn('size-5 text-primary', demoMode && 'animate-pulse')} />
      </span>
      <div className="flex flex-col">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          MindMirror<span className="text-primary"> AI</span>
        </span>
        {demoMode && (
          <span className="text-[10px] text-chart-1 font-medium">DEMO MODE ACTIVE</span>
        )}
      </div>
    </Link>
  )
}
