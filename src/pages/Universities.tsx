import { FaSearch, FaMapMarkerAlt, FaTrophy, FaGlobe, FaUserGraduate } from 'react-icons/fa';
import { useState } from 'react';

const universities = [
  {
    name: "Savitribai Phule Pune University",
    image: "https://images.pexels.com/photos/207684/pexels-photo-207684.jpeg",
    location: "Ganeshkhind, Pune",
    established: 1949,
    ranking: "NAAC A++",
    website: "www.unipune.ac.in",
    students: "500,000+",
    description: "One of the premier universities in India, offering various undergraduate and postgraduate programs across multiple disciplines."
  },
  {
    name: "Symbiosis International University",
    image: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg",
    location: "Lavale, Pune",
    established: 2002,
    ranking: "NAAC A",
    website: "www.siu.edu.in",
    students: "30,000+",
    description: "Known for its international approach to education and diverse student community from across the globe."
  },
  {
    name: "MIT World Peace University",
    image: "https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg",
    location: "Kothrud, Pune",
    established: 2017,
    ranking: "NAAC A+",
    website: "www.mitwpu.edu.in",
    students: "25,000+",
    description: "Focuses on holistic development through technology, management, and liberal arts education."
  },
  {
    name: "Bharati Vidyapeeth University",
    image: "https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg",
    location: "Dhankawadi, Pune",
    established: 1996,
    ranking: "NAAC A+",
    website: "www.bvuniversity.edu.in",
    students: "40,000+",
    description: "Offers programs in medicine, dentistry, engineering, management, and more."
  }
];

export default function Universities() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUniversities = universities.filter(university =>
    university.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Universities in Pune</h1>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="flex items-center bg-white rounded-lg shadow-md">
            <FaSearch className="ml-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search universities..."
              className="w-full p-4 text-gray-800 rounded-lg focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Universities Grid */}
        <div className="space-y-8">
          {filteredUniversities.map((university, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={university.image}
                    alt={university.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h2 className="text-2xl font-semibold mb-4">{university.name}</h2>
                  <p className="text-gray-600 mb-4">{university.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-blue-600" />
                      {university.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaTrophy className="mr-2 text-blue-600" />
                      {university.ranking}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaGlobe className="mr-2 text-blue-600" />
                      {university.website}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUserGraduate className="mr-2 text-blue-600" />
                      {university.students} Students
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}