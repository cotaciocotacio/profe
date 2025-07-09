from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Service Configuration
    SERVICE_NAME: str = "database-migration-service"
    SERVICE_VERSION: str = "1.0.0"
    SERVICE_PORT: int = 3009
    
    # Database Configuration
    DATABASE_URL: str = "postgresql://postgres:password@postgres:5432/profe_migrations"
    MASTER_DATABASE_URL: str = "postgresql://postgres:password@postgres:5432/profe_database"
    
    # Redis Configuration
    REDIS_URL: str = "redis://redis:6379"
    
    # Backup Configuration
    BACKUP_STORAGE: str = "s3://profe-backups/"
    BACKUP_RETENTION_DAYS: int = 30
    
    # Logging
    LOG_LEVEL: str = "info"
    
    # Migration Configuration
    MIGRATIONS_PATH: str = "/app/migrations"
    SEEDS_PATH: str = "/app/seeds"
    BACKUP_PATH: str = "/app/backups"
    
    # Service URLs (for development)
    AUTH_SERVICE_URL: str = "http://auth-service:3001"
    USER_SERVICE_URL: str = "http://user-service:3002"
    ORGANIZATION_SERVICE_URL: str = "http://organization-service:3003"
    ACADEMIC_SERVICE_URL: str = "http://academic-service:3004"
    PLANS_SERVICE_URL: str = "http://plans-service:3005"
    CHAT_SERVICE_URL: str = "http://chat-service:3006"
    ANALYTICS_SERVICE_URL: str = "http://analytics-service:3007"
    FILE_SERVICE_URL: str = "http://file-service:3008"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings() 