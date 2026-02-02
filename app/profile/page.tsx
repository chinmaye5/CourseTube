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
    BarChart3,
    Trash2,
    AlertCircle,
    X as CloseIcon
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ videoId: courseToDelete.videoId }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete course');
            }

            // Remove from local state
            setCourses(courses.filter(c => c.videoId !== courseToDelete.videoId));
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
        <div className="min-h-screen bg-background transition-colors duration-300">
            {/* Top Navigation Bar */}
            <nav className="bg-surface-theme/80 backdrop-blur-md border-b border-border-theme sticky top-0 z-50 shadow-lg transition-colors duration-300">
                <div className="px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <Link href="/" className="flex items-center space-x-2 text-foreground hover:text-indigo-400 transition-colors">
                                <Home className="w-5 h-5" />
                                <span className="font-semibold">Home</span>
                            </Link>
                            <Link href="/courses" className="flex items-center space-x-2 text-foreground hover:text-indigo-400 transition-colors">
                                <Play className="w-5 h-5" />
                                <span className="font-semibold">Course Player</span>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "w-9 h-9 border-2 border-indigo-500"
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* User Header */}
                <div className="mb-12">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-indigo-500/20">
                            {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0] || 'U'}
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-foreground mb-2">
                                {user?.firstName ? `Welcome back, ${user.firstName}!` : 'My Learning Dashboard'}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">Track your progress and continue learning</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-surface-theme rounded-xl p-6 border border-border-theme hover:border-indigo-500 transition-all shadow-lg group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                                    <BookOpen className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-foreground">{courses.length}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total Courses</div>
                                </div>
                            </div>
                            <div className="h-1 bg-card-theme rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500" style={{ width: '100%' }}></div>
                            </div>
                        </div>

                        <div className="bg-surface-theme rounded-xl p-6 border border-border-theme hover:border-emerald-500 transition-all shadow-lg group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-foreground">{completedCourses}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Completed</div>
                                </div>
                            </div>
                            <div className="h-1 bg-card-theme rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: courses.length > 0 ? `${(completedCourses / courses.length) * 100}%` : '0%' }}></div>
                            </div>
                        </div>

                        <div className="bg-surface-theme rounded-xl p-6 border border-border-theme hover:border-blue-500 transition-all shadow-lg group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                                    <TrendingUp className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-foreground">{inProgressCourses}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">In Progress</div>
                                </div>
                            </div>
                            <div className="h-1 bg-card-theme rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: courses.length > 0 ? `${(inProgressCourses / courses.length) * 100}%` : '0%' }}></div>
                            </div>
                        </div>

                        <div className="bg-surface-theme rounded-xl p-6 border border-border-theme hover:border-amber-500 transition-all shadow-lg group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
                                    <Clock className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-foreground">{formatWatchTime(totalWatchTime)}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Watch Time</div>
                                </div>
                            </div>
                            <div className="h-1 bg-card-theme rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Your Courses</h2>
                        <Link
                            href="/courses"
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-lg transition-all font-semibold shadow-lg shadow-indigo-500/20 flex items-center space-x-2"
                        >
                            <Play className="w-4 h-4" />
                            <span>Add New Course</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                                <p className="text-slate-500 dark:text-slate-400 text-lg">Loading your courses...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
                            <p className="text-red-400 font-medium">❌ {error}</p>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="bg-surface-theme rounded-xl p-16 text-center border border-border-theme shadow-xl">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20">
                                <BookOpen className="w-12 h-12 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">No courses yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Start your learning journey by adding your first YouTube course!</p>
                            <Link
                                href="/courses"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-semibold"
                            >
                                <Play className="w-5 h-5" />
                                Add Your First Course
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <Link
                                    key={course.videoId}
                                    href={`/courses?v=${course.videoId}`}
                                    className="group bg-surface-theme rounded-xl overflow-hidden border border-border-theme hover:border-indigo-500 transition-all hover:shadow-2xl hover:shadow-indigo-500/20"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative h-48 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 dark:from-indigo-900/30 dark:to-cyan-900/30 overflow-hidden">
                                        <img
                                            src={`https://img.youtube.com/vi/${course.videoId}/maxresdefault.jpg`}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://img.youtube.com/vi/${course.videoId}/hqdefault.jpg`;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-black/80 to-transparent"></div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setCourseToDelete(course);
                                            }}
                                            className="absolute top-4 left-4 p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-lg backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 z-10"
                                            title="Delete Course"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        {/* Progress Badge */}
                                        <div className="absolute top-4 right-4">
                                            {course.progress.progressPercentage === 100 ? (
                                                <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg border border-emerald-400/20">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Completed
                                                </div>
                                            ) : course.progress.progressPercentage > 0 ? (
                                                <div className="px-3 py-1 bg-indigo-500 text-white rounded-full text-xs font-semibold shadow-lg border border-indigo-400/20">
                                                    {course.progress.progressPercentage}% Done
                                                </div>
                                            ) : (
                                                <div className="px-3 py-1 bg-slate-100 dark:bg-slate-900/90 text-slate-700 dark:text-white rounded-full text-xs font-semibold shadow-lg border border-slate-200 dark:border-slate-700">
                                                    Not Started
                                                </div>
                                            )}
                                        </div>

                                        {/* Play Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-200">
                                                <Play className="w-8 h-8 text-indigo-600 ml-1" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {course.title}
                                        </h3>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                                                <span>Progress</span>
                                                <span className="font-semibold text-indigo-500 dark:text-indigo-400">{course.progress.progressPercentage}%</span>
                                            </div>
                                            <div className="w-full bg-card-theme rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${course.progress.progressPercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                                            <span className="flex items-center gap-1">
                                                <CheckCircle2 className="w-4 h-4" />
                                                {course.progress.completedChapters.length}/{course.chapters.length}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {formatWatchTime(course.progress.totalWatchTime)}
                                            </span>
                                        </div>

                                        {/* Last Watched */}
                                        <div className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                                            Last watched: {formatDate(course.lastAccessed)}
                                        </div>

                                        {/* Resume Button */}
                                        {course.progress.progressPercentage > 0 && course.progress.progressPercentage < 100 && (
                                            <div className="pt-4 border-t border-border-theme">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        Continue from Lecture {course.progress.lastWatchedChapter + 1}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 font-semibold text-sm">
                                                        <Play className="w-4 h-4" />
                                                        <span>Resume</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {courseToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-surface-theme border border-border-theme rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center space-x-3 text-red-500 mb-4">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Delete Course?</h3>
                        </div>

                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Are you sure you want to delete <span className="font-semibold text-foreground">"{courseToDelete.title}"</span>?
                            This will also remove all your progress and notes for this course.
                        </p>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setCourseToDelete(null)}
                                className="flex-1 px-4 py-2 bg-card-theme hover:bg-surface-theme text-foreground rounded-lg transition-colors font-semibold border border-border-theme"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteCourse}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold shadow-lg shadow-red-500/20 flex items-center justify-center space-x-2"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
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