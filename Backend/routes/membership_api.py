from flask import jsonify, request
from models import db, Membership
from flask_jwt_extended import jwt_required

def membership_api(app):
    @jwt_required()
    @app.route('/api/getMemberships', methods=['GET'])
    def get_memberships():
        memberships = Membership.query.all()
        membership_list = [membership.serialize() for membership in memberships]
        return jsonify(membership_list), 200

    @jwt_required()
    @app.route('/api/membershipInsert', methods=['POST'])
    def membership_insert():
        data = request.json
        name = data['name']
        existing_membership = Membership.query.filter_by(name=name).first()
        if existing_membership:
            return jsonify("error"), 500
        price = data['price']
        duration = data['duration']
        new_membership = Membership(name=name, price=price, duration=duration)
        db.session.add(new_membership)
        db.session.commit()
        return jsonify({"membership_insert": new_membership.serialize()})