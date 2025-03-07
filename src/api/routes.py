from flask import Flask, request, jsonify, url_for, Blueprint, session, send_file
from werkzeug.utils import secure_filename
import io
import os
from api.models import db, User, Cliente, Servicio, Documento
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import pandas as pd
from datetime import datetime, timedelta
from sqlalchemy import func
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
        dominio = data.get('dominio')
        estado = data.get('estado')
        tipo_servicio = data.get('tipo_servicio')
        hostname = data.get('hostname')
        cores = int(data.get('cores', 0)) if data.get('cores') else 0
        contrato = data.get('contrato')
        plan_aprovisionado = data.get('plan_aprovisionado')
        plan_facturado = data.get('plan_facturado')
        detalle_plan = data.get('detalle_plan')
        sockets = int(data.get('sockets', 0)) if data.get('sockets') else 0
        powerstate = data.get('powerstate')
        ip_privada = data.get('ip_privada')
        vlan = data.get('vlan')
        ipam = data.get('ipam')
        datastore = data.get('datastore')
        nombre_servidor = data.get('nombre_servidor')
        marca_servidor = data.get('marca_servidor')
        modelo_servidor = data.get('modelo_servidor')
        nombre_nodo = data.get('nombre_nodo')
        nombre_plataforma = data.get('nombre_plataforma')
        ram = int(data.get('ram', 0)) if data.get('ram') else 0
        hdd = int(data.get('hdd', 0)) if data.get('hdd') else 0
        cpu = int(data.get('cpu', 0)) if data.get('cpu') else 0
        tipo_servidor = data.get('tipo_servidor')
        ubicacion = data.get('ubicacion')
        facturado = data.get('facturado')
        comentarios = data.get('comentarios')
        cliente_id = data.get('cliente_id')
        estado_servicio = data.get('estado_servicio', 'Nuevo')  # Obtener el estado del servicio

        new_service = Servicio(
            dominio=dominio,
            estado=estado,
            tipo_servicio=tipo_servicio,
            hostname=hostname,
            cores=cores,
            contrato=contrato,
            plan_aprovisionado=plan_aprovisionado,
            plan_facturado=plan_facturado,
            detalle_plan=detalle_plan,
            sockets=sockets,
            powerstate=powerstate,
            ip_privada=ip_privada,
            vlan=vlan,
            ipam=ipam,
            datastore=datastore,
            nombre_servidor=nombre_servidor,
            marca_servidor=marca_servidor,
            modelo_servidor=modelo_servidor,
            nombre_nodo=nombre_nodo,
            nombre_plataforma=nombre_plataforma,
            ram=ram,
            hdd=hdd,
            cpu=cpu,
            tipo_servidor=tipo_servidor,
            ubicacion=ubicacion,
            facturado=facturado,
            comentarios=comentarios,
            cliente_id=cliente_id,
            estado_servicio=estado_servicio,
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

        # Campos permitidos para actualización
        allowed_fields = [
            'dominio', 'estado', 'tipo_servicio', 'hostname', 'cores', 'contrato',
            'plan_aprovisionado', 'plan_facturado', 'detalle_plan', 'sockets',
            'powerstate', 'ip_privada', 'vlan', 'ipam', 'datastore', 'nombre_servidor',
            'marca_servidor', 'modelo_servidor', 'nombre_nodo', 'nombre_plataforma',
            'ram', 'hdd', 'cpu', 'tipo_servidor', 'ubicacion', 'observaciones',
            'facturado', 'comentarios', 'estado_servicio'
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
            Servicio.updated_at >= start_of_month,
            Servicio.updated_at < start_of_next_month
        ).all()

        result = [
            {
                "id": service.id,
                "dominio": service.dominio,
                "estado": service.estado,
                "tipo_servicio": service.tipo_servicio,
                "hostname": service.hostname,
                "contrato": service.contrato,
                "plan_aprovisionado": service.plan_aprovisionado,
                "plan_facturado": service.plan_facturado,
                "detalle_plan": service.detalle_plan,
                "facturado": service.facturado,
                "cores": service.cores,
                "sockets": service.sockets,
                "ram": service.ram,
                "hdd": service.hdd,
                "cpu": service.cpu,
                "ip_privada": service.ip_privada,
                "vlan": service.vlan,
                "ipam": service.ipam,
                "datastore": service.datastore,
                "nombre_servidor": service.nombre_servidor,
                "marca_servidor": service.marca_servidor,
                "modelo_servidor": service.modelo_servidor,
                "nombre_nodo": service.nombre_nodo,
                "nombre_plataforma": service.nombre_plataforma,
                "tipo_servidor": service.tipo_servidor,
                "ubicacion": service.ubicacion,
                "powerstate": service.powerstate,
                "comentarios": service.comentarios,
                "estado_servicio": service.estado_servicio,
                "created_at": service.created_at,
                "updated_at": service.updated_at,
                "cliente": {
                    "id": cliente.id,
                    "tipo": cliente.tipo,
                    "rif": cliente.rif,
                    "razon_social": cliente.razon_social,
                    "created_at": cliente.created_at,
                    "updated_at": cliente.updated_at
                }
            }
            for service, cliente in new_services
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

        # Crear el servicio asociado
        servicio = Servicio(
            dominio=data.get('dominio', ''),
            estado=data.get('estado', ''),
            tipo_servicio=data.get('tipo_servicio', ''),
            hostname=data.get('hostname', ''),
            cores=int(data.get('cores', 0)) if data.get('cores') else 0,
            contrato=data.get('contrato', ''),
            plan_aprovisionado=data.get('plan_aprovisionado', ''),
            plan_facturado=data.get('plan_facturado', ''),
            detalle_plan=data.get('detalle_plan', ''),
            sockets=int(data.get('sockets', 0)) if data.get('sockets') else 0,
            powerstate=data.get('powerstate', ''),
            ip_privada=data.get('ip_privada', ''),
            vlan=data.get('vlan', ''),
            ipam=data.get('ipam', ''),
            datastore=data.get('datastore', ''),
            nombre_servidor=data.get('nombre_servidor', ''),
            marca_servidor=data.get('marca_servidor', ''),
            modelo_servidor=data.get('modelo_servidor', ''),
            nombre_nodo=data.get('nombre_nodo', ''),
            nombre_plataforma=data.get('nombre_plataforma', ''),
            ram=int(data.get('ram', 0)) if data.get('ram') else 0,
            hdd=int(data.get('hdd', 0)) if data.get('hdd') else 0,
            cpu=int(data.get('cpu', 0)) if data.get('cpu') else 0,
            tipo_servidor=data.get('tipo_servidor', ''),
            ubicacion=data.get('ubicacion', ''),
            observaciones=data.get('observaciones', ''),
            facturado=data.get('facturado', ''),
            comentarios=data.get('comentarios', ''),
            cliente_id=cliente.id,
            estado_servicio=estado_servicio,
        )
        db.session.add(servicio)
        db.session.commit()

        return jsonify({"message": "Client and service created successfully", "client": cliente.serialize(), "service": servicio.serialize()}), 201
    except Exception as e:
        db.session.rollback()
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
            'estado': 'estado',
            'tipo_servicio': 'tipo_servicio',
            'hostname': 'hostname',
            'cores': 'cores',
            'contrato': 'contrato',
            'plan_aprovisionado': 'plan_aprovisionado',
            'plan_facturado': 'plan_facturado',
            'detalle_plan': 'detalle_plan',
            'sockets': 'sockets',
            'powerstate': 'powerstate',
            'ip_privada': 'ip_privada',
            'vlan': 'vlan',
            'ipam': 'ipam',
            'datastore': 'datastore',
            'nombre_servidor': 'nombre_servidor',
            'marca_servidor': 'marca_servidor',
            'modelo_servidor': 'modelo_servidor',
            'nombre_nodo': 'nombre_nodo',
            'nombre_plataforma': 'nombre_plataforma',
            'ram': 'ram',
            'hdd': 'hdd',
            'cpu': 'cpu',
            'tipo_servidor': 'tipo_servidor',
            'ubicacion': 'ubicacion',
            'observaciones': 'observaciones',
            'facturado': 'facturado',
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

            # Crear servicio
            servicio = Servicio(
                dominio=row.get('dominio', ''),
                estado=row.get('estado', ''),
                tipo_servicio=row.get('tipo_servicio', ''),
                hostname=row.get('hostname', ''),
                cores=int(row['cores']) if 'cores' in row and pd.notna(row['cores']) else 0,
                contrato=row.get('contrato', ''),
                plan_aprovisionado=row.get('plan_aprovisionado', ''),
                plan_facturado=row.get('plan_facturado', ''),
                detalle_plan=row.get('detalle_plan', ''),
                sockets=int(row['sockets']) if 'sockets' in row and pd.notna(row['sockets']) else 0,
                powerstate=row.get('powerstate', ''),
                ip_privada=row.get('ip_privada', ''),
                vlan=row.get('vlan', ''),
                ipam=row.get('ipam', ''),
                datastore=row.get('datastore', ''),
                nombre_servidor=row.get('nombre_servidor', ''),
                marca_servidor=row.get('marca_servidor', ''),
                modelo_servidor=row.get('modelo_servidor', ''),
                nombre_nodo=row.get('nombre_nodo', ''),
                nombre_plataforma=row.get('nombre_plataforma', ''),
                ram=int(row['ram']) if 'ram' in row and pd.notna(row['ram']) else 0,
                hdd=int(row['hdd']) if 'hdd' in row and pd.notna(row['hdd']) else 0,
                cpu=int(row['cpu']) if 'cpu' in row and pd.notna(row['cpu']) else 0,
                tipo_servidor=row.get('tipo_servidor', ''),
                ubicacion=row.get('ubicacion', ''),
                observaciones=row.get('observaciones', ''),
                facturado=row.get('facturado', ''),
                comentarios=row.get('comentarios', ''),
                cliente_id=cliente.id,
                estado_servicio=estado_servicio,
            )
            db.session.add(servicio)

        # Confirmar transacción
        db.session.commit()
        return jsonify({"message": "Excel data uploaded successfully!"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500