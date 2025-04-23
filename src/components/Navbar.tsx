import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">StudentPortal</Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">Home</Link>
            <Link to="/about" className="hover:bg-blue-700 px-3 py-2 rounded">About</Link>
            <Link to="/colleges" className="hover:bg-blue-700 px-3 py-2 rounded">Colleges</Link>
            <Link to="/universities" className="hover:bg-blue-700 px-3 py-2 rounded">Universities</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}