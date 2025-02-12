from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Room(Base):
    __tablename__ = 'rooms'

    id = Column(Integer, primary_key=True)
    room_number = Column(String(10), unique=True, nullable=False)
    room_type = Column(String(50), nullable=False)  # standard, executive, superior
    price = Column(Float, nullable=False)
    capacity = Column(Integer, nullable=False)  # Maximum number of guests
    description = Column(String(500))
    image_url = Column(String(200))
    is_available = Column(Boolean, default=True)
    
    # Relationships
    bookings = relationship("Booking", back_populates="room")

class Booking(Base):
    __tablename__ = 'bookings'

    id = Column(Integer, primary_key=True)
    room_id = Column(Integer, ForeignKey('rooms.id'))
    check_in = Column(DateTime, nullable=False)
    check_out = Column(DateTime, nullable=False)
    guest_name = Column(String(100))
    guest_email = Column(String(100))
    number_of_guests = Column(Integer)
    total_price = Column(Float)
    
    # Relationships
    room = relationship("Room", back_populates="bookings")
