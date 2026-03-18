# iLift Database Migration Guide

## Current State
- **Database:** JSON file (`/src/data/db.json`)
- **Storage:** Client-side localStorage
- **Users:** ~5 (test group)

## Target State
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (S3-compatible)
- **Users:** 100+ (production)

---

## Migration Checklist

### Phase 1: Set Up Supabase (Before Launch)
- [ ] Create Supabase project
- [ ] Get API keys (anon public, service role)
- [ ] Create storage bucket for videos
- [ ] Set up RLS policies

### Phase 2: Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  group_id UUID REFERENCES groups(id),
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  onboarding JSONB,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Groups table
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workouts table
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  group_id UUID REFERENCES groups(id),
  exercises JSONB NOT NULL,
  score INTEGER NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video proofs table
CREATE TABLE video_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  workout_id UUID REFERENCES workouts(id),
  storage_url TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Phase 3: API Updates

1. **Auth API** (`/api/auth`)
   - Connect to Supabase Auth
   - Use `supabase.auth.signUp()` / `signInWithPassword()`

2. **Group API** (`/api/group`)
   - Query Supabase instead of JSON file

3. **Workout API** (`/api/workout`)
   - Save to `workouts` table
   - Include video URL reference

4. **Storage API** (`/api/storage`)
   - Upload to Supabase Storage bucket
   - Return public URL

### Phase 4: Client Updates

1. **localStorage → Supabase**
   - Remove localStorage dependencies
   - Fetch user data from API on load

2. **Video Upload**
   - Use `/api/storage` endpoint
   - Show upload progress
   - Display video player for proof

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Migration Script

When ready to migrate:
1. Export current JSON data
2. Transform to SQL INSERT statements
3. Run migration script
4. Update client to use new API
5. Deploy!

---

## Cost Estimation

| Users | Database | Storage | Bandwidth |
|-------|----------|---------|-----------|
| 100   | Free     | Free    | Free      |
| 1,000 | $25/mo   | $10/mo  | $5/mo     |
| 10,000| $50/mo   | $50/mo  | $25/mo    |

Supabase free tier: 500MB DB, 1GB Storage, 5GB Bandwidth/month
