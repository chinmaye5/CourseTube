import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { deleteCourseSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const skip = parseInt(searchParams.get('skip') || '0', 10);

        // Validate pagination parameters
        if (limit < 1 || limit > 100) {
            return NextResponse.json(
                { error: 'Limit must be between 1 and 100' },
                { status: 400 }
            );
        }

        if (skip < 0) {
            return NextResponse.json(
                { error: 'Skip must be non-negative' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('courses');
        const collection = db.collection('userProgress');

        const userCourses = await collection
            .find({ userId })
            .sort({ lastAccessed: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        // Get total count for pagination metadata
        const totalCount = await collection.countDocuments({ userId });

        console.log('Found user courses:', userCourses.length, 'total:', totalCount);

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
            })),
            pagination: {
                total: totalCount,
                limit,
                skip,
                hasMore: skip + userCourses.length < totalCount
            }
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

        const body = await request.json();
        const validation = deleteCourseSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { videoId } = validation.data;

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