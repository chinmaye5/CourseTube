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

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground bg-mesh selection:bg-primary/30">
      {/* Navigation */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center glow-primary group-hover:scale-110 transition-transform">
                <img
                  src="/logo.png"
                  alt="CourseTube Logo"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">CourseTube</span>
            </div>
            <div className="flex items-center space-x-6">
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/sign-up"
                  className="px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 font-semibold text-sm"
                >
                  Get Started
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Learning
                </Link>
                <Link
                  href="/courses"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 font-semibold text-sm"
                >
                  Course Player
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-9 h-9 border-2 border-primary/50 hover:border-primary transition-colors"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-pill text-primary rounded-full mb-10 font-medium text-sm animate-fade-in">
              <Sparkles className="w-4 h-4 fill-primary/20" />
              <span>Transform YouTube into Your Classroom</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight leading-[1.1]">
              Learn <span className="text-primary">Smarter</span> with
              <span className="block bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent pb-2">
                YouTube Courses
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Track progress, navigate chapters effortlessly, and turn any YouTube video into a structured, professional learning experience.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                href="/courses"
                className="group px-8 py-4 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/40 font-bold text-lg flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Learning Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 bg-secondary/50 border border-border text-foreground rounded-2xl hover:bg-secondary transition-all font-bold text-lg backdrop-blur-sm"
              >
                Explore Features
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-12 mt-24 max-w-3xl mx-auto border-t border-border/50 pt-12">
              <div className="text-center">
                <div className="text-4xl font-black text-foreground mb-1">100%</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Free Forever</div>
              </div>
              <div className="text-center border-x border-border/50">
                <div className="text-4xl font-black text-foreground mb-1">∞</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Unlimited Content</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-foreground mb-1">24/7</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Always Syncing</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-6 py-32 relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Master Any <span className="text-accent">Subject</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for a premium learning experience, built for the modern student.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUp,
              title: "Progress Tracking",
              desc: "Automatically track your learning progress with chapter completion detection.",
              color: "text-primary",
              bg: "bg-primary/10",
              border: "hover:border-primary/50"
            },
            {
              icon: BookOpen,
              title: "Chapter Navigation",
              desc: "Jump between chapters instantly with intelligent timestamp mapping.",
              color: "text-blue-400",
              bg: "bg-blue-400/10",
              border: "hover:border-blue-400/50"
            },
            {
              icon: Award,
              title: "Smart Learning",
              desc: "AI-powered chapter extraction and personalized paths to help you master topics.",
              color: "text-accent",
              bg: "bg-accent/10",
              border: "hover:border-accent/50"
            },
            {
              icon: Zap,
              title: "Resume Anytime",
              desc: "Pick up exactly where you left off with automatic cross-device synchronization.",
              color: "text-amber-400",
              bg: "bg-amber-400/10",
              border: "hover:border-amber-400/50"
            },
            {
              icon: FileText,
              title: "Contextual Notes",
              desc: "Capture timestamped notes that sync perfectly with video chapters.",
              color: "text-pink-400",
              bg: "bg-pink-400/10",
              border: "hover:border-pink-400/50"
            },
            {
              icon: BarChart3,
              title: "Deep Analytics",
              desc: "Visualize your journey with detailed stats and personal learning insights.",
              color: "text-indigo-400",
              bg: "bg-indigo-400/10",
              border: "hover:border-indigo-400/50"
            }
          ].map((f, i) => (
            <div key={i} className={`group p-8 bg-card/40 backdrop-blur-sm rounded-3xl border border-border/50 ${f.border} transition-all hover:-translate-y-2 duration-300 shadow-xl hover:shadow-2xl`}>
              <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-32">
        <div className="relative bg-card border border-border/50 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden shadow-2xl">
          {/* Decorative gradients */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-[100px]"></div>

          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              Start Your <span className="text-primary">Journey</span>
            </h2>
            <p className="text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
              Join the future of education. Free, powerful, and built on the world's largest knowledge library.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-3 px-10 py-5 bg-foreground text-background rounded-2xl hover:scale-105 transition-all shadow-2xl font-black text-xl"
            >
              Get Started for Free
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="CourseTube Logo"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter">CourseTube</span>
            </div>

            <div className="flex gap-8 text-sm font-medium text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
              <a href="#" className="hover:text-primary transition-colors">Discord</a>
            </div>

            <div className="text-center md:text-right">
              <p className="text-muted-foreground font-medium">© 2025 CourseTube all rights reserved Chinmaye</p>
            </div>
          </div>
        </div>
      </footer>
    </div>

  )
}