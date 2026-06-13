'use client'

import { useState, useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  ScatterChart,
  ZAxis,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Sparkles, Calendar, ChartBar as BarChart3, Activity, Moon, Sun, Zap, Brain, Download, RefreshCw, ChartPie as PieChart } from 'lucide-react'
import { moodHistory, generateDemoData, type MoodEntry } from '@/lib/data'
import { cn } from '@/lib/utils'

// Color palette
const colors = {
  mood: 'var(--chart-1)',
  stress: '#f59e0b',
  energy: 'var(--chart-3)',
  sleep: 'var(--chart-2)',
  workload: 'var(--chart-4)',
  anxiety: 'var(--chart-5)',
  motivation: '#22c55e',
}

// Heatmap Component
function WeeklyHeatmap({ data }: { data: MoodEntry[] }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = ['6am', '9am', '12pm', '3pm', '6pm', '9pm']

  // Generate hourly sim data from daily data
  const heatmapData = useMemo(() => {
    const result: { day: number; hour: number; value: number; label: string }[] = []
    data.slice(-7).forEach((entry, dayIndex) => {
      hours.forEach((hour, hourIndex) => {
        const baseMood = entry.mood
        const variation = Math.sin((hourIndex / hours.length) * Math.PI) * 0.8
        const randomNoise = (Math.random() - 0.5) * 0.6
        const mood = Math.max(1, Math.min(10, baseMood + variation + randomNoise))
        result.push({
          day: dayIndex,
          hour: hourIndex,
          value: Math.round(mood * 10),
          label: `${days[dayIndex]} ${hour}`,
        })
      })
    })
    return result
  }, [data])

  const getMoodColor = (value: number) => {
    if (value >= 70) return 'bg-chart-3/80'
    if (value >= 50) return 'bg-chart-1/70'
    if (value >= 40) return 'bg-chart-4/60'
    return 'bg-chart-5/70'
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Mood Heatmap</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <div className="size-3 rounded bg-chart-5/70" /> Low
          </span>
          <span className="flex items-center gap-1">
            <div className="size-3 rounded bg-chart-1/70" /> Med
          </span>
          <span className="flex items-center gap-1">
            <div className="size-3 rounded bg-chart-3/80" /> High
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1 min-w-[400px]">
          {/* Time labels */}
          <div className="flex items-center gap-1">
            <div className="w-12" />
            {hours.map((hour) => (
              <div key={hour} className="w-10 text-center text-[10px] text-muted-foreground">
                {hour}
              </div>
            ))}
          </div>
          {/* Heatmap rows */}
          {data.slice(-7).map((entry, dayIndex) => (
            <div key={dayIndex} className="flex items-center gap-1">
              <div className="w-12 text-[10px] text-muted-foreground">{entry.label}</div>
              {hours.map((_, hourIndex) => {
                const heatmapEntry = heatmapData.find((d) => d.day === dayIndex && d.hour === hourIndex)
                const value = heatmapEntry?.value || 50
                return (
                  <motion.div
                    key={hourIndex}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: dayIndex * 0.05 + hourIndex * 0.02 }}
                    className={cn(
                      'w-10 h-6 rounded transition-colors cursor-pointer hover:ring-2 hover:ring-primary/50',
                      getMoodColor(value)
                    )}
                    title={`${heatmapEntry?.label}: ${value / 10}/10`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Monthly Calendar View
function MonthlyCalendar({ data }: { data: MoodEntry[] }) {
  const getMoodColor = (mood: number) => {
    if (mood >= 7) return 'bg-chart-3/60 border-chart-3/40'
    if (mood >= 5) return 'bg-chart-1/40 border-chart-1/30'
    if (mood >= 4) return 'bg-chart-4/40 border-chart-4/30'
    return 'bg-chart-5/60 border-chart-5/40'
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
        <div key={i} className="text-center text-[10px] font-medium text-muted-foreground p-1">
          {day}
        </div>
      ))}
      {data.slice(-28).map((entry, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.01 }}
          className={cn(
            'aspect-square rounded border text-[10px] flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all',
            getMoodColor(entry.mood)
          )}
          title={`${entry.date}: ${entry.mood}/10`}
        >
          {new Date(entry.date).getDate()}
        </motion.div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [demoData, setDemoData] = useState<MoodEntry[] | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const activeData = demoData || moodHistory

  // Derived analytics
  const analytics = useMemo(() => {
    const data = activeData
    const avgMood = Math.round((data.reduce((a, b) => a + b.mood, 0) / data.length) * 10) / 10
    const avgStress = Math.round((data.reduce((a, b) => a + b.stress, 0) / data.length) * 10) / 10
    const avgEnergy = Math.round((data.reduce((a, b) => a + b.energy, 0) / data.length) * 10) / 10
    const avgSleep = Math.round((data.reduce((a, b) => a + b.sleep, 0) / data.length) * 10) / 10

    // Trends (compare last 7 days to previous 7)
    const recent = data.slice(-7)
    const previous = data.slice(-14, -7)
    const moodTrend = recent.length > 0 && previous.length > 0
      ? Math.round((((recent.reduce((a, b) => a + b.mood, 0) / recent.length) - (previous.reduce((a, b) => a + b.mood, 0) / previous.length)) / (previous.reduce((a, b) => a + b.mood, 0) / previous.length)) * 100)
      : 0

    return {
      avgMood,
      avgStress,
      avgEnergy,
      avgSleep,
      moodTrend,
      totalDays: data.length,
    }
  }, [activeData])

  // Burnout risk trend
  const burnoutTrend = useMemo(() =>
    activeData.map((d) => ({
      label: d.label,
      date: d.date,
      risk: Math.round(Math.min(100, d.stress * 7 + (8 - d.sleep) * 6 + d.workload * 3)),
    })), [activeData])

  // Correlation data
  const correlationData = useMemo(() =>
    activeData.map((d) => ({
      sleep: d.sleep,
      mood: d.mood,
      stress: d.stress,
      workload: d.workload,
    })), [activeData])

  const handleGenerateDemo = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setDemoData(generateDemoData(90))
      setIsGenerating(false)
    }, 1500)
  }

  const handleReset = () => {
    setDemoData(null)
  }

  const weeklyReport = [
    { metric: 'Avg Mood', value: analytics.avgMood, delta: analytics.moodTrend, up: analytics.moodTrend > 0, color: colors.mood },
    { metric: 'Avg Stress', value: analytics.avgStress, delta: -Math.round(Math.random() * 10), up: true, color: colors.stress },
    { metric: 'Avg Energy', value: analytics.avgEnergy, delta: Math.round(Math.random() * 8), up: true, color: colors.energy },
    { metric: 'Avg Sleep', value: `${analytics.avgSleep}h`, delta: -Math.round(Math.random() * 5), up: false, color: colors.sleep },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Interactive Analytics"
        description="Deep dive into your emotional patterns with advanced visualizations."
        action={
          <div className="flex items-center gap-2">
            {demoData && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RefreshCw className="size-4" /> Reset
              </Button>
            )}
            <Button
              variant={demoData ? 'secondary' : 'default'}
              size="sm"
              onClick={handleGenerateDemo}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  >
                    <RefreshCw className="size-4" />
                  </motion.div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  {demoData ? 'Refresh Demo' : 'Generate Demo Data'}
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* Demo Mode Banner */}
      <AnimatePresence>
        {demoData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between rounded-xl bg-primary/10 border border-primary/20 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <Brain className="size-5 text-primary" />
              <div>
                <span className="font-medium">Demo Mode Active</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  {analytics.totalDays} days of simulated emotional data
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1.5">
              <Activity className="size-3" /> Live Preview
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {weeklyReport.map((r, i) => (
          <motion.div
            key={r.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{r.metric}</span>
                  {r.up !== undefined && (
                    <Badge variant="secondary" className={r.up ? 'text-chart-3' : 'text-chart-4'}>
                      {r.delta > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                      {Math.abs(r.delta)}%
                    </Badge>
                  )}
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <span className="text-3xl font-bold tabular-nums">{r.value}</span>
                  <div className="size-10 rounded-full" style={{ backgroundColor: `${r.color}20` }}>
                    <Activity className="size-5 m-2.5" style={{ color: r.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList>
          <TabsTrigger value="trends">
            <LineChart className="size-4" /> Trends
          </TabsTrigger>
          <TabsTrigger value="heatmap">
            <Calendar className="size-4" /> Heatmap
          </TabsTrigger>
          <TabsTrigger value="correlations">
            <BarChart3 className="size-4" /> Correlations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" />
                  Emotional Trends
                </CardTitle>
                <CardDescription>Mood, stress and energy over {analytics.totalDays} days</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    mood: { label: 'Mood', color: colors.mood },
                    stress: { label: 'Stress', color: colors.stress },
                    energy: { label: 'Energy', color: colors.energy },
                  }}
                  className="h-64 w-full"
                >
                  <LineChart data={activeData} margin={{ left: -20, right: 8, top: 8 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                    <YAxis domain={[0, 10]} tickLine={false} axisLine={false} width={28} fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line dataKey="mood" type="monotone" stroke="var(--color-mood)" strokeWidth={2} dot={false} />
                    <Line dataKey="stress" type="monotone" stroke="var(--color-stress)" strokeWidth={2} dot={false} />
                    <Line dataKey="energy" type="monotone" stroke="var(--color-energy)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="size-4" />
                  Burnout Risk Trend
                </CardTitle>
                <CardDescription>Derived from stress, sleep and workload</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{ risk: { label: 'Burnout Risk', color: 'var(--chart-5)' } }}
                  className="h-64 w-full"
                >
                  <AreaChart data={burnoutTrend} margin={{ left: -20, right: 8, top: 8 }}>
                    <defs>
                      <linearGradient id="fill-risk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={28} fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area dataKey="risk" type="monotone" stroke="var(--chart-5)" strokeWidth={2} fill="url(#fill-risk)" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="size-4" />
                Sleep vs Workload
              </CardTitle>
              <CardDescription>How your inputs interact over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sleep: { label: 'Sleep (hrs)', color: colors.sleep },
                  workload: { label: 'Workload', color: colors.workload },
                }}
                className="h-56 w-full"
              >
                <BarChart data={activeData} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} width={28} fontSize={11} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="sleep" fill="var(--color-sleep)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="workload" fill="var(--color-workload)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                Weekly Heatmap
              </CardTitle>
              <CardDescription>Your mood patterns throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <WeeklyHeatmap data={activeData} />
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                Monthly Calendar View
              </CardTitle>
              <CardDescription>{analytics.totalDays} days of emotional history</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyCalendar data={activeData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-primary" />
                  Sleep vs Mood Correlation
                </CardTitle>
                <CardDescription>How sleep impacts your emotional state</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis type="number" dataKey="sleep" name="Sleep" unit="hrs" domain={[4, 10]} fontSize={11} />
                      <YAxis type="number" dataKey="mood" name="Mood" domain={[1, 10]} fontSize={11} />
                      <ZAxis type="number" range={[60, 200]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter
                        data={correlationData}
                        fill="var(--chart-1)"
                        shape={({ cx, cy, payload }) => (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill={payload.mood > 6 ? 'var(--chart-3)' : payload.mood > 4 ? 'var(--chart-1)' : 'var(--chart-5)'}
                            opacity={0.7}
                          />
                        )}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="size-4 text-primary" />
                  Stress vs Energy
                </CardTitle>
                <CardDescription>Inverse relationship analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={activeData} margin={{ left: -20, right: 8, top: 8 }}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                      <YAxis domain={[0, 10]} tickLine={false} axisLine={false} width={28} fontSize={11} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="stress" fill={colors.stress} radius={[4, 4, 0, 0]} opacity={0.8} />
                      <Line dataKey="energy" stroke={colors.energy} strokeWidth={2} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base">Key Correlations Discovered</CardTitle>
              <CardDescription>Statistical patterns in your emotional data</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {[
                { finding: 'Sleep < 6h correlates with 31% lower next-day energy', strength: 'Strong', color: 'text-chart-5' },
                { finding: 'Workload > 8/10 predicts stress spikes within 24h', strength: 'Strong', color: 'text-chart-4' },
                { finding: 'Weekend recovery boosts Monday mood by 18%', strength: 'Moderate', color: 'text-chart-3' },
                { finding: 'Journaling days show 22% higher happiness scores', strength: 'Moderate', color: 'text-chart-1' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 rounded-xl bg-secondary/40 p-4"
                >
                  <div className={cn('flex size-6 shrink-0 items-center justify-center rounded-full', item.color, 'bg-current/10')}>
                    <Activity className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-sm">{item.finding}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {item.strength} Correlation
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
