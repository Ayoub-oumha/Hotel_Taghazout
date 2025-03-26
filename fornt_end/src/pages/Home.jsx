import React from 'react'
import Homeimage from '../../public/images/Home_image.png' ;
function Home() {
  return (
    <div className='flex justify-between'>
        <div>
            <h1>TAGHAZOUT HUB</h1>
            <h1>Hotel for every moment rich in emotion</h1>
            <p>Every moment feels like the first time in paradise view</p>
            <button>Book now</button>
        </div>
        <div>
            <img className='w-[600px]' src={Homeimage} alt="" />
        </div>
    </div>
  )
}

export default Home