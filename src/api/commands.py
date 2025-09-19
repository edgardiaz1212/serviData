# c:\Users\Edgar\Documents\GitHub\serviData\src\api\commands.py

import click
from flask.cli import with_appcontext
from .models import db, User  # Asegúrate que la importación sea correcta según tu estructura
from sqlalchemy.exc import IntegrityError
import logging

# Configura el logging si quieres ver logs desde los comandos
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

def setup_commands(app):
    """
    Registra comandos personalizados con la aplicación Flask.
    Esta función será llamada desde tu archivo principal (app.py o main.py).
    """

    @app.cli.command("create-admin")
    @click.option('--username', prompt="Enter admin username", help='Username for the new admin user.')
    @click.option('--password', prompt="Enter admin password", hide_input=True, confirmation_prompt=True, help='Password for the new admin user.')
    @with_appcontext  # Asegura que el comando se ejecute dentro del contexto de la aplicación
    def create_admin(username, password):
        """Creates a new user with the 'Admin' role."""
        log.info(f"Attempting to create admin user: {username}")

        # Verificar si el usuario ya existe
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            click.echo(click.style(f"Error: Username '{username}' already exists.", fg='red'))
            log.warning(f"Admin creation failed: Username '{username}' already exists.")
            return # Salir del comando

        # Validar longitud de contraseña (ejemplo básico)
        if len(password) < 6:
             click.echo(click.style("Error: Password must be at least 6 characters long.", fg='red'))
             log.warning(f"Admin creation failed for '{username}': Password too short.")
             return

        # Crear el nuevo usuario administrador
        admin_user = User(username=username, role='Admin')
        admin_user.set_password(password) # Hashear la contraseña

        try:
            db.session.add(admin_user)
            db.session.commit()
            click.echo(click.style(f"Admin user '{username}' created successfully.", fg='green'))
            log.info(f"Admin user '{username}' created successfully.")
        except IntegrityError: # Captura error si la constraint unique falla (aunque ya chequeamos antes)
            db.session.rollback()
            click.echo(click.style(f"Error: Could not create admin user '{username}'. Integrity constraint failed.", fg='red'))
            log.error(f"Admin creation failed for '{username}': IntegrityError.", exc_info=True)
        except Exception as e:
            db.session.rollback()
            click.echo(click.style(f"An unexpected error occurred: {str(e)}", fg='red'))
            log.error(f"Admin creation failed for '{username}': Unexpected error.", exc_info=True)

    @app.cli.command("list-users")
    @with_appcontext
    def list_users():
        """Lists all registered users."""
        log.info("Listing all users.")
        try:
            users = User.query.order_by(User.id).all()
            if not users:
                click.echo("No users found in the database.")
                log.info("No users found.")
                return

            click.echo("------------------------------------")
            click.echo("| ID  | Username           | Role  |")
            click.echo("------------------------------------")
            for user in users:
                click.echo(f"| {user.id:<3} | {user.username:<18} | {user.role:<5} |")
            click.echo("------------------------------------")
        except Exception as e:
            click.echo(click.style(f"An error occurred while listing users: {str(e)}", fg='red'))
            log.error("Error listing users.", exc_info=True)

    @app.cli.command("seed-database")
    @with_appcontext
    def seed_database():
        """Adds initial data to the database from seed_test_data.sql."""
        from sqlalchemy import text
        log.info("Seeding database from seed_test_data.sql...")
        try:
            with open('seed_test_data.sql', 'r') as f:
                sql = f.read()
            db.session.execute(text(sql))
            db.session.commit()
            click.echo(click.style("Database seeded successfully.", fg='green'))
            log.info("Database seeded successfully.")
        except Exception as e:
            db.session.rollback()
            click.echo(click.style(f"An error occurred while seeding database: {str(e)}", fg='red'))
            log.error("Error seeding database.", exc_info=True)

# No necesitas llamar a setup_commands aquí. Se llamará desde app.py
