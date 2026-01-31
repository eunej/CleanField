#!/bin/bash

# CleanField Quick Start Script

echo "🌱 Starting CleanField..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating .env.local from example..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your configuration"
    echo ""
fi

# Build contracts if they haven't been built
if [ ! -d "contracts/out" ]; then
    echo "🔨 Building smart contracts..."
    cd contracts
    forge build
    cd ..
    echo ""
fi

# Start the dev server
echo "🚀 Starting development server..."
echo ""
echo "Admin Dashboard: http://localhost:3000"
echo "Farm Owner Views:"
echo "  - http://localhost:3000/farm/farm1"
echo "  - http://localhost:3000/farm/farm2"
echo "  - http://localhost:3000/farm/farm3"
echo "  - http://localhost:3000/farm/farm4"
echo "  - http://localhost:3000/farm/farm5"
echo ""

npm run dev
