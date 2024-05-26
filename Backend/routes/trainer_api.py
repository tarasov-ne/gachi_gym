from flask import jsonify, request
from models import db, Trainer
from flask_jwt_extended import jwt_required

def trainer_api(app):
    @jwt_required()
    @app.route('/api/getTrainers', methods=['GET'])
    def get_trainers():
        trainers = Trainer.query.all()
        trainer_list = [trainer.serialize() for trainer in trainers]
        return jsonify(trainer_list)
    
    @jwt_required()
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