import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#7C6A46] text-white">
            <div className="container mx-auto px-4 py-12">
                {/* Footer main content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About section */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold mb-4 border-b border-[#9F8A66] pb-2">TAGHAZOUT HUB</h3>
                        <p className="text-sm leading-relaxed mb-4">
                            The service at the Hotel TAGHAZOUT HUB was exceptional. There was absolutely no issue that was not addressed timely and with satisfactory results.
                        </p>
                        <div className="flex space-x-3 mt-4">
                            <a href="#" className="bg-[#9F8A66] p-2 rounded-full hover:bg-white hover:text-[#7C6A46] transition-colors">
                                <FaFacebookF />
                            </a>
                            <a href="#" className="bg-[#9F8A66] p-2 rounded-full hover:bg-white hover:text-[#7C6A46] transition-colors">
                                <FaTwitter />
                            </a>
                            <a href="#" className="bg-[#9F8A66] p-2 rounded-full hover:bg-white hover:text-[#7C6A46] transition-colors">
                                <FaInstagram />
                            </a>
                            <a href="#" className="bg-[#9F8A66] p-2 rounded-full hover:bg-white hover:text-[#7C6A46] transition-colors">
                                <FaLinkedinIn />
                            </a>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b border-[#9F8A66] pb-2">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/booking" className="hover:text-[#E5D3B3] transition-colors flex items-center">
                                <span className="mr-2">›</span>Room Booking
                            </Link></li>
                            <li><Link to="/rooms" className="hover:text-[#E5D3B3] transition-colors flex items-center">
                                <span className="mr-2">›</span>Rooms
                            </Link></li>
                            <li><Link to="/contact" className="hover:text-[#E5D3B3] transition-colors flex items-center">
                                <span className="mr-2">›</span>Contact
                            </Link></li>
                            <li><Link to="/explore" className="hover:text-[#E5D3B3] transition-colors flex items-center">
                                <span className="mr-2">›</span>Explore
                            </Link></li>
                        </ul>
                    </div>

                    {/* Company Info */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b border-[#9F8A66] pb-2">Company</h4>
                        <ul className="space-y-2">
                            <li><Link to="/privacy" className="hover:text-[#E5D3B3] transition-colors flex items-center">
                                <span className="mr-2">›</span>Privacy Policy
                            </Link></li>
                            <li><Link to="/refund" className="hover:text-[#E5D3B3] transition-colors flex items-center">
                                <span className="mr-2">›</span>Refund Policy
                            </Link></li>
                            <li><Link to="/faq" className="hover:text-[#E5D3B3] transition-colors flex items-center">
                                <span className="mr-2">›</span>F.A.Q
                            </Link></li>
                            <li><Link to="/about" className="hover:text-[#E5D3B3] transition-colors flex items-center">
                                <span className="mr-2">›</span>About Us
                            </Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-4 border-b border-[#9F8A66] pb-2">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="mr-3 mt-1 text-[#E5D3B3]" />
                                <span>123 Beach Road, Taghazout Bay, Agadir, Morocco</span>
                            </li>
                            <li className="flex items-center">
                                <FaPhoneAlt className="mr-3 text-[#E5D3B3]" />
                                <span>+212 528 123 456</span>
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="mr-3 text-[#E5D3B3]" />
                                <span>contact@taghazouthub.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter - optional */}
                <div className="border-t border-[#9F8A66] pt-8 mt-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h4 className="text-lg font-semibold mb-2">Subscribe to our Newsletter</h4>
                            <p className="text-sm">Stay updated with our latest offers and news</p>
                        </div>
                        <div className="flex w-full md:w-auto">
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className="px-4 py-2 w-full md:w-64 text-gray-800 rounded-l focus:outline-none"
                            />
                            <button className="bg-[#9F8A66] hover:bg-[#8A7450] px-4 py-2 rounded-r transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center border-t border-[#9F8A66] pt-6">
                    <p>&copy; {currentYear} Taghazout Hub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;