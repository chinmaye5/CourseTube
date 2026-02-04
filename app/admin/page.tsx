'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
    Users,
    BookOpen,
    TrendingUp,
    BarChart3,
    Search,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Mail,
    Calendar,
    ArrowLeft,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ADMIN_EMAIL } from '@/lib/constants';

interface UserCourse {
    title: string;
    videoId: string;
    progress: number;
    lastAccessed: string;
}

interface UserStat {
    id: string;
    name: string;
    email: string;
    courseCount: number;
    courses: UserCourse[];
    createdAt: number;
}

interface AdminData {
    stats: {
        totalUsers: number;
        totalCoursesEnrolled: number;
        activeUsers: number;
    };
    userStats: UserStat[];
    activityData: { date: string; courses: number }[];
}

export default function AdminDashboard() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [data, setData] = useState<AdminData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedUser, setExpandedUser] = useState<string | null>(null);


    useEffect(() => {
        if (isLoaded) {
            const isAdmin = user?.emailAddresses.some(e => e.emailAddress === ADMIN_EMAIL);
            if (!isAdmin) {
                router.push('/');
                return;
            }
            fetchStats();
        }
    }, [isLoaded, user]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to fetch admin stats');
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = data?.userStats.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 animate-pulse">Securing Admin Access...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl max-w-md text-center">
                    <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <Link href="/" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Admin Header */}
            <nav className="bg-surface-theme/80 backdrop-blur-md border-b border-border-theme sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/profile" className="p-2 hover:bg-card-theme rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                                Admin Analytics
                            </h1>
                            <p className="text-xs text-slate-500">CourseTube Executive Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-semibold">{user?.fullName}</span>
                            <span className="text-xs text-emerald-500 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> System Admin
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-surface-theme border border-border-theme rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Users size={120} />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-indigo-500/10 rounded-xl">
                                <Users className="text-indigo-500 w-6 h-6" />
                            </div>
                            <span className="text-slate-400 font-medium">Total Users</span>
                        </div>
                        <h2 className="text-4xl font-bold">{data?.stats.totalUsers}</h2>
                        <div className="mt-2 text-xs text-emerald-500 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +{data?.stats.totalUsers} from beginning
                        </div>
                    </div>

                    <div className="bg-surface-theme border border-border-theme rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <BookOpen size={120} />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-cyan-500/10 rounded-xl">
                                <BookOpen className="text-cyan-500 w-6 h-6" />
                            </div>
                            <span className="text-slate-400 font-medium">Total Enrollments</span>
                        </div>
                        <h2 className="text-4xl font-bold">{data?.stats.totalCoursesEnrolled}</h2>
                        <div className="mt-2 text-xs text-slate-400">Total courses added across platform</div>
                    </div>

                    <div className="bg-surface-theme border border-border-theme rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <BarChart3 size={120} />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl">
                                <BarChart3 className="text-emerald-500 w-6 h-6" />
                            </div>
                            <span className="text-slate-400 font-medium">Active Users</span>
                        </div>
                        <h2 className="text-4xl font-bold">{data?.stats.activeUsers}</h2>
                        <div className="mt-2 text-xs text-emerald-500">Users with at least one course</div>
                    </div>
                </div>

                {/* Activity Chart */}
                <div className="bg-surface-theme border border-border-theme rounded-2xl p-6 mb-8 shadow-xl">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        Platform Activity (Last 14 Days)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.activityData}>
                                <defs>
                                    <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1e293b',
                                        border: '1px solid #334155',
                                        borderRadius: '12px',
                                        color: '#f8fafc'
                                    }}
                                    itemStyle={{ color: '#818cf8' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="courses"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCourses)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Users List */}
                <div className="bg-surface-theme border border-border-theme rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-border-theme flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-lg font-bold">User Directory</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="pl-10 pr-4 py-2 bg-card-theme border border-border-theme rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-full md:w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-card-theme/50 text-slate-400 font-medium text-sm">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Courses</th>
                                    <th className="px-6 py-4">Signed Up</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-theme">
                                {filteredUsers.map((user) => (
                                    <React.Fragment key={user.id}>
                                        <tr className="hover:bg-card-theme/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white uppercase shadow-lg shadow-indigo-500/10">
                                                        {user.name[0]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">{user.name}</span>
                                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-500/20">
                                                        {user.courseCount} Courses
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                                                    className="flex items-center gap-1 text-sm font-medium text-indigo-500 dark:text-indigo-400 hover:underline"
                                                >
                                                    {expandedUser === user.id ? 'Hide Details' : 'View Stats'}
                                                    {expandedUser === user.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedUser === user.id && (
                                            <tr>
                                                <td colSpan={4} className="bg-card-theme/20 px-6 py-6 border-b border-border-theme">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {user.courses.length > 0 ? user.courses.map((course, idx) => (
                                                            <div key={idx} className="bg-surface-theme p-4 rounded-xl border border-border-theme shadow-lg group/course">
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <p className="text-sm font-bold line-clamp-1 flex-1">{course.title}</p>
                                                                    <Link
                                                                        href={`/courses?v=${course.videoId}`}
                                                                        target="_blank"
                                                                        className="p-1.5 hover:bg-card-theme rounded-lg transition-colors text-slate-500"
                                                                    >
                                                                        <ExternalLink className="w-3 h-3" />
                                                                    </Link>
                                                                </div>
                                                                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                                                                    <span>Progress</span>
                                                                    <span className="font-bold text-indigo-500">{course.progress}%</span>
                                                                </div>
                                                                <div className="w-full bg-card-theme h-2 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500"
                                                                        style={{ width: `${course.progress}%` }}
                                                                    ></div>
                                                                </div>
                                                                <p className="mt-3 text-[10px] text-slate-500">
                                                                    Last seen: {new Date(course.lastAccessed).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        )) : (
                                                            <div className="col-span-full text-center py-8 text-slate-500 bg-card-theme/30 rounded-xl border border-dashed border-border-theme">
                                                                This user has not enrolled in any courses yet.
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                                                    <Search className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="text-slate-500 font-medium">No users found matching "{searchQuery}"</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
