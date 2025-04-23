import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-400">About</Link></li>
              <li><Link to="/colleges" className="hover:text-blue-400">Colleges</Link></li>
              <li><Link to="/universities" className="hover:text-blue-400">Universities</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Engineering Branches</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-400">Mechanical</Link></li>
              <li><Link to="/" className="hover:text-blue-400">Civil</Link></li>
              <li><Link to="/" className="hover:text-blue-400">Electrical</Link></li>
              <li><Link to="/" className="hover:text-blue-400">Computer Science</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-400">Question Papers</Link></li>
              <li><Link to="/" className="hover:text-blue-400">Study Materials</Link></li>
              <li><Link to="/" className="hover:text-blue-400">Syllabus</Link></li>
              <li><Link to="/" className="hover:text-blue-400">Notes</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <FaInstagram size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} StudentPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}