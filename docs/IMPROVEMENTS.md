# iLift - Improvement Recommendations

_Compiled March 19, 2026_

---

## 🚨 CRITICAL (Fix Before Launch)

### 1. Input Validation
**Issue:** No validation on workout inputs (weight, reps, RPE)
- Users could enter negative numbers, decimals, or extremely high values
- Add min/max validation on all inputs
```javascript
// Example
<input type="number" min="0" max="2000" />
```

### 2. XSS Prevention
**Issue:** Using dangerouslySetInnerHTML for SVG icons
- Potential XSS if icons.ts is compromised
- Consider using proper SVG components instead

### 3. localStorage Data Corruption
**Issue:** No error handling if localStorage is full or corrupted
- App could crash on load
- Add try/catch around localStorage reads

---

## 🔒 SECURITY

### 4. Environment Variables
**Current:** API keys in .env.local
**Risk:** Could be exposed in client-side bundle
**Fix:** Ensure Supabase keys are marked as public only, use server-side for secrets

### 5. Rate Limiting (Future)
**When connecting to Supabase:** Implement rate limits to prevent abuse

### 6. Input Sanitization
**Issue:** User names/exercise names stored as-is
**Fix:** Sanitize all user inputs to prevent injection

---

## ⚡ PERFORMANCE

### 7. Image Optimization
**Current:** Using full-size JPGs as backgrounds
**Fix:**
- Compress images (use WebP)
- Add lazy loading
- Use Next.js Image component

### 8. Bundle Size
**Issue:** All icons and components loaded at once
**Fix:** Consider code splitting for larger features

### 9. Memoization
**Issue:** Components re-rendering on every state change
**Fix:** Use useMemo, useCallback for expensive calculations

---

## 🎯 UX/UI

### 10. Accessibility (A11y)
**Missing:**
- ARIA labels on buttons
- Keyboard navigation
- Screen reader support
- Color contrast issues (some gray text may be too light)

### 11. Loading States
**Issue:** No loading spinners
**Fix:** Add skeleton loaders for async operations

### 12. Empty States
**Issue:** Some screens show "No data" generically
**Fix:** Custom empty states with CTAs ("Log your first workout!")

### 13. Offline Support
**Issue:** App won't work offline
**Fix:** Add service worker for offline functionality

### 14. Mobile Gestures
**Add:** Pull-to-refresh, swipe navigation

---

## 🏗️ TECHNICAL DEBT

### 15. TypeScript
**Current:** Using `any` types extensively
**Fix:** Add proper interfaces for User, Workout, Challenge types

### 16. Component Organization
**Issue:** Single massive dashboard file (2000+ lines)
**Fix:** Split into smaller components:
- `/components/RankCard.tsx`
- `/components/WorkoutLogger.tsx`
- `/components/Leaderboard.tsx`
- `/components/RestTimer.tsx`

### 17. State Management
**Current:** useState in single component
**Fix:** Consider React Context for global state (user, leaderboard)

### 18. Constants
**Issue:** Hardcoded values (XP thresholds, RPE values)
**Fix:** Create `/constants/index.ts`

---

## 🔄 DATA & SUPABASE

### 19. Migration Strategy
**Before connecting Supabase:**
- Export current localStorage data
- Create migration script
- Test with small user group first

### 20. Real-time Subscriptions
**Planned but not implemented:**
- Need proper Supabase subscriptions
- Handle connection drops gracefully
- Offline queue for actions

### 21. Data Validation (Backend)
**Supabase:** Add Row Level Security (RLS) policies
- Users can only see their own data
- Squad data properly scoped

---

## 🎮 GAMIFICATION

### 22. Achievement System
**Current:** Basic badges in localStorage
**Enhancements:**
- Achievement categories (Strength, Endurance, Consistency)
- Rare/hidden achievements
- Achievement notifications

### 23. Social Features
**Missing:**
- Activity feed
- Comments on workouts
- Friend requests
- Direct messages

### 24. Seasons/Leagues
**Idea:** Monthly competitions with prizes

---

## 📱 PWA

### 25. Progressive Web App
**Add:**
- manifest.json (needs updating)
- Service worker
- Install prompt
- Push notifications (future)

---

## 🔧 QUICK WINS (< 1 hour)

1. Add input validation (numbers only, min/max)
2. Add loading skeletons
3. Fix color contrast issues
4. Add error boundaries
5. Create TypeScript interfaces
6. Split dashboard into components

---

## 🏃 FUTURE ROADMAP

1. **Week 1:** Supabase connection, bug fixes
2. **Week 2:** Social features, activity feed  
3. **Week 3:** PWA, push notifications
4. **Week 4:** Analytics, advanced achievements

---

## 📋 TODO FOR TOMORROW

- [ ] Test app thoroughly with fresh localStorage
- [ ] Fix input validation
- [ ] Add error handling
- [ ] Prepare Supabase schema
- [ ] Document API for Supabase connection
