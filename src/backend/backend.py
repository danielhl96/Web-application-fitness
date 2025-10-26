from datetime import datetime, timedelta, UTC
import smtplib
import sqlalchemy
import jwt
import uuid
import redis
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session, relationship
from flask import Flask, request, jsonify
from flask_cors import CORS
from email.message import EmailMessage
from argon2 import PasswordHasher
from sqlalchemy.orm import joinedload


app = Flask(__name__)
app.config['SECRET_KEY'] = 'yYv1Qc9V0ZJwkpM8e8X0SFDfV9NQWzgnTwIhNQkDfU4'
app.config['JWT_ALGORITHM'] = 'HS256'
# erlaubte Origins (nicht '*' wenn withCredentials genutzt wird)
ALLOWED_ORIGINS = ["http://localhost:5173"]

# initialisiere flask-cors für alle /api/* Routen
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}})

# stelle sicher, dass auch Fehler-Responses die richtigen CORS-Header erhalten
@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin and origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response

engine = create_engine('postgresql+psycopg2://postgres:1234@localhost:5432/postgres',echo=True)
Base = sqlalchemy.orm.declarative_base()
SessionFactory = sessionmaker(bind=engine)
# optional: scoped_session if you keep a module-global `session = SessionFactory()` pattern
session = scoped_session(SessionFactory)
redis_client = redis.Redis(host='localhost', port=6379, db=0)
EXPECTED_AUDIENCE = "user"
EXPECTED_ISSUER = "fitness_app"
argon2 = PasswordHasher(time_cost=3, memory_cost=256, parallelism=4, hash_len=32, salt_len=16)

def createToken(user_id):
    SECRET_KEY = app.config['SECRET_KEY']
    now = datetime.now(UTC)
    payload = {
        "sub": str(user_id),
        "iss": "fitness_app",
        "aud": "user",
        "exp": int((now + timedelta(minutes=15)).timestamp()),
        "iat": int(now.timestamp()),
        "nbf": int(now.timestamp()),
        "jti": str(uuid.uuid4())
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=app.config['JWT_ALGORITHM'])
    return token

def revokeToken(token):
    jti = token['jti']
    exp = token['exp']
    now = datetime.now(UTC)
    ttl = exp - int(now.timestamp())
    if ttl > 0:
        redis_client.setex(jti, ttl, '1')
    

def verifyToken(token):
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
    msg = EmailMessage()
    msg.set_content(f"Your password reset code is: {safety_code}")
    msg['Subject'] = 'Password Reset Code'  
    msg['From'] = "daniel.hennies@googlemail.com"
    msg['To'] = to_email

    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_user= 'daniel.hennies@googlemail.com'
    smtp_password= ''

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)

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


Base.metadata.create_all(engine)

def hash_password(password):
    return argon2.hash(password)

@app.route('/api/register', methods=['post'])
def register_user():
    data = request.json
    new_user = User(
        email=data.get("email"),
        password=hash_password(data.get("password")),
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
    user = session.query(User).filter_by(email=email).first()
    if user and argon2.verify(user.password, password):
        token = createToken(user.id)
        resp = jsonify({"message": "Login successful!"})
        resp.set_cookie(
            "access_token",
            token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=60*60*4  # 4 Stunden
        )
        return resp, 200
    else:
        return jsonify({"message": "Invalid email or password!"}), 401

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

    verification = verifyToken(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify({"message": "User not found!"}), 404

    data = request.get_json()
    user.height = data.get("height", user.height)
    user.weight = data.get("weight", user.weight)
    user.age = data.get("age", user.age)
    user.gender = data.get("gender", user.gender)
    user.waist = data.get("waist", user.waist)
    user.hip = data.get("hip", user.hip)
    user.bfp = data.get("bfp", user.bfp)
    user.activity_level = data.get("activity_level", user.activity_level)
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

    verification = verifyToken(token)
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

@app.route('/api/logout', methods=['post'])
def logout_user():
    token = get_token_from_cookie()
    if token:
        payload = verifyToken(token)
        if payload.get("error"):
            return jsonify({"message": payload["error"]}), 401
        revokeToken(payload)
        resp = jsonify({"message": "Logout successful!"})
        resp.set_cookie("access_token", "", expires=0)
        return resp, 200
    return jsonify({"message": "No token provided!"}), 400

@app.route('/api/password_forget', methods=['post'])
def password_forget():
    email = request.json.get("email")
    user = session.query(User).filter_by(email=email).first()
    if user:
        safety_code = str(uuid.uuid4())
        redis_client.setex(f"safety_code:{email}", 300, safety_code)  # Expires in 5 minutes
        print(redis_client.get(f"safety_code:{email}"))
        #send_email(email, safety_code)
        return jsonify({"message": "Password reset email sent!"}), 200
    return jsonify({"message": "User not found!"}), 404

@app.route('/api/check_safety_code', methods=['post'])
def check_safety_code():
    email = request.json.get("email")
    new_password = request.json.get("password")
    safety_code = request.json.get("safety_code")
    print(email, new_password, safety_code)
    user = session.query(User).filter_by(email=email).first()
    if user and safety_code:
        stored_code = redis_client.get(f"safety_code:{email}")
        if stored_code and stored_code.decode("utf-8") == safety_code:
            if user and new_password == user.password:
                return jsonify({"message": "New password cannot be the same as the old password!"}), 400
            if user:
                user.password = hash_password(new_password)
                session.commit()
                return jsonify({"message": "Password reset successful!"}), 200
            else: return jsonify({"message": "User not found or invalid password!"}), 404
    return jsonify({"message": "Invalid safety code!"}), 400

@app.route('/api/create_workout_plan', methods=['post'])
def create_workout_plan():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verifyToken(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    data = request.json
    print(data)

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
    return jsonify({"message": "Workout plan created successfully!"}), 201

@app.route('/api/edit_workout_plan', methods=['put'])
def edit_workout_plan():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verifyToken(token)
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
            date= datetime.now()
        ))

    session.add_all(new_templates)
    session.commit()
    return jsonify({"message": "Workout plan updated successfully!"}, 200)

@app.route('/api/get_workout_plans', methods=['get'])
def get_workout_plans():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verifyToken(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")

    plans = session.query(WorkoutPlan).options(
        joinedload(WorkoutPlan.templates),
        joinedload(WorkoutPlan.exercises)
    ).filter_by(user_id=user_id).all()

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
                } for e in plan.exercises
            ]
        })
    print(result)
    return jsonify(result), 200

@app.route('/api/create_exercise', methods=['post'])
def create_exercise():
    token = get_token_from_cookie()
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verifyToken(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    user_id = verification.get("sub")
    data = request.json

    new_exercise = Exercise(
        user_id=user_id,
        workout_plan_id=data.get("plan_id"),
        date=datetime.now(),
        name=data.get("name"),
        sets=data.get("sets"),
        reps=data.get("reps"),
        weights=data.get("weights")
    )
    session.add(new_exercise)
    session.commit()
    return jsonify({"message": "Exercise logged successfully!"}), 201

@app.route('/api/check_auth', methods=['get'])
def check_auth():
    token = request.cookies.get("access_token")
    if not token:
        return jsonify({"message": "Missing token cookie!"}), 401

    verification = verifyToken(token)
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
    new_token = createToken(user_id)
    resp = jsonify({"message": "Token refreshed"})
    resp.set_cookie(
        "access_token",
        new_token,
        httponly=True,
        secure=False,  # Setze auf True bei HTTPS!
        samesite="Lax",
        max_age=60*60*4  # 2 Minuten
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
    app.run(debug=True)