#!/bin/bash

# JB Trade Link MCP Server Setup Script

echo "🚀 Setting up MCP Server for JB Trade Link DMS..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "mcp-server" ]; then
    echo "❌ Error: Please run this script from the root of your JB Trade Link project"
    exit 1
fi

cd mcp-server

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "🔨 Building MCP server..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build MCP server"
    exit 1
fi

echo "✅ MCP Server setup complete!"
echo ""
echo "To start the MCP server:"
echo "  cd mcp-server && npm run dev"
echo ""
echo "To use with MCP clients, reference the mcp-config.json in your project root"