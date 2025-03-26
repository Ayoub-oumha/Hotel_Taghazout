import React from 'react'

function Footer() {
    
    let Time = ()=>{
        let time = new Date ;
        return time.getFullYear() ;
    }
  return (
    <footer className=' bg-[#7C6A46] p-12 text-white'>
        <div className='flex gap-x-5'>
            <div className='w-1/5'>
                <h3>TAGHAZOUT HUB</h3>
                <p>The service at the Hotel TGHAZOUT HUB was exceptional. There was absolutely no issue that was not addressed timely and with satisfactory results. We were particulary impressed with how the hotel staff anticipated our needs (periodically coming by the Board Room to check with us)</p>
            </div>
            <div className='w-1/5'>
                <h4>Quick links</h4>
                <ul>
                    <li>Room booking</li>
                    <li>Rooms</li>
                    <li>Contact</li>
                    <li>Explore</li>
                </ul>
            </div>
            <div className='w-1/5'>
                <h4>Company</h4>
                <ul>
                    <li>Privacy policy</li>
                    <li>Refund policy</li>
                    <li>F.A.Q</li>
                    <li>About</li>
                </ul>
            </div>
            <div className='w-1/5'>
                <h4>Company</h4>
                <ul>
                    <li>Privacy policy</li>
                    <li>Refund policy</li>
                    <li>F.A.Q</li>
                    <li>About</li>
                </ul>
            </div>
            <div className='w-1/5'>
                <h4>Company</h4>
                <ul>
                    <li>Privacy policy</li>
                    <li>Refund policy</li>
                    <li>F.A.Q</li>
                    <li>About</li>
                </ul>
            </div>
        </div>
        <div className='flex justify-center items-center'><span>Taghazout hub <Time/>   ©</span></div>
        
    </footer>
  )
}

export default Footer