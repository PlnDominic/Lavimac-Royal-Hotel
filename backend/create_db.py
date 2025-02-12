import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from flask import Flask, request, jsonify

app = Flask(__name__)

def create_database():
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            password='1234',
            host='localhost'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        
        # Create a cursor
        cur = conn.cursor()
        
        # Check if database exists
        cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'lavimac'")
        exists = cur.fetchone()
        
        if not exists:
            # Create the database
            cur.execute('CREATE DATABASE lavimac')
            print("Database 'Lavimac' created successfully!")
        else:
            print("Database 'Lavimac' already exists.")
            
        # Close cursor and connection
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"An error occurred: {e}")

def create_rooms_table():
    try:
        # Connect to your PostgreSQL database
        connection = psycopg2.connect(
            dbname='lavimac',
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

        # Commit the changes
        connection.commit()

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if connection:
            cursor.close()
            connection.close()

@app.route('/api/rooms/available', methods=['GET'])
def get_available_rooms():
    check_in = request.args.get('checkIn')
    check_out = request.args.get('checkOut')
    adults = request.args.get('adults')
    children = request.args.get('children')

    app.logger.info(f"Received request with checkIn: {check_in}, checkOut: {check_out}, adults: {adults}, children: {children}")

    # Your existing logic to check room availability

    return jsonify(available_rooms)  # Replace with your actual return statement

if __name__ == '__main__':
    create_database()
    create_rooms_table()
    app.run()
