import { Camera, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-dark-paper pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 min-w-0">
              <Camera className="h-8 w-8 text-primary shrink-0" />
              <span className="font-serif text-sm sm:text-lg font-bold tracking-wider text-light leading-tight truncate">Photography Booking System</span>
            </Link>
            <p className="text-gray-400 text-sm mt-2">
              Capturing your most precious moments with elegance and timeless style.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg text-light mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/portfolio" className="text-gray-400 hover:text-primary text-sm transition-colors">Portfolio</Link></li>
              <li><Link to="/packages" className="text-gray-400 hover:text-primary text-sm transition-colors">Packages</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-primary text-sm transition-colors">Book a Session</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-primary text-sm transition-colors">Admin Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg text-light mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>booking@gmail.com</li>
              <li>09108220863</li>
              <li>Tomas Claudio Bagsakan</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg text-light mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-xs sm:text-sm px-2">
          <p className="whitespace-nowrap">
            &copy; {new Date().getFullYear()} Photography Booking System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};