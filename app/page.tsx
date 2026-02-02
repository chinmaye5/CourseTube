'use client';

import React from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import {
  Play,
  BookOpen,
  TrendingUp,
  Award,
  Zap,
  FileText,
  BarChart3,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import CardSwap, { Card } from '@/components/CardSwap';

export default function Home() {
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
                  href="#features"
                  className="px-8 py-4 bg-surface-theme border border-border-theme text-foreground rounded-xl hover:bg-card-theme hover:border-indigo-500 transition-all font-semibold text-lg flex items-center justify-center"
                >
                  Learn More
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

      {/* Features Grid */}
      <div id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to Learn
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400">
            Powerful features to enhance your learning experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group p-8 bg-surface-theme rounded-2xl border border-border-theme hover:border-indigo-500 transition-all hover:shadow-2xl hover:shadow-indigo-500/20">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Progress Tracking</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Automatically track your learning progress with chapter completion detection and persistent storage across sessions.
            </p>
            <div className="mt-6 flex items-center gap-2 text-indigo-500 dark:text-indigo-400 font-semibold">
              <span>Learn more</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 bg-surface-theme rounded-2xl border border-border-theme hover:border-cyan-500 transition-all hover:shadow-2xl hover:shadow-cyan-500/20">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Chapter Navigation</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Jump between chapters instantly with intelligent timestamp mapping and seamless YouTube integration.
            </p>
            <div className="mt-6 flex items-center gap-2 text-cyan-500 dark:text-cyan-400 font-semibold">
              <span>Learn more</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 bg-surface-theme rounded-2xl border border-border-theme hover:border-emerald-500 transition-all hover:shadow-2xl hover:shadow-emerald-500/20">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Smart Learning</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              AI-powered chapter extraction and personalized learning paths to help you master any subject faster.
            </p>
            <div className="mt-6 flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-semibold">
              <span>Learn more</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group p-8 bg-surface-theme rounded-2xl border border-border-theme hover:border-amber-500 transition-all hover:shadow-2xl hover:shadow-amber-500/20">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Resume Anytime</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Pick up exactly where you left off with automatic progress saving and cross-device synchronization.
            </p>
            <div className="mt-6 flex items-center gap-2 text-amber-500 dark:text-amber-400 font-semibold">
              <span>Learn more</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 5 */}
          <div className="group p-8 bg-surface-theme rounded-2xl border border-border-theme hover:border-indigo-400 transition-all hover:shadow-2xl hover:shadow-indigo-400/20">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Smart Notes</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Capture insights, timestamped notes, and key takeaways while you watch. Your notes automatically sync with video chapters for contextual learning.
            </p>
            <div className="mt-6 flex items-center gap-2 text-indigo-500 dark:text-indigo-400 font-semibold">
              <span>Start noting</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Feature 6 */}
          <div className="group p-8 bg-surface-theme rounded-2xl border border-border-theme hover:border-blue-400 transition-all hover:shadow-2xl hover:shadow-blue-400/20">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Analytics Dashboard</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Visualize your learning journey with comprehensive stats, charts, and insights about your progress.
            </p>
            <div className="mt-6 flex items-center gap-2 text-blue-500 dark:text-blue-400 font-semibold">
              <span>Learn more</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="relative bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl shadow-indigo-500/20">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl mb-8 text-indigo-100 max-w-2xl mx-auto">
              Join thousands of learners who are already using CourseTube to achieve their goals.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-slate-50 transition-all shadow-lg hover:shadow-2xl font-bold text-lg"
            >
              <Play className="w-5 h-5" />
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
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
