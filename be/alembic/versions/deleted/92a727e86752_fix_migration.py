"""fix migration

Revision ID: 92a727e86752
Revises: 2624f27fc11f
Create Date: 2023-12-12 21:49:19.815822

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '92a727e86752'
down_revision: Union[str, None] = '2624f27fc11f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass
    # ### commands auto generated by Alembic - please adjust! ###
    # op.drop_index('ix_movieviews_created_at', table_name='movieviews')
    # op.drop_index('ix_movieviews_id', table_name='movieviews')
    # op.drop_index('ix_movieviews_view_count', table_name='movieviews')
    # op.drop_table('movieviews')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('movieviews',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('movie_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('view_count', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', mysql.DATETIME(), nullable=True),
    sa.ForeignKeyConstraint(['movie_id'], ['movies.id'], name='movieviews_ibfk_1'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_index('ix_movieviews_view_count', 'movieviews', ['view_count'], unique=False)
    op.create_index('ix_movieviews_id', 'movieviews', ['id'], unique=False)
    op.create_index('ix_movieviews_created_at', 'movieviews', ['created_at'], unique=False)
    # ### end Alembic commands ###