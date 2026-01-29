'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import NotesBookmarks from '@/components/NotesBookmarks';
import {
    Play,
    Pause,
    CheckCircle2,
    Clock,
    BookOpen,
    ChevronRight,
    Menu,
    X,
    Home,
    BarChart3,
    Star,
    Download,
    ListOrdered,
    StickyNote
} from 'lucide-react';

interface Chapter {
    title: string;
    time: string;
    url: string;
    timestamp: number;
}

interface ProgressData {
    [videoId: string]: {
        completedChapters: number[];
        lastWatchedChapter: number;
        progressPercentage: number;
        totalWatchTime: number;
        timestamp: number;
    };
}

export default function YouTubeCoursePlayer() {
    const { user } = useUser();
    const searchParams = useSearchParams();
    const [url, setUrl] = useState('');
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [videoId, setVideoId] = useState('');
    const [progress, setProgress] = useState<ProgressData>({});
    const [currentChapter, setCurrentChapter] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [playerReady, setPlayerReady] = useState(false);
    const [videoTitle, setVideoTitle] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [sidebarTab, setSidebarTab] = useState<'chapters' | 'notes'>('chapters');

    const playerRef = useRef<any>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load progress from localStorage and MongoDB
    useEffect(() => {
        const initializeProgress = async () => {
            // First load from localStorage
            const savedProgress = localStorage.getItem('youtube-course-progress');
            if (savedProgress) {
                setProgress(JSON.parse(savedProgress));
            }

            // Check for video ID in URL parameters
            const videoIdParam = searchParams.get('v');
            if (videoIdParam && user) {
                // Load progress from MongoDB for this specific video FIRST
                await loadProgressForVideo(videoIdParam);

                const youtubeUrl = `https://www.youtube.com/watch?v=${videoIdParam}`;
                setUrl(youtubeUrl);

                // Auto-load the course after progress is loaded
                setTimeout(() => {
                    handleFetchChapters(youtubeUrl);
                }, 800);
            } else if (user) {
                // Just load all saved courses
                loadSavedCourses();
            }
        };

        initializeProgress();
    }, [user, searchParams]);

    // Save progress to localStorage and MongoDB (debounced)
    useEffect(() => {
        localStorage.setItem('youtube-course-progress', JSON.stringify(progress));

        // Debounce MongoDB saves to avoid too many requests
        if (videoId && chapters.length > 0 && progress[videoId]) {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = setTimeout(() => {
                saveProgressToDatabase();
            }, 2000);
        }
    }, [progress, videoId, chapters]);

    const loadProgressForVideo = async (videoId: string) => {
        try {
            const response = await fetch('/api/user-courses');
            if (response.ok) {
                const data = await response.json();
                const course = data.courses.find((c: any) => c.videoId === videoId);

                if (course && course.progress) {
                    console.log('📥 Loaded progress from MongoDB for video:', videoId, course.progress);
                    // Update progress state with MongoDB data
                    setProgress(prev => ({
                        ...prev,
                        [videoId]: course.progress
                    }));

                    // Also update localStorage
                    const savedProgress = localStorage.getItem('youtube-course-progress');
                    const progressData = savedProgress ? JSON.parse(savedProgress) : {};
                    progressData[videoId] = course.progress;
                    localStorage.setItem('youtube-course-progress', JSON.stringify(progressData));

                    return course.progress;
                }
            }
        } catch (error) {
            console.error('Error loading progress for video:', error);
        }
        return null;
    };

    const loadSavedCourses = async () => {
        try {
            const response = await fetch('/api/user-courses');
            if (response.ok) {
                const data = await response.json();
                console.log('Loaded saved courses:', data.courses.length);

                // Merge all progress from MongoDB into local state
                const mongoProgress: ProgressData = {};
                data.courses.forEach((course: any) => {
                    if (course.progress) {
                        mongoProgress[course.videoId] = course.progress;
                    }
                });

                if (Object.keys(mongoProgress).length > 0) {
                    setProgress(prev => ({ ...prev, ...mongoProgress }));
                }
            }
        } catch (error) {
            console.error('Error loading saved courses:', error);
        }
    };

    const saveProgressToDatabase = async () => {
        if (!videoId || !user) return;

        try {
            const response = await fetch('/api/save-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    videoId,
                    url,
                    title: videoTitle || 'YouTube Course',
                    chapters,
                    progress: progress[videoId]
                }),
            });

            if (response.ok) {
                console.log('💾 Progress saved to database');
            }
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const extractVideoId = (url: string) => {
        const match = url.match(
            /(?:v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
        );
        return match ? match[1] : null;
    };

    const parseTimeToSeconds = (timeStr: string): number => {
        const parts = timeStr.split(':').map(part => parseInt(part));
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        }
        return parts[0];
    };

    const handleFetchChapters = async (urlToFetch?: string) => {
        const targetUrl = urlToFetch || url;
        if (!targetUrl) {
            setError('Please enter a YouTube URL');
            return;
        }

        setLoading(true);
        setError('');
        setChapters([]);
        setPlayerReady(false);

        try {
            const id = extractVideoId(targetUrl);
            if (!id) {
                throw new Error('Invalid YouTube URL');
            }
            setVideoId(id);

            const response = await fetch('/api/youtube-chapters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ videoId: id }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch chapters');
            }

            const data = await response.json();
            setVideoTitle(data.title || 'YouTube Course');
            const chaptersWithTimestamps = data.chapters.map((chapter: Chapter) => ({
                ...chapter,
                timestamp: parseTimeToSeconds(chapter.time)
            }));
            setChapters(chaptersWithTimestamps);
            setPlayerReady(true);

            // Set current chapter from progress if it exists
            if (progress[id]) {
                const resumeChapter = progress[id].lastWatchedChapter || 0;
                console.log('🎯 Will resume from chapter:', resumeChapter);
                setCurrentChapter(resumeChapter);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const initializeYouTubePlayer = () => {
        if (!videoId || !window.YT) return;

        playerRef.current = new window.YT.Player('youtube-player', {
            videoId: videoId,
            playerVars: {
                playsinline: 1,
                rel: 0,
                modestbranding: 1,
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
            },
        });
    };

    const onPlayerReady = (event: any) => {
        // Resume from last watched chapter
        if (progress[videoId] && chapters.length > 0) {
            const lastChapter = progress[videoId].lastWatchedChapter || 0;
            if (chapters[lastChapter]) {
                console.log('▶️ Resuming from chapter', lastChapter, 'at', chapters[lastChapter].timestamp, 'seconds');
                playerRef.current.seekTo(chapters[lastChapter].timestamp, true);
                setCurrentChapter(lastChapter);
            }
        }
        startProgressTracking();
    };

    const onPlayerStateChange = (event: any) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            startProgressTracking();
        } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
            stopProgressTracking();
            saveProgressToDatabase();
        } else if (event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            stopProgressTracking();
            saveProgressToDatabase();
        }
    };

    const startProgressTracking = () => {
        stopProgressTracking();
        progressIntervalRef.current = setInterval(trackProgress, 1000);
    };

    const stopProgressTracking = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    const trackProgress = () => {
        if (!playerRef.current || chapters.length === 0) return;

        const currentTime = playerRef.current.getCurrentTime();

        // Find current chapter based on timestamp
        let newCurrentChapter = 0;
        for (let i = chapters.length - 1; i >= 0; i--) {
            if (currentTime >= chapters[i].timestamp) {
                newCurrentChapter = i;
                break;
            }
        }

        if (newCurrentChapter !== currentChapter) {
            setCurrentChapter(newCurrentChapter);

            // Auto-mark previous chapters as completed
            if (newCurrentChapter > currentChapter) {
                setProgress(prev => {
                    const videoProgress = prev[videoId] || {
                        completedChapters: [],
                        lastWatchedChapter: -1,
                        progressPercentage: 0,
                        totalWatchTime: 0,
                        timestamp: Date.now()
                    };

                    const newCompletedChapters = [...new Set([
                        ...videoProgress.completedChapters,
                        ...Array.from({ length: newCurrentChapter }, (_, i) => i)
                    ])];

                    const progressPercentage = Math.round((newCompletedChapters.length / chapters.length) * 100);

                    return {
                        ...prev,
                        [videoId]: {
                            ...videoProgress,
                            completedChapters: newCompletedChapters,
                            lastWatchedChapter: newCurrentChapter,
                            progressPercentage,
                            totalWatchTime: videoProgress.totalWatchTime + 1,
                            timestamp: Date.now()
                        }
                    };
                });
            }
        }
    };

    const seekToChapter = (chapterIndex: number) => {
        if (playerRef.current && chapters[chapterIndex]) {
            playerRef.current.seekTo(chapters[chapterIndex].timestamp, true);
            playerRef.current.playVideo();
            setCurrentChapter(chapterIndex);
        }
    };

    const seekToTimestamp = (timestamp: number) => {
        if (playerRef.current) {
            playerRef.current.seekTo(timestamp, true);
            playerRef.current.playVideo();
        }
    };

    const markChapterCompleted = (chapterIndex: number) => {
        if (!videoId) return;

        setProgress(prev => {
            const videoProgress = prev[videoId] || {
                completedChapters: [],
                lastWatchedChapter: -1,
                progressPercentage: 0,
                totalWatchTime: 0,
                timestamp: Date.now()
            };

            const isCompleted = videoProgress.completedChapters.includes(chapterIndex);

            const newCompletedChapters = isCompleted
                ? videoProgress.completedChapters.filter(idx => idx !== chapterIndex)
                : [...videoProgress.completedChapters, chapterIndex];

            const progressPercentage = Math.round((newCompletedChapters.length / chapters.length) * 100);

            return {
                ...prev,
                [videoId]: {
                    ...videoProgress,
                    completedChapters: newCompletedChapters,
                    lastWatchedChapter: chapterIndex,
                    progressPercentage,
                    timestamp: Date.now()
                }
            };
        });
    };

    const getVideoProgress = () => {
        if (!videoId || !progress[videoId]) return null;
        return progress[videoId];
    };

    const videoProgress = getVideoProgress();
    const progressPercentage = videoProgress?.progressPercentage || 0;

    // Load YouTube IFrame API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = initializeYouTubePlayer;
        } else {
            initializeYouTubePlayer();
        }

        return () => {
            stopProgressTracking();
        };
    }, [videoId, playerReady]);

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
                                <span className="font-bold tracking-tight hidden sm:inline">Home</span>
                            </Link>
                            <Link href="/profile" className="flex items-center space-x-3 group transition-transform hover:scale-105">
                                <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                </div>
                                <span className="font-bold tracking-tight hidden sm:inline">My Courses</span>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-6">
                            {videoTitle && (
                                <h1 className="text-foreground font-black text-sm uppercase tracking-wider max-w-md truncate hidden lg:block">
                                    {videoTitle}
                                </h1>
                            )}

                            {/* Progress Indicator */}
                            {chapters.length > 0 && (
                                <div className="flex items-center space-x-4 bg-card/50 backdrop-blur-md px-4 py-2 rounded-xl border border-border/50">
                                    <div className="flex items-center space-x-2">
                                        <BarChart3 className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-black">{progressPercentage}%</span>
                                    </div>
                                    <div className="w-24 bg-secondary rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-primary h-full rounded-full transition-all duration-700 glow-primary"
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2.5 bg-secondary hover:bg-border rounded-xl transition-all border border-border/50 group"
                            >
                                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 group-hover:text-primary" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex h-[calc(100vh-73px)]">
                {/* Main Video Area */}
                <div className="flex-1 flex flex-col relative overflow-hidden">
                    {/* Video Player Container */}
                    <div className="flex-1 bg-black relative shadow-2xl">
                        {playerReady ? (
                            <div id="youtube-player" className="w-full h-full"></div>
                        ) : chapters.length > 0 ? (
                            <div className="flex items-center justify-center h-full bg-mesh">
                                <div className="text-center animate-pulse">
                                    <div className="relative mb-6">
                                        <div className="rounded-full h-20 w-20 border-t-2 border-primary mx-auto"></div>
                                        <Play className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fill-current" />
                                    </div>
                                    <p className="text-muted-foreground text-sm font-black uppercase tracking-[0.2em]">Preparing Classroom</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full bg-mesh">
                                <div className="text-center max-w-lg px-8 py-12 glass rounded-[2.5rem] border-primary/20 shadow-2xl">
                                    <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 glow-primary ring-1 ring-primary/30">
                                        <Play className="w-10 h-10 text-primary ml-1 fill-current" />
                                    </div>
                                    <h3 className="text-4xl font-black mb-4 tracking-tight">Ready to <span className="text-primary">Evolve</span>?</h3>
                                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">Paste any YouTube URL in the sidebar to transform it into a structured learning course.</p>
                                    <div className="flex flex-wrap items-center justify-center gap-4">
                                        {["Track progress", "Resume anytime", "Take smart notes"].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 glass-pill rounded-full text-xs font-bold text-primary">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Course Info Bar */}
                    {chapters.length > 0 && chapters[currentChapter] && (
                        <div className="glass border-t border-border/50 px-8 py-6">
                            <div className="flex items-center justify-between gap-8">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <span className="px-3 py-1 glass-pill text-primary rounded-lg text-[10px] font-black uppercase tracking-wider">
                                            Lecture {currentChapter + 1} / {chapters.length}
                                        </span>
                                        {videoProgress?.completedChapters.includes(currentChapter) && (
                                            <span className="flex items-center space-x-1.5 text-accent text-xs font-black uppercase tracking-widest">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Mastered</span>
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-black mb-2 truncate">
                                        {chapters[currentChapter].title}
                                    </h3>
                                    <div className="flex items-center space-x-6 text-sm font-medium text-muted-foreground">
                                        <span className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4 text-primary/70" />
                                            <span>{chapters[currentChapter].time}</span>
                                        </span>
                                        <div className="h-1 w-1 rounded-full bg-border"></div>
                                        <span>{videoProgress?.completedChapters.length || 0} Lectures Completed</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {currentChapter > 0 && (
                                        <button
                                            onClick={() => seekToChapter(currentChapter - 1)}
                                            className="px-6 py-3 bg-secondary hover:bg-border text-foreground rounded-2xl transition-all font-bold border border-border/50"
                                        >
                                            Previous
                                        </button>
                                    )}
                                    <button
                                        onClick={() => markChapterCompleted(currentChapter)}
                                        className={`px-8 py-3 rounded-2xl font-black transition-all shadow-xl flex items-center gap-3 ${videoProgress?.completedChapters.includes(currentChapter)
                                            ? 'bg-accent text-white glow-accent'
                                            : 'bg-primary text-white glow-primary hover:scale-105 active:scale-95'
                                            }`}
                                    >
                                        {videoProgress?.completedChapters.includes(currentChapter) ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5 fill-current" />
                                                <span>Lecture Complete</span>
                                            </>
                                        ) : (
                                            'Mark as Complete'
                                        )}
                                    </button>
                                    {currentChapter < chapters.length - 1 && (
                                        <button
                                            onClick={() => seekToChapter(currentChapter + 1)}
                                            className="px-6 py-3 bg-foreground text-background rounded-2xl transition-all font-black hover:scale-105 active:scale-95 shadow-xl"
                                        >
                                            Next Lecture
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - Course Content & Notes */}
                <div className={`glass border-l border-border/50 transition-all duration-500 overflow-hidden ${sidebarOpen ? 'w-[450px]' : 'w-0'
                    }`}>
                    <div className="h-full flex flex-col">
                        {/* Sidebar Tabs */}
                        <div className="flex p-2 gap-2 bg-card/30 backdrop-blur-xl border-b border-border/50">
                            {[
                                { id: 'chapters', icon: ListOrdered, label: 'Chapters' },
                                { id: 'notes', icon: StickyNote, label: 'Smart Notes' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSidebarTab(tab.id as any)}
                                    className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-3 text-sm ${sidebarTab === tab.id
                                        ? 'bg-primary text-white glow-primary'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {sidebarTab === 'chapters' ? (
                            <div className="flex flex-col h-full overflow-hidden">
                                {/* Sidebar Header */}
                                <div className="p-4 border-b border-border/50 space-y-4">
                                    <div>
                                        <h2 className="text-lg font-black tracking-tight mb-0.5">Course Content</h2>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Build your curriculum</p>
                                    </div>

                                    {/* URL Input */}
                                    <div className="flex gap-2">
                                        <div className="relative group flex-1">
                                            <input
                                                type="text"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                placeholder="YouTube URL..."
                                                className="w-full px-3 py-2 bg-secondary border border-border/50 rounded-xl text-foreground placeholder-muted-foreground/50 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm font-medium"
                                                onKeyPress={(e) => e.key === 'Enter' && handleFetchChapters()}
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleFetchChapters()}
                                            disabled={loading}
                                            className="px-4 py-2 bg-foreground text-background hover:opacity-90 rounded-xl font-black transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs whitespace-nowrap"
                                        >
                                            {loading ? (
                                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-background border-t-transparent"></div>
                                            ) : (
                                                <span>Load</span>
                                            )}
                                        </button>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3">
                                            <span className="text-destructive text-sm font-bold">⚠️ {error}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Chapters List */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                    {chapters.length > 0 ? (
                                        chapters.map((chapter, index) => {
                                            const isCompleted = videoProgress?.completedChapters.includes(index);
                                            const isCurrent = currentChapter === index;

                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => seekToChapter(index)}
                                                    className={`w-full group text-left relative p-3 rounded-2xl transition-all duration-300 border ${isCurrent
                                                        ? 'bg-primary/10 border-primary shadow-lg ring-1 ring-primary/50'
                                                        : isCompleted
                                                            ? 'bg-accent/5 border-accent/20 hover:bg-accent/10'
                                                            : 'bg-card/40 border-border/30 hover:border-primary/30 hover:bg-card/60'
                                                        }`}
                                                >
                                                    <div className="flex items-start space-x-4">
                                                        <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-all ${isCompleted
                                                            ? 'bg-accent text-white glow-accent'
                                                            : isCurrent
                                                                ? 'bg-primary text-white glow-primary scale-110'
                                                                : 'bg-secondary text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                                                            }`}>
                                                            {isCompleted ? (
                                                                <CheckCircle2 className="w-4 h-4" />
                                                            ) : isCurrent ? (
                                                                <Play className="w-4 h-4 fill-current" />
                                                            ) : (
                                                                index + 1
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h4 className={`font-black text-sm mb-1.5 line-clamp-2 leading-snug transition-colors ${isCurrent ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                                                {chapter.title}
                                                            </h4>
                                                            <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                                                                <span className="flex items-center space-x-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span>{chapter.time}</span>
                                                                </span>
                                                                {isCompleted && (
                                                                    <>
                                                                        <div className="w-1 h-1 rounded-full bg-accent/50"></div>
                                                                        <span className="text-accent">Lecture Mastered</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            )
                                        })
                                    ) : (
                                        <div className="flex items-center justify-center h-48 py-12 px-8">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-secondary rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border border-border/50">
                                                    <BookOpen className="w-8 h-8 text-muted-foreground/50" />
                                                </div>
                                                <p className="text-muted-foreground text-sm font-bold">Curriculum Empty</p>
                                                <p className="text-muted-foreground/50 text-[10px] uppercase tracking-widest mt-1">Add URL to begin</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Progress Summary Footer */}
                                {chapters.length > 0 && (
                                    <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-2xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="space-y-1">
                                                <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Overall Mastery</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl font-black text-primary">{progressPercentage}%</span>
                                                    <div className="px-2 py-0.5 glass-pill rounded-full text-[10px] font-black text-accent border-accent/20">LEVEL UP</div>
                                                </div>
                                            </div>
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                                <BarChart3 className="w-6 h-6 text-primary" />
                                            </div>
                                        </div>

                                        <div className="w-full bg-secondary rounded-full h-2 mb-6 overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full transition-all duration-1000 glow-primary"
                                                style={{ width: `${progressPercentage}%` }}
                                            ></div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-secondary/50 p-3 rounded-2xl border border-border/50">
                                                <div className="text-[10px] font-black text-muted-foreground uppercase mb-1">Lectures</div>
                                                <div className="text-lg font-black">{videoProgress?.completedChapters.length || 0} <span className="text-muted-foreground/40 text-sm">/ {chapters.length}</span></div>
                                            </div>
                                            <div className="bg-secondary/50 p-3 rounded-2xl border border-border/50">
                                                <div className="text-[10px] font-black text-muted-foreground uppercase mb-1">Status</div>
                                                <div className="text-sm font-black text-primary uppercase tracking-wider">{progressPercentage === 100 ? 'Mastered' : 'Evolving'}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <NotesBookmarks
                                    videoId={videoId}
                                    currentChapter={currentChapter}
                                    chapters={chapters}
                                    onSeekTo={seekToTimestamp}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add YouTube types to window
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}
