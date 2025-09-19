# c:\Users\Edgar\Documents\GitHub\serviData\src\api\models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from sqlalchemy import LargeBinary
# Import hashing functions
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Cliente(db.Model):
    __tablename__ = 'clientes'
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String)
    rif = db.Column(db.String, unique=True, nullable=False) # Added unique and nullable
    razon_social = db.Column(db.String, nullable=False) # Added nullable
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    fecha_creacion_cliente = db.Column(db.DateTime, nullable=True)  # Custom creation date for client

    documentos = db.relationship("Documento", back_populates="cliente", cascade="all, delete-orphan") # Added cascade
    servicios = db.relationship("Servicio", back_populates="cliente", cascade="all, delete-orphan") # Added cascade

    def serialize(self):
        # Avoid serializing documents here if it causes excessive data load,
        # fetch them separately if needed via a specific endpoint.
        return {
            'id': self.id,
            'tipo': self.tipo,
            'rif': self.rif,
            'razon_social': self.razon_social,
            'fecha_creacion_cliente': self.fecha_creacion_cliente.isoformat() if self.fecha_creacion_cliente else None,
            # 'documentos': [doc.serialize_basic() for doc in self.documentos], # Consider a basic serialization
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

class Servicio(db.Model):
    __tablename__ = 'servicios'
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id', ondelete='CASCADE'), nullable=False) # Added ondelete and nullable
    contrato = db.Column(db.String)
    estado_contrato = db.Column(db.String)
    estado_servicio = db.Column(db.String, default="Nuevo", nullable=False) # Added nullable
    dominio = db.Column(db.String)
    dns_dominio = db.Column(db.String)
    tipo_servicio = db.Column(db.String, nullable=False) # Added nullable
    plan_aprovisionado = db.Column(db.String)
    plan_servicio = db.Column(db.String)
    plan_anterior = db.Column(db.String)
    plan_facturado = db.Column(db.String)
    facturado = db.Column(db.String)
    descripcion = db.Column(db.String)
    hostname = db.Column(db.String)
    ip_privada = db.Column(db.String)
    ip_publica = db.Column(db.String)
    vlan = db.Column(db.String)
    ipam = db.Column(db.String)
    datastore = db.Column(db.String)
    nombre_servidor = db.Column(db.String)
    nombre_nodo = db.Column(db.String)
    nombre_plataforma = db.Column(db.String)
    ram = db.Column(db.Integer)
    hdd = db.Column(db.Integer)
    cpu = db.Column(db.Integer)
    cantidad_ru = db.Column(db.Integer)
    cantidad_m2 = db.Column(db.Integer)
    cantidad_bastidores =db.Column(db.Integer)
    ubicacion = db.Column(db.String)
    ubicacion_sala = db.Column(db.String)
    observaciones = db.Column(db.String)
    comentarios = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    fecha_creacion_servicio = db.Column(db.DateTime, nullable=True)  # Custom creation date for service

    documentos = db.relationship("Documento", back_populates="servicio", cascade="all, delete-orphan") # Added cascade
    cliente = db.relationship("Cliente", back_populates="servicios")

    def serialize(self):
        # Serialize basic client info to avoid recursion depth issues
        client_info = None
        if self.cliente:
            client_info = {
                'id': self.cliente.id,
                'rif': self.cliente.rif,
                'razon_social': self.cliente.razon_social,
                'tipo': self.cliente.tipo
            }

        return {
            "id": self.id,
            "cliente": client_info, # Use basic client info
            "cliente_id": self.cliente_id,
            "contrato": self.contrato,
            "estado_contrato": self.estado_contrato,
            "estado_servicio": self.estado_servicio,
            "dominio": self.dominio,
            "dns_dominio": self.dns_dominio,
            "tipo_servicio": self.tipo_servicio.replace("Pública", "Publica") if self.tipo_servicio else self.tipo_servicio,
            "plan_aprovisionado": self.plan_aprovisionado,
            "plan_servicio": self.plan_servicio,
            "plan_anterior": self.plan_anterior,
            "plan_facturado": self.plan_facturado,
            "facturado": self.facturado,
            "descripcion": self.descripcion,
            "hostname": self.hostname,
            "ip_privada": self.ip_privada,
            "ip_publica": self.ip_publica,
            "vlan": self.vlan,
            "ipam": self.ipam,
            "datastore": self.datastore,
            "nombre_servidor": self.nombre_servidor,
            "nombre_nodo": self.nombre_nodo,
            "nombre_plataforma": self.nombre_plataforma,
            "ram": self.ram,
            "hdd": self.hdd,
            "cpu": self.cpu,
            "cantidad_ru": self.cantidad_ru,
            "cantidad_m2": self.cantidad_m2,
            "cantidad_bastidores": self.cantidad_bastidores,
            "ubicacion": self.ubicacion,
            "ubicacion_sala": self.ubicacion_sala,
            "observaciones": self.observaciones,
            "comentarios": self.comentarios,
            "fecha_creacion_servicio": self.fecha_creacion_servicio.isoformat() if self.fecha_creacion_servicio else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            # 'documentos': [doc.serialize_basic() for doc in self.documentos], # Consider basic serialization
        }

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False) # Added nullable=False
    # This column will store the HASH of the password, not the password itself
    password = db.Column(db.String, nullable=False) # Added nullable=False
    role = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc)) # Added created_at
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc)) # Added updated_at

    # Method to set the password (hashes it)
    def set_password(self, password_text):
        """Hashes the password and stores it."""
        # The method parameter controls the complexity and salt length.
        # 'pbkdf2:sha256' is a good default.
        self.password = generate_password_hash(password_text, method='pbkdf2:sha256')

    # Method to check the password
    def check_password(self, password_text):
        """Checks if the provided password matches the stored hash."""
        return check_password_hash(self.password, password_text)

    def serialize(self):
        # IMPORTANT: DO NOT serialize the password hash
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None, # Serialize timestamps
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

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    edt_structure = db.Column(db.String)  # Hierarchical EDT structure
    num_phases = db.Column(db.Integer, nullable=False)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    total_duration = db.Column(db.Integer)  # Total days
    status = db.Column(db.String, default="En progreso")  # Completed, Near completion, etc.
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    phases = db.relationship("Phase", back_populates="project", cascade="all, delete-orphan")

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'edt_structure': self.edt_structure,
            'num_phases': self.num_phases,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'total_duration': self.total_duration,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'phases': [phase.serialize() for phase in self.phases]
        }

class Phase(db.Model):
    __tablename__ = 'phases'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String, nullable=False)
    order = db.Column(db.Integer, nullable=False)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    duration = db.Column(db.Integer)  # Days
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    project = db.relationship("Project", back_populates="phases")
    activities = db.relationship("Activity", back_populates="phase", cascade="all, delete-orphan")

    def serialize(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'name': self.name,
            'order': self.order,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'duration': self.duration,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'activities': [activity.serialize() for activity in self.activities]
        }

class Activity(db.Model):
    __tablename__ = 'activities'
    id = db.Column(db.Integer, primary_key=True)
    phase_id = db.Column(db.Integer, db.ForeignKey('phases.id', ondelete='CASCADE'), nullable=False)
    description = db.Column(db.String, nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # Days
    predecessors = db.Column(db.String)  # Comma-separated IDs
    planned_start = db.Column(db.DateTime)
    planned_end = db.Column(db.DateTime)
    planned_percent = db.Column(db.Float)  # Calculated
    real_compliance = db.Column(db.Float, default=0.0)  # 0-100%
    real_percent = db.Column(db.Float, default=0.0)  # Calculated
    deviation = db.Column(db.Float, default=0.0)  # real_percent - planned_percent
    accumulated_deviation = db.Column(db.Float, default=0.0)
    status = db.Column(db.String, default="Pendiente")
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    phase = db.relationship("Phase", back_populates="activities")

    def serialize(self):
        return {
            'id': self.id,
            'phase_id': self.phase_id,
            'description': self.description,
            'duration': self.duration,
            'predecessors': self.predecessors,
            'planned_start': self.planned_start.isoformat() if self.planned_start else None,
            'planned_end': self.planned_end.isoformat() if self.planned_end else None,
            'planned_percent': self.planned_percent,
            'real_compliance': self.real_compliance,
            'real_percent': self.real_percent,
            'deviation': self.deviation,
            'accumulated_deviation': self.accumulated_deviation,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
