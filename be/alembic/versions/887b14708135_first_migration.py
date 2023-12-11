"""First migration

Revision ID: 887b14708135
Revises: 
Create Date: 2023-12-03 21:42:24.404265

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '887b14708135'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    # op.create_index(op.f('ix_movielists_day_of_creation'), 'movielists', ['day_of_creation'], unique=False)
    # op.create_index(op.f('ix_movielists_id'), 'movielists', ['id'], unique=False)
    # op.create_index(op.f('ix_movielists_month_of_creation'), 'movielists', ['month_of_creation'], unique=False)
    # op.create_index(op.f('ix_movielists_name'), 'movielists', ['name'], unique=False)
    # op.create_index(op.f('ix_movielists_year_of_creation'), 'movielists', ['year_of_creation'], unique=False)
    # op.create_index(op.f('ix_movies_id'), 'movies', ['id'], unique=False)
    # op.create_index(op.f('ix_movies_year_of_release'), 'movies', ['year_of_release'], unique=False)
    op.alter_column('users', 'username',
               existing_type=mysql.VARCHAR(length=32),
               nullable=False)
    op.alter_column('users', 'password_hash',
               existing_type=mysql.VARCHAR(length=72),
               nullable=False)
    op.alter_column('users', 'avatar_url',
               existing_type=mysql.VARCHAR(length=128),
               type_=sa.String(length=256),
               existing_nullable=True)
    op.drop_index('ix_users_email', table_name='users')
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.create_index('ix_users_email', 'users', ['email'], unique=False)
    op.alter_column('users', 'avatar_url',
               existing_type=sa.String(length=256),
               type_=mysql.VARCHAR(length=128),
               existing_nullable=True)
    op.alter_column('users', 'password_hash',
               existing_type=mysql.VARCHAR(length=72),
               nullable=True)
    op.alter_column('users', 'username',
               existing_type=mysql.VARCHAR(length=32),
               nullable=True)
    op.drop_index(op.f('ix_movies_year_of_release'), table_name='movies')
    op.drop_index(op.f('ix_movies_id'), table_name='movies')
    op.drop_index(op.f('ix_movielists_year_of_creation'), table_name='movielists')
    op.drop_index(op.f('ix_movielists_name'), table_name='movielists')
    op.drop_index(op.f('ix_movielists_month_of_creation'), table_name='movielists')
    op.drop_index(op.f('ix_movielists_id'), table_name='movielists')
    op.drop_index(op.f('ix_movielists_day_of_creation'), table_name='movielists')
    # ### end Alembic commands ###
