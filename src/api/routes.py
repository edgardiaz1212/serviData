"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Cliente , Servicio
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
api = Blueprint('api', __name__)

@api.route('/api/clientes', methods=['GET'])
def get_clientes():
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM clientes')
    clientes = cursor.fetchall()
    conn.close()
    return jsonify(clientes)

@api.route('/api/clientes', methods=['POST'])
def add_cliente():
    new_cliente = request.get_json()
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute(''' 
        INSERT INTO clientes (tipo, rif, razon_social, dominio, estado)
        VALUES (?, ?, ?, ?, ?)
    ''', (new_cliente['tipo'], new_cliente['rif'], new_cliente['razon_social'], new_cliente['dominio'], new_cliente['estado']))
    conn.commit()
    conn.close()
    return jsonify(new_cliente), 201

@api.route('/api/users', methods=['GET'])
def get_users():
    session = create_connection()
    users = session.query(User).all()
    return jsonify([{'id': user.id, 'username': user.username, 'role': user.role} for user in users])

@api.route('/api/users', methods=['POST'])
def register_user():
    new_user = request.get_json()
    session = create_connection()
    user = User(username=new_user['username'], password=new_user['password'], role=new_user['role'])
    session.add(user)
    session.commit()
    session.close()
    return jsonify(new_user), 201

@api.route('/api/users/<int:id>', methods=['PUT'])
def update_user(id):
    updated_data = request.get_json()
    session = create_connection()
    user = session.query(User).filter_by(id=id).first()
    if user:
        user.username = updated_data.get('username', user.username)
        user.password = updated_data.get('password', user.password)
        user.role = updated_data.get('role', user.role)
        session.commit()
        session.close()
        return jsonify({'message': 'User updated successfully!'}), 200
    session.close()
    return jsonify({'message': 'User not found!'}), 404

@api.route('/api/login', methods=['POST'])
def login():
    credentials = request.get_json()
    session = create_connection()
    user = session.query(User).filter_by(username=credentials['username']).first()
    if user and user.password == credentials['password']:
        return jsonify({'message': 'Login successful!'}), 200
    return jsonify({'message': 'Invalid username or password!'}), 401

@api.route('/api/summary', methods=['GET'])
def get_summary():
    session = create_connection()
    summary_data = []
    clients = session.query(Cliente).all()
    public_count = sum(1 for client in clients if client.tipo == 'Pública')
    private_count = sum(1 for client in clients if client.tipo == 'Privada')
    summary_data.append({"tipoUsuario": "Pública", "total": public_count})
    summary_data.append({"tipoUsuario": "Privada", "total": private_count})
    return jsonify(summary_data)
