import sqlalchemy
import jwt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from flask import Flask, request, jsonify
from flask_cors import CORS 


app = Flask(__name__)
CORS(app)
engine = create_engine('postgresql:///fitness_app.db',echo=True)
Base = sqlalchemy.orm.declarative_base()
Session = sessionmaker(bind=engine)
session = Session()

def createToken(email, password):
    SECRET_KEY = "your_secret_key"
    payload = {"email": email, "password": password, "exp": 1200}
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

class User(Base):
    __tablename__ = 'users'
    id = sqlalchemy.Column(sqlalchemy.Integer, autoincrement=True, primary_key=True)
    email = sqlalchemy.Column(sqlalchemy.String, unique=True, nullable=False)
    password = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    height = sqlalchemy.Column(sqlalchemy.Float, nullable=True)
    weight = sqlalchemy.Column(sqlalchemy.Float, nullable=True)
    age = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    gender = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    waist = sqlalchemy.Column(sqlalchemy.Float, nullable=True)
    hip = sqlalchemy.Column(sqlalchemy.Float, nullable=True)
    bfp = sqlalchemy.Column(sqlalchemy.Float, nullable=True)
    activity_level = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    goal = sqlalchemy.Column(sqlalchemy.String, nullable=True)

Base.metadata.create_all(engine)

@app.route('/api/register', methods=['post'])
def register_user():
    data = request.json
    new_user = User(
        email=data.get("email"),
        password=data.get("password"),
        height=data.get("height"),
    )
    query = session.query(User).filter_by(email=new_user.email).first()
    if query:
        return jsonify({"message": "Email already registered!"}), 400
    session.add(new_user)
    session.commit()
    return jsonify({"message": "User registered successfully!"}), 201

@app.route('/api/login', methods=['get'])
def login_user():
    email = request.args.get("email")
    password = request.args.get("password")
    user = session.query(User).filter_by(email=email, password=password).first()
    token = createToken(email, password)
    if user:
        return jsonify({"message": "Login successful!", "token": token}), 200
    else:
        return jsonify({"message": "Invalid email or password!"}), 401

@app.route('/api/profile', methods=['put'])
def update_profile():
    data = request.json
    user = session.query(User).filter_by(email=data.get("email")).first()

    if not user:
        return jsonify({"message": "User not found!"}), 404
    
    user.height = data.get("height", user.height)
    user.weight = data.get("weight", user.weight)
    user.age = data.get("age", user.age)
    user.gender = data.get("gender", user.gender)
    user.waist = data.get("waist", user.waist)
    user.hip = data.get("hip", user.hip)
    user.bfp = data.get("bfp", user.bfp)
    user.activity_level = data.get("activity_level", user.activity_level)
    user.goal = data.get("goal", user.goal)
    session.commit()

    return jsonify({"message": "Profile updated successfully!"}), 200
