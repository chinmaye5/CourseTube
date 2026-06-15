'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    TrendingUp,
    BookOpen,
    Play,
    Sparkles,
    ChevronRight,
    Clock,
    Users,
    Lightbulb,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';

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
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="pb-24">
                {/* Hero Search */}
                <section className="border-b border-border">
                    <div className="container mx-auto px-6 py-16 text-center">
                        <span className="text-sm font-medium text-primary">Explore</span>
                        <h1 className="mx-auto mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                            What do you want to learn today?
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                            Search trending community courses and curated learning paths across dozens of topics.
                        </p>
                        <div className="relative mx-auto mt-8 max-w-2xl">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search courses, topics, technologies..."
                                className="h-13 w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-base shadow-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Unified Search Results */}
                {isSearching && (
                    <section className="container mx-auto px-6 pt-12">
                        <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
                            <h2 className="text-xl font-semibold">
                                Results for <span className="text-primary">&ldquo;{searchQuery}&rdquo;</span>
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {searchResults.trending.length + searchResults.recommended.length} matches
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
                                    <Link
                                        key={`${c.videoId}-${c.topic}`}
                                        href={`/courses?v=${c.videoId}`}
                                        className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-md"
                                    >
                                        <div className="relative aspect-video overflow-hidden bg-muted">
                                            <img
                                                src={`https://img.youtube.com/vi/${c.videoId}/maxresdefault.jpg`}
                                                alt={c.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${c.videoId}/0.jpg`;
                                                }}
                                            />
                                            <span className="absolute bottom-2 right-2 rounded bg-foreground/80 px-1.5 py-0.5 text-[11px] font-medium text-background">
                                                {c.duration}
                                            </span>
                                        </div>
                                        <div className="flex flex-1 flex-col p-4">
                                            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                                                <Sparkles className="h-3.5 w-3.5" />
                                                {c.topic}
                                            </div>
                                            <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
                                                {c.title}
                                            </h3>
                                            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                                                Start learning
                                                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-border py-20 text-center">
                                <Search className="mx-auto mb-4 h-10 w-10 text-muted-foreground/60" />
                                <h3 className="mb-1.5 text-lg font-semibold">No results found</h3>
                                <p className="text-sm text-muted-foreground">Try a different topic or keyword.</p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-6 text-sm font-medium text-primary hover:text-primary-hover"
                                >
                                    Clear search
                                </button>
                            </div>
                        )}
                    </section>
                )}

                {/* Trending Section - Only visible when NOT searching */}
                {!isSearching && courses.length > 0 && (
                    <section className="container mx-auto px-6 pt-16">
                        <div className="mb-8 flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/50 text-primary">
                                <TrendingUp className="h-4.5 w-4.5" />
                            </span>
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight">Trending now</h2>
                                <p className="text-sm text-muted-foreground">Most added courses by the community</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {courses.slice(0, 12).map((course) => (
                                <CourseCard key={course.videoId} course={course} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Recommendations Section - Only visible when NOT searching */}
                {!isSearching && (
                    <section className="container mx-auto px-6 pt-16">
                        <div className="mb-10 flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/50 text-primary">
                                <Lightbulb className="h-4.5 w-4.5" />
                            </span>
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight">Curated paths</h2>
                                <p className="text-sm text-muted-foreground">Hand-picked courses for every track</p>
                            </div>
                        </div>

                        <div className="space-y-14">
                            {RECOMMENDATIONS.map((section) => (
                                <div key={section.topic}>
                                    <div className="mb-5 flex items-center justify-between">
                                        <h3 className="text-base font-semibold">{section.topic}</h3>
                                        <div className="mx-6 h-px flex-1 bg-border" />
                                        <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
                                            {section.courses.length} courses
                                        </span>
                                    </div>

                                    <div className="scrollbar-thin flex snap-x gap-5 overflow-x-auto pb-4">
                                        {section.courses.map((c) => (
                                            <Link
                                                key={c.videoId}
                                                href={`/courses?v=${c.videoId}`}
                                                className="group block min-w-[260px] snap-start overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-md md:min-w-[300px]"
                                            >
                                                <div className="relative aspect-video overflow-hidden bg-muted">
                                                    <img
                                                        src={`https://img.youtube.com/vi/${c.videoId}/hqdefault.jpg`}
                                                        alt={c.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <span className="absolute bottom-2 right-2 rounded bg-foreground/80 px-1.5 py-0.5 text-[11px] font-medium text-background">
                                                        {c.duration}
                                                    </span>
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="line-clamp-2 h-10 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
                                                        {c.title}
                                                    </h4>
                                                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <BookOpen className="h-3.5 w-3.5" />
                                                        <span>Curated course</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}

function CourseCard({ course }: { course: Course }) {
    const isPlaylist = course.videoId.startsWith('PL');
    const thumbnailId = isPlaylist && course.chapters?.[0]?.videoId
        ? course.chapters[0].videoId
        : course.videoId;

    return (
        <Link
            href={`/courses?v=${course.videoId}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-md"
        >
            <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                    src={`https://img.youtube.com/vi/${thumbnailId}/maxresdefault.jpg`}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${thumbnailId}/hqdefault.jpg`;
                    }}
                />
                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-foreground/80 px-1.5 py-0.5 text-[11px] font-medium text-background">
                    <Play className="h-3 w-3" />
                    {course.chapters?.length || 0}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
                    {course.title}
                </h3>

                <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {course.userCount} students
                    </span>
                    <span className="ml-auto flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        Tracking
                    </span>
                </div>
            </div>
        </Link>
    );
}
