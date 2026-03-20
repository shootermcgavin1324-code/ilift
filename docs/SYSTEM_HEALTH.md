# iLift - System Health & Maintenance Guide

_Created: March 20, 2026_
_Updated: March 20, 2026 (Added clean script + rules)_

---

## 🚀 Quick Start (ALWAYS USE THIS)

```bash
# Clean start - USE THIS EVERY TIME
npm run dev:clean
```

This kills old processes, clears locks, and starts fresh.

---

## 🔧 Available Scripts

```bash
npm run dev        # Start dev server (may have stale processes)
npm run dev:clean  # Clean + start dev server (RECOMMENDED)
npm run clean      # Just clean, don't start
npm run build      # Build for production
```

---

## 🚨 Session Lock Issues

**Problem:** OpenClaw creates session lock files that can accumulate and cause freezing.

**Fix Commands:**
```bash
# Clear stuck session locks
rm -f ~/.openclaw/agents/main/sessions/*.lock

# Kill stuck processes
pkill -9 node
```

---

## 🔧 Port Management

**Problem:** Multiple Next.js dev servers can run on different ports, causing confusion.

**Ports used historically:** 3000, 3333, 4000

**Fix Commands:**
```bash
# Kill all node processes (clean slate)
pkill -9 node

# Check what's using ports
lsof -i :3000

# Or use netstat
netstat -an | grep 3000
```

---

## 📋 Daily Startup Routine

Before starting work each day:

```bash
# RECOMMENDED - Use clean script
cd ~/ilift
npm run dev:clean
```

Or manually:
```bash
# 1. Clear any old locks
rm -f ~/.openclaw/agents/main/sessions/*.lock

# 2. Kill old node processes
pkill -9 node

# 3. Check OpenClaw status
openclaw doctor

# 4. Start fresh
cd ~/ilift
npm run dev
```

---

## 🛡️ Safe Coding Practices

### Before Editing Code:
1. **Always commit first:** `git add . && git commit -m "backup before changes"`
2. **Test build before running:** `npm run build`
3. **Make small changes** - one at a time

### If Something Breaks:
1. Check build errors: `npm run build`
2. Restore from git: `git checkout src/app/dashboard/page.tsx`
3. Restart server: `pkill -f "next dev" && npm run dev`

---

## 📁 Key Files & Locations

- **App:** `~/ilift/`
- **Components:** `~/ilift/src/components/`
- **Dashboard:** `~/ilift/src/app/dashboard/page.tsx`
- **Landing:** `~/ilift/src/app/landing/page.tsx`
- **Memory:** `~/.openclaw/workspace/MEMORY.md`

---

## 🔴 Emergency Recovery

If everything freezes:

```bash
# Nuclear option - kill everything
pkill -9 node
pkill -9 npm

# Clear all locks
rm -f ~/.openclaw/agents/main/sessions/*.lock

# Restart OpenClaw
openclaw gateway restart

# Start fresh
cd ~/ilift
rm -rf .next
npm run dev
```

---

## ⚡ Quick Aliases (Add to ~/.zshrc)

```bash
# Add to ~/.zshrc for quick access:

# Kill all node processes
alias knode='pkill -9 node'

# Clear OpenClaw locks  
alias clrlocks='rm -f ~/.openclaw/agents/main/sessions/*.lock'

# Full reset
alias ilift-reset='knode && clrlocks && cd ~/ilift && rm -rf .next && npm run dev'

# Check ports
alias ports='lsof -i :3000 -i :3333 -i :4000'
```

---

## 📝 Git Workflow (STRICT)

**Every time you code:**
```bash
# Before ANY changes
git add .
git commit -m "backup: $(date +%Y-%m-%d_%H-%M)"

# After successful build
git add .
git commit -m "feat: your change description"
```

**If things break:**
```bash
# Restore specific file
git checkout src/app/dashboard/page.tsx

# Or restore EVERYTHING to last commit
git checkout .
```

---

## 🔒 TypeScript Safety

**Always run before testing:**
```bash
npm run build
```

This catches errors BEFORE you run the app. Don't skip this step.

---

## 🧪 Testing Checklist

Before declaring work "done":
- [ ] `npm run build` passes with no errors
- [ ] App loads at localhost:3000
- [ ] No red errors in browser console
- [ ] Git commit saved

---

## 🏥 Daily Health Check

Run this EVERY morning:

```bash
# 1. Check node processes (should be minimal)
ps aux | grep node | grep -v grep | wc -l

# 2. Check ports (should only be 1 next dev)
lsof -i :3000 | grep LISTEN

# 3. Check memory
vm_stat | grep Pages\ free

# 4. Check disk space
df -h ~

# 5. Run OpenClaw doctor
openclaw doctor
```

**Healthy values:**
- Node processes: 1-4 (only current dev server)
- Free pages: >50,000
- Disk: >20% free

---

## 🛡️ Advanced Safeguards

### 1. ESLint (Auto-fix on save)
```bash
# Add to package.json scripts:
"lint": "next lint",
"lint:fix": "next lint --fix"
```

### 2. Pre-commit Hook (Prevents bad commits)
Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
npm run build
```

### 3. TypeScript Strict Mode
In `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

---

## 🔍 Troubleshooting Commands

```bash
# What's using port 3000?
lsof -i :3000

# How many node processes?
ps aux | grep -E "node|next" | grep -v grep

# Check build errors
npm run build 2>&1 | grep -i error

# Check TypeScript errors
npx tsc --noEmit

# Check ESLint
npm run lint

# View recent git commits
git log --oneline -5

# Undo last commit (soft reset)
git reset --soft HEAD~1
```

---

## 📊 Monitoring (Optional)

For production later:
- **PM2** - Process manager (auto-restart on crash)
- **New Relic** or **Datadog** - Performance monitoring
- **Sentry** - Error tracking

---

## ✅ Current Status (Last Check: March 20, 2026)

- [x] Session locks cleared
- [x] Node processes running (4 - dev server + webpack)
- [x] App building successfully
- [x] Dev server on port 3000
- [x] App responds at localhost:3000
- [x] Disk space: 134GB free (32% used)
