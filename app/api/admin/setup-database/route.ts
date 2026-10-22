import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { createDatabaseIndexes } from '@/lib/database-indexes';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    // Only allow admin to run this
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const result = await createDatabaseIndexes();
        return NextResponse.json({
            success: true,
            message: 'Database indexes created successfully'
        });
    } catch (error) {
        console.error('Error creating database indexes:', error);
        return NextResponse.json(
            {
                error: 'Failed to create database indexes',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
