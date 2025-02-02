from flask import Flask, request, jsonify, url_for, Blueprint, session
from api.models import db, User, Cliente, Servicio
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import pandas as pd

api = Blueprint('api', __name__)

CORS(api)

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

@api.route('/users')
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

@api.route('/client-consult/<int:cliente_id>', methods=['GET'])
def client_consult_id(cliente_id):
    cliente= Cliente.query.get(cliente_id)
    if not cliente:
        return jsonify({"message": "No users found"}), 404
    else:    
        return jsonify([cliente.serialize() for cliente in cliente]), 200

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

@api.route('/add_client/', methods=['POST'])
def client_post():
    if request.method == 'POST':
        data = request.get_json()
        tipo= data.get('tipo')
        rif = data.get('rif')
        razon_social = data.get('razon_social')
        new_cliente = Cliente( tipo=tipo, rif=rif, razon_social=razon_social)
        db.session.add(new_cliente)
        db.session.commit()
        
        return jsonify({"message": "CLient created successfully", "Cliente": new_cliente.serialize()}), 201
    else:
        return jsonify({"message": "Invalid credentials"}), 401

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

@api.route('/servicios/<int:cliente_id>', methods=['GET'])
def get_services(cliente_id):
    if request.method == 'GET':
        services = Servicio.query.filter_by(cliente_id=cliente_id).all()
        return jsonify([service.serialize() for service in services])
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@api.route('/client-and-services', methods=['POST'])
def add_client_services():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    # Validación de datos obligatorios
    if not all(key in data for key in ['tipo', 'rif', 'razon_social']):
        return jsonify({"message": "Missing required client data"}), 400
    if not all(key in data for key in ['dominio', 'estado', 'tipo_servicio']):
        return jsonify({"message": "Missing required service data"}), 400

    # Crear nuevo cliente
    new_cliente = Cliente(tipo=data.get('tipo'), rif=data.get('rif'), razon_social=data.get('razon_social'))

    # Crear nuevo servicio
    new_servicio = Servicio(
        dominio=data.get('dominio'),
        estado=data.get('estado'),
        tipo_servicio=data.get('tipo_servicio'),
        hostname=data.get('hostname'),
        cores=int(data.get('cores', 0)) if data.get('cores') else 0,
        contrato=data.get('contrato'),
        plan_aprovisionado=data.get('plan_aprovisionado'),
        plan_facturado=data.get('plan_facturado'),
        detalle_plan=data.get('detalle_plan'),
        sockets=int(data.get('sockets', 0)) if data.get('sockets') else 0,
        powerstate=data.get('powerstate'),
        ip_privada=data.get('ip_privada'),
        vlan=data.get('vlan'),
        ipam=data.get('ipam'),
        datastore=data.get('datastore'),
        nombre_servidor=data.get('nombre_servidor'),
        marca_servidor=data.get('marca_servidor'),
        modelo_servidor=data.get('modelo_servidor'),
        nombre_nodo=data.get('nombre_nodo'),
        nombre_plataforma=data.get('nombre_plataforma'),
        ram=int(data.get('ram', 0)) if data.get('ram') else 0,
        hdd=int(data.get('hdd', 0)) if data.get('hdd') else 0,
        cpu=int(data.get('cpu', 0)) if data.get('cpu') else 0,
        tipo_servidor=data.get('tipo_servidor'),
        ubicacion=data.get('ubicacion'),
        observaciones=data.get('observaciones'),
        facturado=data.get('facturado'),
        comentarios=data.get('comentarios')
    )

    try:
        db.session.add(new_cliente)
        db.session.flush()  # Asigna un ID al nuevo cliente
        new_servicio.cliente_id = new_cliente.id
        db.session.add(new_servicio)
        db.session.commit()
        return jsonify({
            "message": "Client and services added successfully",
            "client": new_cliente.serialize(),
            "services": new_servicio.serialize()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error adding client and services: {str(e)}"}), 500
    
@api.route('/upload-excel', methods=['POST'])
def upload_excel():
    data = request.get_json()
    df = pd.DataFrame(data)

    for index, row in df.iterrows():
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
            cores=int(row.get('cores', 0)) if row.get('cores') else 0,
            contrato=row.get('contrato', ''),
            plan_aprovisionado=row.get('plan_aprovisionado', ''),
            plan_facturado=row.get('plan_facturado', ''),
            detalle_plan=row.get('detalle_plan', ''),
            sockets=int(row.get('sockets', 0)) if row.get('sockets') else 0,
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
            ram=int(row.get('ram', 0)) if row.get('ram') else 0,
            hdd=int(row.get('hdd', 0)) if row.get('hdd') else 0,
            cpu=int(row.get('cpu', 0)) if row.get('cpu') else 0,
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
