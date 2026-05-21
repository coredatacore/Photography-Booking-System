import { Link } from "react-router-dom";
import { Camera, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/config";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userProfile } = useAuth();

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-dark-paper/90 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2 min-w-0">
            <Camera className="h-8 w-8 text-primary shrink-0" />
            <span className="font-serif text-sm sm:text-lg md:text-xl font-bold tracking-wider text-light leading-tight truncate">
              Photography Booking System
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/portfolio" className="text-gray-300 hover:text-primary transition-colors">Portfolio</Link>
            <Link to="/packages" className="text-gray-300 hover:text-primary transition-colors">Packages</Link>
            <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">Contact</Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/admin/dashboard" 
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  Admin Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-dark transition-colors rounded-none"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-primary transition-colors">Admin Login</Link>
                <Link to="/booking" className="px-6 py-2 bg-primary text-dark font-medium hover:bg-primary/90 transition-colors">
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-primary">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-paper border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/portfolio" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-300 hover:text-primary">Portfolio</Link>
            <Link to="/packages" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-300 hover:text-primary">Packages</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-300 hover:text-primary">Contact</Link>
            {currentUser ? (
              <>
                <Link 
                  to="/admin/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-gray-300 hover:text-primary"
                >
                  Admin Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-primary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/booking" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-primary font-medium">Book Now</Link>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-300 hover:text-primary">Admin Login</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};