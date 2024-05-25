from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Client, Membership, Product, Trainer, VisitStatistic, Purchase, MembershipRegistration, TrainingRegistration
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request, JWTManager
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from routes.membership_api import membership_api
from routes.client_api import client_api
from routes.membership_registration_api import membershipRegistration_api
from routes.product_api import product_api
from routes.trainer_api import trainer_api
from routes.visitstatistic_api import visitStatistic_api
from routes.trainer_registration_api import training_registration_api
from routes.purchase_api import purchase_api

app = Flask(__name__)

CORS(app)
jwt = JWTManager(app)
app.config['SECRET_KEY'] = "acakdamsdasdkl,123o1k2n"
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:postgres@localhost:5432/gym"
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/session', methods=['GET']) 
@jwt_required()  # Декоратор, требующий JWT для доступа к эндпоинту
def session_check():
    current_user_id = get_jwt_identity()  # Получаем идентификатор текущего пользователя из JWT
    if current_user_id:
        user = Client.query.get(current_user_id)
        if user:
            return jsonify({"authenticated": True, "user": user.serialize()}), 200
    
    return jsonify({"authenticated": False, "user": None, "error": "Unauthorized"}), 401
    
@app.route('/api/getData', methods=['GET'])
#@jwt_required()  # Добавляем декоратор, требующий наличие действительного JWT токена
def data():
    # current_user_id = get_jwt_identity()  # Получаем идентификатор текущего пользователя из токена

    clients = Client.query.all()
    client_list = [client.serialize() for client in clients]
    
    memberships = Membership.query.all()
    membership_list = [membership.serialize() for membership in memberships]
    
    products = Product.query.all()
    product_list = [product.serialize() for product in products]
    
    membershipRegistrations = MembershipRegistration.query.all()
    membershipRegistration_list = [membershipRegistration.serialize() for membershipRegistration in membershipRegistrations]
    
    purchases = Purchase.query.all()
    purchase_list = [purchase.serialize() for purchase in purchases]
    
    trainers = Trainer.query.all()
    trainer_list = [trainer.serialize() for trainer in trainers]
    
    trainerRegistrations = TrainingRegistration.query.all()
    trainerRegistration_list = [trainerRegistration.serialize() for trainerRegistration in trainerRegistrations]
        
    visitStatistics = VisitStatistic.query.all()
    visitStatistic_list = [visitStatistic.serialize() for visitStatistic in visitStatistics]

    return jsonify({"Client": client_list, "Membership": membership_list, "MembershipRegistration": membershipRegistration_list,
                    "Product": product_list, "Purchase": purchase_list, "Trainer": trainer_list,
                    "TrainingRegistration": trainerRegistration_list, "VisitStatistic": visitStatistic_list})



membership_api(app)
client_api(app)
membershipRegistration_api(app)
product_api(app)
purchase_api(app)
trainer_api(app)
visitStatistic_api(app)
training_registration_api(app)


if __name__ == "__main__":
     app.run(debug=True)