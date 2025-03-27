import React from 'react'
import video1 from '../video/video1.mp4' ;
import { TfiAngleDoubleDown } from "react-icons/tfi";
import { FaWifi } from "react-icons/fa6";
import imageRoom from '../../public/images/room.png'
import { PiShower } from "react-icons/pi";
import { BsTv } from "react-icons/bs";


function Rooms() {

    const RoomsVideoSection = ()=>{
        return(
        <div className='relative'>
            <video autoPlay muted loop width="100%" height="900px">
                <source src={video1} type="video/mp4" />
            </video>
            <div className=' absolute top-0 w-1/2 translate-[50%] text-center mt-32 text-white'>
                <h1 className='text-6xl'>Rooms and Suites </h1>
                <p>book your site </p>
                <p>Book Your Stay
                    We invite you to explore our website, browse through our rooms, check out our services, and book your sta
                    y with us today. Let us help you create unforgettable memories at Taghazout Hub. Your adventure in Taghazout starts here!</p>
                <button><TfiAngleDoubleDown /></button>
    
            </div>
        </div>
        )
    }
    const SectionRooms = ()=>{
        return(
            <div className='w-full'>
            <div className='w-full'><img src={imageRoom} className='w-[100%]' alt="imageroom" /></div>
            <div className='px-4 py-2'>
                <div className='flex justify-between'>
                <h3 className='text-xl'>Ocean View Suite</h3>
                <p className='text-xs'>Available: Yes</p>
                </div>
                <p>1,890 <span>MAD</span></p>
            </div>
            <div className='px-4 py-2  border-amber-950 border-t-2 flex justify-between items-center'>
                <div className='flex gap-3'>
                    <FaWifi className="text-4xl bg-gray-300 p-2 rounded-full" />
                    <PiShower className="text-4xl bg-gray-300 p-2 rounded-full" />
                    <BsTv className="text-4xl bg-gray-300 p-1.5 rounded-full" />
                </div>
                <div>
                    <button className='bg-[#7C6A46] text-white p-2'>Book now</button>
                </div>
               
            
            </div>
            </div>
        )
    }
  return (
    <div>
        <RoomsVideoSection/>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 space-y-5'>
            <SectionRooms/>
            <SectionRooms/>
            <SectionRooms/>
            <SectionRooms/>
            <SectionRooms/>
            <SectionRooms/>
        </div>
        
    </div>
  )
}

export default Rooms