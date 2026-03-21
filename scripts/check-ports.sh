#!/bin/bash

echo "🔍 Checking for stuck processes..."

# Kill any stuck Next.js processes
pkill -9 -f "next-server" 2>/dev/null
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "turbopack" 2>/dev/null
sleep 1
echo "✓ Killed stuck Next.js processes"

# Check if port 3000 is in use
if lsof -i :3000 >/dev/null 2>&1; then
  echo "⚠ Port 3000 in use, attempting to free..."
  fuser -k 3000/tcp 2>/dev/null
  sleep 1
fi

# Check for any node processes on common ports
for port in 3000 3001 3002 3003 3004 3005; do
  if lsof -i :$port >/dev/null 2>&1; then
    echo "Found process on port $port"
    fuser -k $port/tcp 2>/dev/null
  fi
done
sleep 1
echo "✓ Cleared stuck ports"

echo "✅ Port check complete."
