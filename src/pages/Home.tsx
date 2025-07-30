import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaSearch, FaBook, FaGraduationCap, FaUniversity, FaUserGraduate, FaChalkboardTeacher, FaRegCalendarAlt, FaRegClock, FaRegBookmark, FaBookOpen, FaRegNewspaper } from 'react-icons/fa';
import { MdEngineering, MdComputer, MdOutlineScience, MdConstruction } from 'react-icons/md';

const branches = [
  {
    name: "Mechanical Engineering",
    icon: <MdEngineering className="w-6 h-6 text-blue-500" />,
    color: "bg-orange-100"
  },
  {
    name: "Civil Engineering",
    icon: <MdConstruction className="w-6 h-6 text-blue-500" />,
    color: "bg-green-100"
  },
  {
    name: "Electrical Engineering",
    icon: <FaGraduationCap className="w-6 h-6 text-blue-500" />,
    color: "bg-yellow-100"
  },
  {
    name: "Electronics and Communication Engineering (ECE)",
    icon: <MdComputer className="w-6 h-6 text-blue-500" />,
    color: "bg-purple-100"
  },
  {
    name: "Computer Science and Engineering (CSE)",
    icon: <MdComputer className="w-6 h-6 text-blue-500" />,
    color: "bg-blue-100"
  },
  {
    name: "Chemical Engineering",
    icon: <MdOutlineScience className="w-6 h-6 text-blue-500" />,
    color: "bg-red-100"
  },
  {
    name: "Artificial Intelligence and Machine Learning (AI & ML)",
    icon: <MdComputer className="w-6 h-6 text-blue-500" />,
    color: "bg-indigo-100"
  },
  {
    name: "Data Science and Engineering",
    icon: <MdOutlineScience className="w-6 h-6 text-blue-500" />,
    color: "bg-pink-100"
  },
  {
    name: "Robotics and Automation",
    icon: <MdEngineering className="w-6 h-6 text-blue-500" />,
    color: "bg-teal-100"
  },
  {
    name: "Mechatronics Engineering",
    icon: <MdEngineering className="w-6 h-6 text-blue-500" />,
    color: "bg-cyan-100"
  },
  {
    name: "Cybersecurity Engineering",
    icon: <MdComputer className="w-6 h-6 text-blue-500" />,
    color: "bg-gray-100"
  }
];

const features = [
  {
    icon: <FaBookOpen className="w-10 h-10 text-blue-500" />,
    title: "Study Materials",
    description: "Access comprehensive study materials, lecture notes, and reference books"
  },
  {
    icon: <FaRegNewspaper className="w-10 h-10 text-blue-500" />,
    title: "Past Papers",
    description: "Practice with previous year question papers and model answers"
  },
  {
    icon: <FaUniversity className="w-10 h-10 text-blue-500" />,
    title: "University Resources",
    description: "Connect with leading educational institutions and their resources"
  },
  {
    icon: <FaChalkboardTeacher className="w-10 h-10 text-blue-500" />,
    title: "Expert Guidance",
    description: "Get insights from professors and industry experts"
  },
  {
    icon: <FaUserGraduate className="w-10 h-10 text-blue-500" />,
    title: "Student Community",
    description: "Join discussions with peers across universities"
  },
  {
    icon: <FaRegBookmark className="w-10 h-10 text-blue-500" />,
    title: "Bookmark System",
    description: "Save your favorite resources for quick access"
  }
];

const testimonials = [
  {
    name: "Rahul Sharma",
    university: "IIT Delhi",
    text: "This platform helped me ace my semester exams with its comprehensive question bank and study materials.",
    rating: 5
  },
  {
    name: "Priya Patel",
    university: "NIT Surat",
    text: "The past papers with solutions were a game-changer for my preparation strategy.",
    rating: 4
  },
  {
    name: "Amit Kumar",
    university: "BITS Pilani",
    text: "The community discussions clarified many of my doubts and improved my understanding.",
    rating: 5
  }
];

export default function Home() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  //const [isScrolled, setIsScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 50);
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFilteredBranches = () => {
    if (activeTab === 'all') return filteredBranches;
    return filteredBranches.filter(branch => 
      branch.name.toLowerCase().includes(activeTab.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white pt-32 pb-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Engineering Resources <br />
                <span className="text-yellow-300">Reimagined</span>
              </h1>
              <p className="text-xl mb-8 max-w-2xl">
                The most comprehensive platform for engineering students with thousands of question papers, study materials, video lectures, and a thriving community.
              </p>
              <div className="max-w-xl relative mb-8">
                <div className="flex items-center bg-white rounded-lg shadow-lg">
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
              <div className="flex flex-wrap gap-4">
                <Link to="/resources" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg">
                  Explore Resources
                </Link>
                <Link to="/community" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all shadow-md hover:shadow-lg">
                  Join Community
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-yellow-300 rounded-lg opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-purple-300 rounded-lg opacity-20 animate-pulse delay-300"></div>
                <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg"
                    alt="Students studying"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                    <div className="flex items-center">
                      <div className="bg-blue-600 text-white p-2 rounded-full mr-3">
                        <FaBook className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Latest: CSE 2023 Papers</h3>
                        <p className="text-blue-200 text-sm">Added 2 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600">Question Papers</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Universities</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">100K+</div>
            <div className="text-gray-600">Students</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">5K+</div>
            <div className="text-gray-600">Study Materials</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides all the resources engineering students need in one place
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Branches Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Engineering Branches</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find resources for your specific engineering discipline
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full font-medium ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
            >
              All Branches
            </button>
            <button 
              onClick={() => setActiveTab('computer')}
              className={`px-4 py-2 rounded-full font-medium ${activeTab === 'computer' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
            >
              Computer Related
            </button>
            <button 
              onClick={() => setActiveTab('engineering')}
              className={`px-4 py-2 rounded-full font-medium ${activeTab === 'engineering' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
            >
              Core Engineering
            </button>
            <button 
              onClick={() => setActiveTab('science')}
              className={`px-4 py-2 rounded-full font-medium ${activeTab === 'science' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
            >
              Science Based
            </button>
          </div>

          {/* Branches Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getFilteredBranches().map((branch, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`${branch.color} p-6 flex items-center justify-center`}>
                  <div className="bg-white p-4 rounded-full shadow-md">
                    {branch.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">{branch.name}</h2>
                  <div className="space-y-4">
                    {["First Year", "Second Year", "Third Year", "Final Year"].map((year, yearIndex) => (
                      <div key={yearIndex}>
                        <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
                          <FaRegCalendarAlt className="mr-2 text-blue-500" />
                          {year}
                        </h3>
                        <div className="space-y-2 pl-6">
                          {[2023, 2022, 2021].map((paperYear) => (
                            <a
                              key={paperYear}
                              href="#"
                              className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center text-sm"
                            >
                              <FaRegClock className="mr-2 text-blue-400" />
                              {paperYear} Papers & Solutions
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Students Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from engineering students who've benefited from our resources
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.university}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">How would you rate EngiPortal?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Your feedback helps us improve the platform for all engineering students
          </p>
          <div className="flex justify-center items-center mb-8">
            <div className="flex space-x-2">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    className="cursor-pointer transition-colors duration-200"
                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                    size={40}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(rating)}
                  />
                );
              })}
            </div>
          </div>
          {rating > 0 && (
            <p className="text-lg text-gray-700">
              Thank you for your {rating} star rating!
            </p>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400 rounded-full opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-400 rounded-full opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Engineering Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join over 100,000 engineering students who are already acing their academics with our resources.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl">
              Get Started for Free
            </Link>
            <Link to="/premium" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl">
              Explore Premium Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}