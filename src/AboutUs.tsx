import React from 'react';
import { Navbar } from './components/Navbar';

const AboutUs: React.FC = () => {
  return (
    <>
      <Navbar />
      <section className="w-full py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Side */}
            <div>
              <h1 className="text-4xl font-serif text-gray-900 mb-6 relative">
                About Lavimac Royal Hotel
                <span className="absolute -bottom-2 left-0 w-24 h-1 bg-yellow-400"></span>
              </h1>
              
              <div className="space-y-6 text-gray-600">
                <p className="leading-relaxed text-lg">
                  "Established in 2020, Lavimac Royal Hotel stands as a testament to luxury and comfort 
                  in the heart of Oduom Anwomaso. Our journey began with a vision to create not just a hotel, 
                  but a sanctuary where modern amenities meet traditional Ghanaian hospitality.
                </p>

                <p className="leading-relaxed text-lg">
                  The Lavimac Royal Hotel has superior room features designed for comfortable and relaxed living. 
                  Our strategic location allows guests to retreat and marvel at the out-of-town comfort while 
                  overlooking the splendid sights that the hospitable town of Oduom Anwomaso has to offer. 
                  Each room is thoughtfully designed with interiors that reflect the warmth of the Ghanaian people, 
                  promoting both healing and relaxation.
                </p>

                <p className="leading-relaxed text-lg">
                  Our culinary experience is a celebration of flavors, offering a variety of dishes inspired by 
                  both local and international cuisines. We pride ourselves on creating memorable experiences 
                  that go beyond mere accommodation."
                </p>
              </div>
            </div>

            {/* Video Side */}
            <div className="relative rounded-lg overflow-hidden shadow-xl h-[500px]">
              <video 
                className="w-full h-full object-cover"
                autoPlay 
                loop 
                muted 
                playsInline
              >
                <source src="/src/assets/IMG_2637.MP4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
