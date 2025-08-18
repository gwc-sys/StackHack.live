import { Link } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes, FaGithub } from 'react-icons/fa';
import { MdEngineering } from 'react-icons/md';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIfMobile = () => window.innerWidth < 768;
    setIsMobile(checkIfMobile());
    
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const handleResize = () => {
      setIsMobile(checkIfMobile());
      if (!checkIfMobile()) setMenuOpen(false);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
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
      {/* Desktop Header */}
      {!isMobile && (
        <header className={`fixed w-full z-10 transition-all duration-300
          bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
          ${isScrolled ? 'shadow-lg py-2' : 'py-4'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MdEngineering className="w-8 h-8 text-gray-100 hover:text-gray-300 transition-colors duration-200" />
              <Link to="/" className="text-xl font-bold text-gray-100 hover:text-gray-300 transition-colors duration-200">
                EngiPortal
              </Link>
            </div>
            
            <nav className="flex space-x-6">
              <Link to="/" className="text-gray-100 hover:text-gray-300 font-medium transition-colors duration-200">Home</Link>
              <Link to="/resources" className="text-gray-100 hover:text-gray-300 font-medium transition-colors duration-200">Resources</Link>
              <Link to="/roadmaps" className="text-gray-100 hover:text-gray-300 font-medium transition-colors duration-200">Roadmaps</Link>
              <Link to="/community" className="text-gray-100 hover:text-gray-300 font-medium transition-colors duration-200">Community</Link>
              <Link to="/collaboration" className="text-gray-100 hover:text-gray-300 font-medium transition-colors duration-200">Collaboration</Link>
              <Link to="/events-hackathons" className="text-gray-100 hover:text-gray-300 font-medium transition-colors duration-200">Hackathons</Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-100 hover:text-gray-300 transition-colors duration-200" aria-label="Search">
                <FaSearch className="w-5 h-5" />
              </button>
              <Link to="/signin" className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg font-medium border border-gray-700 hover:bg-gray-700 hover:text-gray-300 transition-colors duration-200">
                Sign In
              </Link>
              <Link to="/auth/github" className="flex items-center bg-gray-800 text-gray-100 px-3 py-2 rounded-lg font-medium border border-gray-700 hover:bg-gray-700 hover:text-gray-300 transition-colors duration-200" aria-label="Sign in with GitHub">
                <FaGithub className="w-5 h-5 mr-2" />
                GitHub
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Header - Only Hamburger initially */}
      {isMobile && (
        <>
          <header className={`fixed w-full z-10 transition-all duration-300
            bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
            ${isScrolled ? 'shadow-lg py-2' : 'py-4'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <button 
                onClick={handleMenuToggle} 
                className="text-gray-100 hover:text-gray-300 focus:outline-none transition-colors duration-200"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </button>
              
              {/* Empty div for spacing */}
              <div className="flex-1"></div>
              
              {/* Only show logo when menu is open */}
              {menuOpen && (
                <div className="flex items-center space-x-2">
                  <MdEngineering className="w-8 h-8 text-gray-100 hover:text-gray-300 transition-colors duration-200" />
                  <Link to="/" className="text-xl font-bold text-gray-100 hover:text-gray-300 transition-colors duration-200" onClick={handleLinkClick}>
                    EngiPortal
                  </Link>
                </div>
              )}
            </div>
          </header>

          {/* Mobile Menu - Only appears when hamburger is clicked */}
          {menuOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40" 
                onClick={handleMenuToggle}
                role="button"
                aria-label="Close menu"
                tabIndex={0}
              />
              
              <aside
                ref={menuRef}
                className="fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-xl py-6 px-6 z-50 flex flex-col animate-slideIn"
                aria-label="Mobile menu"
              >
                <div className="flex items-center space-x-2 mb-8">
                  <MdEngineering className="w-8 h-8 text-gray-100 hover:text-gray-300 transition-colors duration-200" />
                  <Link to="/" className="text-xl font-bold text-gray-100 hover:text-gray-300 transition-colors duration-200" onClick={handleLinkClick}>
                    EngiPortal
                  </Link>
                </div>
                
                <nav className="flex flex-col space-y-4">
                  <Link to="/" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Home</Link>
                  <Link to="/resources" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Resources</Link>
                  <Link to="/roadmaps" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Roadmaps</Link>
                  <Link to="/community" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Community</Link>
                  <Link to="/collaboration" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Collaboration</Link>
                  <Link to="/events-hackathons" onClick={handleLinkClick} className="block py-2 text-white hover:text-gray-300 font-medium transition-colors duration-200">Hackathons</Link>
                </nav>
                
                <div className="mt-auto pt-6 flex flex-col gap-3">
                  <button className="text-white hover:text-gray-300 transition-colors duration-200 flex items-center justify-start py-2" aria-label="Search">
                    <FaSearch className="w-5 h-5 mr-2" />
                    Search
                  </button>
                  <Link to="/signin" onClick={handleLinkClick} className="w-full py-2 px-4 bg-gray-800 text-white border border-gray-700 rounded-lg font-medium hover:bg-gray-700 hover:text-gray-300 text-center transition-colors duration-200">
                    Sign In
                  </Link>
                  <Link to="/auth/github" onClick={handleLinkClick} className="w-full py-2 px-4 bg-gray-800 text-white border border-gray-700 rounded-lg font-medium hover:bg-gray-700 hover:text-gray-300 text-center transition-colors duration-200 flex items-center justify-center" aria-label="Sign in with GitHub">
                    <FaGithub className="w-5 h-5 mr-2" />
                    GitHub
                  </Link>
                </div>
              </aside>
            </>
          )}
        </>
      )}
      
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease forwards;
          }
        `}
      </style>
    </>
  );
}