from src.app import app, db
from sqlalchemy import text

with app.app_context():
    with open('seed_test_data.sql', 'r') as f:
        sql = f.read()
    db.session.execute(text(sql))
    db.session.commit()
    print("Seed data inserted successfully.")
