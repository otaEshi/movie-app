"""add is_deleted

Revision ID: 3037e553e188
Revises: 
Create Date: 2023-12-26 22:26:48.905424

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3037e553e188'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('moviecomments', sa.Column('is_deleted', sa.Boolean(), nullable=True))
    op.add_column('movielists', sa.Column('is_deleted', sa.Boolean(), nullable=True))
    op.add_column('movieratings', sa.Column('is_deleted', sa.Boolean(), nullable=True))
    op.add_column('movies', sa.Column('is_deleted', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('movies', 'is_deleted')
    op.drop_column('movieratings', 'is_deleted')
    op.drop_column('movielists', 'is_deleted')
    op.drop_column('moviecomments', 'is_deleted')
    # ### end Alembic commands ###