from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

db = SQLAlchemy()

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    price = db.Column(db.Integer())
    count = db.Column(db.Integer())
    purchase = db.relationship("Purchase", backref="product")

    def __init__(self, name, price, count):
        self.name = name
        self.price = price
        self.count = count

    def serialize(self):
        return {"id": self.id, "name": self.name, "price": self.price, "count": self.count}

class Trainer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String())
    surname = db.Column(db.String())
    phone_number = db.Column(db.String())
    training_registration = db.relationship("TrainingRegistration", backref='trainer')

    def __init__(self, name, surname, phone_number):
        self.name = name
        self.surname = surname
        self.phone_number = phone_number

    def serialize(self):
        return {"id": self.id, "name": self.name, "surname": self.surname, 
                "phone_number": self.phone_number}

class VisitStatistic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey("client.id"))
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)

    def __init__(self, client_id, start_date, end_date):
        self.client_id = client_id
        self.start_date = start_date
        self.end_date = end_date
    
    def serialize(self):
        return {"id": self.id, "client_id": self.client_id, "start_date": self.start_date, "end_date": self.end_date}

class TrainingRegistration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey("client.id"))
    trainer_id = db.Column(db.Integer, db.ForeignKey("trainer.id"))
    date = db.Column(db.Date)
    start = db.Column(db.Time)
    end = db.Column(db.Time)

    def __init__(self, client_id, trainer_id, date, start):
        self.client_id = client_id
        self.trainer_id = trainer_id
        self.date = date
        self.start = start

    def serialize(self):
        return {"id": self.id, "client_id": self.client_id, "trainer_id": self.trainer_id, "date": self.date, "start": str(self.start), "end": str(self.end)}

class Purchase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey("client.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("product.id"))
    date = db.Column(db.DateTime, default=db.func.now())
    quantity = db.Column(db.Integer())
    total_price = db.Column(db.Integer())

    def __init__(self, client_id, product_id, date, quantity):
        self.client_id = client_id
        self.product_id = product_id
        self.date = date
        self.quantity = quantity

    def serialize(self):
        return {"id": self.id, "client_id": self.client_id, "product_id": self.product_id, 
                "date": self.date, "quantity": self.quantity, "total_price": self.total_price}


class Membership(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String())
    price = db.Column(db.Integer)
    duration = db.Column(db.Integer)
    membership_registrations = db.relationship("MembershipRegistration", backref="membership")

    def __init__(self, name, price, duration):
        self.name = name
        self.price = price
        self.duration = duration

    def serialize(self):    
        return {"id": self.id, "name": self.name, "price": self.price, "duration": self.duration}

class MembershipRegistration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey("client.id"))
    membership_id = db.Column(db.Integer, db.ForeignKey("membership.id"))
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)

    def __init__(self, client_id, membership_id, start_date):
        self.client_id = client_id
        self.membership_id = membership_id
        self.start_date = start_date
    
    def serialize(self):
        return {"id": self.id, "client_id": self.client_id, "membership_id": self.membership_id,
                "start_date": self.start_date, "end_date": self.end_date}

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    login = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(), nullable=False)
    surname = db.Column(db.String(), nullable=False)
    phone_number = db.Column(db.String(), nullable=False)
    e_mail = db.Column(db.String(), nullable=False)
    membership_active = db.Column(db.Boolean, default=False)
    membership = db.relationship("MembershipRegistration", backref='client')
    purchase = db.relationship("Purchase", backref='client')
    training_registration = db.relationship("TrainingRegistration", backref='client')
    visit_statistic = db.relationship("VisitStatistic", backref='client')

    def __init__(self, login, password, surname, name, phone_number, e_mail, membership_active):
        self.name = name
        self.surname = surname
        self.login = login
        self.password = password
        self.phone_number = phone_number
        self.e_mail = e_mail
        self.membership_active = membership_active

    def serialize(self):
        return {"id": self.id, "login": self.login, "password": self.password,
                "name": self.name, "surname": self.surname, "phone_number": self.phone_number, "e_mail": self.e_mail, "membership_active": self.membership_active }