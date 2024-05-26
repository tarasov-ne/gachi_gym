from flask import jsonify, request
from flask_cors import CORS
from models import db, Client, MembershipRegistration, TrainingRegistration, VisitStatistic, Purchase
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required

def client_api(app):
    @jwt_required()
    @app.route('/api/getClients', methods=['GET'])
    def get_clients():
        clients = Client.query.all()
        clients_list = [client.serialize() for client in clients]
        return jsonify(clients_list)
    
    @app.route('/api/addClient', methods=['POST'])
    def addClient():
        try:
            data = request.json
            print(data)
            login = data["login"]
            existing_user = Client.query.filter_by(login=login).first()
            if existing_user:
                return jsonify({"error": "Клиент с таким логином уже существует"}), 400
            password = data["password"]
            name = data["name"]
            surname = data["surname"]
            phone_number = data["phone_number"]
            e_mail = data["e_mail"]
            membership_active=data['membership_active']
            new_client = Client(login=login, password=password, surname=surname, name=name, phone_number=phone_number, e_mail=e_mail, membership_active=membership_active)
            db.session.add(new_client)
            db.session.commit()

            token = create_access_token(identity=new_client.id)
            return jsonify({"token": token, "user": new_client.serialize()})
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": str(e)}), 500

    @app.route('/api/login', methods=['POST'])
    def login():
        try:
            data = request.json
            print(data)
            login = data["login"]
            password = data["password"]
            user = Client.query.filter_by(login=login).first()
            if not user:
                return jsonify({"success": False, "error": "Invalid login or password"}), 401
            if user.login == login and user.password == password:
                token = create_access_token(identity=user.id)  # Создание JWT токена
                return jsonify({"success": True, "message": "Login successful", "user": user.serialize(), "token": token})
            else:
                return jsonify({"success": False, "error": "Invalid login or password"}), 401
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"success": False, "error": str(e)}), 500