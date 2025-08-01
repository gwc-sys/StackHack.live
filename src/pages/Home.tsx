import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStar, FaSearch, FaBook, FaGraduationCap, FaUniversity, 
  FaUserGraduate, FaChalkboardTeacher, 
  FaRegBookmark, FaBookOpen, FaRegNewspaper,
  FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { 
  MdEngineering, MdComputer, MdOutlineScience, 
  MdConstruction, MdSchool, MdPhonelink 
} from 'react-icons/md';
import { GiMechanicalArm, GiChemicalDrop } from 'react-icons/gi';
import { SiFuturelearn } from 'react-icons/si';

// Define types for our data structures
import type { ReactElement } from 'react';

type Branch = {
  name: string;
  icon: ReactElement;
  color: string;
  borderColor: string;
  isFirstYear: boolean;
};

type Feature = {
  icon: ReactElement;
  title: string;
  description: string;
  gradient: string;
};

type Testimonial = {
  name: string;
  university: string;
  text: string;
  rating: number;
  avatarColor: string;
};

type SemesterSubjects = {
  [key: string]: string[];
};

// Common first year subjects for all branches
const firstYearSubjects: SemesterSubjects = {
  "Semester 1": [
    "Engineering Mathematics-I",
    "Engineering Physics",
    "Engineering Chemistry",
    "Basic Electrical Engineering",
    "Programming for Problem Solving",
    "Engineering Graphics",
    "Environmental Science"
  ],
  "Semester 2": [
    "Engineering Mathematics-II",
    "Engineering Mechanics",
    "Basic Electronics Engineering",
    "Engineering Thermodynamics",
    "Workshop Practice",
    "Communication Skills",
    "Indian Constitution"
  ]
};

const branches: Branch[] = [
  {
    name: "First Year Engineering (Common to All Branches)",
    icon: <MdSchool className="w-6 h-6 text-indigo-600" />,
    color: "bg-indigo-100",
    borderColor: "border-indigo-300",
    isFirstYear: true
  },
  {
    name: "Mechanical Engineering",
    icon: <GiMechanicalArm className="w-6 h-6 text-orange-600" />,
    color: "bg-orange-100",
    borderColor: "border-orange-300",
    isFirstYear: false
  },
  {
    name: "Civil Engineering",
    icon: <MdConstruction className="w-6 h-6 text-emerald-600" />,
    color: "bg-emerald-100",
    borderColor: "border-emerald-300",
    isFirstYear: false
  },
  {
    name: "Electrical Engineering",
    icon: <FaGraduationCap className="w-6 h-6 text-amber-600" />,
    color: "bg-amber-100",
    borderColor: "border-amber-300",
    isFirstYear: false
  },
  {
    name: "Electronics and Communication Engineering (ECE)",
    icon: <MdComputer className="w-6 h-6 text-violet-600" />,
    color: "bg-violet-100",
    borderColor: "border-violet-300",
    isFirstYear: false
  },
  {
    name: "Computer Science and Engineering (CSE)",
    icon: <MdComputer className="w-6 h-6 text-blue-600" />,
    color: "bg-blue-100",
    borderColor: "border-blue-300",
    isFirstYear: false
  },
  {
    name: "Chemical Engineering",
    icon: <GiChemicalDrop className="w-6 h-6 text-red-600" />,
    color: "bg-red-100",
    borderColor: "border-red-300",
    isFirstYear: false
  },
  {
    name: "Artificial Intelligence and Machine Learning (AI & ML)",
    icon: <SiFuturelearn className="w-6 h-6 text-indigo-600" />,
    color: "bg-indigo-100",
    borderColor: "border-indigo-300",
    isFirstYear: false
  },
  {
    name: "Data Science and Engineering",
    icon: <MdOutlineScience className="w-6 h-6 text-pink-600" />,
    color: "bg-pink-100",
    borderColor: "border-pink-300",
    isFirstYear: false
  },
  {
    name: "Robotics and Automation",
    icon: <MdEngineering className="w-6 h-6 text-teal-600" />,
    color: "bg-teal-100",
    borderColor: "border-teal-300",
    isFirstYear: false
  },
  {
    name: "Mechatronics Engineering",
    icon: <MdEngineering className="w-6 h-6 text-cyan-600" />,
    color: "bg-cyan-100",
    borderColor: "border-cyan-300",
    isFirstYear: false
  },
  {
    name: "Cybersecurity Engineering",
    icon: <MdComputer className="w-6 h-6 text-gray-600" />,
    color: "bg-gray-100",
    borderColor: "border-gray-300",
    isFirstYear: false
  },
  {
    name: "Electronic and Telecommunication Engineering",
    icon: <MdPhonelink className="w-6 h-6 text-fuchsia-600" />,
    color: "bg-fuchsia-100",
    borderColor: "border-fuchsia-300",
    isFirstYear: false
  },
  {
    name: "Design Engineering",
    icon: <MdEngineering className="w-6 h-6 text-lime-600" />,
    color: "bg-lime-100",
    borderColor: "border-lime-300",
    isFirstYear: false
  }
];

const features: Feature[] = [
  {
    icon: <FaBookOpen className="w-10 h-10 text-blue-600" />,
    title: "Study Materials",
    description: "Access comprehensive study materials, lecture notes, and reference books",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: <FaRegNewspaper className="w-10 h-10 text-emerald-600" />,
    title: "Past Papers",
    description: "Practice with previous year question papers and model answers",
    gradient: "from-emerald-500 to-emerald-600"
  },
  {
    icon: <FaUniversity className="w-10 h-10 text-indigo-600" />,
    title: "University Resources",
    description: "Connect with leading educational institutions and their resources",
    gradient: "from-indigo-500 to-indigo-600"
  },
  {
    icon: <FaChalkboardTeacher className="w-10 h-10 text-purple-600" />,
    title: "Expert Guidance",
    description: "Get insights from professors and industry experts",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: <FaUserGraduate className="w-10 h-10 text-amber-600" />,
    title: "Student Community",
    description: "Join discussions with peers across universities",
    gradient: "from-amber-500 to-amber-600"
  },
  {
    icon: <FaRegBookmark className="w-10 h-10 text-rose-600" />,
    title: "Bookmark System",
    description: "Save your favorite resources for quick access",
    gradient: "from-rose-500 to-rose-600"
  }
];

const testimonials: Testimonial[] = [
  {
    name: "Sankalp Gadakh",
    university: "Amrutvahini Polytechnic, Sangamner",
    text: "This platform helped me ace my semester exams with its comprehensive question bank and study materials.",
    rating: 5,
    avatarColor: "bg-blue-600"
  },
  {
    name: "Priya Patel",
    university: "NIT Surat",
    text: "The past papers with solutions were a game-changer for my preparation strategy.",
    rating: 4,
    avatarColor: "bg-purple-600"
  },
  {
    name: "Amit Kumar",
    university: "BITS Pilani",
    text: "The community discussions clarified many of my doubts and improved my understanding.",
    rating: 5,
    avatarColor: "bg-amber-600"
  }
];

const Home = () => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);
  // Removed unused expandedSemester state

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFilteredBranches = (): Branch[] => {
    if (activeTab === 'all') return filteredBranches;
    if (activeTab === 'computer') {
      return filteredBranches.filter(branch => 
        branch.name.toLowerCase().includes('computer') || 
        branch.name.toLowerCase().includes('ai') ||
        branch.name.toLowerCase().includes('data') ||
        branch.name.toLowerCase().includes('cyber') ||
        branch.name.toLowerCase().includes('electronics')
      );
    }
    if (activeTab === 'engineering') {
      return filteredBranches.filter(branch => 
        (branch.name.toLowerCase().includes('engineering') || 
         branch.name.toLowerCase().includes('mechanical') ||
         branch.name.toLowerCase().includes('civil') ||
         branch.name.toLowerCase().includes('electrical')) && 
        !branch.name.toLowerCase().includes('computer') &&
        !branch.name.toLowerCase().includes('science')
      );
    }
    if (activeTab === 'science') {
      return filteredBranches.filter(branch => 
        branch.name.toLowerCase().includes('science') || 
        branch.name.toLowerCase().includes('chemical')
      );
    }
    return filteredBranches;
  };

  const toggleBranch = (branchName: string): void => {
    if (expandedBranch === branchName) {
      setExpandedBranch(null);
    } else {
      setExpandedBranch(branchName);
    }
  };


  // SPPU Mechanical Engineering Subjects (example, update as per latest syllabus)
  const mechanicalSubjects: Record<string, Record<string, { core: string[]; electives?: string[] }>> = {
    "Second Year": {
      "Semester 3": {
        core: [
          "Engineering Mathematics III",
          "Thermodynamics",
          "Strength of Materials",
          "Manufacturing Processes I",
          "Fluid Mechanics",
          "Machine Drawing"
        ],
        electives: [
          "Audit Course 1 (e.g., German Language, Japanese Language, etc.)"
        ]
      },
      "Semester 4": {
        core: [
          "Engineering Mathematics IV",
          "Applied Thermodynamics",
          "Materials Science",
          "Theory of Machines I",
          "Manufacturing Processes II",
          "Electrical and Electronics Engineering"
        ],
        electives: [
          "Audit Course 2 (e.g., Soft Skills, Cyber Security, etc.)"
        ]
      }
    },
    "Third Year": {
      "Semester 5": {
        core: [
          "Dynamics of Machinery",
          "Heat Transfer",
          "Design of Machine Elements I",
          "Metrology and Quality Control",
          "Turbo Machines",
          "Numerical and Statistical Methods"
        ],
        electives: [
          "Elective I (e.g., Mechatronics, Operations Research, etc.)"
        ]
      },
      "Semester 6": {
        core: [
          "Theory of Machines II",
          "Refrigeration and Air Conditioning",
          "Design of Machine Elements II",
          "Manufacturing Process III",
          "Finite Element Analysis",
          "Industrial Engineering and Management"
        ],
        electives: [
          "Elective II (e.g., Automobile Engineering, Energy Audit, etc.)"
        ]
      }
    },
    "Final Year": {
      "Semester 7": {
        core: [
          "CAD/CAM and Automation",
          "Refrigeration and Air Conditioning",
          "Energy Engineering",
          "Mechanical System Design",
          "Industrial Fluid Power"
        ],
        electives: [
          "Elective III (e.g., Robotics, Product Design, etc.)"
        ]
      },
      "Semester 8": {
        core: [
          "Project Work",
          "Seminar",
          "Comprehensive Viva"
        ],
        electives: [
          "Elective IV (e.g., Advanced Manufacturing, Renewable Energy, etc.)"
        ]
      }
    }
  };

  // SPPU Civil Engineering Subjects (example, update as per latest syllabus)
  const civilSubjects: Record<string, Record<string, { core: string[]; electives?: string[] }>> = {
    "Second Year": {
      "Semester 3": {
        core: [
          "Engineering Mathematics III",
          "Building Technology and Materials",
          "Strength of Materials",
          "Surveying",
          "Fluid Mechanics I",
          "Geology for Civil Engineering"
        ],
        electives: [
          "Audit Course 1 (e.g., German Language, Japanese Language, etc.)"
        ]
      },
      "Semester 4": {
        core: [
          "Engineering Mathematics IV",
          "Concrete Technology",
          "Structural Analysis I",
          "Surveying II",
          "Fluid Mechanics II",
          "Transportation Engineering I"
        ],
        electives: [
          "Audit Course 2 (e.g., Soft Skills, Cyber Security, etc.)"
        ]
      }
    },
    "Third Year": {
      "Semester 5": {
        core: [
          "Structural Analysis II",
          "Design of Steel Structures",
          "Geotechnical Engineering I",
          "Water Resource Engineering I",
          "Transportation Engineering II",
          "Environmental Engineering I"
        ],
        electives: [
          "Elective I (e.g., Remote Sensing, Disaster Management, etc.)"
        ]
      },
      "Semester 6": {
        core: [
          "Design of Reinforced Concrete Structures",
          "Geotechnical Engineering II",
          "Water Resource Engineering II",
          "Foundation Engineering",
          "Environmental Engineering II",
          "Project Management"
        ],
        electives: [
          "Elective II (e.g., Advanced Surveying, Green Building, etc.)"
        ]
      }
    },
    "Final Year": {
      "Semester 7": {
        core: [
          "Design of Hydraulic Structures",
          "Advanced Concrete Technology",
          "Construction Management",
          "Elective III (e.g., Finite Element Method, Urban Transport, etc.)"
        ],
        electives: [
          "Open Elective (e.g., Entrepreneurship, Intellectual Property Rights, etc.)"
        ]
      },
      "Semester 8": {
        core: [
          "Project Work",
          "Seminar",
          "Comprehensive Viva"
        ],
        electives: [
          "Elective IV (e.g., Environmental Impact Assessment, Advanced Foundation Engineering, etc.)"
        ]
      }
    }
  };

  // SPPU Electrical Engineering Subjects
  const electricalSubjects: Record<string, Record<string, { core: string[]; electives?: string[] }>> = {
    "Second Year": {
      "Semester 3": {
        core: [
          "Engineering Mathematics III",
          "Electrical Machines I",
          "Network Analysis",
          "Analog Electronics",
          "Electromagnetic Fields",
          "Electrical Measurements"
        ],
        electives: [
          "Audit Course 1 (e.g., German Language, Japanese Language, etc.)"
        ]
      },
      "Semester 4": {
        core: [
          "Engineering Mathematics IV",
          "Electrical Machines II",
          "Digital Electronics",
          "Power Generation Technologies",
          "Signals and Systems",
          "Control Systems I"
        ],
        electives: [
          "Audit Course 2 (e.g., Soft Skills, Cyber Security, etc.)"
        ]
      }
    },
    "Third Year": {
      "Semester 5": {
        core: [
          "Power Electronics",
          "Microprocessors and Microcontrollers",
          "Control Systems II",
          "Electrical Machine Design",
          "Power System I",
          "Elective I (e.g., Renewable Energy Systems, etc.)"
        ]
      },
      "Semester 6": {
        core: [
          "Power System II",
          "Switchgear and Protection",
          "Industrial Drives and Control",
          "Utilization of Electrical Energy",
          "Elective II (e.g., Electric Vehicle Technology, etc.)"
        ]
      }
    },
    "Final Year": {
      "Semester 7": {
        core: [
          "High Voltage Engineering",
          "Power System Operation and Control",
          "Elective III (e.g., Smart Grid, etc.)",
          "Project Phase I"
        ]
      },
      "Semester 8": {
        core: [
          "Electrical Energy Audit and Conservation",
          "Elective IV (e.g., Flexible AC Transmission, etc.)",
          "Project Phase II"
        ]
      }
    }
  };

  // SPPU Computer Science and Engineering (CSE) Subjects
  const cseSubjects: Record<string, Record<string, { core: string[]; electives?: string[] }>> = {
    "Second Year": {
      "Semester 3": {
        core: [
          "Discrete Mathematics",
          "Data Structures and Algorithms",
          "Digital Logic Design",
          "Computer Organization",
          "Object Oriented Programming",
          "Principles of Programming Languages"
        ],
        electives: [
          "Audit Course 1 (e.g., German Language, Japanese Language, etc.)"
        ]
      },
      "Semester 4": {
        core: [
          "Theory of Computation",
          "Database Management Systems",
          "Computer Networks",
          "Operating Systems",
          "Software Engineering",
          "Web Technologies"
        ],
        electives: [
          "Audit Course 2 (e.g., Soft Skills, Cyber Security, etc.)"
        ]
      }
    },
    "Third Year": {
      "Semester 5": {
        core: [
          "Design and Analysis of Algorithms",
          "Compiler Design",
          "Artificial Intelligence",
          "Mobile Computing",
          "Elective I (e.g., Cloud Computing, etc.)"
        ]
      },
      "Semester 6": {
        core: [
          "Machine Learning",
          "Distributed Systems",
          "Information Security",
          "Data Mining",
          "Elective II (e.g., Internet of Things, etc.)"
        ]
      }
    },
    "Final Year": {
      "Semester 7": {
        core: [
          "Big Data Analytics",
          "Cyber Security",
          "Elective III (e.g., Blockchain Technology, etc.)",
          "Project Phase I"
        ]
      },
      "Semester 8": {
        core: [
          "Professional Ethics",
          "Elective IV (e.g., Augmented Reality, etc.)",
          "Project Phase II"
        ]
      }
    }
  };

  // SPPU Electronics and Communication Engineering (ECE) Subjects
  const eceSubjects: Record<string, Record<string, { core: string[]; electives?: string[] }>> = {
    "Second Year": {
      "Semester 3": {
        core: [
          "Engineering Mathematics III",
          "Electronic Devices and Circuits",
          "Network Analysis",
          "Digital Electronics",
          "Signals and Systems",
          "Electromagnetic Fields"
        ],
        electives: [
          "Audit Course 1 (e.g., German Language, Japanese Language, etc.)"
        ]
      },
      "Semester 4": {
        core: [
          "Engineering Mathematics IV",
          "Analog Circuits",
          "Microprocessors",
          "Control Systems",
          "Communication Systems I",
          "Electronic Instrumentation"
        ],
        electives: [
          "Audit Course 2 (e.g., Soft Skills, Cyber Security, etc.)"
        ]
      }
    },
    "Third Year": {
      "Semester 5": {
        core: [
          "Digital Communication",
          "VLSI Design",
          "Embedded Systems",
          "Antenna and Wave Propagation",
          "Elective I (e.g., Biomedical Electronics, etc.)"
        ]
      },
      "Semester 6": {
        core: [
          "Microwave Engineering",
          "Optical Communication",
          "Wireless Communication",
          "Digital Signal Processing",
          "Elective II (e.g., Robotics, etc.)"
        ]
      }
    },
    "Final Year": {
      "Semester 7": {
        core: [
          "Satellite Communication",
          "Internet of Things",
          "Elective III (e.g., Nano Electronics, etc.)",
          "Project Phase I"
        ]
      },
      "Semester 8": {
        core: [
          "Professional Ethics",
          "Elective IV (e.g., Artificial Intelligence, etc.)",
          "Project Phase II"
        ]
      }
    }
  };

  // SPPU Chemical Engineering Subjects
  const chemicalSubjects: Record<string, Record<string, { core: string[]; electives?: string[] }>> = {
    "Second Year": {
      "Semester 3": {
        core: [
          "Engineering Mathematics III",
          "Fluid Flow Operations",
          "Process Calculations",
          "Mechanical Operations",
          "Chemical Engineering Thermodynamics I",
          "Material Science"
        ],
        electives: [
          "Audit Course 1 (e.g., German Language, Japanese Language, etc.)"
        ]
      },
      "Semester 4": {
        core: [
          "Engineering Mathematics IV",
          "Heat Transfer",
          "Chemical Engineering Thermodynamics II",
          "Process Instrumentation",
          "Organic Chemistry",
          "Physical Chemistry"
        ],
        electives: [
          "Audit Course 2 (e.g., Soft Skills, Cyber Security, etc.)"
        ]
      }
    },
    "Third Year": {
      "Semester 5": {
        core: [
          "Mass Transfer I",
          "Chemical Reaction Engineering I",
          "Process Dynamics and Control",
          "Petroleum Refining",
          "Elective I (e.g., Biochemical Engineering, etc.)"
        ]
      },
      "Semester 6": {
        core: [
          "Mass Transfer II",
          "Chemical Reaction Engineering II",
          "Process Equipment Design",
          "Environmental Engineering",
          "Elective II (e.g., Polymer Technology, etc.)"
        ]
      }
    },
    "Final Year": {
      "Semester 7": {
        core: [
          "Transport Phenomena",
          "Process Modeling and Simulation",
          "Elective III (e.g., Food Technology, etc.)",
          "Project Phase I"
        ]
      },
      "Semester 8": {
        core: [
          "Process Engineering Economics",
          "Elective IV (e.g., Nanotechnology, etc.)",
          "Project Phase II"
        ]
      }
    }
  };

  // SPPU Artificial Intelligence and Machine Learning (AI & ML) Subjects
  const aimlSubjects: Record<string, Record<string, { core: string[]; electives?: string[] }>> = {
    "Second Year": {
      "Semester 3": {
        core: [
          "Mathematics for AI",
          "Data Structures",
          "Python Programming",
          "Digital Logic Design",
          "Database Management Systems",
          "Probability and Statistics"
        ],
        electives: [
          "Audit Course 1 (e.g., German Language, Japanese Language, etc.)"
        ]
      },
      "Semester 4": {
        core: [
          "Object Oriented Programming",
          "Computer Networks",
          "Operating Systems",
          "Artificial Intelligence Fundamentals",
          "Discrete Mathematics",
          "Web Technologies"
        ],
        electives: [
          "Audit Course 2 (e.g., Soft Skills, Cyber Security, etc.)"
        ]
      }
    },
    "Third Year": {
      "Semester 5": {
        core: [
          "Machine Learning",
          "Natural Language Processing",
          "Computer Vision",
          "Data Mining",
          "Elective I (e.g., Deep Learning, etc.)"
        ]
      },
      "Semester 6": {
        core: [
          "Reinforcement Learning",
          "Big Data Analytics",
          "Cloud Computing",
          "Robotics",
          "Elective II (e.g., AI in Healthcare, etc.)"
        ]
      }
    },
    "Final Year": {
      "Semester 7": {
        core: [
          "Advanced Machine Learning",
          "AI Ethics and Society",
          "Elective III (e.g., Explainable AI, etc.)",
          "Project Phase I"
        ]
      },
      "Semester 8": {
        core: [
          "AI Applications",
          "Elective IV (e.g., Edge AI, etc.)",
          "Project Phase II"
        ]
      }
    }
  };

  // SPPU Data Science and Engineering Subjects
  const dseSubjects: Record<string, Record<string, { core: string[]; electives?: string[] }>> = {
    "Second Year": {
      "Semester 3": {
        core: [
          "Mathematics for Data Science",
          "Data Structures",
          "Database Management Systems",
          "Python for Data Science",
          "Probability and Statistics",
          "Data Visualization"
        ],
        electives: [
          "Audit Course 1 (e.g., German Language, Japanese Language, etc.)"
        ]
      },
      "Semester 4": {
        core: [
          "Object Oriented Programming",
          "Computer Networks",
          "Operating Systems",
          "Data Mining",
          "Linear Algebra",
          "Web Technologies"
        ],
        electives: [
          "Audit Course 2 (e.g., Soft Skills, Cyber Security, etc.)"
        ]
      }
    },
    "Third Year": {
      "Semester 5": {
        core: [
          "Machine Learning",
          "Big Data Analytics",
          "Cloud Computing",
          "Data Warehousing",
          "Elective I (e.g., Time Series Analysis, etc.)"
        ]
      },
      "Semester 6": {
        core: [
          "Deep Learning",
          "Natural Language Processing",
          "Data Security and Privacy",
          "Business Analytics",
          "Elective II (e.g., Data Science in Healthcare, etc.)"
        ]
      }
    },
    "Final Year": {
      "Semester 7": {
        core: [
          "Advanced Data Science",
          "AI for Data Science",
          "Elective III (e.g., Graph Analytics, etc.)",
          "Project Phase I"
        ]
      },
      "Semester 8": {
        core: [
          "Professional Ethics",
          "Elective IV (e.g., Data Science for IoT, etc.)",
          "Project Phase II"
        ]
      }
    }
  };

  // SPPU Robotics and Automation Subjects
  const roboticsSubjects: Record<string, Record<string, { core: string[]; electives?: string[] }>> = {
    "Second Year": {
      "Semester 3": {
        core: [
          "Engineering Mathematics III",
          "Mechanics of Materials",
          "Basic Electronics",
          "Introduction to Robotics",
          "Sensors and Actuators",
          "Programming for Robotics"
        ],
        electives: [
          "Audit Course 1 (e.g., German Language, Japanese Language, etc.)"
        ]
      },
      "Semester 4": {
        core: [
          "Engineering Mathematics IV",
          "Microcontrollers",
          "Control Systems",
          "Kinematics of Robots",
          "Mechatronics",
          "Machine Drawing"
        ],
        electives: [
          "Audit Course 2 (e.g., Soft Skills, Cyber Security, etc.)"
        ]
      }
    },
    "Third Year": {
      "Semester 5": {
        core: [
          "Robot Dynamics",
          "Machine Vision",
          "Embedded Systems",
          "Automation Systems",
          "Elective I (e.g., Mobile Robotics, etc.)"
        ]
      },
      "Semester 6": {
        core: [
          "Artificial Intelligence for Robotics",
          "Industrial Automation",
          "Robotics Simulation",
          "Flexible Manufacturing Systems",
          "Elective II (e.g., Human-Robot Interaction, etc.)"
        ]
      }
    },
    "Final Year": {
      "Semester 7": {
        core: [
          "Advanced Robotics",
          "Robotics Integration",
          "Elective III (e.g., Swarm Robotics, etc.)",
          "Project Phase I"
        ]
      },
      "Semester 8": {
        core: [
          "Professional Ethics",
          "Elective IV (e.g., Service Robotics, etc.)",
          "Project Phase II"
        ]
      }
    }
  };

  // SPPU Mechatronics Engineering Subjects
  const mechatronicsSubjects: Record<string, Record<string, { core: string[]; electives?: string[] }>> = {
    "Second Year": {
      "Semester 3": {
        core: [
          "Engineering Mathematics III",
          "Mechanics of Materials",
          "Basic Electronics",
          "Mechatronics System Design",
          "Sensors and Actuators",
          "Programming for Mechatronics"
        ],
        electives: [
          "Audit Course 1 (e.g., German Language, Japanese Language, etc.)"
        ]
      },
      "Semester 4": {
        core: [
          "Engineering Mathematics IV",
          "Microcontrollers",
          "Control Systems",
          "Fluid Power Engineering",
          "Manufacturing Processes",
          "Machine Drawing"
        ],
        electives: [
          "Audit Course 2 (e.g., Soft Skills, Cyber Security, etc.)"
        ]
      }
    },
    "Third Year": {
      "Semester 5": {
        core: [
          "Digital Signal Processing",
          "Embedded Systems",
          "Automation Systems",
          "Mechatronics in Manufacturing",
          "Elective I (e.g., Industrial Robotics, etc.)"
        ]
      },
      "Semester 6": {
        core: [
          "Artificial Intelligence for Mechatronics",
          "Industrial Automation",
          "Mechatronics Simulation",
          "Flexible Manufacturing Systems",
          "Elective II (e.g., Smart Sensors, etc.)"
        ]
      }
    },
    "Final Year": {
      "Semester 7": {
        core: [
          "Advanced Mechatronics",
          "Mechatronics Integration",
          "Elective III (e.g., Automotive Mechatronics, etc.)",
          "Project Phase I"
        ]
      },
      "Semester 8": {
        core: [
          "Professional Ethics",
          "Elective IV (e.g., Mechatronics for IoT, etc.)",
          "Project Phase II"
        ]
      }
    }
  };

  // SPPU Cybersecurity Engineering Subjects
  const cyberSubjects: Record<string, Record<string, { core: string[]; electives?: string[] }>> = {
    "Second Year": {
      "Semester 3": {
        core: [
          "Mathematics for Cybersecurity",
          "Data Structures",
          "Computer Networks",
          "Operating Systems",
          "Introduction to Cybersecurity",
          "Programming in C/C++"
        ],
        electives: [
          "Audit Course 1 (e.g., German Language, Japanese Language, etc.)"
        ]
      },
      "Semester 4": {
        core: [
          "Cryptography",
          "Web Security",
          "Database Security",
          "Network Security",
          "Ethical Hacking",
          "Software Engineering"
        ],
        electives: [
          "Audit Course 2 (e.g., Soft Skills, Cyber Security, etc.)"
        ]
      }
    },
    "Third Year": {
      "Semester 5": {
        core: [
          "Digital Forensics",
          "Cloud Security",
          "Application Security",
          "Incident Response",
          "Elective I (e.g., IoT Security, etc.)"
        ]
      },
      "Semester 6": {
        core: [
          "Mobile Security",
          "Blockchain Security",
          "Security Operations",
          "Risk Management",
          "Elective II (e.g., Malware Analysis, etc.)"
        ]
      }
    },
    "Final Year": {
      "Semester 7": {
        core: [
          "Advanced Cybersecurity",
          "Cyber Law and Ethics",
          "Elective III (e.g., AI in Security, etc.)",
          "Project Phase I"
        ]
      },
      "Semester 8": {
        core: [
          "Professional Ethics",
          "Elective IV (e.g., Security for Cloud Computing, etc.)",
          "Project Phase II"
        ]
      }
    }
  };

  // SPPU Electronic and Telecommunication Engineering (ENTC) Subjects (2019 Pattern)
  const entcSubjects: Record<string, Record<string, { core: string[]; electives?: string[] }>> = {
    "Second Year": {
      "Semester 3": {
        core: [
          "Engineering Mathematics III",
          "Electronic Circuits",
          "Digital Circuits",
          "Electrical Circuits",
          "Data Structures and Algorithms",

        ],
        electives: [
          "Audit Course 1 (e.g., Road Safety Management, German Language, Japanese Language, etc.)"
        ]
      },
      "Semester 4": {
        core: [
          "Object Oriented Programming",
          "Control Systems",
          "Signals and Systems",
          "Principles of Communication Systems",
          "Business Communication Skills"
        ],
        electives: [
          "Audit Course 2 (e.g., Indian Constitution, Cyber Security, etc.)"
        ]
      }
    },
    "Third Year": {
      "Semester 5": {
        core: [
          "Digital Communication",
          "Microcontrollers",
          "Analog Communication",
          "Electromagnetics",
          "Power Electronics and Applications"
        ],
        electives: [
          "Elective I (e.g., Biomedical Electronics, Consumer Electronics, Green Electronics, etc.)",
          "Audit Course 3 (e.g., Environmental Studies, Leadership and Personality Development, etc.)"
        ]
      },
      "Semester 6": {
        core: [
          "Digital Signal Processing",
          "VLSI Design and Technology",
          "Computer Networks",
          "Embedded Processors",
          "Control Systems II"
        ],
        electives: [
          "Elective II (e.g., Automotive Electronics, Industrial Automation, etc.)",
          "Audit Course 4 (e.g., Intellectual Property Rights, etc.)"
        ]
      }
    },
    "Final Year": {
      "Semester 7": {
        core: [
          "Internet of Things and Applications",
          "Wireless Communication",
          "Microwave Engineering",
          "Project Stage I"
        ],
        electives: [
          "Elective III (e.g., Artificial Intelligence, Robotics, Nano Electronics, etc.)",
          "Open Elective I (e.g., Entrepreneurship Development, etc.)"
        ]
      },
      "Semester 8": {
        core: [
          "Mobile Communication",
          "Broadband Communication Systems",
          "Project Stage II"
        ],
        electives: [
          "Elective IV (e.g., Machine Learning, Cyber Physical Systems, etc.)",
          "Open Elective II (e.g., Disaster Management, etc.)"
        ]
      }
    }
  };

  // Example: Add subject mappings for each branch here
  const branchSubjects: Record<string, Record<string, { core: string[]; electives?: string[] }>> = {
    "Mechanical Engineering": {
      "Semester 3": mechanicalSubjects["Second Year"]["Semester 3"],
      "Semester 4": mechanicalSubjects["Second Year"]["Semester 4"],
      "Semester 5": mechanicalSubjects["Third Year"]["Semester 5"],
      "Semester 6": mechanicalSubjects["Third Year"]["Semester 6"],
      "Semester 7": mechanicalSubjects["Final Year"]["Semester 7"],
      "Semester 8": mechanicalSubjects["Final Year"]["Semester 8"],
    },
    "Civil Engineering": {
      "Semester 3": civilSubjects["Second Year"]["Semester 3"],
      "Semester 4": civilSubjects["Second Year"]["Semester 4"],
      "Semester 5": civilSubjects["Third Year"]["Semester 5"],
      "Semester 6": civilSubjects["Third Year"]["Semester 6"],
      "Semester 7": civilSubjects["Final Year"]["Semester 7"],
      "Semester 8": civilSubjects["Final Year"]["Semester 8"],
    },
    "Electrical Engineering": {
      "Semester 3": electricalSubjects["Second Year"]["Semester 3"],
      "Semester 4": electricalSubjects["Second Year"]["Semester 4"],
      "Semester 5": electricalSubjects["Third Year"]["Semester 5"],
      "Semester 6": electricalSubjects["Third Year"]["Semester 6"],
      "Semester 7": electricalSubjects["Final Year"]["Semester 7"],
      "Semester 8": electricalSubjects["Final Year"]["Semester 8"],
    },
    "Computer Science and Engineering (CSE)": {
      "Semester 3": cseSubjects["Second Year"]["Semester 3"],
      "Semester 4": cseSubjects["Second Year"]["Semester 4"],
      "Semester 5": cseSubjects["Third Year"]["Semester 5"],
      "Semester 6": cseSubjects["Third Year"]["Semester 6"],
      "Semester 7": cseSubjects["Final Year"]["Semester 7"],
      "Semester 8": cseSubjects["Final Year"]["Semester 8"],
    },
    "Electronics and Communication Engineering (ECE)": {
      "Semester 3": eceSubjects["Second Year"]["Semester 3"],
      "Semester 4": eceSubjects["Second Year"]["Semester 4"],
      "Semester 5": eceSubjects["Third Year"]["Semester 5"],
      "Semester 6": eceSubjects["Third Year"]["Semester 6"],
      "Semester 7": eceSubjects["Final Year"]["Semester 7"],
      "Semester 8": eceSubjects["Final Year"]["Semester 8"],
    },
    "Chemical Engineering": {
      "Semester 3": chemicalSubjects["Second Year"]["Semester 3"],
      "Semester 4": chemicalSubjects["Second Year"]["Semester 4"],
      "Semester 5": chemicalSubjects["Third Year"]["Semester 5"],
      "Semester 6": chemicalSubjects["Third Year"]["Semester 6"],
      "Semester 7": chemicalSubjects["Final Year"]["Semester 7"],
      "Semester 8": chemicalSubjects["Final Year"]["Semester 8"],
    },
    "Artificial Intelligence and Machine Learning (AI & ML)": {
      "Semester 3": aimlSubjects["Second Year"]["Semester 3"],
      "Semester 4": aimlSubjects["Second Year"]["Semester 4"],
      "Semester 5": aimlSubjects["Third Year"]["Semester 5"],
      "Semester 6": aimlSubjects["Third Year"]["Semester 6"],
      "Semester 7": aimlSubjects["Final Year"]["Semester 7"],
      "Semester 8": aimlSubjects["Final Year"]["Semester 8"],
    },
    "Data Science and Engineering": {
      "Semester 3": dseSubjects["Second Year"]["Semester 3"],
      "Semester 4": dseSubjects["Second Year"]["Semester 4"],
      "Semester 5": dseSubjects["Third Year"]["Semester 5"],
      "Semester 6": dseSubjects["Third Year"]["Semester 6"],
      "Semester 7": dseSubjects["Final Year"]["Semester 7"],
      "Semester 8": dseSubjects["Final Year"]["Semester 8"],
    },
    "Robotics and Automation": {
      "Semester 3": roboticsSubjects["Second Year"]["Semester 3"],
      "Semester 4": roboticsSubjects["Second Year"]["Semester 4"],
      "Semester 5": roboticsSubjects["Third Year"]["Semester 5"],
      "Semester 6": roboticsSubjects["Third Year"]["Semester 6"],
      "Semester 7": roboticsSubjects["Final Year"]["Semester 7"],
      "Semester 8": roboticsSubjects["Final Year"]["Semester 8"],
    },
    "Mechatronics Engineering": {
      "Semester 3": mechatronicsSubjects["Second Year"]["Semester 3"],
      "Semester 4": mechatronicsSubjects["Second Year"]["Semester 4"],
      "Semester 5": mechatronicsSubjects["Third Year"]["Semester 5"],
      "Semester 6": mechatronicsSubjects["Third Year"]["Semester 6"],
      "Semester 7": mechatronicsSubjects["Final Year"]["Semester 7"],
      "Semester 8": mechatronicsSubjects["Final Year"]["Semester 8"],
    },
    "Cybersecurity Engineering": {
      "Semester 3": cyberSubjects["Second Year"]["Semester 3"],
      "Semester 4": cyberSubjects["Second Year"]["Semester 4"],
      "Semester 5": cyberSubjects["Third Year"]["Semester 5"],
      "Semester 6": cyberSubjects["Third Year"]["Semester 6"],
      "Semester 7": cyberSubjects["Final Year"]["Semester 7"],
      "Semester 8": cyberSubjects["Final Year"]["Semester 8"],
    },
    "Electronic and Telecommunication Engineering": {
      "Semester 3": entcSubjects["Second Year"]["Semester 3"],
      "Semester 4": entcSubjects["Second Year"]["Semester 4"],
      "Semester 5": entcSubjects["Third Year"]["Semester 5"],
      "Semester 6": entcSubjects["Third Year"]["Semester 6"],
      "Semester 7": entcSubjects["Final Year"]["Semester 7"],
      "Semester 8": entcSubjects["Final Year"]["Semester 8"],
    },
   
  };

  const BranchCard = ({ branch }: { branch: Branch }) => {
    const isFirstYear = branch.isFirstYear;
    const years = isFirstYear
      ? ["Semester 1", "Semester 2"]
      : [
          "Semester 3",
          "Semester 4",
          "Semester 5",
          "Semester 6",
          "Semester 7",
          "Semester 8"
        ];

    // Helper to get subjects by semester for any branch
    const getSubjectsBySemester = (branchName: string, semester: string) => {
      return branchSubjects[branchName]?.[semester];
    };

    // Helper to render subject with years
    const renderSubjectWithYears = (subject: string) => (
      <div>
        <Link
          to={`/subject/${encodeURIComponent(subject)}`}
          className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm font-bold"
          target="_blank"
          rel="noopener noreferrer"
        >
          {subject}
        </Link>
        <div className="flex gap-2 mt-1 ml-2">
          {["2023", "2022", "2021"].map((year) => (
            <Link
              key={year}
              to={`/subject/${encodeURIComponent(subject)}/${year}`}
              className="text-xs text-blue-500 hover:underline hover:text-blue-700 bg-blue-50 rounded px-2 py-0.5"
              target="_blank"
              rel="noopener noreferrer"
            >
              {year}
            </Link>
          ))}
        </div>
      </div>
    );

    return (
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden border-t-4 ${branch.borderColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
        <div className={`${branch.color} p-6 flex items-center justify-center`}>
          <div className="bg-white p-4 rounded-full shadow-md">
            {branch.icon}
          </div>
        </div>
        <div className="p-6">
          <h2
            className="text-xl font-semibold mb-4 text-gray-800 cursor-pointer flex justify-between items-center"
            onClick={() => toggleBranch(branch.name)}
          >
            {branch.name}
            {expandedBranch === branch.name ? (
              <FaChevronUp className="text-gray-500" />
            ) : (
              <FaChevronDown className="text-gray-500" />
            )}
          </h2>

          {expandedBranch === branch.name && (
            <div className="space-y-2">
              {/* Add SPPU heading for ENTC branch */}
              {branch.name === "Electronic and Telecommunication Engineering" && (
                <div className="font-semibold text-blue-700 mb-2">
                  SPPU University ENTC Subjects
                </div>
              )}
              {isFirstYear
                ? years.flatMap((year) =>
                    firstYearSubjects[year].map((subject, subjectIndex) => (
                      <div key={year + subjectIndex} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <FaBookOpen className="w-3 h-3 text-blue-400 mr-2" />
                        </div>
                        <div>
                          {renderSubjectWithYears(subject)}
                        </div>
                      </div>
                    ))
                  )
                : years.flatMap((year) => {
                    const details = getSubjectsBySemester(branch.name, year);
                    if (!details) return [];
                    const coreSubjects = details.core.map((subject, idx) => (
                      <div key={year + idx} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <FaBookOpen className="w-3 h-3 text-blue-400 mr-2" />
                        </div>
                        <div>
                          {renderSubjectWithYears(subject)}
                        </div>
                      </div>
                    ));
                    const electiveSubjects = details.electives
                      ? details.electives.map((elective, eidx) => (
                          <div key={year + "elective" + eidx} className="flex items-start ml-2">
                            <span className="font-medium text-indigo-600 text-sm mr-2">Elective:</span>
                            <span className="text-gray-600 text-sm">{elective}</span>
                          </div>
                        ))
                      : [];
                    return [...coreSubjects, ...electiveSubjects];
                  })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-700 to-indigo-900 text-white pt-32 pb-24 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-indigo-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Engineering Resources <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                  Reimagined
                </span>
              </h1>
              <p className="text-xl mb-8 max-w-2xl text-blue-100">
                The most comprehensive platform for engineering students with thousands of question papers, study materials, video lectures, and a thriving community.
              </p>
              <div className="max-w-xl relative mb-8">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
                  <FaSearch className="ml-4 text-blue-200" />
                  <input
                    type="text"
                    placeholder="Search for your branch..."
                    className="w-full p-4 bg-transparent text-white placeholder-blue-200 rounded-lg focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/resources" 
                  className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Explore Resources
                </Link>
                <Link 
                  to="/community" 
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Join Community
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-yellow-300 rounded-lg opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-purple-300 rounded-lg opacity-20 animate-pulse delay-300"></div>
                <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                    alt="Students studying"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                    <div className="flex items-center">
                      <div className="bg-blue-600 text-white p-3 rounded-full mr-3 shadow-md">
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
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600">Question Papers</div>
            <div className="mt-2 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Universities</div>
            <div className="mt-2 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="text-4xl font-bold text-blue-600 mb-2">100K+</div>
            <div className="text-gray-600">Students</div>
            <div className="mt-2 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="text-4xl font-bold text-blue-600 mb-2">5K+</div>
            <div className="text-gray-600">Study Materials</div>
            <div className="mt-2 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Everything You Need to Succeed</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides all the resources engineering students need in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-transparent hover:border-blue-500"
            >
              <div className="flex justify-center mb-6">
                <div className={`bg-gradient-to-br ${feature.gradient} p-4 rounded-full text-white shadow-md`}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Branches Section */}
      <div className="bg-gradient-to-b from-gray-100 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Explore Engineering Branches</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find resources for your specific engineering discipline
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'all' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              All Branches
            </button>
            <button
              onClick={() => setActiveTab('computer')}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'computer' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              Computer Related
            </button>
            <button
              onClick={() => setActiveTab('engineering')}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'engineering' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              Core Engineering
            </button>
            <button
              onClick={() => setActiveTab('science')}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'science' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              Science Based
            </button>
          </div>

          {/* Branches Grid */}
          {getFilteredBranches().length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredBranches().map((branch, index) => (
                <BranchCard key={index} branch={branch} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="text-gray-500 mb-4">No branches found matching your search</div>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">What Students Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from engineering students who've benefited from our resources
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
              <p className="text-gray-600 mb-6 italic relative pl-4 border-l-4 border-blue-200">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <div className={`${testimonial.avatarColor} text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mr-4 shadow-md`}>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.university}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">How would you rate EngiPortal?</h2>
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
                    className="cursor-pointer transition-colors duration-200 hover:scale-125 transform"
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
      <div className="relative bg-gradient-to-br from-blue-700 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-indigo-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Engineering Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
            Join over 100,000 engineering students who are already acing their academics with our resources.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/signup" 
              className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started for Free
            </Link>
            <Link 
              to="/premium" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Explore Premium Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;