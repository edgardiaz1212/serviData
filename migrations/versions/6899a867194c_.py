"""empty message

Revision ID: 6899a867194c
Revises: fab0b6c5bc04
Create Date: 2025-02-17 11:32:09.297495

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6899a867194c'
down_revision = 'fab0b6c5bc04'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('servicios', schema=None) as batch_op:
        batch_op.add_column(sa.Column('estado_servicio', sa.String(), nullable=True))
        batch_op.drop_column('is_new')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('servicios', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_new', sa.BOOLEAN(), autoincrement=False, nullable=True))
        batch_op.drop_column('estado_servicio')

    # ### end Alembic commands ###
