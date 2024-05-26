from flask import request, jsonify
import jwt
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models import db, Client, Trainer, TrainingRegistration



def training_registration_api(app):
    @jwt_required()
    @app.route("/api/getTrainingRegistrations", methods=['GET'])
    def get_trainingRegistrations():
        training_registrations = db.session.query(
            TrainingRegistration,
            Client,
            Trainer
        ).join(
            Client, TrainingRegistration.client_id == Client.id
        ).join(
            Trainer, TrainingRegistration.trainer_id == Trainer.id
        ).all()
        
        training_registration_list = []
        for training_registration, client, trainer in training_registrations:
            training_data = {
                'id': training_registration.id,
                'client': client.serialize(),
                'trainer': trainer.serialize(),
                'date': training_registration.date,
                'start': str(training_registration.start),
                'end': str(training_registration.end)
            }
            training_registration_list.append(training_data)
        return jsonify(training_registration_list)

    
    @app.route('/api/trainingRegistrationInsert', methods=['POST'])
    @jwt_required()
    def trainingRegistration_insert():
        current_user_id = get_jwt_identity()
        client = Client.query.get(current_user_id)
        if client:
            data = request.json
            date = data['date']
            start = data['start']
            trainer = Trainer.query.get(data['trainer']['id'])
            if trainer:
                new_tr = TrainingRegistration(client_id=client.id, trainer_id=trainer.id, date=date, start=start)
                db.session.add(new_tr)
                db.session.commit()
                return jsonify(1)
            else:
                return jsonify(0)
        else:
            return jsonify({"error": "no such client"})
        
    @app.route('/api/trainingRegistrationUpdate/<int:trainingRegistration_id>', methods=['PUT'])
    def trainingRegistrationUpdate(trainingRegistration_id):
        data = request.json
        trainingRegistration = TrainingRegistration.query.get(trainingRegistration_id)
        if not trainingRegistration:
            return jsonify(0)
        print(data)
        trainer = Trainer.query.get(data['trainer']['id'])
        if trainer:
            trainingRegistration.trainer_id = data['trainer']['id']
            trainingRegistration.date = data['date']
            trainingRegistration.start = data['start']
            db.session.commit()
            return jsonify(1)
        else:
            return jsonify(0)
        
    @app.route('/api/trainingRegistrationDelete/<int:trainingRegistration_id>', methods=['DELETE'])
    def trainingRegitration_delete(trainingRegistration_id):
        trainingRegistration = TrainingRegistration.query.get(trainingRegistration_id)
        if not trainingRegistration:
            return jsonify(0)
        db.session.delete(trainingRegistration)
        db.session.commit()
        return jsonify(1)
   