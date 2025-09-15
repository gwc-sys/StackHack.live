import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="text-center">
        {/* Space-themed 404 */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-gray-700">404</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl font-bold text-purple-400 animate-pulse">🚀</div>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Lost in Space
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
          This page has embarked on a cosmic journey and is currently exploring distant galaxies.
        </p>

        {/* Animated stars */}
        <div className="flex justify-center space-x-2 mb-8">
          {['⭐', '✨', '🌠', '🚀', '👨‍🚀'].map((emoji, index) => (
            <span 
              key={index}
              className="text-2xl animate-bounce"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors duration-200 transform hover:scale-105"
          >
            🏠 Return to Earth
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-block px-8 py-3 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900 rounded-lg font-medium transition-all duration-200"
          >
            🔙 Previous Orbit
          </button>
        </div>

        {/* Cosmic message */}
        <div className="mt-12 p-4 bg-gray-800 rounded-lg border border-purple-500">
          <p className="text-sm text-gray-300">
            "The only way to discover the limits of the possible is to go beyond them into the impossible."<br />
            <span className="text-purple-400">- Arthur C. Clarke</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;