# CourseTube Production Deployment Guide

This guide covers all the steps to deploy CourseTube to production with the security and performance improvements implemented.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables

Set the following environment variables in your hosting platform (Vercel, Netlify, etc.):

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/courses

# Admin Configuration (IMPORTANT: Use ADMIN_EMAIL, not NEXT_PUBLIC_ADMIN_EMAIL)
ADMIN_EMAIL=admin@example.com

# Upstash Redis for Rate Limiting (Recommended)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

**Important Security Notes:**
- `ADMIN_EMAIL` must NOT have `NEXT_PUBLIC_` prefix - it's now server-side only
- Never commit environment variables to git
- Use different keys for production vs development

### 2. MongoDB Database Setup

Run the database index creation script before going live:

**Option A: Via API Endpoint (Easiest)**
```bash
# After deployment, as admin user:
curl -X POST https://your-domain.com/api/admin/setup-database
```

**Option B: Via Node Script**
```bash
# Set MONGODB_URI in your environment
node scripts/create-indexes.js
```

**Option C: Manual MongoDB Atlas**
Connect to your MongoDB Atlas cluster and run:

```javascript
// userProgress
db.userProgress.createIndex({ userId: 1, videoId: 1 }, { unique: true })
db.userProgress.createIndex({ lastAccessed: -1 })

// notes
db.notes.createIndex({ userId: 1, videoId: 1 })
db.notes.createIndex({ userId: 1, videoId: 1, chapterIndex: 1 })

// bookmarks
db.bookmarks.createIndex({ userId: 1, videoId: 1 })
db.bookmarks.createIndex({ userId: 1, videoId: 1, timestamp: 1 })

// certificates
db.certificates.createIndex({ certificateId: 1 }, { unique: true })
db.certificates.createIndex({ userId: 1, videoId: 1 }, { unique: true })

// messages
db.messages.createIndex({ createdAt: -1 })
```

### 3. Upstash Redis Setup (Recommended for Rate Limiting)

1. Create a free account at https://upstash.com/
2. Create a new Redis database
3. Copy the REST URL and Token
4. Add to your environment variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

**Note:** If you skip this, rate limiting will be disabled (fails open).

### 4. Clerk Configuration

Ensure your Clerk application is configured for production:
- Add your production domain to Clerk allowed origins
- Enable JWT templates if needed
- Configure proper redirect URLs

## 🚀 Deployment Steps

### Vercel Deployment (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Configure environment variables** in Vercel dashboard
3. **Deploy**
   ```bash
   vercel --prod
   ```
4. **Run database index creation** after first deployment
5. **Test critical flows** (see Testing section below)

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Set up reverse proxy** (nginx, Apache, etc.) with SSL

## 🧪 Post-Deployment Testing

### Critical Flows to Test

1. **Authentication**
   - Sign up as new user
   - Sign in
   - Sign out

2. **Course Loading**
   - Load a YouTube video
   - Load a YouTube playlist
   - Verify chapters are extracted correctly

3. **Progress Tracking**
   - Mark chapters as complete
   - Refresh page - verify progress persists
   - Check progress across different browsers

4. **Notes & Bookmarks**
   - Create a note
   - Edit a note
   - Delete a note
   - Create a bookmark
   - Verify they persist

5. **Rate Limiting**
   - Make multiple rapid requests to `/api/youtube-chapters`
   - Verify you get 429 status after limit
   - Check that normal users aren't affected

6. **Certificates**
   - Complete a course
   - Generate certificate
   - Verify certificate ID is secure (32-character hex)
   - Share certificate link and verify it works

7. **Admin Dashboard**
   - Access `/admin` with admin email
   - Verify stats load quickly
   - Test pagination on user list

8. **Pagination**
   - Load user courses with > 50 courses
   - Test explore page pagination
   - Verify pagination metadata is correct

### Security Verification

1. **Check that debug info is not exposed**
   - Open browser DevTools
   - Load a course
   - Check API response - should not contain `debug` field in production

2. **Verify admin email is not exposed**
   - View page source
   - Search for admin email - should not be present

3. **Test input validation**
   - Try submitting invalid data to forms
   - Verify proper error messages

## 📊 Monitoring & Maintenance

### Recommended Monitoring

1. **Error Tracking** - Add Sentry or similar
2. **Performance Monitoring** - Vercel Analytics is included
3. **Uptime Monitoring** - Use UptimeRobot or similar
4. **Database Monitoring** - MongoDB Atlas provides this

### Regular Maintenance Tasks

1. **Monitor MongoDB indexes** - Ensure they're being used
2. **Check rate limit logs** - Adjust limits if needed
3. **Review error logs** - Fix any issues that arise
4. **Update dependencies** - Run `npm audit fix` regularly

## 🔒 Security Checklist

- [x] Admin email changed from NEXT_PUBLIC_ to server-side only
- [x] Certificate IDs use cryptographically secure random generation
- [x] Debug info removed from production responses
- [x] Input validation added to all API endpoints with Zod
- [x] Rate limiting implemented on critical endpoints
- [x] Database indexes created for performance
- [x] Pagination added to prevent timeout issues
- [x] Admin stats endpoint optimized with pagination

## 🐛 Troubleshooting

### Rate Limiting Not Working

If rate limiting isn't active:
1. Check that `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set
2. Verify the Redis database is accessible
3. Check server logs for errors

### Database Performance Issues

If queries are slow:
1. Verify indexes were created successfully
2. Check MongoDB Atlas performance metrics
3. Consider adding more indexes based on query patterns

### YouTube Scraping Issues

If YouTube scraping fails:
1. Check rate limiting - you might be hitting YouTube's limits
2. The in-memory cache will help but consider implementing Redis cache
3. Monitor the `/api/youtube-chapters` endpoint logs

## 📝 Notes

- The application now requires MongoDB indexes for production performance
- Rate limiting is optional but highly recommended
- All console.log statements should be replaced with proper logging in production
- Consider implementing distributed caching (Redis) for YouTube chapter data to avoid rate limits

## 🎉 You're Production Ready!

After completing these steps, CourseTube is ready to handle real users with:
- ✅ Secure authentication and authorization
- ✅ Input validation to prevent attacks
- ✅ Rate limiting to prevent abuse
- ✅ Database performance optimization
- ✅ Proper error handling
- ✅ Pagination for scalability
