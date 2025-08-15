import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiBook, 
  FiAward, 
  FiClock, 
  FiCheckCircle, 
  FiChevronRight, 
  FiSearch,
  FiCompass,
  FiBookOpen,
  FiUser,
  FiStar,
  FiDownload,
  FiShare2,
  FiVideo,
  FiFileText,
  FiCode,
  FiLayers,
  FiZap,
  FiGitBranch
} from 'react-icons/fi';

// ========== TYPES ==========
interface Framework {
  id: string;
  name: string;
  logo: string;
  description: string;
  popularity: number;
  releaseYear: number;
  stars: number;
  lastUpdated: string;
  categories: Category[];
  learningPath: LearningPathStep[];
  officialResources: OfficialResource[];
  type: 'library' | 'framework' | 'metaframework' | 'compiler';
  language: 'JavaScript' | 'TypeScript';
  runtime: 'client' | 'server' | 'universal';
}

interface LearningPathStep {
  id: string;
  title: string;
  description: string;
  order: number;
  resources: Resource[];
  estimatedDuration: string;
}

interface OfficialResource {
  id: string;
  title: string;
  type: 'documentation' | 'tutorial' | 'video' | 'community' | 'examples' | 'playground' | 'article';
  url: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  modules: Module[];
  completionCertificate: boolean;
  estimatedDuration: string;
  badge?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  lessons: Lesson[];
  prerequisites: string[];
  resources: Resource[];
  learningObjectives: string[];
  project?: boolean;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'article' | 'interactive' | 'quiz' | 'exercise' | 'project';
  contentUrl?: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'documentation' | 'cheatsheet' | 'github' | 'article' | 'video' | 'course' | 'sandbox' | 'interactive' | 'playground';
  url: string;
  free?: boolean;
}

interface UserProgress {
  completedModules: string[];
  completedLessons: string[];
  certificates: string[];
  lastAccessed: {
    frameworkId: string | null;
    categoryId: string | null;
    moduleId: string | null;
  };
  bookmarks: string[];
  notes: { [key: string]: string };
}

interface Certificate {
  id: string;
  frameworkId: string;
  categoryId: string;
  dateEarned: string;
  verificationUrl: string;
  name: string;
}

// ========== MOCK DATA ==========
const frameworks: Framework[] = [
  {
    id: 'react',
    name: 'React',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/react.svg',
    description: 'A JavaScript library for building user interfaces with component-based architecture',
    popularity: 92,
    releaseYear: 2013,
    stars: 197000,
    lastUpdated: '2023-06-15',
    type: 'library',
    language: 'JavaScript',
    runtime: 'client',
    learningPath: [
      {
        id: 'react-1',
        title: 'JavaScript Fundamentals',
        description: 'Learn the core JavaScript concepts needed for React',
        order: 1,
        estimatedDuration: '2 weeks',
        resources: [
          {
            id: 'js-fundamentals-mdn',
            title: 'MDN JavaScript Guide',
            type: 'documentation',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'
          },
          {
            id: 'js-es6-course',
            title: 'Modern JavaScript Course',
            type: 'course',
            url: 'https://example.com/js-course',
            free: true
          }
        ]
      },
      {
        id: 'react-2',
        title: 'React Basics',
        description: 'Learn React components, JSX, and state management',
        order: 2,
        estimatedDuration: '3 weeks',
        resources: [
          {
            id: 'react-official-tutorial',
            title: 'Official React Tutorial',
            type: 'documentation',
            url: 'https://reactjs.org/tutorial/tutorial.html',
            free: true
          },
          {
            id: 'react-playground',
            title: 'React Interactive Playground',
            type: 'playground',
            url: 'https://react.new',
            free: true
          }
        ]
      },
      {
        id: 'react-3',
        title: 'Advanced Patterns',
        description: 'Learn advanced React patterns and performance optimization',
        order: 3,
        estimatedDuration: '4 weeks',
        resources: [
          {
            id: 'react-advanced-patterns',
            title: 'Advanced React Patterns',
            type: 'article',
            url: 'https://example.com/advanced-react'
          },
          {
            id: 'react-performance',
            title: 'React Performance Masterclass',
            type: 'course',
            url: 'https://example.com/react-performance'
          }
        ]
      },
      {
        id: 'react-4',
        title: 'Ecosystem Integration',
        description: 'Learn to integrate React with popular libraries and tools',
        order: 4,
        estimatedDuration: '3 weeks',
        resources: [
          {
            id: 'react-router',
            title: 'React Router Documentation',
            type: 'documentation',
            url: 'https://reactrouter.com/'
          },
          {
            id: 'react-query',
            title: 'React Query Guide',
            type: 'documentation',
            url: 'https://tanstack.com/query/latest'
          }
        ]
      }
    ],
    officialResources: [
      {
        id: 'react-docs',
        title: 'Official Documentation',
        type: 'documentation',
        url: 'https://reactjs.org/docs/getting-started.html',
        description: 'Comprehensive guide to all React features and APIs'
      },
      {
        id: 'react-blog',
        title: 'React Blog',
        type: 'article',
        url: 'https://reactjs.org/blog',
        description: 'Latest updates and announcements from the React team'
      },
      {
        id: 'react-community',
        title: 'React Community',
        type: 'community',
        url: 'https://reactjs.org/community/support.html',
        description: 'Connect with other React developers worldwide'
      },
      {
        id: 'react-examples',
        title: 'React Examples',
        type: 'examples',
        url: 'https://reactjs.org/examples',
        description: 'Collection of practical React examples'
      },
      {
        id: 'react-playground',
        title: 'React Playground',
        type: 'playground',
        url: 'https://react.new',
        description: 'Instant React development environment in your browser'
      }
    ],
    categories: [
      {
        id: 'react-fundamentals',
        name: 'React Fundamentals',
        description: 'Master the core concepts of React including components, state, and props',
        completionCertificate: true,
        estimatedDuration: '8 hours',
        badge: 'Essential',
        modules: [
          {
            id: 'react-jsx',
            title: 'JSX and Rendering',
            description: 'Learn how React uses JSX to render UI components efficiently',
            duration: '45 min',
            difficulty: 'Beginner',
            completed: false,
            learningObjectives: [
              'Understand JSX syntax and its benefits',
              'Render elements to the DOM',
              'Use expressions in JSX'
            ],
            prerequisites: [],
            resources: [
              {
                id: 'react-docs-jsx',
                title: 'React JSX Documentation',
                type: 'documentation',
                url: 'https://reactjs.org/docs/introducing-jsx.html'
              },
              {
                id: 'jsx-interactive',
                title: 'JSX Interactive Tutorial',
                type: 'interactive',
                url: 'https://example.com/jsx-tutorial',
                free: true
              }
            ],
            lessons: [
              { 
                id: 'jsx-1', 
                title: 'Introduction to JSX', 
                duration: '10 min', 
                completed: false, 
                type: 'video',
                contentUrl: '/lessons/react/jsx-intro.mp4'
              },
              { 
                id: 'jsx-2', 
                title: 'Rendering Elements', 
                duration: '15 min', 
                completed: false, 
                type: 'interactive',
                contentUrl: '/lessons/react/jsx-rendering'
              },
              { 
                id: 'jsx-3', 
                title: 'JSX vs HTML', 
                duration: '20 min', 
                completed: false, 
                type: 'article',
                contentUrl: '/lessons/react/jsx-vs-html'
              },
            ],
          },
          {
            id: 'react-components',
            title: 'Components and Props',
            description: 'Understand how to create and compose React components',
            duration: '1 hour',
            difficulty: 'Beginner',
            completed: false,
            learningObjectives: [
              'Create functional and class components',
              'Understand props and how to use them',
              'Compose components together'
            ],
            prerequisites: ['react-jsx'],
            resources: [
              {
                id: 'components-cheatsheet',
                title: 'React Components Cheatsheet',
                type: 'cheatsheet',
                url: 'https://example.com/react-components-cheatsheet',
                free: true
              }
            ],
            lessons: [
              { 
                id: 'comp-1', 
                title: 'Function Components', 
                duration: '15 min', 
                completed: false, 
                type: 'video',
                contentUrl: '/lessons/react/function-components.mp4'
              },
              { 
                id: 'comp-2', 
                title: 'Class Components', 
                duration: '20 min', 
                completed: false, 
                type: 'video',
                contentUrl: '/lessons/react/class-components.mp4'
              },
              { 
                id: 'comp-3', 
                title: 'Props and Data Flow', 
                duration: '25 min', 
                completed: false, 
                type: 'interactive',
                contentUrl: '/lessons/react/props-data-flow'
              },
            ],
          },
          {
            id: 'react-state',
            title: 'State and Lifecycle',
            description: 'Master component state and lifecycle methods',
            duration: '1.5 hours',
            difficulty: 'Beginner',
            completed: false,
            learningObjectives: [
              'Understand component state',
              'Use lifecycle methods',
              'Manage side effects'
            ],
            prerequisites: ['react-components'],
            resources: [],
            lessons: [
              { 
                id: 'state-1', 
                title: 'Understanding State', 
                duration: '20 min', 
                completed: false, 
                type: 'video'
              },
              { 
                id: 'state-2', 
                title: 'Lifecycle Methods', 
                duration: '30 min', 
                completed: false, 
                type: 'interactive'
              },
              { 
                id: 'state-3', 
                title: 'State Management Patterns', 
                duration: '40 min', 
                completed: false, 
                type: 'article'
              },
            ],
          }
        ],
      },
      {
        id: 'react-hooks',
        name: 'React Hooks',
        description: 'Master the modern React hooks API for state and effects',
        completionCertificate: true,
        estimatedDuration: '6 hours',
        badge: 'Popular',
        modules: [
          {
            id: 'hooks-intro',
            title: 'Introduction to Hooks',
            description: 'Learn the basics of React hooks',
            duration: '1 hour',
            difficulty: 'Intermediate',
            completed: false,
            learningObjectives: [
              'Understand useState and useEffect hooks',
              'Create custom hooks',
              'Use context with hooks'
            ],
            prerequisites: ['react-fundamentals'],
            resources: [],
            lessons: [],
          },
          {
            id: 'advanced-hooks',
            title: 'Advanced Hooks Patterns',
            description: 'Dive deeper into hooks with advanced patterns',
            duration: '2 hours',
            difficulty: 'Intermediate',
            completed: false,
            learningObjectives: [
              'Use useReducer for complex state',
              'Optimize performance with useMemo/useCallback',
              'Create reusable hook libraries'
            ],
            prerequisites: ['hooks-intro'],
            resources: [],
            lessons: [],
          }
        ],
      },
      {
        id: 'react-performance',
        name: 'Performance Optimization',
        description: 'Learn techniques to make your React apps blazing fast',
        completionCertificate: true,
        estimatedDuration: '5 hours',
        modules: [
          {
            id: 'react-memo',
            title: 'Memoization Techniques',
            description: 'Use memoization to prevent unnecessary re-renders',
            duration: '1.5 hours',
            difficulty: 'Advanced',
            completed: false,
            learningObjectives: [
              'Understand React.memo',
              'Use useMemo and useCallback effectively',
              'Profile React performance'
            ],
            prerequisites: ['react-hooks'],
            resources: [],
            lessons: [],
          }
        ],
      },
      {
        id: 'react-projects',
        name: 'Real-world Projects',
        description: 'Build complete applications with React',
        completionCertificate: true,
        estimatedDuration: '20 hours',
        badge: 'Projects',
        modules: [
          {
            id: 'react-todo',
            title: 'Todo Application',
            description: 'Build a full-featured todo app with React',
            duration: '3 hours',
            difficulty: 'Intermediate',
            completed: false,
            project: true,
            learningObjectives: [
              'Build a complete React application',
              'Implement CRUD operations',
              'Manage application state'
            ],
            prerequisites: ['react-fundamentals'],
            resources: [],
            lessons: [],
          }
        ],
      }
    ],
  },
  {
    id: 'angular',
    name: 'Angular',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/angular.svg',
    description: 'A platform for building mobile and desktop web applications with TypeScript',
    popularity: 68,
    releaseYear: 2016,
    stars: 85000,
    lastUpdated: '2023-05-20',
    type: 'framework',
    language: 'TypeScript',
    runtime: 'universal',
    learningPath: [
      {
        id: 'angular-1',
        title: 'TypeScript Fundamentals',
        description: 'Learn TypeScript which is essential for Angular development',
        order: 1,
        estimatedDuration: '2 weeks',
        resources: [
          {
            id: 'typescript-docs',
            title: 'TypeScript Documentation',
            type: 'documentation',
            url: 'https://www.typescriptlang.org/docs/',
            free: true
          }
        ]
      },
      {
        id: 'angular-2',
        title: 'Angular Basics',
        description: 'Learn components, directives, and dependency injection',
        order: 2,
        estimatedDuration: '3 weeks',
        resources: [
          {
            id: 'angular-tour',
            title: 'Angular Tour of Heroes',
            type: 'course',
            url: 'https://angular.io/tutorial',
            free: true
          }
        ]
      }
    ],
    officialResources: [
      {
        id: 'angular-docs',
        title: 'Angular Documentation',
        type: 'documentation',
        url: 'https://angular.io/docs',
        description: 'Comprehensive Angular documentation'
      },
      {
        id: 'angular-university',
        title: 'Angular University',
        type: 'tutorial',
        url: 'https://angular-university.io',
        description: 'Free and paid Angular courses'
      }
    ],
    categories: [
      {
        id: 'angular-fundamentals',
        name: 'Angular Fundamentals',
        description: 'Learn the core concepts of Angular framework',
        completionCertificate: true,
        estimatedDuration: '10 hours',
        modules: [
          {
            id: 'angular-components',
            title: 'Components and Templates',
            description: 'Learn Angular component architecture',
            duration: '2 hours',
            difficulty: 'Beginner',
            completed: false,
            learningObjectives: [
              'Create Angular components',
              'Understand template syntax',
              'Use component communication'
            ],
            prerequisites: [],
            resources: [],
            lessons: []
          }
        ]
      }
    ]
  },
  {
    id: 'vue',
    name: 'Vue.js',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/vuedotjs.svg',
    description: 'The progressive JavaScript framework for building user interfaces',
    popularity: 85,
    releaseYear: 2014,
    stars: 202000,
    lastUpdated: '2023-07-01',
    type: 'framework',
    language: 'JavaScript',
    runtime: 'client',
    learningPath: [
      {
        id: 'vue-1',
        title: 'Vue Basics',
        description: 'Learn Vue fundamentals and reactivity system',
        order: 1,
        estimatedDuration: '2 weeks',
        resources: [
          {
            id: 'vue-guide',
            title: 'Vue Guide',
            type: 'documentation',
            url: 'https://vuejs.org/guide/introduction.html',
            free: true
          }
        ]
      }
    ],
    officialResources: [
      {
        id: 'vue-docs',
        title: 'Vue Documentation',
        type: 'documentation',
        url: 'https://vuejs.org/',
        description: 'Official Vue.js documentation'
      }
    ],
    categories: [
      {
        id: 'vue-fundamentals',
        name: 'Vue Fundamentals',
        description: 'Learn the core concepts of Vue.js',
        completionCertificate: true,
        estimatedDuration: '8 hours',
        modules: [
          {
            id: 'vue-components',
            title: 'Components and Directives',
            description: 'Learn Vue component system',
            duration: '1.5 hours',
            difficulty: 'Beginner',
            completed: false,
            learningObjectives: [
              'Create Vue components',
              'Use built-in directives',
              'Understand component lifecycle'
            ],
            prerequisites: [],
            resources: [],
            lessons: []
          }
        ]
      }
    ]
  },
  {
    id: 'svelte',
    name: 'Svelte',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/svelte.svg',
    description: 'Cybernetically enhanced web apps - a compiler that generates highly optimized JavaScript',
    popularity: 75,
    releaseYear: 2016,
    stars: 68000,
    lastUpdated: '2023-06-30',
    type: 'compiler',
    language: 'JavaScript',
    runtime: 'client',
    learningPath: [],
    officialResources: [],
    categories: []
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/nextdotjs.svg',
    description: 'The React framework for production - SSR, SSG, and more',
    popularity: 88,
    releaseYear: 2016,
    stars: 105000,
    lastUpdated: '2023-07-15',
    type: 'metaframework',
    language: 'JavaScript',
    runtime: 'universal',
    learningPath: [],
    officialResources: [],
    categories: []
  },
  {
    id: 'nuxtjs',
    name: 'Nuxt.js',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/nuxtdotjs.svg',
    description: 'The Vue framework for production - SSR, SSG, and more',
    popularity: 72,
    releaseYear: 2016,
    stars: 45000,
    lastUpdated: '2023-07-10',
    type: 'metaframework',
    language: 'JavaScript',
    runtime: 'universal',
    learningPath: [],
    officialResources: [],
    categories: []
  },
  {
    id: 'solidjs',
    name: 'SolidJS',
    logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/solid.svg',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces',
    popularity: 65,
    releaseYear: 2018,
    stars: 27000,
    lastUpdated: '2023-07-05',
    type: 'library',
    language: 'JavaScript',
    runtime: 'client',
    learningPath: [],
    officialResources: [],
    categories: []
  },
  {
    id: 'qwik',
    name: 'Qwik',
    logo: 'https://raw.githubusercontent.com/BuilderIO/qwik/main/packages/docs/public/icons/qwik-logo.svg',
    description: 'The HTML-first framework with instant-on interactivity',
    popularity: 55,
    releaseYear: 2022,
    stars: 18000,
    lastUpdated: '2023-07-12',
    type: 'framework',
    language: 'TypeScript',
    runtime: 'client',
    learningPath: [],
    officialResources: [],
    categories: []
  }
];

// ========== MAIN COMPONENT ==========
const FrontendLearningPortal: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedModules: [],
    completedLessons: [],
    certificates: [],
    lastAccessed: {
      frameworkId: null,
      categoryId: null,
      moduleId: null,
    },
    bookmarks: [],
    notes: {}
  });
  const [activeTab, setActiveTab] = useState<'modules' | 'resources' | 'learningPath' | 'official'>('modules');
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateToView, setCertificateToView] = useState<Certificate | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: '', content: '' });
  
  const navigate = useNavigate();

  // Load user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('frontendLearningProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('frontendLearningProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Set last accessed framework/category/module
  useEffect(() => {
    if (selectedFramework && !selectedCategory) {
      updateLastAccessed(selectedFramework, null, null);
    } else if (selectedFramework && selectedCategory) {
      updateLastAccessed(selectedFramework, selectedCategory, null);
    }
  }, [selectedFramework, selectedCategory]);

  const updateLastAccessed = (frameworkId: string | null, categoryId: string | null, moduleId: string | null) => {
    setUserProgress(prev => ({
      ...prev,
      lastAccessed: { frameworkId, categoryId, moduleId },
    }));
  };

  const handleFrameworkSelect = (frameworkId: string) => {
    setSelectedFramework(frameworkId);
    setSelectedCategory(null);
    setActiveTab('modules');
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab('modules');
  };

  const handleModuleStart = (frameworkId: string, moduleId: string) => {
    updateLastAccessed(frameworkId, selectedCategory, moduleId);
    navigate(`/learn/${frameworkId}/${moduleId}`);
  };

  const toggleModuleCompletion = (moduleId: string) => {
    setUserProgress(prev => {
      const isCompleted = prev.completedModules.includes(moduleId);
      return {
        ...prev,
        completedModules: isCompleted
          ? prev.completedModules.filter(id => id !== moduleId)
          : [...prev.completedModules, moduleId],
      };
    });
  };

  const toggleBookmark = (moduleId: string) => {
    setUserProgress(prev => {
      const isBookmarked = prev.bookmarks.includes(moduleId);
      return {
        ...prev,
        bookmarks: isBookmarked
          ? prev.bookmarks.filter(id => id !== moduleId)
          : [...prev.bookmarks, moduleId],
      };
    });
  };

  const generateCertificate = (frameworkId: string, categoryId: string) => {
    const certificateId = `cert-${frameworkId}-${categoryId}-${Date.now()}`;
    const framework = frameworks.find(f => f.id === frameworkId);
    const category = framework?.categories.find(c => c.id === categoryId);
    
    const newCertificate: Certificate = {
      id: certificateId,
      frameworkId,
      categoryId,
      dateEarned: new Date().toISOString(),
      verificationUrl: `/verify/${certificateId}`,
      name: `${framework?.name} ${category?.name} Certificate`
    };
    
    setUserProgress(prev => ({
      ...prev,
      certificates: [...prev.certificates, certificateId],
    }));
    
    return newCertificate;
  };

  const viewCertificate = (frameworkId: string, categoryId: string) => {
    const certificateId = userProgress.certificates.find(certId => certId.includes(categoryId));
    if (!certificateId) return;
    
    const framework = frameworks.find(f => f.id === frameworkId);
    const category = framework?.categories.find(c => c.id === categoryId);
    
    const certificate: Certificate = {
      id: certificateId,
      frameworkId,
      categoryId,
      dateEarned: new Date().toISOString(),
      verificationUrl: `/verify/${certificateId}`,
      name: `${framework?.name} ${category?.name} Certificate`
    };
    
    setCertificateToView(certificate);
    setShowCertificateModal(true);
  };

  const openNoteModal = (moduleId: string) => {
    setCurrentNote({
      id: moduleId,
      content: userProgress.notes[moduleId] || ''
    });
    setShowNoteModal(true);
  };

  const saveNote = () => {
    setUserProgress(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [currentNote.id]: currentNote.content
      }
    }));
    setShowNoteModal(false);
  };

  const selectedFrameworkData = frameworks.find(f => f.id === selectedFramework);
  const selectedCategoryData = selectedFrameworkData?.categories.find(c => c.id === selectedCategory);

  // Filter frameworks based on search query
  const filteredFrameworks = frameworks.filter(framework =>
    framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    framework.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate completion percentage for a module
  const calculateModuleCompletion = (module: Module) => {
    if (module.lessons.length === 0) return 0;
    const completed = module.lessons.filter(lesson => 
      userProgress.completedLessons.includes(lesson.id)
    ).length;
    return Math.round((completed / module.lessons.length) * 100);
  };

  // Calculate completion percentage for a category
  const calculateCategoryCompletion = (category: Category) => {
    const totalModules = category.modules.length;
    if (totalModules === 0) return 0;
    const completed = category.modules.filter(module => 
      userProgress.completedModules.includes(module.id)
    ).length;
    return Math.round((completed / totalModules) * 100);
  };

  // Check if a category is eligible for certificate
  const isCategoryEligibleForCertificate = (category: Category) => {
    if (!category.completionCertificate) return false;
    return category.modules.every(module => 
      userProgress.completedModules.includes(module.id)
    );
  };

  // Check if user has certificate for a category
  const hasCertificate = (categoryId: string) => {
    return userProgress.certificates.some(certId => certId.includes(categoryId));
  };

  // Format duration to minutes
  const durationToMinutes = (duration: string) => {
    const hoursMatch = duration.match(/(\d+) hour/);
    const minsMatch = duration.match(/(\d+) min/);
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const mins = minsMatch ? parseInt(minsMatch[1]) : 0;
    return hours * 60 + mins;
  };

  // Calculate total duration for a category
  const calculateCategoryDuration = (category: Category) => {
    return category.modules.reduce((total, module) => 
      total + durationToMinutes(module.duration), 0);
  };

  // Get framework type icon
  const getFrameworkTypeIcon = (type: string) => {
    switch (type) {
      case 'library': return <FiCode className="mr-1" />;
      case 'framework': return <FiLayers className="mr-1" />;
      case 'metaframework': return <FiGitBranch className="mr-1" />;
      case 'compiler': return <FiZap className="mr-1" />;
      default: return <FiCode className="mr-1" />;
    }
  };

  // ========== RENDER COMPONENTS ==========
  const renderFrameworkOverview = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Frontend Framework Roadmaps</h2>
        <p className="text-gray-600 mb-6">
          Select a framework to view its learning path. Each framework has structured categories 
          and modules to guide your learning journey from beginner to advanced concepts.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFrameworks.map((framework) => (
            <div
              key={framework.id}
              onClick={() => handleFrameworkSelect(framework.id)}
              className="border rounded-xl p-5 hover:shadow-lg transition cursor-pointer flex flex-col h-full"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={framework.logo} 
                  alt={framework.name} 
                  className="w-12 h-12 mr-4 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/frameworks/default.svg';
                  }}
                />
                <div>
                  <h3 className="text-xl font-semibold">{framework.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span>Since {framework.releaseYear}</span>
                    <span className="mx-2">•</span>
                    <span>{framework.popularity}% popularity</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4 flex-grow">{framework.description}</p>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center text-gray-500">
                  <FiBook className="mr-1" />
                  <span>
                    {framework.categories.reduce((total, cat) => total + cat.modules.length, 0)} modules
                  </span>
                </div>
                <div className="flex items-center text-blue-600">
                  <span>Start Learning</span>
                  <FiChevronRight className="ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFrameworkDetail = () => {
    if (!selectedFrameworkData) return null;
    
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-start mb-6">
            <img 
              src={selectedFrameworkData.logo} 
              alt={selectedFrameworkData.name} 
              className="w-16 h-16 mr-5 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/frameworks/default.svg';
              }}
            />
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedFrameworkData.name}</h2>
                  <p className="text-gray-600 mb-4">{selectedFrameworkData.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center">
                    {getFrameworkTypeIcon(selectedFrameworkData.type)}
                    {selectedFrameworkData.type}
                  </span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
                    {selectedFrameworkData.language}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center">
                  <FiStar className="mr-1" /> {selectedFrameworkData.stars.toLocaleString()} GitHub stars
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                  {selectedFrameworkData.popularity}% Popularity
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
                  Updated {selectedFrameworkData.lastUpdated}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab('modules')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === 'modules' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Learning Paths
              </button>
              <button
                onClick={() => setActiveTab('learningPath')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === 'learningPath' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Step-by-Step Guide
              </button>
              <button
                onClick={() => setActiveTab('official')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === 'official' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Official Resources
              </button>
            </div>

            {activeTab === 'modules' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Learning Paths</h3>
                {selectedFrameworkData.categories.map((category) => {
                  const completion = calculateCategoryCompletion(category);
                  const isEligible = isCategoryEligibleForCertificate(category);
                  const hasCert = hasCertificate(category.id);
                  
                  return (
                    <div
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="border rounded-xl p-5 hover:shadow-lg transition cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-start">
                          <h4 className="text-lg font-semibold">{category.name}</h4>
                          {category.badge && (
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                              {category.badge}
                            </span>
                          )}
                        </div>
                        {(isEligible || hasCert) && (
                          <span className="flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            <FiAward className="mr-1" /> 
                            {hasCert ? 'Certificate Earned' : 'Certificate Ready'}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center text-gray-500">
                            <FiBook className="mr-1" />
                            {category.modules.length} Modules
                          </span>
                          <span className="flex items-center text-gray-500">
                            <FiClock className="mr-1" />
                            {category.estimatedDuration}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${completion}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{completion}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'learningPath' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Step-by-Step Learning Path</h3>
                {selectedFrameworkData.learningPath.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FiCompass className="mx-auto text-4xl text-gray-400 mb-3" />
                    <h4 className="text-lg font-medium text-gray-600">Learning path coming soon</h4>
                    <p className="text-gray-500 mt-1">We're working on creating the perfect learning journey for this framework</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-5 h-full w-0.5 bg-gray-200"></div>
                    {selectedFrameworkData.learningPath.map((step, index) => (
                      <div key={step.id} className="relative pl-12 pb-8">
                        <div className="absolute left-5 top-0 w-4 h-4 rounded-full bg-blue-600 -ml-2 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-5 hover:bg-gray-100 transition">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                              <p className="text-gray-600 mb-3">{step.description}</p>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                              {step.estimatedDuration}
                            </span>
                          </div>
                          {step.resources.length > 0 && (
                            <div className="mt-3">
                              <h5 className="text-sm font-medium text-gray-500 mb-2">Recommended Resources:</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {step.resources.map(resource => (
                                  <a
                                    key={resource.id}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start p-3 border rounded-lg hover:shadow-md transition"
                                  >
                                    <div className={`p-2 rounded-lg mr-3 ${
                                      resource.free ? 'bg-green-100' : 'bg-blue-100'
                                    }`}>
                                      {resource.type === 'documentation' && <FiBook className={`${resource.free ? 'text-green-600' : 'text-blue-600'}`} />}
                                      {resource.type === 'course' && <FiVideo className={`${resource.free ? 'text-green-600' : 'text-blue-600'}`} />}
                                      {resource.type === 'sandbox' && <FiCode className={`${resource.free ? 'text-green-600' : 'text-blue-600'}`} />}
                                    </div>
                                    <div>
                                      <h6 className="font-medium">{resource.title}</h6>
                                      <div className="flex items-center">
                                        <p className="text-xs text-gray-500 capitalize mr-2">{resource.type}</p>
                                        {resource.free && (
                                          <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Free</span>
                                        )}
                                      </div>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'official' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Official Resources</h3>
                {selectedFrameworkData.officialResources.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FiCompass className="mx-auto text-4xl text-gray-400 mb-3" />
                    <h4 className="text-lg font-medium text-gray-600">Resources coming soon</h4>
                    <p className="text-gray-500 mt-1">We're gathering the best official resources for this framework</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedFrameworkData.officialResources.map(resource => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border rounded-lg p-5 hover:shadow-md transition flex flex-col h-full"
                      >
                        <div className="flex items-center mb-3">
                          <div className="bg-blue-100 p-2 rounded-lg mr-3">
                            {resource.type === 'documentation' && <FiBook className="text-blue-600 text-xl" />}
                            {resource.type === 'tutorial' && <FiFileText className="text-blue-600 text-xl" />}
                            {resource.type === 'video' && <FiVideo className="text-blue-600 text-xl" />}
                            {resource.type === 'community' && <FiUser className="text-blue-600 text-xl" />}
                            {resource.type === 'playground' && <FiCode className="text-blue-600 text-xl" />}
                          </div>
                          <h4 className="font-semibold">{resource.title}</h4>
                        </div>
                        <p className="text-gray-600 mb-4 flex-grow">{resource.description}</p>
                        <div className="text-sm text-blue-600 flex items-center">
                          Visit Resource <FiChevronRight className="ml-1" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryDetail = () => {
    if (!selectedFrameworkData || !selectedCategoryData) return null;
    
    const completion = calculateCategoryCompletion(selectedCategoryData);
    const isEligible = isCategoryEligibleForCertificate(selectedCategoryData);
    const hasCert = hasCertificate(selectedCategoryData.id);
    const totalDuration = calculateCategoryDuration(selectedCategoryData);
    const hours = Math.floor(totalDuration / 60);
    const minutes = totalDuration % 60;

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <img 
              src={selectedFrameworkData.logo} 
              alt={selectedFrameworkData.name} 
              className="w-12 h-12 mr-4 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/frameworks/default.svg';
              }}
            />
            <div>
              <h2 className="text-xl font-bold">{selectedFrameworkData.name}</h2>
              <h3 className="text-lg text-gray-600">{selectedCategoryData.name}</h3>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-blue-50 rounded-xl p-4">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold">Progress Overview</h3>
              <p className="text-sm text-gray-600">
                {selectedCategoryData.description}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
              <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                <div className="text-2xl font-bold">{completion}%</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                <div className="text-2xl font-bold">
                  {selectedCategoryData.modules.filter(m => 
                    userProgress.completedModules.includes(m.id)
                  ).length}/{selectedCategoryData.modules.length}
                </div>
                <div className="text-xs text-gray-500">Modules</div>
              </div>
              <div className="text-center bg-white p-3 rounded-lg shadow-sm">
                <div className="text-2xl font-bold">
                  {hours > 0 ? `${hours}h ` : ''}{minutes}m
                </div>
                <div className="text-xs text-gray-500">Duration</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveTab('modules')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeTab === 'modules' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Modules
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeTab === 'resources' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Resources
                </button>
              </div>
              <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full whitespace-nowrap">
                {selectedCategoryData.modules.length} modules
              </div>
            </div>

            {activeTab === 'modules' ? (
              <div className="space-y-4">
                {selectedCategoryData.modules.map((module) => {
                  const progress = calculateModuleCompletion(module);
                  const isBookmarked = userProgress.bookmarks.includes(module.id);
                  const isCompleted = userProgress.completedModules.includes(module.id);
                  const hasNote = userProgress.notes[module.id];
                  
                  return (
                    <div key={module.id} className="border rounded-xl p-5 hover:shadow-lg transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-bold text-lg">{module.title}</h4>
                            {isBookmarked && (
                              <FiStar className="ml-2 text-yellow-500" />
                            )}
                            {module.project && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                Project
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                          
                          {module.learningObjectives.length > 0 && (
                            <div className="mt-3">
                              <h5 className="text-sm font-medium text-gray-500 mb-1">Learning Objectives:</h5>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {module.learningObjectives.map((obj, idx) => (
                                  <li key={idx}>{obj}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          module.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {module.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <div className="flex space-x-4">
                          <span className="flex items-center">
                            <FiClock className="mr-1" /> {module.duration}
                          </span>
                          <span className="flex items-center">
                            <FiBook className="mr-1" /> {module.lessons.length} lessons
                          </span>
                        </div>
                        {module.prerequisites.length > 0 && (
                          <span className="text-orange-600">
                            Requires: {module.prerequisites.join(', ')}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openNoteModal(module.id)}
                            className={`p-2 rounded-full ${
                              hasNote ? 'text-blue-500 bg-blue-50 hover:bg-blue-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                            }`}
                            title={hasNote ? 'View/edit notes' : 'Add notes'}
                          >
                            <FiFileText />
                          </button>
                          <button
                            onClick={() => toggleBookmark(module.id)}
                            className={`p-2 rounded-full ${
                              isBookmarked 
                                ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
                                : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                            }`}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this module'}
                          >
                            <FiStar />
                          </button>
                          <button
                            onClick={() => toggleModuleCompletion(module.id)}
                            className={`p-2 rounded-full ${
                              isCompleted
                                ? 'text-green-500 bg-green-50 hover:bg-green-100'
                                : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                            }`}
                            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            <FiCheckCircle />
                          </button>
                          <button
                            onClick={() => handleModuleStart(selectedFrameworkData.id, module.id)}
                            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                          >
                            {progress === 100 ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
                            <FiChevronRight className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCategoryData.modules.flatMap(module =>
                  module.resources.length > 0 ? (
                    module.resources.map(resource => (
                      <div key={resource.id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex items-start">
                          <div className={`p-2 rounded-lg mr-3 ${
                            resource.free ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            {resource.type === 'documentation' && <FiBook className={resource.free ? 'text-green-600' : 'text-blue-600'} />}
                            {resource.type === 'cheatsheet' && <FiBookOpen className={resource.free ? 'text-green-600' : 'text-blue-600'} />}
                            {resource.type === 'github' && <FiStar className={resource.free ? 'text-green-600' : 'text-blue-600'} />}
                            {resource.type === 'article' && <FiCompass className={resource.free ? 'text-green-600' : 'text-blue-600'} />}
                            {resource.type === 'video' && <FiVideo className={resource.free ? 'text-green-600' : 'text-blue-600'} />}
                            {resource.type === 'sandbox' && <FiCode className={resource.free ? 'text-green-600' : 'text-blue-600'} />}
                          </div>
                          <div>
                            <h4 className="font-medium">{resource.title}</h4>
                            <div className="flex items-center">
                              <p className="text-sm text-gray-500 capitalize mr-2">{resource.type}</p>
                              {resource.free && (
                                <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Free</span>
                              )}
                            </div>
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                            >
                              View Resource
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div key={`empty-${module.id}`} className="border rounded-lg p-4 text-center text-gray-500">
                      No resources available for {module.title}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-xl p-5">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FiAward className="text-blue-600 text-xl" />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-lg mb-2">Earn your Certificate</h3>
                <p className="text-gray-600 mb-4">
                  Complete all modules in this category to receive a verifiable certificate of completion.
                  {isEligible && !hasCert && (
                    <span className="block mt-2 text-green-600 font-medium">
                      You've completed all requirements! Claim your certificate now.
                    </span>
                  )}
                  {hasCert && (
                    <span className="block mt-2 text-green-600 font-medium">
                      You've already earned this certificate.
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-3">
                  {isEligible && !hasCert ? (
                    <button 
                      onClick={() => {
                        generateCertificate(selectedFrameworkData.id, selectedCategoryData.id);
                        viewCertificate(selectedFrameworkData.id, selectedCategoryData.id);
                      }}
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                    >
                      <FiAward className="mr-2" /> Claim Certificate
                    </button>
                  ) : hasCert ? (
                    <button 
                      onClick={() => viewCertificate(selectedFrameworkData.id, selectedCategoryData.id)}
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                    >
                      <FiDownload className="mr-2" /> View Certificate
                    </button>
                  ) : (
                    <button 
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      View Requirements
                    </button>
                  )}
                  <button className="text-sm bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition flex items-center">
                    <FiShare2 className="mr-2" /> Share Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCertificateModal = () => {
    if (!certificateToView || !selectedFrameworkData || !selectedCategoryData) return null;
    
    const framework = selectedFrameworkData;
    const category = selectedCategoryData;
    const date = new Date(certificateToView.dateEarned);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-600">Certificate of Completion</h2>
                <p className="text-gray-600">This is to certify that</p>
              </div>
              <button 
                onClick={() => setShowCertificateModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="text-center py-8 border-y border-gray-200 my-6">
              <div className="flex justify-center mb-6">
                <img 
                  src={framework.logo} 
                  alt={framework.name} 
                  className="h-16 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/frameworks/default.svg';
                  }}
                />
              </div>
              <h3 className="text-3xl font-bold mb-2">{category.name}</h3>
              <p className="text-xl text-gray-600 mb-6">in {framework.name}</p>
              <p className="text-lg">has been successfully completed by</p>
              <h4 className="text-2xl font-semibold my-4">John Doe</h4>
              <p className="text-gray-600">on {date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            
            <div className="flex justify-between items-center mt-8">
              <div className="text-center">
                <div className="h-24 border-b-2 border-gray-300 w-48 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Authorized Signature</p>
              </div>
              <div className="text-center">
                <div className="h-24 border-b-2 border-gray-300 w-48 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Director of Education</p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center space-x-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center">
                <FiDownload className="mr-2" /> Download PDF
              </button>
              <button className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                Share Certificate
              </button>
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Certificate ID: {certificateToView.id}</p>
              <p>Verify this certificate at: https://yourplatform.com{certificateToView.verificationUrl}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNoteModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Module Notes</h3>
              <button 
                onClick={() => setShowNoteModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <textarea
              className="w-full h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentNote.content}
              onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
              placeholder="Add your notes for this module..."
            />
            
            <div className="mt-4 flex justify-end space-x-3">
              <button 
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={saveNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ========== MAIN RENDER ==========
  return (
    <div className="frontend-learning-portal min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
            <FiBook className="mr-2" /> Frontend Masters
          </Link>
          
          <div className="relative w-1/3 hidden md:block">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search frameworks..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <nav className="flex items-center space-x-4">
            <button className="md:hidden text-gray-600">
              <FiSearch />
            </button>
            <Link to="/profile" className="text-gray-600 hover:text-blue-600">
              <FiUser />
            </Link>
          </nav>
        </div>
      </header>

      {/* Mobile Search */}
      <div className="md:hidden bg-white px-4 py-2 border-t">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search frameworks..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-8">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Frameworks</h2>
              </div>
              <ul className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
                {filteredFrameworks.map((framework) => (
                  <li key={framework.id}>
                    <button
                      onClick={() => handleFrameworkSelect(framework.id)}
                      className={`w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between ${
                        selectedFramework === framework.id ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <img 
                          src={framework.logo} 
                          alt={framework.name} 
                          className="w-6 h-6 mr-3 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/frameworks/default.svg';
                          }}
                        />
                        <span>{framework.name}</span>
                      </div>
                      {userProgress.lastAccessed.frameworkId === framework.id && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Recent
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>

              {selectedFrameworkData && (
                <div className="border-t border-gray-200">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Categories</h2>
                  </div>
                  <ul className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {selectedFrameworkData.categories.map((category) => {
                      const completion = calculateCategoryCompletion(category);
                      const isEligible = isCategoryEligibleForCertificate(category);
                      const hasCert = hasCertificate(category.id);
                      
                      return (
                        <li key={category.id}>
                          <button
                            onClick={() => handleCategorySelect(category.id)}
                            className={`w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between ${
                              selectedCategory === category.id ? 'bg-blue-50 text-blue-600' : ''
                            }`}
                          >
                            <div>
                              <div className="font-medium">{category.name}</div>
                              <div className="flex items-center mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${completion}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">{completion}%</span>
                              </div>
                            </div>
                            {(isEligible || hasCert) && (
                              <FiAward className={`text-yellow-500 ${hasCert ? 'fill-current' : ''}`} />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {!selectedFramework 
              ? renderFrameworkOverview() 
              : !selectedCategory 
                ? renderFrameworkDetail() 
                : renderCategoryDetail()}
          </div>
        </div>
      </main>

      {/* Certificate Modal */}
      {showCertificateModal && renderCertificateModal()}

      {/* Note Modal */}
      {showNoteModal && renderNoteModal()}
    </div>
  );
};

export default FrontendLearningPortal;