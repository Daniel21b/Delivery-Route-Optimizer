#!/bin/bash

echo "🚚 Starting Delivery Route Optimizer..."
echo "📦 Installing dependencies..."

pip install -q -r requirements.txt

echo "🚀 Starting Flask server on http://localhost:3000"
echo "Press CTRL+C to stop the server"
echo ""

python -m backend.app
