import { Link } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { MdEngineering } from 'react-icons/md';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className={`fixed w-full z-10 transition-all duration-300
      ${isScrolled
        ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-md py-2'
        : 'bg-gradient-to-r from-gray-900 via-gray-800 to-black py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MdEngineering className="w-8 h-8 text-white hover:text-gray-300 transition-colors duration-200 cursor-pointer" />
          <Link to="/" className="text-xl font-bold text-white hover:text-gray-300 transition-colors duration-200">EngiPortal</Link>
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-white hover:text-gray-300 font-medium transition-colors duration-200">Home</Link>
          <Link to="/resources" className="text-white hover:text-gray-300 font-medium transition-colors duration-200">Resources</Link>
          <Link to="/roadmaps" className="text-white hover:text-gray-300 font-medium transition-colors duration-200">Roadmaps</Link>
          <Link to="/community" className="text-white hover:text-gray-300 font-medium transition-colors duration-200">Community</Link>
          <Link to="/collaboration" className="text-white hover:text-gray-300 font-medium transition-colors duration-200">Collaboration</Link>
          <Link to="/events-hackathons" className="text-white hover:text-gray-300 font-medium transition-colors duration-200">Hackathons</Link>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={handleMenuToggle} className="text-white hover:text-gray-300 focus:outline-none transition-colors duration-200">
            {menuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="hidden md:block text-white hover:text-gray-300 transition-colors duration-200">
            <FaSearch className="w-5 h-5" />
          </button>
          <Link to="/signin" className="bg-black text-white px-4 py-2 rounded-lg font-medium border border-white hover:bg-gray-800 hover:text-gray-300 transition-colors duration-200">
            Sign In
          </Link>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 shadow-md py-4 px-6 absolute top-full left-0 w-full z-20">
          <Link to="/" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Home</Link>
          <Link to="/resources" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Resources</Link>
          <Link to="/roadmaps" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Roadmaps</Link>
          <Link to="/community" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Community</Link>
          <Link to="/collaboration" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Collaboration</Link>
          <Link to="/events-hackathons" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Hackathons</Link>
          <Link to="/signin" onClick={handleLinkClick} className="block py-2 bg-black text-white border border-white rounded-lg font-medium hover:bg-gray-800 hover:text-gray-300 mt-2 text-center transition-colors duration-200">
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
}