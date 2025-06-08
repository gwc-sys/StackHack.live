import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { MdEngineering } from 'react-icons/md';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MdEngineering className="w-8 h-8 text-blue-600" />
          <Link to="/" className="text-xl font-bold text-blue-600">EngiPortal</Link>
        </div>
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
          <Link to="/resources" className="text-gray-700 hover:text-blue-600 font-medium">Resources</Link>
          <Link to="/universities" className="text-gray-700 hover:text-blue-600 font-medium">Universities</Link>
          <Link to="/community" className="text-gray-700 hover:text-blue-600 font-medium">Community</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</Link>
        </div>
        <div className="flex items-center space-x-4">
          <button className="hidden md:block text-gray-700 hover:text-blue-600">
            <FaSearch className="w-5 h-5" />
          </button>
          <Link to="/signin" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}