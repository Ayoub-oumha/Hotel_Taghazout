import React, { useState, useEffect } from 'react'
import video1 from '../video/video1.mp4';
import { TfiAngleDoubleDown } from "react-icons/tfi";
import { FaWifi } from "react-icons/fa6";
import { PiShower } from "react-icons/pi";
import { BsTv } from "react-icons/bs";
import { FaSwimmingPool, FaParking, FaGlassMartiniAlt, FaMountain, FaSnowflake } from "react-icons/fa";
import api from '../api/api';

function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch rooms data from the API
        const fetchRooms = async () => {
            try {
                const response = await api.get('/rooms');
                console.log(response.data.rooms)
                setRooms(response.data.rooms);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching rooms:", err);
                setError("Impossible de charger les chambres. Veuillez réessayer plus tard.");
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const RoomsVideoSection = () => {
        return (
            <div className='relative'>
                <video autoPlay muted loop width="100%" height="900px">
                    <source src={video1} type="video/mp4" />
                </video>
                <div className='absolute top-0 w-full md:w-1/2 mx-auto left-0 right-0 text-center mt-32 text-white px-4'>
                    <h1 className='text-4xl md:text-6xl font-bold'>Rooms and Suites</h1>
                    <p className='text-xl mt-4'>Book your stay</p>
                    <p className='mt-4 max-w-2xl mx-auto'>
                        We invite you to explore our website, browse through our rooms, check out our services, and book your stay with us today. Let us help you create unforgettable memories at Taghazout Hub. Your adventure in Taghazout starts here!
                    </p>
                    <button className='mt-8 animate-bounce'><TfiAngleDoubleDown size={24} /></button>
                </div>
            </div>
        )
    }

    // Function to render amenity icons based on the amenities string
    const renderAmenities = (amenitiesString, hasWifi, hasTv) => {
        try {
            // Parse the JSON string
            let amenitiesArray = [];
            if (amenitiesString) {
                amenitiesArray = JSON.parse(amenitiesString);
            }
            
            return (
                <div className='flex gap-3 flex-wrap'>
                    {hasWifi && <FaWifi className="text-3xl bg-gray-200 p-1.5 rounded-full text-[#7C6A46]" title="WiFi" />}
                    {hasTv && <BsTv className="text-3xl bg-gray-200 p-1.5 rounded-full text-[#7C6A46]" title="TV" />}
                    
                    {amenitiesArray.includes("Pool") && 
                        <FaSwimmingPool className="text-3xl bg-gray-200 p-1.5 rounded-full text-[#7C6A46]" title="Swimming Pool" />}
                    
                    {amenitiesArray.includes("Parking") && 
                        <FaParking className="text-3xl bg-gray-200 p-1.5 rounded-full text-[#7C6A46]" title="Parking" />}
                    
                    {amenitiesArray.includes("Minibar") && 
                        <FaGlassMartiniAlt className="text-3xl bg-gray-200 p-1.5 rounded-full text-[#7C6A46]" title="Minibar" />}
                </div>
            );
        } catch (error) {
            console.error("Error parsing amenities:", error);
            return (
                <div className='flex gap-3'>
                    {hasWifi && <FaWifi className="text-3xl bg-gray-200 p-1.5 rounded-full text-[#7C6A46]" />}
                    {hasTv && <BsTv className="text-3xl bg-gray-200 p-1.5 rounded-full text-[#7C6A46]" />}
                </div>
            );
        }
    }

    const SectionRooms = ({ room }) => {
        
        const baseImageUrl = 'http://127.0.0.1:8000/storage/';
        
        return (
            <div className='w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
                <div className='w-full h-64 overflow-hidden'>
                    <img 
                        src={room.image ? `${baseImageUrl}${room.image}` : '/images/room.png'} 
                        className='w-full h-full object-cover transform hover:scale-105 transition-transform duration-300' 
                        alt={room.name}
                    />
                </div>
                <div className='px-4 py-4'>
                    <div className='flex justify-between items-center mb-2'>
                        <h3 className='text-xl font-semibold'>{room.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${room.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {room.is_available ? 'Available' : 'Booked'}
                        </span>
                    </div>
                    <div className='flex items-center gap-2 mb-2'>
                        <span className='text-gray-600 text-sm'>{room.type}</span>
                        <span>•</span>
                        <span className='text-gray-600 text-sm'>Capacity: {room.capacity} persons</span>
                    </div>
                    <p className='text-gray-500 text-sm mb-2 line-clamp-2'>{room.description}</p>
                    <div className='flex items-center mb-3'>
                        {room.has_sea_view && (
                            <span className='bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full mr-2 flex items-center'>
                                <FaMountain className="mr-1" /> Sea View
                            </span>
                        )}
                        {room.has_air_conditioning && (
                            <span className='bg-cyan-50 text-cyan-700 text-xs px-2 py-1 rounded-full mr-2 flex items-center'>
                                <FaSnowflake className="mr-1" /> AC
                            </span>
                        )}
                    </div>
                    <p className='text-2xl font-bold text-[#7C6A46] mb-4'>{room.price_per_night} <span className='text-sm font-normal text-gray-500'>MAD/night</span></p>
                </div>
                <div className='px-4 py-3 border-t border-gray-200 flex justify-between items-center bg-gray-50'>
                    {renderAmenities(room.amenities, room.has_wifi, room.has_tv)}
                    <div>
                        <button 
                            className={`${room.is_available ? 'bg-[#7C6A46] hover:bg-[#8d794f]' : 'bg-gray-400 cursor-not-allowed'} text-white px-4 py-2 rounded transition-colors`}
                            disabled={!room.is_available}
                        >
                            Book now
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#7C6A46]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="bg-red-50 p-6 rounded-lg shadow-md max-w-md text-center">
                    <h3 className="text-xl font-bold text-red-700 mb-2">Erreur</h3>
                    <p className="text-gray-700">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-[#7C6A46] text-white px-4 py-2 rounded hover:bg-[#8d794f]"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <RoomsVideoSection />
            
            <div className="py-10 px-6 bg-gray-50">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10">Découvrez nos hébergements</h2>
                    
                    {rooms.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Aucune chambre disponible actuellement.</p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {rooms.map(room => (
                                <SectionRooms key={room.id} room={room} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Rooms