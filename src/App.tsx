import React, { useRef, useEffect } from "react";
import './App.css';
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { BookingWidget } from "./components/BookingWidget";
import { Star, Wifi, Coffee, Utensils } from "lucide-react";
import heroImage from "./assets/hero.jpg";
import penthouse1 from "./assets/The_Penthouse_1.jpg";
import penthouse2 from "./assets/The_Penthouse_2.jpg";
import standardDeluxe1 from "./assets/standard deluxe 1.jpg";
import standardDeluxe2 from "./assets/standard deluxe 2.jpg";
import standardSingle1 from "./assets/standard single 1.jpg";
import standardSingle2 from "./assets/standard single 2.jpg";
import image2 from "./assets/2.jpg";
import imageBA from "./assets/ba.jpg";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaTripadvisor } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Rooms from './Rooms';
import Facilities from './Facilities';
import Contact from './Contact';
import AboutUs from './AboutUs';
import Booking from './Booking';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = true;
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.loop = true;
      
      console.log('Attempting to play video');
      videoElement.play().catch(error => {
        console.warn('Autoplay was prevented:', error);
      });
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/" element={
            <>
              <section className="relative h-[800px] w-full">
                <div className="absolute inset-0 bg-black/20 z-10"></div>
                <img
                  src={heroImage}
                  alt="Conference Room and Building Exterior"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
                  <h1 className="text-5xl md:text-6xl font-serif mb-4 text-center px-4">
                    Welcome to Lavimac Royal Hotel
                  </h1>
                  <p className="text-xl md:text-2xl">Experience Luxury & Comfort</p>
                  <Link to="/booking" className="mt-6 px-8 py-3 bg-black text-white font-bold rounded-lg shadow-lg hover:bg-gray-700 transition duration-300">
                    Book Now
                  </Link>
                </div>
              </section>
              <div className="px-4 sm:px-6 lg:px-8">
                <BookingWidget />
                
                <section className="max-w-7xl mx-auto py-16 grid md:grid-cols-2 gap-12 items-center">
                  <div className="pr-8">
                    <h2 className="text-4xl font-serif mb-6 text-[rgb(0,0,115)]">
                      Welcome to 
                      <br />
                      Luxury and Royalty
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-justify">
                      The Lavimac Royal Hotel has superior rooms features for comfortable and relaxed living. Retreat and marvel at the out of town comfort by overlooking the splendid sights that the hospitable town of Oduom Anwomaso has to offer. Our rooms are designed with interiors to reflect the warmth of the Ghanaian people and to promote healing and relaxation. We also provide variety of culinary offerings inspired by local and international flavours.
                    </p>
                  </div>
                  <div className="aspect-video">
                    <video 
                      ref={videoRef}
                      src="/src/assets/IMG_2637.mp4" 
                      className="w-full h-[600px] object-cover"
                    />
                  </div>
                </section>

                <section className="w-full py-0">
                  <div className="bg-white p-4 mx-auto w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Pent Room */}
                      <div className="relative group overflow-hidden bg-white p-4 shadow-xl border-8 border-white">
                        <img 
                          src={penthouse1} 
                          alt="Pent Room" 
                          className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-white text-2xl font-serif">Pent Rooms</h3>
                            <span className="bg-yellow-400 text-[rgb(0,0,115)] px-3 py-1 rounded font-bold">
                              From GH₵300.00
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Standard Deluxe Room */}
                      <div className="relative group overflow-hidden bg-white p-4 shadow-xl border-8 border-white">
                        <img 
                          src={standardDeluxe1} 
                          alt="Standard Deluxe Room" 
                          className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-white text-2xl font-serif">Standard Deluxe</h3>
                            <span className="bg-yellow-400 text-[rgb(0,0,115)] px-3 py-1 rounded font-bold">
                              From GH₵270.00
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Standard Single Room */}
                      <div className="relative group overflow-hidden bg-white p-4 shadow-xl border-8 border-white">
                        <img 
                          src={standardSingle1} 
                          alt="Standard Single Room" 
                          className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-white text-2xl font-serif">Standard Single</h3>
                            <span className="bg-yellow-400 text-[rgb(0,0,115)] px-3 py-1 rounded font-bold">
                              From GH₵250.00
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Room Images */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                      <div className="relative group overflow-hidden bg-white p-4 shadow-xl border-8 border-white">
                        <img src={penthouse2} alt="Pent Room View" className="w-full h-72 object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-white text-2xl font-serif">Pent Room</h3>
                            <span className="bg-yellow-400 text-[rgb(0,0,115)] px-3 py-1 rounded font-bold">
                              From GH₵300.00
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative group overflow-hidden bg-white p-4 shadow-xl border-8 border-white">
                        <img src={standardDeluxe2} alt="Standard Deluxe Interior" className="w-full h-72 object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-white text-2xl font-serif">Standard Deluxe</h3>
                            <span className="bg-yellow-400 text-[rgb(0,0,115)] px-3 py-1 rounded font-bold">
                              From GH₵270.00
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative group overflow-hidden bg-white p-4 shadow-xl border-8 border-white">
                        <img src={standardSingle2} alt="Standard Single Room" className="w-full h-72 object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-white text-2xl font-serif">Standard Single</h3>
                            <span className="bg-yellow-400 text-[rgb(0,0,115)] px-3 py-1 rounded font-bold">
                              From GH₵250.00
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="discover-section">
                  <div className="discover-content">
                    <div className="about-button">
                      <button>About Lavimac Royal Hotel</button>
                    </div>
                    
                    <h2 className="discover-title">
                      Discover a Tranquil Haven at <span style={{ color: '#0033cc' }}>Lavimac Royal Hotel</span> in Oduom Anwomaso.
                    </h2>
                    
                    <p className="discover-description">
                      Immerse yourself in a unique blend of contemporary comfort and rich local culture. 
                      Our elegant rooms, designed for relaxation and tranquility, await your experience.
                    </p>
                    
                    <button className="start-journey-btn">
                      Start Your Journey <span className="arrow">→</span>
                    </button>
                  </div>

                  <div className="features-slider">
                    <div className="feature-card">
                      <div className="feature-tag">Elegant Rooms</div>
                      <div className="feature-image">
                        <img src={image2} alt="Elegant Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div className="feature-content">
                        <h3>Designed for Comfort</h3>
                        <p>Experience relaxation with upscale furnishings and stunning views.</p>
                      </div>
                    </div>

                    <div className="feature-card">
                      <div className="feature-tag">Gourmet Bar</div>
                      <div className="feature-image">
                        <img src={imageBA} alt="Gourmet Bar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div className="feature-content">
                        <h3>Exquisite Bar Experience</h3>
                        <p>Savor our selection of fine drinks and cocktails in an elegant atmosphere.</p>
                      </div>
                    </div>

                    <div className="navigation-buttons">
                      <button className="nav-btn prev">←</button>
                      <button className="nav-btn next">→</button>
                    </div>
                  </div>
                </section>

                {/* Location Section */}
                <section className="py-0 mb-8">
                  <div className="w-full px-0">
                    <div className="w-full h-[450px]">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.0985714793837!2d-1.5233439584177288!3d6.686785320813124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDEnMTIuNCJOIDHCsDMxJzI0LjAiVw!5e1!3m2!1sen!2sgh!4v1625136425185!5m2!1sen!2sgh"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                </section>
              </div>
            </>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
