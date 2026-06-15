'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import NotesBookmarks from '@/components/NotesBookmarks';
import {
    Play,
    Clock,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Search,
    ListOrdered,
    Video,
    Layout,
    StickyNote,
    BarChart3,
    Star,
    Menu,
    X,
    Home,
    BookOpen,
    TrendingUp
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface Chapter {
    title: string;
    time: string;
    url: string;
    timestamp: number;
    videoId?: string;
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

const formatTimeClient = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
        return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
};
export default function YouTubeCoursePlayer() {
    const { user } = useUser();
    const searchParams = useSearchParams();
    const [url, setUrl] = useState('');
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [videoId, setVideoId] = useState('');
    const [playingVideoId, setPlayingVideoId] = useState('');
    const [progress, setProgress] = useState<ProgressData>({});
    const [currentChapter, setCurrentChapter] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [playerReady, setPlayerReady] = useState(false);
    const [videoTitle, setVideoTitle] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [sidebarTab, setSidebarTab] = useState<'chapters' | 'notes'>('chapters');
    const [isPlaylistCourse, setIsPlaylistCourse] = useState(false);

    const playerRef = useRef<any>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Refs for closure-safe access in callbacks
    const currentChapterRef = useRef(0);
    const chaptersRef = useRef<Chapter[]>([]);
    const isPlaylistCourseRef = useRef(false);
    const videoIdRef = useRef('');
    const progressRef = useRef<ProgressData>({});

    // Update refs whenever state changes
    useEffect(() => { currentChapterRef.current = currentChapter; }, [currentChapter]);
    useEffect(() => { chaptersRef.current = chapters; }, [chapters]);
    useEffect(() => { isPlaylistCourseRef.current = isPlaylistCourse; }, [isPlaylistCourse]);
    useEffect(() => { videoIdRef.current = videoId; }, [videoId]);
    useEffect(() => { progressRef.current = progress; }, [progress]);

    // Load progress from localStorage and MongoDB
    useEffect(() => {
        const initializeProgress = async () => {
            // First load from localStorage
            const savedProgress = localStorage.getItem('youtube-course-progress');
            if (savedProgress) {
                setProgress(JSON.parse(savedProgress));
            }

            // Check for video or playlist IDs in URL parameters
            const videoIdParam = searchParams.get('v');
            const playlistIdParam = searchParams.get('list');
            const idToLoad = playlistIdParam || videoIdParam;

            if (idToLoad && user) {
                // Load progress from MongoDB for this ID
                await loadProgressForVideo(idToLoad);

                const youtubeUrl = playlistIdParam
                    ? `https://www.youtube.com/playlist?list=${playlistIdParam}`
                    : `https://www.youtube.com/watch?v=${videoIdParam}`;

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
        // We now save even if progress[videoId] isn't fully initialized to ensure TITLE is saved
        if (videoId && chapters.length > 0) {
            saveTimeoutRef.current = setTimeout(() => {
                saveProgressToDatabase();
            }, 2000);
        }
    }, [progress, videoId, chapters, videoTitle, playingVideoId]);

    const loadProgressForVideo = async (videoId: string) => {
        try {
            const response = await fetch('/api/user-courses');
            if (response.ok) {
                const data = await response.json();
                const course = data.courses.find((c: any) => c.videoId === videoId);

                if (course && course.progress) {
                    console.log('Loaded progress from MongoDB for video:', videoId, course.progress);
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
                console.log('Progress saved to database');
            }
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const extractIds = (url: string) => {
        const videoMatch = url.match(
            /(?:v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
        );
        const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);

        // Fix: Also check if v= contains a playlist ID (starts with PL)
        let pId = playlistMatch ? playlistMatch[1] : null;
        if (!pId) {
            const vParamMatch = url.match(/[?&]v=(PL[a-zA-Z0-9_-]+)/);
            if (vParamMatch) pId = vParamMatch[1];
        }

        return {
            videoId: (videoMatch && (!pId || !videoMatch[0].includes(pId))) ? videoMatch[1] : null,
            playlistId: pId
        };
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
            const { videoId: vId, playlistId: pId } = extractIds(targetUrl);

            if (!vId && !pId) {
                throw new Error('Invalid YouTube URL. Please provide a video or playlist link.');
            }

            const fetchBody = pId ? { playlistId: pId } : { videoId: vId };
            const idToUse = pId || vId || '';
            setVideoId(idToUse);

            const response = await fetch('/api/youtube-chapters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fetchBody),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch course content');
            }

            const data = await response.json();
            const fetchedTitle = data.title || 'YouTube Course';
            setVideoTitle(fetchedTitle);
            setIsPlaylistCourse(!!data.isPlaylist);

            const fetchedChapters = data.chapters || [];

            if (fetchedChapters.length > 0) {
                const chaptersWithTimestamps = fetchedChapters.map((chapter: Chapter) => ({
                    ...chapter,
                    timestamp: parseTimeToSeconds(chapter.time)
                }));
                setChapters(chaptersWithTimestamps);

                // Determine which video to start with
                let initialVideoId = vId;
                let initialChapterIdx = 0;

                // Priority 1: Video ID explicitly in the URL
                if (vId) {
                    const idx = chaptersWithTimestamps.findIndex((c: Chapter) => c.videoId === vId);
                    if (idx !== -1) initialChapterIdx = idx;
                }
                // Priority 2: Resume from progress if it's a playlist
                else if (data.isPlaylist && progressRef.current[idToUse]) {
                    const resumeChapter = progressRef.current[idToUse].lastWatchedChapter || 0;
                    if (chaptersWithTimestamps[resumeChapter]) {
                        initialChapterIdx = resumeChapter;
                        initialVideoId = chaptersWithTimestamps[resumeChapter].videoId || null;
                    }
                }
                // Priority 3: Default to first video
                if (!initialVideoId && chaptersWithTimestamps[0].videoId) {
                    initialVideoId = chaptersWithTimestamps[0].videoId;
                }

                if (initialVideoId) setPlayingVideoId(initialVideoId);
                setCurrentChapter(initialChapterIdx);
                currentChapterRef.current = initialChapterIdx;

                setPlayerReady(true);
            } else {
                setError('Generating chapters...');
                setChapters([]);
                if (!data.isPlaylist) {
                    setPlayingVideoId(idToUse);
                    setPlayerReady(true);
                }
            }

            // If we have a real title, save it immediately
            if (fetchedTitle !== 'YouTube Course') {
                saveProgressToDatabase();
            }

            // Set current chapter from progress if it exists
            if (progress[idToUse]) {
                const resumeChapter = progress[idToUse].lastWatchedChapter || 0;
                console.log('Will resume from chapter:', resumeChapter);
                setCurrentChapter(resumeChapter);
                currentChapterRef.current = resumeChapter;

                // If it's a playlist, make sure we load the correct video for this chapter
                if (data.isPlaylist && fetchedChapters[resumeChapter]?.videoId) {
                    setPlayingVideoId(fetchedChapters[resumeChapter].videoId);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const initializeYouTubePlayer = () => {
        if (!playingVideoId || !window.YT) return;

        if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
            console.log('Loading next video:', playingVideoId);
            playerRef.current.loadVideoById(playingVideoId);
            return;
        }

        console.log('🏗️ Creating new player for:', playingVideoId);
        playerRef.current = new window.YT.Player('youtube-player', {
            videoId: playingVideoId,
            playerVars: {
                playsinline: 1,
                rel: 0,
                modestbranding: 1,
                autoplay: 1,
                origin: window.location.origin,
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
            },
        });
    };

    const onPlayerReady = (event: any) => {
        const vid = videoIdRef.current;
        const chaps = chaptersRef.current;
        const isPlaylist = isPlaylistCourseRef.current;

        // Resume from last watched chapter
        if (progress[vid] && chaps.length > 0) {
            const lastChapter = progress[vid].lastWatchedChapter || 0;
            if (chaps[lastChapter]) {
                if (isPlaylist) {
                    // For playlists, we already set the correct videoId in handleFetchChapters
                } else {
                    console.log('Resuming single video from chapter', lastChapter);
                    playerRef.current.seekTo(chaps[lastChapter].timestamp, true);
                    setCurrentChapter(lastChapter);
                }
            }
        }
        startProgressTracking();
    };

    const onPlayerStateChange = (event: any) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            
            if (chaptersRef.current.length === 0 && !isPlaylistCourseRef.current && playerRef.current && typeof playerRef.current.getDuration === 'function') {
                const duration = playerRef.current.getDuration();
                if (duration > 0) {
                    const newChapters: Chapter[] = [];
                    const interval = 300; // 5 minutes
                    let currentTime = 0;
                    let chapterIndex = 1;
                    while (currentTime < duration) {
                        newChapters.push({
                            title: `Chapter ${chapterIndex}`,
                            time: formatTimeClient(currentTime * 1000),
                            url: `https://youtube.com/watch?v=${videoIdRef.current}&t=${currentTime}`,
                            timestamp: currentTime,
                            videoId: videoIdRef.current
                        });
                        currentTime += interval;
                        chapterIndex++;
                    }
                    if (newChapters.length > 0) {
                        setChapters(newChapters);
                        chaptersRef.current = newChapters;
                        setError('');

                        const savedProgress = progressRef.current[videoIdRef.current];
                        if (savedProgress && savedProgress.lastWatchedChapter > 0) {
                            const resumeChapter = savedProgress.lastWatchedChapter;
                            if (newChapters[resumeChapter]) {
                                console.log('Resuming auto-generated video from chapter', resumeChapter);
                                setCurrentChapter(resumeChapter);
                                currentChapterRef.current = resumeChapter;
                                playerRef.current.seekTo(newChapters[resumeChapter].timestamp, true);
                            }
                        }

                        setTimeout(() => {
                            if (videoIdRef.current) saveProgressToDatabase();
                        }, 1000);
                    }
                }
            }

            startProgressTracking();
        } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
            stopProgressTracking();
        } else if (event.data === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            stopProgressTracking();

            const isPlaylist = isPlaylistCourseRef.current;
            const currentChap = currentChapterRef.current;
            const chaps = chaptersRef.current;

            if (isPlaylist) {
                console.log('Video ended, auto-advancing from chapter:', currentChap);
                // Auto-mark as completed
                markChapterCompleted(currentChap, true);

                if (currentChap < chaps.length - 1) {
                    setTimeout(() => seekToChapter(currentChap + 1), 1000);
                }
            } else {
                // For single video, just mark last chapter as complete if appropriate
                markChapterCompleted(currentChap, true);
            }
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

    const triggerCelebration = (isCourseComplete: boolean, chapterTitle?: string) => {
        if (isCourseComplete) {
            toast.success('🎉 GOAL ACHIEVED! COURSE COMPLETED!', {
                description: `You've mastered: ${videoTitle} 🏆`,
                duration: 8000,
                style: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                    color: 'white',
                    border: 'none',
                    fontWeight: 'bold',
                }
            });

            // Extra big confetti for course completion
            const end = Date.now() + (3 * 1000);
            const colors = ['#6366f1', '#06b6d4', '#22c55e', '#f59e0b', '#ec4899'];

            (function frame() {
                confetti({
                    particleCount: 12,
                    angle: 60,
                    spread: 80,
                    origin: { x: 0, y: 0.65 },
                    colors: colors,
                    scalar: 2.2, // Massive particles
                    ticks: 200,
                });
                confetti({
                    particleCount: 12,
                    angle: 120,
                    spread: 80,
                    origin: { x: 1, y: 0.65 },
                    colors: colors,
                    scalar: 2.2, // Massive particles
                    ticks: 200,
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        } else {
            toast.success('Chapter Completed! 🎯', {
                description: `Great job! Completed: ${chapterTitle || 'current lecture'}`,
                duration: 4000,
                style: {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                    color: 'white',
                    border: 'none',
                    fontWeight: 'medium',
                }
            });

            confetti({
                particleCount: 250, // More particles
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#06b6d4', '#22c55e'],
                scalar: 1.5, // 50% larger particles
            });
        }
    };

    const trackProgress = () => {
        if (!playerRef.current || chapters.length === 0) return;

        const currentTime = playerRef.current.getCurrentTime();

        // Find current chapter based on timestamp (only for single-video courses)
        let newCurrentChapter = currentChapter;

        if (!isPlaylistCourse) {
            for (let i = chapters.length - 1; i >= 0; i--) {
                if (currentTime >= chapters[i].timestamp) {
                    newCurrentChapter = i;
                    break;
                }
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

                    // Trigger celebration if new chapters were completed
                    if (newCompletedChapters.length > videoProgress.completedChapters.length) {
                        const newlyCompleted = newCompletedChapters.filter(idx => !videoProgress.completedChapters.includes(idx));
                        const latestChapterIdx = Math.max(...newlyCompleted);
                        triggerCelebration(progressPercentage === 100, chapters[latestChapterIdx]?.title);
                    }

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
        if (!chapters[chapterIndex]) return;

        if (isPlaylistCourse && chapters[chapterIndex].videoId) {
            // Load new video if it's a playlist
            setPlayingVideoId(chapters[chapterIndex].videoId!);
            setCurrentChapter(chapterIndex);
        } else if (playerRef.current) {
            // Seek within same video if it's a normal course
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

    const markChapterCompleted = (chapterIndex: number, forceStatus?: boolean) => {
        if (!videoId) return;

        setProgress(prev => {
            const videoProgress = prev[videoId] || {
                completedChapters: [],
                lastWatchedChapter: -1,
                progressPercentage: 0,
                totalWatchTime: 0,
                timestamp: Date.now()
            };

            const isCurrentlyCompleted = videoProgress.completedChapters.includes(chapterIndex);
            const shouldBeCompleted = forceStatus !== undefined ? forceStatus : !isCurrentlyCompleted;

            let newCompletedChapters;
            if (shouldBeCompleted) {
                newCompletedChapters = [...new Set([...videoProgress.completedChapters, chapterIndex])];
            } else {
                newCompletedChapters = videoProgress.completedChapters.filter(idx => idx !== chapterIndex);
            }

            const progressPercentage = Math.round((newCompletedChapters.length / chapters.length) * 100);

            // Trigger gamification effects only on newly completed chapters
            if (shouldBeCompleted && !isCurrentlyCompleted) {
                triggerCelebration(progressPercentage === 100, chapters[chapterIndex]?.title);
            }

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
    }, [playingVideoId, playerReady]);

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="flex h-14 items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-1">
                        <Link href="/" className="flex items-center gap-2.5 pr-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background">
                                <img src="/newlogo.png" alt="" className="h-5 w-5 object-contain" />
                            </span>
                            <span className="hidden text-sm font-semibold tracking-tight sm:inline">CourseTube</span>
                        </Link>
                        <Link href="/profile" className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex">
                            My courses
                        </Link>
                        <Link href="/explore" className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex">
                            Explore
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        {videoTitle && (
                            <h1 className="hidden max-w-xs truncate text-sm font-medium text-foreground lg:block">
                                {videoTitle}
                            </h1>
                        )}

                        {chapters.length > 0 && (
                            <div className="hidden items-center gap-2.5 rounded-md border border-border bg-card px-3 py-1.5 sm:flex">
                                <BarChart3 className="h-4 w-4 text-primary" />
                                <span className="text-xs font-medium text-muted-foreground">{progressPercentage}%</span>
                                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all duration-500"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <ThemeToggle />

                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Toggle sidebar"
                        >
                            {sidebarOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex h-[calc(100vh-56px)]">
                {/* Main Video Area */}
                <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'mr-0' : 'mr-0'}`}>
                    {/* Video Player */}
                    <div className="flex-1 bg-black relative">
                        {playerReady ? (
                            <div id="youtube-player" className="w-full h-full"></div>
                        ) : chapters.length > 0 ? (
                            <div className="flex h-full items-center justify-center bg-black">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                    <p className="text-sm font-medium text-white/70">Loading your course...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center bg-black px-6">
                                <div className="max-w-md text-center">
                                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <Play className="ml-0.5 h-7 w-7" />
                                    </span>
                                    <h3 className="mt-6 text-xl font-semibold text-white">Ready to learn?</h3>
                                    <p className="mt-2 text-sm text-white/60">
                                        Paste a YouTube video or playlist URL in the sidebar to start your course.
                                    </p>
                                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40">
                                        <Star className="h-3.5 w-3.5" />
                                        <span>Track progress · Resume anytime · Take notes</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Course Info Bar */}
                    {chapters.length > 0 && chapters[currentChapter] && (
                        <div className="border-t border-border bg-background px-6 py-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1.5 flex items-center gap-3">
                                        <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                            Lecture {currentChapter + 1} of {chapters.length}
                                        </span>
                                        {videoProgress?.completedChapters.includes(currentChapter) && (
                                            <span className="flex items-center gap-1 text-xs font-medium text-success">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Completed
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="truncate text-base font-semibold">
                                        {chapters[currentChapter].title}
                                    </h3>
                                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            {chapters[currentChapter].time}
                                        </span>
                                        <span>·</span>
                                        <span>{videoProgress?.completedChapters.length || 0} of {chapters.length} completed</span>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    {currentChapter > 0 && (
                                        <button
                                            onClick={() => seekToChapter(currentChapter - 1)}
                                            className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                        >
                                            Previous
                                        </button>
                                    )}
                                    <button
                                        onClick={() => markChapterCompleted(currentChapter)}
                                        className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${videoProgress?.completedChapters.includes(currentChapter)
                                            ? 'bg-success text-white hover:opacity-90'
                                            : 'border border-border bg-background hover:bg-muted'
                                            }`}
                                    >
                                        {videoProgress?.completedChapters.includes(currentChapter) ? (
                                            <span className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Completed
                                            </span>
                                        ) : (
                                            'Mark complete'
                                        )}
                                    </button>
                                    {currentChapter < chapters.length - 1 && (
                                        <button
                                            onClick={() => seekToChapter(currentChapter + 1)}
                                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
                                        >
                                            Next
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - Course Content & Notes */}
                <div className={`border-l border-border bg-background transition-all duration-300 overflow-hidden ${sidebarOpen ? 'w-96' : 'w-0'
                    }`}>
                    <div className="flex h-full flex-col">
                        {/* Sidebar Tabs */}
                        <div className="flex border-b border-border">
                            <button
                                onClick={() => setSidebarTab('chapters')}
                                className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${sidebarTab === 'chapters'
                                    ? 'border-b-2 border-primary text-foreground'
                                    : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <ListOrdered className="h-4 w-4" />
                                Chapters
                            </button>
                            <button
                                onClick={() => setSidebarTab('notes')}
                                className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${sidebarTab === 'notes'
                                    ? 'border-b-2 border-primary text-foreground'
                                    : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <StickyNote className="h-4 w-4" />
                                Notes
                            </button>
                        </div>

                        {/* Tab Content */}
                        {sidebarTab === 'chapters' ? (
                            <>
                                {/* Sidebar Header */}
                                <div className="border-b border-border p-4">
                                    <h2 className="mb-2 text-sm font-semibold">Course content</h2>

                                    {/* URL Input */}
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="Paste a YouTube URL..."
                                            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                                            onKeyPress={(e) => e.key === 'Enter' && handleFetchChapters()}
                                        />
                                        <button
                                            onClick={() => handleFetchChapters()}
                                            disabled={loading}
                                            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                    Loading...
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="h-4 w-4" />
                                                    Load course
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {error && (
                                        <div className={`mt-2 rounded-md border p-2 ${error === 'Generating chapters...' ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                                            <p className={`text-xs font-medium ${error === 'Generating chapters...' ? 'text-success' : 'text-destructive'}`}>
                                                {error}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Course Stats */}
                                {chapters.length > 0 && (
                                    <div className="border-b border-border px-4 py-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center">
                                                <div className="text-lg font-semibold">{chapters.length}</div>
                                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Lectures</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-semibold text-primary">
                                                    {videoProgress?.completedChapters.length || 0}
                                                </div>
                                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Completed</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Chapters List */}
                                <div className="flex-1 overflow-y-auto min-h-0">
                                    {chapters.length > 0 ? (
                                        <div className="p-2 space-y-1">
                                            {chapters.map((chapter, index) => {
                                                const isCompleted = videoProgress?.completedChapters.includes(index);
                                                const isCurrent = currentChapter === index;

                                                return (
                                                    <div
                                                        key={index}
                                                        onClick={() => seekToChapter(index)}
                                                        className={`group relative cursor-pointer rounded-lg border p-3 transition-colors ${isCurrent
                                                            ? 'border-primary/40 bg-primary/5'
                                                            : 'border-transparent hover:border-border hover:bg-muted/60'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            {/* Lecture Number / Status Icon */}
                                                            <div className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium ${isCompleted
                                                                ? 'bg-success text-white'
                                                                : isCurrent
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'border border-border bg-muted text-muted-foreground'
                                                                }`}>
                                                                {isCompleted ? (
                                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                                ) : isCurrent ? (
                                                                    <Play className="ml-0.5 h-3 w-3" />
                                                                ) : (
                                                                    index + 1
                                                                )}
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <h4 className={`mb-0.5 line-clamp-2 text-sm leading-snug ${isCurrent ? 'font-semibold text-foreground' : 'font-medium text-foreground/90'
                                                                    }`}>
                                                                    {chapter.title}
                                                                </h4>
                                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>{chapter.time}</span>
                                                                </div>
                                                            </div>

                                                            {!isCurrent && (
                                                                <ChevronRight className="h-4 w-4 self-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full p-8">
                                            <div className="text-center">
                                                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                                <p className="text-gray-400 text-sm">No lectures yet</p>
                                                <p className="text-gray-500 text-xs mt-1">Add a YouTube URL to get started</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Progress Summary Footer */}
                                {chapters.length > 0 && (
                                    <div className="p-4 border-t border-border-theme bg-background transition-colors duration-300">
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <span className="text-slate-500 dark:text-slate-400 font-medium">Your Progress</span>
                                                <span className="text-indigo-500 dark:text-indigo-400 font-bold">{progressPercentage}%</span>
                                            </div>
                                            <div className="w-full bg-card-theme rounded-full h-1.5">
                                                <div
                                                    className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-1.5 rounded-full transition-all duration-500"
                                                    style={{ width: `${progressPercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                                            <div className="bg-surface-theme p-2 rounded border border-border-theme">
                                                <div className="text-slate-500 mb-0.5">Completed</div>
                                                <div className="text-foreground font-semibold">
                                                    {videoProgress?.completedChapters.length || 0}/{chapters.length}
                                                </div>
                                            </div>
                                            <div className="bg-surface-theme p-2 rounded border border-border-theme">
                                                <div className="text-slate-500 mb-0.5">Last Watched</div>
                                                <div className="text-foreground font-semibold">
                                                    {videoProgress?.timestamp ? new Date(videoProgress.timestamp).toLocaleDateString() : 'Never'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <NotesBookmarks
                                videoId={videoId}
                                currentChapter={currentChapter}
                                chapters={chapters}
                                onSeekTo={seekToTimestamp}
                            />
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
