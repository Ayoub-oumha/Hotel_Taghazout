import React from 'react';
import { Link } from 'react-router-dom';
import { FaMedal, FaHeart, FaUsers, FaHandshake } from 'react-icons/fa';

function About() {
  // Hero section component
  const AboutHero = () => {
    return (
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url('/images/about_banner.png')` }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center font-[Dancing Script]">
          About us
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-center">
          Welcome to Taghazout Hub, a place where adventure meets relaxation. Nestled in the heart of Taghazout, one of Morocco's most vibrant and beautiful coastal towns, Taghazout Hub offers a one-of-a-kind experience for travelers, surfers, and anyone seeking a peaceful retreat with a touch of modern luxury. Whether you’re here to catch the perfect wave, indulge in the local culture, or simply unwind by the ocean, our hotel is designed to make every moment special.
          </p>
        </div>
      </div>
    );
  };

  const DestinationSection = () => {
    return (
      <div className="px-6 py-12 text-center max-w-4xl mx-auto">
        <h2 className="text-xl font-medium mb-4">A Destination Like No Other</h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Taghazout is known for its laid-back vibe and world-class surf spots, and Taghazout Hub captures
          the essence of this coastal paradise. Whether you are an experienced surfer or a first-timer, our
          location is ideal. With direct access to the beach, you can enjoy the surf at your leisure or relax
          by the shore with panoramic views of the Atlantic Ocean. For those looking to experience the culture
          of Taghazout, we offer curated experiences, from local excursions to cultural tours that will immerse
          you in the authentic Moroccan way of life.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Our hotel offers a variety of room types to cater to different needs, whether you're traveling solo,
          with a partner, or with your family. Each room is thoughtfully designed, with a modern, minimalist
          aesthetic that embraces the natural beauty of the area. Rooms feature comfortable bedding,
          private balconies with ocean or garden views, and all the amenities you need to make your stay
          both enjoyable and convenient.
        </p>
  
        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-6">Clients</h3>
          <div className="flex justify-center gap-10 items-center">
            <img src="/images/youcode-logo.jpg" alt="YouCode" className="h-16" />
            <img src="/images/13logo.png" alt="1337" className="h-12" />
            <img src="/images/simplone.png" alt="Other Client" className="h-12" />
          </div>
        </div>
      </div>
    );
  };
  

  return (
    <div>
      <AboutHero />
      <DestinationSection />
      
    </div>
  );
}

export default About;