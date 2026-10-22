import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20', 10);
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

        // Get total count first
        const totalPipeline = [
            {
                $group: {
                    _id: "$videoId"
                }
            },
            {
                $count: "total"
            }
        ];

        const totalResult = await collection.aggregate(totalPipeline).toArray();
        const total = totalResult[0]?.total || 0;

        // Aggregate unique courses based on videoId with pagination
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
            { $skip: skip },
            { $limit: limit }
        ]).toArray();

        return NextResponse.json({
            courses: exploreCourses.map(course => ({
                videoId: course.videoId,
                title: course.title,
                url: course.url,
                chapters: course.chapters || [],
                userCount: course.userCount,
                lastAdded: course.lastAdded
            })),
            pagination: {
                total,
                limit,
                skip,
                hasMore: skip + exploreCourses.length < total
            }
        });
    } catch (error) {
        console.error('Error fetching explore courses:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
