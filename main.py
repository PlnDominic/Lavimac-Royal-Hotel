from flask import Flask, render_template, jsonify, request, session
from routes.room_routes import room_routes
from database import engine, Base, User, get_db
import jwt
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__, 
    static_folder='frontend/static',
    template_folder='frontend/templates'
)

# Register blueprints
app.register_blueprint(room_routes)

# Create database tables
Base.metadata.create_all(bind=engine)

# Add these configurations
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this to a secure secret key
app.config['JWT_EXPIRATION_DELTA'] = timedelta(days=1)

# Authentication decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'No token provided'}), 401
        
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = get_db().query(User).filter_by(id=data['user_id']).first()
            
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
                
            return f(current_user, *args, **kwargs)
        except Exception as e:
            return jsonify({'message': 'Invalid token'}), 401
            
    return decorated_function

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/booking')
def booking():
    return render_template('booking.html')

@app.route('/account')
def account():
    return render_template('account.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/rooms')
def rooms():
    return render_template('rooms.html')

@app.route('/services')
def services():
    return render_template('services.html')

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    db = get_db()
    
    # Check if username or email already exists
    if db.query(User).filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
        
    if db.query(User).filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    # Create new user
    new_user = User(
        username=data['username'],
        email=data['email']
    )
    new_user.set_password(data['password'])
    
    try:
        db.add(new_user)
        db.commit()
        return jsonify({'message': 'Registration successful'}), 201
    except Exception as e:
        db.rollback()
        return jsonify({'message': 'Registration failed'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    db = get_db()
    
    # Find user by username or email
    user = db.query(User).filter(
        (User.username == data['username']) | (User.email == data['username'])
    ).first()
    
    if user and user.check_password(data['password']):
        # Update last login
        user.last_login = datetime.utcnow()
        db.commit()
        
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']
        }, app.config['SECRET_KEY'])
        
        return jsonify({
            'token': token,
            'user': user.to_dict()
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/auth/me')
@login_required
def get_current_user(current_user):
    return jsonify(current_user.to_dict())

if __name__ == '__main__':
    app.run(port=5001, debug=True)
