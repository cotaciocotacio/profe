"""Create all schemas

Revision ID: 0001
Revises: 
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create all schemas
    schemas = [
        'auth', 'users', 'organizations', 'academic', 
        'plans', 'chat', 'analytics', 'files'
    ]
    
    for schema in schemas:
        op.execute(f"CREATE SCHEMA IF NOT EXISTS {schema}")


def downgrade() -> None:
    # Drop all schemas (be careful with this in production!)
    schemas = [
        'auth', 'users', 'organizations', 'academic', 
        'plans', 'chat', 'analytics', 'files'
    ]
    
    for schema in schemas:
        op.execute(f"DROP SCHEMA IF EXISTS {schema} CASCADE") 