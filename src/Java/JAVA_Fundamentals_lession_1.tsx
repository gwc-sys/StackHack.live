// JavaFundamentalsHome.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================
// INTERFACES AND TYPES
// ============================================

interface Lesson {
  id: number;
  title: string;
  icon: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  topics: string[];
  completed: boolean;
  unlocked: boolean;
}

interface CourseStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

// ============================================
// COURSE DATA - UPDATED WITH JAVA FUNDAMENTAL CONCEPTS
// ============================================

const courseLessons: Lesson[] = [
  {
    id: 1,
    title: "Java Basics & Syntax",
    icon: "📝",
    description: "Learn Java syntax, structure, and write your first program",
    difficulty: 'Beginner',
    duration: "2 hours",
    topics: ["Java Syntax", "Hello World", "Comments", "Identifiers", "Keywords"],
    completed: true,
    unlocked: true,
  },
  {
    id: 2,
    title: "Data Types & Variables",
    icon: "🔢",
    description: "Master Java data types, variables, and type conversion",
    difficulty: 'Beginner',
    duration: "2.5 hours",
    topics: ["Primitive Types", "Reference Types", "Variables", "Constants", "Type Casting"],
    completed: true,
    unlocked: true,
  },
  {
    id: 3,
    title: "Operators & Expressions",
    icon: "➕",
    description: "Understand Java operators, expressions, and precedence",
    difficulty: 'Beginner',
    duration: "2 hours",
    topics: ["Arithmetic", "Relational", "Logical", "Assignment", "Bitwise", "Ternary"],
    completed: false,
    unlocked: true,
  },
  {
    id: 4,
    title: "Control Statements",
    icon: "🔄",
    description: "Learn decision making and loop control in Java",
    difficulty: 'Beginner',
    duration: "3 hours",
    topics: ["If-Else", "Switch", "For Loop", "While Loop", "Do-While", "Break/Continue"],
    completed: false,
    unlocked: true,
  },
  {
    id: 5,
    title: "Arrays & Strings",
    icon: "📦",
    description: "Work with arrays and string manipulation in Java",
    difficulty: 'Intermediate',
    duration: "3 hours",
    topics: ["Single/Multi Arrays", "String Class", "String Methods", "Array Operations"],
    completed: false,
    unlocked: false,
  },
  {
    id: 6,
    title: "Methods & Functions",
    icon: "⚙️",
    description: "Create reusable code with methods and understand scope",
    difficulty: 'Intermediate',
    duration: "3.5 hours",
    topics: ["Method Declaration", "Parameters", "Return Types", "Method Overloading", "Recursion"],
    completed: false,
    unlocked: false,
  },
];

const courseStats: CourseStat[] = [
  {
    label: "Total Lessons",
    value: "6",
    icon: "📚",
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Hands-on Exercises",
    value: "50+",
    icon: "💻",
    color: "from-green-500 to-green-600",
  },
  {
    label: "Coding Problems",
    value: "30+",
    icon: "🧩",
    color: "from-purple-500 to-purple-600",
  },
  {
    label: "Quizzes",
    value: "12",
    icon: "📝",
    color: "from-orange-500 to-orange-600",
  },
];

// ============================================
// COMPONENTS
// ============================================

const LessonCard: React.FC<{
  lesson: Lesson;
  onClick: () => void;
}> = ({ lesson, onClick }) => {
  return (
    <div
      className={`relative bg-white rounded-xl shadow-lg border-2 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        lesson.unlocked 
          ? 'cursor-pointer border-blue-100 hover:border-blue-300' 
          : 'cursor-not-allowed border-gray-100 opacity-75'
      }`}
      onClick={lesson.unlocked ? onClick : undefined}
    >
      {/* Lesson Status Badge */}
      <div className="absolute top-4 right-4">
        {lesson.completed ? (
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            ✓ Completed
          </span>
        ) : lesson.unlocked ? (
          <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            🔓 Available
          </span>
        ) : (
          <span className="bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            🔒 Locked
          </span>
        )}
      </div>

      <div className="p-6">
        {/* Lesson Header */}
        <div className="flex items-start space-x-4 mb-4">
          <div className={`text-3xl p-4 rounded-xl shadow-sm ${
            lesson.completed 
              ? 'bg-gradient-to-br from-green-100 to-green-50 text-green-600' 
              : 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600'
          }`}>
            {lesson.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Lesson {lesson.id}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {lesson.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{lesson.title}</h3>
            <div className="flex items-center mt-2 text-gray-600">
              <span className="mr-2">⏱️</span>
              <span className="text-sm font-medium">{lesson.duration}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-5 leading-relaxed">{lesson.description}</p>

        {/* Topics */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <span className="mr-2">📌</span> Topics Covered:
          </h4>
          <div className="flex flex-wrap gap-2">
            {lesson.topics.map((topic, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-100">
          <button
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
              lesson.unlocked
                ? lesson.completed
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:from-green-600 hover:to-green-700'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:from-blue-600 hover:to-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!lesson.unlocked}
          >
            {lesson.completed ? 'Review Lesson →' : lesson.unlocked ? 'Start Learning →' : 'Complete Previous Lessons'}
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      {lesson.unlocked && !lesson.completed && (
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000"
            style={{ width: `${lesson.id === 3 ? '40%' : lesson.id === 4 ? '20%' : '0%'}` }}
          ></div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ stat: CourseStat }> = ({ stat }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
            {stat.value}
          </div>
          <div className="text-sm text-gray-600 mt-2 font-medium">{stat.label}</div>
        </div>
        <div className={`bg-gradient-to-br ${stat.color} w-14 h-14 rounded-xl flex items-center justify-center shadow`}>
          <span className="text-2xl text-white">{stat.icon}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT - JAVA FUNDAMENTALS HOME
// ============================================

const JavaFundamentalsHome: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'curriculum' | 'overview' | 'resources'>('curriculum');

  const completedLessons = courseLessons.filter(lesson => lesson.completed).length;
  const totalLessons = courseLessons.length;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  const handleLessonClick = (lessonId: number) => {
    const lesson = courseLessons.find(l => l.id === lessonId);
    if (lesson && lesson.unlocked) {
      navigate(`/lesson/${lessonId}`);
    }
  };

  const handleStartLearning = () => {
    const nextLesson = courseLessons.find(lesson => !lesson.completed && lesson.unlocked);
    if (nextLesson) {
      handleLessonClick(nextLesson.id);
    } else {
      handleLessonClick(1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-2/3">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 font-semibold text-sm mb-6">
                🎯 Complete Beginner Course
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Java Programming
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Fundamentals Mastery
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-3xl leading-relaxed">
                A comprehensive journey through core Java concepts. Master syntax, data types, 
                control flow, arrays, methods, and more with hands-on exercises and real coding challenges.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleStartLearning}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
                >
                  <span className="mr-3">
                    {completedLessons > 0 ? '🚀 Continue Learning' : '🎬 Start Learning Now'}
                  </span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </button>
                <button className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all duration-300 hover:bg-gray-50">
                  📋 Download Syllabus
                </button>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0 lg:w-1/3">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="mr-3">📊</span> Your Learning Progress
                </h3>
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <span className="font-medium">Course Completion</span>
                    <span className="font-bold">{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000 shadow-lg"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600">{completedLessons}</div>
                    <div className="text-sm text-gray-700 font-medium">Lessons Done</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600">{totalLessons}</div>
                    <div className="text-sm text-gray-700 font-medium">Total Lessons</div>
                  </div>
                </div>
                <div className="mt-6 text-center text-sm text-gray-500">
                  ⚡ All progress saved automatically
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {courseStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Tabs */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
              Course Curriculum
            </h2>
            <div className="flex space-x-2 bg-gray-100 p-2 rounded-xl">
              {[
                { id: 'curriculum', label: '📚 Curriculum', icon: '📚' },
                { id: 'overview', label: '👁️ Overview', icon: '👁️' },
                { id: 'resources', label: '📖 Resources', icon: '📖' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-5 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'curriculum' && (
            <div>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Java Fundamentals - 6 Core Lessons
                  </h3>
                  <span className="text-gray-600 font-medium">
                    {completedLessons} of {totalLessons} lessons completed
                  </span>
                </div>
                <p className="text-gray-600">
                  Progress through each lesson sequentially. Complete all exercises and quizzes to unlock the next lesson.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {courseLessons.map(lesson => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onClick={() => handleLessonClick(lesson.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Course Overview</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">🎯</span> What You'll Learn
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "✓ Master Java syntax and programming basics",
                      "✓ Understand data types, variables, and operators",
                      "✓ Implement control flow with loops and conditionals",
                      "✓ Work with arrays and string manipulation",
                      "✓ Create reusable methods and functions",
                      "✓ Build a strong foundation for advanced Java",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-3 mt-1">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">🎓</span> Prerequisites
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "• Basic computer literacy",
                      "• No prior programming experience required",
                      "• Willingness to practice coding",
                      "• A computer with Java installed (we'll guide you)",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-3 mt-1">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Learning Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Java Documentation", icon: "📚", desc: "Official Java docs and API reference" },
                  { title: "Code Editor", icon: "💻", desc: "Online Java compiler for practice" },
                  { title: "Video Tutorials", icon: "🎥", desc: "Step-by-step video guides" },
                  { title: "Practice Problems", icon: "🧩", desc: "Coding challenges with solutions" },
                  { title: "Cheat Sheets", icon: "📄", desc: "Quick reference guides" },
                  { title: "Community Forum", icon: "👥", desc: "Ask questions and discuss" },
                ].map((resource, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="text-4xl mb-4">{resource.icon}</div>
                    <h4 className="font-bold text-gray-800 text-lg mb-2">{resource.title}</h4>
                    <p className="text-gray-600 text-sm">{resource.desc}</p>
                    <button className="mt-4 text-blue-600 font-medium flex items-center group">
                      Access Resource
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl transform rotate-1"></div>
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Master Java Fundamentals?
            </h2>
            <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of students who started their programming journey here
            </p>
            <button
              onClick={handleStartLearning}
              className="px-12 py-4 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {completedLessons > 0 ? 'Continue Learning Journey →' : 'Start Your Java Journey →'}
            </button>
            <div className="mt-8 flex justify-center space-x-6 text-blue-200 text-sm">
              <div className="flex items-center">
                <span className="mr-2">🎓</span>
                <span>Certificate of Completion</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">💼</span>
                <span>Real-world Projects</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🆓</span>
                <span>Free Forever</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <span className="mr-3">☕</span>
                Java Fundamentals
              </h3>
              <p className="text-gray-400">
                Master the core concepts of Java programming through interactive lessons and hands-on practice.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <div className="text-gray-400 hover:text-white cursor-pointer">Course Syllabus</div>
                <div className="text-gray-400 hover:text-white cursor-pointer">All Lessons</div>
                <div className="text-gray-400 hover:text-white cursor-pointer">Coding Exercises</div>
                <div className="text-gray-400 hover:text-white cursor-pointer">FAQ</div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Need Help?</h4>
              <p className="text-gray-400 mb-4">
                Contact us for any questions about the course.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
                Get Support
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © 2024 Java Fundamentals Course. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JavaFundamentalsHome;