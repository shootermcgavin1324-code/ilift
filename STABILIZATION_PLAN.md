# iLift Stabilization & Upgrade Plan

## PHASE 1: Audit & Fix
- [x] Build passes ✓
- [x] Fix critical ESLint errors
- [x] Fix streak logic - best streak now saves to localStorage
- [x] Fix favorites persistence - using localStorage correctly
- [x] Fix workout logging - streak/XP updates properly
- [ ] Test full user flow

## PHASE 2: Core Features Polish
- [ ] Workout logging flow works end-to-end
- [ ] XP calculation correct
- [ ] Streak tracking works
- [ ] Leaderboard displays correctly

## PHASE 3: UI/UX Improvements  
- [ ] Loading states for all async operations
- [ ] Error handling with user-friendly messages
- [ ] Empty states (no workouts, no leaderboard)
- [ ] Mobile responsiveness check

## PHASE 4: Performance & Reliability
- [ ] Remove unused dependencies
- [ ] Code splitting optimization
- [ ] Bundle size check
- [ ] PWA functionality test

## PHASE 5: Testing & Launch Prep
- [ ] Test with multiple users (friend testing)
- [ ] Re-add auth (Clerk) with Convex backend
- [ ] Deploy to Vercel
- [ ] Final bug bash
