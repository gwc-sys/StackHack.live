import { FaSearch, FaMapMarkerAlt, FaGraduationCap, FaPhone } from 'react-icons/fa';
import { useState } from 'react';

const colleges = [
  {
    name: "College of Engineering, Pune (COEP)",
    image: "https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg",
    location: "Wellesley Road, Shivajinagar, Pune",
    contact: "+91-020-25507000",
    courses: ["Mechanical", "Civil", "Computer Science", "Electronics", "IT"],
    rating: 4.8
  },
  {
    name: "Pune Institute of Computer Technology (PICT)",
    image: "https://images.pexels.com/photos/2305098/pexels-photo-2305098.jpeg",
    location: "Survey No. 27, Near Trimurti Chowk, Dhankawadi, Pune",
    contact: "+91-020-24371101",
    courses: ["Computer Engineering", "Electronics", "IT"],
    rating: 4.6
  },
  {
    name: "Maharashtra Institute of Technology (MIT)",
    image: "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg",
    location: "S.No.124, Paud Road, Kothrud, Pune",
    contact: "+91-020-30273400",
    courses: ["Engineering", "Management", "Design"],
    rating: 4.5
  },
  {
    name: "Vishwakarma Institute of Technology (VIT)",
    image: "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg",
    location: "666, Upper Indiranagar, Bibwewadi, Pune",
    contact: "+91-020-24283001",
    courses: ["Mechanical", "Computer Science", "IT", "Civil"],
    rating: 4.7
  },
  {
    name: "Army Institute of Technology (AIT)",
    image: "https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg",
    location: "Dighi Hills, Alandi Road, Pune",
    contact: "+91-020-27157534",
    courses: ["Computer Engineering", "Mechanical", "IT", "E&TC"],
    rating: 4.4
  },
  {
    name: "Trinity College of Engineering",
    image: "https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg",
    location: "Pisoli, Pune",
    contact: "+91-020-26933333",
    courses: ["Mechanical", "Computer Science", "Civil", "Electronics & Telecommunication"],
    rating: 4.3
  },
  {
    name: "Trinity Academy of Engineering",
    image: "https://images.pexels.com/photos/5678901/pexels-photo-5678901.jpeg",
    location: "Pune, Maharashtra",
    contact: "+91-020-12345678",
    courses: ["Mechanical", "Computer Science", "IT", "Civil", "E&TC"],
    rating: 4.2
  },
  {
    name: "Trinity College of Engineering and Management Research",
    image: "https://images.pexels.com/photos/6789012/pexels-photo-6789012.jpeg",
    location: "Pune, Maharashtra",
    contact: "+91-020-87654321",
    courses: ["Mechanical", "Civil", "Computer Science", "IT"],
    rating: 4.1
  }
];

export default function Colleges() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Top Engineering Colleges in Pune</h1>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="flex items-center bg-white rounded-lg shadow-md">
            <FaSearch className="ml-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search colleges..."
              className="w-full p-4 text-gray-800 rounded-lg focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Colleges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredColleges.map((college, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={college.image}
                alt={college.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">{college.name}</h2>
                <div className="space-y-3 text-gray-600">
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-600" />
                    {college.location}
                  </p>
                  <p className="flex items-center">
                    <FaPhone className="mr-2 text-blue-600" />
                    {college.contact}
                  </p>
                  <div className="flex items-center">
                    <FaGraduationCap className="mr-2 text-blue-600" />
                    <div className="flex flex-wrap gap-2">
                      {college.courses.map((course, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-yellow-400 text-lg">
                    {"★".repeat(Math.floor(college.rating))}
                    <span className="text-gray-400">{"★".repeat(5 - Math.floor(college.rating))}</span>
                    <span className="text-gray-600 text-sm ml-2">{college.rating}/5</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}