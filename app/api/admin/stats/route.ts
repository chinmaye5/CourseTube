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
        const client = await clientPromise;
        const db = client.db('courses');
        const collection = db.collection('userProgress');

        // Total Courses across all users
        const totalCourses = await collection.countDocuments();

        // Unique users who have started a course
        const uniqueUsersInDb = await collection.distinct('userId');

        // Fetch all users from Clerk
        const clerk = await clerkClient();
        const usersResponse = await clerk.users.getUserList({
            limit: 500, // Adjust as needed
        });
        const users = usersResponse.data;

        const userStats = await Promise.all(users.map(async (user) => {
            const userCourses = await collection.find({ userId: user.id }).toArray();

            return {
                id: user.id,
                name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.username || 'System User'),
                email: user.emailAddresses[0]?.emailAddress || 'No Email',
                courseCount: userCourses.length,
                courses: userCourses.map(c => ({
                    title: c.title,
                    videoId: c.videoId,
                    progress: c.progress?.progressPercentage || 0,
                    lastAccessed: c.lastAccessed
                })),
                createdAt: user.createdAt,
            };
        }));

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
            { $limit: 30 } // Extended to 30 days for better overview
        ]).toArray();

        return NextResponse.json({
            stats: {
                totalUsers: users.length,
                totalCoursesEnrolled: totalCourses,
                activeUsers: userStats.filter(u => u.courseCount > 0).length,
                dau: dauCount.length,
                mau: mauCount.length,
            },
            userStats: userStats.sort((a, b) => b.courseCount - a.courseCount),
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
