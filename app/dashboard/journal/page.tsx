'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader as Loader2, Sparkles, TriangleAlert as AlertTriangle, Battery, Activity, TrendingUp, Heart, Brain, Zap, Shield, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { journalEntries, analyzeJournal, emotionColor, type EmotionScore, type JournalEntry } from '@/lib/data'
import { cn } from '@/lib/utils'

type JournalAnalysis = {
  emotions: EmotionScore[]
  dominant: EmotionScore['emotion']
  stressScore: number
  burnoutRisk: number
  mentalEnergy: number
  sentimentScore: number
  summary: string
}

// Metric Card Component
function MetricCard({
  label,
  value,
  max,
  icon: Icon,
  color,
  description,
}: {
  label: string
  value: number
  max: number
  icon: React.ElementType
  color: string
  description: string
}) {
  const percentage = Math.round((value / max) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-secondary/40 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}20` }}>
            <Icon className="size-4" style={{ color }} />
          </div>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-lg font-semibold tabular-nums">{value}</span>
      </div>
      <div className="mt-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{description}</span>
          <span>{percentage}%</span>
        </div>
      </div>
    </motion.div>
  )
}

// Emotion Bar Component
function EmotionBar({ emotion, confidence }: { emotion: EmotionScore['emotion']; confidence: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{emotion}</span>
        <span className="tabular-nums text-muted-foreground">{confidence}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: emotionColor(emotion) }}
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

// Tag Component for Emotions
function EmotionTag({ emotion, confidence }: { emotion: EmotionScore['emotion']; confidence: number }) {
  const highConfidence = confidence > 60

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Badge
        variant={highConfidence ? 'default' : 'secondary'}
        className="gap-1.5"
        style={highConfidence ? { backgroundColor: emotionColor(emotion), borderColor: emotionColor(emotion) } : undefined}
      >
        {confidence > 70 && <Sparkles className="size-3" />}
        {emotion}
      </Badge>
    </motion.div>
  )
}

export default function JournalPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<JournalAnalysis | null>(null)
  const [entries, setEntries] = useState<JournalEntry[]>(journalEntries)

  function submit() {
    if (!text.trim()) return
    setLoading(true)
    setResult(null)
    setTimeout(() => {
      const analysis = analyzeJournal(text)
      setResult(analysis)

      // Add to recent entries (mock)
      const newEntry: JournalEntry = {
        id: `j-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        preview: text.slice(0, 150) + (text.length > 150 ? '...' : ''),
        content: text,
        emotions: analysis.emotions,
        dominant: analysis.dominant,
        stressScore: analysis.stressScore,
        burnoutRisk: analysis.burnoutRisk,
        mentalEnergy: analysis.mentalEnergy,
        sentimentScore: analysis.sentimentScore,
        analysis: analysis.summary,
      }
      setEntries([newEntry, ...entries.slice(0, 4)])

      setLoading(false)
    }, 1400)
  }

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Journal"
        description="Write freely about your day. MindMirror analyzes the emotional fingerprint of your words."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Journal Input */}
          <Card className="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>New Entry</CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="gap-1.5">
                  <Moon className="size-3" />
                  Evening
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Today I felt... What happened? How did you respond? What are you grateful for?"
                className="min-h-56 resize-none text-base leading-relaxed"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">{wordCount} words</span>
                  {wordCount > 50 && (
                    <Badge variant="outline" className="text-chart-3">
                      <Sparkles className="size-3" /> Rich entry
                    </Badge>
                  )}
                </div>
                <Button onClick={submit} disabled={loading || !text.trim()} size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="size-4" /> Analyze with AI
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Emotion Tags */}
                <Card className="glass">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Heart className="size-4 text-chart-5" /> Detected Emotions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {result.emotions.slice(0, 5).map((e, i) => (
                        <EmotionTag key={i} emotion={e.emotion} confidence={e.confidence} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3">
                      <Sparkles className="size-4 text-primary" />
                      <span className="text-sm">
                        Primary: <strong>{result.dominant}</strong> detected
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Emotion Breakdown */}
                <Card className="glass">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Emotion Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.emotions.map((e, i) => (
                      <EmotionBar key={i} emotion={e.emotion} confidence={e.confidence} />
                    ))}
                  </CardContent>
                </Card>

                {/* Mental Health Metrics */}
                <Card className="glass">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Activity className="size-4" /> Mental Health Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <MetricCard
                        label="Stress Score"
                        value={result.stressScore}
                        max={100}
                        icon={AlertTriangle}
                        color="var(--chart-5)"
                        description="Elevated indicators"
                      />
                      <MetricCard
                        label="Burnout Risk"
                        value={result.burnoutRisk}
                        max={100}
                        icon={Battery}
                        color="var(--chart-4)"
                        description="Warning level"
                      />
                      <MetricCard
                        label="Mental Energy"
                        value={result.mentalEnergy}
                        max={100}
                        icon={Zap}
                        color="var(--chart-3)"
                        description="Reservoir status"
                      />
                      <MetricCard
                        label="Sentiment"
                        value={result.sentimentScore}
                        max={100}
                        icon={Sun}
                        color="var(--chart-1)"
                        description="Overall positive"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* AI Summary */}
                <Card className="glass border-primary/30">
                  <CardContent className="flex items-start gap-3 pt-6">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                      <Brain className="size-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium">AI Analysis</span>
                      <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="glass border-dashed">
                  <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                      <Brain className="size-8 text-primary/60" />
                    </div>
                    <div>
                      <p className="font-medium">Your AI Analysis</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Write about your day and submit to see emotion detection, stress analysis, and personal insights.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="secondary">Emotion Detection</Badge>
                      <Badge variant="secondary">Stress Analysis</Badge>
                      <Badge variant="secondary">Burnout Warning</Badge>
                      <Badge variant="secondary">Energy Score</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent Entries */}
        <div className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
              <CardDescription>Your journal history and patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence initial={false}>
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl bg-secondary/40 p-4 transition-colors hover:bg-secondary/60"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-2">
                        {entry.stressScore !== undefined && entry.stressScore > 50 && (
                          <Badge variant="outline" className="text-chart-5">
                            <AlertTriangle className="size-3" />
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className={cn(
                            entry.dominant === 'Happiness' && 'text-chart-3',
                            entry.dominant === 'Burnout' && 'text-chart-5',
                            entry.dominant === 'Motivation' && 'text-chart-1',
                          )}
                        >
                          {entry.dominant}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{entry.preview}</p>
                    {entry.stressScore !== undefined && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="rounded-lg bg-background/50 p-2 text-center">
                          <div className="text-xs text-muted-foreground">Stress</div>
                          <div className="text-sm font-semibold">{entry.stressScore}</div>
                        </div>
                        <div className="rounded-lg bg-background/50 p-2 text-center">
                          <div className="text-xs text-muted-foreground">Energy</div>
                          <div className="text-sm font-semibold">{entry.mentalEnergy}</div>
                        </div>
                        <div className="rounded-lg bg-background/50 p-2 text-center">
                          <div className="text-xs text-muted-foreground">Burnout</div>
                          <div className="text-sm font-semibold">{entry.burnoutRisk}%</div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Writing Tips */}
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Writing Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Zap className="size-4 shrink-0 text-chart-1" />
                <p className="text-xs text-muted-foreground">
                  Specific details improve emotion detection accuracy by 40%
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="size-4 shrink-0 text-chart-5" />
                <p className="text-xs text-muted-foreground">
                  Include how you felt physically, not just emotionally
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="size-4 shrink-0 text-chart-3" />
                <p className="text-xs text-muted-foreground">
                  Your entries are private and used only for your personal insights
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
