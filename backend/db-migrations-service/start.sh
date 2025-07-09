#!/bin/bash

# Startup script for Database Migration Service
# This script initializes the database and runs migrations

set -e

echo "🚀 Starting Database Migration Service..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432 -U postgres; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 2
done

echo "✅ PostgreSQL is ready!"

# Wait for Redis to be ready
echo "⏳ Waiting for Redis to be ready..."
until redis-cli -h redis ping; do
    echo "Redis is unavailable - sleeping"
    sleep 2
done

echo "✅ Redis is ready!"

# Initialize Alembic
echo "📋 Initializing Alembic..."
alembic init migrations || true

# Run migrations
echo "🔄 Running database migrations..."
alembic upgrade head

echo "✅ Migrations completed successfully!"

# Start the FastAPI application
echo "🚀 Starting FastAPI application..."
exec uvicorn src.main:app --host 0.0.0.0 --port 3009 --reload 