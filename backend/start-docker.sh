#!/bin/bash

# Script to start the entire Profe backend environment
# This script builds and starts all Docker containers

set -e

echo "🚀 Starting Profe Backend Environment..."

# Change to the db-migrations-service directory
cd db-migrations-service

# Build the Docker image
echo "🔨 Building Docker image..."
docker-compose build

# Start the services
echo "🚀 Starting services..."
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U postgres; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 2
done

echo "✅ PostgreSQL is ready!"

# Start the migration service
echo "🚀 Starting Database Migration Service..."
docker-compose up -d db-migrations-service

# Wait for the service to be ready
echo "⏳ Waiting for migration service to be ready..."
until curl -f http://localhost:3009/health; do
    echo "Migration service is unavailable - sleeping"
    sleep 5
done

echo "✅ Database Migration Service is ready!"

# Show service status
echo "📊 Service Status:"
docker-compose ps

echo "🌐 API Endpoints:"
echo "  - Health Check: http://localhost:3009/health"
echo "  - Migration Status: http://localhost:3009/api/migrations/status"
echo "  - API Documentation: http://localhost:3009/docs"

echo "✅ Profe Backend Environment is running!"
echo ""
echo "To stop the services, run:"
echo "  cd db-migrations-service && docker-compose down" 