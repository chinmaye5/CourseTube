import React from 'react';
import Link from 'next/link';
import { Twitter, Github, MessageSquare, Youtube, Heart, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-theme border-t border-border-theme pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center space-x-2 mb-6 inline-flex">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20">
                <img
                  src="/logo.png"
                  alt="CourseTube Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                CourseTube
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-sm">
              Transform YouTube videos into structured learning courses with progress tracking, smart notes, and an immersive focus mode.
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-500 hover:bg-indigo-500 hover:text-white transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all duration-300">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-500 hover:bg-[#5865F2] hover:text-white transition-all duration-300">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-foreground font-bold mb-6">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/explore" className="text-slate-500 hover:text-indigo-500 transition-colors">
                  Explore Library
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-slate-500 hover:text-indigo-500 transition-colors">
                  Course Player
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-slate-500 hover:text-indigo-500 transition-colors">
                  Features
                </Link>
              </li>

            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="lg:col-span-2">
            <h3 className="text-foreground font-bold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-slate-500 hover:text-indigo-500 transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-indigo-500 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-500 hover:text-indigo-500 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-slate-500 hover:text-indigo-500 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div className="lg:col-span-3">
            <h3 className="text-foreground font-bold mb-6">Get in Touch</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3 text-slate-500">
                <Mail className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span>chinmaye115@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-slate-500">
                <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span>karnataka<br />india</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-theme flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} CourseTube. All rights reserved.
          </div>

          <div className="flex items-center space-x-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-indigo-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-indigo-500 transition-colors">
              Terms of Service
            </Link>
          </div>


        </div>
      </div>
    </footer>
  );
}
