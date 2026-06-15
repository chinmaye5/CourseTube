'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import {
    Play,
    Clock,
    CheckCircle2,
    TrendingUp,
    BookOpen,
    Plus,
    Trash2,
    AlertCircle,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';

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
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDeleteCourse = async () => {
        if (!courseToDelete) return;
        try {
            setIsDeleting(true);
            const response = await fetch('/api/user-courses', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId: courseToDelete.videoId }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete course');
            }
            setCourses(courses.filter((c) => c.videoId !== courseToDelete.videoId));
            setCourseToDelete(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete course');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const formatWatchTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const completedCourses = courses.filter((c) => c.progress.progressPercentage === 100).length;
    const inProgressCourses = courses.filter(
        (c) => c.progress.progressPercentage > 0 && c.progress.progressPercentage < 100
    ).length;
    const totalWatchTime = courses.reduce((acc, c) => acc + (c.progress.totalWatchTime || 0), 0);

    const stats = [
        { icon: BookOpen, label: 'Total courses', value: courses.length },
        { icon: CheckCircle2, label: 'Completed', value: completedCourses },
        { icon: TrendingUp, label: 'In progress', value: inProgressCourses },
        { icon: Clock, label: 'Watch time', value: formatWatchTime(totalWatchTime) },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="mx-auto max-w-7xl px-6 py-12">
                {/* Header */}
                <div className="flex flex-col gap-2 border-b border-border pb-8">
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        {user?.firstName ? `Welcome back, ${user.firstName}` : 'Your dashboard'}
                    </h1>
                    <p className="text-muted-foreground">Track your progress and continue learning.</p>
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {stats.map((s) => (
                        <div key={s.label} className="rounded-xl border border-border bg-card p-5">
                            <div className="flex items-center gap-2.5 text-muted-foreground">
                                <s.icon className="h-4 w-4" />
                                <span className="text-sm">{s.label}</span>
                            </div>
                            <div className="mt-3 text-3xl font-semibold tracking-tight">{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Courses */}
                <div className="mt-12">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-semibold tracking-tight">Your courses</h2>
                        <Link
                            href="/courses"
                            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
                        >
                            <Plus className="h-4 w-4" />
                            Add course
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border py-20 text-center">
                            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/50 text-primary">
                                <BookOpen className="h-6 w-6" />
                            </span>
                            <h3 className="mt-5 text-lg font-semibold">No courses yet</h3>
                            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                                Add your first YouTube video or playlist to start building your library.
                            </p>
                            <Link
                                href="/courses"
                                className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
                            >
                                <Play className="h-4 w-4" />
                                Add your first course
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {courses.map((course) => {
                                const isPlaylist = course.videoId.startsWith('PL');
                                const paramName = isPlaylist ? 'list' : 'v';
                                const thumbnailId = course.chapters?.[0]?.videoId || course.videoId;
                                const pct = course.progress.progressPercentage;
                                return (
                                    <Link
                                        key={course.videoId}
                                        href={`/courses?${paramName}=${course.videoId}`}
                                        className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-md"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video overflow-hidden bg-muted">
                                            <img
                                                src={`https://img.youtube.com/vi/${thumbnailId}/maxresdefault.jpg`}
                                                alt={course.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.currentTarget.src = `https://img.youtube.com/vi/${thumbnailId}/hqdefault.jpg`;
                                                }}
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setCourseToDelete(course);
                                                }}
                                                className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/90 text-muted-foreground opacity-0 transition-all hover:border-destructive/40 hover:text-destructive group-hover:opacity-100"
                                                title="Delete course"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            <div className="absolute right-2 top-2">
                                                {pct === 100 ? (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-success px-2 py-1 text-[11px] font-medium text-white">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Completed
                                                    </span>
                                                ) : pct > 0 ? (
                                                    <span className="rounded-md bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground">
                                                        {pct}% done
                                                    </span>
                                                ) : (
                                                    <span className="rounded-md border border-border bg-background/90 px-2 py-1 text-[11px] font-medium text-muted-foreground">
                                                        Not started
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-1 flex-col p-5">
                                            <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
                                                {course.title}
                                            </h3>

                                            <div className="mt-4">
                                                <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                                                    <span>Progress</span>
                                                    <span className="font-medium text-foreground">{pct}%</span>
                                                </div>
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className="h-full rounded-full bg-primary transition-all duration-300"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    {course.progress.completedChapters.length}/{course.chapters.length}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {formatWatchTime(course.progress.totalWatchTime)}
                                                </span>
                                                <span>{formatDate(course.lastAccessed)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {courseToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                <AlertCircle className="h-5 w-5" />
                            </span>
                            <h3 className="text-lg font-semibold">Delete course?</h3>
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            Delete <span className="font-medium text-foreground">&ldquo;{courseToDelete.title}&rdquo;</span>?
                            This also removes all your progress and notes for this course.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setCourseToDelete(null)}
                                disabled={isDeleting}
                                className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteCourse}
                                disabled={isDeleting}
                                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:opacity-90 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
