import React from 'react';
import Link from 'next/link';
import { Twitter, Github, MessageSquare, Youtube } from 'lucide-react';

const productLinks = [
  { label: 'Explore library', href: '/explore' },
  { label: 'Course player', href: '/courses' },
  { label: 'Features', href: '/#features' },
];

const resourceLinks = [
  { label: 'Community', href: '#' },
  { label: 'Help center', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Contact us', href: '/contact' },
];

const socials = [
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { label: 'GitHub', href: 'https://github.com', icon: Github },
  { label: 'Discord', href: 'https://discord.com', icon: MessageSquare },
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-muted-theme">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background">
                <img src="/newlogo.png" alt="" className="h-5 w-5 object-contain" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-foreground">CourseTube</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Turn any YouTube video or playlist into a structured course with chapter navigation,
              progress tracking, and timestamped notes.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="md:col-span-3 md:col-start-7">
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CourseTube. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
