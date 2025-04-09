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
from fuzzywuzzy import fuzz, process

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
    
@api.route('/servicios-activos', methods=['GET'])
def get_servicios_activos():
    try:
        # Filtrar servicios activos (excluyendo "Retirado")
        servicios_activos = Servicio.query.filter(Servicio.estado_servicio != "Retirado").all()
        # Serializar los resultados
        result = [servicio.serialize() for servicio in servicios_activos]
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

# Ruta y comprobacion de datos para cargar un documento
# this is your list of valid service types (from TipoServicios.jsx)
valid_service_types = [
    'HW LINUX',
    'BD MYSQL',
    'HW WINDOWS',
    'BD SQL SERVER',
    'MENSAJERIA',
    'DDV',
    'VMWARE',
    'PROXMOX',
    'HOSPEDAJE DEDICADO FISICO',
    'RESPALDO Y RECUPERACION',
    'COLOCATION RU',
]
def correct_service_type(service_type):
    """
    Corrects a service type to the closest valid service type using fuzzy matching.

    Args:
        service_type (str): The service type to correct.

    Returns:
        str: The corrected service type, or the original if no close match is found.
    """
    if not service_type:
        return "Other"  # Default value if empty
    
    best_match, score = process.extractOne(service_type, valid_service_types, scorer=fuzz.ratio)
    if score >= 70:  # Adjust the threshold as needed
        return best_match
    else:
        return "Other"  # Default value if no close match
    
def correct_client_type(client_type):
    """
    Corrects a client type to either 'Pública' or 'Privada' using fuzzy matching.

    Args:
        client_type (str): The client type to correct.

    Returns:
        str: The corrected client type ('Pública' or 'Privada').
    """
    valid_types = ['Pública', 'Privada']
    if not client_type:
        return "Privada"  # Default value if empty

    best_match, score = process.extractOne(client_type, valid_types, scorer=fuzz.ratio)
    if score >= 70:  # Adjust the threshold as needed
        return best_match
    else:
        return "Privada"  # Default value if no close match
    
@api.route('/upload-excel', methods=['POST'])
def upload_excel():
    try:
        # Obtener datos del cuerpo JSON
        data = request.get_json()
        estado_servicio_default = data.get('estado_servicio', 'Nuevo') # Renombrado para evitar conflicto

        # Validar formato de los datos
        if not data:
            return jsonify({"error": "No data provided in request body."}), 400
        if 'data' not in data:
            return jsonify({"error": "Missing 'data' key in request body."}), 400
        if not isinstance(data.get('data'), list):
            return jsonify({"error": "Invalid data format. Expected a list of records."}), 400

        # Convertir datos a DataFrame
        df = pd.DataFrame(data['data'])

        # Mapear columnas si es necesario (igual que antes)
        column_mapping = {
            'tipo': 'Tipo',
            'rif': 'RIF',
            'razon_social': 'Razón Social',
            'contrato': 'Contrato',
            'tipo_servicio': 'Tipo de Servicio',
            'estado_contrato': 'Estado del Contrato',
            'facturado': 'Facturado',
            'plan_anterior': 'Plan Anterior',
            'plan_facturado': 'Plan Facturado',
            'plan_aprovisionado': 'Plan Aprovisionado',
            'plan_servicio': 'Plan de Servicio',
            'descripcion': 'Descripción',
            'estado_servicio': 'Estado del Servicio', # Columna opcional en Excel
            'dominio': 'Dominio',
            'dns_dominio': 'DNS del Dominio',
            'ubicacion': 'Ubicación',
            'ubicacion_sala': 'Ubicación en la Sala',
            'cantidad_ru': 'Cantidad de RU',
            'cantidad_m2': 'Cantidad de m2',
            'cantidad_bastidores': 'Cantidad de Bastidores',
            'hostname': 'Hostname',
            'nombre_servidor': 'Nombre del Servidor',
            'nombre_nodo': 'Nombre del Nodo',
            'nombre_plataforma': 'Nombre de la Plataforma',
            'ram': 'RAM (GB)',
            'hdd': 'HDD (GB)',
            'cpu': 'CPU (GHz)',
            'datastore': 'Datastore',
            'ip_privada': 'IP Privada',
            'ip_publica': 'IP Pública',
            'vlan': 'VLAN',
            'ipam': 'IPAM',
            'observaciones': 'Observaciones',
            'comentarios': 'Comentarios',
        }
        df.rename(columns=column_mapping, inplace=True)

        # Check for missing required columns in the DataFrame structure itself
        # These are essential for client identification and service uniqueness check
        required_df_columns = ['RIF', 'Contrato', 'Tipo de Servicio']
        missing_df_cols = [col for col in required_df_columns if col not in df.columns]
        if missing_df_cols:
            return jsonify({"error": f"Missing required columns in the Excel data: {', '.join(missing_df_cols)}"}), 400

        processed_count = 0
        skipped_duplicates = 0
        skipped_missing_rif = 0

        # Procesar filas
        for index, row in df.iterrows():
            # Ensure RIF is a string and exists
            rif_value = str(row['RIF']) if pd.notna(row['RIF']) else None
            if not rif_value:
                logging.warning(f"Skipping row {index + 2}: Empty RIF.")
                skipped_missing_rif += 1
                continue

            # Correct the client type
            original_client_type = row.get('Tipo', '') # Get Tipo, default to empty if missing
            corrected_client_type = correct_client_type(original_client_type)
            # No warning needed here unless debugging specific type issues

            # Crear/obtener cliente
            cliente = Cliente.query.filter_by(rif=rif_value).first()
            if not cliente:
                cliente = Cliente(
                    tipo=corrected_client_type,
                    rif=rif_value,
                    razon_social=row.get('Razón Social', '') # Default to empty if missing
                )
                try:
                    db.session.add(cliente)
                    # Commit immediately to get the client ID for the service check
                    db.session.commit()
                except SQLAlchemyError as e:
                    db.session.rollback()
                    logging.error(f"Database error creating client for RIF {rif_value}: {str(e)}")
                    # Decide if you want to stop the whole upload or just skip this row
                    return jsonify({"error": f"Database error creating client: {str(e)}", "details": str(e.__dict__.get('orig'))}), 500

            # --- Inicio de la comprobación de duplicados ---
            contrato_excel = row.get('Contrato')
            contrato_value = str(contrato_excel) if pd.notna(contrato_excel) else ''
            original_service_type = row.get('Tipo de Servicio', '') # Get Tipo de Servicio, default to empty
            corrected_service_type = correct_service_type(original_service_type)

            # Check if a service with the same contrato and tipo_servicio already exists for this client
            existing_service = Servicio.query.filter_by(
                cliente_id=cliente.id,
                contrato=contrato_value,
                tipo_servicio=corrected_service_type # Check against the corrected type
            ).first()

            if existing_service:
                logging.warning(f"Skipping row {index + 2}: Duplicate service found for client RIF {rif_value} (Contrato: '{contrato_value}', Tipo: '{corrected_service_type}')")
                skipped_duplicates += 1
                continue # Skip to the next row if duplicate found
            # --- Fin de la comprobación de duplicados ---

            # Use estado_servicio from Excel if present, otherwise use the default from JSON body
            estado_servicio = row.get('Estado del Servicio', estado_servicio_default) if pd.notna(row.get('Estado del Servicio')) else estado_servicio_default

            # --- Procesamiento de valores numéricos (igual que antes) ---
            cantidad_ru = 0
            if 'Cantidad de RU' in row and pd.notna(row['Cantidad de RU']):
                try:
                    cantidad_ru = int(row['Cantidad de RU'])
                except (ValueError, TypeError):
                    logging.warning(f"Row {index + 2}: Invalid non-integer value for 'Cantidad de RU': {row['Cantidad de RU']}. Using 0.")
                    cantidad_ru = 0 # Default to 0 on error
            cantidad_m2 = 0
            if 'Cantidad de m2' in row and pd.notna(row['Cantidad de m2']):
                try:
                    cantidad_m2 = int(row['Cantidad de m2'])
                except (ValueError, TypeError):
                    logging.warning(f"Row {index + 2}: Invalid non-integer value for 'Cantidad de m2': {row['Cantidad de m2']}. Using 0.")
                    cantidad_m2 = 0
            cantidad_bastidores = 0
            if 'Cantidad de Bastidores' in row and pd.notna(row['Cantidad de Bastidores']):
                try:
                    cantidad_bastidores = int(row['Cantidad de Bastidores'])
                except (ValueError, TypeError):
                    logging.warning(f"Row {index + 2}: Invalid non-integer value for 'Cantidad de Bastidores': {row['Cantidad de Bastidores']}. Using 0.")
                    cantidad_bastidores = 0
            ram = 0
            if 'RAM (GB)' in row and pd.notna(row['RAM (GB)']):
                try:
                    ram = int(row['RAM (GB)'])
                except (ValueError, TypeError):
                    logging.warning(f"Row {index + 2}: Invalid non-integer value for 'RAM (GB)': {row['RAM (GB)']}. Using 0.")
                    ram = 0
            hdd = 0
            if 'HDD (GB)' in row and pd.notna(row['HDD (GB)']):
                try:
                    hdd = int(row['HDD (GB)'])
                except (ValueError, TypeError):
                    logging.warning(f"Row {index + 2}: Invalid non-integer value for 'HDD (GB)': {row['HDD (GB)']}. Using 0.")
                    hdd = 0
            cpu = 0
            if 'CPU (GHz)' in row and pd.notna(row['CPU (GHz)']):
                try:
                    cpu = int(row['CPU (GHz)'])
                except (ValueError, TypeError):
                    logging.warning(f"Row {index + 2}: Invalid non-integer value for 'CPU (GHz)': {row['CPU (GHz)']}. Using 0.")
                    cpu = 0
            # --- Fin del procesamiento de valores numéricos ---

            # Crear servicio (solo si no es duplicado)
            servicio = Servicio(
                # Identificación y Contrato
                contrato=contrato_value,
                tipo_servicio=corrected_service_type, # Use corrected type
                estado_contrato=row.get('Estado del Contrato', ''),
                facturado=row.get('Facturado', ''),

                # Información del Servicio/Plan
                plan_anterior=row.get('Plan Anterior', ''),
                plan_facturado=row.get('Plan Facturado', ''),
                plan_aprovisionado=row.get('Plan Aprovisionado', ''),
                plan_servicio=row.get('Plan de Servicio', ''),
                descripcion=row.get('Descripción', ''),
                estado_servicio=estado_servicio, # Use determined estado_servicio

                # Información de Dominio y DNS
                dominio=row.get('Dominio', ''),
                dns_dominio=row.get('DNS del Dominio', ''),

                # Ubicación y Espacio Físico
                ubicacion=row.get('Ubicación', ''),
                ubicacion_sala=row.get('Ubicación en la Sala', ''),
                cantidad_ru=cantidad_ru,
                cantidad_m2=cantidad_m2,
                cantidad_bastidores=cantidad_bastidores,

                # Información de Hardware/Infraestructura
                hostname=row.get('Hostname', ''),
                nombre_servidor=row.get('Nombre del Servidor', ''),
                nombre_nodo=row.get('Nombre del Nodo', ''),
                nombre_plataforma=row.get('Nombre de la Plataforma', ''),
                ram=ram,
                hdd=hdd,
                cpu=cpu,
                datastore=row.get('Datastore', ''),

                # Red e IP
                ip_privada=row.get('IP Privada', ''),
                ip_publica=row.get('IP Pública', ''),
                vlan=row.get('VLAN',''), # Asegúrate que el mapeo sea correcto si la columna es 'VLAN'
                ipam=row.get('IPAM', ''),

                # Observaciones y Comentarios
                observaciones=row.get('Observaciones', ''),
                comentarios=row.get('Comentarios', ''),

                cliente_id=cliente.id,
            )
            db.session.add(servicio)
            processed_count += 1

        # Confirmar transacción después de procesar todas las filas válidas
        db.session.commit()
        return jsonify({
            "message": f"Excel data processed. {processed_count} services added.",
            "skipped_duplicates": skipped_duplicates,
            "skipped_missing_rif": skipped_missing_rif
        }), 201

    except KeyError as e:
        db.session.rollback()
        logging.error(f"Upload failed due to missing column: {str(e)}")
        return jsonify({"error": f"Missing expected column in data: {str(e)}"}), 400
    except pd.errors.EmptyDataError:
         db.session.rollback()
         return jsonify({"error": "The provided data is empty."}), 400
    except Exception as e:
        db.session.rollback()
        logging.error(f"An unexpected error occurred during Excel upload: {str(e)}", exc_info=True) # Log stack trace
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500