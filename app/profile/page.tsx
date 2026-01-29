'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';
import {
    Play,
    Clock,
    CheckCircle2,
    TrendingUp,
    BookOpen,
    Home,
    Award,
    Target,
    Zap,
    BarChart3
} from 'lucide-react';

interface Course {
    videoId: string;
    url: string;
    title: string;
    chapters: any[];
    lastAccessed: string;
    progress: {
        completedChapters: number[];
        lastWatchedChapter: number;
        progressPercentage: number;
        totalWatchTime: number;
        timestamp: number;
    };
}

export default function Profile() {
    const { user } = useUser();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            loadCourses();
        }
    }, [user]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/user-courses');

            if (!response.ok) {
                throw new Error('Failed to load courses');
            }

            const data = await response.json();
            setCourses(data.courses || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const formatWatchTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const completedCourses = courses.filter(c => c.progress.progressPercentage === 100).length;
    const inProgressCourses = courses.filter(c => c.progress.progressPercentage > 0 && c.progress.progressPercentage < 100).length;
    const totalWatchTime = courses.reduce((acc, c) => acc + (c.progress.totalWatchTime || 0), 0);

    return (
        <div className="min-h-screen bg-background text-foreground bg-mesh selection:bg-primary/30 font-sans">
            {/* Top Navigation Bar */}
            <nav className="glass sticky top-0 z-50 border-b border-border/50">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <Link href="/" className="flex items-center space-x-3 group transition-transform hover:scale-105">
                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
                                    <img
                                        src="/logo.png"
                                        alt="CourseTube Logo"
                                        className="w-5 h-5 object-contain"
                                    />
                                </div>
                                <span className="font-bold tracking-tight">Home</span>
                            </Link>
                            <Link href="/courses" className="flex items-center space-x-3 group transition-transform hover:scale-105">
                                <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center">
                                    <Play className="w-4 h-4 text-primary" />
                                </div>
                                <span className="font-bold tracking-tight">Course Player</span>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "w-9 h-9 border-2 border-primary/50 hover:border-primary transition-colors"
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-16">
                {/* User Header */}
                <div className="mb-20">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-16">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary via-purple-500 to-accent flex items-center justify-center text-white text-5xl font-black shadow-2xl glow-primary rotate-3 hover:rotate-0 transition-transform duration-500">
                            {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0] || 'U'}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight leading-tight">
                                {user?.firstName ? (
                                    <>Welcome back, <span className="text-primary">{user.firstName}</span>!</>
                                ) : (
                                    <>My <span className="text-primary">Learning</span> Dashboard</>
                                )}
                            </h1>
                            <p className="text-xl text-muted-foreground font-medium max-w-2xl">Continue your journey of mastery and track your professional growth through CourseTube.</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Courses", value: courses.length, icon: BookOpen, color: "text-primary", bg: "bg-primary/10", progress: 100 },
                            { label: "Mastered", value: completedCourses, icon: CheckCircle2, color: "text-accent", bg: "bg-accent/10", progress: courses.length > 0 ? (completedCourses / courses.length) * 100 : 0 },
                            { label: "Evolving", value: inProgressCourses, icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-400/10", progress: courses.length > 0 ? (inProgressCourses / courses.length) * 100 : 0 },
                            { label: "Watch Time", value: formatWatchTime(totalWatchTime), icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", progress: 100 }
                        ].map((stat, i) => (
                            <div key={i} className="glass rounded-[2rem] p-8 border-border/50 hover:-translate-y-2 transition-all duration-300 shadow-xl group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <stat.icon className={`w-7 h-7 ${stat.color}`} />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-black tracking-tighter">{stat.value}</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</div>
                                    </div>
                                </div>
                                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${stat.progress === 100 ? 'bg-primary' : stat.color.replace('text-', 'bg-')} transition-all duration-1000`}
                                        style={{ width: `${stat.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Courses Section */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h2 className="text-4xl font-black tracking-tight mb-2">Curriculum <span className="text-primary">Library</span></h2>
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Manage your active learning modules</p>
                        </div>
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 font-black text-lg group"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            <span>Enroll New Course</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 glass rounded-[3rem]">
                            <div className="relative mb-8">
                                <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-primary"></div>
                                <Zap className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-current" />
                            </div>
                            <p className="text-muted-foreground font-black uppercase tracking-widest animate-pulse">Syncing Library...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-[2rem] p-12 text-center shadow-2xl">
                            <h3 className="text-2xl font-black text-destructive mb-2 uppercase tracking-tight">Access Error</h3>
                            <p className="text-destructive/70 font-medium">❌ {error}</p>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="glass rounded-[3rem] p-24 text-center border-border/50 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px]"></div>

                            <div className="relative z-10 max-w-md mx-auto">
                                <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 glow-primary ring-1 ring-primary/30">
                                    <BookOpen className="w-10 h-10 text-primary fill-current" />
                                </div>
                                <h3 className="text-4xl font-black mb-4 tracking-tight">Your Journey Starts Here</h3>
                                <p className="text-muted-foreground text-lg mb-10 leading-relaxed font-medium">Your curriculum is waiting to be built. Add your first course from YouTube and start evolving today.</p>
                                <Link
                                    href="/courses"
                                    className="inline-flex items-center gap-3 px-10 py-5 bg-foreground text-background rounded-2xl hover:scale-105 transition-all shadow-2xl font-black text-xl"
                                >
                                    <Play className="w-6 h-6 fill-current" />
                                    Begin Learning
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map((course) => (
                                <Link
                                    key={course.videoId}
                                    href={`/courses?v=${course.videoId}`}
                                    className="group glass rounded-[2.5rem] overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-500 shadow-xl hover:shadow-primary/10 flex flex-col"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={`https://img.youtube.com/vi/${course.videoId}/maxresdefault.jpg`}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://img.youtube.com/vi/${course.videoId}/hqdefault.jpg`;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>

                                        {/* Status Badge */}
                                        <div className="absolute top-6 right-6">
                                            {course.progress.progressPercentage === 100 ? (
                                                <div className="px-4 py-2 bg-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl glow-accent">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Mastered
                                                </div>
                                            ) : course.progress.progressPercentage > 0 ? (
                                                <div className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl glow-primary">
                                                    {course.progress.progressPercentage}% Complete
                                                </div>
                                            ) : (
                                                <div className="px-4 py-2 bg-background/80 backdrop-blur-md text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest border border-border/50">
                                                    Not Started
                                                </div>
                                            )}
                                        </div>

                                        {/* Play Hover State */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:backdrop-blur-sm">
                                            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                                                <Play className="w-10 h-10 text-white ml-1 fill-current" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="font-black text-xl mb-4 line-clamp-2 leading-[1.3] group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h3>

                                        <div className="mt-auto space-y-6">
                                            {/* Progress Bar */}
                                            <div>
                                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                                                    <span>Course Progress</span>
                                                    <span className="text-primary">{course.progress.progressPercentage}%</span>
                                                </div>
                                                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className="bg-primary h-full rounded-full transition-all duration-700"
                                                        style={{ width: `${course.progress.progressPercentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Meta Stats */}
                                            <div className="flex items-center justify-between gap-4 py-4 border-t border-border/50">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                                                        <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <div className="text-[10px] font-black">
                                                        <span className="text-foreground">{course.progress.completedChapters.length}</span>
                                                        <span className="text-muted-foreground/60"> / {course.chapters.length}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-foreground uppercase tracking-wider">{formatWatchTime(course.progress.totalWatchTime)}</span>
                                                </div>
                                            </div>

                                            {/* Last Activity */}
                                            <div className="flex items-center justify-between pt-2">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                                    Last active: {formatDate(course.lastAccessed)}
                                                </div>
                                                {course.progress.progressPercentage > 0 && course.progress.progressPercentage < 100 && (
                                                    <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                                                        <span>Resume</span>
                                                        <Target className="w-3.5 h-3.5" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}