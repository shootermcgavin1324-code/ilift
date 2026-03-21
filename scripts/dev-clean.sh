#!/bin/bash

echo "🧹 Cleaning development environment..."

# Kill all node/next processes (more aggressive)
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "node.*next" 2>/dev/null  
sleep 2
echo "✓ Killed Next.js processes"

# Also try without -9 first
killall -term "next" 2>/dev/null
sleep 1
echo "✓ Sent terminate signal"

# Force kill anything on port 3000
fuser -k 3000/tcp 2>/dev/null
sleep 1
echo "✓ Killed port 3000"

# Remove OpenClaw session locks
rm -rf ~/.openclaw/agents/main/sessions/*.lock 2>/dev/null
echo "✓ Cleared session locks"

# Clean old deleted session files (prevents bloat)
rm -f ~/.openclaw/agents/main/sessions/*.deleted.* 2>/dev/null
echo "✓ Cleared deleted session files"

# Clear .next cache completely
rm -rf .next 2>/dev/null
echo "✓ Cleared Next.js cache"

sleep 1

echo "✅ Environment clean. Run 'npm run dev' to start."
