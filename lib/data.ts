export type MoodEntry = {
  date: string
  label: string
  mood: number
  stress: number
  energy: number
  sleep: number
  workload: number
  anxiety?: number
  motivation?: number
  resilience?: number
}

export type EmotionScore = {
  emotion: 'Anxiety' | 'Stress' | 'Happiness' | 'Burnout' | 'Motivation' | 'Calm' | 'Frustration' | 'Hope'
  confidence: number
}

export type JournalEntry = {
  id: string
  date: string
  preview: string
  content?: string
  emotions: EmotionScore[]
  dominant: EmotionScore['emotion']
  stressScore?: number
  burnoutRisk?: number
  mentalEnergy?: number
  sentimentScore?: number
  analysis?: string
}

export type EmotionalTwinData = {
  emotionalHealthScore: number
  burnoutRiskScore: number
  anxietyScore: number
  motivationScore: number
  energyScore: number
  resilienceScore: number
  lastUpdated: string
}

export type InsightCard = {
  id: string
  type: 'pattern' | 'warning' | 'recommendation' | 'achievement' | 'prediction'
  title: string
  description: string
  icon: string
  impact: 'high' | 'medium' | 'low'
  timeframe?: string
}

export type WeeklyReport = {
  weekStartDate: string
  weekEndDate: string
  avgMood: number
  avgStress: number
  avgEnergy: number
  avgSleep: number
  moodTrend: number
  stressTrend: number
  energyTrend: number
  topTriggers: string[]
  positiveHabits: string[]
  burnoutWarning: boolean
  predictionNextWeek: {
    moodPrediction: number
    burnoutProbability: number
    anxietyProbability: number
  }
}

export type MonthlyReport = {
  month: string
  year: number
  avgMood: number
  avgStress: number
  avgEnergy: number
  avgSleep: number
  bestDay: string
  worstDay: string
  mostFrequentEmotion: string
  improvementAreas: string[]
  achievements: string[]
}

export type FutureScenario = {
  id: string
  name: string
  type: 'exam' | 'deadline' | 'workload' | 'travel' | 'social' | 'custom'
  date: string
  intensity: number
  description: string
}

export type PredictionResult = {
  scenario: string
  currentState: {
    mood: number
    stress: number
    energy: number
    burnoutRisk: number
    anxietyLevel: number
  }
  predictedState: {
    mood: number
    stress: number
    energy: number
    burnoutRisk: number
    anxietyLevel: number
    productivity: number
  }
  confidence: number
  timeline: string
  actions: string[]
  warnings: string[]
}

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Generate 90 days of demo data
export function generateDemoData(days: number = 90): MoodEntry[] {
  const data: MoodEntry[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // Base patterns - weekdays have higher stress, lower energy
    const baseMood = isWeekend ? 7.5 : 6
    const baseStress = isWeekend ? 3 : 6
    const baseEnergy = isWeekend ? 7.5 : 5.5
    const baseSleep = isWeekend ? 8 : 6.5
    const baseWorkload = isWeekend ? 2 : 7

    // Add randomness and trends
    const randomFactor = () => (Math.random() - 0.5) * 2
    const cycleFactor = Math.sin((i / 14) * Math.PI * 2) * 1.5 // 2-week cycle

    // Simulate burnout periods
    const isBurnoutPeriod = (i > 60 && i < 75) || (i > 25 && i < 40)
    const burnoutModifier = isBurnoutPeriod ? -1.5 : 0

    // Simulate recovery periods
    const isRecoveryPeriod = (i > 50 && i < 60) || (i > 10 && i < 20)
    const recoveryModifier = isRecoveryPeriod ? 1 : 0

    const mood = Math.max(1, Math.min(10, baseMood + randomFactor() + cycleFactor + burnoutModifier + recoveryModifier))
    const stress = Math.max(1, Math.min(10, baseStress + randomFactor() - cycleFactor - burnoutModifier))
    const energy = Math.max(1, Math.min(10, baseEnergy + randomFactor() + cycleFactor * 0.5 + burnoutModifier + recoveryModifier))
    const sleep = Math.max(4, Math.min(10, baseSleep + randomFactor() * 0.5 + (isRecoveryPeriod ? 1 : 0)))
    const workload = Math.max(1, Math.min(10, baseWorkload + randomFactor() + (isBurnoutPeriod ? 2 : 0)))

    data.push({
      date: date.toISOString().split('T')[0],
      label: dayLabels[(dayOfWeek + 6) % 7],
      mood: Math.round(mood * 10) / 10,
      stress: Math.round(stress * 10) / 10,
      energy: Math.round(energy * 10) / 10,
      sleep: Math.round(sleep * 10) / 10,
      workload: Math.round(workload * 10) / 10,
      anxiety: Math.round(Math.max(1, Math.min(10, 5 + randomFactor() + (stress > 7 ? 2 : 0))) * 10) / 10,
      motivation: Math.round(Math.max(1, Math.min(10, 6 + randomFactor() + (mood > 7 ? 1 : 0))) * 10) / 10,
      resilience: Math.round(Math.max(1, Math.min(10, 6 + randomFactor() + recoveryModifier)) * 10) / 10,
    })
  }

  return data
}

// 14 days of trend data
export const moodHistory: MoodEntry[] = [
  { date: '2026-05-31', label: 'Sat', mood: 7, stress: 4, energy: 7, sleep: 7.5, workload: 4, anxiety: 3, motivation: 7, resilience: 6 },
  { date: '2026-06-01', label: 'Sun', mood: 8, stress: 3, energy: 8, sleep: 8, workload: 2, anxiety: 2, motivation: 8, resilience: 7 },
  { date: '2026-06-02', label: 'Mon', mood: 6, stress: 6, energy: 6, sleep: 6.5, workload: 7, anxiety: 5, motivation: 6, resilience: 5 },
  { date: '2026-06-03', label: 'Tue', mood: 5, stress: 7, energy: 5, sleep: 5.5, workload: 8, anxiety: 6, motivation: 5, resilience: 4 },
  { date: '2026-06-04', label: 'Wed', mood: 5, stress: 8, energy: 4, sleep: 5, workload: 9, anxiety: 7, motivation: 4, resilience: 4 },
  { date: '2026-06-05', label: 'Thu', mood: 4, stress: 8, energy: 4, sleep: 5.5, workload: 9, anxiety: 8, motivation: 3, resilience: 3 },
  { date: '2026-06-06', label: 'Fri', mood: 6, stress: 6, energy: 6, sleep: 7, workload: 6, anxiety: 5, motivation: 6, resilience: 5 },
  { date: '2026-06-07', label: 'Sat', mood: 7, stress: 4, energy: 7, sleep: 8, workload: 3, anxiety: 3, motivation: 7, resilience: 6 },
  { date: '2026-06-08', label: 'Sun', mood: 8, stress: 3, energy: 8, sleep: 8.5, workload: 2, anxiety: 2, motivation: 8, resilience: 7 },
  { date: '2026-06-09', label: 'Mon', mood: 6, stress: 6, energy: 6, sleep: 6, workload: 7, anxiety: 5, motivation: 6, resilience: 5 },
  { date: '2026-06-10', label: 'Tue', mood: 5, stress: 7, energy: 5, sleep: 6, workload: 8, anxiety: 6, motivation: 5, resilience: 4 },
  { date: '2026-06-11', label: 'Wed', mood: 6, stress: 6, energy: 6, sleep: 6.5, workload: 7, anxiety: 5, motivation: 6, resilience: 5 },
  { date: '2026-06-12', label: 'Thu', mood: 7, stress: 5, energy: 7, sleep: 7, workload: 5, anxiety: 4, motivation: 7, resilience: 6 },
  { date: '2026-06-13', label: 'Fri', mood: 7, stress: 5, energy: 7, sleep: 7.5, workload: 5, anxiety: 4, motivation: 7, resilience: 6 },
]

// Forecast next 7 days
export const forecast: { label: string; predicted: number; lower: number; upper: number }[] = [
  { label: 'Sat', predicted: 7.4, lower: 6.6, upper: 8.2 },
  { label: 'Sun', predicted: 7.8, lower: 7.0, upper: 8.6 },
  { label: 'Mon', predicted: 6.2, lower: 5.2, upper: 7.2 },
  { label: 'Tue', predicted: 5.6, lower: 4.4, upper: 6.8 },
  { label: 'Wed', predicted: 5.2, lower: 4.0, upper: 6.4 },
  { label: 'Thu', predicted: 5.8, lower: 4.6, upper: 7.0 },
  { label: 'Fri', predicted: 6.6, lower: 5.6, upper: 7.6 },
]

export const journalEntries: JournalEntry[] = [
  {
    id: 'j1',
    date: '2026-06-13',
    preview: 'Wrapped up the quarterly review today. Felt a wave of relief but I am already thinking about next week\'s deadlines...',
    content: 'Wrapped up the quarterly review today. Felt a wave of relief but I am already thinking about next week\'s deadlines. The presentation went well, got positive feedback from leadership. Still, there\'s this nagging feeling that I need to prepare for next sprint. Trying to balance celebrating the win with staying ahead of things.',
    dominant: 'Motivation',
    emotions: [
      { emotion: 'Motivation', confidence: 72 },
      { emotion: 'Stress', confidence: 48 },
      { emotion: 'Happiness', confidence: 61 },
      { emotion: 'Anxiety', confidence: 33 },
      { emotion: 'Burnout', confidence: 21 },
    ],
    stressScore: 42,
    burnoutRisk: 28,
    mentalEnergy: 68,
    sentimentScore: 65,
    analysis: 'Your entry shows a healthy balance of achievement and forward-thinking. Motivation is high, which correlates with successful task completion. Anxiety markers suggest healthy awareness of upcoming challenges without being overwhelmed.',
  },
  {
    id: 'j2',
    date: '2026-06-11',
    preview: 'Three back-to-back meetings drained me. I skipped lunch again and my focus completely collapsed by the afternoon...',
    content: 'Three back-to-back meetings drained me. I skipped lunch again and my focus completely collapsed by the afternoon. I could barely keep my eyes open during the last call. Everything feels heavy. Need to remember to protect my energy better.',
    dominant: 'Burnout',
    emotions: [
      { emotion: 'Burnout', confidence: 68 },
      { emotion: 'Stress', confidence: 74 },
      { emotion: 'Anxiety', confidence: 52 },
      { emotion: 'Motivation', confidence: 29 },
      { emotion: 'Happiness', confidence: 18 },
    ],
    stressScore: 78,
    burnoutRisk: 72,
    mentalEnergy: 22,
    sentimentScore: 18,
    analysis: 'High burnout and stress indicators detected. Pattern suggests energy depletion from consecutive meetings without breaks. Recommend scheduling buffer time between meetings and ensuring proper nutrition. This is a warning sign for sustained burnout.',
  },
  {
    id: 'j3',
    date: '2026-06-08',
    preview: 'Slept in, went for a long walk by the river, and finally called my sister. A genuinely restorative Sunday.',
    content: 'Slept in, went for a long walk by the river, and finally called my sister. A genuinely restorative Sunday. We talked for hours about everything. Feeling connected and grounded. This is the kind of day I need more of.',
    dominant: 'Happiness',
    emotions: [
      { emotion: 'Happiness', confidence: 84 },
      { emotion: 'Calm', confidence: 76 },
      { emotion: 'Motivation', confidence: 57 },
      { emotion: 'Anxiety', confidence: 12 },
      { emotion: 'Stress', confidence: 9 },
    ],
    stressScore: 8,
    burnoutRisk: 5,
    mentalEnergy: 92,
    sentimentScore: 88,
    analysis: 'Exceptional recovery metrics. Social connection and nature exposure created strong positive emotional response. This pattern of restorative activities should be preserved and repeated. Model predicts this will positively impact the next 3-4 days.',
  },
]

// Emotional Digital Twin Scores
export const emotionalTwinData: EmotionalTwinData = {
  emotionalHealthScore: 68,
  burnoutRiskScore: 42,
  anxietyScore: 45,
  motivationScore: 62,
  energyScore: 58,
  resilienceScore: 55,
  lastUpdated: new Date().toISOString(),
}

export const emotionalHealthScore = 68
export const burnoutRisk = 42
export const moodTrendDelta = +8

export const triggers = [
  { label: 'Back-to-back meetings', impact: 'high', detected: 6 },
  { label: 'Skipped meals', impact: 'medium', detected: 4 },
  { label: 'Sleep under 6 hours', impact: 'high', detected: 5 },
  { label: 'Late-night work', impact: 'medium', detected: 3 },
]

export const patterns = [
  'Your mood dips an average of 2.1 points on days with workload above 8/10.',
  'Stress peaks midweek (Wed–Thu) and recovers over the weekend.',
  'Nights under 6 hours of sleep correlate with a 31% drop in next-day energy.',
  'Journaling days show 18% higher reported happiness than non-journaling days.',
  'Social connection activities increase happiness by an average of 2.4 points.',
  'Exercise or nature walks reduce stress by 40% for the following 24 hours.',
]

// AI Insights
export const aiInsights: InsightCard[] = [
  {
    id: 'insight-1',
    type: 'pattern',
    title: 'Weekly Stress Cycle Detected',
    description: 'Your stress consistently rises 45% on Wednesdays and Thursdays. Consider scheduling lighter tasks on these days.',
    icon: 'TrendingUp',
    impact: 'high',
    timeframe: 'Recurring pattern',
  },
  {
    id: 'insight-2',
    type: 'warning',
    title: 'Burnout Risk Escalating',
    description: 'Your burnout indicators have increased 23% over the past 2 weeks. Proactive rest is recommended.',
    icon: 'AlertTriangle',
    impact: 'high',
    timeframe: 'Next 7 days',
  },
  {
    id: 'insight-3',
    type: 'recommendation',
    title: 'Sleep Optimization Opportunity',
    description: 'Increasing sleep by 1 hour could improve your mood by 18% and energy by 24% based on your patterns.',
    icon: 'Moon',
    impact: 'medium',
  },
  {
    id: 'insight-4',
    type: 'achievement',
    title: 'Resilience Milestone',
    description: 'Your recovery time from stressful events has improved 35% compared to last month. Well done!',
    icon: 'Award',
    impact: 'medium',
  },
  {
    id: 'insight-5',
    type: 'prediction',
    title: 'Upcoming Stress Window',
    description: 'Model predicts elevated stress next Tuesday-Thursday. Preparing buffers now could reduce peak stress by 40%.',
    icon: 'Calendar',
    impact: 'high',
    timeframe: 'Jun 17-19',
  },
]

export const weeklyReports: WeeklyReport[] = [
  {
    weekStartDate: '2026-06-07',
    weekEndDate: '2026-06-13',
    avgMood: 6.4,
    avgStress: 5.3,
    avgEnergy: 6.1,
    avgSleep: 6.9,
    moodTrend: 8,
    stressTrend: -12,
    energyTrend: 5,
    topTriggers: ['Back-to-back meetings', 'Late-night work', 'Skipped meals'],
    positiveHabits: ['Morning routine', 'Weekend nature walks', 'Journaling'],
    burnoutWarning: false,
    predictionNextWeek: {
      moodPrediction: 6.8,
      burnoutProbability: 35,
      anxietyProbability: 40,
    },
  },
  {
    weekStartDate: '2026-05-31',
    weekEndDate: '2026-06-06',
    avgMood: 5.7,
    avgStress: 6.4,
    avgEnergy: 5.3,
    avgSleep: 6.1,
    moodTrend: -5,
    stressTrend: 15,
    energyTrend: -8,
    topTriggers: ['Sleep deprivation', 'High workload', 'No breaks'],
    positiveHabits: ['One rest day'],
    burnoutWarning: true,
    predictionNextWeek: {
      moodPrediction: 6.2,
      burnoutProbability: 48,
      anxietyProbability: 55,
    },
  },
]

export const actionPlan = {
  wellness: [
    { title: '10-minute morning breathwork', detail: 'Box breathing before your first meeting to lower baseline stress.', tag: 'Calm' },
    { title: 'Protect a real lunch break', detail: 'Block 30 minutes away from screens — your afternoon energy depends on it.', tag: 'Energy' },
    { title: 'Wind-down routine by 10:30pm', detail: 'Target 7+ hours of sleep to break the midweek crash cycle.', tag: 'Sleep' },
  ],
  productivity: [
    { title: 'Batch meetings into two windows', detail: 'Reduce context switching that drove this week\'s burnout signal.', tag: 'Focus' },
    { title: 'Set one daily priority', detail: 'Lower workload perception by committing to a single must-do.', tag: 'Clarity' },
  ],
  recovery: [
    { title: 'Schedule a no-work weekend', detail: 'Your recovery is strongest after 2 consecutive low-workload days.', tag: 'Reset' },
    { title: 'Reconnect socially', detail: 'Your happiest entries involve people — plan one social moment this week.', tag: 'Connection' },
  ],
}

export const weeklySummary =
  'This week started strong but dipped midweek as workload climbed above 8/10 and sleep dropped below 6 hours. Stress and early burnout signals peaked Wednesday through Thursday, then recovered as the weekend approached. Your emotional health score is holding steady at 68, with motivation rebounding by Friday. The main lever for next week is protecting sleep and breaking up meeting-heavy days.'

// AI Journal Analysis Function
export function analyzeJournal(text: string): {
  emotions: EmotionScore[]
  dominant: EmotionScore['emotion']
  stressScore: number
  burnoutRisk: number
  mentalEnergy: number
  sentimentScore: number
  summary: string
} {
  const t = text.toLowerCase()

  // Emotion keyword weights
  const emotionKeywords: Record<EmotionScore['emotion'], { words: string[]; base: number }> = {
    Anxiety: { words: ['worried', 'anxious', 'nervous', 'overthink', 'fear', 'panic', 'dread', 'uncertain', 'scared'], base: 20 },
    Stress: { words: ['stress', 'deadline', 'pressure', 'overwhelmed', 'busy', 'rushed', 'deadline', 'urgent', 'too much'], base: 25 },
    Happiness: { words: ['happy', 'grateful', 'joy', 'relaxed', 'fun', 'great', 'wonderful', 'amazing', 'love', 'smile', 'laugh'], base: 22 },
    Burnout: { words: ['exhausted', 'drained', 'tired', 'burnt', 'nothing left', 'can\'t', 'give up', 'empty', 'collapse'], base: 18 },
    Motivation: { words: ['excited', 'goal', 'focus', 'ready', 'progress', 'motivated', 'energized', 'proud', 'achieve'], base: 28 },
    Calm: { words: ['peaceful', 'calm', 'serene', 'quiet', 'relaxed', 'content', 'mindful', 'breath'], base: 20 },
    Frustration: { words: ['frustrated', 'annoyed', 'irritated', 'angry', 'upset', 'bothered', 'impatient'], base: 20 },
    Hope: { words: ['hope', 'optimistic', 'looking forward', 'future', 'possibility', 'change', 'better'], base: 22 },
  }

  const emotions: EmotionScore[] = Object.entries(emotionKeywords).map(([emotion, config]) => {
    const score = Math.min(95, config.base + config.words.reduce((acc, w) => acc + (t.includes(w) ? 15 + Math.random() * 5 : 0), 0))
    return { emotion: emotion as EmotionScore['emotion'], confidence: Math.round(score) }
  })

  const sorted = [...emotions].sort((a, b) => b.confidence - a.confidence)
  const dominant = sorted[0].emotion

  // Calculate derived scores
  const stressEmotion = emotions.find(e => e.emotion === 'Stress')?.confidence || 0
  const anxietyEmotion = emotions.find(e => e.emotion === 'Anxiety')?.confidence || 0
  const burnoutEmotion = emotions.find(e => e.emotion === 'Burnout')?.confidence || 0
  const happinessEmotion = emotions.find(e => e.emotion === 'Happiness')?.confidence || 0
  const motivationEmotion = emotions.find(e => e.emotion === 'Motivation')?.confidence || 0
  const calmEmotion = emotions.find(e => e.emotion === 'Calm')?.confidence || 0

  const stressScore = Math.round((stressEmotion * 0.5 + anxietyEmotion * 0.3 + burnoutEmotion * 0.2))
  const burnoutRisk = Math.round((burnoutEmotion * 0.5 + stressScore * 0.3 + (100 - (happinessEmotion + calmEmotion) / 2) * 0.2))
  const mentalEnergy = Math.round(happinessEmotion * 0.3 + motivationEmotion * 0.4 + calmEmotion * 0.3)
  const sentimentScore = Math.round(happinessEmotion * 0.4 + motivationEmotion * 0.2 - stressEmotion * 0.2 - burnoutEmotion * 0.1 + anxietyEmotion * -0.1)

  const summary = generateAnalysisSummary(dominant, emotions, stressScore, burnoutRisk, mentalEnergy)

  return { emotions: sorted, dominant, stressScore, burnoutRisk, mentalEnergy, sentimentScore, summary }
}

function generateAnalysisSummary(dominant: EmotionScore['emotion'], emotions: EmotionScore[], stress: number, burnout: number, energy: number): string {
  const topEmotion = emotions[0]
  const secondEmotion = emotions[1]

  const strengths: string[] = []
  const concerns: string[] = []

  emotions.forEach(e => {
    if (e.confidence > 60) {
      if (['Happiness', 'Motivation', 'Calm', 'Hope'].includes(e.emotion)) {
        strengths.push(e.emotion.toLowerCase())
      } else {
        concerns.push(e.emotion.toLowerCase())
      }
    }
  })

  let summary = `Your entry reads as primarily ${dominant.toLowerCase()} `

  if (secondEmotion.confidence > 40) {
    summary += `with undertones of ${secondEmotion.emotion.toLowerCase()}. `
  } else {
    summary += '. '
  }

  if (strengths.length > 0) {
    summary += `Strong indicators of ${strengths.join(' and ')} emerge from your writing. `
  }

  if (concerns.length > 0 && stress > 50) {
    summary += `The model notes elevated ${concerns.slice(0, 2).join(' and ')} signals. `
  }

  if (energy > 70) {
    summary += 'Your mental energy appears robust, suggesting capacity for challenging tasks.'
  } else if (energy < 30) {
    summary += 'Mental energy reserves appear depleted — restorative activities are recommended.'
  } else {
    summary += 'Emotional equilibrium is present with room for targeted improvement.'
  }

  return summary
}

// Future Self Prediction Generator
export function generatePrediction(scenario: FutureScenario, currentData: MoodEntry): PredictionResult {
  const intensityMod = scenario.intensity / 5

  // Base predictions
  let moodChange = 0
  let stressChange = 0
  let energyChange = 0
  let burnoutChange = 0
  let anxietyChange = 0
  let productivityChange = 0

  switch (scenario.type) {
    case 'exam':
      stressChange = 2.5 * intensityMod
      anxietyChange = 3 * intensityMod
      moodChange = -1.5 * intensityMod
      energyChange = -1 * intensityMod
      burnoutChange = 15 * intensityMod
      productivityChange = -0.5 * intensityMod
      break
    case 'deadline':
      stressChange = 3 * intensityMod
      moodChange = -1 * intensityMod
      energyChange = -1.5 * intensityMod
      burnoutChange = 20 * intensityMod
      anxietyChange = 2 * intensityMod
      productivityChange = 0.5 * intensityMod // Short burst
      break
    case 'workload':
      stressChange = 2 * intensityMod
      energyChange = -2 * intensityMod
      burnoutChange = 25 * intensityMod
      moodChange = -1.5 * intensityMod
      productivityChange = -1 * intensityMod
      break
    case 'travel':
      energyChange = -1 * intensityMod
      stressChange = 1 * intensityMod
      moodChange = 0.5 * intensityMod
      burnoutChange = 5 * intensityMod
      break
    case 'social':
      moodChange = 1.5 * intensityMod
      energyChange = 0.5 * intensityMod
      stressChange = -1 * intensityMod
      burnoutChange = -10 * intensityMod
      productivityChange = 0.5 * intensityMod
      break
    default:
      stressChange = 1 * intensityMod
      energyChange = -0.5 * intensityMod
  }

  // Clamp values
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val))

  const currentState = {
    mood: currentData.mood,
    stress: currentData.stress,
    energy: currentData.energy,
    burnoutRisk: emotionalTwinData.burnoutRiskScore,
    anxietyLevel: emotionalTwinData.anxietyScore,
  }

  const predictedState = {
    mood: clamp(currentState.mood + moodChange, 1, 10),
    stress: clamp(currentState.stress + stressChange, 1, 10),
    energy: clamp(currentState.energy + energyChange, 1, 10),
    burnoutRisk: clamp(currentState.burnoutRisk + burnoutChange, 0, 100),
    anxietyLevel: clamp(currentState.anxietyLevel + anxietyChange * 10, 0, 100),
    productivity: clamp(70 + productivityChange * 10, 0, 100),
  }

  const confidence = Math.round(75 + Math.random() * 15)
  const daysUntil = Math.max(1, Math.ceil((new Date(scenario.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
  const timeline = daysUntil === 1 ? 'Tomorrow' : daysUntil < 7 ? `In ${daysUntil} days` : `In ${Math.floor(daysUntil / 7)} weeks`

  const actions = generateRecommendedActions(predictedState, scenario.type)
  const warnings = generateWarnings(predictedState)

  return {
    scenario: scenario.name,
    currentState,
    predictedState: {
      ...predictedState,
      mood: Math.round(predictedState.mood * 10) / 10,
      stress: Math.round(predictedState.stress * 10) / 10,
      energy: Math.round(predictedState.energy * 10) / 10,
    },
    confidence,
    timeline,
    actions,
    warnings,
  }
}

function generateRecommendedActions(predicted: PredictionResult['predictedState'], type: string): string[] {
  const actions: string[] = []

  if (predicted.burnoutRisk > 50) {
    actions.push('Schedule at least one full recovery day before the event')
    actions.push('Reduce meetings and commitments by 30% in the days leading up')
  }

  if (predicted.stress > 7) {
    actions.push('Practice 5-minute morning breathing exercises')
    actions.push('Take micro-breaks every 90 minutes during work')
  }

  if (predicted.energy < 5) {
    actions.push('Prioritize 7.5+ hours of sleep for the next 3 nights')
    actions.push('Avoid caffeine after 2pm to improve sleep quality')
  }

  if (type === 'deadline' || type === 'exam') {
    actions.push('Break the task into smaller milestones to reduce overwhelm')
    actions.push('Schedule a reward or celebration for completion')
  }

  if (actions.length < 3) {
    actions.push('Maintain your current wellness routine')
    actions.push('Check in with yourself daily using the mood tracker')
  }

  return actions.slice(0, 4)
}

function generateWarnings(predicted: PredictionResult['predictedState']): string[] {
  const warnings: string[] = []

  if (predicted.burnoutRisk > 70) {
    warnings.push('High burnout risk detected — consider rescheduling or delegating non-essential tasks')
  }

  if (predicted.stress > 8) {
    warnings.push('Stress levels approaching critical — prioritize stress management techniques')
  }

  if (predicted.mood < 4) {
    warnings.push('Significant mood decline predicted — ensure support system is available')
  }

  if (predicted.energy < 4) {
    warnings.push('Energy depletion likely — reduce commitments and prioritize rest')
  }

  return warnings
}

// Emotion distribution for charts
export function calculateEmotionDistribution(entries: JournalEntry[]): { emotion: string; count: number; percentage: number }[] {
  const emotionCounts: Record<string, number> = {}

  entries.forEach(entry => {
    entry.emotions.forEach(e => {
      if (e.confidence > 50) {
        emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1
      }
    })
  })

  const total = Object.values(emotionCounts).reduce((a, b) => a + b, 0)

  return Object.entries(emotionCounts)
    .map(([emotion, count]) => ({ emotion, count, percentage: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
}

// Weekly heatmap data
export function generateHeatmapData(data: MoodEntry[]): { day: string; hour: string; value: number; mood: number }[] {
  const heatmapData: { day: string; hour: string; value: number; mood: number }[] = []
  const hours = ['6am', '9am', '12pm', '3pm', '6pm', '9pm']

  data.slice(-7).forEach((entry, dayIndex) => {
    hours.forEach((hour, hourIndex) => {
      // Simulate mood variation through day
      const baseMood = entry.mood
      const variation = Math.sin((hourIndex / hours.length) * Math.PI) * 0.5
      const randomNoise = (Math.random() - 0.5) * 0.5
      const mood = Math.max(1, Math.min(10, baseMood + variation + randomNoise))

      heatmapData.push({
        day: entry.label,
        hour,
        value: Math.round(mood * 10),
        mood: Math.round(mood * 10) / 10,
      })
    })
  })

  return heatmapData
}

export function emotionColor(emotion: EmotionScore['emotion']): string {
  switch (emotion) {
    case 'Happiness':
      return 'var(--chart-3)'
    case 'Motivation':
      return 'var(--chart-1)'
    case 'Anxiety':
      return 'var(--chart-4)'
    case 'Stress':
      return '#f59e0b'
    case 'Burnout':
      return 'var(--chart-5)'
    case 'Calm':
      return '#06b6d4'
    case 'Frustration':
      return '#ef4444'
    case 'Hope':
      return '#22c55e'
    default:
      return 'var(--chart-1)'
  }
}

export { dayLabels }
