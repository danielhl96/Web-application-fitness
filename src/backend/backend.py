from datetime import datetime, timedelta, UTC
import smtplib
import sqlalchemy
import jwt
import uuid
import redis
import os
import base64
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker, scoped_session, relationship
from flask import Flask, make_response, request, jsonify
from flask_cors import CORS
from email.message import EmailMessage
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError  # Import hinzufügen
from sqlalchemy.orm import joinedload
from dotenv import load_dotenv
from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
import json
import re

load_dotenv()  # lädt .env in os.environ

# Konfiguration aus ENV
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret')
app.config['JWT_ALGORITHM'] = os.getenv('JWT_ALGORITHM', 'HS256')
ENV = os.getenv('FLASK_ENV', 'development')

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql+psycopg2://postgres:1234@localhost:5432/postgres')
REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
REDIS_DB = int(os.getenv('REDIS_DB', 0))

ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')

# engine/session/redis
engine = create_engine(DATABASE_URL, echo=(ENV != 'production'))
SessionFactory = sessionmaker(bind=engine)
session = scoped_session(SessionFactory)
Base = sqlalchemy.orm.declarative_base()
#redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)
print("Connecting to Redis at:", REDIS_HOST)
redis_client = redis.from_url(REDIS_HOST)



# initialisiere flask-cors für alle /api/* Routen
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}})


EXPECTED_AUDIENCE = os.getenv('JWT_AUDIENCE', 'user')
EXPECTED_ISSUER = os.getenv('JWT_ISSUER', 'fitness_app')
argon2 = PasswordHasher(time_cost=3, memory_cost=256, parallelism=4, hash_len=32, salt_len=16)

def create_token(user_id, expiretime):
    SECRET_KEY = app.config['SECRET_KEY']
    now = datetime.now(UTC)
    payload = {
        "sub": str(user_id),
        "iss": EXPECTED_ISSUER,
        "aud": EXPECTED_AUDIENCE,
        "exp": int((now + timedelta(minutes = expiretime)).timestamp()), #Expiretime in minutes 
        "iat": int(now.timestamp()),
        "nbf": int(now.timestamp()),
        "jti": str(uuid.uuid4())
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=app.config['JWT_ALGORITHM'])
    return token

def revoke_token(token):
    jti = token['jti']
    exp = token['exp']
    now = datetime.now(UTC)
    ttl = exp - int(now.timestamp())
    if ttl > 0:
        redis_client.setex(jti, ttl, '1')
    

def verify_token(token):
    SECRET_KEY = app.config['SECRET_KEY']
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[app.config['JWT_ALGORITHM']], audience=EXPECTED_AUDIENCE, issuer=EXPECTED_ISSUER)
        if redis_client.get(payload['jti']):
            return {"error": "Token has been revoked"}  
        
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}
    except jwt.InvalidAudienceError:
        return {"error": "Invalid audience"}
    except jwt.InvalidIssuerError:
        return {"error": "Invalid issuer"}
    except Exception as e:
        return {"error": str(e)}
    return payload

def send_email(to_email, safety_code):
    try:
        msg = EmailMessage()
        msg.set_content(f"Your password reset code is: {safety_code}")
        msg['Subject'] = 'Password Reset Code'  
        msg['From'] = os.getenv('SMTP_USER', '')
        msg['To'] = to_email

        smtp_server = os.getenv('SMTP_HOST', 'smtp.example.com')
        smtp_port = os.getenv('SMTP_PORT', 587)
        smtp_password= os.getenv('SMTP_PASS', '')

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(os.getenv('SMTP_USER', ''), smtp_password)
            server.send_message(msg)
    except Exception as e:
        print(f"Failed to send email: {e}")
        return jsonify({"message": "Failed to send email"}), 500

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
    bmi = sqlalchemy.Column(sqlalchemy.Float, nullable=True)
    calories = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)

class Exercise(Base):
    __tablename__ = 'exercises'
    id = sqlalchemy.Column(sqlalchemy.Integer, autoincrement=True, primary_key=True)
    user_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), nullable=False)
    workout_plan_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('workout_plans.id'), nullable=True)
    user = relationship("User", backref="exercises")
    date = sqlalchemy.Column(sqlalchemy.Date, nullable=False)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    sets = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)
    reps = sqlalchemy.Column(sqlalchemy.ARRAY(sqlalchemy.Integer), nullable=False)
    weights = sqlalchemy.Column(sqlalchemy.ARRAY(sqlalchemy.Float), nullable=True)  

class PlanExerciseTemplate(Base):
    __tablename__ = 'plan_exercise_templates'
    id = sqlalchemy.Column(sqlalchemy.Integer, autoincrement=True, primary_key=True)
    workout_plan_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('workout_plans.id'), nullable=False)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    sets = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)
    reps_template = sqlalchemy.Column(sqlalchemy.ARRAY(sqlalchemy.Integer), nullable=True)
    weights_template = sqlalchemy.Column(sqlalchemy.ARRAY(sqlalchemy.Float), nullable=True)
    date = sqlalchemy.Column(sqlalchemy.Date, nullable=False)

class WorkoutPlan(Base):
    __tablename__ = 'workout_plans'
    id = sqlalchemy.Column(sqlalchemy.Integer, autoincrement=True, primary_key=True)
    user_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), nullable=False)
    user = relationship("User", backref="workout_plans")
    name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    exercises = relationship("Exercise", backref="workout_plan", lazy=True)
    templates = relationship("PlanExerciseTemplate", backref="workout_plan", lazy=True)

class Meal(Base):
    __tablename__ = 'meals'
    id = sqlalchemy.Column(sqlalchemy.Integer, autoincrement=True, primary_key=True)
    user_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), nullable=False)
    user = relationship("User", backref="meals")
    name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    date = sqlalchemy.Column(sqlalchemy.Date, nullable=False)
    calories = sqlalchemy.Column(sqlalchemy.Integer, nullable=True)
    protein = sqlalchemy.Column(sqlalchemy.Float, nullable=True)
    carbs = sqlalchemy.Column(sqlalchemy.Float, nullable=True)
    fats = sqlalchemy.Column(sqlalchemy.Float, nullable=True)
    mealtype = sqlalchemy.Column(sqlalchemy.String, nullable=True)  # breakfast, lunch, dinner, snack

class HistoryBodyMetrics(Base):
    __tablename__ = 'history_body_metrics'
    id = sqlalchemy.Column(sqlalchemy.Integer, autoincrement=True, primary_key=True)
    user_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), nullable=False)
    user = relationship("User", backref="body_metrics_history")
    date = sqlalchemy.Column(sqlalchemy.Date, nullable=False)
    weight = sqlalchemy.Column(sqlalchemy.Float, nullable=True)
    waist = sqlalchemy.Column(sqlalchemy.Float, nullable=True)
    hip = sqlalchemy.Column(sqlalchemy.Float, nullable=True)
    bfp = sqlalchemy.Column(sqlalchemy.Float, nullable=True)
    


Base.metadata.create_all(engine)

def hash_password(password):
    return argon2.hash(password)

@app.route("/api")
def hello_world():
    return {"message": "Hello, World!"}

@app.route('/api/register', methods=['post'])
def register_user():
    data = request.json
    new_user = User(
        email=data.get("email").lower(),
        password=hash_password(data.get("password")),
    )
    query = session.query(User).filter_by(email=new_user.email).first()
    if query:
        return jsonify({"message": "Email already registered!"}), 400
    session.add(new_user)
    session.commit()
    return jsonify({"message": "User registered successfully!"}), 201

@app.route('/api/login', methods=['GET'])
def login_user():
    if( not request.args.get("email") or not request.args.get("password")):
        return jsonify({"message": "Email and password are required!"}), 400
    email = request.args.get("email").lower()
    password = request.args.get("password")
    user = session.query(User).filter_by(email=email).first()
    if user.locked:
        return jsonify({"message": "Account is locked. Please try again later."}), 403
    if user and argon2.verify(user.password, password):
        token = create_token(user.id, 15)
        resp = jsonify({"message": "Login successful!"})
        resp.set_cookie(
            "access_token",
            token,
            httponly=True,
            secure=True,  # Bleibt True für HTTPS
            samesite="None",
            #partitioned=True,  # Neu hinzugefügt, um die Warnung zu beheben
            max_age=60*60*4  # 4 Stunden
        )
        return resp, 200
    else:
        return jsonify({"message": "Invalid email or password!"}, 401)

def get_token_from_cookie():
    token = request.cookies.get("access_token")
    if not token:
        return None
    return token

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify({"message": "User not found!"}), 404
    
    data = request.get_json()
    
    history_exists = session.query(HistoryBodyMetrics).filter_by(user_id=user.id, date=datetime.now().date()).first()
    if not history_exists:
        new_history = HistoryBodyMetrics(
        user_id=user.id,
        date=datetime.now().date(),
        weight= data.get("weight", user.weight),
        waist=data.get("waist", user.waist),
        hip=data.get("hip", user.hip),
        bfp=data.get("bfp", user.bfp)
    )
        session.add(new_history)
    else:
        history_exists.weight = data.get("weight", user.weight)
        history_exists.waist = data.get("waist", user.waist)
        history_exists.hip = data.get("hip", user.hip)
        history_exists.bfp = data.get("bfp", user.bfp)
        

   
    user.height = data.get("height", user.height)
    user.weight = data.get("weight", user.weight)
    user.age = data.get("age", user.age)
    user.gender = data.get("gender", user.gender)
    user.waist = data.get("waist", user.waist)
    user.hip = data.get("hip", user.hip)
    user.bfp = data.get("bfp", user.bfp)
    user.activity_level = data.get("activity", user.activity_level)
    user.goal = data.get("goal", user.goal)
    user.bmi = data.get("bmi", user.bmi)
    user.calories = data.get("calories", user.calories)

    session.commit()
    return jsonify({"message": "Profile updated successfully!"}), 200

@app.route('/api/get_profile', methods=['get'])
def get_profile():
    token = get_token_from_cookie()
    print("Token:", token)
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify({"message": "User not found!"}), 404

    user_data = {
        "email": user.email,
        "height": user.height,
        "weight": user.weight,
        "age": user.age,
        "gender": user.gender,
        "waist": user.waist,
        "hip": user.hip,
        "bfp": user.bfp,
        "activity_level": user.activity_level,
        "goal": user.goal,
        "bmi": user.bmi,
        "calories": user.calories
    }
    return jsonify(user_data), 200

@app.route('/api/get_history', methods=['GET'])
def get_history():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    history = session.query(HistoryBodyMetrics).filter_by(user_id=user_id).all()
    history_data = [
        {
            "date": record.date.isoformat(),
            "weight": record.weight,
            "waist": record.waist,
            "hip": record.hip,
            "bfp": record.bfp
        }
        for record in history
    ]

    history_data.sort(key=lambda x: x["date"])

    return jsonify(history_data), 200

@app.route('/api/logout', methods=['post'])
def logout_user():
    token = get_token_from_cookie()
    if token:
        payload = verify_token(token)
        if payload.get("error"):
            return jsonify({"message": payload["error"]}), 401
        revoke_token(payload)
        resp = jsonify({"message": "Logout successful!"})
        resp.set_cookie("access_token", "", expires=0)
        return resp, 200
    return jsonify({"message": "No token provided!"}), 400

@app.route('/api/change_email', methods=['put'])
def change_email():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401
    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401
    user_id = verification.get("sub")   
    data = request.json
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify({"message": "User not found!"}), 404
    try:
        if not argon2.verify(user.password, data.get("password")):
            return jsonify({"message": "Password is incorrect!"}), 400
    except VerifyMismatchError:
        return jsonify({"message": "Password is incorrect!"}), 400
    
    user.email = data.get("new_email").lower()
    session.commit()
    return jsonify({"message": "Email changed successfully!"}), 200

@app.route('/api/delete_account', methods=['delete'])
def delete_account():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401
    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401
    user_id = verification.get("sub")
    password = request.json.get("password")
    user = session.query(User).filter_by(id=user_id).first()
    data = request.json
    try:
        if not argon2.verify(user.password, data.get("password")):
            return jsonify({"message": "Password is incorrect!"}), 400
    except VerifyMismatchError:
        return jsonify({"message": "Password is incorrect!"}), 400  
    if not argon2.verify(user.password, data.get("password")):
        return jsonify({"message": "Password is incorrect!"}), 400
    
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify({"message": "User not found!"}), 404
    session.query(Exercise).filter_by(user_id=user_id).delete(synchronize_session=False)
    session.query(PlanExerciseTemplate).filter(PlanExerciseTemplate.workout_plan_id.in_(
        session.query(WorkoutPlan.id).filter_by(user_id=user_id)
    )).delete(synchronize_session=False)
    session.query(WorkoutPlan).filter_by(user_id=user_id).delete(synchronize_session=False)


    session.delete(user)
    session.commit()
    return jsonify({"message": "Account deleted successfully!"})

@app.route('/api/change_password', methods=['put'])
def change_password():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401
    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401
    user_id = verification.get("sub")
    data = request.json
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify({"message": "User not found!"}), 404
    
   
    try:
        if not argon2.verify(user.password, data.get("old_password")):
            return jsonify({"message": "Old password is incorrect!"}), 400
    except VerifyMismatchError:
        return jsonify({"message": "Old password is incorrect!"}), 400
    
    
    try:
        if argon2.verify(user.password, data.get("new_password")):
            return jsonify({"message": "New password cannot be the same as the old password!"}), 400
    except VerifyMismatchError:
        pass  
    
    user.password = hash_password(data.get("new_password"))
    session.commit()
    return jsonify({"message": "Password changed successfully!"}), 200
    

@app.route('/api/password_forget', methods=['post'])
def password_forget():
    email = request.json.get("email")
    user = session.query(User).filter_by(email=email.lower()).first()
    if user:
        safety_code = str(uuid.uuid4())
        redis_client.setex(f"safety_code:{email.lower()}", 300, safety_code)  # Expires in 5 minutes
        print(redis_client.get(f"safety_code:{email.lower()}"))
        send_email(email, safety_code)
        return jsonify({"message": "Password reset email sent!"}), 200
    return jsonify({"message": "User not found!"}), 404

@app.route('/api/check_safety_code', methods=['post'])
def check_safety_code():
    email = request.json.get("email")
    new_password = request.json.get("password")
    safety_code = request.json.get("safety_code")
    print(email, new_password, safety_code)
    user = session.query(User).filter_by(email=email.lower()).first()
    if user and safety_code:
        stored_code = redis_client.get(f"safety_code:{email.lower()}")
        if stored_code and stored_code.decode("utf-8") == safety_code:
            # Prüfe, ob das neue Passwort dem alten entspricht
            if argon2.verify(user.password, new_password):
                return jsonify({"message": "New password cannot be the same as the old password!"}), 400
            # Setze das neue Passwort
            user.password = hash_password(new_password)
            session.commit()
            return jsonify({"message": "Password reset successful!"}), 200
        return jsonify({"message": "Invalid safety code!"}, 400)
    return jsonify({"message": "Invalid safety code!"}, 400)

@app.route('/api/create_workout_plan', methods=['post'])
def create_workout_plan():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    data = request.json
    print(data)
    if data.get("name") in [plan.name for plan in session.query(WorkoutPlan).filter_by(user_id=user_id).all()]:
        return jsonify({"message": "Workout plan with this name already exists!"}), 400
    new_templates = []
    for elem in data.get("exercises", []):
        name = elem.get("name")
        sets = elem.get("sets")
        reps = elem.get("reps")
        weights = elem.get("weights")

        new_templates.append(PlanExerciseTemplate(
            name=name,
            sets=sets,
            reps_template=reps,
            weights_template=weights,
            date= datetime.now().date()
        ))

    workout_plan = WorkoutPlan(
        user_id=user_id,
        templates=new_templates,
        name=data.get("name")
    )
    session.add(workout_plan)
    session.commit()
    return jsonify({"message": "Workout plan created successfully!"}, 201)

@app.route('/api/delete_workout_plan', methods=['delete'])
def delete_workout_plan():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401   
    verification = verify_token(token)
    if verification.get("error"):   
        return jsonify({"message": verification["error"]}), 401
    data = request.json
    workout_plan_id = data.get("plan_id")
    if not workout_plan_id:
        return jsonify({"message": "Missing workout plan ID!"}), 400
    session.query(PlanExerciseTemplate).filter_by(workout_plan_id=workout_plan_id).delete(synchronize_session=False)
    session.query(Exercise).filter_by(workout_plan_id=workout_plan_id).delete(synchronize_session=False)
    session.query(WorkoutPlan).filter_by(id=workout_plan_id).delete(synchronize_session=False)
 
    session.commit()
    return jsonify({"message": "Workout plan deleted successfully!"}), 200

@app.route('/api/edit_workout_plan_name', methods=['put'])
def edit_workout_plan_name():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401
    data = request.json
    workout_plan_id = data.get("plan_id")
    new_name = data.get("new_name")
    
    workout_plan = session.query(WorkoutPlan).filter_by(id=workout_plan_id).first()
 
    if not workout_plan:
        return jsonify({"message": "Workout plan not found!"}), 404
    workout_plan.name = new_name
    session.commit()
    return jsonify({"message": "Workout plan name updated successfully!"}, 200)

@app.route('/api/edit_workout_plan', methods=['put'])
def edit_workout_plan():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    data = request.json
    print(data)
    workout_plan_id = data.get("plan_id")
    print("Workout Plan ID to edit:")
    print(workout_plan_id)
    user_id = verification.get("sub")
    print("User ID:", user_id)
    workout_plan = session.query(WorkoutPlan).filter_by(id=workout_plan_id).first()
    print("Editing workout plan:")
    print(workout_plan.__dict__)
    if not workout_plan:
        return jsonify({"message": "Workout plan not found!"}), 404
    workout_plan.name = data.get("name", workout_plan.name)
    session.query(PlanExerciseTemplate).filter_by(workout_plan_id=workout_plan.id).delete(synchronize_session=False)

    new_templates = []
    for elem in data.get("exercises", []):
        name = elem.get("name")
        sets = elem.get("sets")
        reps = elem.get("reps")
        weights = elem.get("weights")

        new_templates.append(PlanExerciseTemplate(
            workout_plan_id=workout_plan.id,
            name=name,
            sets=sets,
            reps_template=reps,
            weights_template=weights,
            date= datetime.now().date()
        ))

    session.add_all(new_templates)
    session.commit()
    return jsonify({"message": "Workout plan updated successfully!"}, 200)

@app.route('/api/get_workout_plans', methods=['get'])
def get_workout_plans():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")

    # Subquery für max_date pro Plan und Exercise Name
    subq = session.query(
        Exercise.workout_plan_id,
        Exercise.name,
        func.max(Exercise.date).label('max_date')
    ).group_by(Exercise.workout_plan_id, Exercise.name).subquery()

    # Lade Pläne mit Templates
    plans = session.query(WorkoutPlan).options(
        joinedload(WorkoutPlan.templates)
    ).filter_by(user_id=user_id).all()

    # Lade gefilterte Exercises separat
    exercises = session.query(Exercise).join(
        subq, (Exercise.workout_plan_id == subq.c.workout_plan_id) & (Exercise.name == subq.c.name) & (Exercise.date == subq.c.max_date)
    ).filter(Exercise.user_id == user_id).all()
    print("Exercises loaded for latest dates:")
    print([e.__dict__ for e in exercises])



    result = []
    for plan in plans:
        result.append({
            "id": plan.id,
            "name": plan.name,
            "templates": [
                {
                    "id": t.id,
                    "name": t.name,
                    "sets": t.sets,
                    "reps": t.reps_template,
                    "weights": t.weights_template
                } for t in plan.templates
            ],
            "exercises": [
                {
                    "id": e.id,
                    "name": e.name,
                    "sets": e.sets,
                    "reps": e.reps,
                    "weights": e.weights,
                    "date": e.date.isoformat()
                } for e in exercises if e.workout_plan_id == plan.id
            ]
        })
    print(result)
    return jsonify(result), 200

@app.route('/api/statistics', methods=['get'])
def get_statistics():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")

    # Lade alle Exercises für den User
    exercises = session.query(Exercise).filter(Exercise.user_id == user_id).all()

    # Gruppiere nach exercise_name und sammle max/min/entries
    exercise_dict = {}
    for ex in exercises:
        if ex.name not in exercise_dict:
            exercise_dict[ex.name] = {
                "exercise_name": ex.name,
                "max_weight": max(ex.weights) if ex.weights else 0,
                "min_weight": min(ex.weights) if ex.weights else 0,
                "entries": []
            }
        exercise_dict[ex.name]["entries"].append({
            "date": ex.date.isoformat(),
            "weights": ex.weights,
            "reps": ex.reps
        })
        # Update max/min basierend auf allen weights
        if ex.weights:
            exercise_dict[ex.name]["max_weight"] = max(exercise_dict[ex.name]["max_weight"], max(ex.weights))
            exercise_dict[ex.name]["min_weight"] = min(exercise_dict[ex.name]["min_weight"], min(ex.weights))

    # Sortiere entries nach Datum
    for ex in exercise_dict.values():
        ex["entries"].sort(key=lambda x: x["date"])

    result = list(exercise_dict.values())
    print(result)
    return jsonify(result), 200

@app.route('/api/create_exercise', methods=['post'])
def create_exercise():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    data = request.json
    print(data)
    find_exercise = session.query(Exercise).filter_by(
        user_id=user_id,
        workout_plan_id=data.get("workout_plan_id"),
        date=datetime.now().date(),
        name=data.get("name")
    ).first()

    if find_exercise:
        # Update das bestehende Exercise statt löschen
        find_exercise.sets = data.get("sets")
        find_exercise.reps = data.get("reps")
        find_exercise.weights = data.get("weights")
        session.commit()
        return jsonify({"message": "Exercise updated successfully!"}, 200)
    else:
        # Erstelle neues Exercise, falls nicht vorhanden
        new_exercise = Exercise(
            user_id=user_id,
            workout_plan_id=data.get("workout_plan_id"),
            date=datetime.now().date(),
            name=data.get("name"),
            sets=data.get("sets"),
            reps=data.get("reps"),
            weights=data.get("weights")
        )
        session.add(new_exercise)
        session.commit()
        return jsonify({"message": "Exercise logged successfully!"}, 201)
    
@app.route('/api/aicoach', methods=['post'])
def ai_coach():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401
    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401
    data = request.json
    
    history = data.get("history", [])
    messages = [
        {"role": "system", "content": "You are an AI Coach for Fitness and Sports. Answer only questions related to athletic topics like training, nutrition, motivation, and health. If the question is not athletic, politely respond that you only answer athletic questions. You can respond in English or German, but primarily in English. Answer concisely and informatively and shortly."}
    ]
    for item in history:
        role = "user" if item.get("isUser") else "assistant"
        messages.append({"role": role, "content": item.get("message")})
    messages.append({"role": "user", "content": data.get("question")})
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )
    answer = response.choices[0].message.content
    return jsonify({"answer": answer}), 200

@app.route('/api/calculate_meal', methods=['post'])
def calculate_meal():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401
    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401
    user_id = verification.get("sub")
    # Expecting multipart/form-data with an image file under 'image' and optional JSON fields
    if 'image' not in request.files:
        return jsonify({"message": "No image file provided!"}), 400
    image = request.files['image']
    # Optionally process other form fields: name, meal_type, etc.
    prompt = request.form.get('prompt')
    meal_type = request.form.get('meal_type')
    # Example: Save image to disk (or process as needed)
    if image.filename == '':
        return jsonify({"message": "No selected file!"}), 400
    
    image_bytes = image.read()
    image_base64 = base64.b64encode(image_bytes).decode('utf-8')
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": [
                {"type": "text", "text": (
                    "Analyze the food in the image and estimate its nutritional content. "
                    "Return the result as a compact JSON object with the following keys: "
                    "name (short meal name), calories (kcal), protein (g), carbs (g), fats (g). "
                    "Example: {\"name\": \"Chicken Salad\", \"calories\": 420, \"protein\": 32, \"carbs\": 18, \"fats\": 12}. "
                    "Do not add any explanation, only the JSON. "
                    + (prompt if prompt else "")
                )},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
            ]}
        ]
    )
    # Try to parse the model's response as JSON
    print("OpenAI response:", flush=True)
    content = response.choices[0].message.content
    print(content,flush=True)
    

     # Initialize result with None values
    result = {"name": None, "calories": None, "protein": None, "carbs": None, "fats": None}
    try:
        # The response might be in response.choices[0].message.content or similar, depending on OpenAI lib
        content = response.choices[0].message.content if hasattr(response.choices[0].message, 'content') else response.choices[0].text
        # Extrahiere reines JSON aus Markdown-Block
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
            content = match.group(0)
        parsed = json.loads(content)
        # Copy only expected keys, fallback to None if missing
        for key in result:
            if key in parsed:
                result[key] = parsed[key]
        print("Parsed meal data:", result, flush=True)  
    except Exception as e:
        print(f"Failed to parse OpenAI response: {e}")
        # Optionally, log the raw response for debugging
        print(f"Raw response: {response}")
        if hasattr(response, "choices") and response.choices and hasattr(response.choices[0], "message"):
            print("Content:", response.choices[0].message.content)
        else:
            print("No content in response!")
    return jsonify(result), 200

@app.route('/api/create_meal', methods=['post'])
def create_meal():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    data = request.json
    new_meal = Meal(
        user_id=user_id,
        name=data.get("name"),
        date=data.get("date"),
        calories=data.get("calories"),
        protein=data.get("protein"),
        carbs=data.get("carbs"),
        fats=data.get("fats"),
        mealtype=data.get("mealtype")
    )
    session.add(new_meal)
    session.commit()
    return jsonify({"message": "Meal logged successfully!"}), 201

@app.route('/api/edit_meal', methods=['put'])
def edit_meal():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    data = request.json
    meal_id = data.get("meal_id")
    meal = session.query(Meal).filter_by(id=meal_id, user_id=user_id).first()
    if not meal:
        return jsonify({"message": "Meal not found!"}), 404

    print("Editing meal:", data, flush=True)

    meal.name = data.get("name", meal.name)
    meal.date = data.get("date", meal.date)
    meal.calories = data.get("calories", meal.calories)
    meal.protein = data.get("protein", meal.protein)
    meal.carbs = data.get("carbs", meal.carbs)
    meal.fats = data.get("fats", meal.fats)
    meal.mealtype = data.get("mealtype", meal.mealtype)

    session.commit()
    return jsonify({"message": "Meal updated successfully!"}), 200


@app.route('/api/get_meal_breakfast', methods=['get'])
def get_meal_breakfast():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    date = request.args.get("date")
    meals = session.query(Meal).filter_by(user_id=user_id, date=date, mealtype="breakfast").all()
    result = []
    for meal in meals:
        result.append({
            "id": meal.id,
            "name": meal.name,
            "date": meal.date.isoformat(),
            "calories": meal.calories,
            "protein": meal.protein,
            "carbs": meal.carbs,
            "fats": meal.fats
        })
    return jsonify(result), 200

@app.route('/api/get_meal_launch', methods=['get'])
def get_meal_launch():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    date = request.args.get("date")
    print("Fetching launch meals for user:", user_id, "on date:", date, flush=True)
    meals = session.query(Meal).filter_by(user_id=user_id, date=date, mealtype="launch").all()
    result = []
    for meal in meals:
        result.append({
            "id": meal.id,
            "name": meal.name,
            "date": meal.date.isoformat(),
            "calories": meal.calories,
            "protein": meal.protein,
            "carbs": meal.carbs,
            "fats": meal.fats
        })
    return jsonify(result), 200

@app.route('/api/get_meal_dinner', methods=['get'])
def get_meal_dinner():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    date = request.args.get("date")
    meals = session.query(Meal).filter_by(user_id=user_id, date=date, mealtype="dinner").all()
    result = []
    for meal in meals:
        result.append({
            "id": meal.id,
            "name": meal.name,
            "date": meal.date.isoformat(),
            "calories": meal.calories,
            "protein": meal.protein,
            "carbs": meal.carbs,
            "fats": meal.fats
        })
    return jsonify(result), 200

@app.route('/api/get_meal_snack', methods=['get'])
def get_meal_snack():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    date = request.args.get("date")
    meals = session.query(Meal).filter_by(user_id=user_id, date=date, mealtype="snacks").all()
    result = []
    for meal in meals:
        result.append({
            "id": meal.id,
            "name": meal.name,
            "date": meal.date.isoformat(),
            "calories": meal.calories,
            "protein": meal.protein,
            "carbs": meal.carbs,
            "fats": meal.fats
        })
    return jsonify(result), 200

@app.route('/api/delete_meal', methods=['delete'])
def delete_meal():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    data = request.json
    meal_id = data.get("meal_id")
    meal = session.query(Meal).filter_by(id=meal_id, user_id=user_id).first()
    if not meal:
        return jsonify({"message": "Meal not found!"}), 404
    session.delete(meal)
    session.commit()
    return jsonify({"message": "Meal deleted successfully!"}), 200

@app.route('/api/check_auth', methods=['get'])
def check_auth():
    token = request.cookies.get("access_token")
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verify_token(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    return jsonify({"message": "Authenticated"}), 200

@app.route('/api/refresh_token', methods=['post'])
def refresh_token():
    print("Incoming request cookies:", request.cookies)   # <-- Debug: was wird gesendet?   
    token = request.cookies.get("access_token")
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401
    
    try:
        payload = jwt.decode(
                    token,
                    app.config['SECRET_KEY'],
                    algorithms=[app.config['JWT_ALGORITHM']],
                    audience=EXPECTED_AUDIENCE,
                    issuer=EXPECTED_ISSUER,
                    options={"verify_exp": False},
                )
    except Exception as e:
                print(e)
                return jsonify({"message": "Failed to decode token"}), 401
    if redis_client.get(payload['jti']):
        return jsonify({"message": "Token has been revoked"}), 401

    user_id = payload.get("sub")
    new_token = create_token(user_id, 120)
    resp = jsonify({"message": "Token refreshed"})
    resp.set_cookie(
        "access_token",
        new_token,
        httponly=True,
        secure=True,  
        samesite="None",
        max_age=60*60*4
    )
    return resp, 200

@app.teardown_appcontext
def remove_session(exception=None):
    # rollback if an exception occurred, and remove/close session
    try:
        if exception:
            session.rollback()
    finally:
        session.remove()

if __name__ == '__main__':
    app.run(host="0.0.0.0")
