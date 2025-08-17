import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, FiClock, FiMapPin, FiSearch, 
  FiX, FiChevronDown, FiChevronUp, FiExternalLink, 
  FiPlus, FiEdit2, FiTrash2, FiShare2
} from 'react-icons/fi';
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark } from 'react-icons/fa';

// Type definitions
type EventType = 'hackathon' | 'workshop' | 'conference' | 'networking' | 'webinar' | 'competition';
type EventCategory = 'Web3' | 'AI' | 'Cloud' | 'Mobile' | 'DevOps' | 'Blockchain' | 'Cybersecurity' | 'Data Science' | 'UI/UX';
type EventStatus = 'upcoming' | 'live' | 'completed';

interface Event {
  id: number;
  title: string;
  date: string;
  startDate: Date;
  endDate: Date;
  time: string;
  location: string;
  type: EventType;
  category: EventCategory;
  image: string;
  description: string;
  longDescription: string;
  isFeatured: boolean;
  status: EventStatus;
  organizer: string;
  organizerLogo: string;
  capacity: number;
  registered: number;
  price: number;
  tags: string[];
  createdBy?: string; // Track who created the event
  isApproved?: boolean; // For admin approval
  speakers?: Speaker[];
  schedule?: ScheduleItem[];
  requirements?: string[];
  prizes?: Prize[];
  socialLinks?: SocialLinks;
}

interface Speaker {
  id: number;
  name: string;
  title: string;
  company: string;
  avatar: string;
}

interface ScheduleItem {
  time: string;
  title: string;
  speaker?: string;
  description: string;
}

interface Prize {
  title: string;
  value: string;
  description: string;
}

interface SocialLinks {
  website?: string;
  twitter?: string;
  linkedin?: string;
  discord?: string;
}

const EventsPage = () => {
  // State management
  const [activeFilter, setActiveFilter] = useState<EventType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'this-week' | 'this-month'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'popularity'>('date');
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    date: '',
    startDate: new Date(),
    endDate: new Date(),
    time: '',
    location: '',
    type: 'hackathon',
    category: 'Web3',
    description: '',
    longDescription: '',
    isFeatured: false,
    organizer: '',
    capacity: 0,
    price: 0,
    tags: [],
    createdBy: 'currentUser', // In a real app, this would be the logged-in user
    isApproved: true // Set to false if you want admin approval
  });
  const [currentUserRole] = useState<'user' | 'admin'>('admin'); // Change to 'user' for regular users
  const searchRef = useRef<HTMLInputElement>(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleEvents: Event[] = [
      // ... (same sample events as before)
    ];
    setEvents(sampleEvents);
  }, []);

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Events', icon: <FiCalendar /> },
    { value: 'hackathon', label: 'Hackathons', icon: <FiCalendar /> },
    { value: 'workshop', label: 'Workshops', icon: <FiCalendar /> },
    { value: 'conference', label: 'Conferences', icon: <FiCalendar /> },
    { value: 'networking', label: 'Networking', icon: <FiCalendar /> },
    { value: 'webinar', label: 'Webinars', icon: <FiCalendar /> },
    { value: 'competition', label: 'Competitions', icon: <FiCalendar /> }
  ];

  const categoryOptions: EventCategory[] = [
    'Web3', 'AI', 'Cloud', 'Mobile', 'DevOps', 'Blockchain', 
    'Cybersecurity', 'Data Science', 'UI/UX'
  ];

  const dateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' }
  ];

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      // Only show approved events unless admin
      if (currentUserRole !== 'admin' && !event.isApproved) return false;
      
      const matchesFilter = activeFilter === 'all' || event.type === activeFilter;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategories = selectedCategories.length === 0 || selectedCategories.includes(event.category);
      
      const now = new Date();
      let matchesDate = false;
      if (dateFilter === 'all') {
        matchesDate = true;
      } else if (dateFilter === 'upcoming') {
        matchesDate = event.startDate > now;
      } else if (dateFilter === 'this-week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        matchesDate = event.startDate >= startOfWeek && event.startDate <= endOfWeek;
      } else if (dateFilter === 'this-month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        matchesDate = event.startDate >= startOfMonth && event.startDate <= endOfMonth;
      }

      return matchesFilter && matchesSearch && matchesCategories && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return a.startDate.getTime() - b.startDate.getTime();
      } else {
        // Sort by popularity (registered/capacity ratio)
        const aRatio = a.registered / a.capacity;
        const bRatio = b.registered / b.capacity;
        return bRatio - aRatio;
      }
    });

  // Event handlers
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    document.body.style.overflow = 'auto';
  };

  const handleCreateEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewEvent(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'tags') {
      setNewEvent(prev => ({ ...prev, tags: value.split(',').map(tag => tag.trim()) }));
    } else if (name === 'startDate' || name === 'endDate') {
      setNewEvent(prev => ({ ...prev, [name]: new Date(value) }));
    } else {
      setNewEvent(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format dates
    const formattedDate = `${newEvent.startDate?.toLocaleString('default', { month: 'short' })} ${newEvent.startDate?.getDate()}-${newEvent.endDate?.getDate()}, ${newEvent.startDate?.getFullYear()}`;
    
    const completeEvent: Event = {
      ...newEvent,
      id: Math.max(...events.map(e => e.id), 0) + 1,
      date: formattedDate,
      image: newEvent.image || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      status: 'upcoming',
      registered: 0,
      organizerLogo: newEvent.organizerLogo || 'https://pbs.twimg.com/profile_images/1452637606559326217/GFz_V-4O_400x400.jpg',
      socialLinks: {},
      createdBy: 'currentUser',
      isApproved: currentUserRole === 'admin' // Auto-approve for admins
    } as Event;
    
    setEvents(prev => [completeEvent, ...prev]);
    setIsCreateModalOpen(false);
    resetNewEventForm();
  };

  const resetNewEventForm = () => {
    setNewEvent({
      title: '',
      date: '',
      startDate: new Date(),
      endDate: new Date(),
      time: '',
      location: '',
      type: 'hackathon',
      category: 'Web3',
      description: '',
      longDescription: '',
      isFeatured: false,
      organizer: '',
      capacity: 0,
      price: 0,
      tags: [],
      createdBy: 'currentUser',
      isApproved: currentUserRole === 'admin'
    });
  };

  const handleEditEvent = (event: Event) => {
    setNewEvent({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setEvents(prev => 
      prev.map(event => 
        event.id === newEvent.id ? { ...event, ...newEvent } : event
      )
    );
    setIsEditModalOpen(false);
    resetNewEventForm();
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const toggleFavorite = (eventId: number) => {
    setFavorites(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId) 
        : [...prev, eventId]
    );
  };

  const toggleBookmark = (eventId: number) => {
    setBookmarks(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId) 
        : [...prev, eventId]
    );
  };

  const toggleCategory = (category: EventCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const approveEvent = (id: number) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, isApproved: true } : event
      )
    );
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && searchRef.current) {
        e.preventDefault();
        searchRef.current.focus();
      }
      if (e.key === 'Escape' && (isModalOpen || isCreateModalOpen || isEditModalOpen)) {
        closeModal();
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isCreateModalOpen, isEditModalOpen]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700">College Events Hub</h1>
          <div className="flex items-center gap-4">
            {currentUserRole === 'admin' && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                Admin Mode
              </span>
            )}
            <button 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <FiPlus /> Create Event
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white pt-32 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover & Create Events
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Join our community events or host your own hackathons and workshops
          </p>
          <div className="max-w-2xl mx-auto flex gap-2 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300">
              <FiSearch size={20} />
            </div>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search events... (Press '/' to focus)"
              className="flex-grow p-4 pl-12 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Filters and Sorting */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Type Filters */}
            <div className="w-full md:w-auto">
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
                      activeFilter === option.value
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveFilter(option.value as EventType | 'all')}
                  >
                    {option.icon}
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm"
              onClick={() => setExpandedFilters(!expandedFilters)}
            >
              {expandedFilters ? <FiChevronUp /> : <FiChevronDown />}
              Advanced Filters
            </motion.button>

            {/* Sorting */}
            <div className="w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Sort by:</span>
                <select 
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'popularity')}
                >
                  <option value="date">Date</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {expandedFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-4 bg-white rounded-lg shadow-md p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Filter */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Date Range</h3>
                    <div className="flex flex-wrap gap-2">
                      {dateOptions.map(option => (
                        <button
                          key={option.value}
                          className={`px-3 py-1 rounded-full text-sm ${
                            dateFilter === option.value
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => setDateFilter(option.value as any)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {categoryOptions.map(category => (
                        <button
                          key={category}
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedCategories.includes(category)
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => toggleCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Admin Approval Section */}
        {currentUserRole === 'admin' && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
            {events.filter(e => !e.isApproved).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.filter(e => !e.isApproved).map(event => (
                  <div key={event.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                    <h3 className="font-bold mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">By: {event.organizer}</span>
                      <button 
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                        onClick={() => approveEvent(event.id)}
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No events pending approval</p>
            )}
          </div>
        )}

        {/* Event Cards Grid */}
        {filteredEvents.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Event Image */}
                <div 
                  className="relative h-48 bg-gray-200 cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {!event.isApproved && (
                      <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Pending Approval
                      </span>
                    )}
                    {event.isFeatured && (
                      <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                    {event.status === 'live' && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                        <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                        LIVE NOW
                      </span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {(currentUserRole === 'admin' || event.createdBy === 'currentUser') && (
                      <>
                        <button 
                          className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(event);
                          }}
                        >
                          <FiEdit2 className="text-blue-500" />
                        </button>
                        <button 
                          className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                          }}
                        >
                          <FiTrash2 className="text-red-500" />
                        </button>
                      </>
                    )}
                    <button 
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(event.id);
                      }}
                    >
                      {favorites.includes(event.id) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-700" />
                      )}
                    </button>
                    <button 
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(event.id);
                      }}
                    >
                      {bookmarks.includes(event.id) ? (
                        <FaBookmark className="text-indigo-500" />
                      ) : (
                        <FaRegBookmark className="text-gray-700" />
                      )}
                    </button>
                  </div>
                  
                  {/* Event Type */}
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white text-indigo-700 text-xs font-semibold px-2 py-1 rounded">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {event.category}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center">
                      <FiCalendar className="mr-1" /> {event.date}
                    </span>
                  </div>

                  <h3 
                    className="text-xl font-bold mb-2 cursor-pointer hover:text-indigo-600 transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                  <div className="flex items-center text-gray-500 mb-4">
                    <FiMapPin className="mr-2 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>

                  {/* Progress bar for registration */}
                  {event.capacity > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>{event.registered} registered</span>
                        <span>Capacity: {event.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (event.registered / event.capacity) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto flex justify-between items-center">
                    <button 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
                      onClick={() => handleEventClick(event)}
                    >
                      View Details
                    </button>
                    <span className="text-sm font-medium text-gray-500 flex items-center">
                      <FiClock className="mr-1" /> {event.time}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            <button 
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
                setSelectedCategories([]);
                setDateFilter('all');
              }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* Create Event Modal */}
      <AnimatePresence>
        {(isCreateModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
              }}
            ></motion.div>

            {/* Modal Content */}
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25 }}
                className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                >
                  <FiX size={24} />
                </button>

                {/* Modal Content */}
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    {isEditModalOpen ? 'Edit Event' : 'Create New Event'}
                  </h2>
                  
                  <form onSubmit={isEditModalOpen ? handleUpdateEvent : handleCreateEventSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Event Title*</label>
                          <input
                            type="text"
                            name="title"
                            value={newEvent.title}
                            onChange={handleCreateEventChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Event Type*</label>
                          <select
                            name="type"
                            value={newEvent.type}
                            onChange={handleCreateEventChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                          >
                            <option value="hackathon">Hackathon</option>
                            <option value="workshop">Workshop</option>
                            <option value="conference">Conference</option>
                            <option value="networking">Networking</option>
                            <option value="webinar">Webinar</option>
                            <option value="competition">Competition</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                          <select
                            name="category"
                            value={newEvent.category}
                            onChange={handleCreateEventChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                          >
                            {categoryOptions.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
                          <input
                            type="text"
                            name="location"
                            value={newEvent.location}
                            onChange={handleCreateEventChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                      </div>
                      
                      {/* Dates */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date*</label>
                          <input
                            type="date"
                            name="startDate"
                            value={newEvent.startDate?.toISOString().split('T')[0]}
                            onChange={handleCreateEventChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date*</label>
                          <input
                            type="date"
                            name="endDate"
                            value={newEvent.endDate?.toISOString().split('T')[0]}
                            onChange={handleCreateEventChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time*</label>
                          <input
                            type="text"
                            name="time"
                            value={newEvent.time}
                            onChange={handleCreateEventChange}
                            placeholder="e.g., 10:00 AM - 6:00 PM"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="isFeatured"
                            checked={newEvent.isFeatured || false}
                            onChange={handleCreateEventChange}
                            className="mr-2"
                            id="featuredCheckbox"
                            disabled={currentUserRole !== 'admin'}
                          />
                          <label htmlFor="featuredCheckbox" className="text-sm font-medium text-gray-700">
                            Feature this event {currentUserRole !== 'admin' && '(Admin only)'}
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Short Description*</label>
                      <textarea
                        name="description"
                        value={newEvent.description}
                        onChange={handleCreateEventChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
                      <textarea
                        name="longDescription"
                        value={newEvent.longDescription}
                        onChange={handleCreateEventChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        rows={5}
                      />
                    </div>
                    
                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Name*</label>
                        <input
                          type="text"
                          name="organizer"
                          value={newEvent.organizer}
                          onChange={handleCreateEventChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Logo URL</label>
                        <input
                          type="text"
                          name="organizerLogo"
                          value={newEvent.organizerLogo || ''}
                          onChange={handleCreateEventChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="Optional"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <input
                          type="number"
                          name="capacity"
                          value={newEvent.capacity || 0}
                          onChange={handleCreateEventChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input
                          type="number"
                          name="price"
                          value={newEvent.price || 0}
                          onChange={handleCreateEventChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          min="0"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                        <input
                          type="text"
                          name="tags"
                          value={newEvent.tags?.join(', ') || ''}
                          onChange={handleCreateEventChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="e.g., blockchain, web3, ethereum"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Image URL</label>
                        <input
                          type="text"
                          name="image"
                          value={newEvent.image || ''}
                          onChange={handleCreateEventChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          placeholder="Optional - will use default if empty"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setIsCreateModalOpen(false);
                          setIsEditModalOpen(false);
                          resetNewEventForm();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        {isEditModalOpen ? 'Update Event' : 'Create Event'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedEvent && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            ></motion.div>

            {/* Modal Content */}
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25 }}
                className="relative bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
                  onClick={closeModal}
                >
                  <FiX size={24} />
                </button>

                {/* Modal Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  {/* Left Column - Event Image */}
                  <div className="lg:col-span-2 relative">
                    <div className="h-64 lg:h-full">
                      <img
                        src={selectedEvent.image}
                        alt={selectedEvent.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    
                    {/* Floating Info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {!selectedEvent.isApproved && (
                          <span className="bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                            Pending Approval
                          </span>
                        )}
                        {selectedEvent.isFeatured && (
                          <span className="bg-purple-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                            Featured Event
                          </span>
                        )}
                        {selectedEvent.status === 'live' && (
                          <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center">
                            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                            LIVE NOW
                          </span>
                        )}
                        <span className="bg-white text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full">
                          {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                        </span>
                        <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
                          {selectedEvent.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Event Details */}
                  <div className="p-6 lg:p-8 lg:col-span-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{selectedEvent.title}</h2>
                        <div className="flex items-center text-gray-500 mb-2">
                          <FiCalendar className="mr-2" />
                          <span>{selectedEvent.date}</span>
                        </div>
                        <div className="flex items-center text-gray-500 mb-4">
                          <FiClock className="mr-2" />
                          <span>{selectedEvent.time}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(currentUserRole === 'admin' || selectedEvent.createdBy === 'currentUser') && (
                          <>
                            <button 
                              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                              onClick={() => {
                                handleEditEvent(selectedEvent);
                                closeModal();
                              }}
                            >
                              <FiEdit2 className="text-blue-500" />
                            </button>
                            <button 
                              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                              onClick={() => {
                                handleDeleteEvent(selectedEvent.id);
                                closeModal();
                              }}
                            >
                              <FiTrash2 className="text-red-500" />
                            </button>
                          </>
                        )}
                        <button 
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                          onClick={() => toggleFavorite(selectedEvent.id)}
                        >
                          {favorites.includes(selectedEvent.id) ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaRegHeart className="text-gray-700" />
                          )}
                        </button>
                        <button 
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                          onClick={() => toggleBookmark(selectedEvent.id)}
                        >
                          {bookmarks.includes(selectedEvent.id) ? (
                            <FaBookmark className="text-indigo-500" />
                          ) : (
                            <FaRegBookmark className="text-gray-700" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center text-gray-700 mb-2">
                        <FiMapPin className="mr-2" />
                        <span className="font-medium">Location:</span>
                      </div>
                      <p className="text-gray-600 ml-6">{selectedEvent.location}</p>
                    </div>

                    {/* Organizer */}
                    <div className="mb-6 flex items-center">
                      <div className="mr-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                          {selectedEvent.organizerLogo && (
                            <img 
                              src={selectedEvent.organizerLogo} 
                              alt={selectedEvent.organizer}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Organized by</p>
                        <p className="font-medium">{selectedEvent.organizer}</p>
                      </div>
                    </div>

                    {/* Registration Info */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium">
                          {selectedEvent.price > 0 ? `$${selectedEvent.price}` : 'Free'}
                        </span>
                        {selectedEvent.capacity > 0 && (
                          <span className="text-sm text-gray-500">
                            {selectedEvent.capacity - selectedEvent.registered} spots left
                          </span>
                        )}
                      </div>
                      {selectedEvent.capacity > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (selectedEvent.registered / selectedEvent.capacity) * 100)}%` }}
                          ></div>
                        </div>
                      )}
                      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors">
                        Register Now
                      </button>
                    </div>

                    {/* Social Links */}
                    {selectedEvent.socialLinks && (
                      <div className="mb-6">
                        <h4 className="font-medium mb-2">Connect</h4>
                        <div className="flex gap-3">
                          {selectedEvent.socialLinks.website && (
                            <a 
                              href={selectedEvent.socialLinks.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              <FiExternalLink />
                            </a>
                          )}
                          {selectedEvent.socialLinks.twitter && (
                            <a 
                              href={`https://twitter.com/${selectedEvent.socialLinks.twitter}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                              </svg>
                            </a>
                          )}
                          {selectedEvent.socialLinks.linkedin && (
                            <a 
                              href={`https://linkedin.com/company/${selectedEvent.socialLinks.linkedin}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                              </svg>
                            </a>
                          )}
                          {selectedEvent.socialLinks.discord && (
                            <a 
                              href={`https://discord.gg/${selectedEvent.socialLinks.discord}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Share Button */}
                    <button className="w-full flex items-center justify-center gap-2 text-gray-700 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <FiShare2 /> Share Event
                    </button>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="p-6 lg:p-8 border-t border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Description */}
                    <div className="lg:col-span-2">
                      <h3 className="text-xl font-bold mb-4">About This Event</h3>
                      <p className="text-gray-700 mb-6 whitespace-pre-line">{selectedEvent.longDescription}</p>
                      
                      {/* Requirements */}
                      {selectedEvent.requirements && selectedEvent.requirements.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-bold mb-2">Requirements</h4>
                          <ul className="list-disc pl-5 text-gray-700">
                            {selectedEvent.requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Tags */}
                      <div>
                        <h4 className="font-bold mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedEvent.tags.map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Speakers/Schedule */}
                    <div>
                      {/* Speakers */}
                      {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-xl font-bold mb-4">Speakers</h3>
                          <div className="space-y-4">
                            {selectedEvent.speakers.map(speaker => (
                              <div key={speaker.id} className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                  <img 
                                    src={speaker.avatar} 
                                    alt={speaker.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{speaker.name}</p>
                                  <p className="text-sm text-gray-600">{speaker.title}</p>
                                  <p className="text-sm text-gray-600">{speaker.company}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Schedule */}
                      {selectedEvent.schedule && selectedEvent.schedule.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold mb-4">Schedule</h3>
                          <div className="space-y-4">
                            {selectedEvent.schedule.map((item, i) => (
                              <div key={i} className="border-l-2 border-indigo-500 pl-4 py-1">
                                <p className="font-medium text-gray-700">{item.time} • {item.title}</p>
                                {item.speaker && (
                                  <p className="text-sm text-gray-600">Speaker: {item.speaker}</p>
                                )}
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Prizes */}
                      {selectedEvent.prizes && selectedEvent.prizes.length > 0 && (
                        <div className="mt-8">
                          <h3 className="text-xl font-bold mb-4">Prizes</h3>
                          <div className="space-y-3">
                            {selectedEvent.prizes.map((prize, i) => (
                              <div key={i} className="bg-indigo-50 p-3 rounded-lg">
                                <p className="font-bold text-indigo-800">{prize.title}: {prize.value}</p>
                                <p className="text-sm text-indigo-700">{prize.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsPage;