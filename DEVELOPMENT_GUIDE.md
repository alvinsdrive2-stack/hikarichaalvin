# Development Guide - HikariCha Forum System

## Context from Git History & Development Sessions

This document contains important technical information gathered from development sessions to help with future development.

## Current System State

### Latest Commit: `1226c9b` - "feat: implement comprehensive friend system with border integration"

#### ✅ Completed Features
1. **Friend System** - Complete friend request, acceptance, and management system
2. **Border Customization** - Full border system with database integration
3. **Profile Photo Persistence** - User avatar management and persistence
4. **Authentication System** - NextAuth.js with Google and credential providers
5. **MySQL Database** - Complete database schema with Prisma
6. **Google reCAPTCHA** - Registration protection

#### ⚠️ Known Issues & Technical Debt

### 1. ForumUserBorder Component Issues
**File**: `components/forum/forum-user-border.tsx`

**Problem**:
```javascript
ReferenceError: Cannot access 'fetchUserData' before initialization
```

**Root Cause**:
- `useCallback` dependency array issues in `fetchUserData` function
- Component trying to access `fetchUserData` before it's properly initialized
- Complex hook dependencies causing initialization race conditions

**Current Issues**:
- Line 40: `fetchUserData` function definition with dependency problems
- Line 36: `fetchUserData()` called in `useEffect` but not properly initialized
- Multiple API calls causing performance issues
- Heavy console logging affecting production performance

**Solution Applied Previously**:
- Replaced ForumUserBorder with simpler UserProfileLink component
- Simplified data fetching approach
- Removed complex hook dependencies

### 2. Database Connection Issues
**Problem**: "Too many connections" errors from MySQL

**Causes**:
- Multiple concurrent requests without proper connection pooling
- Components making individual API calls instead of batch operations
- No caching mechanism implemented
- Server restart required frequently to clear connection pool

**Temporary Solutions**:
- Server restarts: `rm -rf .next && npx kill-port 3000 3001 3002 3003 3004 3005 3006 && npm run dev`
- Connection pooling implemented in some areas but not consistently

### 3. Forum Database Schema Issues
**File**: `lib/forum-db.ts`

**Problems Found**:
- Forum API not properly fetching border data through author_id foreign key
- Border image URLs constructed incorrectly (using ID instead of imageUrl field)
- Table name confusion: "border" vs "borders"
- Missing author data population in forum threads

**Fixed Issues**:
- ✅ Fixed SQL queries to use correct table name "border" (singular)
- ✅ Updated to use imageUrl field from border table instead of constructing URLs
- ✅ Author data fetching implemented with border integration

### 4. Component Architecture Issues
**Files**:
- `components/forum/thread-detail-client.tsx`
- `components/forum/forum-post-card.tsx`
- `components/forum/forum-comment.tsx`

**Problems**:
- Each component fetching user data independently
- No reusable profile display component
- Inconsistent border display across forum
- Multiple API calls for same user data

## Development Recommendations

### 1. Immediate Fixes Required

#### A. Fix ForumUserBorder Component
```javascript
// Replace the problematic fetchUserData with simpler approach:
const fetchUserData = useCallback(async () => {
  if (!userId) return;

  try {
    const response = await fetch(`/api/users/${userId}`);
    if (response.ok) {
      const user = await response.json();
      setUserData(user);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}, [userId]); // Simple dependency array
```

#### B. Implement Forum Profile Display Component
Create a reusable component that:
- Takes user data as props instead of fetching internally
- Handles border display consistently
- Supports different sizes (forum, thread, comment)
- Includes caching mechanism

### 2. Performance Improvements

#### A. Implement Caching System
Based on previous development session, implement:
- **Cache Manager**: TTL-based caching for user/border data
- **Cache Refresh Hooks**: Automatic cache invalidation on data changes
- **Client-side Cache Refresh**: Manual refresh capabilities

**Key Files to Create**:
- `lib/cache-manager.ts` - Core cache management
- `lib/cache-refresh-hooks.ts` - Server-side cache invalidation
- `hooks/use-cache-refresh.ts` - Client-side cache refresh

#### B. Batch API Operations
Instead of individual API calls:
- Implement batch user data fetching
- Cache border data at component level
- Use React Context for shared user data

### 3. Database Optimization

#### A. Connection Pooling
```javascript
// Example from previous session:
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikaricha_db',
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 100
})
```

#### B. Query Optimization
- Use JOIN queries to fetch user + border data in single query
- Implement proper indexing on user_id, border_id columns
- Add connection timeout handling

### 4. Component Refactoring

#### A. Create Reusable ForumProfileDisplay
```typescript
interface ForumProfileDisplayProps {
  user: {
    id: string;
    name: string;
    avatar?: string;
    border?: Border | null;
  };
  size?: "sm" | "md" | "lg" | "forum" | "thread";
  showStats?: boolean;
  showBadge?: boolean;
}
```

#### B. Standardize Border Data Flow
- Forum API should provide complete user + border data
- Components should use props instead of internal fetching
- Implement consistent error handling

## Development Workflow

### 1. Before Making Changes
```bash
# Check current state
git status
git log --oneline -5

# Start development server
npm run dev
```

### 2. When Encountering Issues
```bash
# Check server logs for connection issues
# Look for "Too many connections" errors

# Restart server if needed
npx kill-port 3000 3001 3002 3003 3004 3005 3006
rm -rf .next
npm run dev
```

### 3. Testing Forum Functionality
1. Navigate to `/forum`
2. Check if threads load properly
3. Click on individual threads
4. Verify user profiles and borders display correctly
5. Check browser console for fetchUserData errors

## File Structure Notes

### Important Files to Monitor
- `components/forum/forum-user-border.tsx` - Known problematic component
- `lib/forum-db.ts` - Database operations
- `app/api/forum/threads/route.ts` - Forum API
- `app/api/users/[userId]/route.ts` - User data API

### Components Needing Refactoring
- ForumUserBorder (critical issues)
- thread-detail-client (data fetching)
- forum-post-card (user display)
- forum-comment (profile display)

## Common Error Patterns

### 1. fetchUserData Initialization Error
**Symptoms**:
- "Cannot access 'fetchUserData' before initialization"
- Forum threads not loading
- User profiles not displaying

**Solutions**:
- Simplify useCallback dependencies
- Move fetchUserData outside useEffect
- Use proper dependency arrays

### 2. Database Connection Issues
**Symptoms**:
- "Too many connections" errors
- Slow page loads
- Intermittent API failures

**Solutions**:
- Implement connection pooling
- Add caching layer
- Optimize query performance

### 3. Border Display Issues
**Symptoms**:
- Borders not showing in forum
- 400 errors on border images
- Inconsistent border display

**Solutions**:
- Use imageUrl field from border table
- Verify table name (border vs borders)
- Check foreign key relationships

## Next Development Phase Priorities

### Priority 1: Critical Fixes
1. Fix ForumUserBorder component initialization
2. Implement proper connection pooling
3. Create reusable profile display component

### Priority 2: Performance
1. Implement caching system
2. Batch API operations
3. Optimize database queries

### Priority 3: Features
1. Enhanced forum functionality
2. Real-time updates
3. Mobile responsiveness

This guide should help future development sessions avoid common pitfalls and build upon the existing foundation more effectively.