'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, HeartPulse, TrendingUp, TrendingDown, TriangleAlert as AlertTriangle, Sparkles, Activity, Zap, Shield, Target, ArrowUpRight, Moon, Sun, Battery, Gauge, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  moodHistory,
  emotionalTwinData,
  aiInsights,
  type InsightCard,
  type EmotionalTwinData,
} from '@/lib/data'
import { cn } from '@/lib/utils'

// Animated Score Gauge Component
function AnimatedGauge({
  value,
  color,
  label,
  suffix = '',
  size = 'lg',
}: {
  value: number
  color: string
  label: string
  suffix?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setDisplayValue(value), 100)
    return () => clearTimeout(timer)
  }, [value])

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (displayValue / 100) * circumference

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  }

  return (
    <div className="relative">
      <svg className={cn('transform -rotate-90', sizeClasses[size])} viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-secondary/30"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        {/* Glow effect */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.3"
          strokeDasharray="4 4"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn('font-semibold tabular-nums', textSizes[size])}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {displayValue}{suffix}
        </motion.span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

// Score Card with animation
function ScoreCard({
  title,
  value,
  previousValue,
  description,
  icon: Icon,
  color,
  suffix = '',
  trend,
}: {
  title: string
  value: number
  previousValue?: number
  description: string
  icon: React.ElementType
  color: string
  suffix?: string
  trend?: 'up' | 'down' | 'stable'
}) {
  const trendColor = trend === 'up' ? 'text-chart-3' : trend === 'down' ? 'text-chart-5' : 'text-muted-foreground'
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="flex size-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="size-4" style={{ color }} />
              </div>
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </div>
            {trend && (
              <Badge variant="secondary" className={cn('text-xs', trendColor)}>
                <TrendIcon className="size-3" />
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <motion.div
                className="text-3xl font-bold tabular-nums"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {value}{suffix}
              </motion.div>
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </div>
            <div className="h-12 w-16">
              <MiniChart value={value} color={color} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Mini sparkline chart
function MiniChart({ value, color }: { value: number; color: string }) {
  const points = Array.from({ length: 7 }, (_, i) => {
    const baseY = 20 + i * 5
    const variation = Math.sin(i * 0.8) * 8
    return `${i * 8},${baseY + variation - (value / 100) * 30}`
  }).join(' ')

  return (
    <svg className="h-full w-full" viewBox="0 0 48 48">
      <defs>
        <linearGradient id={`gradient-${value}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Insight Card Component
function InsightCardComponent({ insight }: { insight: InsightCard }) {
  const iconMap: Record<string, React.ElementType> = {
    TrendingUp,
    AlertTriangle,
    Moon,
    Award: Sparkles,
    Calendar: Target,
  }

  const Icon = iconMap[insight.icon] || Sparkles
  const impactColors = {
    high: 'border-chart-5/50 bg-chart-5/10',
    medium: 'border-chart-4/50 bg-chart-4/10',
    low: 'border-chart-3/50 bg-chart-3/10',
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-xl border p-4 transition-all hover:scale-[1.02]',
        impactColors[insight.impact]
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background/50">
          <Icon className="size-4 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{insight.title}</span>
            {insight.timeframe && (
              <Badge variant="outline" className="text-xs">
                {insight.timeframe}
              </Badge>
            )}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {insight.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// Main Dashboard Component
export default function DashboardPage() {
  const [twinData, setTwinData] = useState<EmotionalTwinData>(emotionalTwinData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [insights] = useState<InsightCard[]>(aiInsights)

  const latestMood = moodHistory[moodHistory.length - 1]
  const weeklyAvg = {
    mood: Math.round((moodHistory.slice(-7).reduce((a, b) => a + b.mood, 0) / 7) * 10) / 10,
    stress: Math.round((moodHistory.slice(-7).reduce((a, b) => a + b.stress, 0) / 7) * 10) / 10,
    energy: Math.round((moodHistory.slice(-7).reduce((a, b) => a + b.energy, 0) / 7) * 10) / 10,
    sleep: Math.round((moodHistory.slice(-7).reduce((a, b) => a + b.sleep, 0) / 7) * 10) / 10,
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setTwinData({
        ...twinData,
        lastUpdated: new Date().toISOString(),
      })
      setIsRefreshing(false)
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Emotional Digital Twin"
        description="A living AI model of your mental wellness — learning, predicting, and helping you thrive."
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn('size-4', isRefreshing && 'animate-spin')} />
              Refresh Twin
            </Button>
            <Button
              nativeButton={false}
              render={
                <Link href="/dashboard/check-in">
                  <HeartPulse className="size-4" /> New check-in
                </Link>
              }
            />
          </div>
        }
      />

      {/* Main Twin Visualization */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Central Twin Display */}
        <Card className="glass col-span-2 row-span-2">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Outer glow */}
              <div
                className="absolute -inset-8 rounded-full opacity-20 blur-2xl"
                style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }}
              />
              <AnimatedGauge
                value={twinData.emotionalHealthScore}
                color="var(--chart-1)"
                label="Health Score"
                size="lg"
              />
              <motion.div
                className="absolute -right-2 -top-2 flex size-10 items-center justify-center rounded-full bg-primary/20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Brain className="size-5 text-primary" />
              </motion.div>
            </motion.div>

            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold">Emotional Digital Twin</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Last updated {new Date(twinData.lastUpdated).toLocaleTimeString()}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="text-chart-3">
                  <Activity className="size-3" /> Active
                </Badge>
                <Badge variant="outline">
                  <Sparkles className="size-3" /> Learning
                </Badge>
                <Badge variant="outline">
                  <Target className="size-3" /> 94% Confidence
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Cards */}
        <ScoreCard
          title="Burnout Risk"
          value={twinData.burnoutRiskScore}
          description="Based on stress patterns"
          icon={AlertTriangle}
          color="var(--chart-5)"
          suffix="%"
          trend={twinData.burnoutRiskScore > 50 ? 'up' : 'stable'}
        />

        <ScoreCard
          title="Anxiety Level"
          value={twinData.anxietyScore}
          description="Detected from recent entries"
          icon={Activity}
          color="var(--chart-4)"
          suffix="%"
          trend={twinData.anxietyScore > 50 ? 'up' : 'stable'}
        />

        <ScoreCard
          title="Motivation"
          value={twinData.motivationScore}
          description="Drive & engagement level"
          icon={Zap}
          color="var(--chart-1)"
          suffix="%"
          trend="up"
        />

        <ScoreCard
          title="Energy Reserves"
          value={twinData.energyScore}
          description="Mental & physical energy"
          icon={Battery}
          color="var(--chart-3)"
          suffix="%"
          trend={twinData.energyScore < 60 ? 'down' : 'stable'}
        />

        <ScoreCard
          title="Resilience"
          value={twinData.resilienceScore}
          description="Recovery capacity"
          icon={Shield}
          color="var(--chart-2)"
          suffix="%"
        />
      </div>

      {/* AI Insights Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="size-5 text-primary" />
                    AI-Generated Insights
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Patterns and predictions discovered by your digital twin
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  <Brain className="size-3" /> 5 Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence>
                {insights.map((insight) => (
                  <InsightCardComponent key={insight.id} insight={insight} />
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Panel */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">This Week's Snapshot</CardTitle>
            <CardDescription>Key metrics from your last 7 check-ins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Average Mood', value: weeklyAvg.mood, max: 10, icon: Sun, color: 'var(--chart-1)' },
              { label: 'Average Stress', value: weeklyAvg.stress, max: 10, icon: TrendingUp, color: 'var(--chart-5)' },
              { label: 'Average Energy', value: weeklyAvg.energy, max: 10, icon: Zap, color: 'var(--chart-3)' },
              { label: 'Average Sleep', value: weeklyAvg.sleep, max: 10, icon: Moon, color: 'var(--chart-2)' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <stat.icon className="size-4" style={{ color: stat.color }} />
                    {stat.label}
                  </span>
                  <span className="font-semibold tabular-nums">{stat.value}/{stat.max}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: stat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-4 rounded-xl bg-primary/10 p-4">
              <div className="flex items-start gap-2">
                <Sparkles className="size-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Your twin predicts Thursday will be your most challenging day next week.
                  Schedule lighter tasks and protect your rest.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Navigation */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: '/dashboard/journal', title: 'AI Journal', desc: 'Analyze with emotion detection', icon: Sparkles },
          { href: '/dashboard/future-self', title: 'Future Self', desc: 'Simulate your emotional future', icon: Brain },
          { href: '/dashboard/insights', title: 'Predictive Insights', desc: '7-day forecast & warnings', icon: TrendingUp },
          { href: '/dashboard/analytics', title: 'Analytics', desc: 'Deep dive into your data', icon: Gauge },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="glass h-full cursor-pointer transition-all hover:border-primary/50 hover:bg-card/80">
                <CardContent className="flex items-start justify-between gap-4 pt-6">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="mt-0.5 text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="size-5 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}
