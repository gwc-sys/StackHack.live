import { Link } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes, FaGithub } from 'react-icons/fa';
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

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const menu = document.getElementById('mobile-sidebar-menu');
      if (menu && !menu.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      {/* Main Header - hidden on mobile when menuOpen is true */}
      <nav className={`fixed w-full z-10 transition-all duration-300
        bg-gradient-to-r from-gray-900 via-gray-800 to-black
        ${isScrolled ? 'shadow-md py-2' : 'py-4'}
        ${menuOpen ? 'md:block hidden' : ''}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* Hamburger menu icon - left side, mobile only */}
            <div className="md:hidden flex items-center">
              <button onClick={handleMenuToggle} className="text-gray-100 hover:text-gray-300 focus:outline-none transition-colors duration-200 mr-2">
                <FaBars className="w-6 h-6" />
              </button>
            </div>
            <MdEngineering className="w-8 h-8 text-gray-100 hover:text-gray-300 transition-colors duration-200 cursor-pointer" />
            <Link to="/" className="text-xl font-bold text-gray-100 hover:text-gray-300 transition-colors duration-200">EngiPortal</Link>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-100 hover:text-gray-300 font-medium transition-colors duration-200">Home</Link>
            <Link to="/resources" className="text-gray-100 hover:text-gray-300 font-medium transition-colors duration-200">Resources</Link>
            <Link to="/roadmaps" className="text-gray-100 hover:text-gray-300 font-medium transition-colors duration-200">Roadmaps</Link>
            <Link to="/community" className="text-gray-100 hover:text-gray-300 font-medium transition-colors duration-200">Community</Link>
            <Link to="/collaboration" className="text-gray-100 hover:text-gray-300 font-medium transition-colors duration-200">Collaboration</Link>
            <Link to="/events-hackathons" className="text-gray-100 hover:text-gray-300 font-medium transition-colors duration-200">Hackathons</Link>
          </div>
          {/* Desktop Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:block text-gray-100 hover:text-gray-300 transition-colors duration-200">
              <FaSearch className="w-5 h-5" />
            </button>
            <Link to="/signin" className="bg-gray-900 text-gray-100 px-4 py-2 rounded-lg font-medium border border-white hover:bg-gray-800 hover:text-gray-300 transition-colors duration-200">
              Sign In
            </Link>
            <Link
              to="/auth/github"
              className="flex items-center bg-gray-900 text-gray-100 px-3 py-2 rounded-lg font-medium border border-white hover:bg-gray-800 hover:text-gray-300 transition-colors duration-200"
              title="Sign in with GitHub"
            >
              <FaGithub className="w-5 h-5 mr-2" />
              GitHub
            </Link>
          </div>
        </div>
      </nav>
      {/* Mobile Sidebar Menu - only visible when toggled */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" onClick={handleMenuToggle}></div>
          {/* Sidebar */}
          <div
            id="mobile-sidebar-menu"
            className="fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg py-6 px-6 z-50 flex flex-col md:hidden animate-slideIn"
          >
            <button onClick={handleMenuToggle} className="self-end mb-6 text-white hover:text-gray-300 focus:outline-none transition-colors duration-200">
              <FaTimes className="w-6 h-6" />
            </button>
            <Link to="/" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Home</Link>
            <Link to="/resources" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Resources</Link>
            <Link to="/roadmaps" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Roadmaps</Link>
            <Link to="/community" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Community</Link>
            <Link to="/collaboration" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Collaboration</Link>
            <Link to="/events-hackathons" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Hackathons</Link>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/signin"
                onClick={handleLinkClick}
                className="w-full py-2 px-4 bg-black text-white border border-white rounded-lg font-medium hover:bg-gray-800 hover:text-gray-300 text-center transition-colors duration-200"
                style={{ minWidth: 0, wordBreak: 'break-word' }}
              >
                Sign In
              </Link>
              <Link
                to="/auth/github"
                onClick={handleLinkClick}
                className="w-full py-2 px-4 bg-gray-900 text-white border border-white rounded-lg font-medium hover:bg-gray-800 hover:text-gray-300 text-center transition-colors duration-200 flex items-center justify-center"
                title="Sign in with GitHub"
                style={{ minWidth: 0, wordBreak: 'break-word' }}
              >
                <FaGithub className="w-5 h-5 mr-2" />
                GitHub
              </Link>
            </div>
          </div>
        </>
      )}
      {/* Optional: Add animation for sidebar */}
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease;
          }
        `}
      </style>
    </>
  );
}