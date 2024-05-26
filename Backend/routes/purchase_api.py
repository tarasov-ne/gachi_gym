from flask import request, jsonify
from models import db, Purchase, Client, Product
from flask_jwt_extended import jwt_required

def purchase_api(app):
    @jwt_required()
    @app.route('/api/getPurchases', methods=['GET'])
    def get_purchases():
        purchases = Purchase.query.all()
        purchases_list = [purchase.serialize() for purchase in purchases]
        return jsonify(purchases_list), 200
    
    @jwt_required()
    @app.route('/api/purchaseInsert', methods=['POST'])
    def purchase_insert():
        data = request.json
        client_id = data['client_id']
        client = Client.query.get(client_id)
        if client:
            product_id = data['product_id']
            date = data['date']
            time = data['time']
            quantity = data['quantity']
            product = Product.query.get(product_id)
            if product:
                new_purchase = Purchase(client_id=client.id, product_id=product.id, date=date, time=time, quantity=quantity)
                db.session.add(new_purchase)
                db.session.commit()
                return jsonify({"purchase": new_purchase.serialize()})
            else:
                return jsonify({"error": "no such product"})
        else:
            return jsonify({"error": "no such client"})