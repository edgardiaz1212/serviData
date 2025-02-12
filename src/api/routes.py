from flask import Flask, request, jsonify, url_for, Blueprint, session
from api.models import db, User, Cliente, Servicio
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import pandas as pd

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
            cliente_id=cliente_id
        )
        db.session.add(new_service)
        db.session.commit()
        return jsonify({"message": "Service created successfully", "service": new_service.serialize()}), 201
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@api.route('/servicios-by-cliente/<int:cliente_id>', methods=['GET'])
def get_services(cliente_id):
    try:
        services = Servicio.query.filter_by(cliente_id=cliente_id).all()
        if not services:
            return jsonify({"message": "No services found for this client", "services": []}), 200
        return jsonify([service.serialize() for service in services]), 200
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500

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

@api.route('/servicios/<int:service_id>', methods=['PUT'])
def update_service(service_id):
    data = request.get_json()
    service = Servicio.query.get(service_id)
    if not service:
        return jsonify({"message": "Service not found"}), 404
    service.dominio = data.get('dominio', service.dominio)
    service.estado = data.get('estado', service.estado)
    service.tipo_servicio = data.get('tipo_servicio', service.tipo_servicio)
    service.hostname = data.get('hostname', service.hostname)
    service.cores = int(data.get('cores', service.cores))
    service.contrato = data.get('contrato', service.contrato)
    service.plan_aprovisionado = data.get('plan_aprovisionado', service.plan_aprovisionado)
    service.plan_facturado = data.get('plan_facturado', service.plan_facturado)
    service.detalle_plan = data.get('detalle_plan', service.detalle_plan)
    service.sockets = int(data.get('sockets', service.sockets))
    service.powerstate = data.get('powerstate', service.powerstate)
    service.ip_privada = data.get('ip_privada', service.ip_privada)
    service.vlan = data.get('vlan', service.vlan)
    service.ipam = data.get('ipam', service.ipam)
    service.datastore = data.get('datastore', service.datastore)
    service.nombre_servidor = data.get('nombre_servidor', service.nombre_servidor)
    service.marca_servidor = data.get('marca_servidor', service.marca_servidor)
    service.modelo_servidor = data.get('modelo_servidor', service.modelo_servidor)
    service.nombre_nodo = data.get('nombre_nodo', service.nombre_nodo)
    service.nombre_plataforma = data.get('nombre_plataforma', service.nombre_plataforma)
    service.ram = int(data.get('ram', service.ram))
    service.hdd = int(data.get('hdd', service.hdd))
    service.cpu = int(data.get('cpu', service.cpu))
    service.tipo_servidor = data.get('tipo_servidor', service.tipo_servidor)
    service.ubicacion = data.get('ubicacion', service.ubicacion)
    service.observaciones = data.get('observaciones', service.observaciones)
    service.facturado = data.get('facturado', service.facturado)
    service.comentarios = data.get('comentarios', service.comentarios)
    db.session.commit()
    return jsonify({"message": "Service updated successfully", "service": service.serialize()}), 200

@api.route('/services/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    try:
        servicio = db.session.query(Servicio).get(service_id)
        if not servicio:
            return jsonify({"error": "Servicio no encontrado"}), 404
        db.session.delete(servicio)
        db.session.commit()
        return jsonify({"message": "Servicio eliminado con éxito"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500

@api.route('/top-services', methods=['GET'])
def get_top_services():
    top_services = db.session.query(
        Servicio.tipo_servicio, db.func.count(Servicio.id).label('count')
    ).group_by(Servicio.tipo_servicio).order_by(db.desc('count')).limit(10).all()
    top_services_list = [{'tipo_servicio': tipo_servicio, 'count': count} for tipo_servicio, count in top_services]
    return jsonify(top_services_list), 200

@api.route('/service-counts-by-type', methods=['GET'])
def get_service_counts_by_type():
    service_counts = db.session.query(
        Cliente.tipo, Servicio.tipo_servicio, db.func.count(Servicio.id)
    ).join(Cliente, Servicio.cliente_id == Cliente.id).group_by(Cliente.tipo, Servicio.tipo_servicio).all()
    service_counts_dict = {}
    for cliente_tipo, servicio_tipo, count in service_counts:
        if cliente_tipo not in service_counts_dict:
            service_counts_dict[cliente_tipo] = {}
        service_counts_dict[cliente_tipo][servicio_tipo] = count
    return jsonify(service_counts_dict), 200

@api.route('/upload-excel', methods=['POST'])
def upload_excel():
    data = request.get_json()
    df = pd.DataFrame(data)
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
    for index, row in df.iterrows():
        if pd.isna(row['rif']):
            continue
        cliente = Cliente.query.filter_by(rif=row['rif']).first()
        if not cliente:
            cliente = Cliente(
                tipo=row.get('tipo', ''),
                rif=row.get('rif', ''),
                razon_social=row.get('razon_social', '')
            )
            db.session.add(cliente)
            db.session.commit()
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
            cliente_id=cliente.id
        )
        db.session.add(servicio)
    db.session.commit()
    return jsonify({"message": "Data uploaded successfully"}), 201