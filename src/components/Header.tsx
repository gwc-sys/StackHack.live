import { Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaGithub,
  FaGoogle,
  FaUserCircle,
} from "react-icons/fa";
import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../pages/AuthContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user, getInitials } = useContext(AuthContext);

  useEffect(() => {
    const checkIfMobile = () => window.innerWidth <= 850;
    setIsMobile(checkIfMobile());

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleResize = () => {
      setIsMobile(checkIfMobile());
      if (!checkIfMobile()) setMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleLinkClick = () => setMenuOpen(false);

  const renderProfile = () => {
    const initials = getInitials();
    const displayName = user?.fullName || user?.full_name || user?.username;

    return (
      <Link
        to="/profile"
        className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold hover:bg-gray-600 transition-colors duration-200"
        title={displayName}
      >
        {initials}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Header (≥851px) */}
      {!isMobile && (
        <header
          className={`fixed w-full z-10 transition-all duration-300
          bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white
          ${isScrolled ? "shadow-lg py-2" : "py-4"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="text-xl font-bold text-white hover:text-gray-300 transition-colors duration-200"
            >
              SᴛᴀᴄᴋHᴀᴄᴋ
            </Link>

            {/* Navigation */}
            <nav className="flex space-x-6">
              <Link to="/" className="text-white hover:text-gray-300 font-medium">Home</Link>
              <Link to="/resources" className="text-white hover:text-gray-300 font-medium">Resources</Link>
              <Link to="/roadmaps" className="text-white hover:text-gray-300 font-medium">Roadmaps</Link>
              <Link to="/community" className="text-white hover:text-gray-300 font-medium">Community</Link>
              <Link to="/collaboration" className="text-white hover:text-gray-300 font-medium">Collaboration</Link>
              <Link to="/events-hackathons" className="text-white hover:text-gray-300 font-medium">Hackathons</Link>
            </nav>

            {/* Auth / Profile */}
            <div className="flex items-center space-x-4">
              {user ? (
                renderProfile()
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="bg-blue-800 text-white px-4 py-2 rounded-lg font-medium border border-blue-700 hover:bg-blue-700 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/github"
                    className="flex items-center bg-gray-800 text-white px-3 py-2 rounded-lg font-medium border border-gray-700 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <FaGithub className="w-5 h-5 mr-2" />
                    GitHub
                  </Link>
                  <Link
                    to="/auth/google"
                    className="flex items-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white px-3 py-2 rounded-lg font-medium border border-blue-700 hover:opacity-90 transition-all duration-200 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                    <FaGoogle className="w-5 h-5 mr-2 text-[#EA4335]" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05]">
                      Google
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Mobile Header (≤850px) */}
      {isMobile && (
        <>
          <header
            className={`fixed w-full z-10 transition-all duration-300
            bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white
            ${isScrolled ? "shadow-lg py-2" : "py-4"}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              {/* Menu Icon (left) */}
              <button
                onClick={handleMenuToggle}
                className="text-white hover:text-gray-300 focus:outline-none"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <FaTimes className="w-6 h-6" />
                ) : (
                  <FaBars className="w-6 h-6" />
                )}
              </button>

              {/* Logo (center) */}
              <Link
                to="/"
                className="text-xl font-bold text-white hover:text-gray-300"
              >
                SᴛᴀᴄᴋHᴀᴄᴋ
              </Link>

              {/* Profile (right) */}
              {user ? renderProfile() : <FaUserCircle className="w-10 h-10 text-gray-300" />}
            </div>
          </header>

          {/* Mobile Menu (slide-in) */}
          {menuOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-10"
                onClick={handleMenuToggle}
              />

              {/* Sidebar */}
              <aside
                ref={menuRef}
                className="fixed top-0 left-0 h-auto min-h-screen w-64 bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 shadow-xl z-20 animate-slideIn"
              >
                {/* Logo */}
                <div className="px-6 py-4 border-b border-blue-800">
                  <Link
                    to="/"
                    className="text-xl font-bold text-white hover:text-gray-300"
                    onClick={handleLinkClick}
                  >
                    SᴛᴀᴄᴋHᴀᴄᴋ
                  </Link>
                </div>

                {/* Navigation */}
                <nav className="px-6 py-6 flex flex-col space-y-4">
                  <Link to="/" onClick={handleLinkClick} className="text-white hover:text-gray-300">Home</Link>
                  <Link to="/resources" onClick={handleLinkClick} className="text-white hover:text-gray-300">Resources</Link>
                  <Link to="/roadmaps" onClick={handleLinkClick} className="text-white hover:text-gray-300">Roadmaps</Link>
                  <Link to="/community" onClick={handleLinkClick} className="text-white hover:text-gray-300">Community</Link>
                  <Link to="/collaboration" onClick={handleLinkClick} className="text-white hover:text-gray-300">Collaboration</Link>
                  <Link to="/events-hackathons" onClick={handleLinkClick} className="text-white hover:text-gray-300">Hackathons</Link>
                </nav>

                {/* Auth Buttons (only if not logged in) */}
                {!user && (
                  <div className="px-6 py-4 flex flex-col gap-3 border-t border-blue-800">
                    <Link
                      to="/signin"
                      onClick={handleLinkClick}
                      className="w-full py-2 px-4 bg-blue-800 text-white border border-blue-700 rounded-lg font-medium hover:bg-blue-700 text-center transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth/github"
                      onClick={handleLinkClick}
                      className="w-full py-2 px-4 bg-gray-800 text-white border border-gray-700 rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center transition-colors duration-200"
                    >
                      <FaGithub className="w-5 h-5 mr-2" />
                      GitHub
                    </Link>
                    <Link
                      to="/auth/google"
                      onClick={handleLinkClick}
                      className="w-full py-2 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white border border-blue-700 rounded-lg font-medium hover:opacity-90 flex items-center justify-center transition-all duration-200 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                      <FaGoogle className="w-5 h-5 mr-2 text-[#EA4335]" />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05]">
                        Google
                      </span>
                    </Link>
                  </div>
                )}
              </aside>
            </>
          )}
        </>
      )}

      {/* Slide-in animation */}
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