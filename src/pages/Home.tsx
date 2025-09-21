import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaStar, FaSearch, FaRobot, FaTrophy, FaCertificate,
  FaCode, FaRoad, FaPlay, FaTerminal, FaCog, FaChevronRight
} from 'react-icons/fa';
import { SiGooglescholar, SiTypescript, SiJavascript } from 'react-icons/si';

type Feature = {
  icon: React.ReactElement;
  title: string;
  description: string;
  gradient: string;
};

type Testimonial = {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatarColor: string;
};

type Roadmap = {
  title: string;
  description: string;
  level: string;
  duration: string;
  courses: number;
};

type Challenge = {
  title: string;
  difficulty: string;
  tags: string[];
  completed: number;
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [activeTab, setActiveTab] = useState<string>('roadmaps');
  const [activeFile, setActiveFile] = useState<string>('game.ts');
  const [codeOutput, setCodeOutput] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3D canvas effect (updated with color and more code snippets)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const codeElements: Array<{
      x: number;
      y: number;
      z: number;
      text: string;
      speed: number;
      size: number;
      color: string;
    }> = [];

    const codeSnippets = [
      "function", "const", "return", "if", "else", "for", "while", 
      "class", "import", "export", "div", "span", "component", 
      "useState", "useEffect", "interface", "type", "string", "number",
      "boolean", "void", "=>", "{", "}", "(", ")", "[", "]", "<", ">"
    ];

    const colors = [
      "rgba(100, 200, 255, 0.8)", 
      "rgba(150, 220, 255, 0.7)", 
      "rgba(200, 230, 255, 0.6)",
      "rgba(120, 180, 255, 0.7)"
    ];

    for (let i = 0; i < 50; i++) {
      codeElements.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        speed: 0.5 + Math.random() * 2,
        size: 10 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(100, 100, 200, 0.1)';
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      codeElements.forEach((element) => {
        element.z -= element.speed;
        if (element.z < 0) {
          element.z = 1000;
          element.x = Math.random() * canvas.width;
          element.y = Math.random() * canvas.height;
        }
        const scale = 1000 / (1000 + element.z);
        const x = (element.x - canvas.width / 2) * scale + canvas.width / 2;
        const y = (element.y - canvas.height / 2) * scale + canvas.height / 2;
        ctx.font = `${element.size * scale}px 'Fira Code', monospace`;
        ctx.fillStyle = element.color;
        ctx.fillText(element.text, x, y);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Simulate code compilation
  const compileCode = () => {
    setIsCompiling(true);
    setCodeOutput([]);
    setTimeout(() => {
      setCodeOutput(prev => [...prev, "> tsc game.ts --watch"]);
    }, 500);
    setTimeout(() => {
      setCodeOutput(prev => [...prev, "Compilation started..."]);
    }, 1000);
    setTimeout(() => {
      setCodeOutput(prev => [...prev, "Checking types..."]);
    }, 1500);
    setTimeout(() => {
      setCodeOutput(prev => [...prev, "No issues found."]);
      setCodeOutput(prev => [...prev, "Compilation completed successfully."]);
      setIsCompiling(false);
    }, 2500);
  };

  // Editor files and content
  const editorFiles = [
    { name: 'game.ts', icon: <SiTypescript className="text-blue-500" /> },
    { name: 'player.ts', icon: <SiTypescript className="text-blue-500" /> },
    { name: 'utils.js', icon: <SiJavascript className="text-yellow-500" /> },
  ];

  const fileContents = {
    'game.ts': `import { Player } from './player';
import { updatePlayerVelocity } from './utils';

export class Game {
  private player: Player;
  private cursors: any;
  
  constructor() {
    this.player = new Player();
    this.cursors = {
      left: { isDown: false },
      right: { isDown: false },
      up: { isDown: false },
      down: { isDown: false }
    };
  }
  
  update() {
    // Update player velocity based on input
    updatePlayerVelocity(this.player, this.cursors);
    
    // Additional game logic here
    this.player.update();
  }
}`,
    'player.ts': `export class Player {
  private x: number = 0;
  private y: number = 0;
  private velocityX: number = 0;
  private velocityY: number = 0;
  
  setVelocityX(velocity: number) {
    this.velocityX = velocity;
  }
  
  setVelocityY(velocity: number) {
    this.velocityY = velocity;
  }
  
  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
  
  getPosition() {
    return { x: this.x, y: this.y };
  }
}`,
    'utils.js': `export function updatePlayerVelocity(player, cursors) {
  // Horizontal movement
  if (cursors.left.isDown) {
    player.setVelocityX(-200);
  } else if (cursors.right.isDown) {
    player.setVelocityX(200);
  } else {
    player.setVelocityX(0);
  }
  
  // Vertical movement
  if (cursors.up.isDown) {
    player.setVelocityY(-200);
  } else if (cursors.down.isDown) {
    player.setVelocityY(200);
  } else {
    player.setVelocityY(0);
  }
}`
  };

  const features: Feature[] = [
    {
      icon: <FaRoad className="w-6 h-6 text-white" />,
      title: "AI-Powered Roadmaps",
      description: "Personalized learning paths tailored to your goals and skill level",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaCode className="w-6 h-6 text-white" />,
      title: "DSA Challenges",
      description: "AI-generated data structure and algorithm problems with instant feedback",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaCertificate className="w-6 h-6 text-white" />,
      title: "Skill Certification",
      description: "Earn verified certificates recognized by industry leaders",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <FaTrophy className="w-6 h-6 text-white" />,
      title: "Hackathons & Competitions",
      description: "Regular coding competitions with real-world problems",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: <SiGooglescholar className="w-6 h-6 text-white" />,
      title: "Learning Resources",
      description: "Curated content from top universities and industry experts",
      gradient: "from-red-500 to-rose-500"
    },
    {
      icon: <FaRobot className="w-6 h-6 text-white" />,
      title: "AI Mentor",
      description: "24/7 AI assistant to answer questions and provide guidance",
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Alex Johnson",
      role: "Software Engineer, Google",
      text: "The AI challenges helped me land my dream job by improving my problem-solving skills significantly.",
      rating: 5,
      avatarColor: "bg-blue-600"
    },
    {
      name: "Maria Rodriguez",
      role: "Computer Science Student",
      text: "The personalized roadmaps made learning complex topics manageable and efficient.",
      rating: 5,
      avatarColor: "bg-purple-600"
    },
    {
      name: "James Chen",
      role: "Frontend Developer",
      text: "The certificates helped me showcase my skills and advance my career faster than I expected.",
      rating: 4,
      avatarColor: "bg-amber-600"
    }
  ];

  const roadmaps: Roadmap[] = [
    {
      title: "Full Stack Web Development",
      description: "Master frontend and backend technologies",
      level: "Intermediate",
      duration: "6 months",
      courses: 12
    },
    {
      title: "Machine Learning Engineer",
      description: "Learn to build and deploy ML models",
      level: "Advanced",
      duration: "9 months",
      courses: 15
    },
    {
      title: "Data Structures & Algorithms",
      description: "Master problem-solving techniques",
      level: "Beginner to Advanced",
      duration: "4 months",
      courses: 8
    }
  ];

  const challenges: Challenge[] = [
    {
      title: "Optimize Binary Tree Traversal",
      difficulty: "Hard",
      tags: ["Trees", "Optimization", "Algorithms"],
      completed: 1245
    },
    {
      title: "Implement Custom Hash Map",
      difficulty: "Medium",
      tags: ["Data Structures", "Hashing"],
      completed: 3567
    },
    {
      title: "Neural Network from Scratch",
      difficulty: "Advanced",
      tags: ["Machine Learning", "Python", "AI"],
      completed: 897
    }
  ];

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setChatMessages(prev => [...prev, { text: chatMessage, isUser: true }]);
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        text: "I can help you with learning resources, code explanations, or roadmap guidance. What specific topic are you working on?",
        isUser: false
      }]);
    }, 1000);

    setChatMessage('');
  };

  const featureLinks: Record<string, string> = {
    "AI-Powered Roadmaps": "/ai-learning-roadmap",
    "DSA Challenges": "/dsa-challenges",
    "Skill Certification": "/certificate-verification",
    "Hackathons & Competitions": "/events-hackathons",
    "Learning Resources": "/resources",
    "AI Mentor": "/ai-mentor"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with 3D Coding UI */}
      <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white pt-32 pb-24 overflow-hidden">
        {/* 3D Canvas Background */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full opacity-30"
        />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-cyan-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-800/30 border border-blue-500/30 text-sm mb-6 backdrop-blur-sm">
                <FaRobot className="mr-2 text-cyan-400" />
                AI-Powered Learning Platform
              </div>
              <h1 className="text-5xl font-bold mb-6 leading-tight text-white">
                Advance Your Tech Career <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  With AI Guidance
                </span>
              </h1>
              <p className="text-xl mb-8 max-w-2xl text-gray-200">
                Master in-demand skills through personalized roadmaps, AI-generated challenges, and industry-recognized certifications.
              </p>
              <div className="max-w-xl relative mb-8">
                <div className="flex items-center bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/40">
                  <FaSearch className="ml-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses, roadmaps, or challenges..."
                    className="w-full p-4 bg-transparent text-white placeholder-gray-400 rounded-lg focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/roadmaps" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center"
                >
                  Explore Roadmaps <FaChevronRight className="ml-2" />
                </Link>
                <Link 
                  to="/dsa-challenges" 
                  className="bg-transparent border-2 border-gray-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center"
                >
                  Try AI-generated DSA Challenges: <FaChevronRight className="ml-2" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                {/* 3D Coding Interface Visualization */}
                <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden transform perspective-1000 rotate-x-5 rotate-y-5 hover:rotate-x-0 hover:rotate-y-0 transition-transform duration-700 border-2 border-cyan-500/30">
                  {/* Editor Header */}
                  <div className="p-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex space-x-2">
                      {editorFiles.map((file) => (
                        <button
                          key={file.name}
                          onClick={() => setActiveFile(file.name)}
                          className={`px-3 py-1 rounded-t-md text-xs flex items-center space-x-1 ${
                            activeFile === file.name 
                              ? 'bg-gray-900 text-cyan-400 border-t border-cyan-500' 
                              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          }`}
                        >
                          {file.icon}
                          <span>{file.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={compileCode}
                        disabled={isCompiling}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-xs flex items-center disabled:opacity-50"
                      >
                        <FaPlay className="mr-1" size={10} /> Run
                      </button>
                      <button className="text-gray-400 hover:text-gray-200">
                        <FaCog />
                      </button>
                    </div>
                  </div>
                  {/* Code Editor */}
                  <div className="font-mono text-sm bg-gray-900 h-80 overflow-auto">
                    <div className="flex">
                      {/* Line numbers */}
                      <div className="text-gray-500 text-right pr-3 pl-3 py-2 select-none border-r border-gray-700">
                        {fileContents[activeFile as keyof typeof fileContents].split('\n').map((_, i) => (
                          <div key={i} className="leading-6">{i + 1}</div>
                        ))}
                      </div>
                      {/* Code content */}
                      <div className="pl-3 py-2 flex-1">
                        {fileContents[activeFile as keyof typeof fileContents].split('\n').map((line, i) => (
                          <div key={i} className="leading-6 whitespace-pre">
                            {line.includes('//') ? (
                              <>
                                <span className="text-gray-300">{line.split('//')[0]}</span>
                                <span className="text-green-500">//{line.split('//')[1]}</span>
                              </>
                            ) : line.includes('import') || line.includes('from') ? (
                              <span className="text-cyan-400">{line}</span>
                            ) : line.includes('class') || line.includes('function') ? (
                              <span className="text-purple-400">{line}</span>
                            ) : line.includes('if') || line.includes('else') ? (
                              <span className="text-purple-300">{line}</span>
                            ) : line.includes('return') ? (
                              <span className="text-red-400">{line}</span>
                            ) : line.includes('const') || line.includes('let') || line.includes('private') ? (
                              <span className="text-blue-400">{line}</span>
                            ) : line.includes('{') || line.includes('}') ? (
                              <span className="text-yellow-400">{line}</span>
                            ) : (
                              <span className="text-gray-300">{line}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Output Terminal */}
                  <div className="border-t border-gray-700">
                    <div className="flex items-center px-4 py-2 bg-gray-800 text-gray-400 text-xs">
                      <FaTerminal className="mr-2" />
                      OUTPUT
                    </div>
                    <div className="p-3 bg-black text-green-400 font-mono text-xs h-24 overflow-auto">
                      {codeOutput.length > 0 ? (
                        codeOutput.map((line, i) => (
                          <div key={i} className="whitespace-pre">{line}</div>
                        ))
                      ) : (
                        <div className="text-gray-500">// Code output will appear here after compilation</div>
                      )}
                      {isCompiling && (
                        <div className="inline-block animate-pulse">▋</div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Floating code elements for 3D effect */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-500/30 animate-float flex items-center justify-center">
                  <div className="text-blue-300 text-xs text-center">Player.ts</div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-purple-500/20 rounded-lg backdrop-blur-sm border border-purple-500/30 animate-float animation-delay-2000 flex items-center justify-center">
                  <div className="text-purple-300 text-xs text-center">Game.ts</div>
                </div>
                <div className="absolute top-1/2 -right-6 w-16 h-16 bg-cyan-500/20 rounded-lg backdrop-blur-sm border border-cyan-500/30 animate-float animation-delay-3000 flex items-center justify-center">
                  <div className="text-cyan-300 text-xs text-center">Utils.js</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="text-4xl font-bold text-gray-900 mb-2">50K+</div>
            <div className="text-gray-600">Active Learners</div>
            <div className="mt-2 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="text-4xl font-bold text-gray-900 mb-2">120+</div>
            <div className="text-gray-600">Learning Paths</div>
            <div className="mt-2 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="text-4xl font-bold text-gray-900 mb-2">10K+</div>
            <div className="text-gray-600">AI Challenges</div>
            <div className="mt-2 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
            <div className="text-gray-600">Certification Rate</div>
            <div className="mt-2 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">AI-Powered Learning Experience</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform uses advanced AI to create personalized learning journeys for developers and students
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const card = (
              <div
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-transparent hover:border-gray-700 group cursor-pointer"
              >
                <div className={`flex justify-center mb-6 w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} items-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-800 group-hover:text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            );

            // Make every card a Link
            return (
              <Link key={index} to={featureLinks[feature.title] || "/"} className="block">
                {card}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Roadmaps & Challenges Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Learning Paths & Challenges</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore curated roadmaps and test your skills with AI-generated challenges
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`px-6 py-4 text-lg font-medium ${activeTab === 'roadmaps' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('roadmaps')}
              >
                Learning Roadmaps
              </button>
              <button
                className={`px-6 py-4 text-lg font-medium ${activeTab === 'challenges' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('challenges')}
              >
                AI Challenges
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'roadmaps' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roadmaps.map((roadmap, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {roadmap.level}
                      </span>
                      <span className="text-sm text-gray-500">{roadmap.duration}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{roadmap.title}</h3>
                    <p className="text-gray-600 mb-4">{roadmap.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{roadmap.courses} courses</span>
                      <Link to="/roadmaps" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        Explore →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {challenges.map((challenge, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        challenge.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">{challenge.completed} solved</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{challenge.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {challenge.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors duration-300">
                      Solve Challenge
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Success Stories</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from developers and students who've accelerated their careers with our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'} w-5 h-5`}
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic relative pl-4 border-l-4 border-gray-200">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <div className={`${testimonial.avatarColor} text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4 shadow-md`}>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-cyan-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Your AI-Powered Learning Journey Today</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
            Join thousands of developers and students accelerating their careers with our platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started for Free
            </Link>
            <Link
              to="/challenges"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try Sample Challenges
            </Link>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${chatbotOpen ? 'w-80 h-96' : 'w-16 h-16'}`}>
        {chatbotOpen ? (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full border border-gray-200">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center">
                <FaRobot className="w-5 h-5 mr-2" />
                <span className="font-semibold">AI Learning Assistant</span>
              </div>
              <button
                onClick={() => setChatbotOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="mb-4 flex">
                <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                  <p className="text-gray-800">Hi there! I'm your AI learning assistant. How can I help you today?</p>
                </div>
              </div>

              {chatMessages.map((msg, index) => (
                <div key={index} className={`mb-4 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg p-3 max-w-xs ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-blue-100 text-gray-800'}`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-200">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setChatbotOpen(true)}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 animate-bounce"
          >
            <FaRobot className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;