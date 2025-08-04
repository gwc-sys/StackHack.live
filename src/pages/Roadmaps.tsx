import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

type Roadmap = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  popularity: number;
  isNew?: boolean;
  image: string;
  skills: string[];
};

const Roadmaps = () => {
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'all',
    'frontend',
    'backend',
    'devops',
    'mobile',
    'data',
    'cybersecurity',
    'blockchain'
  ];

  const roadmaps: Roadmap[] = [
    {
      id: '1',
      title: 'Frontend Developer',
      description: 'Master modern frontend development with React, Vue, and Angular',
      category: 'frontend',
      duration: '6 months',
      level: 'Beginner',
      popularity: 95,
      isNew: false,
      image: 'https://cdn-icons-png.flaticon.com/512/226/226269.png',
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript']
    },
    {
      id: '2',
      title: 'Backend Developer (Node.js)',
      description: 'Become proficient in server-side development with Node.js and Express',
      category: 'backend',
      duration: '5 months',
      level: 'Intermediate',
      popularity: 85,
      isNew: true,
      image: 'https://cdn-icons-png.flaticon.com/512/919/919825.png',
      skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Authentication']
    },
    {
      id: '3',
      title: 'DevOps Engineer',
      description: 'Learn CI/CD, Docker, Kubernetes and cloud infrastructure',
      category: 'devops',
      duration: '8 months',
      level: 'Advanced',
      popularity: 78,
      isNew: false,
      image: 'https://cdn-icons-png.flaticon.com/512/6125/6125000.png',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform']
    },
    {
      id: '4',
      title: 'Mobile Developer (React Native)',
      description: 'Build cross-platform mobile apps with React Native',
      category: 'mobile',
      duration: '4 months',
      level: 'Intermediate',
      popularity: 72,
      isNew: false,
      image: 'https://cdn-icons-png.flaticon.com/512/1183/1183672.png',
      skills: ['React Native', 'JavaScript', 'Redux', 'Mobile UI', 'APIs']
    },
    {
      id: '5',
      title: 'Data Scientist',
      description: 'Master Python, ML algorithms and data analysis',
      category: 'data',
      duration: '9 months',
      level: 'Advanced',
      popularity: 88,
      isNew: true,
      image: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
      skills: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'Data Visualization']
    },
    {
      id: '6',
      title: 'Cybersecurity Specialist',
      description: 'Learn ethical hacking and system security',
      category: 'cybersecurity',
      duration: '7 months',
      level: 'Advanced',
      popularity: 65,
      isNew: false,
      image: 'https://cdn-icons-png.flaticon.com/512/2489/2489717.png',
      skills: ['Network Security', 'Penetration Testing', 'Cryptography', 'Firewalls']
    },
    {
      id: '7',
      title: 'Blockchain Developer',
      description: 'Build decentralized applications with Ethereum and Solidity',
      category: 'blockchain',
      duration: '6 months',
      level: 'Intermediate',
      popularity: 70,
      isNew: true,
      image: 'https://cdn-icons-png.flaticon.com/512/2593/2593798.png',
      skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js']
    },
    {
      id: '8',
      title: 'Full Stack Developer',
      description: 'Complete path for full stack development with MERN stack',
      category: 'frontend',
      duration: '10 months',
      level: 'Intermediate',
      popularity: 92,
      isNew: false,
      image: 'https://cdn-icons-png.flaticon.com/512/2282/2282188.png',
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Authentication']
    }
  ];

  const filteredRoadmaps = roadmaps
    .filter(roadmap => 
      (activeCategory === 'all' || roadmap.category === activeCategory) &&
      (roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       roadmap.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => b.popularity - a.popularity);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Developer Roadmaps</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Structured learning paths to guide you through mastering various tech domains and becoming a proficient developer.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to={isAuthenticated ? "/my-roadmaps" : "/login"}
              className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              {isAuthenticated ? 'My Learning Paths' : 'Get Started'}
            </Link>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition duration-300">
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm capitalize ${activeCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {category === 'all' ? 'All Roadmaps' : category}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Search roadmaps..."
                className="w-full md:w-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Roadmaps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRoadmaps.map(roadmap => (
              <div key={roadmap.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div className="relative">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <img 
                      src={roadmap.image} 
                      alt={roadmap.title} 
                      className="h-24 w-24 object-contain"
                    />
                  </div>
                  {roadmap.isNew && (
                    <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{roadmap.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(roadmap.level)}`}>
                      {roadmap.level}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{roadmap.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-4">⏱️ {roadmap.duration}</span>
                    <span>⭐ {roadmap.popularity}% recommended</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {roadmap.skills.slice(0, 4).map(skill => (
                      <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                    {roadmap.skills.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        +{roadmap.skills.length - 4} more
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/roadmaps/${roadmap.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
                  >
                    View Roadmap
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredRoadmaps.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No roadmaps found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="text-blue-600 hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Developers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "These roadmaps helped me transition from mechanical engineering to frontend development in just 6 months!",
                author: "Priya K., Frontend Developer",
                role: "Former Mechanical Engineer"
              },
              {
                quote: "The structured learning path made it easy to know exactly what to learn next without feeling overwhelmed.",
                author: "Rahul M., Backend Developer",
                role: "Computer Science Student"
              },
              {
                quote: "I doubled my salary after completing the DevOps roadmap and getting certified in AWS and Kubernetes.",
                author: "Ananya S., DevOps Engineer",
                role: "Former System Administrator"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
                <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start your developer journey?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to={isAuthenticated ? "/my-roadmaps" : "/signup"}
              className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              {isAuthenticated ? 'Continue Learning' : 'Sign Up for Free'}
            </Link>
            <Link 
              to="/community" 
              className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition duration-300"
            >
              Join Developer Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Roadmaps;