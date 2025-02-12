import React, { useState } from "react";
import { Menu, Phone, User, X } from "lucide-react";
import logoImage from "../assets/logo.jpg";
import { Link } from 'react-router-dom';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <img 
              src={logoImage} 
              alt="Lavimac Royal Hotel Logo" 
              className="h-12 w-12 mr-4 object-contain"
            />
            <h1 className="text-2xl font-serif" style={{ color: 'rgb(0, 0, 115)' }}>
              Lavimac Royal Hotel
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[rgb(0,0,115)]">Home</Link>
            <Link to="/rooms" className="text-gray-700 hover:text-[rgb(0,0,115)]">Rooms</Link>
            <Link to="/facilities" className="text-gray-700 hover:text-[rgb(0,0,115)]">Facilities</Link>
            <Link to="/contact" className="text-gray-700 hover:text-[rgb(0,0,115)]">Contact</Link>
            <Link to="/about" className="text-gray-700 hover:text-[rgb(0,0,115)]">About Us</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/booking" className="hidden md:flex items-center space-x-1" style={{ color: 'rgb(0, 0, 115)' }}>
              <Phone size={18} />
              <span>Book Now</span>
            </Link>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <User size={20} className="text-gray-600" />
            </button>
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={20} className="text-gray-600" /> : <Menu size={20} className="text-gray-600" />}
            </button>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="text-gray-700 hover:text-[rgb(0,0,115)] block px-3 py-2 rounded-md">Home</Link>
              <Link to="/rooms" className="text-gray-700 hover:text-[rgb(0,0,115)] block px-3 py-2 rounded-md">Rooms</Link>
              <Link to="/facilities" className="text-gray-700 hover:text-[rgb(0,0,115)] block px-3 py-2 rounded-md">Facilities</Link>
              <Link to="/contact" className="text-gray-700 hover:text-[rgb(0,0,115)] block px-3 py-2 rounded-md">Contact</Link>
              <Link to="/about" className="text-gray-700 hover:text-[rgb(0,0,115)] block px-3 py-2 rounded-md">About Us</Link>
              <Link 
                to="/booking" 
                className="w-full text-left text-gray-700 hover:text-[rgb(0,0,115)] block px-3 py-2 rounded-md flex items-center space-x-2"
                style={{ color: 'rgb(0, 0, 115)' }}
              >
                <Phone size={18} />
                <span>Book Now</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
