import React from 'react'
import Homeimage from '../../public/images/Home_image.png';
import image2 from '../../public/images/image2.png';
import { Link } from 'react-router-dom';
import { IoGameController } from "react-icons/io5";
import { FaSwimmingPool, FaWifi, FaUtensils, FaSpa, FaGlassMartiniAlt, FaCar, FaCoffee, FaDumbbell, FaSwimmer, FaParking } from 'react-icons/fa';
import { PiLightbulbFilamentFill } from 'react-icons/pi';
import { MdLocalLaundryService } from "react-icons/md";


function Home() {
    const Main = () => {
        return (
            <div className='flex flex-col lg:flex-row justify-between px-4 md:px-16 py-8 lg:py-16 items-center gap-8'>
                <div className='flex flex-col justify-start gap-4 text-center lg:text-left'>
                    <h1 className='font-[Dancing Script] text-4xl md:text-5xl lg:text-6xl text-[#7C6A46]'>TAGHAZOUT HUB</h1>
                    <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium'>Hotel for every moment rich in emotion</h2>
                    <p className='text-gray-600 max-w-md mx-auto lg:mx-0'>Every moment feels like the first time in paradise view. Experience luxury and comfort in the heart of Taghazout Bay.</p>
                    <div className='mt-4'>
                        <button className='bg-[#7C6A46] hover:bg-[#9F8A66] text-white px-6 py-3 rounded cursor-pointer transition duration-300 ease-in-out'>Book now</button>
                    </div>
                </div>
                <div className='w-full lg:w-auto'>
                    <img className='w-full max-w-xl rounded-lg shadow-xl mx-auto' src={Homeimage} alt="Taghazout Hub Hotel" />
                </div>
            </div>
        )
    }

    const Facilities = () => {
        const facilityItems = [
            { icon: <FaSwimmer  size={30} />, name: "Swimming Pool" },
            { icon: <FaWifi size={30} />, name: "Free Wi-Fi" },
            { icon: <FaUtensils size={30} />, name: "Breakfast" },
            { icon: <FaDumbbell size={30} />, name: "Gym" },
            { icon: <IoGameController size={30} />, name: "Game center" },
            { icon: <PiLightbulbFilamentFill size={30} />, name: "24/7 Light" },
            { icon: <MdLocalLaundryService size={30} />, name: "Laundry" },
            { icon: <FaParking size={30} />, name: "Parking space" }
        ];

        return (
            <div className='px-4 md:px-16 py-12 md:py-20 bg-gray-50'>
                <div className='flex flex-col justify-center items-center mb-12'>
                    <h3 className='text-3xl md:text-4xl lg:text-5xl font-medium mb-4 text-center'>Our Facilities</h3>
                    <p className='text-gray-600 max-w-lg text-center'>We offer modern 5-star hotel facilities for your comfort and enjoyment during your stay.</p>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {facilityItems.map((facility, index) => (
                        <div key={index} className='flex flex-col items-center justify-center p-5 py-10 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out'>
                            <div className='text-[#7C6A46] mb-3'>
                                {facility.icon}
                            </div>
                            <p className='font-medium'>{facility.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const Rooms = () => {
        return (
            <div className='relative w-full'>
                <div 
                    className='w-full py-24 md:py-36 bg-cover bg-center bg-no-repeat' 
                    style={{ backgroundImage: `url(${image2})` }}
                >
                    <div className='absolute inset-0 bg-[#7C6A46] opacity-70'></div>
                    <div className='relative z-10 container mx-auto px-4 md:px-16 text-center'>
                        <h2 className='text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6'>Luxurious Room Collection</h2>
                        <p className='text-white text-lg mb-8 max-w-2xl mx-auto'>
                            Experience comfort and luxury in our carefully designed rooms with stunning views of the ocean and mountains.
                        </p>
                        <Link to="/rooms" className='inline-block bg-white text-[#7C6A46] hover:bg-[#E5D3B3] px-6 py-3 rounded font-medium transition duration-300 ease-in-out'>
                            View Our Rooms
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const Testimonials = () => {
        return (
            <div className='px-4 md:px-16 py-12 md:py-20'>
                <div className='flex flex-col justify-center items-center mb-12'>
                    <h3 className='text-3xl md:text-4xl lg:text-5xl font-medium mb-4 text-center'>What Our Guests Say</h3>
                    <p className='text-gray-600 max-w-lg text-center'>Hear from our satisfied customers who have experienced the comfort and luxury of our hotel.</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {[1, 2, 3].map((item) => (
                        <div key={item} className='bg-white p-6 rounded-lg shadow-md'>
                            <div className='flex items-center mb-4'>
                                <div className='flex text-yellow-400'>
                                    {"★★★★★".split('').map((star, i) => (
                                        <span key={i}>{star}</span>
                                    ))}
                                </div>
                            </div>
                            <p className='text-gray-600 italic mb-4'>
                                "Kan wa7ed l'expérience incroyable f'hotel Taghazout Hob. Mli dakhala l'hotel, chft ch7al mn détail m3amr b'lhbb, w l'accueil kan 3la 7asab l'7ad. L'équipe dyal l'hôtel m3roofin b'l'professionalism w l'khidma mzyana. Aji, kat7ess b7al nta f'dar dyalk. L'9a3a kanat mzianin, w kaynin m3a wa7ed l'atmosphère relaxante li katkhlli l9alb yrtah. L'hotel kaymchi 3la tariqa mn modernité o f'l'9e3a katban 3la l'océan, chi7aja li katzid fi hotle m3a l'endroit. Khasni ngoul 3la l'7adika zwinin, kaynin mn t7t la piscine w hya makhfiya mzyan o riyadiya, m3a wa7ed l'air frais li kaydkhl l9alb dyalek f'li7b wa l'ra7a"
                            </p>
                            <div className='flex items-center'>
                                <img  className="w-12 h-12 rounded-full mr-2" src="https://yt3.googleusercontent.com/r6tDkGerE5jBOQSiigtPEEu0-clyD1VXWrlpE0QWKIc4hNdmRyxYAbNaggnYJI8tgMoACYoxwQ=s900-c-k-c0x00ffffff-no-rj" alt="" />
                                
                                <div>
                                    <p className='font-medium'>Ayoub</p>
                                    <p className='text-sm text-gray-500'>Nador Youocde</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>
            <Main />
            <Facilities />
            <Rooms />
            <Testimonials />
        </>
    )
}

export default Home;