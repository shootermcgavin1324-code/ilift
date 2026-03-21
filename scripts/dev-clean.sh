#!/bin/bash

echo "🧹 Cleaning development environment..."

# Kill ALL node processes (most aggressive)
pkill -9 node 2>/dev/null
sleep 2
echo "✓ Killed all node processes"

# Clear common ports
for port in 3000 3001 3002 3003 3004 3005; do
  fuser -k $port/tcp 2>/dev/null
done
sleep 1
echo "✓ Cleared ports 3000-3005"

# Remove OpenClaw session locks
rm -rf ~/.openclaw/agents/main/sessions/*.lock 2>/dev/null
rm -f ~/.openclaw/agents/main/sessions/*.deleted.* 2>/dev/null
echo "✓ Cleared session files"

# Clear .next cache
rm -rf .next 2>/dev/null
echo "✓ Cleared Next.js cache"

sleep 1

echo "✅ Environment clean. Run 'npm run dev' to start."
