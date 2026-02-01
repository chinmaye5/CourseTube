'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-lg bg-surface-theme/50 border border-border-theme animate-pulse" />
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 bg-surface-theme/50 border border-border-theme text-foreground hover:bg-surface-theme shadow-lg group"
            aria-label="Toggle theme"
        >
            <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
                <div
                    className={`absolute transition-all duration-500 transform ${theme === 'dark' ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-10 opacity-0 rotate-90'
                        }`}
                >
                    <Moon className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                </div>
                <div
                    className={`absolute transition-all duration-500 transform ${theme === 'dark' ? '-translate-y-10 opacity-0 -rotate-90' : 'translate-y-0 opacity-100 rotate-0'
                        }`}
                >
                    <Sun className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                </div>
            </div>

            {/* Subtle Glow Effect */}
            <div className={`absolute inset-0 rounded-lg blur-md transition-opacity duration-300 pointer-events-none ${theme === 'dark' ? 'bg-indigo-500/20 opacity-0 group-hover:opacity-100' : 'bg-amber-500/20 opacity-0 group-hover:opacity-100'
                }`} />
        </button>
    );
}
