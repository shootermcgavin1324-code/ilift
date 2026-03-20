# Squad Chat Feature - Implementation Plan

**Status:** Planned (not implemented)
**Created:** March 20, 2026

---

## GOAL
Allow natural communication while maintaining a fast, competitive, and focused experience.

---

## CHAT SYSTEM RULES

### 1. MESSAGE INPUT
- Allow users to type messages
- Limit message length to 60 characters (max 80)

### 2. RATE LIMITING
- Limit message sending frequency: 1 message every 20-30 seconds

### 3. NO THREADING
- No replies
- No message threads
- Flat feed only

### 4. MESSAGE DISPLAY
Display messages inline with activity feed:
- "Jordan +40 XP"
- "You moved to #1"
- "You: not for long 😤"

### 5. VISUAL STYLE
- **Messages:** Smaller, lighter than system events, subtle background
- **System activity:** Higher contrast, more prominent

### 6. MESSAGE PRIORITY
- New messages appear near top
- Older messages fade slightly (lower opacity)

### 7. INPUT UI
- Single input field at bottom
- Placeholder: "Say something…"
- Send button minimal

### 8. OPTIONAL CONTEXTUAL SUGGESTION
When major event happens (rank change, workout):
- Show small hint text above input: "Say something 👀"
- NO preset buttons

### 9. NOTIFICATIONS
Trigger notifications for messages:
- "Jordan: not for long 😤"
- "Alex: watch this"

---

## FILES TO MODIFY
1. `src/components/SquadTab.tsx` - Add chat UI
2. `src/app/dashboard/page.tsx` - Add chat state
3. `src/lib/` - Create chat storage helper

---

## IMPLEMENTATION NOTES

### Estimated Changes
- ~50-80 lines new code in SquadTab
- ~30 lines state management in Dashboard
- Simple localStorage integration

### Risk Level: LOW
- Component-based (isolated to SquadTab)
- Easy to disable/remove
- No database changes yet

### To Build Later
1. Add chat state to dashboard
2. Update SquadTab with message feed + input
3. Implement rate limiting
4. Add localStorage persistence
