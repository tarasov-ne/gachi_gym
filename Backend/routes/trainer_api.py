from flask import jsonify, request
from models import db, Trainer, TrainingRegistration
from flask_cors import CORS

def trainer_api(app):
    CORS(app)
    @app.route('/api/getTrainers', methods=['GET'])
    def get_trainers():
        trainers = Trainer.query.all()
        trainer_list = [trainer.serialize() for trainer in trainers]
        return jsonify(trainer_list)
    
    @app.route('/api/trainerInsert', methods=['POST'])
    def trainer_insert():
        data = request.json
        name = data['name']
        surname = data['surname']
        phone_number = data['phone_number']
        new_trainer = Trainer(name=name, surname=surname, phone_number=phone_number)
        db.session.add(new_trainer)
        db.session.commit()
        return jsonify({"trainer_insert": new_trainer.serialize()})

    @app.route('/api/trainerUpdate/<int:trainer_id>', methods=['PUT'])
    def trainer_update(trainer_id):
        data = request.json
        trainer = Trainer.query.get(trainer_id)
        if trainer is None:
            return jsonify({"error": "Trainer not found"})
        trainer.name = data['name']
        trainer.surname = data['surname']
        trainer.phone_number = data['phone_number']
        db.session.commit()
        return jsonify({"statis": True})

    @app.route('/api/trainerDelete/<int:trainer_id>', methods=['DELETE'])
    def trainer_delete(trainer_id):
        try:
            trainer = Trainer.query.get(trainer_id)
            trainer_registration = TrainingRegistration.query.filter_by(trainer_id=trainer_id).first()
            if trainer_registration:
                return jsonify(0)
            if not trainer:
                return jsonify({"error": "Trainer not found"})
            db.session.delete(trainer)
            db.session.commit()
            return jsonify({"status": True})
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": str(e)}), 500