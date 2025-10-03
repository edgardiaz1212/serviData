import os
from flask_admin import Admin
from .models import db, User, Servicio, Cliente, Documento, Project, Phase, Activity, AttentionPoint
from flask_admin.contrib.sqla import ModelView

class ProjectAdmin(ModelView):
    column_list = ['id', 'name', 'num_phases', 'start_date', 'end_date', 'total_duration', 'status', 'user', 'created_at', 'updated_at']
    column_formatters = {
        'user': lambda v, c, m, p: m.user.username if m.user else 'None'
    }

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='DCCE Admin', template_mode='bootstrap3')
 # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Servicio, db.session))
    admin.add_view(ModelView(Cliente, db.session))
    admin.add_view(ModelView(Documento, db.session))
    admin.add_view(ProjectAdmin(Project, db.session))
    admin.add_view(ModelView(Phase, db.session))
    admin.add_view(ModelView(Activity, db.session))
    admin.add_view(ModelView(AttentionPoint, db.session))


    # You can duplicate that line to add new models
    # admin.add_view(ModelView(YourModelName, db.session))
