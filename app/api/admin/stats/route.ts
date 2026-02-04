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

        // Activity data for chart (courses enrolled/accessed per day)
        const activityData = await collection.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: { $toDate: "$lastAccessed" }
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } },
            { $limit: 14 } // Last 2 weeks
        ]).toArray();

        return NextResponse.json({
            stats: {
                totalUsers: users.length,
                totalCoursesEnrolled: totalCourses,
                activeUsers: userStats.filter(u => u.courseCount > 0).length,
            },
            userStats: userStats.sort((a, b) => b.courseCount - a.courseCount),
            activityData: activityData.map(item => ({
                date: item._id,
                courses: item.count
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
