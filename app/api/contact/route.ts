import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

import { isAdmin } from '@/lib/admin';
import { contactSchema } from '@/lib/validation';
import { checkRateLimit, rateLimits } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = contactSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { email, message, name } = validation.data;

        // Rate limiting based on email to prevent spam
        const { success, remaining } = await checkRateLimit(
            email,
            rateLimits.contact.limit,
            rateLimits.contact.window
        );

        if (!success) {
            return NextResponse.json(
                { error: 'Too many messages. Please try again later.' },
                { status: 429, headers: { 'X-RateLimit-Remaining': remaining.toString() } }
            );
        }

        const client = await clientPromise;
        const db = client.db('courses');
        const collection = db.collection('messages');

        await collection.insertOne({
            email,
            message,
            name: name || 'Anonymous',
            createdAt: new Date(),
            status: 'unread'
        });

        return NextResponse.json({
            success: true
        });
    } catch (error) {
        console.error('Error saving message:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('courses');
        const collection = db.collection('messages');

        const messages = await collection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
