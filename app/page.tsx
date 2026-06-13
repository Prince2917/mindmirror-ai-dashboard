'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, HeartPulse, NotebookPen, TrendingUp, Sparkles, ClipboardList, ChartBar as BarChart3, ArrowRight, Shield, Zap, Target, Users, Check, ChevronRight, Play, Star, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Feature Cards
const features = [
  {
    icon: HeartPulse,
    title: 'Daily Mood Check-In',
    desc: 'Log mood, stress, energy, sleep and workload. Your digital twin learns from every entry.',
    color: 'var(--chart-1)',
  },
  {
    icon: NotebookPen,
    title: 'AI Journal Analysis',
    desc: 'Write freely and get instant emotion detection, stress scoring, and personal insights.',
    color: 'var(--chart-3)',
  },
  {
    icon: Brain,
    title: 'Emotional Digital Twin',
    desc: 'A living AI model that understands your patterns and predicts your emotional future.',
    color: 'var(--primary)',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Insights',
    desc: 'Forecast your next 7 days. Catch burnout before it happens. Stay ahead of stress.',
    color: 'var(--chart-5)',
  },
  {
    icon: Sparkles,
    title: 'Future Self Simulator',
    desc: 'Tell us about an upcoming event. We predict how it will affect your emotional state.',
    color: 'var(--chart-2)',
  },
  {
    icon: ClipboardList,
    title: 'Personal Action Plan',
    desc: 'AI-generated wellness, productivity, and recovery recommendations tailored to you.',
    color: 'var(--chart-4)',
  },
]

// How It Works Steps
const steps = [
  { step: '01', title: 'Check In Daily', desc: 'Spend 2 minutes logging your emotional state. Our simple sliders make it effortless.' },
  { step: '02', title: 'Write & Reflect', desc: 'Journal your thoughts. AI analyzes emotions, stress patterns, and mental energy.' },
  { step: '03', title: 'Learn & Predict', desc: 'Your digital twin identifies patterns, forecasts your emotional future, and warns of risks.' },
  { step: '04', title: 'Act & Improve', desc: 'Receive personalized recommendations. Watch your emotional health score improve.' },
]

// Testimonials
const testimonials = [
  {
    quote: "MindMirror predicted my burnout a week before I felt it. I adjusted my schedule and avoided what would have been a rough month.",
    author: 'Sarah Chen',
    role: 'Product Manager at Scale',
    avatar: 'SC',
  },
  {
    quote: "The Future Self Simulator is incredible. I simulated a high-stress deadline and got a concrete plan to handle it. Game changer.",
    author: 'Marcus Johnson',
    role: 'Startup Founder',
    avatar: 'MJ',
  },
  {
    quote: "Finally, an app that understands emotional patterns. The AI insights feel personal and actionable, not generic advice.",
    author: 'Dr. Emily Torres',
    role: 'Clinical Psychologist',
    avatar: 'ET',
  },
]

// Stats
const stats = [
  { value: '68', label: 'Avg Emotional Health Score', icon: Brain },
  { value: '7-day', label: 'Forecast Horizon', icon: TrendingUp },
  { value: '8+', label: 'Emotions Detected', icon: Sparkles },
  { value: '94%', label: 'Prediction Confidence', icon: Target },
]

// FAQ Items
const faqs = [
  { q: 'What is an Emotional Digital Twin?', a: 'A digital twin is an AI model that learns your emotional patterns, correlations between your inputs, and predicts how you will feel. It updates every time you check in or journal.' },
  { q: 'How does the prediction engine work?', a: 'We analyze your historical data to identify patterns: how sleep affects mood, how workload correlates with stress, and dozens of other relationships. The model uses these to forecast your emotional state.' },
  { q: 'Is my data private?', a: 'Absolutely. Your emotional data is encrypted and never shared. We use it only to improve your personal predictions and insights.' },
  { q: 'Do I need OpenAI or an API key?', a: 'No. MindMirror works out of the box with sophisticated pattern analysis built in. No external APIs required.' },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 size-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/2 -left-40 size-[500px] rounded-full bg-chart-3/10 blur-[100px]" />
        <div className="absolute -bottom-40 right-1/3 size-[600px] rounded-full bg-chart-2/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/30">
            <Brain className="size-5 text-primary" />
          </span>
          <span className="text-xl font-semibold tracking-tight">
            MindMirror<span className="text-primary"> AI</span>
          </span>
        </motion.div>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" nativeButton={false} render={<Link href="/login">Sign in</Link>} />
          <Button nativeButton={false} render={<Link href="/signup">Get Started</Link>} />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-10 lg:pt-16">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="mx-auto max-w-5xl text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <Badge variant="outline" className="gap-2 rounded-full px-4 py-1.5 text-xs font-medium glass">
              <Sparkles className="size-3.5 text-primary" />
              The first AI-powered Emotional Digital Twin
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="mt-8 text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            From Reactive Care to{' '}
            <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-3 bg-clip-text text-transparent">
              Predictive Wellbeing
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Meet the world's first Emotional Digital Twin. Track your mood, predict burnout, simulate future scenarios, and receive AI-powered wellness recommendations — all before problems become problems.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              nativeButton={false}
              render={
                <Link href="/signup" className="gap-2">
                  Start Your Journey <ArrowRight className="size-4" />
                </Link>
              }
              className="px-8"
            />
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              render={
                <Link href="/dashboard" className="gap-2">
                  <Play className="size-4" /> View Live Demo
                </Link>
              }
            />
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-chart-3" />
              <span>Private & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-chart-1" />
              <span>No API Keys Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="size-4 text-primary" />
              <span>AI-Powered Predictions</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16"
        >
          <Card className="glass overflow-hidden rounded-3xl">
            <CardContent className="p-4">
              <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-card to-secondary/50 items-center flex justify-center border border-border">
                <div className="text-center space-y-4">
                  <Brain className="size-16 text-primary mx-auto animate-pulse" />
                  <p className="text-lg font-medium">Your Emotional Digital Twin Awaits</p>
                  <Button variant="secondary" nativeButton={false} render={<Link href="/dashboard">Enter Dashboard</Link>} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="flex items-center gap-4 rounded-2xl glass p-6"
            >
              <stat.icon className="size-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Your path to{' '}
              <span className="text-primary">emotional foresight</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Four simple steps to build your Emotional Digital Twin
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="rounded-2xl glass p-6 h-full transition-all hover:scale-[1.02]">
                  <div className="mb-4 text-4xl font-bold text-primary/30">{step.step}</div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 hidden lg:block">
                    <ChevronRight className="size-6 text-muted-foreground/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything you need to{' '}
              <span className="text-primary">understand yourself</span>
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="glass h-full transition-all hover:scale-[1.02] hover:shadow-xl">
                    <CardContent className="p-6">
                      <div
                        className="mb-4 flex size-12 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${f.color}20` }}
                      >
                        <Icon className="size-6" style={{ color: f.color }} />
                      </div>
                      <h3 className="text-lg font-semibold">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Loved by{' '}
              <span className="text-primary">forward-thinkers</span>
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass h-full">
                  <CardContent className="p-6">
                    <div className="mb-4 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="size-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <Quote className="size-8 text-primary/20 mb-2" />
                    <p className="text-sm leading-relaxed">{t.quote}</p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 font-medium text-primary">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{t.author}</div>
                        <div className="text-xs text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Questions?{' '}
              <span className="text-primary">We have answers</span>
            </h2>
          </motion.div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="glass">
                  <CardContent className="p-6">
                    <h3 className="font-semibold">{faq.q}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="glass overflow-hidden rounded-3xl border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-chart-3/10">
              <CardContent className="p-12 text-center">
                <Brain className="size-16 mx-auto mb-6 text-primary" />
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Ready to meet your{' '}
                  <span className="text-primary">Future Self?</span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                  Start building your Emotional Digital Twin today. It only takes 2 minutes to begin.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    nativeButton={false}
                    render={
                      <Link href="/signup" className="gap-2">
                        Get Started Free <ArrowRight className="size-4" />
                      </Link>
                    }
                    className="px-8"
                  />
                  <Button
                    size="lg"
                    variant="outline"
                    nativeButton={false}
                    render={<Link href="/dashboard">View Demo</Link>}
                  />
                </div>
                <p className="mt-6 text-xs text-muted-foreground">
                  No credit card required. Start with simulated demo or real tracking.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/20">
                <Brain className="size-4 text-primary" />
              </span>
              <span className="font-semibold">
                MindMirror<span className="text-primary"> AI</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              A mental wellness companion. Not a substitute for professional care.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
