// src/App.tsx
import React, { useState, useEffect } from 'react';

// Types
type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  skills: string[];
  role: 'developer' | 'student' | 'mentor';
  githubUsername?: string;
  rating?: number;
  availability?: boolean;
};

type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  skillsNeeded: string[];
  owner: User;
  members: User[];
  isPublic: boolean;
  githubRepo?: string;
  demoUrl?: string;
  createdAt: Date;
};

type MentorSession = {
  id: string;
  mentor: User;
  mentee: User;
  date: Date;
  duration: number;
  notes: string;
  rating?: number;
};

type Community = {
  id: string;
  name: string;
  description: string;
  members: User[];
  isPublic: boolean;
  topics: string[];
  events: Event[];
};

type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: User;
  attendees: User[];
};


const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'projects' | 'showcase' | 'mentorship' | 'community'>('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [githubUsername, setGithubUsername] = useState('');
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mentorFilter, setMentorFilter] = useState<'all' | 'available'>('all');
  const [communityFilter, setCommunityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  
  // Form states
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: [] as string[],
    skillsNeeded: [] as string[],
    isPublic: true,
    githubRepo: '',
    demoUrl: ''
  });
  
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    description: '',
    isPublic: true,
    topics: [] as string[],
  });
  
  const [newTech, setNewTech] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newTopic, setNewTopic] = useState('');

  // Initialize with empty data
  useEffect(() => {
    // In a real app, you would fetch this from your backend
    setUsers([]);
    setProjects([]);
    setCommunities([]);
    setSessions([]);
    
    // For demo purposes, initialize with empty current user
    setCurrentUser({
      id: 'current-user',
      name: '',
      email: '',
      avatar: 'https://i.pravatar.cc/150?img=0',
      skills: [],
      role: 'developer',
    });
  }, []);

  // Filter projects based on search and filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTechStack = selectedTechStack.length === 0 ||
      selectedTechStack.some(tech => project.techStack.includes(tech));
    
    const matchesSkills = selectedSkills.length === 0 ||
      selectedSkills.some(skill => project.skillsNeeded.includes(skill));
    
    return matchesSearch && matchesTechStack && matchesSkills;
  });

  // Filter mentors based on availability
  const filteredMentors = users.filter(user => {
    if (user.role !== 'mentor') return false;
    if (mentorFilter === 'available' && !user.availability) return false;
    return true;
  });

  // Filter communities
  const filteredCommunities = communities.filter(community => {
    if (communityFilter === 'public') return community.isPublic;
    if (communityFilter === 'private') return !community.isPublic;
    return true;
  });

  // Available tech stacks and skills for filters
  const allTechStacks = Array.from(new Set(projects.flatMap(p => p.techStack)));
  const allSkills = Array.from(new Set(projects.flatMap(p => p.skillsNeeded)));

  // Fetch GitHub repos
  const fetchGithubRepos = async () => {
    if (!githubUsername) return;
    
    setIsLoadingRepos(true);
    try {
      // In a real app, you would call the GitHub API here
      // const response = await axios.get(`https://api.github.com/users/${githubUsername}/repos`);
      // setGithubRepos(response.data);
      
      // Mock response - in a real app, remove this and uncomment above
      setTimeout(() => {
        setGithubRepos([]); // Start with empty array
        setIsLoadingRepos(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      setIsLoadingRepos(false);
    }
  };

  // Create new project
  const handleCreateProject = () => {
    if (!currentUser) return;
    
    const project: Project = {
      id: `project-${Date.now()}`,
      title: newProject.title,
      description: newProject.description,
      techStack: newProject.techStack,
      skillsNeeded: newProject.skillsNeeded,
      owner: currentUser,
      members: [currentUser],
      isPublic: newProject.isPublic,
      githubRepo: newProject.githubRepo,
      demoUrl: newProject.demoUrl,
      createdAt: new Date(),
    };
    
    setProjects([...projects, project]);
    setShowProjectModal(false);
    resetProjectForm();
  };

  // Create new community
  const handleCreateCommunity = () => {
    if (!currentUser) return;
    
    const community: Community = {
      id: `community-${Date.now()}`,
      name: newCommunity.name,
      description: newCommunity.description,
      members: [currentUser],
      isPublic: newCommunity.isPublic,
      topics: newCommunity.topics,
      events: [],
    };
    
    setCommunities([...communities, community]);
    setShowCommunityModal(false);
    resetCommunityForm();
  };

  // Become a mentor
  const handleBecomeMentor = () => {
    if (!currentUser) return;
    
    const updatedUser: User = {
      ...currentUser,
      role: 'mentor',
      availability: true,
      rating: 0,
    };
    
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setShowMentorModal(false);
  };

  // Reset forms
  const resetProjectForm = () => {
    setNewProject({
      title: '',
      description: '',
      techStack: [],
      skillsNeeded: [],
      isPublic: true,
      githubRepo: '',
      demoUrl: ''
    });
  };

  const resetCommunityForm = () => {
    setNewCommunity({
      name: '',
      description: '',
      isPublic: true,
      topics: [],
    });
  };

  // Add tech/skill/topic to forms
  const addTech = () => {
    if (newTech && !newProject.techStack.includes(newTech)) {
      setNewProject({
        ...newProject,
        techStack: [...newProject.techStack, newTech]
      });
      setNewTech('');
    }
  };

  const addSkill = () => {
    if (newSkill && !newProject.skillsNeeded.includes(newSkill)) {
      setNewProject({
        ...newProject,
        skillsNeeded: [...newProject.skillsNeeded, newSkill]
      });
      setNewSkill('');
    }
  };

  const addTopic = () => {
    if (newTopic && !newCommunity.topics.includes(newTopic)) {
      setNewCommunity({
        ...newCommunity,
        topics: [...newCommunity.topics, newTopic]
      });
      setNewTopic('');
    }
  };

  // Remove items from forms
  const removeTech = (tech: string) => {
    setNewProject({
      ...newProject,
      techStack: newProject.techStack.filter(t => t !== tech)
    });
  };

  const removeSkill = (skill: string) => {
    setNewProject({
      ...newProject,
      skillsNeeded: newProject.skillsNeeded.filter(s => s !== skill)
    });
  };

  const removeTopic = (topic: string) => {
    setNewCommunity({
      ...newCommunity,
      topics: newCommunity.topics.filter(t => t !== topic)
    });
  };

  if (!currentUser) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center h-16 items-center">
            {/* Navigation Tabs Only */}
            <div className="flex space-x-2 md:space-x-6">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'projects'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab('showcase')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'showcase'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                Showcase
              </button>
              <button
                onClick={() => setActiveTab('mentorship')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'mentorship'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                Mentorship
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'community'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                Community
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              className="form-input block w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Project Collaboration Hub</h2>
              <button 
                onClick={() => setShowProjectModal(true)}
                className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Project
              </button>
            </div>

            {/* Filters */}
            {allTechStacks.length > 0 || allSkills.length > 0 ? (
              <div className="mb-6 p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium mb-3">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allTechStacks.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                      <div className="flex flex-wrap gap-2">
                        {allTechStacks.map((tech) => (
                          <button
                            key={tech}
                            onClick={() => {
                              if (selectedTechStack.includes(tech)) {
                                setSelectedTechStack(selectedTechStack.filter(t => t !== tech));
                              } else {
                                setSelectedTechStack([...selectedTechStack, tech]);
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-xs ${selectedTechStack.includes(tech) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {allSkills.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills Needed</label>
                      <div className="flex flex-wrap gap-2">
                        {allSkills.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => {
                              if (selectedSkills.includes(skill)) {
                                setSelectedSkills(selectedSkills.filter(s => s !== skill));
                              } else {
                                setSelectedSkills([...selectedSkills, skill]);
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-xs ${selectedSkills.includes(skill) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Project List */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">{project.description}</p>
                      {project.techStack.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold">Tech Stack:</h4>
                          <div className="flex flex-wrap mt-1">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded mr-1 mb-1"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {project.skillsNeeded.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold">Skills Needed:</h4>
                          <div className="flex flex-wrap mt-1">
                            {project.skillsNeeded.map((skill) => (
                              <span
                                key={skill}
                                className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded mr-1 mb-1"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-4 flex space-x-2">
                        {project.githubRepo && (
                          <a
                            href={project.githubRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm bg-gray-800 text-white px-3 py-1 rounded flex items-center"
                          >
                            <i className="fab fa-github mr-2"></i> GitHub
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <button className="text-sm bg-purple-600 text-white px-3 py-1 rounded">
                        Join Project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
                <p className="mt-2 text-gray-600">
                  {projects.length === 0 ? 
                    "Be the first to create a project!" : 
                    "Try adjusting your search or filters"}
                </p>
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="mt-4 btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Project
                </button>
              </div>
            )}
          </div>
        )}

        {/* Showcase Tab */}
        {activeTab === 'showcase' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Developer Showcase</h2>
            
            {/* GitHub Integration */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Import Your GitHub Projects</h3>
              <div className="flex">
                <input
                  type="text"
                  className="form-input flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="GitHub username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                />
                <button
                  onClick={fetchGithubRepos}
                  disabled={isLoadingRepos}
                  className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoadingRepos ? 'Loading...' : 'Import'}
                </button>
              </div>
              
              {githubRepos.length > 0 ? (
                <div className="mt-6">
                  <h4 className="text-md font-medium mb-3">Your Repositories</h4>
                  <div className="space-y-4">
                    {githubRepos.map((repo) => (
                      <div key={repo.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{repo.name}</h5>
                            <p className="text-sm text-gray-600">{repo.description}</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                              {repo.language}
                            </span>
                            <span className="text-xs flex items-center">
                              <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {repo.stargazers_count}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm bg-gray-800 text-white px-3 py-1 rounded flex items-center"
                          >
                            <i className="fab fa-github mr-2"></i> View on GitHub
                          </a>
                          <button className="text-sm bg-green-600 text-white px-3 py-1 rounded">
                            Add to Portfolio
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : isLoadingRepos ? (
                <div className="mt-6 text-center py-4">
                  <p>Loading repositories...</p>
                </div>
              ) : (
                <div className="mt-6 text-center py-4">
                  <p>No repositories found. Enter your GitHub username to import projects.</p>
                </div>
              )}
            </div>

            {/* Featured Projects */}
            <div>
              <h3 className="text-lg font-medium mb-4">Featured Projects</h3>
              {projects.filter(p => p.demoUrl).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.filter(p => p.demoUrl).map((project) => (
                    <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-4">
                        <h4 className="font-bold">{project.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        {project.techStack.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {project.techStack.slice(0, 3).map(tech => (
                              <span key={tech} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {project.demoUrl && (
                        <div className="bg-gray-100 p-1">
                          <iframe
                            src={project.demoUrl}
                            className="w-full h-48"
                            title={`Demo of ${project.title}`}
                            sandbox="allow-scripts allow-same-origin"
                          ></iframe>
                        </div>
                      )}
                      <div className="p-4 border-t border-gray-200">
                        <button className="text-sm bg-purple-600 text-white px-3 py-1 rounded">
                          Fork Project
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-gray-600">No featured projects with demos yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mentorship Tab */}
        {activeTab === 'mentorship' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mentorship Network</h2>
              {currentUser.role !== 'mentor' ? (
                <button 
                  onClick={() => setShowMentorModal(true)}
                  className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Become a Mentor
                </button>
              ) : (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  You're a mentor
                </span>
              )}
            </div>

            {/* Mentor Filter */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Filter by:</span>
                <button
                  onClick={() => setMentorFilter('all')}
                  className={`px-3 py-1 rounded-md text-sm ${mentorFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  All Mentors
                </button>
                <button
                  onClick={() => setMentorFilter('available')}
                  className={`px-3 py-1 rounded-md text-sm ${mentorFilter === 'available' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  Available Now
                </button>
              </div>
            </div>

            {/* Mentors List */}
            {filteredMentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredMentors.map((mentor) => (
                  <div key={mentor.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h3 className="font-bold">{mentor.name}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 text-sm text-gray-700">
                              {mentor.rating?.toFixed(1) || 'New'} 
                              ({Math.floor(Math.random() * 100) + 1} sessions)
                            </span>
                          </div>
                          {mentor.skills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {mentor.skills.slice(0, 3).map(skill => (
                                <span key={skill} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded">
                          View Profile
                        </button>
                        <button className="text-sm bg-green-600 text-white px-3 py-1 rounded">
                          Request Session
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow mb-8">
                <h3 className="text-lg font-medium text-gray-900">No mentors found</h3>
                <p className="mt-2 text-gray-600">
                  {users.filter(u => u.role === 'mentor').length === 0 ?
                    "Be the first to become a mentor!" : 
                    "Try adjusting your filters"}
                </p>
                {currentUser.role !== 'mentor' && (
                  <button
                    onClick={() => setShowMentorModal(true)}
                    className="mt-4 btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Become a Mentor
                  </button>
                )}
              </div>
            )}

            {/* Your Sessions */}
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Mentorship Sessions</h3>
            {sessions.filter(s => s.mentee.id === currentUser.id || s.mentor.id === currentUser.id).length > 0 ? (
              <div className="space-y-4">
                {sessions.filter(s => s.mentee.id === currentUser.id || s.mentor.id === currentUser.id).map((session) => (
                  <div key={session.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">
                            Session with {session.mentor.id === currentUser.id ? session.mentee.name : session.mentor.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {session.date.toLocaleDateString()} • {session.duration} mins
                          </p>
                        </div>
                        {session.rating && (
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 text-gray-700">{session.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-gray-700">{session.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-600">No mentorship sessions yet.</p>
              </div>
            )}

            {/* Q&A Forum */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Q&A Forum</h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h4 className="font-medium">Ask your first question</h4>
                  <p className="text-sm text-gray-600 mt-1">The community will help you find answers</p>
                </div>
                <div className="p-4">
                  <textarea
                    className="form-textarea block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={3}
                    placeholder="Type your question here..."
                  ></textarea>
                  <button className="mt-2 btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Post Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Community Builder</h2>
              <button 
                onClick={() => setShowCommunityModal(true)}
                className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Community
              </button>
            </div>

            {/* Community Filter */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Filter by:</span>
                <button
                  onClick={() => setCommunityFilter('all')}
                  className={`px-3 py-1 rounded-md text-sm ${communityFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  All Communities
                </button>
                <button
                  onClick={() => setCommunityFilter('public')}
                  className={`px-3 py-1 rounded-md text-sm ${communityFilter === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  Public
                </button>
                <button
                  onClick={() => setCommunityFilter('private')}
                  className={`px-3 py-1 rounded-md text-sm ${communityFilter === 'private' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  Private
                </button>
              </div>
            </div>

            {/* Communities List */}
            {filteredCommunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredCommunities.map((community) => (
                  <div key={community.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4">
                      <h3 className="text-xl font-bold">{community.name}</h3>
                      <p className="text-gray-600 mt-2">{community.description}</p>
                      {community.topics.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold">Topics:</h4>
                          <div className="flex flex-wrap mt-1">
                            {community.topics.map((topic) => (
                              <span
                                key={topic}
                                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-1 mb-1"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-4">
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {community.members.length} member{community.members.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <button className="text-sm bg-purple-600 text-white px-3 py-1 rounded">
                        Join Community
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No communities found</h3>
                <p className="mt-2 text-gray-600">
                  {communities.length === 0 ? 
                    "Be the first to create a community!" : 
                    "Try adjusting your filters"}
                </p>
                <button
                  onClick={() => setShowCommunityModal(true)}
                  className="mt-4 btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Community
                </button>
              </div>
            )}

            {/* Events Calendar */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h3>
              {communities.flatMap(c => c.events).length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  {communities.flatMap(c => c.events).map((event, i) => (
                    <div key={i} className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{event.title}</h4>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {event.date.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {event.attendees.slice(0, 3).map(user => (
                            <img
                              key={user.id}
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full border-2 border-white"
                            />
                          ))}
                          {event.attendees.length > 3 && (
                            <span className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                              +{event.attendees.length - 3}
                            </span>
                          )}
                        </div>
                        <button className="text-sm bg-green-600 text-white px-3 py-1 rounded">
                          Register
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-gray-600">No upcoming events yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Project Creation Modal */}
      {showProjectModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Project</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="project-title" className="block text-sm font-medium text-gray-700">Project Title</label>
                      <input
                        type="text"
                        id="project-title"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newProject.title}
                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label htmlFor="project-description" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        id="project-description"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="project-tech" className="block text-sm font-medium text-gray-700">Tech Stack</label>
                      <div className="mt-1 flex">
                        <input
                          type="text"
                          id="project-tech"
                          className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newTech}
                          onChange={(e) => setNewTech(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addTech()}
                          placeholder="Add a technology"
                        />
                        <button
                          onClick={addTech}
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          Add
                        </button>
                      </div>
                      {newProject.techStack.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {newProject.techStack.map(tech => (
                            <span key={tech} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {tech}
                              <button
                                type="button"
                                className="ml-1.5 inline-flex text-blue-500 hover:text-blue-700 focus:outline-none"
                                onClick={() => removeTech(tech)}
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="project-skills" className="block text-sm font-medium text-gray-700">Skills Needed</label>
                      <div className="mt-1 flex">
                        <input
                          type="text"
                          id="project-skills"
                          className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                          placeholder="Add a skill"
                        />
                        <button
                          onClick={addSkill}
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          Add
                        </button>
                      </div>
                      {newProject.skillsNeeded.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {newProject.skillsNeeded.map(skill => (
                            <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {skill}
                              <button
                                type="button"
                                className="ml-1.5 inline-flex text-green-500 hover:text-green-700 focus:outline-none"
                                onClick={() => removeSkill(skill)}
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="project-github" className="block text-sm font-medium text-gray-700">GitHub Repository URL (optional)</label>
                      <input
                        type="text"
                        id="project-github"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newProject.githubRepo}
                        onChange={(e) => setNewProject({...newProject, githubRepo: e.target.value})}
                      />
                    </div>
                    <div>
                      <label htmlFor="project-demo" className="block text-sm font-medium text-gray-700">Demo URL (optional)</label>
                      <input
                        type="text"
                        id="project-demo"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newProject.demoUrl}
                        onChange={(e) => setNewProject({...newProject, demoUrl: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        id="project-public"
                        name="project-public"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={newProject.isPublic}
                        onChange={(e) => setNewProject({...newProject, isPublic: e.target.checked})}
                      />
                      <label htmlFor="project-public" className="ml-2 block text-sm text-gray-700">
                        Make this project public
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCreateProject}
                >
                  Create Project
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowProjectModal(false);
                    resetProjectForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Creation Modal */}
      {showCommunityModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Community</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="community-name" className="block text-sm font-medium text-gray-700">Community Name</label>
                      <input
                        type="text"
                        id="community-name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newCommunity.name}
                        onChange={(e) => setNewCommunity({...newCommunity, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label htmlFor="community-description" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        id="community-description"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newCommunity.description}
                        onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="community-topics" className="block text-sm font-medium text-gray-700">Topics</label>
                      <div className="mt-1 flex">
                        <input
                          type="text"
                          id="community-topics"
                          className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                          placeholder="Add a topic"
                        />
                        <button
                          onClick={addTopic}
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          Add
                        </button>
                      </div>
                      {newCommunity.topics.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {newCommunity.topics.map(topic => (
                            <span key={topic} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {topic}
                              <button
                                type="button"
                                className="ml-1.5 inline-flex text-green-500 hover:text-green-700 focus:outline-none"
                                onClick={() => removeTopic(topic)}
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <input
                        id="community-public"
                        name="community-public"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={newCommunity.isPublic}
                        onChange={(e) => setNewCommunity({...newCommunity, isPublic: e.target.checked})}
                      />
                      <label htmlFor="community-public" className="ml-2 block text-sm text-gray-700">
                        Make this community public
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCreateCommunity}
                >
                  Create Community
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowCommunityModal(false);
                    resetCommunityForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Become Mentor Modal */}
      {showMentorModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Become a Mentor</h3>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      As a mentor, you'll be able to help other developers and students by sharing your knowledge and experience.
                      You'll appear in the mentorship directory and can set your availability for 1:1 sessions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleBecomeMentor}
                >
                  Become Mentor
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowMentorModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;