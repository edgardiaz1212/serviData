from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Cliente(db.Model):
    __tablename__ = 'clientes'
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String)
    rif = db.Column(db.String)
    razon_social = db.Column(db.String)
    
    servicios = db.relationship("Servicio", back_populates="cliente")

    def serialize(self):
        return {
            'id': self.id,
            'tipo': self.tipo,
            'rif': self.rif,
            'razon_social': self.razon_social,
        }

class Servicio(db.Model):
    __tablename__ = 'servicios'
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'))
    dominio = db.Column(db.String)
    estado = db.Column(db.String)
    tipo_servicio = db.Column(db.String)
    hostname = db.Column(db.String)
    cores = db.Column(db.Integer)
    contrato = db.Column(db.String)
    plan_aprovisionado = db.Column(db.String)
    plan_facturado = db.Column(db.String)
    detalle_plan = db.Column(db.String)
    sockets = db.Column(db.Integer)
    powerstate = db.Column(db.String)
    ip_privada = db.Column(db.String)
    vlan = db.Column(db.String)
    ipam = db.Column(db.String)
    datastore = db.Column(db.String)
    nombre_servidor = db.Column(db.String)
    marca_servidor = db.Column(db.String)
    modelo_servidor = db.Column(db.String)
    nombre_nodo = db.Column(db.String)
    nombre_plataforma = db.Column(db.String)
    ram = db.Column(db.Integer)
    hdd = db.Column(db.Integer)
    cpu = db.Column(db.Integer)
    tipo_servidor = db.Column(db.String)
    ubicacion = db.Column(db.String)
    observaciones = db.Column(db.String)
    facturado = db.Column(db.String)
    comentarios = db.Column(db.String)

    cliente = db.relationship("Cliente", back_populates="servicios")

    def serialize(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'dominio': self.dominio,
            'estado': self.estado,
            'tipo_servicio': self.tipo_servicio,
            'hostname': self.hostname,
            'cores': self.cores,
            'contrato': self.contrato,
            'plan_aprovisionado': self.plan_aprovisionado,
            'plan_facturado': self.plan_facturado,
            'detalle_plan': self.detalle_plan,
            'sockets': self.sockets,
            'powerstate': self.powerstate,
            'ip_privada': self.ip_privada,
            'vlan': self.vlan,
            'ipam': self.ipam,
            'datastore': self.datastore,
            'nombre_servidor': self.nombre_servidor,
            'marca_servidor': self.marca_servidor,
            'modelo_servidor': self.modelo_servidor,
            'observaciones': self.observaciones,
            'facturado': self.facturado,
            'comentarios': self.comentarios
        }

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    role = db.Column(db.String)
    
    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
        }

def create_connection(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    db.init_app(app)


            # do not serialize the password, its a security breac


def create_connection(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    db.init_app(app)

def create_tables():
    db.create_all()
    
    session = db.session
    if not session.query(User).filter_by(username='admin').first():
        admin_user = User(username='admin', password='administrator', role='Admin')
        session.add(admin_user)
        session.commit()
    session.close()

if __name__ == '__main__':
    create_tables()
