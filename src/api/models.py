from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from sqlalchemy import LargeBinary

db = SQLAlchemy()

class Cliente(db.Model):
    __tablename__ = 'clientes'
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String)
    rif = db.Column(db.String)
    razon_social = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))  # Fecha de creación
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))  # Fecha de actualización

    documentos = db.relationship("Documento", back_populates="cliente")    
    servicios = db.relationship("Servicio", back_populates="cliente")

    def serialize(self):
        return {
            'id': self.id,
            'tipo': self.tipo,
            'rif': self.rif,
            'razon_social': self.razon_social,
            'documentos': [doc.serialize() for doc in self.documentos],  # Serializar documentos
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
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
    estado_servicio = db.Column(db.String, default="Nuevo")  # Valores posibles: "Nuevo", "Aprovisionado", "Reaprovisionado"

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))  # Fecha de creación
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))  # Fecha de actualización
    
    documentos = db.relationship("Documento", back_populates="servicio")
    cliente = db.relationship("Cliente", back_populates="servicios")

    def serialize(self):
        return {
            'id': self.id,
            'tipo_servicio': self.tipo_servicio,
            'cliente_id': self.cliente_id,
            'dominio': self.dominio,
            'estado': self.estado,
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
            'nombre_nodo': self.nombre_nodo,
            'nombre_plataforma': self.nombre_plataforma,
            'ram': self.ram,
            'hdd': self.hdd,
            'cpu': self.cpu,
            'tipo_servidor': self.tipo_servidor,
            'ubicacion': self.ubicacion,
            'observaciones': self.observaciones,
            'facturado': self.facturado,
            'comentarios': self.comentarios,
            'estado_servicio': self.estado_servicio,
            'documentos': [doc.serialize() for doc in self.documentos],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String)  # do not serialize the password, it's a security breach
    role = db.Column(db.String)
    
    # def __repr__(self):
    #     return f'<User {self.username}>'

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
        }
    
class Documento(db.Model):
    __tablename__ = 'documentos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String, nullable=False)  # Nombre del archivo
    tipo = db.Column(db.String, nullable=False)   # Tipo de archivo (PDF, DOCX, etc.)
    tamaño = db.Column(db.Integer, nullable=False) # Tamaño en bytes
    contenido = db.Column(LargeBinary, nullable=False) # Contenido del archivo
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=True) # Relación con cliente
    servicio_id = db.Column(db.Integer, db.ForeignKey('servicios.id'), nullable=True) # Relación con servicio
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relaciones
    cliente = db.relationship("Cliente", back_populates="documentos")
    servicio = db.relationship("Servicio", back_populates="documentos")

    # Validación: Un documento debe estar relacionado con un cliente o un servicio, pero no con ambos
    def validate_relationships(self):
        if self.cliente_id is None and self.servicio_id is None:
            raise ValueError("Un documento debe estar relacionado con un cliente o un servicio.")
        if self.cliente_id is not None and self.servicio_id is not None:
            raise ValueError("Un documento no puede estar relacionado con un cliente y un servicio al mismo tiempo.")

    def __init__(self, **kwargs):
        super(Documento, self).__init__(**kwargs)
        self.validate_relationships()

    def serialize(self):
            return {
            'id': self.id,
            'nombre': self.nombre,
            'tipo': self.tipo,
            'tamaño': self.tamaño,
            'cliente_id': self.cliente_id,
            'servicio_id': self.servicio_id,
            'created_at': self.created_at.isoformat(),
        }