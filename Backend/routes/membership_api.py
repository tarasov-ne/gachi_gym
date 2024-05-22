from flask import jsonify, request
from models import db, Membership, MembershipRegistration

def membership_api(app):
    @app.route('/api/membershipInsert', methods=['POST'])
    def membership_insert():
        data = request.json
        name = data['name']
        price = data['price']
        duration = data['duration']
        new_membership = Membership(name=name, price=price, duration=duration)
        db.session.add(new_membership)
        db.session.commit()
        return jsonify({"membership_insert": new_membership.serialize()})

    @app.route('/api/membershipUpdate/<int:membership_id>', methods=['PUT'])
    def membership_update(membership_id):
        data = request.json
        membership = Membership.query.get(membership_id)
        if not membership:
            return jsonify({"error": "Membership not found"}), 404
        
        membership.name = data['name']
        membership.price = data['price']
        membership.duration = data['duration']
        db.session.commit()
        return jsonify({"status": True})

    @app.route('/api/membershipDelete/<int:membership_id>', methods=['DELETE'])
    def membership_delete(membership_id):
        membership = Membership.query.get(membership_id)
        membership_registration = MembershipRegistration.query.filter_by(membership_id=membership_id)
        if membership_registration:
            return jsonify(0)
        if not membership:
            return jsonify({"error": "Membership not found"}), 404
        db.session.delete(membership)
        db.session.commit()
        return jsonify({"status": True})