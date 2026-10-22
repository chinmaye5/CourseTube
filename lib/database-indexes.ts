import clientPromise from '@/lib/mongodb';

/**
 * Create all necessary database indexes for production performance
 * Run this script once to set up indexes in MongoDB
 */
export async function createDatabaseIndexes() {
    try {
        const client = await clientPromise;
        const db = client.db('courses');

        console.log('Creating database indexes...');

        // userProgress collection indexes
        await db.collection('userProgress').createIndex(
            { userId: 1, videoId: 1 },
            { unique: true, name: 'user_video_unique' }
        );
        console.log('✓ Created index on userProgress: { userId: 1, videoId: 1 } (unique)');

        await db.collection('userProgress').createIndex(
            { lastAccessed: -1 },
            { name: 'last_accessed_desc' }
        );
        console.log('✓ Created index on userProgress: { lastAccessed: -1 }');

        // notes collection indexes
        await db.collection('notes').createIndex(
            { userId: 1, videoId: 1 },
            { name: 'note_user_video' }
        );
        console.log('✓ Created index on notes: { userId: 1, videoId: 1 }');

        await db.collection('notes').createIndex(
            { userId: 1, videoId: 1, chapterIndex: 1 },
            { name: 'note_user_video_chapter' }
        );
        console.log('✓ Created index on notes: { userId: 1, videoId: 1, chapterIndex: 1 }');

        // bookmarks collection indexes
        await db.collection('bookmarks').createIndex(
            { userId: 1, videoId: 1 },
            { name: 'bookmark_user_video' }
        );
        console.log('✓ Created index on bookmarks: { userId: 1, videoId: 1 }');

        await db.collection('bookmarks').createIndex(
            { userId: 1, videoId: 1, timestamp: 1 },
            { name: 'bookmark_user_video_timestamp' }
        );
        console.log('✓ Created index on bookmarks: { userId: 1, videoId: 1, timestamp: 1 }');

        // certificates collection indexes
        await db.collection('certificates').createIndex(
            { certificateId: 1 },
            { unique: true, name: 'certificate_id_unique' }
        );
        console.log('✓ Created index on certificates: { certificateId: 1 } (unique)');

        await db.collection('certificates').createIndex(
            { userId: 1, videoId: 1 },
            { unique: true, name: 'certificate_user_video_unique' }
        );
        console.log('✓ Created index on certificates: { userId: 1, videoId: 1 } (unique)');

        // messages collection indexes (for contact form)
        await db.collection('messages').createIndex(
            { createdAt: -1 },
            { name: 'message_created_desc' }
        );
        console.log('✓ Created index on messages: { createdAt: -1 }');

        console.log('\n✅ All database indexes created successfully!');
        return { success: true };
    } catch (error) {
        console.error('❌ Error creating database indexes:', error);
        throw error;
    }
}
