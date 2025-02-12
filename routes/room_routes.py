from flask import Blueprint, jsonify, request
from sqlalchemy import and_
from datetime import datetime
from models.room import Room, Booking
from database import get_db

room_routes = Blueprint('room_routes', __name__)

@room_routes.route('/api/rooms/available', methods=['GET'])
def get_available_rooms():
    try:
        # Get query parameters
        check_in = datetime.strptime(request.args.get('checkIn'), '%Y-%m-%d')
        check_out = datetime.strptime(request.args.get('checkOut'), '%Y-%m-%d')
        adults = int(request.args.get('adults', 1))
        children = int(request.args.get('children', 0))
        total_guests = adults + children

        db = next(get_db())
        
        # Query for rooms that:
        # 1. Have enough capacity for the guests
        # 2. Are not booked during the requested period
        available_rooms = db.query(Room).filter(
            Room.capacity >= total_guests,
            ~Room.bookings.any(
                and_(
                    Booking.check_out > check_in,
                    Booking.check_in < check_out
                )
            )
        ).all()

        # Format the response
        rooms_data = []
        for room in available_rooms:
            rooms_data.append({
                'id': room.id,
                'room_number': room.room_number,
                'room_type': room.room_type,
                'price': room.price,
                'capacity': room.capacity,
                'description': room.description,
                'image_url': room.image_url
            })

        return jsonify(rooms_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@room_routes.route('/api/rooms/book', methods=['POST'])
def book_room():
    try:
        data = request.json
        db = next(get_db())

        # Check if room is still available
        room = db.query(Room).filter_by(id=data['room_id']).first()
        if not room:
            return jsonify({'error': 'Room not found'}), 404

        # Check for conflicting bookings
        check_in = datetime.strptime(data['check_in'], '%Y-%m-%d')
        check_out = datetime.strptime(data['check_out'], '%Y-%m-%d')
        
        existing_booking = db.query(Booking).filter(
            Booking.room_id == room.id,
            Booking.check_out > check_in,
            Booking.check_in < check_out
        ).first()

        if existing_booking:
            return jsonify({'error': 'Room is no longer available for these dates'}), 400

        # Create new booking
        booking = Booking(
            room_id=room.id,
            check_in=check_in,
            check_out=check_out,
            guest_name=data['guest_name'],
            guest_email=data['guest_email'],
            number_of_guests=data['number_of_guests'],
            total_price=data['total_price']
        )

        db.add(booking)
        db.commit()

        return jsonify({
            'message': 'Booking successful',
            'booking_id': booking.id
        })

    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 400
