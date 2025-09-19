import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from api.models import db, User
from app import app
from werkzeug.security import generate_password_hash

with app.app_context():
    # Check if admin user exists
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(username='admin', role='Admin')
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("Admin user created")
    else:
        print("Admin user already exists")
