import React, { useState } from 'react';

// Types
interface UserProfile {
  knowledgeLevel: string;
  learningGoals: string[];
  timeCommitment: string;
  learningStyles: string[];
}

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  resourceType: string;
  duration: number;
  dependencies: string[];
  priority: number;
  completed: boolean;
}

interface Roadmap {
  title: string;
  description: string;
  estimatedTotalHours: number;
  items: RoadmapItem[];
}

interface SkillAssessment {
  question: string;
  options: { value: string; label: string }[];
}

// Mock data
const skillAssessmentQuestions: SkillAssessment[] = [
  {
    question: "How would you rate your programming experience?",
    options: [
      { value: "beginner", label: "Beginner (just starting)" },
      { value: "intermediate", label: "Intermediate (can build basic projects)" },
      { value: "advanced", label: "Advanced (comfortable with complex projects)" },
      { value: "expert", label: "Expert (can teach others)" }
    ]
  },
  {
    question: "How familiar are you with machine learning concepts?",
    options: [
      { value: "none", label: "No experience" },
      { value: "basic", label: "Basic understanding" },
      { value: "intermediate", label: "Implemented simple models" },
      { value: "advanced", label: "Experienced with ML projects" }
    ]
  },
];

const learningGoals = [
  "Become a Machine Learning Engineer",
  "Learn AI for Business Applications",
  "Develop Computer Vision Projects",
  "Master Natural Language Processing",
  "Build AI-Powered Applications"
];

const learningStyles = [
  "Video Tutorials",
  "Reading Documentation",
  "Hands-on Projects",
  "Interactive Coding",
  "Theoretical Study"
];

const timeCommitments = [
  "1-5 hours per week",
  "5-10 hours per week",
  "10-20 hours per week",
  "20+ hours per week"
];

const AILearningRoadmap: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    knowledgeLevel: "",
    learningGoals: [],
    timeCommitment: "",
    learningStyles: [],
  });
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string>>({});
  const [generatedRoadmap, setGeneratedRoadmap] = useState<Roadmap | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleProfileChange = (field: keyof UserProfile, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAssessmentAnswer = (questionIndex: number, value: string) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const generateRoadmap = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockRoadmap: Roadmap = {
        title: `Personalized ${userProfile.learningGoals[0] || "AI"} Learning Path`,
        description: `Custom roadmap based on your ${userProfile.knowledgeLevel} level and interest in ${userProfile.learningGoals.join(", ")}`,
        estimatedTotalHours: userProfile.timeCommitment === "1-5 hours per week" ? 40 : 
                           userProfile.timeCommitment === "5-10 hours per week" ? 60 :
                           userProfile.timeCommitment === "10-20 hours per week" ? 100 : 200,
        items: [
          {
            id: "1",
            title: "Introduction to Python Programming",
            description: "Learn the basics of Python, the primary language for AI development",
            resourceType: "Course",
            duration: 10,
            dependencies: [],
            priority: 1,
            completed: false
          },
          {
            id: "2",
            title: "Mathematics for Machine Learning",
            description: "Linear algebra, calculus, and statistics fundamentals",
            resourceType: "Course",
            duration: 15,
            dependencies: ["1"],
            priority: 2,
            completed: false
          },
          {
            id: "3",
            title: "Machine Learning Fundamentals",
            description: "Core concepts and algorithms of machine learning",
            resourceType: "Course",
            duration: 20,
            dependencies: ["1", "2"],
            priority: 3,
            completed: false
          },
          {
            id: "4",
            title: "First ML Project",
            description: "Hands-on project to apply your knowledge",
            resourceType: "Project",
            duration: 15,
            dependencies: ["3"],
            priority: 4,
            completed: false
          }
        ]
      };
      
      setGeneratedRoadmap(mockRoadmap);
      setIsGenerating(false);
      setCurrentStep(4);
    }, 2000);
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return <UserProfileStep 
                 userProfile={userProfile} 
                 onChange={handleProfileChange} 
                 onNext={() => setCurrentStep(2)} 
               />;
      case 2:
        return <SkillAssessmentStep 
                 questions={skillAssessmentQuestions} 
                 answers={assessmentAnswers}
                 onAnswer={handleAssessmentAnswer}
                 onBack={() => setCurrentStep(1)}
                 onNext={() => setCurrentStep(3)}
               />;
      case 3:
        return <RoadmapPreviewStep 
                 userProfile={userProfile}
                 onGenerate={generateRoadmap}
                 onBack={() => setCurrentStep(2)}
                 isGenerating={isGenerating}
               />;
      case 4:
        return <RoadmapViewStep 
                 roadmap={generatedRoadmap}
                 onBack={() => setCurrentStep(3)}
                 onRestart={() => {
                   setCurrentStep(1);
                   setUserProfile({
                     knowledgeLevel: "",
                     learningGoals: [],
                     timeCommitment: "",
                     learningStyles: [],
                   });
                   setAssessmentAnswers({});
                   setGeneratedRoadmap(null);
                 }}
               />;
      default:
        return <UserProfileStep 
                 userProfile={userProfile} 
                 onChange={handleProfileChange} 
                 onNext={() => setCurrentStep(2)} 
               />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            AI-Powered Learning Roadmap
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get a personalized learning path tailored to your goals, experience, and preferences
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="mb-12 relative">
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step 
                    ? 'bg-indigo-600 border-indigo-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                } font-bold`}>
                  {step}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs font-medium capitalize whitespace-nowrap">
                  {step === 1 && 'Profile'}
                  {step === 2 && 'Assessment'}
                  {step === 3 && 'Preview'}
                  {step === 4 && 'Roadmap'}
                </div>
              </div>
            ))}
          </div>
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-0">
            <div 
              className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-in-out" 
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
};

// Step 1: User Profile
const UserProfileStep: React.FC<{
  userProfile: UserProfile;
  onChange: (field: keyof UserProfile, value: any) => void;
  onNext: () => void;
}> = ({ userProfile, onChange, onNext }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(userProfile.learningGoals);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(userProfile.learningStyles);

  const handleGoalToggle = (goal: string) => {
    const newGoals = selectedGoals.includes(goal)
      ? selectedGoals.filter(g => g !== goal)
      : [...selectedGoals, goal];
    
    setSelectedGoals(newGoals);
    onChange('learningGoals', newGoals);
  };

  const handleStyleToggle = (style: string) => {
    const newStyles = selectedStyles.includes(style)
      ? selectedStyles.filter(s => s !== style)
      : [...selectedStyles, style];
    
    setSelectedStyles(newStyles);
    onChange('learningStyles', newStyles);
  };

  const isFormValid = userProfile.knowledgeLevel && 
                     selectedGoals.length > 0 && 
                     userProfile.timeCommitment && 
                     selectedStyles.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us about your learning preferences</h2>
      <p className="text-gray-600 mb-8">We'll use this information to create your personalized roadmap</p>
      
      <div className="space-y-8">
        {/* Knowledge Level */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-3">Current Knowledge Level</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Beginner', 'Intermediate', 'Advanced'].map(level => (
              <div 
                key={level}
                onClick={() => onChange('knowledgeLevel', level.toLowerCase())}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  userProfile.knowledgeLevel === level.toLowerCase() 
                    ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                    userProfile.knowledgeLevel === level.toLowerCase() 
                      ? 'border-indigo-600 bg-indigo-600' 
                      : 'border-gray-400'
                  }`}>
                    {userProfile.knowledgeLevel === level.toLowerCase() && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">{level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Learning Goals */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-3">Learning Goals</label>
          <p className="text-gray-600 mb-4">Select all that apply</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {learningGoals.map(goal => (
              <div 
                key={goal}
                onClick={() => handleGoalToggle(goal)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedGoals.includes(goal) 
                    ? 'border-purple-500 bg-purple-50 shadow-md' 
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                }`}
              >
                <div className="flex items-start">
                  <div className={`h-6 w-6 rounded border-2 flex items-center justify-center mr-3 mt-0.5 ${
                    selectedGoals.includes(goal) 
                      ? 'border-purple-600 bg-purple-600' 
                      : 'border-gray-400'
                  }`}>
                    {selectedGoals.includes(goal) && (
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span>{goal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Time Commitment */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-3">Available Time Commitment</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeCommitments.map(time => (
              <div 
                key={time}
                onClick={() => onChange('timeCommitment', time)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  userProfile.timeCommitment === time 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                    userProfile.timeCommitment === time 
                      ? 'border-blue-600 bg-blue-600' 
                      : 'border-gray-400'
                  }`}>
                    {userProfile.timeCommitment === time && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Learning Styles */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-3">Preferred Learning Styles</label>
          <p className="text-gray-600 mb-4">Select all that apply</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningStyles.map(style => (
              <div 
                key={style}
                onClick={() => handleStyleToggle(style)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedStyles.includes(style) 
                    ? 'border-green-500 bg-green-50 shadow-md' 
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                }`}
              >
                <div className="flex items-start">
                  <div className={`h-6 w-6 rounded border-2 flex items-center justify-center mr-3 mt-0.5 ${
                    selectedStyles.includes(style) 
                      ? 'border-green-600 bg-green-600' 
                      : 'border-gray-400'
                  }`}>
                    {selectedStyles.includes(style) && (
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{style}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-10 flex justify-end">
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className={`px-8 py-3 rounded-xl font-medium text-lg transition-all duration-300 ${
            isFormValid 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Assessment
          <svg className="inline-block ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Step 2: Skill Assessment
const SkillAssessmentStep: React.FC<{
  questions: SkillAssessment[];
  answers: Record<number, string>;
  onAnswer: (questionIndex: number, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}> = ({ questions, answers, onAnswer, onBack, onNext }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onNext();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Skill Assessment</h2>
      <p className="text-gray-600 mb-8">Help us understand your current skill level</p>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-500">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-sm font-medium text-indigo-600">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          {questions[currentQuestion].question}
        </h3>
        
        <div className="space-y-4">
          {questions[currentQuestion].options.map(option => (
            <div 
              key={option.value}
              onClick={() => onAnswer(currentQuestion, option.value)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                answers[currentQuestion] === option.value
                  ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
              }`}
            >
              <div className="flex items-center">
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                  answers[currentQuestion] === option.value
                    ? 'border-indigo-600 bg-indigo-600' 
                    : 'border-gray-400'
                }`}>
                  {answers[currentQuestion] === option.value && (
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="font-medium">{option.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          <svg className="inline-block mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {currentQuestion === 0 ? 'Back to Profile' : 'Previous'}
        </button>
        
        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion]}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            answers[currentQuestion] 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentQuestion === questions.length - 1 ? 'Review and Generate' : 'Next Question'}
          <svg className="inline-block ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Quick navigation dots */}
      <div className="mt-8 flex justify-center space-x-3">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`h-3 w-3 rounded-full transition-colors duration-200 ${
              currentQuestion === index 
                ? 'bg-indigo-600' 
                : answers[index] ? 'bg-green-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to question ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Step 3: Roadmap Preview
const RoadmapPreviewStep: React.FC<{
  userProfile: UserProfile;
  onGenerate: () => void;
  onBack: () => void;
  isGenerating: boolean;
}> = ({ userProfile, onGenerate, onBack, isGenerating }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Your Profile</h2>
      <p className="text-gray-600 mb-8">Confirm your information before we generate your personalized roadmap</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100">
          <h3 className="font-semibold text-indigo-800 mb-4 text-lg">Learning Preferences</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-indigo-600 font-medium">Level</div>
              <div className="capitalize font-semibold text-gray-800">{userProfile.knowledgeLevel}</div>
            </div>
            <div>
              <div className="text-sm text-indigo-600 font-medium">Time Commitment</div>
              <div className="font-semibold text-gray-800">{userProfile.timeCommitment}</div>
            </div>
            <div>
              <div className="text-sm text-indigo-600 font-medium">Goals</div>
              <div className="mt-1">
                {userProfile.learningGoals.map(goal => (
                  <span key={goal} className="inline-block bg-indigo-100 text-indigo-800 text-xs px-3 py-1.5 rounded-full mr-2 mb-2 font-medium">
                    {goal}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-indigo-600 font-medium">Learning Styles</div>
              <div className="mt-1">
                {userProfile.learningStyles.map(style => (
                  <span key={style} className="inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1.5 rounded-full mr-2 mb-2 font-medium">
                    {style}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-4 text-lg">AI-Powered Recommendations</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-800">Personalized Learning Path</div>
                <p className="text-sm text-gray-600 mt-1">We'll create a customized roadmap based on your unique profile</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-800">Optimal Resource Selection</div>
                <p className="text-sm text-gray-600 mt-1">We'll recommend the best resources for your learning style</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-800">Time-Efficient Planning</div>
                <p className="text-sm text-gray-600 mt-1">We'll create a schedule that fits your availability</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          <svg className="inline-block mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Assessment
        </button>
        
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`px-8 py-3 rounded-xl font-medium text-lg transition-all duration-300 flex items-center ${
            isGenerating ? 'bg-indigo-400' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Your Roadmap...
            </>
          ) : (
            <>
              Generate My Roadmap
              <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Step 4: Roadmap View
const RoadmapViewStep: React.FC<{
  roadmap: Roadmap | null;
  onBack: () => void;
  onRestart: () => void;
}> = ({ roadmap, onBack, onRestart }) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleItemCompletion = (itemId: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (!roadmap) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Roadmap Generated</h2>
        <p className="text-gray-600 mb-6">There was an issue generating your roadmap. Please try again.</p>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        >
          Start Over
        </button>
      </div>
    );
  }

  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / roadmap.items.length) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">{roadmap.title}</h2>
            <p className="mb-4 opacity-90">{roadmap.description}</p>
          </div>
          <button 
            onClick={onRestart}
            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200 text-sm font-medium whitespace-nowrap mt-4 md:mt-0"
          >
            Create New Roadmap
          </button>
        </div>
        
        <div className="flex flex-wrap items-center justify-between mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center mr-6 mb-4">
            <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Estimated time: {roadmap.estimatedTotalHours} hours</span>
          </div>
          
          <div className="flex items-center mr-6 mb-4">
            <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{roadmap.items.length} learning steps</span>
          </div>
          
          <div className="flex items-center mb-4">
            <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{completedCount} of {roadmap.items.length} completed</span>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="bg-gray-100 px-8 py-4">
        <div className="flex items-center">
          <div className="w-full bg-gray-300 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="ml-4 text-sm font-medium text-gray-700">{progressPercentage}% Complete</span>
        </div>
      </div>
      
      <div className="p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Your Learning Path</h3>
        
        <div className="space-y-5">
          {roadmap.items.map((item, index) => {
            const isCompleted = completedItems[item.id];
            const canStart = index === 0 || item.dependencies.every(depId => completedItems[depId]);
            
            return (
              <div 
                key={item.id}
                className={`p-5 rounded-2xl border-l-4 ${
                  isCompleted 
                    ? 'border-green-500 bg-green-50' 
                    : canStart 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-300 bg-gray-100 opacity-75'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-600' 
                        : canStart 
                          ? 'bg-white border-indigo-500' 
                          : 'bg-gray-200 border-gray-400'
                    }`}>
                      {isCompleted ? (
                        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className={`font-medium ${canStart ? 'text-indigo-600' : 'text-gray-500'}`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-5 flex-1">
                    <h4 className="font-semibold text-gray-800 text-lg">{item.title}</h4>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                    
                    <div className="mt-4 flex flex-wrap items-center">
                      <span className="inline-flex items-center text-sm bg-gray-200 text-gray-800 rounded-full px-3 py-1.5 mr-2 mb-2">
                        <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.duration} hours
                      </span>
                      
                      <span className="inline-flex items-center text-sm bg-purple-200 text-purple-800 rounded-full px-3 py-1.5 mr-2 mb-2">
                        {item.resourceType}
                      </span>
                      
                      {item.priority <= 2 && (
                        <span className="inline-flex items-center text-sm bg-amber-200 text-amber-800 rounded-full px-3 py-1.5 mr-2 mb-2">
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          High Priority
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => toggleItemCompletion(item.id)}
                      disabled={!canStart}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isCompleted
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : canStart
                            ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? 'Completed' : canStart ? 'Mark Complete' : 'Locked'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-10 flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            <svg className="inline-block mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Preview
          </button>
          
          <div className="space-x-4">
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Export Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILearningRoadmap;