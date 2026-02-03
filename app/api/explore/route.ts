import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db('courses');
        const collection = db.collection('userProgress');

        // Aggregate unique courses based on videoId
        // This effectively creates a "Global Library" of all courses users have ever loaded
        const exploreCourses = await collection.aggregate([
            {
                $group: {
                    _id: "$videoId",
                    videoId: { $first: "$videoId" },
                    title: { $first: "$title" },
                    url: { $first: "$url" },
                    chapters: { $first: "$chapters" },
                    userCount: { $sum: 1 },
                    lastAdded: { $max: "$lastAccessed" }
                }
            },
            { $sort: { userCount: -1, lastAdded: -1 } },
            { $limit: 20 }
        ]).toArray();

        return NextResponse.json({
            courses: exploreCourses.map(course => ({
                videoId: course.videoId,
                title: course.title,
                url: course.url,
                chapters: course.chapters || [],
                userCount: course.userCount,
                lastAdded: course.lastAdded
            }))
        });
    } catch (error) {
        console.error('Error fetching explore courses:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
