'use client';

import React from 'react';
import Link from 'next/link';
import {
  Play,
  ListChecks,
  BarChart3,
  FileText,
  Clock,
  Layers,
  ArrowRight,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';

const features = [
  {
    icon: BarChart3,
    title: 'Precise progress tracking',
    desc: 'Every second is saved across devices. Pick up exactly where you left off, down to the chapter.',
  },
  {
    icon: ListChecks,
    title: 'Automatic chapter navigation',
    desc: 'Long videos and playlists are mapped into a clean, clickable curriculum — no more scrubbing.',
  },
  {
    icon: FileText,
    title: 'Timestamped notes',
    desc: 'Write notes tied to the exact moment in the video. Click any note to jump straight back.',
  },
  {
    icon: Layers,
    title: 'Playlists as courses',
    desc: 'Drop in any playlist and study it as a structured, sequential course with auto-advance.',
  },
  {
    icon: Clock,
    title: 'Resume anywhere',
    desc: 'Your library syncs in the background so your learning follows you across every device.',
  },
  {
    icon: Star,
    title: 'A curated library',
    desc: 'Browse community-trending courses and hand-picked learning paths across dozens of topics.',
  },
];

const steps = [
  { n: '01', title: 'Paste a link', desc: 'Add any YouTube video or playlist URL.' },
  { n: '02', title: 'Get a curriculum', desc: 'We structure it into clean, navigable chapters.' },
  { n: '03', title: 'Learn focused', desc: 'Track progress and take timestamped notes.' },
  { n: '04', title: 'Finish strong', desc: 'Complete courses and build a real library.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Structured learning, built on YouTube
              </div>

              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
                Turn YouTube into a focused learning experience
              </h1>

              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                CourseTube transforms any video or playlist into a structured course — with chapter
                navigation, progress tracking, and notes tied to the exact moment they matter.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/courses"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
                >
                  <Play className="h-4 w-4" />
                  Start learning free
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Explore library
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Free forever
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  No credit card
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Unlimited courses
                </span>
              </div>
            </div>

            {/* Product preview */}
            <div className="relative">
              <ProductPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-surface-muted-theme">
        <div className="container mx-auto grid grid-cols-2 gap-px overflow-hidden px-6 md:grid-cols-4">
          {[
            { value: '50K+', label: 'Hours organized' },
            { value: '12K+', label: 'Courses created' },
            { value: '40+', label: 'Topics covered' },
            { value: '100%', label: 'Free to use' },
          ].map((s) => (
            <div key={s.label} className="py-10 text-center">
              <div className="text-3xl font-semibold tracking-tight md:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-border">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="text-sm font-medium text-primary">Features</span>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Everything you need to learn deliberately
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              A focused toolset that turns passive watching into active, structured progress.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="bg-card p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border bg-surface-muted-theme">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="text-sm font-medium text-primary">How it works</span>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              From a raw link to a real course in seconds
            </h2>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                <div className="font-mono text-sm font-medium text-primary">{s.n}</div>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="rounded-2xl border border-border bg-foreground px-8 py-16 text-center md:px-16">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-background md:text-4xl">
              Start building your learning library today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-background/70">
              Join learners who turned YouTube into a structured, distraction-free classroom.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/explore"
                className="inline-flex h-11 items-center justify-center rounded-md border border-background/20 bg-transparent px-6 text-sm font-medium text-background transition-colors hover:bg-background/10"
              >
                Browse courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ProductPreview() {
  const chapters = [
    { title: 'Introduction & setup', time: '0:00', done: true },
    { title: 'Core concepts', time: '8:24', done: true },
    { title: 'Building the app', time: '21:10', active: true },
    { title: 'Data fetching', time: '46:32', done: false },
    { title: 'Deployment', time: '1:02:15', done: false },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      {/* window bar */}
      <div className="flex items-center gap-2 border-b border-border bg-surface-muted-theme px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
        <div className="mx-auto flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
          coursetube.app/courses
        </div>
      </div>

      <div className="grid grid-cols-5">
        {/* player */}
        <div className="col-span-3 p-4">
          <div className="flex aspect-video items-center justify-center rounded-lg border border-border bg-foreground/[0.04]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Play className="h-5 w-5 translate-x-0.5" />
            </span>
          </div>
          <div className="mt-4">
            <div className="h-2 w-3/4 rounded-full bg-muted" />
            <div className="mt-2 h-2 w-1/2 rounded-full bg-muted" />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[62%] rounded-full bg-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">62%</span>
          </div>
        </div>

        {/* chapter list */}
        <div className="col-span-2 border-l border-border p-3">
          <div className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Chapters
          </div>
          <div className="space-y-1">
            {chapters.map((c) => (
              <div
                key={c.title}
                className={`flex items-center gap-2 rounded-md px-2 py-2 text-xs ${
                  c.active ? 'bg-primary/10 text-foreground' : 'text-muted-foreground'
                }`}
              >
                {c.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                ) : (
                  <span
                    className={`h-3.5 w-3.5 shrink-0 rounded-full border ${
                      c.active ? 'border-primary' : 'border-border'
                    }`}
                  />
                )}
                <span className="truncate">{c.title}</span>
                <span className="ml-auto shrink-0 font-mono text-[10px] opacity-70">{c.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
