# iLift System Failures - Detailed Report

## Overview
We've experienced recurring system failures during iLift app development that caused complete tool freezing and required multiple restarts. This document details the symptoms, root causes, and implemented fixes.

---

## Symptoms Observed

### 1. Complete Tool Freezing
- All OpenClaw tools (exec, browser, read, write, etc.) would stop responding
- Commands would hang indefinitely
- Even simple commands like `echo "test"` would fail or timeout
- The gateway showed as "unreachable" in status checks

### 2. Session Lock Accumulation
- OpenClaw doctor showed: "Found 2 session lock files"
- Lock files stuck with pid=2130 (alive) age=47s stale=no
- Multiple locks accumulated over time

### 3. Port Exhaustion
- Next.js dev servers started on multiple ports:
  - Port 3000 (original)
  - Port 3333 (fallback)
  - Port 4000 (second fallback)
- Could not start new dev servers
- Old servers served stale/cached code

### 4. Code Corruption
- Attempted to fix a syntax error in dashboard/page.tsx
- Used sed/head/tail commands while system was unstable
- Resulted in duplicate code blocks and malformed JSX
- Build failed with "Unterminated regexp literal" errors

---

## Root Causes

### Cause 1: Session Lock Files
**What happens:** OpenClaw creates lock files (`*.lock`) in `~/.openclaw/agents/main/sessions/` to track active sessions. These locks persist if processes crash or are killed unexpectedly.

**Why it fails:** 
- Multiple crashed sessions left locks behind
- New sessions couldn't acquire locks
- Gateway got confused about session state

### Cause 2: Node Process Accumulation
**What happens:** 
- `npm run dev` starts a Next.js server
- Killing processes with Ctrl+C sometimes leaves orphaned node processes
- New `npm run dev` starts on different ports

**Why it fails:**
- Old processes consume resources
- Different ports serve different (stale) code versions
- Port 3000 shows old code while new code runs on 4000

### Cause 3: Complex Edits on Unstable System
**What happens:**
- Tried to fix code while tools were already failing
- Used shell commands (sed, head, tail) as quick fixes
- Commands executed but produced corrupted output

**Why it fails:**
- Partial edits broke the JSX structure
- Missing closing tags caused "Unterminated regexp" errors
- Had to restore from git backup

---

## Implemented Fixes

### Fix 1: Quick Aliases (Added to ~/.zshrc)
```bash
# Kill all node processes
alias knode='pkill -9 node'

# Clear OpenClaw locks  
alias clrlocks='rm -f ~/.openclaw/agents/main/sessions/*.lock'

# Full iLift reset
alias ilift-reset='knode && clrlocks && cd ~/ilift && rm -rf .next && npm run dev'

# Check ports
alias ports='lsof -i :3000 -i :3333 -i :4000'
```

### Fix 2: Prevention Protocol
**Before coding:**
```bash
git add .
git commit -m "backup: $(date +%Y-%m-%d_%H-%M)"
```

**Before testing:**
```bash
npm run build  # Always verify build passes first
```

**If system freezes:**
```bash
# Kill all node processes
pkill -9 node

# Clear stuck session locks
rm -f ~/.openclaw/agents/main/sessions/*.lock

# Restart OpenClaw gateway
openclaw gateway restart
```

### Fix 3: Code Refactoring
- Split 851-line dashboard into 7 smaller components
- Easier to debug and modify without breaking entire app
- Components: HomeTab, SquadTab, ChallengesTab, HistoryTab, RankCard, RestTimer, Leaderboard

### Fix 4: Documentation
- Created `docs/SYSTEM_HEALTH.md` with maintenance guide
- Added daily health check commands
- Documented emergency recovery steps

---

## Current System State (March 20, 2026)

### Working
- ✅ App builds successfully (`npm run build` passes)
- ✅ Dev server runs on localhost:3000
- ✅ All pages load (landing, signin, onboarding, dashboard)
- ✅ Components split and organized

### Still Local
- App uses localStorage (no Supabase yet)
- Accounts reset on browser clear
- No multi-user support

---

## Questions for Analysis

1. Are there better ways to handle session locks in OpenClaw?
2. Should we switch to PM2 for process management?
3. Any recommendations for preventing code corruption during rapid iteration?
4. Is there a safer way to edit files than sed/head/tail?
5. Any other optimizations for the Next.js dev workflow?

---

## Files Reference
- App: ~/ilift/
- Components: ~/ilift/src/components/
- Dashboard: ~/ilift/src/app/dashboard/page.tsx
- Docs: ~/ilift/docs/SYSTEM_HEALTH.md
- Memory: ~/.openclaw/workspace/MEMORY.md
