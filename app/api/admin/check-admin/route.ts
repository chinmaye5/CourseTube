import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { ADMIN_EMAIL } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ isAdmin: false }, { status: 401 });
        }

        const isAdmin = user.emailAddresses.some(
            (email) => email.emailAddress === ADMIN_EMAIL
        );

        return NextResponse.json({ isAdmin });
    } catch (error) {
        console.error('Error checking admin status:', error);
        return NextResponse.json({ isAdmin: false }, { status: 500 });
    }
}
