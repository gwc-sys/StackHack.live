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

  
  const { user } = useContext(AuthContext);

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
    if (user?.fullName) {
      const parts = user.fullName.trim().split(" ");
      const initials =
        parts.length >= 2
          ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
          : parts[0][0].toUpperCase();

      return (
        <Link
          to="/profile"
          className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold hover:bg-gray-600 transition-colors duration-200"
        >
          {initials}
        </Link>
      );
    }
    return <FaUserCircle className="w-10 h-10 text-gray-300" />;
  };

  return (
    <>
      {/* Desktop Header (≥851px) */}
      {!isMobile && (
        <header
          className={`fixed w-full z-10 transition-all duration-300
          bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
          ${isScrolled ? "shadow-lg py-2" : "py-4"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="text-xl font-bold text-gray-100 hover:text-gray-300 transition-colors duration-200"
            >
              SᴛᴀᴄᴋHᴀᴄᴋ
            </Link>

            {/* Navigation */}
            <nav className="flex space-x-6">
              <Link to="/" className="text-gray-100 hover:text-gray-300 font-medium">Home</Link>
              <Link to="/resources" className="text-gray-100 hover:text-gray-300 font-medium">Resources</Link>
              <Link to="/roadmaps" className="text-gray-100 hover:text-gray-300 font-medium">Roadmaps</Link>
              <Link to="/community" className="text-gray-100 hover:text-gray-300 font-medium">Community</Link>
              <Link to="/collaboration" className="text-gray-100 hover:text-gray-300 font-medium">Collaboration</Link>
              <Link to="/events-hackathons" className="text-gray-100 hover:text-gray-300 font-medium">Hackathons</Link>
            </nav>

            {/* Auth / Profile */}
            <div className="flex items-center space-x-4">
              {user ? (
                renderProfile()
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg font-medium border border-gray-700 hover:bg-gray-700 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/github"
                    className="flex items-center bg-gray-800 text-gray-100 px-3 py-2 rounded-lg font-medium border border-gray-700 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <FaGithub className="w-5 h-5 mr-2" />
                    GitHub
                  </Link>
                  <Link
                    to="/auth/google"
                    className="flex items-center bg-gray-800 text-gray-100 px-3 py-2 rounded-lg font-medium border border-gray-700 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <FaGoogle className="w-5 h-5 mr-2" />
                    Google
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
            bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
            ${isScrolled ? "shadow-lg py-2" : "py-4"}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              {/* Menu Icon (left) */}
              <button
                onClick={handleMenuToggle}
                className="text-gray-100 hover:text-gray-300 focus:outline-none"
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
                className="text-xl font-bold text-gray-100 hover:text-gray-300"
              >
                StackHack
              </Link>

              {/* Profile (right) */}
              {renderProfile()}
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
                className="fixed top-0 left-0 h-auto min-h-screen w-64 bg-gray-900 shadow-xl z-20 animate-slideIn"
              >
                {/* Logo */}
                <div className="px-6 py-4 border-b border-gray-800">
                  <Link
                    to="/"
                    className="text-xl font-bold text-gray-100 hover:text-gray-300"
                    onClick={handleLinkClick}
                  >
                    StackHack
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
                  <div className="px-6 py-4 flex flex-col gap-3 border-t border-gray-800">
                    <Link
                      to="/signin"
                      onClick={handleLinkClick}
                      className="w-full py-2 px-4 bg-gray-800 text-white border border-gray-700 rounded-lg font-medium hover:bg-gray-700 text-center transition-colors duration-200"
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
                      className="w-full py-2 px-4 bg-gray-800 text-white border border-gray-700 rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center transition-colors duration-200"
                    >
                      <FaGoogle className="w-5 h-5 mr-2" />
                      Google
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
