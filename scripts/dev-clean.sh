#!/bin/bash

echo "🧹 Deep cleaning dev environment..."

# Kill ALL node processes (force)
pkill -9 node 2>/dev/null

# Kill anything on common dev ports (skip if lsof not installed)
if command -v lsof &> /dev/null; then
  lsof -ti:3000 | xargs kill -9 2>/dev/null
  lsof -ti:3001 | xargs kill -9 2>/dev/null
  lsof -ti:3333 | xargs kill -9 2>/dev/null
  lsof -ti:4000 | xargs kill -9 2>/dev/null
else
  echo "⚠️ lsof not installed - skipping port cleanup"
fi

# Clear OpenClaw locks
rm -rf ~/.openclaw/agents/main/sessions/*

# Clear Next.js cache (IMPORTANT)
rm -rf .next

echo "✅ Clean complete"
