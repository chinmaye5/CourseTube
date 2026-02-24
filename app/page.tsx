'use client';

import React from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import {
  Play,
  BookOpen,
  TrendingUp,
  Award,
  Zap,
  FileText,
  BarChart3,
  Sparkles,
  ArrowRight,
  MousePointer2,
  Layout,
  MessageSquare,
  Rocket,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import CardSwap, { Card } from '@/components/CardSwap';
import { motion } from 'framer-motion';
import { ADMIN_EMAIL } from '@/lib/constants';

export default function Home() {
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <header className="bg-surface-theme/80 backdrop-blur-md border-b border-border-theme sticky top-0 z-50 shadow-xl transition-colors duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20">
                <img
                  src="/logo.png"
                  alt="CourseTube Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">CourseTube</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/explore"
                className="px-4 py-2 text-slate-500 hover:text-foreground transition-colors font-medium flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Explore</span>
              </Link>
              <ThemeToggle />
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-slate-500 hover:text-foreground transition-colors font-medium"
                >
                  Log in
                </Link>
                <Link
                  href="/sign-up"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition-all shadow-lg shadow-indigo-500/20 font-semibold"
                >
                  Sign up
                </Link>
              </SignedOut>
              <SignedIn>
                {user?.emailAddresses.some(e => e.emailAddress === ADMIN_EMAIL) && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 text-indigo-500 hover:text-indigo-400 transition-colors font-bold flex items-center gap-1"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="px-4 py-2 text-slate-500 hover:text-foreground transition-colors font-medium"
                >
                  My Courses
                </Link>
                <Link
                  href="/courses"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition-all shadow-lg shadow-indigo-500/20 font-semibold"
                >
                  Course Player
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-9 h-9 border-2 border-indigo-500"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 dark:from-indigo-900/20 dark:to-cyan-900/20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[120px] rounded-full"></div>

        <div className="container mx-auto px-6 py-24 md:py-32 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="text-left max-w-2xl lg:w-1/2">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full mb-8 font-medium text-sm backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                Transform YouTube into Your Classroom
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground leading-tight">
                Learn Smarter with
                <span className="block bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mt-2">
                  YouTube Courses
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl leading-relaxed">
                Track your progress, navigate chapters effortlessly, and turn any YouTube video into a structured learning experience.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/courses"
                  className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-2xl hover:shadow-indigo-500/40 font-semibold text-lg flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start Learning
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/explore"
                  className="px-8 py-4 bg-surface-theme border border-primary-theme text-foreground rounded-xl hover:bg-card-theme hover:border-indigo-500 transition-all font-semibold text-lg flex items-center justify-center gap-2 group"
                >
                  <TrendingUp className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                  Explore Library
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl border-t border-border-theme/50 pt-12">
                <div className="text-left">
                  <div className="text-3xl font-bold text-foreground mb-2">100%</div>
                  <div className="text-sm text-slate-500 font-medium">Free Forever</div>
                </div>
                <div className="text-left border-x border-border-theme px-8">
                  <div className="text-3xl font-bold text-foreground mb-2">∞</div>
                  <div className="text-sm text-slate-500 font-medium">Unlimited Courses</div>
                </div>
                <div className="text-left pl-8">
                  <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
                  <div className="text-sm text-slate-500 font-medium">Access Anytime</div>
                </div>
              </div>
            </div>

            {/* CardSwap Section */}
            <div className="lg:w-1/2 relative h-[500px] w-full hidden lg:block">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-[600px]">
                <CardSwap
                  cardDistance={40}
                  verticalDistance={40}
                  delay={4000}
                  pauseOnHover={true}
                >
                  <Card className="p-6 bg-slate-900 border-indigo-500/30 overflow-hidden shadow-2xl">
                    <div className="h-full flex flex-col">
                      <div className="h-40 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Play className="w-16 h-16 text-white/50" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Mastering Next.js 15</h3>
                      <p className="text-indigo-100/70 text-sm">Level up your full-stack skills with the latest App Router and Server Actions.</p>
                      <div className="mt-auto flex items-center gap-2">
                        <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 w-[65%]" />
                        </div>
                        <span className="text-xs text-indigo-300">65% Done</span>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-slate-900 border-cyan-500/30 overflow-hidden shadow-2xl">
                    <div className="h-full flex flex-col">
                      <div className="h-40 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-lg mb-4 flex items-center justify-center">
                        <TrendingUp className="w-16 h-16 text-white/50" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">AI Engineering 101</h3>
                      <p className="text-cyan-100/70 text-sm">Build intelligent apps using LLMs, Vector Databases, and LangChain.</p>
                      <div className="mt-auto flex items-center gap-2">
                        <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 w-[42%]" />
                        </div>
                        <span className="text-xs text-cyan-300">42% Done</span>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-slate-900 border-emerald-500/30 overflow-hidden shadow-2xl">
                    <div className="h-full flex flex-col">
                      <div className="h-40 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg mb-4 flex items-center justify-center">
                        <Award className="w-16 h-16 text-white/50" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">System Design Masterclass</h3>
                      <p className="text-emerald-100/70 text-sm">Learn to architect scalable systems for millions of users.</p>
                      <div className="mt-auto flex items-center gap-2">
                        <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[88%]" />
                        </div>
                        <span className="text-xs text-emerald-300">88% Done</span>
                      </div>
                    </div>
                  </Card>
                </CardSwap>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Preview Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-surface-theme/50 backdrop-blur-xl border border-border-theme rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full -ml-20 -mb-20"></div>

          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-wider mb-6">
                🔥 Hot & Trending
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
                Courses <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Loved by the Community</span>
              </h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Don't know where to start? Browse our community-curated library of the best YouTube courses, from Web Development to AI Research.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20 group"
              >
                Visit the Global Library
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-background border border-border-theme p-5 rounded-[2rem] shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="w-full aspect-video bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl mb-4 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white/40" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground mb-1">React Advanced Patterns</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[75%]" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">75%</span>
                  </div>
                </div>
                <div className="bg-background border border-border-theme p-5 rounded-[2rem] shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="w-full aspect-video bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white/40" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground mb-1">Next.js 15 for Pros</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 w-[40%]" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">40%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-background border border-border-theme p-5 rounded-[2rem] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="w-full aspect-video bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 flex items-center justify-center">
                    <Layout className="w-8 h-8 text-white/40" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground mb-1">Modern UI Design</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[90%]" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">90%</span>
                  </div>
                </div>
                <div className="bg-background border border-border-theme p-5 rounded-[2rem] shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="w-full aspect-video bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-white/40" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground mb-1">Data Science with Python</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[25%]" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card-theme/30 py-32 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border-theme to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border-theme to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
              The Journey to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">Mastery</span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Transform any YouTube video into a professional learning environment in four seamless steps.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-500/20 via-cyan-500 to-emerald-500/20" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-3xl bg-surface-theme border border-border-theme flex items-center justify-center mb-8 relative z-10 group-hover:border-indigo-500 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all duration-500 rotate-3 group-hover:rotate-0">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center border-4 border-background shadow-lg">
                    01
                  </div>
                  <MousePointer2 className="w-10 h-10 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Copy URL</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-4">
                  Grab any YouTube link—whether it's a single deep-dive or a massive 100-video playlist.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-3xl bg-surface-theme border border-border-theme flex items-center justify-center mb-8 relative z-10 group-hover:border-cyan-500 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-500 -rotate-3 group-hover:rotate-0">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-cyan-500 text-white text-xs font-bold flex items-center justify-center border-4 border-background shadow-lg">
                    02
                  </div>
                  <Layout className="w-10 h-10 text-cyan-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Instant Mapping</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-4">
                  Our system scans the content and instantly structures it into a logical, easy-to-follow curriculum.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-3xl bg-surface-theme border border-border-theme flex items-center justify-center mb-8 relative z-10 group-hover:border-emerald-500 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-500 rotate-6 group-hover:rotate-0">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center border-4 border-background shadow-lg">
                    03
                  </div>
                  <MessageSquare className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Focus Mode</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-4">
                  Learn without distractions. Take notes, track progress, and resume from your exact timestamp.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-3xl bg-surface-theme border border-border-theme flex items-center justify-center mb-8 relative z-10 group-hover:border-amber-500 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-500 -rotate-6 group-hover:rotate-0">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center border-4 border-background shadow-lg">
                    04
                  </div>
                  <Rocket className="w-10 h-10 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Mastery Unlocked</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed px-4">
                  Transform passive content into structured knowledge you can deploy in the real world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid - Bento Design */}
      <div id="features" className="relative py-32 overflow-hidden bg-background">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
                Everything You Need to <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Master Anything</span>
              </h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                We've built a powerful suite of tools designed to turn passive watching into active, structured learning.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 h-auto">
            {/* Feature 1: Progress Tracking (Large) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-4 group relative overflow-hidden bg-surface-theme/40 backdrop-blur-xl border border-border-theme/50 rounded-[2.5rem] p-8 md:p-10 hover:border-indigo-500/50 transition-all duration-500 shadow-2xl hover:shadow-indigo-500/10"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div className="hidden sm:flex flex-col gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 bg-background/50 backdrop-blur-md px-4 py-2 rounded-xl border border-border-theme/30 whitespace-nowrap">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-medium text-slate-400">Chapter {i} Completed</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">Precision Progress Tracking</h3>
                  <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                    Never lose your place again. Our intelligent system tracks your journey across thousands of videos, saving every second of your progress.
                  </p>
                </div>
                <div className="mt-12 flex items-center gap-4">
                  <div className="flex-1 h-3 bg-slate-200/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '75%' }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                    />
                  </div>
                  <span className="text-sm font-bold text-indigo-500">75% Mastered</span>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Analytics (Medium) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2 group relative overflow-hidden bg-surface-theme/40 backdrop-blur-xl border border-border-theme/50 rounded-[2.5rem] p-8 hover:border-cyan-500/50 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/10"
            >
              <div className="flex flex-col h-full">
                <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 mb-6 group-hover:rotate-12 transition-transform duration-500">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Insightful Analytics</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                  Visualize your learning habits with beautiful, detailed charts and heatmaps.
                </p>
                <div className="mt-auto grid grid-cols-2 gap-4">
                  <div className="bg-background/40 p-4 rounded-2xl border border-border-theme/30">
                    <div className="text-2xl font-bold text-cyan-400">42h</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Watch Time</div>
                  </div>
                  <div className="bg-background/40 p-4 rounded-2xl border border-border-theme/30">
                    <div className="text-2xl font-bold text-indigo-400">12</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Courses</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Chapter Navigation (Medium) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-2 group relative overflow-hidden bg-surface-theme/40 backdrop-blur-xl border border-border-theme/50 rounded-[2.5rem] p-8 hover:border-emerald-500/50 transition-all duration-500 shadow-2xl hover:shadow-emerald-500/10"
            >
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Chapter Navigation</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Instantly jump to any topic with integrated chapter navigation. No more scrubbing.
              </p>
              <div className="mt-8 space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-background/20 opacity-40">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <div className="h-1.5 w-full bg-slate-700 rounded-full" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Feature 4: Smart Learning (Medium) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:col-span-2 group relative overflow-hidden bg-surface-theme/40 backdrop-blur-xl border border-border-theme/50 rounded-[2.5rem] p-8 hover:border-amber-500/50 transition-all duration-500 shadow-2xl hover:shadow-amber-500/10"
            >
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Smart Curriculum</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                We organize related videos into structured courses, creating a clear path to mastery.
              </p>
              <div className="mt-8 flex justify-center">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-amber-500" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 5: Resume Anytime (Medium) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="md:col-span-2 group relative overflow-hidden bg-surface-theme/40 backdrop-blur-xl border border-border-theme/50 rounded-[2.5rem] p-8 hover:border-indigo-400/50 transition-all duration-500 shadow-2xl hover:shadow-indigo-400/10"
            >
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Resume Anywhere</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Sync your learning journey across all devices. Pick up exactly where you left off.
              </p>
              <div className="mt-8 bg-background/40 p-4 rounded-2xl border border-border-theme/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-indigo-500" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">Next.js 15...</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-500">RESUME</span>
              </div>
            </motion.div>

            {/* Feature 6: Smart Notes (Full Width / Wide) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="md:col-span-6 group relative overflow-hidden bg-surface-theme/40 backdrop-blur-xl border border-border-theme/50 rounded-[3rem] p-10 hover:border-violet-500/50 transition-all duration-500 shadow-2xl hover:shadow-violet-500/10"
            >
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                  <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-500 mb-8 group-hover:scale-110 transition-transform duration-500">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">Context-Aware Notes</h3>
                  <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                    Take beautiful, markdown-supported notes that are automatically timestamped to the video. When you review your notes, clicking one takes you back to that exact moment.
                  </p>
                  <div className="mt-10 flex flex-wrap gap-4">
                    <div className="px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-violet-500/20 cursor-pointer flex items-center gap-2 group/btn">
                      Start Taking Notes
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 w-full max-w-md">
                  <div className="bg-background/60 backdrop-blur-md rounded-3xl p-6 border border-border-theme/50 shadow-2xl relative">
                    <div className="flex items-center gap-2 mb-4 border-b border-border-theme/50 pb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <div className="ml-2 text-xs font-bold text-slate-500 tracking-widest uppercase">My Insights.md</div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="text-[10px] font-bold text-violet-500 mt-1">12:45</span>
                        <div className="h-2 w-3/4 bg-slate-300 dark:bg-slate-700 rounded-full" />
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-[10px] font-bold text-violet-500 mt-1">15:20</span>
                        <div className="space-y-2 w-full">
                          <div className="h-2 w-full bg-slate-400 dark:bg-slate-600 rounded-full" />
                          <div className="h-2 w-1/2 bg-slate-400 dark:bg-slate-600 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-24 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-600 rounded-[3rem] p-12 md:p-20 text-center overflow-hidden shadow-[0_20px_50px_rgba(99,102,241,0.3)]"
        >
          {/* Animated Background Blobs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-6xl font-black mb-8 text-white leading-tight">
                Ready to Rewrite Your <span className="text-cyan-200">Learning Story?</span>
              </h2>
              <p className="text-xl md:text-2xl mb-12 text-indigo-100/90 leading-relaxed font-medium">
                Join a community of elite learners who turned YouTube into their private academy. Start for free today.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link
                href="/sign-up"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-2xl hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl font-bold text-xl hover:-translate-y-1"
              >
                <Rocket className="w-6 h-6" />
                Get Started Free
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-indigo-500/20 border border-white/30 text-white rounded-2xl hover:bg-indigo-500/30 transition-all font-bold text-xl backdrop-blur-sm hover:-translate-y-1"
              >
                Browse Library
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12 text-indigo-200/60 text-sm font-semibold tracking-widest uppercase"
            >
              No credit card required • Unlimited access • 100% Free
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border-theme bg-surface-theme py-12 transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20">
                <img
                  src="/logo.png"
                  alt="CourseTube Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-xl font-bold text-foreground">CourseTube</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-500 dark:text-slate-400 mb-2">© 2025 CourseTube. All rights reserved.</p>
              <p className="text-sm text-slate-500">Chinmaye HG</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
