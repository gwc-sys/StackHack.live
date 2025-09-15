import React, { useState, useEffect } from 'react';

interface Problem {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  solved: boolean;
}

const Problems: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Mock data - replace with actual API call
  const mockProblems: Problem[] = [
    { id: 1, title: 'Two Sum', difficulty: 'easy', category: 'Arrays', solved: true },
    { id: 2, title: 'Reverse Linked List', difficulty: 'medium', category: 'Linked Lists', solved: false },
    { id: 3, title: 'Binary Tree Inorder Traversal', difficulty: 'medium', category: 'Trees', solved: true },
    { id: 4, title: 'Merge Intervals', difficulty: 'medium', category: 'Arrays', solved: false },
    { id: 5, title: 'Longest Palindromic Substring', difficulty: 'hard', category: 'Strings', solved: false },
    { id: 6, title: 'Valid Parentheses', difficulty: 'easy', category: 'Stacks', solved: true },
    { id: 7, title: 'Neural Network Basics', difficulty: 'medium', category: 'AI', solved: false },
    { id: 8, title: 'Pathfinding Algorithm', difficulty: 'hard', category: 'AI', solved: true },
  ];

  useEffect(() => {
    // Simulate API call
    setProblems(mockProblems);
    setFilteredProblems(mockProblems);
  }, []);

  useEffect(() => {
    filterProblems();
  }, [searchTerm, difficultyFilter, categoryFilter, problems]);

  const filterProblems = () => {
    let filtered = problems;

    if (searchTerm) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(problem => problem.difficulty === difficultyFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(problem => problem.category === categoryFilter);
    }

    setFilteredProblems(filtered);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const ProblemCard: React.FC<{ problem: Problem }> = ({ problem }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 hover:border-blue-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 mr-3 line-clamp-2">
          {problem.title}
        </h3>
        <div className="flex flex-col items-end gap-2">
          <span className={`${getDifficultyColor(problem.difficulty)} text-white px-3 py-1 rounded-full text-xs font-medium capitalize`}>
            {problem.difficulty}
          </span>
          {problem.solved && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
              ✅ Solved
            </span>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">
        <span className="font-medium">Category:</span> {problem.category}
      </p>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
          View Problem
        </button>
        <button className={`flex-1 ${
          problem.solved 
            ? 'bg-purple-500 hover:bg-purple-600' 
            : 'bg-green-500 hover:bg-green-600'
        } text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200`}>
          {problem.solved ? 'Review' : 'Solve'}
        </button>
      </div>
    </div>
  );

  const categories = Array.from(new Set(problems.map(p => p.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          📝 DSA & AI Problems
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Practice and master your problem-solving skills with curated challenges
        </p>
      </header>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
        <div className="relative flex-1 min-w-[300px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search problems by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-3xl font-bold text-blue-600 mb-2">{problems.length}</h3>
          <p className="text-gray-600 font-medium">Total Problems</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-3xl font-bold text-green-600 mb-2">
            {problems.filter(p => p.solved).length}
          </h3>
          <p className="text-gray-600 font-medium">Solved</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-3xl font-bold text-red-600 mb-2">
            {problems.filter(p => p.difficulty === 'hard').length}
          </h3>
          <p className="text-gray-600 font-medium">Hard Problems</p>
        </div>
      </div>

      {/* Problems Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Problems ({filteredProblems.length})
        </h2>
        
        {filteredProblems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map(problem => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No problems found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Additional Features */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">🚀 Pro Tips</h3>
        <ul className="text-blue-800 space-y-1">
          <li>• Start with easy problems to build confidence</li>
          <li>• Practice similar problems to reinforce patterns</li>
          <li>• Review solutions to understand optimal approaches</li>
          <li>• Track your progress with the statistics above</li>
        </ul>
      </div>
    </div>
  );
};

export default Problems;