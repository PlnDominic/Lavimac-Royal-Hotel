import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Navbar />
      <section className="w-full py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Phone Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-[rgb(0,0,115)]" />
              </div>
              <h3 className="text-xl font-serif mb-2">Phone</h3>
              <p className="text-gray-600 mb-2">Feel free to call us anytime for inquiries and bookings.</p>
              <div className="flex flex-col gap-2">
                <a href="tel:+233(0)248676262" className="text-[rgb(0,0,115)] hover:underline">+233(0)248676262</a>
                <a href="tel:+233(0)551390039" className="text-[rgb(0,0,115)] hover:underline">+233(0)551390039</a>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-[rgb(0,0,115)]" />
              </div>
              <h3 className="text-xl font-serif mb-2">Email</h3>
              <p className="text-gray-600 mb-2">Send us an email for any information about our services.</p>
              <a href="mailto:lavimacroyalhotel@gmail.com" className="text-[rgb(0,0,115)] hover:underline">lavimacroyalhotel@gmail.com</a>
            </div>

            {/* Location Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-[rgb(0,0,115)]" />
              </div>
              <h3 className="text-xl font-serif mb-2">Location</h3>
              <p className="text-gray-600 mb-2">Visit us at our convenient location near KNUST.</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-[rgb(0,0,115)] hover:underline">
                View On Google Map
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-serif text-center mb-2">Leave us your info</h2>
            <p className="text-gray-600 text-center mb-8">and we will get back to you</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name*"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(0,0,115)]"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Email*"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(0,0,115)]"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject*"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(0,0,115)]"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-6">
                <textarea
                  name="message"
                  placeholder="Message*"
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(0,0,115)]"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                SUBMIT NOW
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Google Maps Embed */}
      <div className="w-full h-[400px] mb-8">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.675277468731!2d-1.5766286847172613!3d6.674444395190161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDAnMjguMCJOIDHCsDM0JzI4LjAiVw!5e0!3m2!1sen!2sgh!4v1705590477065!5m2!1sen!2sgh"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </>
  );
};

export default Contact;
