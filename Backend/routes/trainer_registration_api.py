from flask import request, jsonify
import jwt
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models import db, Client, Trainer, TrainingRegistration
from sqlalchemy import func
from datetime import datetime



def training_registration_api(app):
    @app.route("/api/getTrainingRegistrations/<int:year>/<int:month>/<int:day>", methods=['GET'])
    def get_employee_calendar(year, month, day):
        date_str = f"{day:02d}.{month:02d}.{year}"

        # Преобразование строки с датой в объект datetime
        date_training = datetime.strptime(date_str, '%d.%m.%Y')

        # Форматирование даты для сравнения с датой в базе данных
        formatted_date = date_training.strftime('%d.%m.%Y')

        # Получение записей из базы данных с совпадающей датой
        trainings = TrainingRegistration.query.filter(func.cast(TrainingRegistration.date, db.String) == formatted_date).all()

        ser_trainings = []
        for training in trainings:
            ser_training = training.serialize()
            client = Client.query.get(training.client_id)
            trainer = Trainer.query.get(training.trainer_id)
            
            ser_training['client_last_name'] = client.surname if client else None
            ser_training['trainer_last_name'] = trainer.surname if trainer else None
            ser_trainings.append(ser_training)

        # Возврат сериализованных данных в формате JSON
        return jsonify(ser_trainings), 200
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

        
    # if day > 31 or day < 1 or month > 12 or month < 1:
        #     return jsonify({'message': 'Invalid args'}), 400

        # try:
        #     verify_jwt_in_request()
        #     currentEmployee = get_jwt_identity()
        #     employee_calendars = db.session.query(TrainingRegistration) \
        #         .join(Client) \
        #         .filter(
        #         Client.id == currentEmployee,
        #         TrainingRegistration.date == datetime(year, month, day)
        #     ) \
        #         .order_by(TrainingRegistration.created_at) \
        #         .all()
        #     if not employee_calendars:
        #         return jsonify([]), 204
        #     new_intervals = split_intervals(employee_calendars)
        #     result = []
        #     for interval in new_intervals:
        #         if interval.presence_id == 0:
        #             continue
        #         start_hour, start_minute = interval.start_time.hour, interval.start_time.minute
        #         end_hour, end_minute = interval.end_time.hour, interval.end_time.minute
        #         interval_dict = {
        #             "id": interval.id,
        #             "from": {"h": start_hour, "m": start_minute},
        #             "to": {"h": end_hour, "m": end_minute},
        #         }
        #         print(result)
        #         result.append(interval_dict)
        #     return jsonify(result), 200

        # except Exception as ex:
        #     jsonify({"message": "Database erorr"}), 500
        #     print(ex)
    
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
    
    # @app.route('/api/trainingRegistrationData', methods=['GET'])
    # def trainingRegistrationData():
        # try:
        #     # Получение данных о записях на занятия из базы данных
        #     training_registrations = TrainingRegistration.query.all()
            
        #     # Преобразование данных в сериализованный формат
        #     serialized_data = [registration.serialize() for registration in training_registrations]

        #     # Возврат данных в формате JSON
        #     return jsonify(serialized_data)
        # except Exception as e:
        # # Обработка ошибок, если они возникли
        #     return jsonify({"error": str(e)}), 500
   