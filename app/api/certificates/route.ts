import { NextRequest, NextResponse } from 'next/server';
import { getAuth, currentUser } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { crypto } from 'next/dist/compiled/@edge-runtime/primitives';

// Helper to generate unique Certificate ID
function generateCertificateId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `CT-${code}`;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const certificateId = searchParams.get('id');
        const videoId = searchParams.get('videoId');

        const client = await clientPromise;
        const db = client.db('courses');
        const collection = db.collection('certificates');

        // Case 1: Public certificate lookup by certificateId
        if (certificateId) {
            const certificate = await collection.findOne({ certificateId });
            if (!certificate) {
                return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
            }
            return NextResponse.json({ certificate });
        }

        // Case 2: Authenticated check for user's certificate for a specific video
        if (videoId) {
            const { userId } = getAuth(request);
            if (!userId) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            const certificate = await collection.findOne({ userId, videoId });
            if (!certificate) {
                return NextResponse.json({ certificate: null });
            }
            return NextResponse.json({ certificate });
        }

        return NextResponse.json({ error: 'Certificate ID or Video ID required' }, { status: 400 });
    } catch (error) {
        console.error('Error fetching certificate:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { videoId, courseTitle, totalWatchTime, userName: bodyUserName } = body;

        if (!videoId) {
            return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
        }

        let userName = bodyUserName;
        if (!userName) {
            const user = await currentUser();
            if (user) {
                const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
                userName = name || user.username || user.emailAddresses[0]?.emailAddress || 'CourseTube Learner';
            } else {
                userName = 'CourseTube Learner';
            }
        }

        const client = await clientPromise;
        const db = client.db('courses');
        const collection = db.collection('certificates');

        // Check if certificate already exists for this user and video
        let existingCert = await collection.findOne({ userId, videoId });

        if (existingCert) {
            // Update metadata if course title or user name changed
            await collection.updateOne(
                { userId, videoId },
                {
                    $set: {
                        userName,
                        courseTitle: courseTitle || existingCert.courseTitle,
                        totalWatchTime: totalWatchTime || existingCert.totalWatchTime || 0,
                        updatedAt: new Date()
                    }
                }
            );

            existingCert = await collection.findOne({ userId, videoId });
            return NextResponse.json({ certificate: existingCert, isNew: false });
        }

        const newCert = {
            certificateId: generateCertificateId(),
            userId,
            userName,
            videoId,
            courseTitle: courseTitle || 'CourseTube Masterclass',
            totalWatchTime: totalWatchTime || 0,
            issuedAt: new Date(),
            completedAt: new Date()
        };

        await collection.insertOne(newCert);

        return NextResponse.json({ certificate: newCert, isNew: true });
    } catch (error) {
        console.error('Error creating certificate:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
