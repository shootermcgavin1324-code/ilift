#!/bin/bash

echo "🧹 Cleaning development environment..."

# Kill all Node processes
pkill -9 node 2>/dev/null
echo "✓ Killed node processes"

# Remove OpenClaw session locks
rm -rf ~/.openclaw/agents/main/sessions/*.lock 2>/dev/null
echo "✓ Cleared session locks"

# Clear .next cache (optional - helps with stale builds)
rm -rf .next 2>/dev/null
echo "✓ Cleared Next.js cache"

echo "✅ Environment clean. Run 'npm run dev' to start."
