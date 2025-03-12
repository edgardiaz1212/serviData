from flask import Flask, request, jsonify, url_for, Blueprint, session, send_file
from werkzeug.utils import secure_filename
import io
import os
from io import BytesIO
from api.models import db, User, Cliente, Servicio, Documento
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import pandas as pd
from datetime import datetime, timedelta
from sqlalchemy import func, extract
import logging
from sqlalchemy.exc import SQLAlchemyError
import logging
# Set up logging
logging.basicConfig(level=logging.DEBUG)

api = Blueprint('api', __name__)
CORS(api)

# ------------------------------
# Acciones para Usuario
# ------------------------------

@api.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        return jsonify({"message": "Login successful", "user": user.serialize()}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@api.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')
    new_user = User(username=username, password=password, role=role)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully", "user": new_user.serialize()}), 201

@api.route('/users/<int:user_id>', methods=['PUT'])
def edit_user(user_id):
    data = request.get_json()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    user.username = data.get('username', user.username)
    if 'role' in data:
        user.role = data['role']
    user.password = data.get('password', user.password)
    db.session.commit()
    return jsonify({"message": "User updated successfully", "user": user.serialize()}), 200

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    if not users:
        return jsonify({"message": "No users found"}), 404
    else:    
        return jsonify([user.serialize() for user in users]), 200

@api.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200

# ------------------------------
# Acciones para Cliente
# ------------------------------

@api.route('/add_client/', methods=['POST'])
def client_post():
    if request.method == 'POST':
        try:
            data = request.get_json()
            tipo = data.get('tipo')
            rif = data.get('rif')
            razon_social = data.get('razon_social')
            new_cliente = Cliente(tipo=tipo, rif=rif, razon_social=razon_social)
            db.session.add(new_cliente)
            db.session.commit()
            return jsonify({"message": "Client created successfully", "Cliente": new_cliente.serialize()}), 201
        except Exception as e:
            return jsonify({"message": f"Error creating client: {str(e)}"}), 500
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@api.route('/client-consult/', methods=['GET'])
def client_consult():
    name = request.args.get('name')  # Get the name parameter from the query string
    if name:
        cliente = Cliente.query.filter(Cliente.razon_social.ilike(f'%{name}%')).all()  # Search by name
    else:
        cliente = Cliente.query.all()
    if not cliente:
        return jsonify({"message": "No clients found"}), 404
    else:    
        return jsonify([c.serialize() for c in cliente]), 200

@api.route('/clientes/<int:client_id>', methods=['GET'])
def get_client_by_id(client_id):
    client = Cliente.query.get(client_id)
    if not client:
        return jsonify({"message": "Client not found"}), 404
    return jsonify(client.serialize()), 200

@api.route('/clients_tipo', methods=['GET'])
def get_clients_by_type():
    tipo = request.args.get('tipo')
    if tipo:
        clients = Cliente.query.filter_by(tipo=tipo).all()
    else:
        clients = Cliente.query.all()
    if not clients:
        return jsonify({"message": "No clients found"}), 404
    else:
        return jsonify([client.serialize() for client in clients]), 200

@api.route('/client-suggestions/', methods=['GET'])
def client_suggestions():
    query = request.args.get('query', '')
    if not query:
        return jsonify({"message": "Query parameter is required"}), 400
    clientes = Cliente.query.filter(Cliente.razon_social.ilike(f"%{query}%")).all()
    if not clientes:
        return jsonify({"message": "No clients found"}), 404
    else:
        return jsonify([cliente.serialize() for cliente in clientes]), 200

@api.route('/clientes/total', methods=['GET'])
def get_total_clients():
    total_clients = Cliente.query.count()
    return jsonify({"total": total_clients}), 200

@api.route('/client-counts-by-type', methods=['GET'])
def get_client_counts_by_type():
    try:
        client_counts = db.session.query(Cliente.tipo, db.func.count(Cliente.id)).group_by(Cliente.tipo).all()
        client_counts_dict = {tipo: count for tipo, count in client_counts}
        return jsonify(client_counts_dict)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/clients/<int:client_id>', methods=['PUT'])
def update_client(client_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se proporcionaron datos para actualizar"}), 400
        cliente = db.session.query(Cliente).get(client_id)
        if not cliente:
            return jsonify({"error": "Cliente no encontrado"}), 404
        if 'tipo' in data:
            cliente.tipo = data['tipo']
        if 'rif' in data:
            cliente.rif = data['rif']
        if 'razon_social' in data:
            cliente.razon_social = data['razon_social']
        db.session.commit()
        return jsonify(cliente.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500

@api.route('/clients/<int:client_id>', methods=['DELETE'])
def delete_client_and_services(client_id):
    try:
        client = Cliente.query.get(client_id)
        if not client:
            return jsonify({"message": "Client not found"}), 404
        try:
            servicios = Servicio.query.filter_by(cliente_id=client_id).all()
            for servicio in servicios:
                db.session.delete(servicio)
            db.session.delete(client)
            db.session.commit()
            return jsonify({"message": "Client and associated services deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            raise e
    except Exception as e:
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

# ------------------------------
# Acciones para Servicio
# ------------------------------

@api.route('/add_service/', methods=['POST'])
def service_post():
    if request.method == 'POST':
        data = request.get_json()

        # Identificación y Contrato
        contrato = data.get('contrato')
        tipo_servicio = data.get('tipo_servicio')
        estado_contrato = data.get('estado_contrato')
        facturado = data.get('facturado')

        # Información del Servicio/Plan
        plan_anterior = data.get('plan_anterior')
        plan_facturado = data.get('plan_facturado')
        plan_aprovisionado = data.get('plan_aprovisionado')
        plan_servicio = data.get('plan_servicio')
        descripcion = data.get('descripcion')
        estado_servicio = data.get('estado_servicio', 'Nuevo')

        # Información de Dominio y DNS
        dominio = data.get('dominio')
        dns_dominio = data.get('dns_dominio')

        # Ubicación y Espacio Físico
        ubicacion = data.get('ubicacion')
        ubicacion_sala = data.get('ubicacion_sala')
        cantidad_ru = int(data.get('cantidad_ru', 0)) if data.get('cantidad_ru') else 0
        cantidad_m2 = int(data.get('cantidad_m2', 0)) if data.get('cantidad_m2') else 0
        cantidad_bastidores = int(data.get('cantidad_bastidores', 0)) if data.get('cantidad_bastidores') else 0

        # Información de Hardware/Infraestructura
        hostname = data.get('hostname')
        nombre_servidor = data.get('nombre_servidor')
        nombre_nodo = data.get('nombre_nodo')
        nombre_plataforma = data.get('nombre_plataforma')
        ram = int(data.get('ram', 0)) if data.get('ram') else 0
        hdd = int(data.get('hdd', 0)) if data.get('hdd') else 0
        cpu = int(data.get('cpu', 0)) if data.get('cpu') else 0
        datastore = data.get('datastore')

        # Red e IP
        ip_privada = data.get('ip_privada')
        ip_publica = data.get('ip_publica')
        vlan = data.get('vlan')
        ipam = data.get('ipam')

        # Observaciones y Comentarios
        observaciones = data.get('observaciones')
        comentarios = data.get('comentarios')

        cliente_id = data.get('cliente_id')

        new_service = Servicio(
            contrato=contrato,
            tipo_servicio=tipo_servicio,
            estado_contrato=estado_contrato,
            facturado=facturado,
            plan_anterior=plan_anterior,
            plan_facturado=plan_facturado,
            plan_aprovisionado=plan_aprovisionado,
            plan_servicio=plan_servicio,
            descripcion=descripcion,
            estado_servicio=estado_servicio,
            dominio=dominio,
            dns_dominio=dns_dominio,
            ubicacion=ubicacion,
            ubicacion_sala=ubicacion_sala,
            cantidad_ru=cantidad_ru,
            cantidad_m2=cantidad_m2,
            cantidad_bastidores=cantidad_bastidores,
            hostname=hostname,
            nombre_servidor=nombre_servidor,
            nombre_nodo=nombre_nodo,
            nombre_plataforma=nombre_plataforma,
            ram=ram,
            hdd=hdd,
            cpu=cpu,
            datastore=datastore,
            ip_privada=ip_privada,
            ip_publica=ip_publica,
            vlan=vlan,
            ipam=ipam,
            observaciones=observaciones,
            comentarios=comentarios,
            cliente_id=cliente_id,
        )

        db.session.add(new_service)
        db.session.commit()
        return jsonify({"message": "Service created successfully", "service": new_service.serialize()}), 201
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@api.route('/servicios-by-cliente/<int:cliente_id>', methods=['GET'])
def get_services(cliente_id):
    try:
        # Verificar si el cliente existe
        cliente = Cliente.query.get(cliente_id)
        if not cliente:
            return jsonify({"message": "Client not found"}), 404

        # Obtener los servicios asociados al cliente
        services = Servicio.query.filter_by(cliente_id=cliente_id).all()

        # Si no hay servicios, devolver una respuesta clara
        if not services:
            return jsonify({"message": "This client has no associated services", "services": []}), 200

        # Devolver los servicios serializados
        return jsonify({"message": "Services retrieved successfully", "services": [service.serialize() for service in services]}), 200

    except Exception as e:
        # Manejar errores generales
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

@api.route('/servicios', methods=['GET'])
def get_all_services():
    services = Servicio.query.all()
    return jsonify([service.serialize() for service in services]), 200

@api.route('/servicios/total', methods=['GET'])
def get_total_services():
    total_services = Servicio.query.count()
    return jsonify({"total": total_services}), 200

@api.route('/servicios/<int:service_id>', methods=['GET'])
def get_service(service_id):
    service = Servicio.query.get(service_id)
    if service:
        return jsonify(service.serialize())
    else:
        return jsonify({"message": "Service not found"}), 404

@api.route('/services_by_client_type/<client_type>', methods=['GET'])
def get_services_by_client_type(client_type):
    try:
        # Realizar una consulta agregada para contar los servicios por tipo de servicio según el tipo de cliente
        services_count = db.session.query(
            Servicio.tipo_servicio,
            func.count(Servicio.id).label('cantidad')
        ).join(Cliente).filter(Cliente.tipo == client_type).group_by(Servicio.tipo_servicio).all()

        # Serializar los resultados
        result = [{'tipo_servicio': service.tipo_servicio, 'cantidad': service.cantidad} for service in services_count]

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/servicios/<int:service_id>', methods=['PUT'])
def update_service(service_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        service = Servicio.query.get(service_id)
        if not service:
            return jsonify({"error": "Service not found"}), 404

        # Campos permitidos para actualización, organizados por categoría
        allowed_fields = [
            # Identificación y Contrato
            'contrato', 'tipo_servicio', 'estado_contrato', 'facturado',
            # Información del Servicio/Plan
            'plan_anterior', 'plan_facturado', 'plan_aprovisionado', 'plan_servicio', 'descripcion', 'estado_servicio',
            # Información de Dominio y DNS
            'dominio', 'dns_dominio',
            # Ubicación y Espacio Físico
            'ubicacion', 'ubicacion_sala', 'cantidad_ru', 'cantidad_m2', 'cantidad_bastidores',
            # Información de Hardware/Infraestructura
            'hostname', 'nombre_servidor', 'nombre_nodo', 'nombre_plataforma', 'ram', 'hdd', 'cpu', 'datastore',
            # Red e IP
            'ip_privada','ip_publica' 'vlan', 'ipam',
            # Observaciones y Comentarios
            'observaciones', 'comentarios'
        ]

        # Actualizar solo los campos permitidos
        for field in allowed_fields:
            if field in data:
                setattr(service, field, data[field])

        db.session.commit()
        return jsonify({"message": "Service updated successfully", "service": service.serialize()}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

@api.route('/services/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    try:
        servicio = Servicio.query.filter_by(id=service_id).first()
        if not servicio:
            return jsonify({"error": "Servicio no encontrado"}), 404

        db.session.delete(servicio)
        db.session.commit()
        return jsonify({"message": "Servicio eliminado con éxito"}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500
@api.route('/top-services', methods=['GET'])
def get_top_services():
    try:
        # Consulta para obtener los servicios más populares, excluyendo aquellos con estado_servicio = "Retirado"
        top_services = db.session.query(
            Servicio.tipo_servicio, db.func.count(Servicio.id).label('count')
        ).filter(
            Servicio.estado_servicio != "Retirado"  # Filtrar servicios que no estén retirados
        ).group_by(
            Servicio.tipo_servicio
        ).order_by(
            db.desc('count')  # Ordenar por conteo descendente
        ).limit(10).all()  # Limitar a los 10 servicios más populares

        # Convertir los resultados en una lista de diccionarios
        top_services_list = [{'tipo_servicio': tipo_servicio, 'count': count} for tipo_servicio, count in top_services]

        return jsonify(top_services_list), 200

    except Exception as e:
        # Manejar errores generales
        return jsonify({"error": str(e)}), 500

@api.route('/service-counts-by-type', methods=['GET'])
def get_service_counts_by_type_active():
    try:
        # Consulta para obtener el conteo de servicios agrupados por tipo de cliente y tipo de servicio
        service_counts = db.session.query(
            Cliente.tipo, Servicio.tipo_servicio, db.func.count(Servicio.id)
        ).join(
            Cliente, Servicio.cliente_id == Cliente.id
        ).filter(
            Servicio.estado_servicio != "Retirado"  # Filtrar servicios que no estén retirados
        ).group_by(
            Cliente.tipo, Servicio.tipo_servicio
        ).all()

        # Convertir los resultados en un diccionario anidado
        service_counts_dict = {}
        for cliente_tipo, servicio_tipo, count in service_counts:
            if cliente_tipo not in service_counts_dict:
                service_counts_dict[cliente_tipo] = {}
            service_counts_dict[cliente_tipo][servicio_tipo] = count

        return jsonify(service_counts_dict), 200

    except Exception as e:
        # Manejar errores generales
        return jsonify({"error": str(e)}), 500

@api.route('/service-counts-by-client-type/<client_type>', methods=['GET'])
def get_service_counts_by_client_type(client_type):
    try:
        # Consulta para obtener el conteo total de servicios para el tipo de cliente
        total_services = db.session.query(
            func.count(Servicio.id).label("total_count")
        ).join(
            Cliente, Cliente.id == Servicio.cliente_id
        ).filter(
            Cliente.tipo == client_type
        ).scalar()  # Usar scalar() para obtener un solo valor

        return jsonify({"total_count": total_services}), 200

    except Exception as e:
        # Manejar errores generales
        return jsonify({"error": str(e)}), 500  
      
from datetime import datetime
from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError

@api.route('/new-services-current-month', methods=['GET'])
def get_new_services_current_month():
    try:
        # Obtener el primer día del mes actual y el primer día del siguiente mes
        current_date = datetime.now()
        start_of_month = current_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if current_date.month == 12:
            # Si es diciembre, el siguiente mes es enero del próximo año
            start_of_next_month = start_of_month.replace(year=current_date.year + 1, month=1)
        else:
            start_of_next_month = start_of_month.replace(month=current_date.month + 1)

        # Consulta para obtener servicios nuevos en el mes actual junto con todos los datos del cliente
        new_services = db.session.query(Servicio, Cliente).join(Cliente).filter(
            Servicio.created_at >= start_of_month,  # Usar created_at para filtrar por fecha de creación
            Servicio.created_at < start_of_next_month
        ).all()

        result = [
            {
                "id": service.id,
                "cliente": {
                    "id": cliente.id,
                    "tipo": cliente.tipo,
                    "rif": cliente.rif,
                    "razon_social": cliente.razon_social,
                    "created_at": cliente.created_at,
                    "updated_at": cliente.updated_at
                },
                # Identificación y Contrato
                "contrato": service.contrato,
                "tipo_servicio": service.tipo_servicio,
                "facturado": service.facturado,
                "estado_contrato": service.estado_contrato,
                # Información del Servicio/Plan
                "plan_anterior": service.plan_anterior,
                "plan_aprovisionado": service.plan_aprovisionado,
                "plan_facturado": service.plan_facturado,
                "plan_servicio": service.plan_servicio,
                "descripcion": service.descripcion,  # Corregido a descripcion
                "estado_servicio": service.estado_servicio,
                # Información de Dominio y DNS
                "dominio": service.dominio,
                "dns_dominio": service.dns_dominio,
                # Ubicación y Espacio Físico
                "ubicacion": service.ubicacion,
                "ubicacion_sala": service.ubicacion_sala,  # Corregido
                "cantidad_ru": service.cantidad_ru,  # Corregido
                "cantidad_m2": service.cantidad_m2,
                "cantidad_bastidores": service.cantidad_bastidores,
                # Información de Hardware/Infraestructura
                "hostname": service.hostname,
                "nombre_servidor": service.nombre_servidor,
                "nombre_nodo": service.nombre_nodo,
                "nombre_plataforma": service.nombre_plataforma,
                "ram": service.ram,
                "hdd": service.hdd,
                "cpu": service.cpu,
                "datastore": service.datastore,
                # Red e IP
                "ip_privada": service.ip_privada,
                "vlan": service.vlan,
                "ipam": service.ipam,
                # Observaciones y Comentarios
                "comentarios": service.comentarios,
                "observaciones": service.observaciones,
                # Información General
                "created_at": service.created_at,
                "updated_at": service.updated_at
            }
            for service, cliente in new_services
        ]
        return jsonify(result), 200
    except SQLAlchemyError as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@api.route('/new-services-last-month', methods=['GET'])
def get_new_services_last_month():
    try:
        # Obtener la fecha actual
        current_date = datetime.now()

        # Calcular el primer día del mes actual
        first_day_current_month = current_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # Calcular el primer día del mes pasado
        if current_date.month == 1:
            # Si estamos en enero, el mes pasado es diciembre del año anterior
            first_day_last_month = first_day_current_month.replace(year=current_date.year - 1, month=12)
        else:
            # Para cualquier otro mes, restamos 1 al mes actual
            first_day_last_month = first_day_current_month.replace(month=current_date.month - 1)

        # Calcular el primer día del mes actual (que es el límite superior para el mes pasado)
        first_day_current_month = first_day_current_month

        # Consulta para obtener servicios nuevos en el mes pasado
        new_services = Servicio.query.filter(
            Servicio.estado_servicio == 'Nuevo',
            Servicio.updated_at >= first_day_last_month,
            Servicio.updated_at < first_day_current_month
        ).all()

        # Verificar si hay servicios nuevos
        if not new_services:
            return jsonify({"message": "No new services found for the last month"}), 200

        # Devolver los servicios serializados
        return jsonify([service.serialize() for service in new_services]), 200

    except Exception as e:
        # Manejar errores generales
        return jsonify({"error": str(e)}), 500

# acciones combinadas
@api.route('/add_client_and_service', methods=['POST'])
def add_client_and_service():
    try:
        data = request.get_json()
        tipo = data.get('tipo')
        rif = data.get('rif')
        razon_social = data.get('razon_social')
        estado_servicio = data.get('estado_servicio', 'Nuevo')

        # Crear o obtener el cliente
        cliente = Cliente.query.filter_by(rif=rif).first()
        if not cliente:
            cliente = Cliente(tipo=tipo, rif=rif, razon_social=razon_social)
            db.session.add(cliente)
            db.session.commit()

        # Crear el servicio asociado, organizando los campos por categoría
        servicio = Servicio(
            # Identificación y Contrato
            contrato=data.get('contrato', ''),
            tipo_servicio=data.get('tipo_servicio', ''),
            estado_contrato=data.get('estado_contrato', ''),
            facturado=data.get('facturado', ''),

            # Información del Servicio/Plan
            plan_anterior=data.get('plan_anterior', ''),
            plan_facturado=data.get('plan_facturado', ''),
            plan_aprovisionado=data.get('plan_aprovisionado', ''),
            plan_servicio=data.get('plan_servicio', ''),
            descripcion=data.get('descripcion', ''),
            estado_servicio=estado_servicio,

            # Información de Dominio y DNS
            dominio=data.get('dominio', ''),
            dns_dominio=data.get('dns_dominio', ''),

            # Ubicación y Espacio Físico
            ubicacion=data.get('ubicacion', ''),
            ubicacion_sala=data.get('ubicacion_sala', ''),
            cantidad_ru=int(data.get('cantidad_ru', 0)) if data.get('cantidad_ru') else 0,
            cantidad_m2=int(data.get('cantidad_m2', 0)) if data.get('cantidad_m2') else 0,
            cantidad_bastidores=int(data.get('cantidad_bastidores', 0)) if data.get('cantidad_bastidores') else 0,

            # Información de Hardware/Infraestructura
            hostname=data.get('hostname', ''),
            nombre_servidor=data.get('nombre_servidor', ''),
            nombre_nodo=data.get('nombre_nodo', ''),
            nombre_plataforma=data.get('nombre_plataforma', ''),
            ram=int(data.get('ram', 0)) if data.get('ram') else 0,
            hdd=int(data.get('hdd', 0)) if data.get('hdd') else 0,
            cpu=int(data.get('cpu', 0)) if data.get('cpu') else 0,
            datastore=data.get('datastore', ''),

            # Red e IP
            ip_privada=data.get('ip_privada', ''),
            ip_publica=data.get('ip_publica', ''),
            vlan=data.get('vlan', ''),
            ipam=data.get('ipam', ''),

            # Observaciones y Comentarios
            observaciones=data.get('observaciones', ''),
            comentarios=data.get('comentarios', ''),

            cliente_id=cliente.id,
        )
        db.session.add(servicio)
        db.session.commit()

        return jsonify({"message": "Client and service created successfully", "client": cliente.serialize(), "service": servicio.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api.route('/servicios-retirados-por-mes', methods=['GET'])
def get_servicios_retirados_por_mes():
    try:
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)

        # Obtener la fecha de inicio y fin del mes
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)

        # Filtrar servicios retirados en el mes actual
        servicios = Servicio.query.filter(
            Servicio.estado_servicio == "Retirado",  # Filtro por estado "Retirado"
            Servicio.updated_at >= start_date,       # Filtro por updated_at dentro del mes
            Servicio.updated_at < end_date
        ).join(Cliente).all()

        # Serializar los datos
        result = [{
            "cliente": {
                "razon_social": servicio.cliente.razon_social,
                "rif": servicio.cliente.rif,
            },
            "contrato": servicio.contrato,
            "dominio": servicio.dominio,
            "hostname": servicio.hostname,
            "tipo_servicio": servicio.tipo_servicio,
        } for servicio in servicios]

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/servicios-aprovisionados-por-mes', methods=['GET'])
def get_servicios_aprovisionados_por_mes():
    try:
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)

        # Obtener la fecha de inicio y fin del mes
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)

        # Filtrar servicios aprovisionados en el mes actual
        servicios = Servicio.query.filter(
            Servicio.estado_servicio == "Nuevo",
            Servicio.updated_at >= start_date,
            Servicio.updated_at < end_date
        ).join(Cliente).all()

        # Serializar los datos
        result = [{
            "cliente": {
                "razon_social": servicio.cliente.razon_social,
                "rif": servicio.cliente.rif,
            },
            "contrato": servicio.contrato,
            "dominio": servicio.dominio,
            "hostname": servicio.hostname,
            "tipo_servicio": servicio.tipo_servicio,
        } for servicio in servicios]

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/servicios-aprovisionados-por-mes-anual', methods=['GET'])
def get_servicios_aprovisionados_por_mes_anual():
    try:
        year = request.args.get('year', type=int)

        # Obtener todos los servicios aprovisionados en el año
        servicios = Servicio.query.filter(
            Servicio.estado_servicio == "Nuevo",  # Filtro por estado "Nuevo"
            extract('year', Servicio.updated_at) == year  # Filtro por año
        ).join(Cliente).all()

        # Agrupar por mes
        servicios_por_mes = {}
        for servicio in servicios:
            mes = servicio.updated_at.month  # Obtener el mes de updated_at
            if mes not in servicios_por_mes:
                servicios_por_mes[mes] = []
            servicios_por_mes[mes].append({
                "cliente": {
                    "razon_social": servicio.cliente.razon_social,
                    "rif": servicio.cliente.rif,
                },
                "contrato": servicio.contrato,
                "dominio": servicio.dominio,
                "hostname": servicio.hostname,
                "tipo_servicio": servicio.tipo_servicio,
            })

        # Serializar los datos
        result = [{
            "mes": mes,
            "servicios": servicios_por_mes[mes]
        } for mes in servicios_por_mes]

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/servicios-aprovisionados-por-ano', methods=['GET'])
def get_servicios_aprovisionados_por_ano():
    try:
        # Obtener todos los servicios aprovisionados
        servicios = Servicio.query.filter(
            Servicio.estado_servicio == "Nuevo"
        ).join(Cliente).all()

        # Agrupar por año
        servicios_por_ano = {}
        for servicio in servicios:
            ano = servicio.updated_at.year
            if ano not in servicios_por_ano:
                servicios_por_ano[ano] = []
            servicios_por_ano[ano].append({
                "cliente": {
                    "razon_social": servicio.cliente.razon_social,
                    "rif": servicio.cliente.rif,
                },
                "contrato": servicio.contrato,
                "dominio": servicio.dominio,
                "hostname": servicio.hostname,
                "tipo_servicio": servicio.tipo_servicio,
            })

        # Serializar los datos
        result = [{
            "ano": ano,
            "servicios": servicios_por_ano[ano]
        } for ano in servicios_por_ano]

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@api.route('/exportar-datos-completos', methods=['GET'])
def exportar_datos_completos():
    try:
        # Obtener todos los clientes con sus servicios
        clientes = Cliente.query.options(db.joinedload(Cliente.servicios)).all()

        # Serializar los datos
        clientes_data = [cliente.serialize() for cliente in clientes]
        servicios_data = []
        for cliente in clientes:
            for servicio in cliente.servicios:
                servicio_data = servicio.serialize()
                servicio_data["razon_social"] = cliente.razon_social  # Agregar razón social del cliente
                servicios_data.append(servicio_data)

        return jsonify({
            "clientes": clientes_data,
            "servicios": servicios_data
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#acciones generales
@api.route('/upload-document/<entity_type>/<int:entity_id>', methods=['POST'])
def upload_document(entity_type, entity_id):
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Validar el tamaño del archivo (menos de 10MB)
        if file.content_length > 10 * 1024 * 1024:
            return jsonify({"error": "File size exceeds 10MB limit"}), 400

        # Leer el contenido del archivo
        file_content = file.read()
        file_name = secure_filename(file.filename)
        file_type = file.mimetype
        file_size = file.content_length

        # Crear un nuevo documento en la base de datos
        nuevo_documento = Documento(
            nombre=file_name,
            tipo=file_type,
            tamaño=file_size,
            contenido=file_content,
            cliente_id=entity_id if entity_type == "client" else None,
            servicio_id=entity_id if entity_type == "service" else None
        )
        db.session.add(nuevo_documento)
        db.session.commit()

        return jsonify({"message": "Document uploaded successfully", "document_id": nuevo_documento.id}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

       
@api.route('/<entity_type>/<int:entity_id>/document-exists', methods=['GET'])
def check_document_exists(entity_type, entity_id):
    try:
        if entity_type == "client":
            documento = Documento.query.filter_by(cliente_id=entity_id).first()
        elif entity_type == "service":
            documento = Documento.query.filter_by(servicio_id=entity_id).first()
        else:
            return jsonify({"error": "Invalid entity type"}), 400

        if documento:
            return jsonify({
                "exists": True,
                "document_name": documento.nombre,
                "document_id": documento.id  # Devolver el ID del documento
            }), 200
        else:
            return jsonify({
                "exists": False,
                "document_name": None,
                "document_id": None
            }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# Ruta para eliminar un documento por su ID
@api.route('/delete-document/<int:document_id>', methods=['DELETE'])
def delete_document(document_id):
    try:
        documento = Documento.query.filter_by(id=document_id).first()
        if not documento:
            return jsonify({"error": "Document not found"}), 404

        db.session.delete(documento)
        db.session.commit()

        return jsonify({"message": "Document deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Ruta para descargar un documento por su ID
@api.route('/download-document/<int:document_id>', methods=['GET'])
def download_document(document_id):
    try:
        documento = Documento.query.get(document_id)
        if not documento:
            return jsonify({"error": "Document not found"}), 404

        # Configurar el encabezado Content-Disposition con el nombre del archivo
        response = send_file(
            io.BytesIO(documento.contenido),
            mimetype=documento.tipo,
            as_attachment=True,
            download_name=documento.nombre  # Usar download_name para el nombre del archivo
        )
        return response

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
# Carga DE Informacion excel
@api.route('/upload-excel', methods=['POST'])
def upload_excel():
    try:
        # Obtener datos del cuerpo JSON
        data = request.get_json()
        estado_servicio = data.get('estado_servicio', 'Nuevo')

        # Validar formato de los datos
        if not isinstance(data.get('data'), list):
            return jsonify({"error": "Invalid data format. Expected a list of records."}), 400

        # Convertir datos a DataFrame
        df = pd.DataFrame(data['data'])

        # Mapear columnas si es necesario
        column_mapping = {
            'tipo': 'tipo',
            'rif': 'rif',
            'razon_social': 'razon_social',
            'dominio': 'dominio',
            'dns_dominio': 'dns_dominio',
            'contrato': 'contrato',
            'tipo_servicio': 'tipo_servicio',
            'estado_contrato': 'estado_contrato',
            'facturado': 'facturado',
            'plan_anterior': 'plan_anterior',
            'plan_facturado': 'plan_facturado',
            'plan_aprovisionado': 'plan_aprovisionado',
            'plan_servicio': 'plan_servicio',
            'descripcion': 'descripcion',
            'ubicacion': 'ubicacion',
            'ubicacion_sala': 'ubicacion_sala',
            'cantidad_ru': 'cantidad_ru',
            'cantidad_m2': 'cantidad_m2',
            'cantidad_bastidores': 'cantidad_bastidores',
            'hostname': 'hostname',
            'nombre_servidor': 'nombre_servidor',
            'nombre_nodo': 'nombre_nodo',
            'nombre_plataforma': 'nombre_plataforma',
            'ram': 'ram',
            'hdd': 'hdd',
            'cpu': 'cpu',
            'datastore': 'datastore',
            'ip_privada': 'ip_privada',
            'ip_publica': 'ip_publica',
            'vlan': 'vlan',
            'ipam': 'ipam',
            'observaciones': 'observaciones',
            'comentarios': 'comentarios'
        }
        df.rename(columns=column_mapping, inplace=True)

        # Procesar filas
        for index, row in df.iterrows():
            if pd.isna(row['rif']):
                continue

            # Crear/obtener cliente
            cliente = Cliente.query.filter_by(rif=row['rif']).first()
            if not cliente:
                cliente = Cliente(
                    tipo=row.get('tipo', ''),
                    rif=row.get('rif', ''),
                    razon_social=row.get('razon_social', '')
                )
                db.session.add(cliente)
                db.session.commit()

            # Crear servicio, organizando los campos por categoría
            servicio = Servicio(
                # Identificación y Contrato
                contrato=row.get('contrato', ''),
                tipo_servicio=row.get('tipo_servicio', ''),
                estado_contrato=row.get('estado_contrato', ''),
                facturado=row.get('facturado', ''),

                # Información del Servicio/Plan
                plan_anterior=row.get('plan_anterior', ''),
                plan_facturado=row.get('plan_facturado', ''),
                plan_aprovisionado=row.get('plan_aprovisionado', ''),
                plan_servicio=row.get('plan_servicio', ''),
                descripcion=row.get('descripcion', ''),
                estado_servicio=estado_servicio,

                # Información de Dominio y DNS
                dominio=row.get('dominio', ''),
                dns_dominio=row.get('dns_dominio', ''),

                # Ubicación y Espacio Físico
                ubicacion=row.get('ubicacion', ''),
                ubicacion_sala=row.get('ubicacion_sala', ''),
                cantidad_ru=int(row['cantidad_ru']) if 'cantidad_ru' in row and pd.notna(row['cantidad_ru']) else 0,
                cantidad_m2=int(row['cantidad_m2']) if 'cantidad_m2' in row and pd.notna(row['cantidad_m2']) else 0,
                cantidad_bastidores=int(row['cantidad_bastidores']) if 'cantidad_bastidores' in row and pd.notna(row['cantidad_bastidores']) else 0,

                # Información de Hardware/Infraestructura
                hostname=row.get('hostname', ''),
                nombre_servidor=row.get('nombre_servidor', ''),
                nombre_nodo=row.get('nombre_nodo', ''),
                nombre_plataforma=row.get('nombre_plataforma', ''),
                ram=int(row['ram']) if 'ram' in row and pd.notna(row['ram']) else 0,
                hdd=int(row['hdd']) if 'hdd' in row and pd.notna(row['hdd']) else 0,
                cpu=int(row['cpu']) if 'cpu' in row and pd.notna(row['cpu']) else 0,
                datastore=row.get('datastore', ''),

                # Red e IP
                ip_privada=row.get('ip_privada', ''),
                ip_publica=row.get('ip_publica', ''),
                ipam=row.get('ipam', ''),

                # Observaciones y Comentarios
                observaciones=row.get('observaciones', ''),
                comentarios=row.get('comentarios', ''),

                cliente_id=cliente.id,
            )
            db.session.add(servicio)

        # Confirmar transacción
        db.session.commit()
        return jsonify({"message": "Excel data uploaded successfully!"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500