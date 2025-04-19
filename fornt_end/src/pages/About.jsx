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
          style={{ backgroundImage: `url('/images/about_banner.jpg')` }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center font-[Dancing Script]">
            Our Story
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-center">
            Discover the passion and vision behind Taghazout Hub
          </p>
        </div>
      </div>
    );
  };

  // Introduction section with welcome message
  const Introduction = () => {
    return (
      <div className="py-16 px-4 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#7C6A46] font-[Dancing Script] text-center">
              Welcome to Taghazout Hub
            </h2>
            <div className="w-24 h-1 bg-[#7C6A46] mb-8"></div>
            <p className="text-xl text-gray-700 max-w-3xl text-center">
              A luxury beachfront retreat where Moroccan hospitality meets modern comfort
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <img 
                src="/images/about_hotel.jpg" 
                alt="Taghazout Hub Hotel" 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
            <div>
              <p className="text-gray-700 mb-6 text-lg">
                Founded in 2018, Taghazout Hub has quickly become one of Morocco's premier beach destinations, combining traditional Moroccan design with contemporary luxury and comfort.
              </p>
              <p className="text-gray-700 mb-6 text-lg">
                Our hotel sits on the golden shores of Taghazout Bay, offering panoramic views of the Atlantic Ocean and easy access to Morocco's most renowned surfing spots. We are committed to providing an authentic experience that connects our guests with the rich culture and natural beauty of this stunning coastal region.
              </p>
              <p className="text-gray-700 mb-6 text-lg">
                Whether you're seeking adventure on the waves, relaxation on the beach, or a cultural experience in the nearby villages, Taghazout Hub offers the perfect base for your Moroccan journey.
              </p>
              <div className="flex gap-4">
                <Link to="/rooms" className="bg-[#7C6A46] hover:bg-[#9F8A66] text-white px-6 py-3 rounded transition-colors font-medium inline-block">
                  Explore Our Rooms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Core values section
  const CoreValues = () => {
    const values = [
      {
        icon: <FaMedal size={40} />,
        title: "Excellence",
        description: "We strive to exceed expectations in every aspect of our service, from the comfort of our rooms to the quality of our dining experiences."
      },
      {
        icon: <FaHeart size={40} />,
        title: "Authenticity",
        description: "We embrace and celebrate Moroccan culture, integrating local traditions, cuisine, and craftsmanship throughout our hotel experience."
      },
      {
        icon: <FaUsers size={40} />,
        title: "Community",
        description: "We're proud to be part of the Taghazout community, supporting local businesses and contributing to sustainable tourism development."
      },
      {
        icon: <FaHandshake size={40} />,
        title: "Hospitality",
        description: "We believe in creating a warm, welcoming environment where every guest feels like part of our extended family."
      }
    ];

    return (
      <div className="py-16 px-4 md:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#7C6A46] font-[Dancing Script] text-center">
              Our Values
            </h2>
            <div className="w-24 h-1 bg-[#7C6A46] mb-8"></div>
            <p className="text-xl text-gray-700 max-w-3xl text-center">
              The principles that guide our service and shape your experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-[#7C6A46] mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-center">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Team section
  const OurTeam = () => {
    const team = [
      {
        name: "Mohammed Alaoui",
        position: "Founder & CEO",
        image: "/images/team_1.jpg",
        bio: "With over 20 years in hospitality, Mohammed brings his passion for Moroccan culture and commitment to excellence to every aspect of Taghazout Hub."
      },
      {
        name: "Sofia Benali",
        position: "Hotel Manager",
        image: "/images/team_2.jpg",
        bio: "Sofia ensures that every guest receives personalized service and has an unforgettable stay at our resort."
      },
      {
        name: "Omar Kabbaj",
        position: "Executive Chef",
        image: "/images/team_3.jpg",
        bio: "Omar combines traditional Moroccan flavors with modern cuisine to create unique dining experiences for our guests."
      }
    ];

    return (
      <div className="py-16 px-4 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#7C6A46] font-[Dancing Script] text-center">
              Meet Our Team
            </h2>
            <div className="w-24 h-1 bg-[#7C6A46] mb-8"></div>
            <p className="text-xl text-gray-700 max-w-3xl text-center">
              The dedicated professionals who make your stay extraordinary
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-64 bg-gray-200">
                  {/* You would replace this with actual images */}
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Team Member Photo
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-[#7C6A46] mb-4">{member.position}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Milestones section with timeline
  const Milestones = () => {
    const milestones = [
      {
        year: 2018,
        title: "Breaking Ground",
        description: "Construction begins on Taghazout Hub with a vision to create Morocco's premier beach resort."
      },
      {
        year: 2019,
        title: "Grand Opening",
        description: "Taghazout Hub officially opens its doors, welcoming guests from around the world."
      },
      {
        year: 2020,
        title: "Sustainability Initiative",
        description: "Launch of our comprehensive sustainability program to minimize environmental impact."
      },
      {
        year: 2021,
        title: "Expansion",
        description: "Addition of our luxury spa facilities and expanded restaurant offerings."
      },
      {
        year: 2022,
        title: "Excellence Award",
        description: "Recognized as Morocco's Leading Beach Resort at the World Travel Awards."
      }
    ];

    return (
      <div className="py-16 px-4 md:px-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#7C6A46] font-[Dancing Script] text-center">
              Our Journey
            </h2>
            <div className="w-24 h-1 bg-[#7C6A46] mb-8"></div>
            <p className="text-xl text-gray-700 max-w-3xl text-center">
              Key moments in the evolution of Taghazout Hub
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-[#7C6A46] hidden md:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 rounded-full bg-[#7C6A46] border-4 border-white hidden md:block"></div>
                  
                  {/* Content */}
                  <div className="md:w-1/2"></div>
                  <div className="bg-white p-6 rounded-lg shadow-md md:w-1/2">
                    <div className="text-2xl font-bold text-[#7C6A46] mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-semibold mb-3">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Testimonials section
  const Testimonials = () => {
    const testimonials = [
      {
        text: "An absolutely stunning hotel with incredible service. The staff went above and beyond to make our stay memorable.",
        author: "Sarah T.",
        location: "United Kingdom"
      },
      {
        text: "The perfect blend of luxury and authentic Moroccan hospitality. We'll definitely be returning to Taghazout Hub!",
        author: "Jean-Pierre M.",
        location: "France"
      },
      {
        text: "From the spectacular ocean views to the delicious cuisine, everything about our stay was exceptional.",
        author: "Michael K.",
        location: "United States"
      }
    ];

    return (
      <div className="py-16 px-4 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#7C6A46] font-[Dancing Script] text-center">
              Guest Experiences
            </h2>
            <div className="w-24 h-1 bg-[#7C6A46] mb-8"></div>
            <p className="text-xl text-gray-700 max-w-3xl text-center">
              What our guests say about their stay at Taghazout Hub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-md">
                <div className="flex mb-4 text-yellow-400">
                  {"★★★★★".split('').map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.text}"</p>
                <div className="mt-4">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Call to action section
  const CallToAction = () => {
    return (
      <div className="relative py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed" 
          style={{ backgroundImage: `url('/images/cta_background.jpg')` }}
        >
          <div className="absolute inset-0 bg-[#7C6A46] opacity-80"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-white px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Experience Taghazout Hub</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Begin your Moroccan adventure in luxury and comfort. Book your stay with us today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/rooms" className="bg-white text-[#7C6A46] hover:bg-[#E5D3B3] px-8 py-4 rounded-lg font-medium text-center transition-colors">
              View Our Rooms
            </Link>
            <Link to="/contact" className="bg-transparent border-2 border-white hover:bg-white hover:text-[#7C6A46] text-white px-8 py-4 rounded-lg font-medium text-center transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <AboutHero />
      <Introduction />
      <CoreValues />
      <OurTeam />
      <Milestones />
      <Testimonials />
      <CallToAction />
    </div>
  );
}

export default About;