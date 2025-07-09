from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
import structlog
import subprocess
import os
from typing import List, Dict, Any
from src.core.database import get_master_db
from src.core.config import settings

logger = structlog.get_logger()
router = APIRouter()

@router.get("/status")
async def get_migration_status():
    """Get migration status"""
    try:
        # Check current migration version
        result = subprocess.run(
            ["alembic", "current"],
            capture_output=True,
            text=True,
            cwd="/app"
        )
        
        if result.returncode == 0:
            current_version = result.stdout.strip()
            return {
                "status": "success",
                "current_version": current_version,
                "message": "Migration status retrieved successfully"
            }
        else:
            return {
                "status": "error",
                "error": result.stderr,
                "message": "Failed to get migration status"
            }
    except Exception as e:
        logger.error(f"Migration status check failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_migration_history():
    """Get migration history"""
    try:
        result = subprocess.run(
            ["alembic", "history"],
            capture_output=True,
            text=True,
            cwd="/app"
        )
        
        if result.returncode == 0:
            return {
                "status": "success",
                "history": result.stdout,
                "message": "Migration history retrieved successfully"
            }
        else:
            return {
                "status": "error",
                "error": result.stderr,
                "message": "Failed to get migration history"
            }
    except Exception as e:
        logger.error(f"Migration history check failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/run")
async def run_migrations(service: str = None, environment: str = "development", dry_run: bool = False):
    """Run migrations"""
    try:
        # Build alembic command
        cmd = ["alembic", "upgrade", "head"]
        
        if dry_run:
            cmd = ["alembic", "check"]
        
        logger.info(f"Running migrations: {' '.join(cmd)}")
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            cwd="/app"
        )
        
        if result.returncode == 0:
            return {
                "status": "success",
                "service": service,
                "environment": environment,
                "dry_run": dry_run,
                "output": result.stdout,
                "message": "Migrations completed successfully"
            }
        else:
            return {
                "status": "error",
                "service": service,
                "environment": environment,
                "dry_run": dry_run,
                "error": result.stderr,
                "message": "Migration failed"
            }
    except Exception as e:
        logger.error(f"Migration execution failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/rollback")
async def rollback_migrations(revision: str):
    """Rollback migrations to specific revision"""
    try:
        result = subprocess.run(
            ["alembic", "downgrade", revision],
            capture_output=True,
            text=True,
            cwd="/app"
        )
        
        if result.returncode == 0:
            return {
                "status": "success",
                "revision": revision,
                "output": result.stdout,
                "message": f"Rollback to revision {revision} completed successfully"
            }
        else:
            return {
                "status": "error",
                "revision": revision,
                "error": result.stderr,
                "message": "Rollback failed"
            }
    except Exception as e:
        logger.error(f"Migration rollback failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/validate")
async def validate_migrations():
    """Validate migration files"""
    try:
        result = subprocess.run(
            ["alembic", "check"],
            capture_output=True,
            text=True,
            cwd="/app"
        )
        
        if result.returncode == 0:
            return {
                "status": "success",
                "message": "Migration validation passed",
                "output": result.stdout
            }
        else:
            return {
                "status": "error",
                "message": "Migration validation failed",
                "error": result.stderr
            }
    except Exception as e:
        logger.error(f"Migration validation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 