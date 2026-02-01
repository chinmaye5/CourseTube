// app/sign-in/[[...sign-in]]/page.tsx
'use client';

import { SignIn } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInPage() {
    const { isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isSignedIn) {
            router.push('/courses');
        }
    }, [isSignedIn, router]);

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        CourseTube
                    </Link>
                    <h1 className="text-3xl font-bold mt-4 text-white">Welcome back</h1>
                    <p className="text-slate-400 mt-2">Sign in to continue your learning journey</p>
                </div>

                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "mx-auto w-full",
                            card: "bg-[#0f172a] shadow-2xl rounded-2xl border border-[#334155]",
                            headerTitle: "text-2xl font-bold text-white",
                            headerSubtitle: "text-slate-400",
                            socialButtonsBlockButton: "bg-[#1e293b] border border-[#334155] hover:bg-[#334155] text-white",
                            socialButtonsBlockButtonText: "text-white",
                            formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 shadow-lg shadow-indigo-500/20",
                            footerActionLink: "text-indigo-400 hover:text-indigo-300",
                            formFieldLabel: "text-slate-300",
                            formFieldInput: "bg-[#020617] border-[#334155] text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
                            dividerLine: "bg-[#334155]",
                            dividerText: "text-slate-500",
                            footerText: "text-slate-400",
                            identityPreviewText: "text-white",
                            identityPreviewEditButtonIcon: "text-indigo-400",
                        }
                    }}
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                    redirectUrl="/courses"
                />
            </div>
        </div>
    );
}