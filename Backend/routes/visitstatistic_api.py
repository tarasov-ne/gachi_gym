from flask import jsonify, request
from models import db, VisitStatistic, Client
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
from flask_jwt_extended import jwt_required, get_jwt_identity
import jwt

def visitStatistic_api(app):
    @jwt_required()
    @app.route('/api/getVisitStatistics', methods=['GET'])
    def get_visit_statistics():
        visitStatistics = VisitStatistic.query.all()
        visitStatistics_list = [visitStatistic.serialize() for visitStatistic in visitStatistics]
        return jsonify(visitStatistics_list)
    
    @app.route('/api/visitStatisticInsert', methods=['POST'])
    def visitStatisticInsert():
        data = request.json
        print(data)
        client_id = data["client_id"]
        start_date = data['start_date']
        start_time = data['start_time']
        end_date = data['end_date']
        end_time = data['end_time']
        new_visit = VisitStatistic(client_id=client_id, start_date=start_date, start_time=start_time, end_date=end_date, end_time=end_time)
        db.session.add(new_visit)
        db.session.commit()
        return jsonify({"visitStatistic": new_visit.serialize()})