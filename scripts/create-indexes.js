/**
 * Standalone script to create database indexes
 * Run with: node scripts/create-indexes.js
 * Make sure to set MONGODB_URI in your .env file
 */

require('dotenv').config({ path: '.env' });
const { MongoClient } = require('mongodb');

if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.error('Please set MONGODB_URI in your .env.local file');
    process.exit(1);
}

async function createIndexes() {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        console.log('✓ Connected to MongoDB');

        const db = client.db('courses');
        console.log('\nCreating database indexes...\n');

        // userProgress collection indexes
        try {
            await db.collection('userProgress').createIndex(
                { userId: 1, videoId: 1 },
                { unique: true, name: 'user_video_unique' }
            );
            console.log('✓ Created index on userProgress: { userId: 1, videoId: 1 } (unique)');
        } catch (e) {
            if (e.code === 85) {
                console.log('⚠ Index already exists on userProgress: { userId: 1, videoId: 1 }');
            } else {
                throw e;
            }
        }

        try {
            await db.collection('userProgress').createIndex(
                { lastAccessed: -1 },
                { name: 'last_accessed_desc' }
            );
            console.log('✓ Created index on userProgress: { lastAccessed: -1 }');
        } catch (e) {
            if (e.code === 85) {
                console.log('⚠ Index already exists on userProgress: { lastAccessed: -1 }');
            } else {
                throw e;
            }
        }

        // notes collection indexes
        try {
            await db.collection('notes').createIndex(
                { userId: 1, videoId: 1 },
                { name: 'note_user_video' }
            );
            console.log('✓ Created index on notes: { userId: 1, videoId: 1 }');
        } catch (e) {
            if (e.code === 85) {
                console.log('⚠ Index already exists on notes: { userId: 1, videoId: 1 }');
            } else {
                throw e;
            }
        }

        try {
            await db.collection('notes').createIndex(
                { userId: 1, videoId: 1, chapterIndex: 1 },
                { name: 'note_user_video_chapter' }
            );
            console.log('✓ Created index on notes: { userId: 1, videoId: 1, chapterIndex: 1 }');
        } catch (e) {
            if (e.code === 85) {
                console.log('⚠ Index already exists on notes: { userId: 1, videoId: 1, chapterIndex: 1 }');
            } else {
                throw e;
            }
        }

        // bookmarks collection indexes
        try {
            await db.collection('bookmarks').createIndex(
                { userId: 1, videoId: 1 },
                { name: 'bookmark_user_video' }
            );
            console.log('✓ Created index on bookmarks: { userId: 1, videoId: 1 }');
        } catch (e) {
            if (e.code === 85) {
                console.log('⚠ Index already exists on bookmarks: { userId: 1, videoId: 1 }');
            } else {
                throw e;
            }
        }

        try {
            await db.collection('bookmarks').createIndex(
                { userId: 1, videoId: 1, timestamp: 1 },
                { name: 'bookmark_user_video_timestamp' }
            );
            console.log('✓ Created index on bookmarks: { userId: 1, videoId: 1, timestamp: 1 }');
        } catch (e) {
            if (e.code === 85) {
                console.log('⚠ Index already exists on bookmarks: { userId: 1, videoId: 1, timestamp: 1 }');
            } else {
                throw e;
            }
        }

        // certificates collection indexes
        try {
            await db.collection('certificates').createIndex(
                { certificateId: 1 },
                { unique: true, name: 'certificate_id_unique' }
            );
            console.log('✓ Created index on certificates: { certificateId: 1 } (unique)');
        } catch (e) {
            if (e.code === 85) {
                console.log('⚠ Index already exists on certificates: { certificateId: 1 }');
            } else {
                throw e;
            }
        }

        try {
            await db.collection('certificates').createIndex(
                { userId: 1, videoId: 1 },
                { unique: true, name: 'certificate_user_video_unique' }
            );
            console.log('✓ Created index on certificates: { userId: 1, videoId: 1 } (unique)');
        } catch (e) {
            if (e.code === 85) {
                console.log('⚠ Index already exists on certificates: { userId: 1, videoId: 1 }');
            } else {
                throw e;
            }
        }

        // messages collection indexes
        try {
            await db.collection('messages').createIndex(
                { createdAt: -1 },
                { name: 'message_created_desc' }
            );
            console.log('✓ Created index on messages: { createdAt: -1 }');
        } catch (e) {
            if (e.code === 85) {
                console.log('⚠ Index already exists on messages: { createdAt: -1 }');
            } else {
                throw e;
            }
        }

        console.log('\n✅ All database indexes created successfully!');
    } catch (error) {
        console.error('\n❌ Error creating database indexes:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('\n✓ Connection closed');
    }
}

createIndexes();
