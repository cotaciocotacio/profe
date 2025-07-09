-- Initialize databases for Profe platform
-- This script creates the necessary databases and extensions

-- Create the main database for migrations
CREATE DATABASE profe_migrations;

-- Create the master database for the application
CREATE DATABASE profe_database;

-- Connect to the master database
\c profe_database;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the migration service database
\c profe_migrations;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create a table to track migration service status
CREATE TABLE IF NOT EXISTS migration_service_status (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'running',
    last_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial status
INSERT INTO migration_service_status (service_name, status) 
VALUES ('database-migration-service', 'initialized')
ON CONFLICT DO NOTHING; 