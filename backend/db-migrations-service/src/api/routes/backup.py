from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
import structlog
import subprocess
import os
from datetime import datetime
from typing import List, Dict, Any
from src.core.database import get_master_db
from src.core.config import settings

logger = structlog.get_logger()
router = APIRouter()

@router.post("/create")
async def create_backup(service: str = None, description: str = "Manual backup"):
    """Create database backup"""
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_filename = f"backup_{service}_{timestamp}.sql" if service else f"backup_{timestamp}.sql"
        backup_path = os.path.join(settings.BACKUP_PATH, backup_filename)
        
        # Create backup using pg_dump
        cmd = [
            "pg_dump",
            "-h", "postgres",
            "-U", "postgres",
            "-d", "profe_database",
            "-f", backup_path,
            "--verbose"
        ]
        
        # Set environment variables for pg_dump
        env = os.environ.copy()
        env["PGPASSWORD"] = "password"
        
        logger.info(f"Creating backup: {backup_filename}")
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            env=env,
            cwd="/app"
        )
        
        if result.returncode == 0:
            # Get file size
            file_size = os.path.getsize(backup_path) if os.path.exists(backup_path) else 0
            
            return {
                "status": "success",
                "backup_id": backup_filename,
                "service": service,
                "description": description,
                "size": f"{file_size} bytes",
                "path": backup_path,
                "created_at": datetime.now().isoformat(),
                "message": "Backup created successfully"
            }
        else:
            return {
                "status": "error",
                "service": service,
                "description": description,
                "error": result.stderr,
                "message": "Backup creation failed"
            }
    except Exception as e:
        logger.error(f"Backup creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list")
async def list_backups():
    """List available backups"""
    try:
        backup_dir = settings.BACKUP_PATH
        backups = []
        
        if os.path.exists(backup_dir):
            for filename in os.listdir(backup_dir):
                if filename.endswith('.sql'):
                    file_path = os.path.join(backup_dir, filename)
                    file_size = os.path.getsize(file_path)
                    file_mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
                    
                    backups.append({
                        "filename": filename,
                        "size": f"{file_size} bytes",
                        "created_at": file_mtime.isoformat(),
                        "path": file_path
                    })
        
        return {
            "status": "success",
            "backups": backups,
            "count": len(backups),
            "message": "Backup list retrieved successfully"
        }
    except Exception as e:
        logger.error(f"Backup list failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/restore/{backup_id}")
async def restore_backup(backup_id: str):
    """Restore database from backup"""
    try:
        backup_path = os.path.join(settings.BACKUP_PATH, backup_id)
        
        if not os.path.exists(backup_path):
            raise HTTPException(status_code=404, detail=f"Backup {backup_id} not found")
        
        # Restore using psql
        cmd = [
            "psql",
            "-h", "postgres",
            "-U", "postgres",
            "-d", "profe_database",
            "-f", backup_path
        ]
        
        # Set environment variables for psql
        env = os.environ.copy()
        env["PGPASSWORD"] = "password"
        
        logger.info(f"Restoring backup: {backup_id}")
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            env=env,
            cwd="/app"
        )
        
        if result.returncode == 0:
            return {
                "status": "success",
                "backup_id": backup_id,
                "output": result.stdout,
                "message": "Backup restored successfully"
            }
        else:
            return {
                "status": "error",
                "backup_id": backup_id,
                "error": result.stderr,
                "message": "Backup restore failed"
            }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Backup restore failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{backup_id}")
async def delete_backup(backup_id: str):
    """Delete backup file"""
    try:
        backup_path = os.path.join(settings.BACKUP_PATH, backup_id)
        
        if not os.path.exists(backup_path):
            raise HTTPException(status_code=404, detail=f"Backup {backup_id} not found")
        
        os.remove(backup_path)
        
        return {
            "status": "success",
            "backup_id": backup_id,
            "message": "Backup deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Backup deletion failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 