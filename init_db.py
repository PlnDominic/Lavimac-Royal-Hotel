from database import SessionLocal, engine, Base
from models.room import Room
import psycopg2

def init_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create a new session
    db = SessionLocal()
    
    try:
        # Check if we already have rooms
        existing_rooms = db.query(Room).first()
        if existing_rooms:
            print("Database already initialized")
            return

        # Create sample rooms
        rooms = [
            Room(
                room_number="01",
                room_type="Standard Single",
                price=220.00,
                capacity=2,
                description="Comfortable room for 1 Adult or 2 Adults.",
                image_url="/static/img/standard_single.jpg",
                is_available=True
            ),
            Room(
                room_number="02",
                room_type="Standard Single",
                price=220.00,
                capacity=2,
                description="Comfortable room for 1 Adult or 2 Adults.",
                image_url="/static/img/standard_single.jpg",
                is_available=True
            ),
            Room(
                room_number="03",
                room_type="Standard Single",
                price=220.00,
                capacity=2,
                description="Comfortable room for 1 Adult or 2 Adults.",
                image_url="/static/img/standard_single.jpg",
                is_available=True
            ),
            Room(
                room_number="04",
                room_type="Standard Single",
                price=220.00,
                capacity=2,
                description="Comfortable room for 1 Adult or 2 Adults.",
                image_url="/static/img/standard_single.jpg",
                is_available=True
            ),
            Room(
                room_number="05",
                room_type="Standard Deluxe",
                price=250.00,
                capacity=2,
                description="Luxurious room for 1 Adult or 2 Adults.",
                image_url="/static/img/standard_deluxe.jpg",
                is_available=True
            ),
            Room(
                room_number="06",
                room_type="Standard Deluxe",
                price=250.00,
                capacity=2,
                description="Luxurious room for 1 Adult or 2 Adults.",
                image_url="/static/img/standard_deluxe.jpg",
                is_available=True
            ),
            Room(
                room_number="07",
                room_type="Standard Deluxe",
                price=250.00,
                capacity=2,
                description="Luxurious room for 1 Adult or 2 Adults.",
                image_url="/static/img/standard_deluxe.jpg",
                is_available=True
            ),
            Room(
                room_number="08",
                room_type="Standard Deluxe",
                price=250.00,
                capacity=2,
                description="Luxurious room for 1 Adult or 2 Adults.",
                image_url="/static/img/standard_deluxe.jpg",
                is_available=True
            ),
            Room(
                room_number="09",
                room_type="Pent Room",
                price=250.00,
                capacity=2,
                description="Luxurious room for 1 Adult or 2 Adults.",
                image_url="/static/img/pent_room.jpg",
                is_available=True
            ),
            Room(
                room_number="10",
                room_type="Pent Room",
                price=250.00,
                capacity=2,
                description="Luxurious room for 1 Adult or 2 Adults.",
                image_url="/static/img/pent_room.jpg",
                is_available=True
            ),
            Room(
                room_number="11",
                room_type="Pent Room",
                price=250.00,
                capacity=2,
                description="Luxurious room for 1 Adult or 2 Adults.",
                image_url="/static/img/pent_room.jpg",
                is_available=True
            ),
            Room(
                room_number="12",
                room_type="Pent Room",
                price=250.00,
                capacity=2,
                description="Luxurious room for 1 Adult or 2 Adults.",
                image_url="/static/img/pent_room.jpg",
                is_available=True
            ),
            Room(
                room_number="13",
                room_type="Pent Room",
                price=250.00,
                capacity=2,
                description="Luxurious room for 1 Adult or 2 Adults.",
                image_url="/static/img/pent_room.jpg",
                is_available=True
            ),
            Room(
                room_number="14",
                room_type="Pent Room",
                price=250.00,
                capacity=2,
                description="Luxurious room for 1 Adult or 2 Adults.",
                image_url="/static/img/pent_room.jpg",
                is_available=True
            ),
            Room(
                room_number="15",
                room_type="Pent Room",
                price=250.00,
                capacity=2,
                description="Luxurious room for 1 Adult or 2 Adults.",
                image_url="/static/img/pent_room.jpg",
                is_available=True
            ),
            Room(
                room_number="16",
                room_type="Pent Room",
                price=250.00,
                capacity=2,
                description="Luxurious room for 1 Adult or 2 Adults.",
                image_url="/static/img/pent_room.jpg",
                is_available=True
            )
        ]
        
        # Add rooms to the session
        for room in rooms:
            db.add(room)
        
        # Commit the changes
        db.commit()
        print("Database initialized successfully")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

def create_and_insert_rooms():
    try:
        # Connect to your PostgreSQL database
        connection = psycopg2.connect(
            dbname='lavimac_hotel',
            user='postgres',
            password='1234',
            host='localhost'
        )
        cursor = connection.cursor()

        # Drop the existing rooms table if it exists
        cursor.execute("DROP TABLE IF EXISTS rooms;")

        # Create a new rooms table
        cursor.execute("""
        CREATE TABLE rooms (
            id SERIAL PRIMARY KEY,
            room_number INT NOT NULL,
            room_type VARCHAR(50) NOT NULL,
            amenities TEXT,
            price DECIMAL(10, 2) NOT NULL
        );
        """)

        # Insert room data
        cursor.execute("INSERT INTO rooms (room_number, room_type, amenities, price) VALUES (1, 'Standard Single', '1 Single Bed', 220.00);")
        cursor.execute("INSERT INTO rooms (room_number, room_type, amenities, price) VALUES (2, 'Standard Single', '1 Single Bed', 220.00);")
        cursor.execute("INSERT INTO rooms (room_number, room_type, amenities, price) VALUES (3, 'Standard Single', '1 Single Bed', 220.00);")
        cursor.execute("INSERT INTO rooms (room_number, room_type, amenities, price) VALUES (4, 'Standard Single', '1 Single Bed', 220.00);")

        for i in range(5, 13):  # Rooms 5 to 12 for Standard Deluxe
            cursor.execute(f"INSERT INTO rooms (room_number, room_type, amenities, price) VALUES ({i}, 'Standard Deluxe', '1 Queen Size Bed', 250.00);")

        for i in range(13, 17):  # Rooms 13 to 16 for Pent Rooms
            cursor.execute(f"INSERT INTO rooms (room_number, room_type, amenities, price) VALUES ({i}, 'Pent Room', '1 King Size Bed', 300.00);")

        # Commit the changes
        connection.commit()

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if connection:
            cursor.close()
            connection.close()

if __name__ == "__main__":
    create_and_insert_rooms()
