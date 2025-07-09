from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import structlog
from .config import settings

logger = structlog.get_logger()

# Create engine for migrations database
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=StaticPool,
    echo=False
)

# Create engine for master database
master_engine = create_engine(
    settings.MASTER_DATABASE_URL,
    poolclass=StaticPool,
    echo=False
)

# Create session factories
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
MasterSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=master_engine)

# Base class for models
Base = declarative_base()

async def init_db():
    """Initialize database and create schemas"""
    try:
        # Test connection to migrations database
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            logger.info("Connected to migrations database successfully")
        
        # Test connection to master database
        with master_engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            logger.info("Connected to master database successfully")
            
            # Create schemas if they don't exist
            schemas = [
                'auth', 'users', 'organizations', 'academic', 
                'plans', 'chat', 'analytics', 'files'
            ]
            
            for schema in schemas:
                conn.execute(text(f"CREATE SCHEMA IF NOT EXISTS {schema}"))
                logger.info(f"Schema {schema} created/verified")
            
            conn.commit()
            logger.info("All schemas created successfully")
            
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        raise

def get_db():
    """Get database session for migrations"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_master_db():
    """Get database session for master database"""
    db = MasterSessionLocal()
    try:
        yield db
    finally:
        db.close() 