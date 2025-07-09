from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
import structlog
from src.core.database import get_db, get_master_db

logger = structlog.get_logger()
router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "database-migration-service",
        "version": "1.0.0"
    }

@router.get("/health/database")
async def database_health_check(db: Session = Depends(get_db)):
    """Database health check"""
    try:
        result = db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "migrations_db",
            "message": "Database connection successful"
        }
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "database": "migrations_db",
            "error": str(e)
        }

@router.get("/health/master-database")
async def master_database_health_check(db: Session = Depends(get_master_db)):
    """Master database health check"""
    try:
        result = db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "master_db",
            "message": "Master database connection successful"
        }
    except Exception as e:
        logger.error(f"Master database health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "database": "master_db",
            "error": str(e)
        } 