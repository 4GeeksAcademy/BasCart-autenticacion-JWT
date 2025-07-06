from flask import request, jsonify, Blueprint
from api.models import db, User
from api.utils import APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)
CORS(api) 

@api.route('/register', methods=['POST'])
def register_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        raise APIException("Email y contraseña son requeridos", status_code=400)

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        raise APIException("El email ya está registrado", status_code=409)

    hashed_password = generate_password_hash(password)

    new_user = User(
        email=email,
        password=hashed_password,
        is_active=True
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "Usuario registrado exitosamente"}), 201
    except Exception as e:
        db.session.rollback()
        raise APIException(f"Error al registrar usuario: {str(e)}", status_code=500)

@api.route('/login', methods=['POST'])
def login_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        raise APIException("Email y contraseña son requeridos", status_code=400)

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        raise APIException("Email o contraseña incorrectos", status_code=401)

@api.route('/private', methods=['GET'])
@jwt_required()
def protected_route():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user:
        return jsonify({"msg": f"Bienvenido, {user.email}! Has accedido a una ruta privada.", "user": user.serialize()}), 200
    else:
        raise APIException("Usuario no encontrado o token inválido", status_code=404)

