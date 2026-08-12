'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
    Award,
    CheckCircle2,
    Clock,
    Calendar,
    Share2,
    Download,
    Copy,
    ExternalLink,
    ShieldCheck,
    Sparkles,
    BookOpen,
    ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';

interface CertificateData {
    certificateId: string;
    userId: string;
    userName: string;
    videoId: string;
    courseTitle: string;
    totalWatchTime: number;
    issuedAt: string;
    completedAt: string;
}

export default function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [certificate, setCertificate] = useState<CertificateData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/certificates?id=${id}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error('Certificate not found. Please check the URL.');
                    }
                    throw new Error('Failed to load certificate');
                }
                const data = await res.json();
                setCertificate(data.certificate);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error fetching certificate');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCertificate();
        }
    }, [id]);

    const formatWatchTime = (seconds: number) => {
        if (!seconds || seconds <= 0) return 'Self-paced';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours} hr${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} min${minutes > 1 ? 's' : ''}` : ''}`;
        }
        return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleCopyLink = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl);
        toast.success('Certificate link copied to clipboard!', {
            description: 'You can now share this URL with anyone.',
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleLinkedInShare = () => {
        if (!certificate) return;
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(`Certificate of Completion: ${certificate.courseTitle}`);
        const summary = encodeURIComponent(`I've completed "${certificate.courseTitle}" on CourseTube!`);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };

    const handleTwitterShare = () => {
        if (!certificate) return;
        const text = encodeURIComponent(`🎓 Excited to share that I just completed "${certificate.courseTitle}" on CourseTube!\n\nCheck out my certificate:`);
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="mt-4 text-sm font-medium text-muted-foreground">Loading certificate...</p>
                </div>
            </div>
        );
    }

    if (error || !certificate) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
                        <Award className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Certificate Not Found</h1>
                    <p className="mt-2 text-muted-foreground max-w-md">
                        {error || 'This certificate link may be invalid or expired.'}
                    </p>
                    <Link
                        href="/"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Top Navigation Bar - Hidden on Print */}
            <div className="no-print border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-40">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                    <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
                        <img src="/newlogo.png" alt="CourseTube" className="h-6 w-6 object-contain" />
                        <span>CourseTube</span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                            title="Copy link"
                        >
                            <Copy className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Copy Link</span>
                        </button>

                        <button
                            onClick={handleLinkedInShare}
                            className="inline-flex items-center gap-1.5 rounded-md bg-[#0A66C2] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
                            title="Share on LinkedIn"
                        >
                            <Share2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">LinkedIn</span>
                        </button>

                        <button
                            onClick={handleTwitterShare}
                            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
                            title="Share on X (Twitter)"
                        >
                            <Share2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Post</span>
                        </button>

                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download / Print</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 py-8 px-4 sm:px-6 md:py-12 bg-slate-950/5 dark:bg-black/40">
                <div className="mx-auto max-w-5xl">
                    {/* Verification Status Banner (Non-printable) */}
                    <div className="no-print mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 shrink-0" />
                            <div>
                                <h3 className="text-sm font-semibold">Authentic & Verified Certificate</h3>
                                <p className="text-xs opacity-90">
                                    Issued to <strong className="font-semibold text-foreground">{certificate.userName}</strong> on {formatDate(certificate.issuedAt)}.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-xs font-mono font-medium tracking-wide">
                                ID: {certificate.certificateId}
                            </span>
                        </div>
                    </div>

                    {/* Certificate Card Container */}
                    <div className="certificate-container relative overflow-hidden rounded-2xl border-4 border-amber-500/40 bg-gradient-to-b from-card via-card to-background p-6 sm:p-12 shadow-2xl transition-all">
                        {/* Decorative Corner Ornaments */}
                        <div className="absolute top-3 left-3 h-12 w-12 border-t-2 border-l-2 border-amber-500/60" />
                        <div className="absolute top-3 right-3 h-12 w-12 border-t-2 border-r-2 border-amber-500/60" />
                        <div className="absolute bottom-3 left-3 h-12 w-12 border-b-2 border-l-2 border-amber-500/60" />
                        <div className="absolute bottom-3 right-3 h-12 w-12 border-b-2 border-r-2 border-amber-500/60" />

                        {/* Background Watermark Pattern */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
                            <Award className="h-[400px] w-[400px]" />
                        </div>

                        {/* Inner Frame */}
                        <div className="relative z-10 flex flex-col items-center text-center border-2 border-dashed border-amber-500/20 p-6 sm:p-10 rounded-xl">

                            {/* Header Logo & Badge */}
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-md">
                                    <Sparkles className="h-6 w-6" />
                                </span>
                            </div>
                            <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">
                                CourseTube Learning Academy
                            </span>

                            <h1 className="mt-4 text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground">
                                Certificate of Completion
                            </h1>

                            <p className="mt-4 text-xs sm:text-sm tracking-wide text-muted-foreground uppercase">
                                This certificate is proudly presented to
                            </p>

                            {/* Student Name */}
                            <div className="mt-3 border-b-2 border-amber-500/50 pb-2 px-6">
                                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-primary font-serif">
                                    {certificate.userName}
                                </h2>
                            </div>

                            <p className="mt-6 text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
                                for successfully completing the online learning course
                            </p>

                            {/* Course Title */}
                            <div className="mt-3 my-2 max-w-2xl">
                                <h3 className="text-xl sm:text-3xl font-bold text-foreground leading-snug">
                                    &ldquo;{certificate.courseTitle}&rdquo;
                                </h3>
                            </div>

                            {/* Metrics & Details Grid */}
                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl border-t border-b border-border py-4">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                                        <span>Time Spent</span>
                                    </div>
                                    <span className="mt-1 text-sm font-semibold text-foreground">
                                        {formatWatchTime(certificate.totalWatchTime)}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center border-y sm:border-y-0 sm:border-x border-border py-2 sm:py-0">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5 text-amber-500" />
                                        <span>Date Completed</span>
                                    </div>
                                    <span className="mt-1 text-sm font-semibold text-foreground">
                                        {formatDate(certificate.issuedAt)}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                                        <span>Certificate ID</span>
                                    </div>
                                    <span className="mt-1 text-xs font-mono font-bold tracking-wider text-amber-500">
                                        {certificate.certificateId}
                                    </span>
                                </div>
                            </div>

                            {/* Footer Seals & Verification Signature */}
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between w-full pt-4 gap-6">
                                <div className="text-left flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500">
                                        <Award className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">Verified & Recorded</p>
                                        <p className="text-[11px] text-muted-foreground">CourseTube Verified credential</p>
                                    </div>
                                </div>

                                <div className="text-center sm:text-right">
                                    <div className="font-serif italic text-lg text-foreground font-bold">
                                        CourseTube Academy
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">Authorized Signature</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bottom Call To Action for Public Viewers (Non-printable) */}
                    <div className="no-print mt-8 text-center rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="text-base font-semibold">Want to earn certificates like this?</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            CourseTube turns any YouTube video or playlist into an interactive course with progress tracking and certificates.
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-3">
                            <Link
                                href={`/courses?v=${certificate.videoId}`}
                                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                <BookOpen className="h-4 w-4" />
                                Take This Course
                            </Link>
                            <Link
                                href="/explore"
                                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                            >
                                Explore Courses
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Custom Print Styles */}
            <style jsx global>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    .certificate-container {
                        box-shadow: none !important;
                        border-color: #d97706 !important;
                        background: white !important;
                        page-break-inside: avoid !important;
                    }
                    @page {
                        size: landscape;
                        margin: 1cm;
                    }
                }
            `}</style>
        </div>
    );
}
