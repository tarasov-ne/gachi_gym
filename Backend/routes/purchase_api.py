from flask import request, jsonify
from models import db, Purchase, Client, Product
import jwt
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError

def purchase_api(app):
    @app.route('/api/purchaseInsert', methods=['POST'])
    def purchase_insert():
        data = request.json
        client_id = data['client_id']
        client = Client.query.get(client_id)
        if client:
            product_id = data['product_id']
            date = data['date']
            quantity = data['quantity']
            product = Product.query.get(product_id)
            if product:
                new_purchase = Purchase(client_id=client.id, product_id=product.id, date=date, quantity=quantity)
                db.session.add(new_purchase)
                db.session.commit()
                return jsonify({"purchase": new_purchase.serialize()})
            else:
                return jsonify({"error": "no such product"})
        else:
            return jsonify({"error": "no such client"})
    
    @app.route('/api/purchaseUpdate/<int:purchase_id>', methods=['PUT'])
    def purchase_update(purchase_id):
        data = request.json
        purchase = Purchase.query.get(purchase_id)
        if not purchase:
            return jsonify({"status": False})
        product = Product.query.get(data['product_id'])
        if product:
            purchase.product_id = data['product_id']
            purchase.date = data['date']
            purchase.quantity = data['quantity']
            db.session.commit()
            return jsonify({"status": True}), 200
        else:
            return jsonify({"error": "no such product"})
    
    @app.route('/api/purchaseDelete/<int:purchase_id>', methods=['DELETE'])
    def purchase_delete(purchase_id):
        purchase = Purchase.query.get(purchase_id)
        if not purchase:
            return jsonify({"status": False}), 404
        db.session.delete(purchase)
        db.session.commit()
        return jsonify({'status': True})