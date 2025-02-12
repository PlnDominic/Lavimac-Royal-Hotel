import React from 'react';
import { Navbar } from './components/Navbar';
import { Clock, Wifi, Music, Utensils, Users, Tv } from 'lucide-react';
import wifiImage from './assets/wifi.jpg';
import dstvImage from './assets/dstv.jpg';
import restaurantImage from './assets/restaurant.jpg';
import liveBandImage from './assets/live-band.jpg';
import conferenceImage from './assets/conference.jpg';

interface FacilityProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

const FacilityCard: React.FC<FacilityProps> = ({ title, description, icon, image }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="h-48 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="p-6">
      <div className="flex items-center mb-2">
        <div className="text-[rgb(0,0,115)] mr-2">
          {icon}
        </div>
        <h3 className="text-xl font-serif text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

const Facilities: React.FC = () => {
  const facilities = [
    {
      title: "Free Wi-Fi",
      description: "Stay connected with our high-speed internet access available throughout the hotel premises, perfect for both business and leisure travelers.",
      icon: <Wifi className="h-6 w-6" />,
      image: wifiImage
    },
    {
      title: "DSTV",
      description: "Enjoy premium entertainment with our DSTV service, featuring a wide range of international channels and programs in all our rooms.",
      icon: <Tv className="h-6 w-6" />,
      image: dstvImage
    },
    {
      title: "Bar & Restaurant",
      description: "Savor delicious local and international cuisine at our restaurant, complemented by a well-stocked bar offering fine wines and spirits.",
      icon: <Utensils className="h-6 w-6" />,
      image: restaurantImage
    },
    {
      title: "Live Band",
      description: "Experience vibrant entertainment with our live band performances, creating the perfect atmosphere for your evening enjoyment.",
      icon: <Music className="h-6 w-6" />,
      image: liveBandImage
    },
    {
      title: "Conference Room",
      description: "Host successful meetings and events in our well-equipped conference room, featuring modern amenities and professional services.",
      icon: <Users className="h-6 w-6" />,
      image: conferenceImage
    }
  ];

  return (
    <>
      <Navbar />
      <section className="w-full py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">World-Class Facilities</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our range of premium amenities designed to make your stay exceptional and memorable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <FacilityCard key={index} {...facility} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Facilities;
