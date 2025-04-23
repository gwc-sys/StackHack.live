import { useState } from 'react';
import { FaStar, FaSearch, FaBook, FaGraduationCap, FaUniversity } from 'react-icons/fa';

const branches = [
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Electronics and Communication Engineering (ECE)",
  "Computer Science and Engineering (CSE)",
  "Chemical Engineering",
  "Artificial Intelligence and Machine Learning (AI & ML)",
  "Data Science and Engineering",
  "Robotics and Automation",
  "Mechatronics Engineering",
  "Cybersecurity Engineering"
];

const features = [
  {
    icon: <FaBook className="w-8 h-8 text-blue-500" />,
    title: "Study Materials",
    description: "Access comprehensive study materials and notes"
  },
  {
    icon: <FaGraduationCap className="w-8 h-8 text-blue-500" />,
    title: "Past Papers",
    description: "Practice with previous year question papers"
  },
  {
    icon: <FaUniversity className="w-8 h-8 text-blue-500" />,
    title: "Top Universities",
    description: "Connect with leading educational institutions"
  }
];

export default function Home() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBranches = branches.filter(branch =>
    branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg"
            alt="Students studying"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-5xl font-bold text-center mb-6">
            Your Gateway to Engineering Excellence
          </h1>
          <p className="text-xl text-center mb-8 max-w-3xl mx-auto">
            Access thousands of engineering question papers, study materials, and resources
            to excel in your academic journey.
          </p>
          <div className="max-w-xl mx-auto relative">
            <div className="flex items-center bg-white rounded-lg shadow-md">
              <FaSearch className="ml-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for your branch..."
                className="w-full p-4 text-gray-800 rounded-lg focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-center mb-12">Engineering Branches</h2>
        
        {/* Rating Section */}
        <div className="flex justify-center items-center mb-12">
          <span className="mr-4 text-lg">Rate your experience:</span>
          <div className="flex">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <FaStar
                  key={index}
                  className="cursor-pointer transition-colors duration-200"
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  size={32}
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(rating)}
                />
              );
            })}
          </div>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.map((branch, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h2 className="text-xl font-semibold mb-4 text-blue-600">{branch}</h2>
              <div className="space-y-3">
                {[2023, 2022, 2021].map((year) => (
                  <a
                    key={year}
                    href="#"
                    className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center"
                  >
                    <FaBook className="mr-2" />
                    {year} Question Papers
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Excel in Your Studies?</h2>
          <p className="text-xl mb-8">Join thousands of engineering students who are already benefiting from our resources.</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}