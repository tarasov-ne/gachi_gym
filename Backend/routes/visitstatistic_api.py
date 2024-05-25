from flask import jsonify, request
from models import db, VisitStatistic, Client
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
import jwt

def visitStatistic_api(app):
    @app.route('/api/visitStatisticInsert', methods=['POST'])
    def visitStatisticInsert():
        token = request.headers.get('Authorization')
        if token:
            try:
                token_parts = token.split()
                if len(token_parts) != 2 or token_parts[0].lower() != 'bearer':
                    raise InvalidTokenError('Invalid token format')

                decoded_data = jwt.decode(token_parts[1], app.config['SECRET_KEY'], algorithms=['HS256'])
                user_id = decoded_data.get('user_id')
                client = Client.query.get(user_id)
                if client:
                    data = request.json
                    start_date = data['start_date']
                    end_date = data['end_date']
                    new_visit = VisitStatistic(client_id=client.id, start_date=start_date, end_date=end_date)
                    db.session.add(new_visit)
                    db.session.commit()
                    return jsonify({"visitStatistic": new_visit.serialize()})
                else:
                    return jsonify({"error": "no such client"})
            except ExpiredSignatureError:
                pass
            except InvalidTokenError:
                pass  
        return jsonify({"error": "unauthorized"}), 401
    
    @app.route('/api/visitStatisticUpdate/<int:visitstatistic_id>', methods=['PUT'])
    def visitStatistic_update(visitstatistic_id):
        data = request.json
        start_date = data['start_date']
        end_date = data['end_date']
        visitstat = VisitStatistic.query.get(visitstatistic_id)
        if not visitstat:
            return jsonify(0)
        visitstat.start_date = start_date
        visitstat.end_date = end_date
        db.session.commit()
        return jsonify(1)

    @app.route('/api/visitStatisticDelete/<int:visitstatistic_id>', methods=['DELETE'])
    def visitStatistic_delete(visitstatistic_id):
        visitStatistic = VisitStatistic.query.get(visitstatistic_id)
        if not visitStatistic:
            return jsonify(0)
        db.session.delete(visitStatistic)
        db.session.commit()
        return jsonify("status", True)