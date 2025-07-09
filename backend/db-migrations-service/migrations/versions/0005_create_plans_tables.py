"""Create plans tables

Revision ID: 0005
Revises: 0004
Create Date: 2024-01-15 10:04:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0005'
down_revision = '0004'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create plans.plans table
    op.create_table(
        'plans',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('teacher_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('subject_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('course_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('organization_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='draft'),
        sa.Column('difficulty_level', sa.String(length=20), nullable=False, server_default='medium'),
        sa.Column('estimated_duration', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['teacher_id'], ['auth.users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.organizations.id'], ondelete='CASCADE'),
        schema='plans'
    )
    
    # Create plans.plan_jobs table
    op.create_table(
        'plan_jobs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('plan_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('teacher_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='pending'),
        sa.Column('progress', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('result_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['plan_id'], ['plans.plans.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['teacher_id'], ['auth.users.id'], ondelete='CASCADE'),
        schema='plans'
    )
    
    # Create plans.plan_results table
    op.create_table(
        'plan_results',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('plan_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('student_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('score', sa.Numeric(precision=5, scale=2), nullable=True),
        sa.Column('completion_percentage', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('time_spent', sa.Integer(), nullable=True),
        sa.Column('feedback', sa.Text(), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['plan_id'], ['plans.plans.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['student_id'], ['auth.users.id'], ondelete='CASCADE'),
        schema='plans'
    )
    
    # Create plans.plan_files table
    op.create_table(
        'plan_files',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('plan_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('file_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('file_type', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['plan_id'], ['plans.plans.id'], ondelete='CASCADE'),
        schema='plans'
    )
    
    # Create indexes
    op.create_index('idx_plans_teacher_id', 'plans', ['teacher_id'], schema='plans')
    op.create_index('idx_plans_organization_id', 'plans', ['organization_id'], schema='plans')
    op.create_index('idx_plan_jobs_teacher_id', 'plan_jobs', ['teacher_id'], schema='plans')
    op.create_index('idx_plan_results_plan_id', 'plan_results', ['plan_id'], schema='plans')


def downgrade() -> None:
    # Drop indexes
    op.drop_index('idx_plan_results_plan_id', table_name='plan_results', schema='plans')
    op.drop_index('idx_plan_jobs_teacher_id', table_name='plan_jobs', schema='plans')
    op.drop_index('idx_plans_organization_id', table_name='plans', schema='plans')
    op.drop_index('idx_plans_teacher_id', table_name='plans', schema='plans')
    
    # Drop tables
    op.drop_table('plan_files', schema='plans')
    op.drop_table('plan_results', schema='plans')
    op.drop_table('plan_jobs', schema='plans')
    op.drop_table('plans', schema='plans') 