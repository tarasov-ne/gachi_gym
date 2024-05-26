from flask import request, jsonify
from models import db, Product
from flask_jwt_extended import jwt_required

def product_api(app):
    @jwt_required()
    @app.route('/api/getProducts', methods=['GET'])
    def get_products():
        products = Product.query.all()
        product_list = [product.serialize() for product in products]
        return jsonify(product_list), 200
    
    @jwt_required()
    @app.route('/api/productInsert', methods=['POST'])
    def product_insert():
        data = request.json
        name = data['name']
        existing_product = Product.query.filter_by(name=name).first()
        if existing_product:
            return jsonify("error"), 500
        price = data['price']
        count = data['count']
        new_product = Product(name=name, price=price, count=count)
        db.session.add(new_product)
        db.session.commit()
        return jsonify({'new_product': new_product.serialize()})