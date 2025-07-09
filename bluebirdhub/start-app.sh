#!/bin/bash

echo "🚀 Starting Bluebirdhub Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration (especially OPENROUTER_API_KEY)"
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🏗️  Building and starting containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check database
echo "  📊 Database..."
docker-compose exec db pg_isready -U admin -d bluebirdhub > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "    ✅ Database is ready"
else
    echo "    ❌ Database is not ready"
fi

# Check backend
echo "  🖥️  Backend..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "    ✅ Backend is ready"
else
    echo "    ❌ Backend is not ready (HTTP $BACKEND_STATUS)"
fi

# Check frontend
echo "  🌐 Frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "    ✅ Frontend is ready"
else
    echo "    ❌ Frontend is not ready (HTTP $FRONTEND_STATUS)"
fi

echo ""
echo "🎉 Bluebirdhub Application Started!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🗄️  Database: localhost:5432"
echo ""
echo "👥 Demo Users:"
echo "  - user1 / pass123"
echo "  - user2 / pass123"
echo "  - user3 / pass123"
echo "  - admin / admin123"
echo ""
echo "🤖 AI Features:"
echo "  - Add your OpenRouter API key to .env file"
echo "  - Restart containers: docker-compose restart"
echo ""
echo "📝 To stop: docker-compose down"
echo "📋 To view logs: docker-compose logs -f"
echo ""