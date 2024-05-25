from flask import request, jsonify
from models import db, Product, Purchase

def product_api(app):
    @app.route('/api/productInsert', methods=['POST'])
    def product_insert():
        data = request.json
        name = data['name']
        price = data['price']
        count = data['count']
        new_product = Product(name=name, price=price, count=count)
        db.session.add(new_product)
        db.session.commit()
        return jsonify({'new_product': new_product.serialize()})
    
    @app.route('/api/productUpdate/<int:product_id>', methods=['PUT'])
    def product_update(product_id):
        data = request.json
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"})
        product.name = data['name']
        product.price = data['price']
        product.count = data['count']
        db.session.commit()
        return jsonify({"status": True})
    
    @app.route('/api/productDelete/<int:product_id>', methods=['DELETE'])
    def product_delete(product_id):
        product = Product.query.get(product_id)
        purchase = Purchase.query.filter_by(product_id=product_id)
        if purchase:
            return jsonify(0)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        db.session.delete(product)
        db.session.commit()
        return jsonify({"status": True})