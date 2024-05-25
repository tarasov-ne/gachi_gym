from flask import jsonify, request
from flask_cors import CORS
from models import db, Client, MembershipRegistration, TrainingRegistration, VisitStatistic, Purchase
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
import jwt

def client_api(app):
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
            hash_password = generate_password_hash(password=password, method="sha256")
            name = data["name"]
            surname = data["surname"]
            phone_number = data["phone_number"]
            e_mail = data["e_mail"]
            membership_active=data['membership_active']
            new_client = Client(login=login, password=hash_password, surname=surname, name=name, phone_number=phone_number, e_mail=e_mail, membership_active=membership_active)
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
            if check_password_hash(user.password, password) and user.login == login:
                token = create_access_token(identity=user.id)  # Создание JWT токена
                return jsonify({"success": True, "message": "Login successful", "user": user.serialize(), "token": token})
            else:
                return jsonify({"success": False, "error": "Invalid login or password"}), 401
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"success": False, "error": str(e)}), 500

        
    @app.route('/api/clientUpdate/<int:client_id>', methods=['PUT'])
    def client_update(client_id):
        data = request.json
        print(data)
        client = Client.query.get(client_id)
        if not client:
            return jsonify(0)
        existing_user = Client.query.filter_by(login=data['login']).first()
        if existing_user:
            return jsonify({"error": "Клиент с таким логином уже существует"}), 400
        client.login = data['login']
        password = data["password"]
        hash_password = generate_password_hash(password=password, method="sha256")
        client.password = hash_password
        client.name = data["name"]
        client.surname = data["surname"]
        client.phone_number = data["phone_number"]
        client.e_mail = data["e_mail"]
        client.membership_active = data["membership_active"]
        db.session.commit()
        return jsonify(1)
    
    @app.route('/api/clientDelete/<int:client_id>', methods=['DELETE'])
    def client_delete(client_id):
        client = Client.query.get(client_id)
        if not client:
            return jsonify(0)
        membershipRegistration = MembershipRegistration.query.filter_by(client_id=client_id).first()
        if membershipRegistration:
            return jsonify(0)
        trainingRegistration = TrainingRegistration.query.filter_by(client_id=client_id).first()
        if trainingRegistration:
            return jsonify(0)
        visitStatistic = VisitStatistic.query.filter_by(client_id=client_id).first()
        if visitStatistic:
            return jsonify(0)
        purchase = Purchase.query.filter_by(client_id=client_id).first()
        if purchase:
            return jsonify(0)
        
        db.session.delete(client)
        db.session.commit()
        return jsonify(1)