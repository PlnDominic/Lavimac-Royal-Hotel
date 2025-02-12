from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Room(Base):
    __tablename__ = 'rooms'

    id = Column(Integer, primary_key=True)
    room_type = Column(String(50), nullable=False)
    room_number = Column(String(10), unique=True, nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String)
    image_url = Column(String)
    capacity_adults = Column(Integer, default=1)
    capacity_children = Column(Integer, default=0)
    status = Column(Enum('available', 'booked', 'maintenance', name='room_status'), default='available')

    bookings = relationship('Booking', back_populates='room')

    def to_dict(self):
        return {
            'id': self.id,
            'room_type': self.room_type,
            'room_number': self.room_number,
            'price': self.price,
            'description': self.description,
            'image_url': self.image_url,
            'capacity_adults': self.capacity_adults,
            'capacity_children': self.capacity_children,
            'status': self.status
        }

class Booking(Base):
    __tablename__ = 'bookings'

    id = Column(Integer, primary_key=True)
    room_id = Column(Integer, ForeignKey('rooms.id'), nullable=False)
    guest_name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20))
    check_in_date = Column(Date, nullable=False)
    check_out_date = Column(Date, nullable=False)
    adults = Column(Integer, default=1)
    children = Column(Integer, default=0)
    total_price = Column(Float, nullable=False)
    booking_status = Column(Enum('pending', 'confirmed', 'cancelled', name='booking_status'), default='pending')
    payment_status = Column(Enum('pending', 'paid', 'refunded', name='payment_status'), default='pending')
    created_at = Column(DateTime, default=datetime.utcnow)

    room = relationship('Room', back_populates='bookings')

    def to_dict(self):
        return {
            'id': self.id,
            'room_id': self.room_id,
            'guest_name': self.guest_name,
            'email': self.email,
            'phone': self.phone,
            'check_in_date': str(self.check_in_date),
            'check_out_date': str(self.check_out_date),
            'adults': self.adults,
            'children': self.children,
            'total_price': self.total_price,
            'booking_status': self.booking_status,
            'payment_status': self.payment_status,
            'created_at': str(self.created_at)
        }

class RoomAvailability(Base):
    __tablename__ = 'room_availability'

    id = Column(Integer, primary_key=True)
    room_id = Column(Integer, ForeignKey('rooms.id'), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(Enum('available', 'booked', 'blocked', name='availability_status'), default='available')
    price_override = Column(Float)

    def to_dict(self):
        return {
            'id': self.id,
            'room_id': self.room_id,
            'date': str(self.date),
            'status': self.status,
            'price_override': self.price_override
        }

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum('admin', 'staff', name='user_role'), default='staff')
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'created_at': str(self.created_at)
        }
