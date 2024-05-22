from flask import jsonify, request
from flask_cors import CORS
from models import db, MembershipRegistration, Client, Membership
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
import jwt

def membershipRegistration_api(app):
    @app.route('/api/membershipRegistrationInsert', methods=['POST'])
    def membershipRegistrationInsert():
        data = request.json
        client_id = data['client_id']
        client = Client.query.get(client_id)
        membership_id = data['membership_id']
        start_date = data['start_date']
        membership = Membership.query.get(membership_id)

        if not (membership or client):
            print("YOU ARE SEMEN")
            return jsonify({"error": "data not found"})
        new_membershipRegistration = MembershipRegistration(client_id=client_id, membership_id=membership_id, start_date=start_date)
        db.session.add(new_membershipRegistration)
        db.session.commit()
        print (new_membershipRegistration.serialize())
        return jsonify({"status": True})

        # token = request.headers.get('Authorization')
        # if token:
        #     try:
        #         token_parts = token.split()
        #         if len(token_parts) != 2 or token_parts[0].lower() != 'bearer':
        #             raise InvalidTokenError('Invalid token format')

        #         decoded_data = jwt.decode(token_parts[1], app.config['SECRET_KEY'], algorithms=['HS256'])
        #         user_id = decoded_data.get('user_id')
        #         client = Client.query.get(user_id)
        #         if client:
        #             data = request.json
        #             membership_id = data['membership_id']
        #             start_date = data['start_date']
        #             membership = Membership.query.get(membership_id)
        #             if membership:
        #                 new_membershipRegistration = MembershipRegistration(client_id=client.id, membership_id=membership_id, start_date=start_date)
        #                 db.session.add(new_membershipRegistration)
        #                 db.session.commit()
        #                 return jsonify({"membershipRegistration": new_membershipRegistration.serialize()})
        #             else:
        #                 return jsonify({"error": "no such membership"})
        #         else:
        #             return jsonify({"error": "no such client"})
        #     except ExpiredSignatureError:
        #         pass
        #     except InvalidTokenError:
        #         pass  
        # return jsonify({"error": "unauthorized"}), 401
    
    @app.route('/api/membershipRegistrationUpdate/<int:membershipRegistration_id>', methods=['PUT'])
    def membershipRegistrationUpdate(membershipRegistration_id):
        data = request.json
        membershipRegistration = MembershipRegistration.query.get(membershipRegistration_id)
        if not membershipRegistration:
            return jsonify({"status": False, "message": "MembershipRegistration not found"}), 404
        membership = Membership.query.get(data['membership_id'])
        if membership:
            membershipRegistration.client_id = data['client_id']
            membershipRegistration.membership_id = data['membership_id']
            membershipRegistration.start_date = data['start_date']
            db.session.commit()
            return jsonify({"status": True}), 200
        else:
            return jsonify({"error": "no such membership"}), 404

    
    @app.route('/api/membershipRegistrationDelete/<int:membershipRegistration_id>', methods=['DELETE'])
    def membershipRegistrationDelete(membershipRegistration_id):
        membershipRegistration = MembershipRegistration.query.get(membershipRegistration_id)
        if not membershipRegistration:
            return jsonify({"status": False}), 404
        db.session.delete(membershipRegistration)
        db.session.commit()
        return jsonify({"status": True})