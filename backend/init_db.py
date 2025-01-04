from app import create_app, db
from app.main import Room, User
from werkzeug.security import generate_password_hash
import sqlalchemy
import os

def init_db():
    # Create the app context
    app = create_app()
    
    with app.app_context():
        # Get the database URL
        DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:1234@localhost/Lavimac')
        
        # Create engine directly
        engine = sqlalchemy.create_engine(DATABASE_URL)

        # Drop dependent tables first
        with engine.connect() as connection:
            connection.execute(sqlalchemy.text("""
                DROP TABLE IF EXISTS bookings CASCADE;
                DROP TABLE IF EXISTS room_availability CASCADE;
                DROP TABLE IF EXISTS rooms CASCADE;
                DROP TABLE IF EXISTS users CASCADE;

                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(120) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    role VARCHAR(20) DEFAULT 'user'
                );

                CREATE TABLE rooms (
                    id SERIAL PRIMARY KEY,
                    room_type VARCHAR(50) NOT NULL,
                    room_number VARCHAR(20) UNIQUE NOT NULL,
                    price DECIMAL(10, 2) NOT NULL,
                    description TEXT,
                    image_url VARCHAR(255),
                    capacity_adults INTEGER DEFAULT 2,
                    capacity_children INTEGER DEFAULT 1,
                    availability_status BOOLEAN DEFAULT TRUE
                );
            """))

            # Add sample rooms
            connection.execute(sqlalchemy.text("""
                INSERT INTO rooms (
                    room_type, room_number, price, description, 
                    image_url, capacity_adults, capacity_children, availability_status
                ) VALUES 
                ('Standard Rooms', 'STD-101', 3000.00, 
                 'Comfortable room with modern amenities', 
                 'standard-room.jpg', 2, 1, TRUE),
                ('Deluxe Rooms', 'DLX-201', 5000.00, 
                 'Spacious room with premium features', 
                 'deluxe-room.jpg', 3, 2, TRUE)
            """))

            # Create admin user
            connection.execute(sqlalchemy.text("""
                INSERT INTO users (
                    username, email, password_hash, role
                ) VALUES (
                    'admin', 
                    'admin@lavimachotel.com', 
                    :password_hash, 
                    'admin'
                )
            """), {
                'password_hash': generate_password_hash('admin_password')
            })

            connection.commit()

        print("Database initialized successfully!")

if __name__ == '__main__':
    init_db()
