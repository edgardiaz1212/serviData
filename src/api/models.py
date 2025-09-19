from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from sqlalchemy import LargeBinary
# Import hashing functions
from werkzeug.security import generate_password_hash, check_password_hash

from sqlalchemy.orm import relationship

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # e.g., 'Admin', 'User'
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

class Cliente(db.Model):
    __tablename__ = 'clientes'
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(50), nullable=False)  # e.g., 'Publica', 'Privada'
    rif = db.Column(db.String(20), unique=True, nullable=False)
    razon_social = db.Column(db.String(200), nullable=False)
    fecha_creacion_cliente = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    servicios = relationship("Servicio", back_populates="cliente", cascade="all, delete-orphan")
    documentos = relationship("Documento", back_populates="cliente", cascade="all, delete-orphan")

    def serialize(self):
        return {
            'id': self.id,
            'tipo': self.tipo,
            'rif': self.rif,
            'razon_social': self.razon_social,
            'fecha_creacion_cliente': self.fecha_creacion_cliente.isoformat() if self.fecha_creacion_cliente else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

class Servicio(db.Model):
    __tablename__ = 'servicios'
    id = db.Column(db.Integer, primary_key=True)
    # Identificación y Contrato
    contrato = db.Column(db.String(100))
    tipo_servicio = db.Column(db.String(100))
    estado_contrato = db.Column(db.String(50))
    facturado = db.Column(db.String(10))
    # Información del Servicio/Plan
    plan_anterior = db.Column(db.String(100))
    plan_facturado = db.Column(db.String(100))
    plan_aprovisionado = db.Column(db.String(100))
    plan_servicio = db.Column(db.String(100))
    descripcion = db.Column(db.Text)
    estado_servicio = db.Column(db.String(50), default='Nuevo')
    # Información de Dominio y DNS
    dominio = db.Column(db.String(100))
    dns_dominio = db.Column(db.String(100))
    # Ubicación y Espacio Físico
    ubicacion = db.Column(db.String(100))
    ubicacion_sala = db.Column(db.String(100))
    cantidad_ru = db.Column(db.Integer, default=0)
    cantidad_m2 = db.Column(db.Integer, default=0)
    cantidad_bastidores = db.Column(db.Integer, default=0)
    # Información de Hardware/Infraestructura
    hostname = db.Column(db.String(100))
    nombre_servidor = db.Column(db.String(100))
    nombre_nodo = db.Column(db.String(100))
    nombre_plataforma = db.Column(db.String(100))
    ram = db.Column(db.Integer, default=0)
    hdd = db.Column(db.Integer, default=0)
    cpu = db.Column(db.Integer, default=0)
    datastore = db.Column(db.String(100))
    # Red e IP
    ip_privada = db.Column(db.String(50))
    ip_publica = db.Column(db.String(50))
    vlan = db.Column(db.String(50))
    ipam = db.Column(db.String(50))
    # Observaciones y Comentarios
    observaciones = db.Column(db.Text)
    comentarios = db.Column(db.Text)
    # Fechas
    fecha_creacion_servicio = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    # Foreign Key
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)

    cliente = relationship("Cliente", back_populates="servicios")
    documentos = relationship("Documento", back_populates="servicio", cascade="all, delete-orphan")

    def serialize(self):
        return {
            'id': self.id,
            'contrato': self.contrato,
            'tipo_servicio': self.tipo_servicio,
            'estado_contrato': self.estado_contrato,
            'facturado': self.facturado,
            'plan_anterior': self.plan_anterior,
            'plan_facturado': self.plan_facturado,
            'plan_aprovisionado': self.plan_aprovisionado,
            'plan_servicio': self.plan_servicio,
            'descripcion': self.descripcion,
            'estado_servicio': self.estado_servicio,
            'dominio': self.dominio,
            'dns_dominio': self.dns_dominio,
            'ubicacion': self.ubicacion,
            'ubicacion_sala': self.ubicacion_sala,
            'cantidad_ru': self.cantidad_ru,
            'cantidad_m2': self.cantidad_m2,
            'cantidad_bastidores': self.cantidad_bastidores,
            'hostname': self.hostname,
            'nombre_servidor': self.nombre_servidor,
            'nombre_nodo': self.nombre_nodo,
            'nombre_plataforma': self.nombre_plataforma,
            'ram': self.ram,
            'hdd': self.hdd,
            'cpu': self.cpu,
            'datastore': self.datastore,
            'ip_privada': self.ip_privada,
            'ip_publica': self.ip_publica,
            'vlan': self.vlan,
            'ipam': self.ipam,
            'observaciones': self.observaciones,
            'comentarios': self.comentarios,
            'fecha_creacion_servicio': self.fecha_creacion_servicio.isoformat() if self.fecha_creacion_servicio else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'cliente_id': self.cliente_id,
        }

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    status = db.Column(db.String)  # e.g. 'completed', 'near completion', 'current phase'
    avance_real = db.Column(db.Float, default=0.0)  # Real progress percentage
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    phases = relationship("Phase", back_populates="project", cascade="all, delete-orphan")

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'status': self.status,
            'avance_real': self.avance_real,
            'phases': [phase.serialize() for phase in self.phases],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

class Phase(db.Model):
    __tablename__ = 'phases'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String, nullable=False)
    wbs_code = db.Column(db.String)  # Work Breakdown Structure code
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    weight = db.Column(db.Float, default=0.0)  # Weight of the phase in project
    avance_real = db.Column(db.Float, default=0.0)  # Real progress percentage
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="phases")
    activities = relationship("Activity", back_populates="phase", cascade="all, delete-orphan")

    def serialize(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'name': self.name,
            'wbs_code': self.wbs_code,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'weight': self.weight,
            'avance_real': self.avance_real,
            'activities': [activity.serialize() for activity in self.activities],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

class Activity(db.Model):
    __tablename__ = 'activities'
    id = db.Column(db.Integer, primary_key=True)
    phase_id = db.Column(db.Integer, db.ForeignKey('phases.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String, nullable=False)
    wbs_code = db.Column(db.String)  # Work Breakdown Structure code
    duration_days = db.Column(db.Integer)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    predecessors = db.Column(db.String)  # Comma-separated list of predecessor activity IDs or WBS codes
    weight = db.Column(db.Float, default=0.0)  # Planned percentage (calculated automatically)
    cumplimiento_real = db.Column(db.Float, default=0.0)  # Real completion percentage (0, 25, 50, 75, 100)
    avance_real = db.Column(db.Float, default=0.0)  # Real progress percentage (calculated as cumplimiento_real * weight)
    desviacion = db.Column(db.Float, default=0.0)  # Deviation (calculated as avance_real - weight)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    phase = relationship("Phase", back_populates="activities")

    def serialize(self):
        return {
            'id': self.id,
            'phase_id': self.phase_id,
            'name': self.name,
            'wbs_code': self.wbs_code,
            'duration_days': self.duration_days,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'predecessors': self.predecessors,
            'weight': self.weight,
            'cumplimiento_real': self.cumplimiento_real,
            'avance_real': self.avance_real,
            'desviacion': self.desviacion,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

class Documento(db.Model):
    __tablename__ = 'documentos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String, nullable=False)
    tipo = db.Column(db.String, nullable=False)
    tamaño = db.Column(db.Integer, nullable=False)
    contenido = db.Column(LargeBinary, nullable=False)
    # Use ondelete='SET NULL' or 'CASCADE' depending on desired behavior when related entity is deleted
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id', ondelete='CASCADE'), nullable=True)
    servicio_id = db.Column(db.Integer, db.ForeignKey('servicios.id', ondelete='CASCADE'), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    cliente = db.relationship("Cliente", back_populates="documentos")
    servicio = db.relationship("Servicio", back_populates="documentos")
    
    def serialize(self):
        # Full serialization including content might be large.
        # Consider a 'basic' version without content for lists.
        return {
            'id': self.id,
            'nombre': self.nombre,
            'tipo': self.tipo,
            'tamaño': self.tamaño,
            'cliente_id': self.cliente_id,
            'servicio_id': self.servicio_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            # 'content': self.contenido # Be careful exposing raw binary content via JSON
        }

    def serialize_basic(self):
        # A lighter version for embedding in other objects
         return {
            'id': self.id,
            'nombre': self.nombre,
            'tipo': self.tipo,
            'tamaño': self.tamaño,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
