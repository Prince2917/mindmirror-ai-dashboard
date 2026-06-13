'use client'

import { useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Target,
  Activity,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Calendar,
  Brain,
  Heart,
  Zap,
  Shield,
  Moon,
  Sun,
  Award,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { forecast, triggers, patterns, weeklyReports, aiInsights, emotionalTwinData, moodHistory, type WeeklyReport, type InsightCard } from '@/lib/data'
import { cn } from '@/lib/utils'

const impactColor: Record<string, string> = {
  high: 'text-chart-5 bg-chart-5/10',
  medium: 'text-chart-4 bg-chart-4/10',
  low: 'text-chart-3 bg-chart-3/10',
}

// Weekly Report Card
function WeeklyReportCard({ report }: { report: WeeklyReport }) {
  const isImprovement = report.moodTrend > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl glass p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground">
            Week of {new Date(report.weekStartDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-2 mt-1">
            {report.burnoutWarning && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="size-3" /> Burnout Warning
              </Badge>
            )}
            {report.moodTrend > 5 && (
              <Badge variant="secondary" className="text-xs text-chart-3">
                <TrendingUp className="size-3" /> On Track
              </Badge>
            )}
          </div>
        </div>
        <div className={cn(
          'flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium',
          isImprovement ? 'bg-chart-3/20 text-chart-3' : 'bg-chart-5/20 text-chart-5'
        )}>
          {isImprovement ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
          {Math.abs(report.moodTrend)}%
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="rounded-lg bg-secondary/40 p-3 text-center">
          <div className="text-lg font-semibold">{report.avgMood}</div>
          <div className="text-xs text-muted-foreground">Avg Mood</div>
        </div>
        <div className="rounded-lg bg-secondary/40 p-3 text-center">
          <div className="text-lg font-semibold">{report.avgStress}</div>
          <div className="text-xs text-muted-foreground">Avg Stress</div>
        </div>
        <div className="rounded-lg bg-secondary/40 p-3 text-center">
          <div className="text-lg font-semibold">{report.avgEnergy}</div>
          <div className="text-xs text-muted-foreground">Avg Energy</div>
        </div>
        <div className="rounded-lg bg-secondary/40 p-3 text-center">
          <div className="text-lg font-semibold">{report.avgSleep}h</div>
          <div className="text-xs text-muted-foreground">Avg Sleep</div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <AlertTriangle className="size-3 text-chart-5" />
            Top Triggers
          </div>
          <div className="flex flex-wrap gap-1.5">
            {report.topTriggers.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Lightbulb className="size-3 text-chart-3" />
            Positive Habits
          </div>
          <div className="flex flex-wrap gap-1.5">
            {report.positiveHabits.map((h) => (
              <Badge key={h} variant="outline" className="text-xs text-chart-3">{h}</Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-primary/10 p-3">
        <div className="flex items-center gap-2 text-xs font-medium">
          <Brain className="size-3 text-primary" />
          Next Week Prediction
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="text-center">
            <div className="text-sm font-semibold">{report.predictionNextWeek.moodPrediction}</div>
            <div className="text-xs text-muted-foreground">Mood</div>
          </div>
          <div className="text-center">
            <div className={cn('text-sm font-semibold', report.predictionNextWeek.burnoutProbability > 50 && 'text-chart-5')}>
              {report.predictionNextWeek.burnoutProbability}%
            </div>
            <div className="text-xs text-muted-foreground">Burnout</div>
          </div>
          <div className="text-center">
            <div className={cn('text-sm font-semibold', report.predictionNextWeek.anxietyProbability > 50 && 'text-chart-4')}>
              {report.predictionNextWeek.anxietyProbability}%
            </div>
            <div className="text-xs text-muted-foreground">Anxiety</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Insight Card Component
function InsightCardComponent({ insight }: { insight: InsightCard }) {
  const typeIcons = {
    pattern: Activity,
    warning: AlertTriangle,
    recommendation: Lightbulb,
    achievement: Award,
    prediction: Brain,
  }
  const Icon = typeIcons[insight.type] || Sparkles

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'rounded-xl border p-4 transition-all hover:scale-[1.01]',
        insight.type === 'warning' && 'border-chart-5/30 bg-chart-5/5',
        insight.type === 'achievement' && 'border-chart-3/30 bg-chart-3/5',
        insight.type === 'recommendation' && 'border-chart-1/30 bg-chart-1/5',
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', impactColor[insight.impact])}>
          <Icon className="size-4" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{insight.title}</span>
            <Badge variant="outline" className="text-xs capitalize">
              {insight.type}
            </Badge>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{insight.description}</p>
          {insight.timeframe && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="size-3" />
              {insight.timeframe}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Emotion Distribution Pie Chart Data
const emotionData = [
  { name: 'Happiness', value: 35, color: 'var(--chart-3)' },
  { name: 'Stress', value: 20, color: '#f59e0b' },
  { name: 'Motivation', value: 25, color: 'var(--chart-1)' },
  { name: 'Anxiety', value: 12, color: 'var(--chart-4)' },
  { name: 'Burnout', value: 8, color: 'var(--chart-5)' },
]

// Radar Chart Data
const radarData = [
  { metric: 'Mood', value: 68, fullMark: 100 },
  { metric: 'Energy', value: 58, fullMark: 100 },
  { metric: 'Resilience', value: 55, fullMark: 100 },
  { metric: 'Motivation', value: 62, fullMark: 100 },
  { metric: 'Sleep', value: 72, fullMark: 100 },
  { metric: 'Recovery', value: 65, fullMark: 100 },
]

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Insights Engine"
        description="Your AI-generated reports, pattern detection, and burnout predictions."
      />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Weekly Patterns', value: '12', icon: Activity, color: 'var(--chart-1)', trend: '+3' },
          { label: 'Active Warnings', value: '3', icon: AlertTriangle, color: 'var(--chart-5)', trend: '-1' },
          { label: 'Habits Tracking', value: '8', icon: Target, color: 'var(--chart-3)', trend: '+2' },
          { label: 'Achievements', value: '5', icon: Award, color: 'var(--chart-2)', trend: '+1' },
        ].map((stat) => (
          <Card key={stat.label} className="glass">
            <CardContent className="flex items-center justify-between pt-5">
              <div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-2xl font-semibold">{stat.value}</div>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon className="size-5" style={{ color: stat.color }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="forecast" className="space-y-6">
        <TabsList>
          <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
          <TabsTrigger value="reports">Weekly Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Forecast Chart */}
            <Card className="glass lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" />
                  Emotional Forecast
                </CardTitle>
                <CardDescription>Predicted mood trajectory with confidence band</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    predicted: { label: 'Predicted', color: 'var(--chart-1)' },
                    upper: { label: 'Upper', color: 'var(--chart-2)' },
                  }}
                  className="h-64 w-full"
                >
                  <AreaChart data={forecast} margin={{ left: -20, right: 8, top: 8 }}>
                    <defs>
                      <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                    <YAxis domain={[0, 10]} tickLine={false} axisLine={false} width={28} fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ReferenceLine y={5} stroke="var(--chart-5)" strokeDasharray="4 4" />
                    <Area dataKey="upper" type="monotone" stroke="none" fill="url(#band)" />
                    <Area dataKey="lower" type="monotone" stroke="none" fill="var(--background)" fillOpacity={1} />
                    <Line dataKey="predicted" type="monotone" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--chart-1)' }} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Emotion Distribution */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-base">Emotion Distribution</CardTitle>
                <CardDescription>This week's emotional profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emotionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {emotionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {emotionData.slice(0, 4).map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2 text-xs">
                      <div className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-muted-foreground">{entry.name}</span>
                      <span className="ml-auto font-medium">{entry.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Indicators */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="size-4 text-chart-5" />
                  Risk Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <RiskRow icon={TrendingDown} label="Midweek mood dip" value="Wed-Thu" tone="text-chart-5" />
                <RiskRow icon={Activity} label="Burnout risk trend" value="Rising" tone="text-chart-4" />
                <RiskRow icon={Target} label="Sleep debt" value="2.5 hrs" tone="text-chart-4" />
                <RiskRow icon={Moon} label="Recovery deficit" value="12%" tone="text-chart-4" />
              </CardContent>
            </Card>

            <Card className="glass lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Trigger Detection</CardTitle>
                <CardDescription>Recurring factors most linked to your low days</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {triggers.map((t) => (
                  <div key={t.label} className="flex items-center justify-between rounded-xl bg-secondary/40 px-4 py-3 transition-all hover:bg-secondary/60">
                    <div>
                      <div className="text-sm font-medium">{t.label}</div>
                      <div className="text-xs text-muted-foreground">Detected {t.detected}x this fortnight</div>
                    </div>
                    <Badge variant="secondary" className={cn('capitalize', impactColor[t.impact].split(' ')[0])}>
                      {t.impact}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pattern List */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="size-4 text-primary" />
                  Detected Patterns
                </CardTitle>
                <CardDescription>What your emotional data reveals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {patterns.map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 rounded-xl bg-secondary/40 p-4"
                  >
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground">{p}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-base">Wellness Radar</CardTitle>
                <CardDescription>Your emotional dimensions at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                      <Radar name="You" dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    AI-Generated Insights
                  </CardTitle>
                  <CardDescription className="mt-1">Personalized findings from your digital twin</CardDescription>
                </div>
                <Badge variant="secondary">
                  <Brain className="size-3" /> {aiInsights.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {aiInsights.map((insight) => (
                  <InsightCardComponent key={insight.id} insight={insight} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {weeklyReports.map((report, i) => (
              <WeeklyReportCard key={i} report={report} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RiskRow({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType
  label: string
  value: string
  tone: string
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-secondary/40 px-4 py-3">
      <span className="flex items-center gap-2 text-sm">
        <Icon className={cn('size-4', tone)} />
        {label}
      </span>
      <span className={cn('text-sm font-semibold', tone)}>{value}</span>
    </div>
  )
}
