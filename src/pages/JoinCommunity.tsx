import { useState } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

type User = {
  id: string;
  name: string;
  avatar: string;
  branch: string;
  year: number;
  skills?: string[];
};

type Discussion = {
  id: string;
  title: string;
  commentCount: number;
  author: User;
  timestamp: string;
  tags: string[];
};

type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
  prize?: string;
  participants: number;
  isOpenToAll: boolean;
  creator: User;
};

const JoinCommunity = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeBranch, setActiveBranch] = useState<string>('CSE');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Remove hardcoded sample data and use empty arrays or placeholders
  const [communityMembers] = useState<User[]>([]);

  const [discussions] = useState<Discussion[]>([]);

  const [events, setEvents] = useState<Event[]>([]);

  const branches = ['CSE', 'ECE', 'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Aerospace'];

  const filteredMembers = communityMembers
    .filter(member => 
      member.branch === activeBranch && 
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 12);

  const handleJoinCommunity = () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/login?redirect=/community';
    } else {
      // API call to join community
      console.log('User joined community');
    }
  };

  const handleShareCommunity = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join EngiPortal Community',
        text: 'Connect, collaborate, and create with engineering students on EngiPortal!',
        url: window.location.href,
      });
    } else {
      alert('Sharing is not supported in your browser.');
    }
  };

  // // Event creation state and handlers
  // const [newEvent, setNewEvent] = useState({
  //   title: '',
  //   date: '',
  //   description: '',
  //   prize: '',
  //   isOpenToAll: true,
  // });
  // const [showEventForm, setShowEventForm] = useState(false);

  // const handleCreateEvent = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!newEvent.title || !newEvent.date || !newEvent.description) return;

  //   const createdEvent: Event = {
  //     id: `e${events.length + 1}`,
  //     title: newEvent.title,
  //     date: newEvent.date,
  //     description: newEvent.description,
  //     prize: newEvent.prize,
  //     participants: 0,
  //     isOpenToAll: newEvent.isOpenToAll,
  //     creator: user || { id: '', name: '', avatar: '', branch: '', year: 0 } // No hardcoded fallback
  //   };

  //   setEvents([...events, createdEvent]);
  //   setNewEvent({ title: '', date: '', description: '', prize: '', isOpenToAll: true });
  //   setShowEventForm(false);
  // };

  // const handleRegisterForEvent = (eventId: string) => {
  //   // In a real app, this would make an API call
  //   setEvents(events.map(event => 
  //     event.id === eventId 
  //       ? { ...event, participants: event.participants + 1 } 
  //       : event
  //   ));
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Connect, Collaborate, Create</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join {communityMembers.length.toLocaleString()}+ engineering students sharing knowledge, solving problems, and building the future together.
          </p>
          <button 
            onClick={handleJoinCommunity}
            className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            {isAuthenticated ? 'Welcome Back!' : 'Join Now'}
          </button>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Community Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '📚', title: 'Study Groups', desc: 'Form or join subject-specific study groups' },
              { icon: '👥', title: 'Project Collaboration', desc: 'Find team members for hackathons and projects' },
              { icon: '💡', title: 'Expert Q&A', desc: 'Get answers from top performers and professionals' },
              { icon: '📁', title: 'Resource Sharing', desc: 'Share and discover the best study materials' },
              { icon: '🏆', title: 'Events & Hackathons', desc: 'Participate in or organize events and hackathons' } // <-- Added feature
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Members */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Meet Your Engineering Community</h2>
            <Link to="/members" className="text-indigo-600 hover:underline">View All Members</Link>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8">
            {filteredMembers.map(member => (
              <Link 
                key={member.id} 
                to={`/profile/${member.id}`}
                className="flex flex-col items-center group"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-2 overflow-hidden group-hover:ring-2 group-hover:ring-indigo-500 transition">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl text-indigo-600">{member.name.charAt(0)}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-center">{member.name}</span>
                <span className="text-xs text-gray-500">{member.branch}</span>
              </Link>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Find Members by Branch</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {branches.map(branch => (
                <button
                  key={branch}
                  onClick={() => setActiveBranch(branch)}
                  className={`px-4 py-2 rounded-full text-sm ${activeBranch === branch ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {branch}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search members..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Discussions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Trending Discussions</h2>
            <Link to="/discussions" className="text-indigo-600 hover:underline">Browse All Discussions</Link>
          </div>
          
          <div className="space-y-4">
            {discussions.map(discussion => (
              <Link 
                key={discussion.id} 
                to={`/discussion/${discussion.id}`}
                className="block p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{discussion.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span>Posted by {discussion.author.name} ({discussion.author.branch} {discussion.author.year})</span>
                      <span className="mx-2">•</span>
                      <span>{discussion.timestamp}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {discussion.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                    <span className="mr-1">💬</span>
                    <span>{discussion.commentCount}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {isAuthenticated && (
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Start a New Discussion</h3>
              <textarea 
                className="w-full p-4 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                rows={3}
                placeholder="What would you like to discuss?"
              />
              <div className="flex justify-between items-center">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                  Post Discussion
                </button>
                <span className="text-sm text-gray-500">Max 500 characters</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Community Says</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* No hardcoded testimonials */}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to join the conversation?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={handleJoinCommunity}
              className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              {isAuthenticated ? 'Go to Community Dashboard' : 'Join EngiCommunity Now'}
            </button>
            <Link 
              to="/features" 
              className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition duration-300"
            >
              Learn More About Features
            </Link>
            <button
              onClick={handleShareCommunity}
              className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300"
            >
              Share Community
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JoinCommunity;