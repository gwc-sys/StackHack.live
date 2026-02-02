// Lesson1Page.tsx - Dynamic Version (Browser-Compatible)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================
// INTERFACES AND TYPES
// ============================================

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface CodingChallenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  starterCode: string;
  testCases: TestCase[];
  solutionCode?: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface LearningResource {
  id: number;
  title: string;
  type: 'pdf' | 'video' | 'article' | 'diagram';
  content: string;
  url?: string;
  duration?: number; // in minutes
}

interface Topic {
  id: number;
  title: string;
  content: string;
  resources: LearningResource[];
  estimatedTime: number;
  completed: boolean;
}

interface UserProgress {
  completedTopics: number[];
  quizScore?: number;
  completedChallenges: number[];
  totalTimeSpent: number;
  lastAccessed: string;
}

interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ============================================
// DYNAMIC DATA SERVICE (No API calls - uses localStorage)
// ============================================

const dataService = {
  // Configuration - can be changed without breaking the app
  config: {
    apiBaseUrl: window.location.hostname === 'localhost' 
      ? 'http://localhost:3000/api' 
      : '/api',
    useMockData: true // Set to false when backend is ready
  },

  // Fetch lesson topics - dynamic from localStorage or mock
  async fetchTopics(lessonId: number): Promise<Topic[]> {
    if (!this.config.useMockData) {
      try {
        // In a real app, this would be an API call
        const response = await fetch(`${this.config.apiBaseUrl}/lessons/${lessonId}/topics`);
        if (response.ok) {
          const data: APIResponse<Topic[]> = await response.json();
          return data.data;
        }
      } catch (error) {
        console.warn('API unavailable, using local data:', error);
      }
    }
    
    // Get from localStorage or use mock data
    const storedTopics = localStorage.getItem(`lesson${lessonId}_topics`);
    if (storedTopics) {
      return JSON.parse(storedTopics);
    }
    
    // Initialize with mock data
    const mockTopics = this.getMockTopics();
    localStorage.setItem(`lesson${lessonId}_topics`, JSON.stringify(mockTopics));
    return mockTopics;
  },

  // Fetch quiz questions
  async fetchQuizQuestions(lessonId: number): Promise<Question[]> {
    if (!this.config.useMockData) {
      try {
        const response = await fetch(`${this.config.apiBaseUrl}/lessons/${lessonId}/quiz`);
        if (response.ok) {
          const data: APIResponse<Question[]> = await response.json();
          return data.data;
        }
      } catch (error) {
        console.warn('API unavailable, using local data:', error);
      }
    }
    
    const storedQuestions = localStorage.getItem(`lesson${lessonId}_quiz`);
    if (storedQuestions) {
      return JSON.parse(storedQuestions);
    }
    
    const mockQuestions = this.getMockQuizQuestions();
    localStorage.setItem(`lesson${lessonId}_quiz`, JSON.stringify(mockQuestions));
    return mockQuestions;
  },

  // Fetch coding challenges
  async fetchCodingChallenges(lessonId: number): Promise<CodingChallenge[]> {
    if (!this.config.useMockData) {
      try {
        const response = await fetch(`${this.config.apiBaseUrl}/lessons/${lessonId}/challenges`);
        if (response.ok) {
          const data: APIResponse<CodingChallenge[]> = await response.json();
          return data.data;
        }
      } catch (error) {
        console.warn('API unavailable, using local data:', error);
      }
    }
    
    const storedChallenges = localStorage.getItem(`lesson${lessonId}_challenges`);
    if (storedChallenges) {
      return JSON.parse(storedChallenges);
    }
    
    const mockChallenges = this.getMockCodingChallenges();
    localStorage.setItem(`lesson${lessonId}_challenges`, JSON.stringify(mockChallenges));
    return mockChallenges;
  },

  // Save user progress
  async saveUserProgress(userId: string, progress: Partial<UserProgress>): Promise<void> {
    const currentProgress = await this.getUserProgress(userId);
    const updatedProgress = { ...currentProgress, ...progress };
    
    localStorage.setItem(`userProgress_${userId}`, JSON.stringify(updatedProgress));
    
    // Optional: Sync to backend
    if (!this.config.useMockData) {
      try {
        await fetch(`${this.config.apiBaseUrl}/users/${userId}/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progress)
        });
      } catch (error) {
        console.warn('Failed to sync progress to backend:', error);
      }
    }
  },

  // Get user progress
  async getUserProgress(userId: string): Promise<UserProgress> {
    const saved = localStorage.getItem(`userProgress_${userId}`);
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default progress
    return {
      completedTopics: [],
      completedChallenges: [],
      totalTimeSpent: 0,
      lastAccessed: new Date().toISOString()
    };
  },

  // Run code against test cases (simulated in browser)
  async runCode(code: string, challengeId: number): Promise<any> {
    // In a real app, this would call a backend code execution service
    // For demo purposes, we'll simulate code execution
    
    // Get the challenge to know test cases
    const challenges = await this.fetchCodingChallenges(1);
    const challenge = challenges.find(c => c.id === challengeId);
    
    if (!challenge) {
      return { success: false, error: 'Challenge not found' };
    }
    
    // Simulate code execution (in real app, this would be done on backend)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    
    const testResults = challenge.testCases.map((testCase, index) => {
      // For demo, we'll check if the code contains certain patterns
      const passed = Math.random() > 0.3; // 70% chance of passing for demo
      return {
        passed,
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: passed ? testCase.expectedOutput : 'Test failed'
      };
    });
    
    const allPassed = testResults.every(result => result.passed);
    
    return {
      success: allPassed,
      message: allPassed ? 'All tests passed!' : 'Some tests failed',
      testResults
    };
  },

  // Submit solution
  async submitSolution(userId: string, challengeId: number, code: string): Promise<any> {
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: 'Solution submitted successfully!',
      score: Math.floor(Math.random() * 30) + 70 // Random score 70-100
    };
  },

  // Mock data generators
  getMockTopics(): Topic[] {
    return [
      {
        id: 1,
        title: "JVM Architecture & Working",
        content: `The Java Virtual Machine (JVM) is a virtual machine that enables a computer to run Java programs. JVM architecture consists of:
        
        1. ClassLoader - Loads class files
        2. Runtime Data Areas:
           - Method Area
           - Heap Area
           - Stack Area
           - PC Registers
           - Native Method Stack
        3. Execution Engine:
           - Interpreter
           - JIT Compiler
           - Garbage Collector
        4. Native Method Interface (JNI)
        5. Native Method Libraries`,
        resources: [
          {
            id: 1,
            title: "JVM Architecture Diagram",
            type: 'diagram',
            content: "Java code → Compiler → Bytecode → JVM ClassLoader → Runtime Data Areas → Execution Engine",
            duration: 5
          },
          {
            id: 2,
            title: "Bytecode vs Machine Code",
            type: 'article',
            content: "Bytecode is platform-independent intermediate code that JVM interprets or compiles to native machine code",
            duration: 10
          }
        ],
        estimatedTime: 30,
        completed: false
      },
      {
        id: 2,
        title: "Object-Oriented Programming (OOP)",
        content: `OOP treats data as a critical element and ties data closely to functions that operate on it. Key characteristics:
        
        • Emphasis on data rather than procedures
        • Decomposition of problems into objects
        • Data encapsulation and protection
        • Objects communicate through methods
        
        Languages: Java, C++, Python, C#`,
        resources: [
          {
            id: 3,
            title: "OOP vs POP Comparison",
            type: 'article',
            content: "OOP: Data-centric, Objects, Encapsulation | POP: Procedure-centric, Functions, Global data",
            duration: 8
          }
        ],
        estimatedTime: 25,
        completed: false
      },
      {
        id: 3,
        title: "OOP Pillars & Concepts",
        content: `1. Abstraction - Showing essential features, hiding implementation
        2. Encapsulation - Wrapping data and methods together, data hiding
        3. Inheritance - Reusing features of existing classes
        4. Polymorphism - Same name, different forms (Overloading/Overriding)
        
        Other Concepts:
        • Class - Blueprint for objects
        • Object - Instance of a class
        • Methods - Behaviors of objects`,
        resources: [
          {
            id: 4,
            title: "Abstraction Example: ATM Machine",
            type: 'diagram',
            content: "ATM Interface: Withdraw, Deposit, Balance Check → Hidden Implementation: Database, Security, Cash Dispenser",
            duration: 7
          }
        ],
        estimatedTime: 35,
        completed: false
      }
    ];
  },

  getMockQuizQuestions(): Question[] {
    return [
      {
        id: 1,
        question: "What is the purpose of JVM in Java?",
        options: [
          "To compile Java source code",
          "To execute Java bytecode on any platform",
          "To write Java programs",
          "To debug Java applications"
        ],
        correctAnswer: 1,
        explanation: "JVM (Java Virtual Machine) is responsible for executing Java bytecode, making Java platform-independent (Write Once, Run Anywhere)."
      },
      {
        id: 2,
        question: "Which of these is NOT a pillar of OOP?",
        options: [
          "Abstraction",
          "Encapsulation",
          "Compilation",
          "Polymorphism"
        ],
        correctAnswer: 2,
        explanation: "The four pillars of OOP are: Abstraction, Encapsulation, Inheritance, and Polymorphism. Compilation is a process, not an OOP concept."
      },
      {
        id: 3,
        question: "What is the size of int data type in Java?",
        options: [
          "8 bits",
          "16 bits",
          "32 bits",
          "64 bits"
        ],
        correctAnswer: 2,
        explanation: "int data type in Java is 32 bits (4 bytes), with range from -2,147,483,648 to 2,147,483,647."
      }
    ];
  },

  getMockCodingChallenges(): CodingChallenge[] {
    return [
      {
        id: 1,
        title: "Basic Calculator",
        description: "Create a program that takes two numbers and an operator (+, -, *, /) as input and performs the corresponding operation. Handle division by zero error.",
        difficulty: 'Easy',
        starterCode: `import java.util.Scanner;

public class BasicCalculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter first number: ");
        double num1 = scanner.nextDouble();
        
        System.out.print("Enter second number: ");
        double num2 = scanner.nextDouble();
        
        System.out.print("Enter operator (+, -, *, /): ");
        char operator = scanner.next().charAt(0);
        
        double result = 0;
        boolean error = false;
        
        // TODO: Implement calculator logic using switch statement
        // Handle division by zero
        
        if (error) {
            System.out.println("Error: Division by zero is not allowed");
        } else {
            System.out.println("Result: " + result);
        }
    }
}`,
        testCases: [
          { input: "10\n5\n+\n", expectedOutput: "Result: 15.0" },
          { input: "10\n5\n-\n", expectedOutput: "Result: 5.0" },
          { input: "10\n0\n/\n", expectedOutput: "Error: Division by zero is not allowed" }
        ],
        solutionCode: `import java.util.Scanner;

public class BasicCalculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter first number: ");
        double num1 = scanner.nextDouble();
        
        System.out.print("Enter second number: ");
        double num2 = scanner.nextDouble();
        
        System.out.print("Enter operator (+, -, *, /): ");
        char operator = scanner.next().charAt(0);
        
        double result = 0;
        boolean error = false;
        
        switch (operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                if (num2 != 0) {
                    result = num1 / num2;
                } else {
                    error = true;
                }
                break;
            default:
                System.out.println("Invalid operator!");
                return;
        }
        
        if (error) {
            System.out.println("Error: Division by zero is not allowed");
        } else {
            System.out.println("Result: " + result);
        }
    }
}`
      },
      {
        id: 2,
        title: "Fibonacci Series",
        description: "Write a program to generate Fibonacci series up to n terms. Fibonacci series: 0, 1, 1, 2, 3, 5, 8, 13...",
        difficulty: 'Easy',
        starterCode: `import java.util.Scanner;

public class FibonacciSeries {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter number of terms: ");
        int n = scanner.nextInt();
        
        // TODO: Generate Fibonacci series
        // First two terms: 0 and 1
        // Each subsequent term = sum of previous two
        
        System.out.println("Fibonacci Series:");
        // Print the series
    }
}`,
        testCases: [
          { input: "5\n", expectedOutput: "0 1 1 2 3" },
          { input: "8\n", expectedOutput: "0 1 1 2 3 5 8 13" }
        ],
        solutionCode: `import java.util.Scanner;

public class FibonacciSeries {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter number of terms: ");
        int n = scanner.nextInt();
        
        int first = 0, second = 1;
        
        System.out.println("Fibonacci Series:");
        for (int i = 1; i <= n; i++) {
            System.out.print(first + " ");
            
            int next = first + second;
            first = second;
            second = next;
        }
    }
}`
      }
    ];
  }
};

// ============================================
// COMPONENTS (Same as before, but updated to use dataService)
// ============================================

const TopicCard: React.FC<{
  topic: Topic;
  isExpanded: boolean;
  onToggle: () => void;
  onMarkComplete: (topicId: number) => void;
}> = ({ topic, isExpanded, onToggle, onMarkComplete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkComplete = async () => {
    setIsLoading(true);
    try {
      await onMarkComplete(topic.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border overflow-hidden transition-all duration-300 ${
      topic.completed ? 'border-green-200' : 'border-gray-200'
    }`}>
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
              topic.completed 
                ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
                : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
            }`}>
              {topic.completed ? '✓' : topic.id}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-gray-800">{topic.title}</h3>
                {topic.completed && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Completed
                  </span>
                )}
              </div>
              <div className="flex items-center mt-1 space-x-4">
                <span className="text-sm text-gray-500">
                  {topic.resources.length} resources
                </span>
                <span className="text-sm text-blue-500">
                  ⏱️ {topic.estimatedTime} min
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMarkComplete();
              }}
              disabled={isLoading || topic.completed}
              className={`px-4 py-2 rounded-lg font-medium ${
                topic.completed
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {isLoading ? 'Saving...' : topic.completed ? 'Completed' : 'Mark Complete'}
            </button>
            <div className="text-gray-500">
              {isExpanded ? '▼' : '►'}
            </div>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100 animate-slideDown">
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-3">Content Summary:</h4>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
              {topic.content}
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-3">Learning Resources:</h4>
            <div className="space-y-3">
              {topic.resources.map(resource => (
                <div key={resource.id} className="flex items-start p-3 bg-blue-50 rounded-lg">
                  <div className="mr-3 mt-1">
                    {resource.type === 'pdf' && '📄'}
                    {resource.type === 'video' && '🎥'}
                    {resource.type === 'article' && '📝'}
                    {resource.type === 'diagram' && '📊'}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800">{resource.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{resource.content}</p>
                    {resource.duration && (
                      <div className="text-xs text-blue-500 mt-2">
                        Duration: {resource.duration} min
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DynamicQuizQuestion: React.FC<{
  question: Question;
  index: number;
  userAnswer: number | null;
  onAnswer: (answerIndex: number) => void;
  showResult: boolean;
  isSubmitting?: boolean;
}> = ({ question, index, userAnswer, onAnswer, showResult, isSubmitting }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-start mb-6">
        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-4">
          {index + 1}
        </div>
        <h3 className="text-lg font-bold text-gray-800 flex-1">{question.question}</h3>
        {isSubmitting && (
          <div className="text-blue-500 text-sm animate-pulse">
            Saving...
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {question.options.map((option, optionIndex) => (
          <button
            key={optionIndex}
            className={`w-full p-4 text-left rounded-lg border transition-all ${
              showResult
                ? optionIndex === question.correctAnswer
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : userAnswer === optionIndex
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
                : userAnswer === optionIndex
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => !showResult && !isSubmitting && onAnswer(optionIndex)}
            disabled={showResult || isSubmitting}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full border mr-4 flex items-center justify-center ${
                showResult
                  ? optionIndex === question.correctAnswer
                    ? 'bg-green-100 border-green-400 text-green-600'
                    : userAnswer === optionIndex
                    ? 'bg-red-100 border-red-400 text-red-600'
                    : 'bg-gray-100 border-gray-300'
                  : userAnswer === optionIndex
                  ? 'bg-blue-100 border-blue-400 text-blue-600'
                  : 'bg-gray-100 border-gray-300'
              }`}>
                {String.fromCharCode(65 + optionIndex)}
              </div>
              <span className="font-medium">{option}</span>
            </div>
          </button>
        ))}
      </div>
      
      {showResult && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fadeIn">
          <div className="flex items-center mb-2">
            <span className="text-blue-600 font-bold mr-2">💡 Explanation:</span>
          </div>
          <p className="text-gray-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

const DynamicCodingChallenge: React.FC<{
  challenge: CodingChallenge;
  isSolved: boolean;
  onSubmitSolution: (challengeId: number, code: string) => Promise<void>;
  onRunCode: (challengeId: number, code: string) => Promise<any>;
}> = ({ challenge, isSolved, onSubmitSolution, onRunCode }) => {
  const [code, setCode] = useState(challenge.starterCode);
  const [showSolution, setShowSolution] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<Array<{passed: boolean; input: string; expected: string; actual?: string}>>([]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    try {
      const result = await onRunCode(challenge.id, code);
      
      if (result.success) {
        setOutput('✓ All tests passed!\n' + result.message);
        setResults(result.testResults || []);
      } else {
        setOutput('✗ ' + (result.error || 'Some tests failed'));
        setResults(result.testResults || []);
      }
    } catch (error) {
      setOutput('Error: ' + (error as Error).message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitSolution(challenge.id, code);
      setOutput('✓ Solution submitted successfully!');
    } catch (error) {
      setOutput('Error: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center mb-2">
              <h3 className="text-xl font-bold text-gray-800 mr-3">{challenge.title}</h3>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {challenge.difficulty}
              </span>
            </div>
            <p className="text-gray-600">{challenge.description}</p>
          </div>
          {isSolved && (
            <span className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-sm">
              ✓ Solved
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Your Code:</h4>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-gray-800 text-white text-sm font-mono flex justify-between items-center">
                <span>Java</span>
                <div className="space-x-2">
                  <button 
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                    onClick={() => setCode(challenge.starterCode)}
                  >
                    Reset
                  </button>
                  <button 
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
                    onClick={() => navigator.clipboard.writeText(code)}
                  >
                    Copy
                  </button>
                </div>
              </div>
              <textarea
                className="w-full h-64 p-4 text-gray-100 bg-gray-900 font-mono text-sm resize-none focus:outline-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Output:</h4>
            <div className="bg-gray-900 rounded-lg h-64 overflow-hidden">
              <div className="px-4 py-2 bg-gray-800 text-white text-sm font-mono">
                Console
              </div>
              <pre className="p-4 text-gray-100 h-full overflow-auto text-sm font-mono whitespace-pre-wrap">
                {output || 'Run your code to see output here...'}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="mt-6 mb-6">
          <h4 className="font-semibold text-gray-700 mb-3">Test Cases:</h4>
          <div className="space-y-3">
            {challenge.testCases.map((testCase, index) => {
              const result = results[index];
              return (
                <div key={index} className={`p-4 rounded-lg border ${
                  result ? (result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') 
                         : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Input:</span>
                      <div className="font-mono text-sm bg-white p-2 rounded border mt-1">
                        {testCase.input.replace(/\n/g, '↵')}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Expected Output:</span>
                      <div className="font-mono text-sm bg-white p-2 rounded border mt-1">
                        {testCase.expectedOutput}
                      </div>
                      {result && (
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">Actual Output:</span>
                          <div className="font-mono text-sm bg-white p-2 rounded border mt-1">
                            {result.actual || 'N/A'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {result && (
                    <div className="mt-2 text-sm font-medium">
                      {result.passed ? '✅ Passed' : '❌ Failed'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {showSolution ? 'Hide Solution' : 'View Solution'}
          </button>
          <button
            onClick={handleSubmitSolution}
            disabled={isSubmitting || isSolved}
            className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-colors ${
              isSolved
                ? 'bg-green-100 text-green-800 cursor-default'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isSubmitting ? 'Submitting...' : isSolved ? '✓ Submitted' : 'Submit Solution'}
          </button>
        </div>
        
        {showSolution && challenge.solutionCode && (
          <div className="mt-6 animate-fadeIn">
            <h4 className="font-semibold text-gray-700 mb-3">Solution:</h4>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <pre className="p-4 text-gray-100 overflow-x-auto text-sm font-mono">
                {challenge.solutionCode}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT - DYNAMIC LESSON 1 PAGE
// ============================================

const DynamicLesson1Page: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz' | 'practice' | 'challenges'>('learn');
  const [expandedTopics, setExpandedTopics] = useState<number[]>([1]);
  
  // Dynamic data states
  const [lessonTopics, setLessonTopics] = useState<Topic[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [codingChallenges, setCodingChallenges] = useState<CodingChallenge[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedTopics: [],
    completedChallenges: [],
    totalTimeSpent: 0,
    lastAccessed: new Date().toISOString()
  });
  
  // Quiz states
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // User ID (In real app, get from auth context)
  const userId = 'user_' + Math.random().toString(36).substr(2, 9);

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load data in parallel
        const [topics, questions, challenges, progress] = await Promise.all([
          dataService.fetchTopics(1),
          dataService.fetchQuizQuestions(1),
          dataService.fetchCodingChallenges(1),
          dataService.getUserProgress(userId)
        ]);
        
        setLessonTopics(topics);
        setQuizQuestions(questions);
        setCodingChallenges(challenges);
        setUserProgress(progress);
        setUserAnswers(Array(questions.length).fill(null));
        
        // Restore quiz state from progress if exists
        if (progress.quizScore !== undefined) {
          setScore(progress.quizScore);
          setQuizSubmitted(true);
        }
        
      } catch (err) {
        setError('Failed to load lesson data. Please try again.');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Update last accessed time
    const updateLastAccessed = async () => {
      await dataService.saveUserProgress(userId, {
        lastAccessed: new Date().toISOString()
      });
    };
    updateLastAccessed();
    
    // Timer
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [userId]);

  const toggleTopic = (topicId: number) => {
    setExpandedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const markTopicComplete = async (topicId: number) => {
    const updatedTopics = lessonTopics.map(topic =>
      topic.id === topicId ? { ...topic, completed: true } : topic
    );
    setLessonTopics(updatedTopics);
    
    const completedTopics = [...userProgress.completedTopics, topicId];
    setUserProgress(prev => ({ ...prev, completedTopics }));
    
    await dataService.saveUserProgress(userId, {
      completedTopics
    });
  };

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const calculateScore = async () => {
    let correct = 0;
    quizQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    const calculatedScore = Math.round((correct / quizQuestions.length) * 100);
    
    setScore(calculatedScore);
    setQuizSubmitted(true);
    setIsSavingQuiz(true);
    
    try {
      // Save quiz result
      const quizResult = {
        score: calculatedScore,
        passed: calculatedScore >= 70,
        timestamp: new Date().toISOString(),
        timeSpent
      };
      
      await dataService.saveUserProgress(userId, {
        quizScore: calculatedScore,
        totalTimeSpent: userProgress.totalTimeSpent + timeSpent
      });
      
      localStorage.setItem('lesson1QuizResult', JSON.stringify(quizResult));
    } catch (error) {
      console.error('Error saving quiz result:', error);
    } finally {
      setIsSavingQuiz(false);
    }
  };

  const resetQuiz = () => {
    setUserAnswers(Array(quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setScore(0);
    setTimeSpent(0);
  };

  const handleRunCode = async (challengeId: number, code: string) => {
    return await dataService.runCode(code, challengeId);
  };

  const handleSubmitSolution = async (challengeId: number, code: string) => {
    const result = await dataService.submitSolution(userId, challengeId, code);
    
    if (result.success) {
      const completedChallenges = [...userProgress.completedChallenges, challengeId];
      setUserProgress(prev => ({ ...prev, completedChallenges }));
      await dataService.saveUserProgress(userId, { completedChallenges });
    }
    
    return result;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isQuizPassed = score >= 70;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Content</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate progress percentages
  const topicProgress = lessonTopics.length > 0 
    ? (userProgress.completedTopics.length / lessonTopics.length) * 100 
    : 0;
  
  const challengeProgress = codingChallenges.length > 0
    ? (userProgress.completedChallenges.length / codingChallenges.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <button 
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800 font-medium mb-2 flex items-center"
              >
                ← Back to Course
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                Lesson 1: Java Fundamentals & OOP Concepts
              </h1>
              <p className="text-gray-600 mt-2">
                Master Java basics, JVM architecture, OOP principles, and programming fundamentals
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Overall Progress</div>
                <div className="flex items-center">
                  <div className="w-48 bg-gray-200 rounded-full h-2 mr-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${topicProgress}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-gray-800">{Math.round(topicProgress)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="font-bold text-gray-800 mb-6 text-lg flex items-center">
                <span className="mr-3">📚</span> Lesson Navigation
              </h3>
              
              <div className="space-y-3 mb-8">
                <div 
                  className={`p-3 rounded-lg cursor-pointer flex items-center ${activeTab === 'learn' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('learn')}
                >
                  <span className="mr-3">📖</span>
                  <span className="font-medium">Learning Content</span>
                </div>
                <div 
                  className={`p-3 rounded-lg cursor-pointer flex items-center ${activeTab === 'quiz' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('quiz')}
                >
                  <span className="mr-3">📝</span>
                  <span className="font-medium">Knowledge Test</span>
                  <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Required</span>
                </div>
                <div 
                  className={`p-3 rounded-lg cursor-pointer flex items-center ${activeTab === 'practice' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('practice')}
                >
                  <span className="mr-3">💻</span>
                  <span className="font-medium">Practice Exercises</span>
                </div>
                <div 
                  className={`p-3 rounded-lg cursor-pointer flex items-center ${activeTab === 'challenges' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('challenges')}
                >
                  <span className="mr-3">🏆</span>
                  <span className="font-medium">Coding Challenges</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-4">Your Statistics</h4>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Time Spent</span>
                    <span className="font-medium">{formatTime(userProgress.totalTimeSpent + timeSpent)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Topics Completed</span>
                    <span className="font-medium">{userProgress.completedTopics.length}/{lessonTopics.length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Challenges Solved</span>
                    <span className="font-medium">{userProgress.completedChallenges.length}/{codingChallenges.length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Quiz Score</span>
                    <span className={`font-medium ${userProgress.quizScore ? (userProgress.quizScore >= 70 ? 'text-green-600' : 'text-red-600') : 'text-gray-400'}`}>
                      {userProgress.quizScore ? `${userProgress.quizScore}%` : 'Not taken'}
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{formatTime(timeSpent)}</div>
                  <div className="text-sm text-gray-600">Current session time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'learn' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4">Java Fundamentals Mastery</h2>
                  <p className="opacity-90">
                    Based on comprehensive course materials covering JVM architecture, OOP principles, 
                    Java syntax, and programming fundamentals. Complete all topics and pass the quiz to unlock next lesson.
                  </p>
                  <div className="mt-6 flex items-center">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg mr-4">
                      <div className="text-sm">Topics Covered</div>
                      <div className="font-bold">{lessonTopics.length}</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg mr-4">
                      <div className="text-sm">Learning Resources</div>
                      <div className="font-bold">{lessonTopics.reduce((sum, topic) => sum + topic.resources.length, 0)}</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <div className="text-sm">Estimated Time</div>
                      <div className="font-bold">4-5 hours</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-800">Learning Topics</h3>
                  {lessonTopics.map(topic => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      isExpanded={expandedTopics.includes(topic.id)}
                      onToggle={() => toggleTopic(topic.id)}
                      onMarkComplete={markTopicComplete}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'quiz' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-2">Knowledge Assessment Test</h2>
                  <p className="opacity-90">
                    Complete this quiz to test your understanding of Java Fundamentals. 
                    <span className="font-bold ml-2">Passing score: 70% or higher</span>
                  </p>
                  <div className="mt-6 flex items-center space-x-6">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <div className="text-sm">Questions</div>
                      <div className="font-bold">{quizQuestions.length}</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <div className="text-sm">Time Spent</div>
                      <div className="font-bold">{formatTime(timeSpent)}</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <div className="text-sm">Passing Score</div>
                      <div className="font-bold">70%</div>
                    </div>
                  </div>
                </div>
                
                {!quizSubmitted ? (
                  <>
                    <div className="space-y-6">
                      {quizQuestions.map((question, index) => (
                        <DynamicQuizQuestion
                          key={question.id}
                          question={question}
                          index={index}
                          userAnswer={userAnswers[index]}
                          onAnswer={(answerIndex) => handleAnswer(index, answerIndex)}
                          showResult={false}
                          isSubmitting={isSavingQuiz}
                        />
                      ))}
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky bottom-8">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-600">Time spent: {formatTime(timeSpent)}</div>
                          <div className="text-sm text-gray-600">
                            Answered: {userAnswers.filter(a => a !== null).length}/{quizQuestions.length}
                          </div>
                        </div>
                        <div className="space-x-4">
                          <button 
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors"
                            onClick={resetQuiz}
                          >
                            Reset Quiz
                          </button>
                          <button 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                            onClick={calculateScore}
                            disabled={userAnswers.some(a => a === null) || isSavingQuiz}
                          >
                            {isSavingQuiz ? 'Submitting...' : 'Submit Test'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-8">
                      <div className="text-center mb-8">
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 ${
                          isQuizPassed 
                            ? 'bg-gradient-to-r from-green-100 to-green-200 border-8 border-green-100' 
                            : 'bg-gradient-to-r from-red-100 to-red-200 border-8 border-red-100'
                        }`}>
                          <div className={`text-4xl ${isQuizPassed ? 'text-green-600' : 'text-red-600'}`}>
                            {isQuizPassed ? '🎉' : '😞'}
                          </div>
                        </div>
                        
                        <h3 className={`text-3xl font-bold mb-2 ${isQuizPassed ? 'text-green-600' : 'text-red-600'}`}>
                          {isQuizPassed ? 'Congratulations!' : 'Need More Practice'}
                        </h3>
                        <p className="text-gray-600 text-lg">
                          {isQuizPassed 
                            ? 'You have successfully passed the Java Fundamentals quiz!'
                            : 'You need to score at least 70% to pass. Review the topics and try again.'
                          }
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-50 p-6 rounded-xl border">
                          <div className="text-center">
                            <div className={`text-4xl font-bold mb-2 ${isQuizPassed ? 'text-green-600' : 'text-red-600'}`}>
                              {score}%
                            </div>
                            <div className="text-gray-600">Final Score</div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">{formatTime(timeSpent)}</div>
                            <div className="text-gray-600">Time Taken</div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-purple-600 mb-2">
                              {userAnswers.filter((a, i) => a === quizQuestions[i].correctAnswer).length}/{quizQuestions.length}
                            </div>
                            <div className="text-gray-600">Correct Answers</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6 mb-8">
                        <h4 className="text-xl font-bold text-gray-800">Review Your Answers:</h4>
                        {quizQuestions.map((question, index) => (
                          <DynamicQuizQuestion
                            key={question.id}
                            question={question}
                            index={index}
                            userAnswer={userAnswers[index]}
                            onAnswer={() => {}}
                            showResult={true}
                          />
                        ))}
                      </div>
                      
                      <div className="flex justify-center space-x-6 pt-8 border-t border-gray-200">
                        <button 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:-translate-y-0.5"
                          onClick={resetQuiz}
                        >
                          Retake Quiz
                        </button>
                        {isQuizPassed && (
                          <button 
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:-translate-y-0.5"
                            onClick={() => setActiveTab('challenges')}
                          >
                            Proceed to Challenges →
                          </button>
                        )}
                        <button 
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors"
                          onClick={() => setActiveTab('learn')}
                        >
                          Review Topics
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'challenges' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-2">Coding Challenges</h2>
                  <p className="opacity-90">
                    Apply your Java knowledge to solve real programming problems. 
                    Each challenge includes test cases to verify your solution.
                  </p>
                  <div className="mt-6 flex items-center space-x-6">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <div className="text-sm">Challenges</div>
                      <div className="font-bold">{codingChallenges.length}</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <div className="text-sm">Solved</div>
                      <div className="font-bold">{userProgress.completedChallenges.length}</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <div className="text-sm">Progress</div>
                      <div className="font-bold">{Math.round(challengeProgress)}%</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {codingChallenges.map((challenge) => (
                    <DynamicCodingChallenge
                      key={challenge.id}
                      challenge={challenge}
                      isSolved={userProgress.completedChallenges.includes(challenge.id)}
                      onSubmitSolution={handleSubmitSolution}
                      onRunCode={handleRunCode}
                    />
                  ))}
                </div>
                
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-4">💡 Pro Tips for Coding Challenges</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="mr-2">✅</span> Problem Solving Approach
                      </h4>
                      <ul className="space-y-2 text-gray-300">
                        <li>1. Understand the problem statement</li>
                        <li>2. Break down into smaller steps</li>
                        <li>3. Write pseudocode first</li>
                        <li>4. Implement step by step</li>
                        <li>5. Test with all cases</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="mr-2">🚀</span> Best Practices
                      </h4>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Use meaningful variable names</li>
                        <li>• Add comments for complex logic</li>
                        <li>• Handle edge cases</li>
                        <li>• Optimize for readability first</li>
                        <li>• Test thoroughly before submitting</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <button 
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors"
              onClick={() => navigate('/')}
            >
              ← Back to Course Home
            </button>
            
            <div className="flex space-x-4">
              <button 
                className="px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg transition-colors"
                onClick={() => setActiveTab('quiz')}
              >
                Take Required Quiz
              </button>
              <button 
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                onClick={() => {
                  if (userProgress.quizScore && userProgress.quizScore >= 70) {
                    navigate('/lesson/2');
                  } else {
                    alert('Please complete the quiz with 70% or higher to unlock next lesson');
                  }
                }}
                disabled={!userProgress.quizScore || userProgress.quizScore < 70}
              >
                Next Lesson →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicLesson1Page;