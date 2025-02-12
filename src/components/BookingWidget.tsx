import React, { useState } from "react";
import { Calendar, Users, Search } from "lucide-react";
import { Link } from "react-router-dom";

export function BookingWidget() {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState("2 Adults");

  const handleSearch = () => {
    // Construct the URL with query parameters
    const bookingUrl = `/booking?checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guests}`;
    return bookingUrl;
  };

  return (
    <div className="bg-white/30 backdrop-blur-sm rounded-lg shadow-xl p-6 max-w-4xl mx-auto -mt-16 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2">
          <Calendar className="text-[rgb(0,0,115)]" size={20} />
          <div>
            <label className="block text-sm text-gray-700">Check In</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-[rgb(0,0,115)] outline-none bg-transparent z-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="text-[rgb(0,0,115)]" size={20} />
          <div>
            <label className="block text-sm text-gray-700">Check Out</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-[rgb(0,0,115)] outline-none bg-transparent z-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="text-[rgb(0,0,115)]" size={20} />
          <div>
            <label className="block text-sm text-gray-700">Guests</label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full border-b border-gray-300 focus:border-[rgb(0,0,115)] outline-none bg-transparent z-10"
            >
              <option>1 Adult</option>
              <option>2 Adults</option>
              <option>3 Adults</option>
              <option>4 Adults</option>
            </select>
          </div>
        </div>
        <Link 
          to={handleSearch()} 
          className="bg-[rgb(0,0,115)] text-white rounded-lg px-6 py-3 flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <Search size={20} />
          <span>Search</span>
        </Link>
      </div>
    </div>
  );
}
