import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db('courses');
        const collection = db.collection('userProgress');

        const userCourses = await collection
            .find({ userId })
            .sort({ lastAccessed: -1 })
            .toArray();

        console.log('Found user courses:', userCourses.length);

        return NextResponse.json({
            courses: userCourses.map(course => ({
                videoId: course.videoId,
                url: course.url,
                title: course.title,
                chapters: course.chapters || [],
                lastAccessed: course.lastAccessed,
                progress: course.progress || {
                    completedChapters: [],
                    lastWatchedChapter: 0,
                    progressPercentage: 0,
                    totalWatchTime: 0,
                    timestamp: Date.now()
                }
            }))
        });
    } catch (error) {
        console.error('Error fetching user courses:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { videoId } = await request.json();

        if (!videoId) {
            return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('courses');
        const collection = db.collection('userProgress');

        const result = await collection.deleteOne({ userId, videoId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}