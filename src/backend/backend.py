from datetime import datetime, timedelta, UTC
import smtplib
import sqlalchemy
import jwt
import uuid
import redis
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, relationship
from flask import Flask, request, jsonify
from flask_cors import CORS 
from email.message import EmailMessage


app = Flask(__name__)
app.config['SECRET_KEY'] = 'yYv1Qc9V0ZJwkpM8e8X0SFDfV9NQWzgnTwIhNQkDfU4'
app.config['JWT_ALGORITHM'] = 'HS256'
CORS(app)
engine = create_engine('postgresql+psycopg2://postgres:1234@localhost:5432/postgres',echo=True)
Base = sqlalchemy.orm.declarative_base()
Session = sessionmaker(bind=engine)
session = Session()
redis_client = redis.Redis(host='localhost', port=6379, db=0)
EXPECTED_AUDIENCE = "user"
EXPECTED_ISSUER = "fitness_app"


def createToken(user_id):
    SECRET_KEY = app.config['SECRET_KEY']
    now = datetime.now(UTC)
    payload = {
        "sub": str(user_id),
        "iss": "fitness_app",
        "aud": "user",
        "exp": int((now + timedelta(minutes=20)).timestamp()),
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
    print(token)
    print(float(datetime.now(UTC).timestamp()))
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[app.config['JWT_ALGORITHM']], audience=EXPECTED_AUDIENCE, issuer=EXPECTED_ISSUER)
        if redis_client.get(payload['jti']):
            return {"error": "Token has been revoked"}  
        
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}
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
    msg['From'] = "mail_admin"
    msg['To'] = to_email

    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_user= ''
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

class Exercise(Base):
    __tablename__ = 'exercises'
    id = sqlalchemy.Column(sqlalchemy.Integer, autoincrement=True, primary_key=True)
    user_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), nullable=False)
    workout_plan_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('workout_plans.id'), nullable=True)
    user = relationship("User", backref="exercises")
    date = sqlalchemy.Column(sqlalchemy.Date, nullable=False)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    sets = sqlalchemy.Column(sqlalchemy.ARRAY(sqlalchemy.Integer), nullable=False)
    reps = sqlalchemy.Column(sqlalchemy.ARRAY(sqlalchemy.Integer), nullable=False)
    weights = sqlalchemy.Column(sqlalchemy.ARRAY(sqlalchemy.Float), nullable=True)

class WorkoutPlan(Base):
    __tablename__ = 'workout_plans'
    id = sqlalchemy.Column(sqlalchemy.Integer, autoincrement=True, primary_key=True)
    user_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), nullable=False)
    user = relationship("User", backref="workout_plans")
    name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    exercises = relationship("Exercise", backref="workout_plan", lazy=True)


Base.metadata.create_all(engine)

@app.route('/api/register', methods=['post'])
def register_user():
    data = request.json
    new_user = User(
        email=data.get("email"),
        password=data.get("password"),
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
    if(user):
        token = createToken(user.id)    
        print(token)
        return jsonify({"message": "Login successful!", "token": token}), 200
    else:
        return jsonify({"message": "Invalid email or password!"}), 401

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    # Token aus Header extrahieren
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return jsonify({"message": "Missing or invalid Authorization header"}), 401

    token = auth_header.replace("Bearer ", "")
    verification = verifyToken(token)
    if verification.get("error"):
        return jsonify({"message": verification["error"]}), 401

    # User aus Token-Sub holen
    user_id = verification.get("sub")
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify({"message": "User not found!"}), 404

    # Daten aus dem Request
    data = request.get_json()

    # Felder aktualisieren (nur wenn sie vorhanden sind)
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


@app.route('/api/logout', methods=['post'])
def logout_user():
    token = request.headers.get("Authorization")
    if token:
        revokeToken(token)
        return jsonify({"message": "Logout successful!"}), 200
    return jsonify({"message": "No token provided!"}), 400

@app.route('/api/password_forget', methods=['post'])
def password_forget():
    email = request.json.get("email")
    user = session.query(User).filter_by(email=email).first()
    if user:
        safety_code = str(uuid.uuid4())
        redis_client.setex(f"safety_code:{email}", 300, safety_code)  # Expires in 5 minutes
        send_email(email, safety_code)  # Placeholder function
        return jsonify({"message": "Password reset email sent!"}), 200
    return jsonify({"message": "User not found!"}), 404

@app.route('/api/check_safety_code', methods=['post'])
def check_safety_code():
    email = request.json.get("email")
    safety_code = request.json.get("safety_code")
    user = session.query(User).filter_by(email=email).first()
    if user and safety_code:
        stored_code = redis_client.get(f"safety_code:{email}")
        if stored_code and stored_code.decode("utf-8") == safety_code:
            return jsonify({"message": "Safety code is valid!"}), 200
    return jsonify({"message": "Invalid safety code!"}), 400

@app.route('/api/password_reset', methods=['post'])
def password_reset():
    email = request.json.get("email")
    new_password = request.json.get("new_password")
    user = session.query(User).filter_by(email=email).first()

    if user and new_password == user.password:
        return jsonify({"message": "New password cannot be the same as the old password!"}), 400
    
    if user:
        user.password = new_password
        session.commit()
        return jsonify({"message": "Password reset successful!"}), 200
    return jsonify({"message": "User not found or invalid password!"}), 404


@app.route('/api/create_workout_plan', methods=['post'])
def create_workout_plan():

    # Token aus Header extrahieren
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return jsonify({"message": "Missing or invalid Authorization header"}), 401

    token = auth_header.replace("Bearer ", "")

    if(verifyToken(token).get("error")):
        return jsonify({"message": "Invalid or expired token!"}), 401
    data = request.json
    user_id = data.get("user_id")
    exercises = [
        Exercise(**exercise) for exercise in data.get("exercises", [])
    ]
    workout_plan = WorkoutPlan(
        user_id=user_id,
        exercises=exercises,
        name=data.get("name")
    )
    session.add(workout_plan)
    session.commit()
    return jsonify({"message": "Workout plan created successfully!"}), 201

@app.route('/api/get_workout_plans', methods=['get'])
def get_workout_plans():

    # Token aus Header extrahieren
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return jsonify({"message": "Missing or invalid Authorization header"}), 401

    token = auth_header.replace("Bearer ", "")

    if(verifyToken(token).get("error")):
        return jsonify({"message": "Invalid or expired token!"}), 401
    user_id = request.args.get("user_id")
    workout_plans = session.query(WorkoutPlan).filter_by(user_id=user_id).all()
    result = []
    for plan in workout_plans:
        exercises = [{
            "id": ex.id,
            "name": ex.name,
            "sets": ex.sets,
            "reps": ex.reps,
            "weights": ex.weights,
            "date": ex.date.isoformat()
        } for ex in plan.exercises]
        result.append({
            "id": plan.id,
            "name": plan.name,
            "exercises": exercises
        })
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(debug=True)
