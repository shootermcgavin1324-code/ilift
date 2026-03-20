# iLift Technical Architecture

## Overview

iLift is a Next.js web app with local-first data storage, designed to connect to Supabase (cloud database) later.

---

## Current Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Landing  │  │Onboarding│  │Dashboard │  (Pages)    │
│  └──────────┘  └──────────┘  └──────────┘             │
│         ↓            ↓            ↓                     │
│  ┌──────────────────────────────────────────────┐      │
│  │         React Components / UI                │      │
│  │  (buttons, cards, inputs, icons)             │      │
│  └──────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
                          ↓
         ┌────────────────┴────────────────┐
         │         State Management         │
         │    (useState, localStorage)      │
         └────────────────────────────────┘
                          ↓
         ┌────────────────────────────────┐
         │     Currently: localStorage     │
         │     (browser only)             │
         └────────────────────────────────┘
```

---

## File Structure

```
~/ilift/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── landing/page.tsx    # Landing page
│   │   ├── onboarding/page.tsx # Sign-up flow
│   │   ├── signin/page.tsx     # Sign in
│   │   ├── dashboard/page.tsx  # Main app
│   │   ├── layout.tsx          # Global layout
│   │   └── globals.css         # Global styles
│   │
│   ├── lib/                   # Utilities
│   │   ├── supabase.ts        # Database connection (not active)
│   │   └── icons.ts           # Custom SVG icons
│   │
│   └── ...
│
├── public/                    # Static files (favicon, etc)
│
├── .env.local                # API keys (NOT committed to git)
│
├── package.json               # Dependencies
└── README.md                 # Docs
```

---

## Data Flow (Current)

### User Signs Up:
```
1. User fills onboarding form
2. Data saved to localStorage:
   - ilift_email
   - ilift_password
   - ilift_onboarding
   - ilift_onboarding_data (JSON)
3. Redirect to /dashboard
4. Dashboard reads from localStorage
```

### User Logs Workout:
```
1. User enters exercise, weight, reps, RPE
2. Data saved to localStorage:
   - ilift_workouts (JSON array)
3. XP calculated and saved to user profile
```

### Current Limitations:
- ❌ Data only lives in ONE browser
- ❌ Clearing cache = losing data
- ❌ Can't see other users' workouts
- ❌ Can't have real leaderboards

---

## What Supabase Adds

When we connect Supabase (database in the cloud):

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
└─────────────────────────────────────────────────────────┘
                          ↓
         ┌────────────────────────────────┐
         │       Supabase Client          │
         │   (src/lib/supabase.ts)        │
         └────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Supabase (Cloud)                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   Users    │  │  Workouts  │  │  Squads    │        │
│  │   Table    │  │   Table    │  │   Table    │        │
│  └────────────┘  └────────────┘  └────────────┘        │
│                                                         │
│  - Real authentication                                   │
│  - Shared data between users                             │
│  - Real-time updates                                     │
└─────────────────────────────────────────────────────────┘
```

### Tables we'll need:

```sql
-- Users table
users:
  - id (unique)
  - email
  - name
  - weight
  - height
  - fitness_goal
  - experience_level
  - total_xp
  - streak_days
  - squad_id
  - created_at

-- Workouts table
workouts:
  - id
  - user_id (links to users)
  - exercise
  - weight
  - reps
  - rpe (1-10 effort rating)
  - xp_earned
  - created_at

-- Squads table
squads:
  - id
  - code (like "ALPHA")
  - name
  - created_at
```

---

## Why This Architecture?

### 1. Next.js
- Modern React framework
- Handles routing automatically
- Good performance

### 2. localStorage First
- **Why**: We can build and test without setting up database
- **Risk**: Data not shared, can be cleared
- **Solution**: Add Supabase later

### 3. Supabase
- Firebase alternative (open source)
- PostgreSQL under the hood
- Handles auth + database
- Has real-time features

---

## Development Phases

### Phase 1: Local Prototype (NOW)
- [x] Landing page
- [x] Onboarding
- [ ] Dashboard features work
- [ ] Log workouts locally
- [ ] See workout history locally

### Phase 2: Connect Supabase
- [ ] Set up Supabase project
- [ ] Create database tables
- [ ] Connect frontend to Supabase
- [ ] Add authentication
- [ ] Make data shared between users

### Phase 3: Polish & Launch
- [ ] Fix bugs
- [ ] Add more features
- [ ] Deploy to Vercel
- [ ] Share with friends

---

## Key Concepts to Learn

### React
- **Components**: Reusable UI pieces
- **useState**: Store data in a component
- **useEffect**: Run code when something changes
- **Props**: Pass data between components

### Next.js
- **Pages**: Each file in `app/` is a page
- **Routing**: File structure = URL structure
- **Client vs Server**: 'use client' = runs in browser

### localStorage
- Browser's built-in storage
- Persists between page refreshes
- Limited to ~5MB
- Each browser has own localStorage

### Supabase
- Cloud database
- REST API automatically generated
- Real-time subscriptions
- Row Level Security (RLS)

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Page not updating | Cache | Hard refresh (Cmd+Shift+R) |
| Port in use | Old process running | `pkill -f "next dev"` then restart |
| Styles not applying | Tailwind issue | Use inline styles for critical stuff |
| Data gone | localStorage cleared | That's expected in Phase 1 |

---

## Next Steps for Learning

1. **Understand the flow**: Look at how data moves through the app
2. **Add a feature**: Try adding something simple to dashboard
3. **Read the code**: The comments explain what's happening
4. **Ask questions**: If something doesn't make sense, ask

---

## Resources

- Next.js docs: https://nextjs.org/docs
- React docs: https://react.dev
- Supabase docs: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com
