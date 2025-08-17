import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Import icons (you can use react-icons or custom SVGs)
import { FaCode, FaLaptopCode, FaProjectDiagram, FaBook, FaVideo, FaSearch, FaRocket, FaUsers, FaStar, FaRegClock } from 'react-icons/fa';
import { SiJavascript, SiPython, SiReact, SiNodedotjs, SiDocker, SiKubernetes, SiPostgresql, SiHiveBlockchain } from 'react-icons/si';

type Roadmap = {
  id: string;
  title: string;
  type: 'role' | 'skill' | 'project' | 'guide' | 'video';
  category?: string;
  duration?: string;
  isNew?: boolean;
  format?: 'textual' | 'questions';
  length?: string;
  icon?: React.ReactNode;
};

const Roadmaps = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'role' | 'skill' | 'project' | 'guide' | 'video'>('role');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Icon mapping function
  const getIconForRoadmap = (title: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Frontend': <FaLaptopCode className="text-blue-500" size={24} />,
      'Backend': <FaCode className="text-green-500" size={24} />,
      'DevOps': <SiDocker className="text-purple-500" size={24} />,
      'Full Stack': <FaCode className="text-yellow-500" size={24} />,
      'AI Engineer': <FaRocket className="text-pink-500" size={24} />,
      'Data Analyst': <FaBook className="text-red-500" size={24} />,
      'Blockchain': <SiHiveBlockchain className="text-indigo-500" size={24} />,
      'Cyber Security': <FaUsers className="text-cyan-500" size={24} />,
      'React': <SiReact className="text-blue-400" size={24} />,
      'JavaScript': <SiJavascript className="text-yellow-400" size={24} />,
      'Python': <SiPython className="text-blue-600" size={24} />,
      'Node.js': <SiNodedotjs className="text-green-600" size={24} />,
      'Docker': <SiDocker className="text-blue-400" size={24} />,
      'Kubernetes': <SiKubernetes className="text-blue-600" size={24} />,
      'PostgreSQL': <SiPostgresql className="text-blue-700" size={24} />,
    };

    return iconMap[title] || <FaStar className="text-gray-500" size={24} />;
  };

  // Roadmap data with icons
  const roleBasedRoadmaps: Roadmap[] = [
    { id: 'frontend', title: 'Frontend', type: 'role', icon: getIconForRoadmap('Frontend') },
    { id: '2', title: 'Backend', type: 'role', icon: getIconForRoadmap('Backend') },
    { id: '3', title: 'DevOps', type: 'role', icon: getIconForRoadmap('DevOps') },
    { id: '4', title: 'Full Stack', type: 'role', icon: getIconForRoadmap('Full Stack') },
    { id: '5', title: 'AI Engineer', type: 'role', isNew: true, icon: getIconForRoadmap('AI Engineer') },
    { id: '6', title: 'Data Analyst', type: 'role', icon: getIconForRoadmap('Data Analyst') },
    { id: '7', title: 'AI and Data Scientist', type: 'role', icon: getIconForRoadmap('AI Engineer') },
    { id: '8', title: 'Android', type: 'role', icon: getIconForRoadmap('Android') },
    { id: '9', title: 'iOS', type: 'role', icon: getIconForRoadmap('iOS') },
    { id: '10', title: 'PostgreSQL', type: 'role', icon: getIconForRoadmap('PostgreSQL') },
    { id: '11', title: 'Blockchain', type: 'role', icon: getIconForRoadmap('Blockchain') },
    { id: '12', title: 'QA', type: 'role', icon: getIconForRoadmap('QA') },
    { id: '13', title: 'Software Architect', type: 'role', icon: getIconForRoadmap('Software Architect') },
    { id: '14', title: 'Cyber Security', type: 'role', icon: getIconForRoadmap('Cyber Security') },
    { id: '15', title: 'UX Design', type: 'role', icon: getIconForRoadmap('UX Design') },
    { id: '16', title: 'Game Developer', type: 'role', icon: getIconForRoadmap('Game Developer') },
    { id: '17', title: 'Technical Writer', type: 'role', icon: getIconForRoadmap('Technical Writer') },
    { id: '18', title: 'MLOps', type: 'role', icon: getIconForRoadmap('MLOps') },
    { id: '19', title: 'Product Manager', type: 'role', icon: getIconForRoadmap('Product Manager') },
    { id: '20', title: 'Engineering Manager', type: 'role', icon: getIconForRoadmap('Engineering Manager') },
    { id: '21', title: 'Developer Relations', type: 'role', icon: getIconForRoadmap('Developer Relations') },
    { id: '22', title: 'Create your own Roadmap', type: 'role', icon: <FaRocket className="text-indigo-500" size={24} /> }
  ];

  const skillBasedRoadmaps: Roadmap[] = [
    { id: 's1', title: 'SQL', type: 'skill', icon: getIconForRoadmap('SQL') },
    { id: 's2', title: 'Computer Science', type: 'skill', icon: getIconForRoadmap('Computer Science') },
    { id: 's3', title: 'React', type: 'skill', icon: getIconForRoadmap('React') },
    { id: 's4', title: 'Vue', type: 'skill', icon: getIconForRoadmap('Vue') },
    { id: 's5', title: 'Angular', type: 'skill', icon: getIconForRoadmap('Angular') },
    { id: 's6', title: 'JavaScript', type: 'skill', icon: getIconForRoadmap('JavaScript') },
    { id: 's7', title: 'Node.js', type: 'skill', icon: getIconForRoadmap('Node.js') },
    { id: 's8', title: 'TypeScript', type: 'skill', icon: getIconForRoadmap('TypeScript') },
    { id: 's9', title: 'Python', type: 'skill', icon: getIconForRoadmap('Python') },
    { id: 's10', title: 'System Design', type: 'skill', icon: getIconForRoadmap('System Design') },
    { id: 's11', title: 'API Design', type: 'skill', icon: getIconForRoadmap('API Design') },
    { id: 's12', title: 'ASP.NET Core', type: 'skill', icon: getIconForRoadmap('ASP.NET Core') },
    { id: 's13', title: 'Java', type: 'skill', icon: getIconForRoadmap('Java') },
    { id: 's14', title: 'C++', type: 'skill', icon: getIconForRoadmap('C++') },
    { id: 's15', title: 'Flutter', type: 'skill', icon: getIconForRoadmap('Flutter') },
    { id: 's16', title: 'Spring Boot', type: 'skill', icon: getIconForRoadmap('Spring Boot') },
    { id: 's17', title: 'Go Roadmap', type: 'skill', icon: getIconForRoadmap('Go Roadmap') },
    { id: 's18', title: 'Rust', type: 'skill', icon: getIconForRoadmap('Rust') },
    { id: 's19', title: 'GraphQL', type: 'skill', icon: getIconForRoadmap('GraphQL') },
    { id: 's20', title: 'Design and Architecture', type: 'skill', icon: getIconForRoadmap('Design and Architecture') },
    { id: 's21', title: 'Design System', type: 'skill', icon: getIconForRoadmap('Design System') },
    { id: 's22', title: 'React Native', type: 'skill', icon: getIconForRoadmap('React Native') },
    { id: 's23', title: 'AWS', type: 'skill', icon: getIconForRoadmap('AWS') },
    { id: 's24', title: 'Code Review', type: 'skill', icon: getIconForRoadmap('Code Review') },
    { id: 's25', title: 'Docker', type: 'skill', icon: getIconForRoadmap('Docker') },
    { id: 's26', title: 'Kubernetes', type: 'skill', icon: getIconForRoadmap('Kubernetes') },
    { id: 's27', title: 'Linux', type: 'skill', icon: getIconForRoadmap('Linux') },
    { id: 's28', title: 'MongoDB', type: 'skill', icon: getIconForRoadmap('MongoDB') },
    { id: 's29', title: 'Prompt Engineering', type: 'skill', icon: getIconForRoadmap('Prompt Engineering') },
    { id: 's30', title: 'Terraform', type: 'skill', icon: getIconForRoadmap('Terraform') },
    { id: 's31', title: 'Data Structures & Algorithms', type: 'skill', icon: getIconForRoadmap('Data Structures & Algorithms') },
    { id: 's32', title: 'Git and GitHub', type: 'skill', icon: getIconForRoadmap('Git and GitHub') },
    { id: 's33', title: 'Redis', type: 'skill', icon: getIconForRoadmap('Redis') },
    { id: 's34', title: 'PHP', type: 'skill', icon: getIconForRoadmap('PHP') },
    { id: 's35', title: 'Cloudflare', type: 'skill', isNew: true, icon: getIconForRoadmap('Cloudflare') },
    { id: 's36', title: 'AI Agents', type: 'skill', isNew: true, icon: getIconForRoadmap('AI Agents') },
    { id: 's37', title: 'AI Red Teaming', type: 'skill', isNew: true, icon: getIconForRoadmap('AI Red Teaming') },
    { id: 's38', title: 'Create your own Roadmap', type: 'skill', icon: <FaRocket className="text-indigo-500" size={24} /> }
  ];

  // Guides and Questions arrays
  const guides: Roadmap[] = [
    { id: 'g1', title: 'How to Learn React', type: 'guide', format: 'textual', icon: <FaBook className="text-blue-500" size={24} /> },
    { id: 'g2', title: 'Backend Best Practices', type: 'guide', format: 'textual', icon: <FaBook className="text-green-500" size={24} /> },
    { id: 'g3', title: 'DevOps for Beginners', type: 'guide', format: 'textual', icon: <FaBook className="text-purple-500" size={24} /> }
  ];

  const questions: Roadmap[] = [
    { id: 'q1', title: 'React Interview Questions', type: 'guide', format: 'questions', icon: <FaBook className="text-blue-400" size={24} /> },
    { id: 'q2', title: 'Node.js Interview Questions', type: 'guide', format: 'questions', icon: <FaBook className="text-green-400" size={24} /> }
  ];

  // Add a sample projectIdeas array
  const projectIdeas: Roadmap[] = [
    { id: 'p1', title: 'Portfolio Website', type: 'project', icon: <FaProjectDiagram className="text-blue-500" size={24} /> },
    { id: 'p2', title: 'E-commerce App', type: 'project', icon: <FaProjectDiagram className="text-green-500" size={24} /> },
    { id: 'p3', title: 'Chat Application', type: 'project', icon: <FaProjectDiagram className="text-purple-500" size={24} /> },
    { id: 'p4', title: 'Blog Platform', type: 'project', icon: <FaProjectDiagram className="text-yellow-500" size={24} /> },
    { id: 'p5', title: 'Create your own Project', type: 'project', icon: <FaRocket className="text-indigo-500" size={24} /> }
  ];

  // Sample videos array
  const videos: Roadmap[] = [
    { id: 'v1', title: 'React Crash Course', type: 'video', length: '1h 30m', icon: <FaVideo className="text-blue-500" size={24} /> },
    { id: 'v2', title: 'Node.js Tutorial', type: 'video', length: '2h 10m', icon: <FaVideo className="text-green-500" size={24} /> },
    { id: 'v3', title: 'DevOps Basics', type: 'video', length: '45m', icon: <FaVideo className="text-purple-500" size={24} /> },
    { id: 'v4', title: 'Design Patterns', type: 'video', length: '1h 5m', icon: <FaVideo className="text-yellow-500" size={24} /> }
  ];

  const getCurrentRoadmaps = () => {
    switch (activeTab) {
      case 'role': return roleBasedRoadmaps;
      case 'skill': return skillBasedRoadmaps;
      case 'project': return projectIdeas;
      case 'guide': return [...guides, ...questions];
      case 'video': return videos;
      default: return roleBasedRoadmaps;
    }
  };

  const filteredRoadmaps = getCurrentRoadmaps().filter(roadmap =>
    roadmap.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white pt-32 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">Developer Roadmaps</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto animate-fade-in delay-100">
            roadmap.sh is a community effort to create roadmaps, guides and other educational content to help guide developers in picking up a path and guide their learnings.
          </p>
          <div className="flex justify-center gap-4 animate-fade-in delay-200">
            <Link 
              to={isAuthenticated ? "/my-roadmaps" : "/signup"}
              className="bg-white text-gray-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              {isAuthenticated ? 'My Roadmaps' : 'Get Started'}
            </Link>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition duration-300 transform hover:scale-105">
              Contribute
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-10">
        {/* Floating Card */}
        <div className="bg-gray-900 rounded-xl shadow-xl p-6 mb-8 max-w-4xl mx-auto text-white">
          {/* Tabs */}
          <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {[
              { id: 'role', title: 'Role-based', icon: <FaCode className="mr-2" /> },
              { id: 'skill', title: 'Skill-based', icon: <FaLaptopCode className="mr-2" /> },
              { id: 'project', title: 'Projects', icon: <FaProjectDiagram className="mr-2" /> },
              { id: 'guide', title: 'Guides', icon: <FaBook className="mr-2" /> },
              { id: 'video', title: 'Videos', icon: <FaVideo className="mr-2" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-3 whitespace-nowrap font-medium text-sm rounded-lg mr-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                {tab.title}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${activeTab.replace('-', ' ')}...`}
              className="w-full pl-10 p-4 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-900 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRoadmaps.map(roadmap => (
            <div 
              key={roadmap.id} 
              className={`bg-gray-900 rounded-xl shadow-md overflow-hidden transition-all duration-300 border border-gray-800 hover:border-gray-600 hover:shadow-lg transform hover:-translate-y-1 ${hoveredCard === roadmap.id ? 'ring-2 ring-gray-500' : ''}`}
              onMouseEnter={() => setHoveredCard(roadmap.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-gray-800 mr-4">
                    {roadmap.icon || getIconForRoadmap(roadmap.title)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{roadmap.title}</h3>
                    {roadmap.isNew && (
                      <span className="bg-green-900 text-green-200 text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
                
                {roadmap.format === 'textual' && (
                  <span className="inline-block bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded-full mb-3">
                    Guide
                  </span>
                )}
                
                {roadmap.format === 'questions' && (
                  <span className="inline-block bg-purple-900 text-purple-200 text-xs px-2 py-1 rounded-full mb-3">
                    Interview Questions
                  </span>
                )}
                
                {roadmap.type === 'video' && (
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <FaRegClock className="mr-1" />
                    <span>{roadmap.length}</span>
                  </div>
                )}
                
                <Link
                  to={`/roadmaps/${roadmap.type}/${roadmap.id.toLowerCase()}`}
                  className="mt-4 inline-flex items-center justify-center w-full text-center bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white py-2 px-4 rounded-lg transition duration-300 text-sm hover:bg-gray-800"
                >
                  {roadmap.type === 'video' ? 'Watch Video' : 'View Details'}
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRoadmaps.length === 0 && (
          <div className="text-center py-16 bg-gray-900 rounded-xl shadow-sm">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-white">No {activeTab.replace('-', ' ')} found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search query</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-white hover:underline font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* View All Buttons */}
        {filteredRoadmaps.length > 0 && (
          <div className="mt-12 text-center">
            <Link 
              to={`/${activeTab}`} 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-br from-gray-900 to-gray-800 hover:bg-gray-800 transition duration-300"
            >
              View All {activeTab === 'role' ? 'Role-based' : activeTab === 'skill' ? 'Skill-based' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Roadmaps
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to accelerate your learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have leveled up their skills with our roadmaps.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to={isAuthenticated ? "/my-roadmaps" : "/signup"}
              className="bg-white text-gray-900 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              {isAuthenticated ? 'Continue Learning' : 'Start for Free'}
            </Link>
            <Link 
              to="/community"
              className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition duration-300 transform hover:scale-105"
            >
              Join Our Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Roadmaps;