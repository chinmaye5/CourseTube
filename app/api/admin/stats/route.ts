import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/admin';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const userLimit = parseInt(searchParams.get('userLimit') || '50', 10);
        const userSkip = parseInt(searchParams.get('userSkip') || '0', 10);

        // Validate pagination parameters
        if (userLimit < 1 || userLimit > 100) {
            return NextResponse.json(
                { error: 'User limit must be between 1 and 100' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('courses');
        const collection = db.collection('userProgress');

        // Total Courses across all users
        const totalCourses = await collection.countDocuments();

        // Unique users who have started a course
        const uniqueUsersInDb = await collection.distinct('userId');

        // Fetch users from Clerk with pagination
        const clerk = await clerkClient();
        const usersResponse = await clerk.users.getUserList({
            limit: userLimit,
            offset: userSkip,
        });
        const users = usersResponse.data;
        const totalCount = usersResponse.totalCount;

        // Optimize: Fetch all user courses in a single query instead of one per user
        const userIds = users.map(u => u.id);
        const allUserCourses = await collection.find({ userId: { $in: userIds } }).toArray();

        // Group courses by userId
        const coursesByUserId = new Map();
        allUserCourses.forEach(course => {
            if (!coursesByUserId.has(course.userId)) {
                coursesByUserId.set(course.userId, []);
            }
            coursesByUserId.get(course.userId).push(course);
        });

        const userStats = users.map((user) => {
            const userCourses = coursesByUserId.get(user.id) || [];

            return {
                id: user.id,
                name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.username || 'System User'),
                email: user.emailAddresses[0]?.emailAddress || 'No Email',
                courseCount: userCourses.length,
                courses: userCourses.slice(0, 10).map((c: any) => ({ // Limit to 10 courses per user for performance
                    title: c.title,
                    videoId: c.videoId,
                    progress: c.progress?.progressPercentage || 0,
                    lastAccessed: c.lastAccessed
                })),
                createdAt: user.createdAt,
            };
        });

        // Calculate DAU and MAU
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [dauCount, mauCount] = await Promise.all([
            collection.distinct('userId', { lastAccessed: { $gte: oneDayAgo } }),
            collection.distinct('userId', { lastAccessed: { $gte: thirtyDaysAgo } })
        ]);

        // Activity data for chart (DAU and courses accessed per day)
        const activityData = await collection.aggregate([
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: { $toDate: "$lastAccessed" }
                            }
                        },
                        userId: "$userId"
                    },
                    coursesCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    dau: { $sum: 1 },
                    courses: { $sum: "$coursesCount" }
                }
            },
            { $sort: { "_id": 1 } },
            { $limit: 30 }
        ]).toArray();

        return NextResponse.json({
            stats: {
                totalUsers: totalCount,
                totalCoursesEnrolled: totalCourses,
                activeUsers: userStats.filter(u => u.courseCount > 0).length,
                dau: dauCount.length,
                mau: mauCount.length,
            },
            userStats: userStats.sort((a, b) => b.courseCount - a.courseCount),
            userPagination: {
                total: totalCount,
                limit: userLimit,
                skip: userSkip,
                hasMore: userSkip + users.length < totalCount
            },
            activityData: activityData.map(item => ({
                date: item._id,
                courses: item.courses,
                dau: item.dau
            }))
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
