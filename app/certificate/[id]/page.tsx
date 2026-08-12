'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
    Award,
    Clock,
    Calendar,
    Share2,
    Download,
    Copy,
    ShieldCheck,
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
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    };

    const handleTwitterShare = () => {
        if (!certificate) return;
        const text = encodeURIComponent(`🎓 Excited to share that I just completed "${certificate.courseTitle}" on CourseTube!\n\nCheck out my official certificate:`);
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-foreground flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
                    <p className="mt-4 text-sm font-medium text-amber-700 dark:text-amber-300">Loading certificate...</p>
                </div>
            </div>
        );
    }

    if (error || !certificate) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-foreground flex flex-col">
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
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
            {/* Top Action Bar (Hidden on Print) */}
            <div className="no-print border-b border-amber-500/20 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                    <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                        <img src="/newlogo.png" alt="CourseTube" className="h-7 w-7 object-contain" />
                        <span className="font-bold text-slate-900 dark:text-white">CourseTube</span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
                            title="Copy link"
                        >
                            <Copy className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                            <span className="hidden sm:inline">Copy Link</span>
                        </button>

                        <button
                            onClick={handleLinkedInShare}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A66C2] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 shadow-sm"
                            title="Share on LinkedIn"
                        >
                            <Share2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">LinkedIn</span>
                        </button>

                        <button
                            onClick={handleTwitterShare}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:bg-slate-800"
                            title="Share on X"
                        >
                            <Share2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Post</span>
                        </button>

                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-4 py-1.5 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                        >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download PDF</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Viewing Section */}
            <main className="flex-1 py-6 px-4 sm:px-6 md:py-10 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center">
                <div className="w-full max-w-5xl flex flex-col items-center">
                    
                    {/* Verification Status Banner (Non-printable) */}
                    <div className="no-print w-full mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-4 text-amber-900 dark:text-amber-300 shadow-sm">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0" />
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Official & Verified Certificate of Achievement</h3>
                                <p className="text-xs text-slate-600 dark:text-amber-200/80">
                                    Issued to <strong className="font-semibold text-slate-900 dark:text-white">{certificate.userName}</strong> on {formatDate(certificate.issuedAt)}.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="rounded bg-amber-500/20 px-3 py-1 text-xs font-mono font-bold tracking-wider text-amber-800 dark:text-amber-300 border border-amber-500/30">
                                ID: {certificate.certificateId}
                            </span>
                        </div>
                    </div>

                    {/* PRESTIGE WHITE & GOLD CERTIFICATE CONTAINER */}
                    <div className="certificate-container relative overflow-hidden rounded-2xl bg-white text-slate-900 p-5 sm:p-8 print:p-4 shadow-2xl border-[6px] border-[#D4AF37] print:border-[5px] print:border-[#B8860B] w-full max-w-[960px]">
                        
                        {/* Metallic Gold Double Edge Frame */}
                        <div className="absolute inset-0 pointer-events-none border-2 border-amber-400/50 rounded-xl m-2" />
                        <div className="absolute inset-0 pointer-events-none border border-amber-600/30 rounded-lg m-3" />

                        {/* Deluxe Corner Filigrees */}
                        <div className="absolute top-3 left-3 h-8 w-8 border-t-4 border-l-4 border-[#D4AF37]" />
                        <div className="absolute top-3 right-3 h-8 w-8 border-t-4 border-r-4 border-[#D4AF37]" />
                        <div className="absolute bottom-3 left-3 h-8 w-8 border-b-4 border-l-4 border-[#D4AF37]" />
                        <div className="absolute bottom-3 right-3 h-8 w-8 border-b-4 border-r-4 border-[#D4AF37]" />

                        {/* Watermark Logo Background */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
                            <img src="/newlogo.png" alt="" className="h-[320px] w-[320px] object-contain grayscale" />
                        </div>

                        {/* Certificate Inner Framing */}
                        <div className="relative z-10 flex flex-col items-center text-center p-2 sm:p-4 rounded-lg">
                            
                            {/* CourseTube Logo Header */}
                            <div className="flex items-center justify-center gap-2 mb-1 print:mb-0.5">
                                <img src="/newlogo.png" alt="CourseTube Logo" className="h-10 sm:h-12 print:h-9 object-contain drop-shadow-sm" />
                            </div>

                            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#B8860B] uppercase">
                                CourseTube Learning Academy
                            </span>

                            <h1 className="mt-1 print:mt-0.5 text-2xl sm:text-3xl md:text-4xl print:text-2xl font-serif font-extrabold tracking-tight text-slate-900">
                                Certificate of Completion
                            </h1>

                            <div className="mt-1 flex items-center justify-center gap-2">
                                <div className="h-[1.5px] w-10 bg-gradient-to-r from-transparent via-[#D4AF37] to-amber-600" />
                                <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-amber-700 uppercase">
                                    Official Credential of Distinction
                                </span>
                                <div className="h-[1.5px] w-10 bg-gradient-to-l from-transparent via-[#D4AF37] to-amber-600" />
                            </div>

                            <p className="mt-2.5 print:mt-1 text-[11px] sm:text-xs tracking-widest text-slate-600 uppercase font-semibold">
                                This certificate is proudly presented to
                            </p>

                            {/* Student Name */}
                            <div className="mt-1 border-b-2 border-[#D4AF37] pb-1 px-6 inline-block max-w-xl">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl print:text-2xl font-serif font-bold tracking-tight text-[#B8860B]">
                                    {certificate.userName}
                                </h2>
                            </div>

                            <p className="mt-2.5 print:mt-1 text-[11px] sm:text-xs text-slate-600 max-w-md leading-relaxed">
                                for successfully completing all coursework, requirements, and lectures for
                            </p>

                            {/* Course Title */}
                            <div className="mt-1 my-0.5 max-w-2xl px-4">
                                <h3 className="text-base sm:text-xl print:text-base font-serif font-bold text-slate-900 leading-snug">
                                    &ldquo;{certificate.courseTitle}&rdquo;
                                </h3>
                            </div>

                            {/* Metrics Bar */}
                            <div className="mt-3.5 print:mt-2 grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-lg border-y border-amber-300 py-1.5 text-slate-800 bg-amber-50/40 rounded-sm">
                                <div className="flex flex-col items-center">
                                    <span className="text-[9px] sm:text-[10px] text-amber-800 font-semibold uppercase tracking-wider">Time Spent</span>
                                    <span className="mt-0.5 text-xs font-bold text-slate-900">
                                        {formatWatchTime(certificate.totalWatchTime)}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center border-x border-amber-300 px-2">
                                    <span className="text-[9px] sm:text-[10px] text-amber-800 font-semibold uppercase tracking-wider">Completed On</span>
                                    <span className="mt-0.5 text-xs font-bold text-slate-900">
                                        {formatDate(certificate.issuedAt)}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-[9px] sm:text-[10px] text-amber-800 font-semibold uppercase tracking-wider">Credential ID</span>
                                    <span className="mt-0.5 text-xs font-mono font-bold text-[#B8860B]">
                                        {certificate.certificateId}
                                    </span>
                                </div>
                            </div>

                            {/* Signatures & Prestige Gold Seal Footer */}
                            <div className="mt-4 print:mt-2 flex flex-row items-end justify-between w-full max-w-xl px-2">
                                
                                {/* Gold Seal Badge */}
                                <div className="flex items-center gap-2 text-left">
                                    <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-0.5 shadow-md">
                                        <div className="flex h-full w-full items-center justify-center rounded-full bg-white p-1.5 border border-amber-300">
                                            <img src="/newlogo.png" alt="Seal" className="h-6 w-6 object-contain" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-900 tracking-wide">VERIFIED CREDENTIAL</p>
                                        <p className="text-[9px] text-slate-500 font-mono">CourseTube Code</p>
                                        <p className="text-[9px] font-mono text-[#B8860B] font-bold">{certificate.certificateId}</p>
                                    </div>
                                </div>

                                {/* Authorized Signature */}
                                <div className="text-right">
                                    <div className="font-serif italic text-sm sm:text-base text-slate-900 font-bold tracking-wide border-b-2 border-[#D4AF37] pb-0.5">
                                        CourseTube Academy
                                    </div>
                                    <p className="mt-0.5 text-[9px] font-semibold text-slate-700">Authorized Credential Seal</p>
                                    <p className="text-[8px] text-slate-500">Issued by CourseTube Academy</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bottom CTA for Viewers (Non-printable) */}
                    <div className="no-print w-full max-w-5xl mt-8 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Want to earn certificates like this?</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            CourseTube turns any YouTube video or playlist into a full interactive course with tracking & certificates.
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-3">
                            <Link
                                href={`/courses?v=${certificate.videoId}`}
                                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:scale-105"
                            >
                                <BookOpen className="h-4 w-4" />
                                Take This Course
                            </Link>
                            <Link
                                href="/explore"
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                            >
                                Explore Courses
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* FLAWLESS SINGLE PAGE PRINT CSS */}
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 0 !important;
                    }
                    html, body {
                        width: 100% !important;
                        height: 100% !important;
                        max-height: 100vh !important;
                        overflow: hidden !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                        color: #0f172a !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    main {
                        padding: 0 !important;
                        margin: 0 !important;
                        background: #ffffff !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        height: 100vh !important;
                        width: 100vw !important;
                        overflow: hidden !important;
                    }
                    .certificate-container {
                        width: 88vw !important;
                        max-width: 900px !important;
                        height: auto !important;
                        max-height: 500px !important;
                        margin: auto !important;
                        padding: 0.75rem !important;
                        box-shadow: none !important;
                        border: 5px solid #D4AF37 !important;
                        background: #ffffff !important;
                        page-break-after: avoid !important;
                        page-break-before: avoid !important;
                        page-break-inside: avoid !important;
                        break-after: avoid !important;
                        break-before: avoid !important;
                        break-inside: avoid !important;
                        box-sizing: border-box !important;
                    }
                }
            `}</style>
        </div>
    );
}
