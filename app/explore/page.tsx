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
    Lightbulb
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

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
            { videoId: "SqcY0Gl908M", title: "Next.js 15 Full Tutorial", duration: "8h" },
            { videoId: "C72WBaAIsxc", title: "Mastering Tailwind CSS", duration: "4h" },
            { videoId: "hQAHSlTtcmY", title: "TypeScript In-Depth", duration: "10h" },
            { videoId: "4UZrsTqkcW4", title: "JavaScript DOM Manipulation", duration: "6h" }
        ]
    },
    {
        topic: "Artificial Intelligence",
        courses: [
            { videoId: "aircAruvnKk", title: "How LLMs Work", duration: "25m" },
            { videoId: "Z6nkEZyXS9A", title: "Python for AI & ML", duration: "15h" },
            { videoId: "766q0_9S87c", title: "RAG Systems Explained", duration: "1h" },
            { videoId: "8O6vL9nO0lM", title: "Fine-tuning Small Models", duration: "45m" },
            { videoId: "T-D1KVIuvjA", title: "OpenAI API Crash Course", duration: "2h" }
        ]
    },
    {
        topic: "Backend Engineering",
        courses: [
            { videoId: "fBNz5xF-Kx4", title: "Node.js Professional Guide", duration: "18h" },
            { videoId: "pTFZFxd4hOI", title: "System Design Essentials", duration: "5h" },
            { videoId: "X8e9V_v_e_g", title: "Microservices with Go", duration: "9h" },
            { videoId: "HXV3zeQKqGY", title: "PostgreSQL for Developers", duration: "7h" },
            { videoId: "G0HViJAt9sY", title: "Redis Mastery Course", duration: "3h" }
        ]
    },
    {
        topic: "DevOps & Cloud",
        courses: [
            { videoId: "3c-iBn7E97M", title: "Docker Containerization", duration: "4h" },
            { videoId: "X48VuDVv0do", title: "Kubernetes for Beginners", duration: "10h" },
            { videoId: "Z3Sls-OqVfU", title: "AWS Cloud Practitioner", duration: "14h" },
            { videoId: "7XmCdf-it08", title: "Terraform Infrastructure as Code", duration: "6h" },
            { videoId: "R8_veKoY-o", title: "CI/CD Pipelines with GitHub Actions", duration: "3h" }
        ]
    },
    {
        topic: "Mobile App Development",
        courses: [
            { videoId: "VqUizRj_v_w", title: "React Native Masterclass", duration: "20h" },
            { videoId: "VPvVD8t02U8", title: "Flutter Full Course 2025", duration: "12h" },
            { videoId: "O9c-C5XW-O0", title: "SwiftUI for iOS Devs", duration: "8h" },
            { videoId: "V0_MIsEskP4", title: "Android Development with Kotlin", duration: "15h" },
            { videoId: "f_XoMTo_u_k", title: "Expo & Native Wind", duration: "2h" }
        ]
    },
    {
        topic: "Cybersecurity & Hacking",
        courses: [
            { videoId: "3Kq1MIfTWCE", title: "Ethical Hacking 101", duration: "10h" },
            { videoId: "6bbK8AnvW_E", title: "Metasploit Crash Course", duration: "4h" },
            { videoId: "9S_jFz_Y_iM", title: "Web Penetration Testing", duration: "7h" },
            { videoId: "iL66hNMTIio", title: "Network Security Fundamentals", duration: "5h" },
            { videoId: "O6T_z_H_J4M", title: "Active Directory Hacking", duration: "8h" }
        ]
    },
    {
        topic: "Data Science & Analysis",
        courses: [
            { videoId: "LHBE6Q9XlzI", title: "Pandas for Data Science", duration: "6h" },
            { videoId: "7onO-dAnD_s", title: "SQL for Data Analysts", duration: "12h" },
            { videoId: "vD7OnlDOnS0", title: "Statstics Mastery", duration: "10h" },
            { videoId: "GPV_v_X_e_g", title: "PowerBI Full Course", duration: "8h" },
            { videoId: "Xv8fV_v_v_v", title: "Tableau for Visualization", duration: "5h" }
        ]
    },
    {
        topic: "UI/UX & Design Systems",
        courses: [
            { videoId: "jwMm9Y_y_kM", title: "Figma UI/UX Design", duration: "15h" },
            { videoId: "X8vX_v_v_v_v", title: "Design Systems with Storybook", duration: "6h" },
            { videoId: "V_v_v_v_v_v_v", title: "Webflow for Designers", duration: "10h" },
            { videoId: "Y_v_v_v_v_v_v", title: "Typography Masterclass", duration: "3h" },
            { videoId: "Z_v_v_v_v_v_v", title: "Color Theory for UX", duration: "2h" }
        ]
    },
    {
        topic: "Product Management",
        courses: [
            { videoId: "vD_v_v_v_v_v", title: "Product Strategy Frameworks", duration: "4h" },
            { videoId: "X_v_v_v_v_v_v", title: "Agile & Scrum for PMs", duration: "5h" },
            { videoId: "W_v_v_v_v_v_v", title: "Market Research for Tech", duration: "3h" },
            { videoId: "R_v_v_v_v_v_v", title: "A/B Testing Experiments", duration: "2h" },
            { videoId: "Q_v_v_v_v_v_v", title: "Product Analytics (Mixpanel)", duration: "4h" }
        ]
    },
    {
        topic: "Rust Programming",
        courses: [
            { videoId: "zF3A_v_v_v_v", title: "Rust for Systems Dev", duration: "12h" },
            { videoId: "A_v_v_v_v_v_v", title: "Rust Web Development (Axum)", duration: "6h" },
            { videoId: "B_v_v_v_v_v_v", title: "Low-level Optimization", duration: "8h" },
            { videoId: "C_v_v_v_v_v_v", title: "Concurrent Programming", duration: "5h" },
            { videoId: "D_v_v_v_v_v_v", title: "Embedded Rust Guide", duration: "4h" }
        ]
    },
    {
        topic: "Computer Science Bases",
        courses: [
            { videoId: "8hly31xK_v_v", title: "Data Structures & Algos", duration: "20h" },
            { videoId: "E_v_v_v_v_v_v", title: "Operating Systems Level 1", duration: "15h" },
            { videoId: "F_v_v_v_v_v_v", title: "Database Internals", duration: "12h" },
            { videoId: "H_v_v_v_v_v_v", title: "Compiler Design Guide", duration: "10h" },
            { videoId: "I_v_v_v_v_v_v", title: "Networking Protocols", duration: "8h" }
        ]
    },
    {
        topic: "Game Development",
        courses: [
            { videoId: "gB1F9_v_v_v", title: "Unity C# Masterclass", duration: "25h" },
            { videoId: "J_v_v_v_v_v_v", title: "Unreal Engine 5 Blueprints", duration: "18h" },
            { videoId: "K_v_v_v_v_v_v", title: "Shaders & Visual FX", duration: "6h" },
            { videoId: "L_v_v_v_v_v_v", title: "2D Physics in Games", duration: "5h" },
            { videoId: "M_v_v_v_v_v_v", title: "Multiplayer Networking", duration: "10h" }
        ]
    },
    {
        topic: "Blockchain & Web3",
        courses: [
            { videoId: "M576WGiDBdQ", title: "Solidity Smart Contracts", duration: "32h" },
            { videoId: "vD_v_v_v_v_v_v", title: "DeFi Protocol Architecture", duration: "12h" },
            { videoId: "X_v_v_v_v_v_v_v", title: "NFT Marketplace Logic", duration: "8h" },
            { videoId: "Y_v_v_v_v_v_v_v", title: "EVM Internals Deep Dive", duration: "10h" },
            { videoId: "Z_v_v_v_v_v_v_v", title: "ZK-Proofs and Rollups", duration: "6h" }
        ]
    },
    {
        topic: "Soft Skills for Engineers",
        courses: [
            { videoId: "N_v_v_v_v_v_v", title: "Technical Communication", duration: "3h" },
            { videoId: "O_v_v_v_v_v_v", title: "Architecture Decision Records", duration: "2h" },
            { videoId: "P_v_v_v_v_v_v", title: "Engineering Leadership", duration: "5h" },
            { videoId: "R_v_v_v_v_v_v", title: "Negotiating Tech Debt", duration: "2h" },
            { videoId: "S_v_v_v_v_v_v", title: "Design Docs for Teams", duration: "3h" }
        ]
    },
    {
        topic: "TypeScript Mastery",
        courses: [
            { videoId: "gieEQFIfgYc", title: "Advanced TS Types", duration: "1h" },
            { videoId: "T_v_v_v_v_v_v", title: "Utility Types Cookbook", duration: "2h" },
            { videoId: "U_v_v_v_v_v_v", title: "TS in Large Workspaces", duration: "4h" },
            { videoId: "V_v_v_v_v_v_v", title: "Generics Mastery Guide", duration: "3h" },
            { videoId: "X_v_v_v_v_v_v", title: "TS Design Patterns", duration: "5h" }
        ]
    }
];

export default function ExplorePage() {
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
