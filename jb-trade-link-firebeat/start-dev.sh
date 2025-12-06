#!/bin/bash

# Firebeat DMS Development Startup Script
# Starts both CORS proxy and dev server

echo "🚀 Firebeat DMS Development Server Launcher"
echo "=========================================="
echo ""

# Check if proxy is already running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "⚠️  Proxy already running on :3001"
else
  echo "📍 Starting CORS proxy on port 3001..."
  echo "   Command: node proxy.mjs"
  echo ""
  
  # Start proxy in background
  node proxy.mjs &
  PROXY_PID=$!
  echo "✅ Proxy started (PID: $PROXY_PID)"
  echo ""
  
  # Wait for proxy to start
  sleep 2
fi

echo "📍 Starting development server..."
echo "   Command: npm run dev"
echo ""

# Start dev server
npm run dev

# If we started the proxy, kill it on exit
if [ ! -z "$PROXY_PID" ]; then
  trap "kill $PROXY_PID" EXIT
fi
