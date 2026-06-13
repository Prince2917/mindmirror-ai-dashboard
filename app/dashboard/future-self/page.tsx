'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Brain, Loader as Loader2, Send, Target, TrendingUp, TrendingDown, Zap, TriangleAlert as AlertTriangle, Lightbulb, CircleCheck as CheckCircle2, Play, ArrowDownRight, ArrowUpRight, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  moodHistory,
  emotionalTwinData,
  generatePrediction,
  type FutureScenario,
  type PredictionResult,
} from '@/lib/data'
import { cn } from '@/lib/utils'

type Message = { role: 'user' | 'ai'; content: string; timestamp: Date }

const scenarioPresets = [
  { name: 'Final Exam', type: 'exam' as const, intensity: 8 },
  { name: 'Project Deadline', type: 'deadline' as const, intensity: 7 },
  { name: 'High Workload', type: 'workload' as const, intensity: 6 },
  { name: 'Business Travel', type: 'travel' as const, intensity: 5 },
  { name: 'Social Event', type: 'social' as const, intensity: 4 },
]

function StateTransform({
  current,
  predicted,
}: {
  current: PredictionResult['currentState']
  predicted: PredictionResult['predictedState']
}) {
  const metrics = [
    { key: 'mood', label: 'Mood', currentVal: current.mood, predictedVal: predicted.mood, max: 10, upIsGood: true },
    { key: 'stress', label: 'Stress', currentVal: current.stress, predictedVal: predicted.stress, max: 10, upIsGood: false },
    { key: 'energy', label: 'Energy', currentVal: current.energy, predictedVal: predicted.energy, max: 10, upIsGood: true },
    { key: 'burnout', label: 'Burnout', currentVal: current.burnoutRisk, predictedVal: predicted.burnoutRisk, max: 100, upIsGood: false },
    { key: 'anxiety', label: 'Anxiety', currentVal: current.anxietyLevel, predictedVal: predicted.anxietyLevel, max: 100, upIsGood: false },
  ]

  return (
    <div className="space-y-3">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Current</span>
        <span>Change</span>
        <span>Predicted</span>
      </div>
      {metrics.map((metric, i) => {
        const delta = metric.predictedVal - metric.currentVal
        const isPositive = metric.upIsGood ? delta > 0 : delta < 0
        const pctChange = Math.abs((delta / metric.currentVal) * 100).toFixed(0)

        return (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className="w-16 text-xs text-muted-foreground">{metric.label}</div>
            <div className="flex-1">
              <div className="relative h-5 overflow-hidden rounded-full bg-secondary/40">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary/50"
                  style={{ width: `${(metric.currentVal / metric.max) * 100}%` }}
                />
                <span className="absolute inset-y-0 left-2 flex items-center text-xs font-medium">
                  {metric.currentVal.toFixed ? metric.currentVal.toFixed(1) : Math.round(metric.currentVal)}
                </span>
              </div>
            </div>
            <div className={cn('flex items-center gap-1', isPositive ? 'text-chart-3' : 'text-chart-5')}>
              {isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              <span className="text-xs font-medium">{pctChange}%</span>
            </div>
            <div className="flex-1">
              <div className="relative h-5 overflow-hidden rounded-full bg-secondary/40">
                <div
                  className={cn('absolute inset-y-0 left-0 rounded-full', isPositive ? 'bg-chart-3/70' : 'bg-chart-5/70')}
                  style={{ width: `${(metric.predictedVal / metric.max) * 100}%` }}
                />
                <span className="absolute inset-y-0 left-2 flex items-center text-xs font-medium">
                  {metric.predictedVal.toFixed ? metric.predictedVal.toFixed(1) : Math.round(metric.predictedVal)}
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function FutureSelfPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content:
        "Hi Avery - I'm your Future Self, modeled from your check-ins and journals. Ask me how you're likely to feel, or create a detailed simulation below.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)

  const [scenarioForm, setScenarioForm] = useState<FutureScenario>({
    id: '',
    name: '',
    type: 'deadline',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    intensity: 5,
    description: '',
  })

  const currentMood = moodHistory[moodHistory.length - 1]

  function generateResponse(question: string): string {
    const q = question.toLowerCase()
    if (q.includes('best') || q.includes('good')) {
      return 'Based on your patterns, Saturday looks strongest (projected mood 7.8/10). Energy and motivation peak after restful weekends - ideal for creative work.'
    }
    if (q.includes('burnout') || q.includes('risk')) {
      return 'Your burnout risk trends upward midweek (+12% vs baseline). Sleep protection and meeting batching could reduce projected risk from 42% to 28%.'
    }
    if (q.includes('sleep') || q.includes('tired')) {
      return 'Sleep is your highest-leverage metric. 7+ hours correlates with 22% mood improvement and 31% energy gain. Optimize sleep to raise your overall score by 8 points.'
    }
    return 'Your 14-day baseline shows 68/100 health. Weekends recover, Wed-Thu peaks stress. Next week averages 6.4 mood with a Wednesday dip. Try the simulator for specific events!'
  }

  function ask(question: string) {
    if (!question.trim()) return
    setMessages((m) => [...m, { role: 'user', content: question, timestamp: new Date() }])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'ai', content: generateResponse(question), timestamp: new Date() }])
      setLoading(false)
    }, 1200)
  }

  function runSimulation() {
    if (!scenarioForm.name || !scenarioForm.date) return
    const scenario: FutureScenario = { ...scenarioForm, id: `scenario-${Date.now()}` }
    const result = generatePrediction(scenario, currentMood)
    setPrediction(result)
    setMessages((m) => [
      ...m,
      {
        role: 'ai',
        content: `I've analyzed "${scenarioForm.name}". The simulation predicts a ${result.predictedState.mood > result.currentState.mood ? 'positive' : 'challenging'} outcome with ${result.confidence}% confidence. See detailed results below.`,
        timestamp: new Date(),
      },
    ])
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Future Self Simulator"
        description="Predict how upcoming events will affect your emotional state."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat */}
        <Card className="glass flex h-[34rem] flex-col lg:col-span-1">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="size-4 text-primary" /> Ask Your Future Self
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 overflow-y-auto py-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={msg.role === 'user' ? 'flex justify-end' : 'flex gap-2'}
                >
                  {msg.role === 'ai' && (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20">
                      <Brain className="size-3.5 text-primary" />
                    </span>
                  )}
                  <div className="flex max-w-[85%] flex-col gap-0.5">
                    <div
                      className={cn(
                        'rounded-2xl px-3 py-2 text-sm',
                        msg.role === 'user'
                          ? 'rounded-tr-sm bg-primary text-primary-foreground'
                          : 'rounded-tl-sm bg-secondary'
                      )}
                    >
                      {msg.content}
                    </div>
                    <span className="px-2 text-[10px] text-muted-foreground">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <Brain className="size-3.5 text-primary" />
                </span>
                <div className="rounded-2xl rounded-tl-sm bg-secondary px-3 py-2.5">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </CardContent>
          <div className="border-t border-border p-3">
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); ask(input) }}>
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="How will I feel?" className="flex-1" />
              <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Simulator */}
        <div className="space-y-5 lg:col-span-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="size-4 text-primary" /> Create Simulation
              </CardTitle>
              <CardDescription>Configure an event to predict emotional impact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="mb-2 block text-xs font-medium">Quick Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {scenarioPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => setScenarioForm({ ...scenarioForm, name: preset.name, type: preset.type, intensity: preset.intensity })}
                      className={cn(scenarioForm.name === preset.name && 'border-primary bg-primary/10')}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Scenario Name</Label>
                  <Input id="name" value={scenarioForm.name} onChange={(e) => setScenarioForm({ ...scenarioForm, name: e.target.value })} placeholder="e.g., Final Exam" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="date">Event Date</Label>
                  <Input id="date" type="date" value={scenarioForm.date} onChange={(e) => setScenarioForm({ ...scenarioForm, date: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Event Type</Label>
                <div className="flex flex-wrap gap-2">
                  {['exam', 'deadline', 'workload', 'travel', 'social'].map((type) => (
                    <Badge
                      key={type}
                      variant={scenarioForm.type === type ? 'default' : 'secondary'}
                      className="cursor-pointer capitalize"
                      onClick={() => setScenarioForm({ ...scenarioForm, type: type as FutureScenario['type'] })}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Intensity</Label>
                  <span className="text-sm font-medium">{scenarioForm.intensity}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={scenarioForm.intensity}
                  onChange={(e) => setScenarioForm({ ...scenarioForm, intensity: Number(e.target.value) })}
                  className="h-2 w-full cursor-pointer rounded-full bg-secondary"
                />
              </div>

              <Button onClick={runSimulation} className="w-full" size="lg" disabled={!scenarioForm.name}>
                <Play className="size-4" /> Run Simulation
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <AnimatePresence>
            {prediction && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="glass border-primary/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="size-5 text-primary" /> Prediction Results
                        </CardTitle>
                        <CardDescription className="mt-0.5">{prediction.scenario} • {prediction.timeline}</CardDescription>
                      </div>
                      <Badge className="text-lg font-semibold">{prediction.confidence}%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="rounded-xl bg-secondary/30 p-4">
                      <StateTransform current={prediction.currentState} predicted={prediction.predictedState} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Lightbulb className="size-4 text-chart-3" /> Recommended Actions
                        </div>
                        <div className="space-y-1.5">
                          {prediction.actions.slice(0, 3).map((action, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-2 rounded-lg bg-secondary/40 p-2"
                            >
                              <CheckCircle2 className="size-4 shrink-0 text-chart-3" />
                              <span className="text-xs">{action}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <AlertTriangle className="size-4 text-chart-5" /> Warnings
                        </div>
                        {prediction.warnings.length > 0 ? (
                          <div className="space-y-1.5">
                            {prediction.warnings.map((warning, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-2 rounded-lg border border-chart-5/30 bg-chart-5/10 p-2"
                              >
                                <AlertTriangle className="size-4 shrink-0 text-chart-5" />
                                <span className="text-xs">{warning}</span>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 rounded-lg bg-chart-3/10 p-2 text-xs text-chart-3">
                            <CheckCircle2 className="size-4" /> No critical warnings
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-primary/10 p-4">
                      <div className="flex items-center gap-2">
                        <Zap className="size-5 text-primary" />
                        <span className="font-medium">Predicted Productivity</span>
                      </div>
                      <span className="text-2xl font-bold text-primary">{prediction.predictedState.productivity}%</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
