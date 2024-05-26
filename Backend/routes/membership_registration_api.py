from flask import jsonify, request
from models import db, MembershipRegistration, Client, Membership
from flask_jwt_extended import jwt_required

def membershipRegistration_api(app):
    @jwt_required()
    @app.route('/api/getMembershipRegistrations', methods=['GET'])
    def get_membership_registrations():
        membershipRegs = MembershipRegistration.query.all()
        membershipReg_list = [membershipReg.serialize() for membershipReg in membershipRegs]
        return jsonify(membershipReg_list), 200
        
    @app.route('/api/membershipRegistrationInsert', methods=['POST'])
    def membershipRegistrationInsert():
        data = request.json
        client_id = data['client_id']
        client = Client.query.get(client_id)
        membership_id = data['membership_id']
        start_date = data['start_date']
        membership = Membership.query.get(membership_id)
        if not (membership or client):
            return jsonify({"error": "data not found"})
        new_membershipRegistration = MembershipRegistration(client_id=client_id, membership_id=membership_id, start_date=start_date)
        db.session.add(new_membershipRegistration)
        db.session.commit()
        print (new_membershipRegistration.serialize())
        return jsonify({"status": True})