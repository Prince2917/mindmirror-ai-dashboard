'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { generateDemoData, type MoodEntry, type JournalEntry, analyzeJournal } from '@/lib/data'

type DemoModeContextType = {
  isEnabled: boolean
  toggle: () => void
  demoData: MoodEntry[] | null
  demoJournals: JournalEntry[] | null
}

const DemoModeContext = createContext<DemoModeContextType | null>(null)

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [demoData, setDemoData] = useState<MoodEntry[] | null>(null)
  const [demoJournals, setDemoJournals] = useState<JournalEntry[] | null>(null)

  useEffect(() => {
    if (isEnabled && !demoData) {
      // Generate comprehensive demo data
      const data = generateDemoData(90)
      setDemoData(data)

      // Generate demo journal entries
      const journalTexts = [
        'Wrapped up the quarterly review today. Felt a wave of relief but I am already thinking about next week\'s deadlines. The presentation went well, got positive feedback from leadership. Trying to stay focused.',
        'Had a difficult conversation with my manager about workload. I feel heard but also anxious about the upcoming changes. Need to trust the process.',
        'Three back-to-back meetings drained me completely. I skipped lunch again and my focus collapsed by afternoon. This pattern needs to change.',
        'Slept in, went for a long walk by the river, and finally called my sister. A genuinely restorative Sunday. We talked for hours about everything.',
        'The project deadline is looming and I can feel the stress building. But I\'m also excited about what we\'re building. Mixed emotions today.',
        'Exhausted. Nothing left to give. Need a real break soon or I\'m going to crash.',
        'Great progress on my goals today. The morning breathwork really helped - felt calm and focused all day.',
        'Anxious about the presentation tomorrow. Running through scenarios in my head. Hard to sleep.',
      ]
      const journals = journalTexts.map((text, i) => {
        const analysis = analyzeJournal(text)
        return {
          id: `demo-journal-${i}`,
          date: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          preview: text.slice(0, 120) + (text.length > 120 ? '...' : ''),
          content: text,
          emotions: analysis.emotions,
          dominant: analysis.dominant,
          stressScore: analysis.stressScore,
          burnoutRisk: analysis.burnoutRisk,
          mentalEnergy: analysis.mentalEnergy,
          sentimentScore: analysis.sentimentScore,
          analysis: analysis.summary,
        }
      })
      setDemoJournals(journals)
    }
  }, [isEnabled, demoData])

  const toggle = () => setIsEnabled((prev) => !prev)

  return (
    <DemoModeContext.Provider value={{ isEnabled, toggle, demoData, demoJournals }}>
      {children}
    </DemoModeContext.Provider>
  )
}

export function useDemoMode() {
  const context = useContext(DemoModeContext)
  if (!context) {
    return { isEnabled: false, toggle: () => {}, demoData: null, demoJournals: null }
  }
  return context
}
