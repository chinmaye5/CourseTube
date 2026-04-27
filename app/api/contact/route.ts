import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

import { isAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { email, message, name } = await request.json();

        if (!email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
