import React from 'react';
import { Link } from 'react-router-dom';
import { FaMountain, FaWater, FaUmbrellaBeach, FaHiking, FaUtensils, FaStore, FaMosque, FaMapMarkedAlt } from 'react-icons/fa';

function Explore() {
    // Hero section with parallax effect
    const ExploreHero = () => {
        return (
            <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110" 
                    style={{ 
                        backgroundImage: `url('/images/design_explore.png')`,
                        transformOrigin: 'center bottom'
                    }}
                >
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-center font-[Dancing Script]">
                        Discover Taghazout
                    </h1>
                    <p className="text-xl md:text-2xl max-w-3xl text-center mb-8">
                        Immerse yourself in the beauty of Morocco's most enchanting coastal village
                    </p>
                    <Link to="/contact" className="bg-[#7C6A46] hover:bg-[#9F8A66] text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                        Plan Your Adventure
                    </Link>
                </div>
            </div>
        );
    };

    // Introduction section with image and text
    const Introduction = () => {
        return (
            <div className="py-16 px-4 md:px-16 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#7C6A46] font-[Dancing Script]">Welcome to Paradise</h2>
                        <div className="w-24 h-1 bg-[#7C6A46] mx-auto"></div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row gap-10 items-center">
                        <div className="w-full lg:w-1/2">
                            <img 
                                src="/images/design_explore.png" 
                                alt="Taghazout Bay" 
                                className="w-full h-auto rounded-lg shadow-xl object-cover"
                            />
                        </div>
                        <div className="w-full lg:w-1/2">
                            <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-[#7C6A46]">Taghazout - Morocco's Hidden Gem</h3>
                            <p className="text-gray-700 mb-4 text-lg">
                                Nestled between the Atlas Mountains and the Atlantic Ocean, Taghazout offers a perfect blend of natural beauty, adventure, and authentic Moroccan culture.
                            </p>
                            <p className="text-gray-700 mb-6 text-lg">
                                Once a humble fishing village, Taghazout has evolved into a world-renowned surf destination while preserving its local charm and laid-back atmosphere. Crystal clear waters, golden beaches, and year-round sunshine make it the ideal escape.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-[#7C6A46] font-bold text-xl">300+</p>
                                    <p className="text-gray-600">Days of Sunshine</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-[#7C6A46] font-bold text-xl">20 km</p>
                                    <p className="text-gray-600">From Agadir</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-[#7C6A46] font-bold text-xl">10+</p>
                                    <p className="text-gray-600">Surf Spots</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-[#7C6A46] font-bold text-xl">4 km</p>
                                    <p className="text-gray-600">Coastline</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Activities section with icon cards
    const Activities = () => {
        const activities = [
            {
                icon: <FaWater className="w-12 h-12" />,
                title: "World-Class Surfing",
                description: "Experience some of Morocco's best waves at famous spots like Anchor Point, Killer Point and Panoramas."
            },
            {
                icon: <FaHiking className="w-12 h-12" />,
                title: "Paradise Valley",
                description: "Hike through stunning gorges and swim in natural pools in the nearby Paradise Valley."
            },
            {
                icon: <FaMountain className="w-12 h-12" />,
                title: "Atlas Mountains",
                description: "Take a day trip to explore the majestic Atlas Mountains and authentic Berber villages."
            },
            {
                icon: <FaUmbrellaBeach className="w-12 h-12" />,
                title: "Beach Relaxation",
                description: "Unwind on the golden beaches with perfect views of the Atlantic Ocean."
            },
            {
                icon: <FaUtensils className="w-12 h-12" />,
                title: "Moroccan Cuisine",
                description: "Savor authentic tagines, fresh seafood, and traditional tea ceremonies."
            },
            {
                icon: <FaStore className="w-12 h-12" />,
                title: "Local Markets",
                description: "Browse colorful souks for handcrafted items, argan oil products, and unique souvenirs."
            },
            {
                icon: <FaMosque className="w-12 h-12" />,
                title: "Cultural Experiences",
                description: "Immerse yourself in rich Moroccan heritage, music, and traditional arts."
            },
            {
                icon: <FaMapMarkedAlt className="w-12 h-12" />,
                title: "Guided Excursions",
                description: "Join expert-led tours to discover hidden gems and experience authentic local life."
            }
        ];

        return (
            <div className="py-16 px-4 md:px-16 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#7C6A46] font-[Dancing Script]">Things to Do</h2>
                        <div className="w-24 h-1 bg-[#7C6A46] mx-auto mb-6"></div>
                        <p className="text-gray-700 max-w-3xl mx-auto text-lg">
                            From thrilling outdoor adventures to cultural experiences, Taghazout offers something for everyone
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {activities.map((activity, index) => (
                            <div 
                                key={index} 
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="text-[#7C6A46] mb-4 flex justify-center">
                                    {activity.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-center">{activity.title}</h3>
                                <p className="text-gray-600 text-center">{activity.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Featured locations section
    const FeaturedLocations = () => {
        const locations = [
            {
                name: "Anchor Point",
                image: "/images/design_explore.png",
                description: "Legendary right-hand point break that can produce epic, world-class waves.",
                distance: "5 min drive",
                tag: "Surfing"
            },
            {
                name: "Paradise Valley",
                image: "/images/design_explore.png",
                description: "Stunning natural pools and waterfalls nestled in the Atlas Mountains.",
                distance: "30 min drive",
                tag: "Nature"
            },
            {
                name: "Taghazout Village",
                image: "/images/design_explore.png",
                description: "Explore the charming streets and local life of this traditional fishing village.",
                distance: "Walking distance",
                tag: "Culture"
            }
        ];

        return (
            <div className="py-16 px-4 md:px-16 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#7C6A46] font-[Dancing Script]">Must-Visit Places</h2>
                        <div className="w-24 h-1 bg-[#7C6A46] mx-auto mb-6"></div>
                        <p className="text-gray-700 max-w-3xl mx-auto text-lg">
                            Discover these stunning locations just a short distance from Taghazout Hub
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {locations.map((location, index) => (
                            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                                <div className="relative">
                                    <img 
                                        src={location.image} 
                                        alt={location.name} 
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="absolute top-4 right-4 bg-[#7C6A46] text-white text-sm px-3 py-1 rounded-full">
                                        {location.tag}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-xl font-semibold">{location.name}</h3>
                                        <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                            {location.distance}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{location.description}</p>
                                    <button className="text-[#7C6A46] font-medium flex items-center hover:underline">
                                        Learn more 
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Map and directions section
    const MapSection = () => {
        return (
            <div className="py-16 px-4 md:px-16 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#7C6A46] font-[Dancing Script]">Getting Here</h2>
                        <div className="w-24 h-1 bg-[#7C6A46] mx-auto mb-6"></div>
                        <p className="text-gray-700 max-w-3xl mx-auto text-lg">
                            Find your way to Taghazout Hub and all the amazing attractions nearby
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
                            {/* This would be where you embed a Google Map */}
                            <div className="bg-gray-200 h-96 w-full rounded-lg flex items-center justify-center">
                                <p className="text-gray-600">Interactive Map Would Be Embedded Here</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h3 className="text-2xl font-semibold mb-6 text-[#7C6A46]">Travel Information</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-bold mb-2 flex items-center">
                                        <span className="w-8 h-8 bg-[#7C6A46] text-white rounded-full flex items-center justify-center mr-2">1</span>
                                        By Air
                                    </h4>
                                    <p className="text-gray-600 pl-10">
                                        Fly to Agadir Al Massira Airport (AGA), then take a 40-minute taxi or our hotel shuttle service.
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-bold mb-2 flex items-center">
                                        <span className="w-8 h-8 bg-[#7C6A46] text-white rounded-full flex items-center justify-center mr-2">2</span>
                                        By Car
                                    </h4>
                                    <p className="text-gray-600 pl-10">
                                        Follow the coastal highway N1 north from Agadir for approximately 20 km.
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-bold mb-2 flex items-center">
                                        <span className="w-8 h-8 bg-[#7C6A46] text-white rounded-full flex items-center justify-center mr-2">3</span>
                                        Shuttle Service
                                    </h4>
                                    <p className="text-gray-600 pl-10 mb-4">
                                        We offer direct transfers from Agadir Airport to Taghazout Hub.
                                    </p>
                                    <button className="ml-10 bg-[#7C6A46] hover:bg-[#9F8A66] text-white px-4 py-2 rounded transition-colors">
                                        Book Transfer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Call to action section
    const CallToAction = () => {
        return (
            <div className="relative py-24">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
                    style={{ backgroundImage: `url('/images/design_explore.png')` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7C6A46] to-transparent opacity-90"></div>
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto text-white px-4">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">Ready to Explore Taghazout?</h2>
                    <p className="text-xl mb-10 max-w-2xl mx-auto text-center">
                        Book your stay at Taghazout Hub and experience the beauty of Morocco's surf paradise firsthand.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link to="/rooms" className="bg-white text-[#7C6A46] hover:bg-[#E5D3B3] px-8 py-4 rounded-lg font-medium text-center transition-colors">
                            Book Your Stay
                        </Link>
                        <Link to="/contact" className="bg-transparent border-2 border-white hover:bg-white hover:text-[#7C6A46] text-white px-8 py-4 rounded-lg font-medium text-center transition-colors">
                            Plan Your Trip
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <ExploreHero />
            <Introduction />
            <Activities />
            <FeaturedLocations />
            <MapSection />
            <CallToAction />
        </div>
    );
}

export default Explore;