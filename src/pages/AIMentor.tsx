import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIMentor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Mentor. I'm here 24/7 to answer your questions and provide guidance. What would you like to know?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "How can I improve my React skills?",
    "What's the best way to learn TypeScript?",
    "Can you explain Tailwind CSS?",
    "How do I deploy a React application?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: `I understand you're asking about "${inputText}". This is a great topic! As your AI mentor, I'd recommend checking official documentation first, then practicing with small projects. Would you like more specific resources?`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">AI Mentor</h1>
            <p className="text-xs text-gray-500">24/7 AI assistant</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">Online</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 shadow-md'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-md rounded-lg p-4 max-w-xs md:max-w-md">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        <div className="px-4 py-2 bg-white border-t">
          <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-2 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask your question..."
              className="flex-1 border border-gray-300 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isLoading || inputText.trim() === ''}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIMentor;