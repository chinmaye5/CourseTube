'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    TrendingUp,
    BookOpen,
    Play,
    Sparkles,
    ChevronRight,
    Filter,
    Clock,
    Users,
    ArrowRight,
    Star,
    Layout,
    ChevronLeft,
    Lightbulb,
    BarChart3
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ADMIN_EMAIL } from '@/lib/constants';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

interface Course {
    videoId: string;
    title: string;
    url: string;
    chapters: any[];
    userCount: number;
    lastAdded: string;
}

interface RecommendedSection {
    topic: string;
    courses: {
        videoId: string;
        title: string;
        duration: string;
    }[];
}

const RECOMMENDATIONS: RecommendedSection[] = [
    {
        topic: "Frontend Masterclass",
        courses: [
            { videoId: "bMknfKXIFA8", title: "React Course for Beginners", duration: "12h" },
            { videoId: "CgkZ7MvWUAA", title: "React Full Course for free", duration: "4h" },
            { videoId: "k7o9R6eaSes", title: "Next.js Full Tutorial - Beginner to Advanced", duration: "7h" },
            { videoId: "oUmVFHlwZsI", title: "MASTER Angular in 90 Minutes with This Crash Course", duration: "1.5h" },
            { videoId: "4UZrsTqkcW4", title: "JavaScript DOM Manipulation", duration: "6h" }
        ]
    },
    {
        topic: "Artificial Intelligence",
        courses: [
            { videoId: "5NgNicANyqM", title: "Harvard CS50’s Artificial Intelligence with Python Full University Course", duration: "12h" },
            { videoId: "NWONeJKn6kc", title: "Machine Learning Course for Beginners", duration: "10h" },
            { videoId: "sVcwVQRHIc8", title: "Learn RAG From Scratch – Python AI Tutorial from a LangChain Engineer", duration: "2h" },
            { videoId: "ygXn5nV5qFc", title: "Python for AI - Full Beginner Course", duration: "5h" },
            { videoId: "aircAruvnKk", title: "How LLMs Work", duration: "25m" }
        ]
    },
    {
        topic: "Backend Engineering",
        courses: [
            { videoId: "fBNz5xF-Kx4", title: "Node.js Professional Guide", duration: "18h" },
            { videoId: "pTFZFxd4hOI", title: "System Design Essentials", duration: "5h" },
            { videoId: "o8FZ_rN26oo", title: "Microservices with Go", duration: "3h" },
            { videoId: "HXV3zeQKqGY", title: "PostgreSQL for Developers", duration: "7h" },
            { videoId: "XCsS_NVAa1g", title: "Redis Mastery Course", duration: "1h" }
        ]
    },
    {
        topic: "DevOps & Cloud",
        courses: [
            { videoId: "RqTEHSBrYFw", title: "Docker Containerization", duration: "4h" },
            { videoId: "kTp5xUtcalw", title: "Kubernetes for Beginners", duration: "4h" },
            { videoId: "k1RI5locZE4", title: "AWS full course", duration: "10h" },
            { videoId: "7xngnjfIlK4", title: "Terraform Infrastructure as Code", duration: "2h" },
            { videoId: "Xwpi0ITkL3U", title: "Complete GitHub Actions Course - From BEGINNER to PRO", duration: "3h" }
        ]
    },
    {
        topic: "Mobile App Development",
        courses: [
            { videoId: "sm5Y7Vtuihg", title: "React Native Masterclass", duration: "4h" },
            { videoId: "3kaGC_DrUnw", title: "Flutter Full Course 2025", duration: "4h" },
            { videoId: "b1oC7sLIgpI", title: "SwiftUI for iOS Devs", duration: "11h" },
            { videoId: "dzUc9vrsldM", title: "Android Development with Kotlin crash course", duration: "3h" },
            { videoId: "rIYzLhkG9TA", title: "React Native Full 8 Hours Course (Expo, Expo Router, Supabase)", duration: "8h" }
        ]
    },
    {
        topic: "Cybersecurity & Hacking",
        courses: [
            { videoId: "dz7Ntp7KQGA", title: "Ethical Hacking Full Course", duration: "10h" },
            { videoId: "xuYZNJCvHgQ", title: "Metasploit Crash Course", duration: "27m" },
            { videoId: "2_lswM1S264", title: "Web Penetration Testing", duration: "2h" },
            { videoId: "NIRXtMg-0z8", title: "Network Security Fundamentals", duration: "1h" },
            { videoId: "o8BsouyIcOc", title: "Active Directory Hacking", duration: "3h" }
        ]
    },
    {
        topic: "Data Science & Analysis",
        courses: [
            { videoId: "gtjxAH8uaP0", title: "Pandas for Data Science", duration: "5h" },
            { videoId: "7mz73uXD9DA", title: "SQL for Data Analysts", duration: "4h" },
            { videoId: "xPh5ihBWang", title: "Data science full course", duration: "12h" },
            { videoId: "FwjaHCVNBWA", title: "PowerBI Full Course", duration: "8h" },
            { videoId: "j8FSP8XuFyk", title: "Tableau crash course", duration: "1h" }
        ]
    },
    {
        topic: "UI/UX & Design Systems",
        courses: [
            { videoId: "1EvoteyU6PA", title: "Figma to webflow", duration: "1h" },
            { videoId: "76u-t6drWFY", title: "UI UX Design Full Course", duration: "12h" },
            { videoId: "agbh1wbfJt8", title: "Typography Masterclass", duration: "2h" },
            { videoId: "qSkHRVLcj6U", title: "Design Systems with Storybook", duration: "1h" },
            { videoId: "3m0TXas0Vjw", title: "Figma UI/UX Design", duration: "6h" }
        ]
    },
    {
        topic: "Game Development",
        courses: [
            { videoId: "rylaiB2uH2A", title: "C# Masterclass", duration: "12h" },
            { videoId: "Xw9QEMFInYU", title: "Unreal Engine 5 Blueprints", duration: "3h" },
            { videoId: "gB1F9G0JXOo", title: "Learn Unity - Beginner's Game Development Tutorial", duration: "7h" },
            { videoId: "oKbCaj1J6EI", title: "Three.js Shaders (GLSL) Crash Course For Absolute Beginners", duration: "3h" },
            { videoId: "Fj2DeO31oF4", title: "Multiplayer Tutorial", duration: "1h" }
        ]
    },
    {
        topic: "Blockchain & Web3",
        courses: [
            { videoId: "M576WGiDBdQ", title: "Solidity Smart Contracts", duration: "32h" },
            { videoId: "jcgfQEbptdo", title: "Blockchain full course", duration: "12h" },
            { videoId: "Wn_Kb3MR_cU", title: "Build and Deploy a Modern Web 3.0 Blockchain App", duration: "3h" },
            { videoId: "DRZogmD647U", title: "Advanced Web3 Security Coursetion", duration: "10h" },
            { videoId: "jYEqoIeAoBg", title: "Web3 Developer in 2024 Roadmap: Solidity, Smart Contract, and Blockchain Development ", duration: "7h" }
        ]
    },
];

export default function ExplorePage() {
    const { user } = useUser();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchExploreCourses();
    }, []);

    const fetchExploreCourses = async () => {
        try {
            const response = await fetch('/api/explore');
            if (response.ok) {
                const data = await response.json();
                setCourses(data.courses);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Unified Search Logic
    const getSearchResults = () => {
        if (!searchQuery.trim()) return { trending: [], recommended: [] };

        const query = searchQuery.toLowerCase();

        // Search in community courses
        const filteredTrending = courses.filter(course =>
            course.title.toLowerCase().includes(query)
        );

        // Search in curated recommendations
        const filteredRecommended: { videoId: string; title: string; duration: string; topic: string }[] = [];
        RECOMMENDATIONS.forEach(section => {
            section.courses.forEach(c => {
                if (c.title.toLowerCase().includes(query)) {
                    filteredRecommended.push({ ...c, topic: section.topic });
                }
            });
        });

        return { trending: filteredTrending, recommended: filteredRecommended };
    };

    const searchResults = getSearchResults();
    const isSearching = searchQuery.trim() !== '';

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Header */}
            <header className="bg-surface-theme/80 backdrop-blur-md border-b border-border-theme sticky top-0 z-50 shadow-xl transition-colors duration-300">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20">
                                <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">CourseTube</span>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <SignedIn>
                                {user?.emailAddresses.some(e => e.emailAddress === ADMIN_EMAIL) && (
                                    <Link href="/admin" className="px-4 py-2 text-indigo-500 hover:text-indigo-400 transition-colors font-bold flex items-center gap-1">
                                        <BarChart3 className="w-4 h-4" />
                                        Admin
                                    </Link>
                                )}
                                <Link href="/profile" className="px-4 py-2 text-slate-500 hover:text-foreground transition-colors font-medium">Dashboard</Link>
                                <UserButton />
                            </SignedIn>
                            <SignedOut>
                                <Link href="/sign-in" className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition-all shadow-lg font-semibold">Sign In</Link>
                            </SignedOut>
                        </div>
                    </div>
                </div>
            </header>

            <main className="pb-20">
                {/* Hero Search */}
                <section className="relative py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.03),transparent_70%)]"></div>
                    <div className="container mx-auto px-6 relative text-center">
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-8">
                                What are you <span className="text-indigo-500">learning</span> today?
                            </h1>
                            <div className="max-w-2xl mx-auto relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search 1,000+ community courses..."
                                    className="w-full pl-14 pr-6 py-5 bg-surface-theme border border-border-theme rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-xl text-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Unified Search Results */}
                {isSearching && (
                    <section className="container mx-auto px-6">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-theme">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Search className="w-6 h-6 text-indigo-500" />
                                Search Results for "{searchQuery}"
                            </h2>
                            <p className="text-slate-500">
                                Found {searchResults.trending.length + searchResults.recommended.length} matches
                            </p>
                        </div>

                        {(searchResults.trending.length > 0 || searchResults.recommended.length > 0) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {/* Community Results */}
                                {searchResults.trending.map((course) => (
                                    <CourseCard key={course.videoId} course={course} />
                                ))}

                                {/* Curated Results converted to CourseCard-like display */}
                                {searchResults.recommended.map((c) => (
                                    <motion.div
                                        key={`${c.videoId}-${c.topic}`}
                                        whileHover={{ y: -5 }}
                                        className="group bg-surface-theme/40 backdrop-blur-sm border border-border-theme rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all flex flex-col"
                                    >
                                        <div className="aspect-video relative overflow-hidden">
                                            <img
                                                src={`https://img.youtube.com/vi/${c.videoId}/maxresdefault.jpg`}
                                                alt={c.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${c.videoId}/0.jpg`;
                                                }}
                                            />
                                            <div className="absolute top-3 right-3 px-2 py-1 bg-indigo-500/80 backdrop-blur-md rounded text-white text-[10px] font-bold uppercase tracking-wider">
                                                Curated: {c.topic}
                                            </div>
                                            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-white text-xs font-medium">
                                                {c.duration}
                                            </div>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-400 transition-colors">
                                                {c.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-500 mt-auto pt-4 border-t border-border-theme/50">
                                                <div className="flex items-center gap-1.5">
                                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                                    <span>Premium Selection</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/courses?v=${c.videoId}`}
                                                className="mt-5 w-full py-3 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-500 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group/btn"
                                            >
                                                Start Learning
                                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-surface-theme/20 rounded-3xl border border-dashed border-border-theme">
                                <Search className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-bold mb-2">No results found</h3>
                                <p className="text-slate-500">Try searching for a different topic or keyword.</p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-6 text-indigo-500 font-bold underline"
                                >
                                    Clear Search
                                </button>
                            </div>
                        )}
                    </section>
                )}

                {/* Trending Section - Only visible when NOT searching */}
                {!isSearching && courses.length > 0 && (
                    <section className="container mx-auto px-6 mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Trending Now</h2>
                                <p className="text-slate-500 text-sm italic">Most added courses by our community</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {courses.slice(0, 12).map((course) => (
                                <CourseCard key={course.videoId} course={course} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Recommendations Section - Only visible when NOT searching */}
                {!isSearching && (
                    <section className="container mx-auto px-6">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                                <Lightbulb className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Curated Paths</h2>
                                <p className="text-slate-500 text-sm">Hand-picked excellence for every career track</p>
                            </div>
                        </div>

                        <div className="space-y-16">
                            {RECOMMENDATIONS.map((section, idx) => (
                                <div key={section.topic} className="group/section">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <span className="text-indigo-500">#{idx + 1}</span>
                                            {section.topic}
                                        </h3>
                                        <div className="h-px flex-1 mx-6 bg-gradient-to-r from-border-theme to-transparent opacity-50"></div>
                                        <button className="text-sm text-indigo-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                                            View All <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
                                        {section.courses.map((c) => (
                                            <div key={c.videoId} className="min-w-[280px] md:min-w-[320px] snap-start">
                                                <Link
                                                    href={`/courses?v=${c.videoId}`}
                                                    className="block group bg-surface-theme/50 border border-border-theme rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl transition-all"
                                                >
                                                    <div className="aspect-video relative overflow-hidden">
                                                        <img
                                                            src={`https://img.youtube.com/vi/${c.videoId}/hqdefault.jpg`}
                                                            alt={c.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-md rounded text-white text-[10px] font-bold">
                                                            {c.duration}
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h4 className="font-bold text-sm mb-3 line-clamp-2 h-10 group-hover:text-indigo-400 transition-colors">
                                                            {c.title}
                                                        </h4>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                                <BookOpen className="w-3.5 h-3.5" />
                                                                <span>Course</span>
                                                            </div>
                                                            <div className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold rounded-full border border-indigo-500/20">
                                                                Curated
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className="border-t border-border-theme py-12 text-center text-slate-500 text-sm">
                <p>© 2025 CourseTube • Built for Lifelong Learners</p>
            </footer>
        </div>
    );
}

function CourseCard({ course }: { course: Course }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group bg-surface-theme/40 backdrop-blur-sm border border-border-theme rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all flex flex-col"
        >
            <div className="aspect-video relative overflow-hidden">
                {(() => {
                    const isPlaylist = course.videoId.startsWith('PL');
                    const thumbnailId = isPlaylist && course.chapters?.[0]?.videoId
                        ? course.chapters[0].videoId
                        : course.videoId;

                    return (
                        <img
                            src={`https://img.youtube.com/vi/${thumbnailId}/maxresdefault.jpg`}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${thumbnailId}/hqdefault.jpg`;
                            }}
                        />
                    );
                })()}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-white text-xs font-medium flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    {course.chapters?.length || 0} Lectures
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-400 transition-colors">
                    {course.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-slate-500 mt-auto pt-4 border-t border-border-theme/50">
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{course.userCount} students</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Tracking</span>
                    </div>
                </div>

                <Link
                    href={`/courses?v=${course.videoId}`}
                    className="mt-5 w-full py-3 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-500 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group/btn"
                >
                    Start Learning
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
