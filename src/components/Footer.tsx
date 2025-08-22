import { Link } from 'react-router-dom';
import { MdEngineering } from 'react-icons/md';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <MdEngineering className="w-8 h-8 text-blue-400" />
              <Link to="/" className="text-xl font-bold">StackHack</Link>
            </div>
            <p className="text-gray-400">
              The ultimate resource hub for engineering students worldwide.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/question-papers" className="text-gray-400 hover:text-white">Question Papers</Link></li>
              <li><Link to="/study-materials" className="text-gray-400 hover:text-white">Study Materials</Link></li>
              <li><Link to="/video-lectures" className="text-gray-400 hover:text-white">Video Lectures</Link></li>
              <li><Link to="/lab-manuals" className="text-gray-400 hover:text-white">Lab Manuals</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link to="/discussions" className="text-gray-400 hover:text-white">Discussion Forums</Link></li>
              <li><Link to="/study-groups" className="text-gray-400 hover:text-white">Study Groups</Link></li>
              <li><Link to="/expert-qa" className="text-gray-400 hover:text-white">Expert Q&A</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">support@StackHack.com</li>
              <li className="text-gray-400">+91 22224578890</li>
              <li className="text-gray-400">123 Engineering Lane, Tech City</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <a
            href="https://www.linkedin.com/in/mahesh-r-0a109b20a/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 mb-4 md:mb-0 hover:text-white transition-colors"
            style={{ textDecoration: 'none' }}
          >
            Copyright © 2025 stackhack.live. Developed by StackHack Team.
          </a>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-gray-400 hover:text-white">Terms</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy</Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}