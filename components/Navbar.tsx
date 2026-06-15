'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { BarChart3, Compass } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ADMIN_EMAIL } from '@/lib/constants';

const linkClass =
  'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground';

export function Navbar() {
  const { user } = useUser();
  const isAdmin = user?.emailAddresses.some((e) => e.emailAddress === ADMIN_EMAIL);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background">
            <img src="/newlogo.png" alt="" className="h-5 w-5 object-contain" />
          </span>
          <span className="text-base font-semibold tracking-tight text-foreground">CourseTube</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/explore" className={linkClass}>
            Explore
          </Link>
          <SignedIn>
            <Link href="/profile" className={linkClass}>
              My courses
            </Link>
          </SignedIn>
          <Link href="/contact" className={linkClass}>
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <SignedOut>
            <Link href="/sign-in" className={`${linkClass} hidden sm:inline-flex`}>
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary-hover"
            >
              Get started
            </Link>
          </SignedOut>
          <SignedIn>
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover sm:inline-flex"
              >
                <BarChart3 className="h-4 w-4" />
                Admin
              </Link>
            )}
            <Link
              href="/courses"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary-hover"
            >
              <Compass className="h-4 w-4" />
              Course player
            </Link>
            <UserButton
              appearance={{
                elements: { userButtonAvatarBox: 'w-8 h-8' },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
