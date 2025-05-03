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
                   
                </div>
            </div>
        );
    }

function Info( {src , title , text}){
    return (<>
    <div class="flex justify-center items-center  bg-gray-100 p-4">
  <div class="max-w-5xl w-full bg-white rounded-3xl shadow-lg overflow-hidden">
    <div class="relative">
      
      <img src={src} alt="Gym" class="w-full h-auto object-cover" />
      
      
      <div class="absolute bottom-0 left-0 w-full px-6 pb-6">
        <div class="bg-white rounded-xl shadow-md p-6 mt-4">
          <h2 class="text-center text-xl font-semibold text-[#5f4d3d] mb-4">{title}</h2>
          <p class="text-sm text-gray-700 text-center">
            {text}
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

    </>)
}

    return (
        <div>
            <ExploreHero  />
            <div className=' text-center p-8 bg-slate-500'>
                <h1 className='text-5xl '>Take a tour</h1>
            </div>
            
            <Info src={"/images/ex1.png"} title={"Taghazout hub rooms"} text={"The taghazout hub bedrooms in this gallery showcase custom interior designs & decorating ideas. View pictures and find your perfect  bedroom design ,our  bedrooms that will make you never want to leave your room again. See more ideas about taghazout hub bedrooms, bedroom design"}/>
            <Info src={"/images/ex2.png"} title={"Gym center"} text={"The Taghazout Hub gym in this gallery features state-of-the-art fitness equipment and unique design ideas for a workout experience like no other. Browse through the images and find inspiration for your ideal workout space. Our gym facilities are designed to keep you motivated and make every workout enjoyable. Whether you're here for a casual session or a serious fitness routine, the Taghazout Hub gym is the perfect place to achieve your goals. Explore more ideas and get inspired by the fitness experience at Taghazout Hub!"}/>
            <Info src={"/images/ex3.png"} title={"Restaurant"} text={"The Taghazout Hub restaurant offers a unique dining experience with a blend of traditional flavors and modern culinary artistry. Explore the images of our beautifully designed restaurant, where every detail is crafted to create the perfect atmosphere for a memorable meal. From fresh, locally sourced ingredients to expertly prepared dishes, our restaurant promises an unforgettable gastronomic experience. Discover more about our menu, ambiance, and the exceptional service that makes dining at Taghazout Hub a truly special experience!"}/>
        </div>
    );
}

export default Explore;