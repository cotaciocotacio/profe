#!/bin/bash

# Script to clean Docker containers and volumes
# This script stops and removes all containers and volumes

set -e

echo "🧹 Cleaning Docker Environment..."

# Stop all running containers
echo "🛑 Stopping all containers..."
docker-compose -f db-migrations-service/docker-compose.yml down

# Remove all containers
echo "🗑️ Removing containers..."
docker container prune -f

# Remove all volumes
echo "🗑️ Removing volumes..."
docker volume prune -f

# Remove all networks
echo "🗑️ Removing networks..."
docker network prune -f

# Remove all images
echo "🗑️ Removing images..."
docker image prune -f

echo "✅ Docker environment cleaned!"

echo ""
echo "To start fresh, run:"
echo "  ./start-docker.sh" 