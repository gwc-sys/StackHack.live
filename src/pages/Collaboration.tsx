// src/pages/Collaboration.tsx
import React, { useState, useEffect } from 'react';

// Types
type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  skills: string[];
  role: 'developer' | 'student' | 'mentor' | 'admin';
  githubUsername?: string;
  rating?: number;
  availability?: boolean;
  college?: string;
  year?: string;
  major?: string;
};

type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  skillsNeeded: string[];
  owner: User;
  members: User[];
  isPublic: boolean;
  githubRepo?: string;
  demoUrl?: string;
  createdAt: Date;
  clubId?: string;
};

type MentorSession = {
  id: string;
  mentor: User;
  mentee: User;
  date: Date;
  duration: number;
  notes: string;
  rating?: number;
};

type Community = {
  id: string;
  name: string;
  description: string;
  members: User[];
  isPublic: boolean;
  topics: string[];
  events: Event[];
};

type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: User;
  attendees: User[];
};

type ClubRole = 'president' | 'vice_president' | 'technical_head' | 'marketing_head' | 'treasurer' | 'event_coordinator' | 'member';

type ClubMember = User & {
  clubRole: ClubRole;
  joinedAt: Date;
};

type ClubEvent = Event & {
  type: 'workshop' | 'talk' | 'coding_session' | 'project' | 'guest_talk' | 'hackathon' | 'social';
  maxAttendees?: number;
  registeredAttendees: User[];
};

type Milestone = {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
};

type ClubProject = Project & {
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  progress: number;
  milestones: Milestone[];
};

type ClubResources = {
  id: string;
  name: string;
  type: 'document' | 'template' | 'guide' | 'recording';
  url: string;
  uploadedBy: User;
  uploadedAt: Date;
  downloads: number;
};

type SemesterEvent = {
  id: string;
  week: number;
  title: string;
  description: string;
  type: ClubEvent['type'];
  date: Date;
  completed: boolean;
};

type Club = {
  id: string;
  name: string;
  description: string;
  category: 'coding' | 'design' | 'research' | 'entrepreneurship' | 'other';
  admin: User;
  members: ClubMember[];
  projects: ClubProject[];
  events: ClubEvent[];
  isPublic: boolean;
  joinRequests: User[];
  createdAt: Date;
  tags: string[];
  college: string;
  missionStatement: string;
  coreFocus: string[];
  facultyAdvisor?: User;
  resources: ClubResources[];
  semesterPlan: SemesterEvent[];
  socialLinks: {
    discord?: string;
    github?: string;
    instagram?: string;
    linkedin?: string;
  };
};

type ClubPost = {
  id: string;
  title: string;
  content: string;
  author: User;
  club: Club;
  createdAt: Date;
  likes: string[];
  comments: ClubComment[];
  tags: string[];
};

type ClubComment = {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  likes: string[];
  parentCommentId?: string;
};

type ProjectGroup = {
  id: string;
  name: string;
  description: string;
  project: Project;
  members: User[];
  skills: string[];
  lookingFor: string[];
  maxMembers: number;
  isActive: boolean;
  createdAt: Date;
};

type GithubRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
};

// Form state types
type ProjectFormState = {
  title: string;
  description: string;
  techStack: string[];
  skillsNeeded: string[];
  isPublic: boolean;
  githubRepo: string;
  demoUrl: string;
  clubId: string;
};

type CommunityFormState = {
  name: string;
  description: string;
  isPublic: boolean;
  topics: string[];
};

type ClubFormState = {
  name: string;
  description: string;
  category: Club['category'];
  isPublic: boolean;
  tags: string[];
  college: string;
};

type ClubPostFormState = {
  title: string;
  content: string;
  tags: string[];
  clubId: string;
};

type ProjectGroupFormState = {
  name: string;
  description: string;
  projectId: string;
  skills: string[];
  lookingFor: string[];
  maxMembers: number;
};

type ActiveTab = 'projects' | 'showcase' | 'mentorship' | 'community' | 'clubs';

const Collaboration: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<ActiveTab>('projects');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [githubUsername, setGithubUsername] = useState<string>('');
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mentorFilter, setMentorFilter] = useState<'all' | 'available'>('all');
  const [communityFilter, setCommunityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [clubFilter, setClubFilter] = useState<'all' | 'public' | 'private' | 'myClubs'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [clubPosts, setClubPosts] = useState<ClubPost[]>([]);
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([]);
  const [clubEvents, setClubEvents] = useState<ClubEvent[]>([]);
  const [clubResources, setClubResources] = useState<ClubResources[]>([]);
  const [activeClubView, setActiveClubView] = useState<'overview' | 'members' | 'projects' | 'events' | 'resources'>('overview');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);

  // Modal states
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
  const [showCommunityModal, setShowCommunityModal] = useState<boolean>(false);
  const [showMentorModal, setShowMentorModal] = useState<boolean>(false);
  const [showClubModal, setShowClubModal] = useState<boolean>(false);
  const [showClubPostModal, setShowClubPostModal] = useState<boolean>(false);
  const [showProjectGroupModal, setShowProjectGroupModal] = useState<boolean>(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  
  // Form states
  const [newProject, setNewProject] = useState<ProjectFormState>({
    title: '',
    description: '',
    techStack: [],
    skillsNeeded: [],
    isPublic: true,
    githubRepo: '',
    demoUrl: '',
    clubId: ''
  });
  
  const [newCommunity, setNewCommunity] = useState<CommunityFormState>({
    name: '',
    description: '',
    isPublic: true,
    topics: [],
  });

  const [newClub, setNewClub] = useState<ClubFormState>({
    name: '',
    description: '',
    category: 'coding',
    isPublic: true,
    tags: [],
    college: ''
  });

  const [newClubPost, setNewClubPost] = useState<ClubPostFormState>({
    title: '',
    content: '',
    tags: [],
    clubId: ''
  });

  const [newProjectGroup, setNewProjectGroup] = useState<ProjectGroupFormState>({
    name: '',
    description: '',
    projectId: '',
    skills: [],
    lookingFor: [],
    maxMembers: 4
  });

  const [newTech, setNewTech] = useState<string>('');
  const [newSkill, setNewSkill] = useState<string>('');
  const [newTopic, setNewTopic] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');
  const [newLookingFor, setNewLookingFor] = useState<string>('');
  const [newEvent, setNewEvent] = useState<{
    title: string;
    description: string;
    type: ClubEvent['type'];
    date: string;
    location: string;
    maxAttendees: number;
  }>({
    title: '',
    description: '',
    type: 'workshop',
    date: '',
    location: '',
    maxAttendees: 0
  });
  const [newResource, setNewResource] = useState<Omit<ClubResources, 'id' | 'uploadedBy' | 'uploadedAt' | 'downloads'>>({
    name: '',
    type: 'document',
    url: '',
  });

  // Initialize with mock data
  useEffect(() => {
    const mockUser: User = {
      id: 'current-user',
      name: 'John Doe',
      email: 'john@college.edu',
      avatar: 'https://i.pravatar.cc/150?img=0',
      skills: ['React', 'TypeScript', 'Node.js'],
      role: 'student',
      year: 'Junior',
      major: 'Computer Science'
    };

    const mockProjects: Project[] = [
      {
        id: 'project-1',
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce solution with React and Node.js',
        techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
        skillsNeeded: ['Frontend Development', 'Backend Development', 'UI/UX Design'],
        owner: mockUser,
        members: [mockUser],
        isPublic: true,
        githubRepo: 'https://github.com/example/ecommerce',
        demoUrl: 'https://ecommerce-demo.com',
        createdAt: new Date('2024-01-15')
      }
    ];

    const mockClubs: Club[] = [
      {
        id: 'club-1',
        name: 'Web Development Club',
        description: 'A club for web development enthusiasts',
        category: 'coding',
        admin: mockUser,
        members: [{
          ...mockUser,
          clubRole: 'president',
          joinedAt: new Date('2024-01-01')
        }],
        projects: [],
        events: [],
        isPublic: true,
        joinRequests: [],
        createdAt: new Date('2024-01-01'),
        tags: ['web', 'development', 'coding'],
        college: 'Tech University',
        missionStatement: 'Empowering students through web development',
        coreFocus: ['Frontend', 'Backend', 'Full Stack'],
        resources: [],
        semesterPlan: [],
        socialLinks: {
          github: 'https://github.com/web-dev-club',
          discord: 'https://discord.gg/webdev'
        }
      }
    ];

    const mockClubPosts: ClubPost[] = [
      {
        id: 'post-1',
        title: 'Welcome to Web Dev Club!',
        content: 'Excited to start this semester with amazing projects and events!',
        author: mockUser,
        club: mockClubs[0],
        createdAt: new Date('2024-01-10'),
        likes: [],
        comments: [],
        tags: ['welcome', 'announcement']
      }
    ];

    const mockProjectGroups: ProjectGroup[] = [
      {
        id: 'group-1',
        name: 'E-commerce Team',
        description: 'Working on the e-commerce platform project',
        project: mockProjects[0],
        members: [mockUser],
        skills: ['React', 'Node.js'],
        lookingFor: ['UI/UX Designer', 'Backend Developer'],
        maxMembers: 5,
        isActive: true,
        createdAt: new Date('2024-01-20')
      }
    ];

    setUsers([mockUser]);
    setProjects(mockProjects);
    setCommunities([]);
    setSessions([]);
    setClubs(mockClubs);
    setClubPosts(mockClubPosts);
    setProjectGroups(mockProjectGroups);
    setClubEvents([]);
    setClubResources([]);
    setCurrentUser(mockUser);
    setSelectedClub(mockClubs[0]);
  }, []);

  // Filter logic
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTechStack = selectedTechStack.length === 0 ||
      selectedTechStack.some(tech => project.techStack.includes(tech));
    const matchesSkills = selectedSkills.length === 0 ||
      selectedSkills.some(skill => project.skillsNeeded.includes(skill));
    return matchesSearch && matchesTechStack && matchesSkills;
  });

  const filteredMentors = users.filter(user => {
    if (user.role !== 'mentor') return false;
    if (mentorFilter === 'available' && !user.availability) return false;
    return true;
  });

  const filteredCommunities = communities.filter(community => {
    if (communityFilter === 'public') return community.isPublic;
    if (communityFilter === 'private') return !community.isPublic;
    return true;
  });

  const filteredClubs = clubs.filter(club => {
    if (clubFilter === 'public') return club.isPublic;
    if (clubFilter === 'private') return !club.isPublic;
    if (clubFilter === 'myClubs') return club.members.some(member => member.id === currentUser?.id);
    return true;
  });

  const clubPostsForSelected = selectedClub 
    ? clubPosts.filter(post => post.club.id === selectedClub.id)
    : [];

  const userClubs = clubs.filter(club => 
    club.members.some(member => member.id === currentUser?.id)
  );

  const allTechStacks = Array.from(new Set(projects.flatMap(p => p.techStack)));
  const allSkills = Array.from(new Set(projects.flatMap(p => p.skillsNeeded)));

  // Fetch GitHub repos
  const fetchGithubRepos = async (): Promise<void> => {
    if (!githubUsername) return;
    setIsLoadingRepos(true);
    try {
      setTimeout(() => {
        const mockRepos: GithubRepo[] = [
          {
            id: 1,
            name: 'example-repo',
            description: 'An example repository',
            html_url: 'https://github.com/username/example-repo',
            language: 'TypeScript',
            stargazers_count: 5
          }
        ];
        setGithubRepos(mockRepos);
        setIsLoadingRepos(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      setIsLoadingRepos(false);
    }
  };

  // Create new project
  const handleCreateProject = (): void => {
    if (!currentUser) return;
    const project: Project = {
      id: `project-${Date.now()}`,
      title: newProject.title,
      description: newProject.description,
      techStack: newProject.techStack,
      skillsNeeded: newProject.skillsNeeded,
      owner: currentUser,
      members: [currentUser],
      isPublic: newProject.isPublic,
      githubRepo: newProject.githubRepo || undefined,
      demoUrl: newProject.demoUrl || undefined,
      createdAt: new Date(),
      clubId: newProject.clubId || undefined,
    };
    setProjects(prev => [...prev, project]);
    setShowProjectModal(false);
    resetProjectForm();
  };

  // Create new community
  const handleCreateCommunity = (): void => {
    if (!currentUser) return;
    const community: Community = {
      id: `community-${Date.now()}`,
      name: newCommunity.name,
      description: newCommunity.description,
      members: [currentUser],
      isPublic: newCommunity.isPublic,
      topics: newCommunity.topics,
      events: [],
    };
    setCommunities(prev => [...prev, community]);
    setShowCommunityModal(false);
    resetCommunityForm();
  };

  // Create new club
  const handleCreateClub = (): void => {
    if (!currentUser) return;
    const club: Club = {
      id: `club-${Date.now()}`,
      name: newClub.name,
      description: newClub.description,
      category: newClub.category,
      admin: currentUser,
      members: [{
        ...currentUser,
        clubRole: 'president',
        joinedAt: new Date()
      }],
      projects: [],
      events: [],
      isPublic: newClub.isPublic,
      joinRequests: [],
      createdAt: new Date(),
      tags: newClub.tags,
      college: newClub.college,
      missionStatement: '',
      coreFocus: [],
      resources: [],
      semesterPlan: [],
      socialLinks: {}
    };
    setClubs(prev => [...prev, club]);
    setShowClubModal(false);
    resetClubForm();
  };

  // Create new club post
  const handleCreateClubPost = (): void => {
    if (!currentUser || !selectedClub) return;
    const post: ClubPost = {
      id: `post-${Date.now()}`,
      title: newClubPost.title,
      content: newClubPost.content,
      author: currentUser,
      club: selectedClub,
      createdAt: new Date(),
      likes: [],
      comments: [],
      tags: newClubPost.tags,
    };
    setClubPosts(prev => [...prev, post]);
    setShowClubPostModal(false);
    resetClubPostForm();
  };

  // Create new project group
  const handleCreateProjectGroup = (): void => {
    if (!currentUser) return;
    const project = projects.find(p => p.id === newProjectGroup.projectId);
    if (!project) return;
    const group: ProjectGroup = {
      id: `group-${Date.now()}`,
      name: newProjectGroup.name,
      description: newProjectGroup.description,
      project: project,
      members: [currentUser],
      skills: newProjectGroup.skills,
      lookingFor: newProjectGroup.lookingFor,
      maxMembers: newProjectGroup.maxMembers,
      isActive: true,
      createdAt: new Date(),
    };
    setProjectGroups(prev => [...prev, group]);
    setShowProjectGroupModal(false);
    resetProjectGroupForm();
  };

  // Join club
  const handleJoinClub = (clubId: string): void => {
    if (!currentUser) return;
    setClubs(prev => prev.map(club => {
      if (club.id === clubId) {
        if (club.isPublic) {
          const alreadyMember = club.members.some(m => m.id === currentUser.id);
          if (alreadyMember) return club;
          const newMember: ClubMember = {
            ...currentUser,
            clubRole: 'member',
            joinedAt: new Date()
          };
          return {
            ...club,
            members: [...club.members, newMember]
          };
        } else {
          const alreadyRequested = club.joinRequests.some(u => u.id === currentUser.id);
          if (alreadyRequested) return club;
          return {
            ...club,
            joinRequests: [...club.joinRequests, currentUser]
          };
        }
      }
      return club;
    }));
  };

  // Join project group
  const handleJoinProjectGroup = (groupId: string): void => {
    if (!currentUser) return;
    setProjectGroups(prev => prev.map(group => {
      if (group.id === groupId && group.members.length < group.maxMembers) {
        return {
          ...group,
          members: [...group.members, currentUser]
        };
      }
      return group;
    }));
  };

  // Become a mentor
  const handleBecomeMentor = (): void => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      role: 'mentor',
      availability: true,
      rating: 0,
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setShowMentorModal(false);
  };

  // Create new club event
  const handleCreateClubEvent = (): void => {
    if (!currentUser || !selectedClub) return;
    
    const event: ClubEvent = {
      id: `event-${Date.now()}`,
      title: newEvent.title,
      description: newEvent.description,
      date: new Date(newEvent.date),
      location: newEvent.location,
      organizer: currentUser,
      attendees: [],
      registeredAttendees: [],
      type: newEvent.type,
      maxAttendees: newEvent.maxAttendees || undefined
    };

    setClubEvents(prev => [...prev, event]);
    setClubs(prev => prev.map(c => 
      c.id === selectedClub.id ? { ...c, events: [...c.events, event] } : c
    ));
    setShowEventModal(false);
    resetEventForm();
  };

  // Register for club event
  const handleRegisterForEvent = (eventId: string, clubId: string): void => {
    if (!currentUser) return;

    setClubEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const isRegistered = event.registeredAttendees.some(user => user.id === currentUser.id);
        if (isRegistered) {
          return {
            ...event,
            registeredAttendees: event.registeredAttendees.filter(user => user.id !== currentUser.id)
          };
        } else {
          if (event.maxAttendees && event.registeredAttendees.length >= event.maxAttendees) {
            return event;
          }
          return {
            ...event,
            registeredAttendees: [...event.registeredAttendees, currentUser]
          };
        }
      }
      return event;
    }));

    setClubs(prev => prev.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          events: club.events.map(event => {
            if (event.id === eventId) {
              const isRegistered = event.registeredAttendees.some(user => user.id === currentUser.id);
              if (isRegistered) {
                return {
                  ...event,
                  registeredAttendees: event.registeredAttendees.filter(user => user.id !== currentUser.id)
                };
              } else {
                if (event.maxAttendees && event.registeredAttendees.length >= event.maxAttendees) {
                  return event;
                }
                return {
                  ...event,
                  registeredAttendees: [...event.registeredAttendees, currentUser]
                };
              }
            }
            return event;
          })
        };
      }
      return club;
    }));
  };

  // Add club resource
  const handleAddClubResource = (): void => {
    if (!currentUser || !selectedClub) return;

    const resource: ClubResources = {
      id: `resource-${Date.now()}`,
      name: newResource.name,
      type: newResource.type,
      url: newResource.url,
      uploadedBy: currentUser,
      uploadedAt: new Date(),
      downloads: 0
    };

    setClubResources(prev => [...prev, resource]);
    setClubs(prev => prev.map(c => 
      c.id === selectedClub.id ? { ...c, resources: [...c.resources, resource] } : c
    ));
    setShowResourceModal(false);
    resetResourceForm();
  };

  const handleAssignClubRole = (clubId: string, userId: string, role: ClubRole): void => {
    setClubs(prev => prev.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          members: club.members.map(member => 
            member.id === userId ? { ...member, clubRole: role } : member
          )
        };
      }
      return club;
    }));
  };

  // Reset forms
  const resetProjectForm = (): void => {
    setNewProject({
      title: '',
      description: '',
      techStack: [],
      skillsNeeded: [],
      isPublic: true,
      githubRepo: '',
      demoUrl: '',
      clubId: ''
    });
  };

  const resetCommunityForm = (): void => {
    setNewCommunity({
      name: '',
      description: '',
      isPublic: true,
      topics: [],
    });
  };

  const resetClubForm = (): void => {
    setNewClub({
      name: '',
      description: '',
      category: 'coding',
      isPublic: true,
      tags: [],
      college: ''
    });
  };

  const resetClubPostForm = (): void => {
    setNewClubPost({
      title: '',
      content: '',
      tags: [],
      clubId: ''
    });
  };

  const resetProjectGroupForm = (): void => {
    setNewProjectGroup({
      name: '',
      description: '',
      projectId: '',
      skills: [],
      lookingFor: [],
      maxMembers: 4
    });
  };

  const resetEventForm = (): void => {
    setNewEvent({
      title: '',
      description: '',
      type: 'workshop',
      date: '',
      location: '',
      maxAttendees: 0
    });
  };

  const resetResourceForm = (): void => {
    setNewResource({
      name: '',
      type: 'document',
      url: ''
    });
  };

  // Add items to forms
  const addTech = (): void => {
    if (newTech && !newProject.techStack.includes(newTech)) {
      setNewProject({
        ...newProject,
        techStack: [...newProject.techStack, newTech]
      });
      setNewTech('');
    }
  };

  const addSkill = (): void => {
    if (newSkill && !newProject.skillsNeeded.includes(newSkill)) {
      setNewProject({
        ...newProject,
        skillsNeeded: [...newProject.skillsNeeded, newSkill]
      });
      setNewSkill('');
    }
  };

  const addTopic = (): void => {
    if (newTopic && !newCommunity.topics.includes(newTopic)) {
      setNewCommunity({
        ...newCommunity,
        topics: [...newCommunity.topics, newTopic]
      });
      setNewTopic('');
    }
  };

  const addTag = (): void => {
    if (newTag && !newClub.tags.includes(newTag)) {
      setNewClub({
        ...newClub,
        tags: [...newClub.tags, newTag]
      });
      setNewTag('');
    }
  };

  const addLookingFor = (): void => {
    if (newLookingFor && !newProjectGroup.lookingFor.includes(newLookingFor)) {
      setNewProjectGroup({
        ...newProjectGroup,
        lookingFor: [...newProjectGroup.lookingFor, newLookingFor]
      });
      setNewLookingFor('');
    }
  };

  // Remove items from forms
  const removeTech = (tech: string): void => {
    setNewProject({
      ...newProject,
      techStack: newProject.techStack.filter(t => t !== tech)
    });
  };

  const removeSkill = (skill: string): void => {
    setNewProject({
      ...newProject,
      skillsNeeded: newProject.skillsNeeded.filter(s => s !== skill)
    });
  };

  const removeTopic = (topic: string): void => {
    setNewCommunity({
      ...newCommunity,
      topics: newCommunity.topics.filter(t => t !== topic)
    });
  };

  const removeTag = (tag: string): void => {
    setNewClub({
      ...newClub,
      tags: newClub.tags.filter(t => t !== tag)
    });
  };

  const removeLookingFor = (skill: string): void => {
    setNewProjectGroup({
      ...newProjectGroup,
      lookingFor: newProjectGroup.lookingFor.filter(s => s !== skill)
    });
  };

  // Handle form input changes
  const handleProjectInputChange = (field: keyof ProjectFormState, value: string | boolean | string[]): void => {
    setNewProject(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCommunityInputChange = (field: keyof CommunityFormState, value: string | boolean | string[]): void => {
    setNewCommunity(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClubInputChange = (field: keyof ClubFormState, value: string | boolean | string[]): void => {
    setNewClub(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!currentUser) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center h-16 items-center">
            <div className="flex space-x-2 md:space-x-6">
              {(['projects', 'showcase', 'mentorship', 'community', 'clubs'] as ActiveTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              className="form-input block w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Project Collaboration Hub</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowProjectGroupModal(true)}
                  className="btn btn-primary bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Create Project Group
                </button>
                <button 
                  onClick={() => setShowProjectModal(true)}
                  className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Project
                </button>
              </div>
            </div>

            {/* Project Groups Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Project Groups</h3>
              {projectGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projectGroups.map((group) => (
                    <div key={group.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-4">
                        <h4 className="font-bold text-lg">{group.name}</h4>
                        <p className="text-gray-600 mt-2">{group.description}</p>
                        <div className="mt-4">
                          <h5 className="text-sm font-semibold">Project:</h5>
                          <p className="text-sm text-gray-700">{group.project.title}</p>
                        </div>
                        {group.lookingFor.length > 0 && (
                          <div className="mt-4">
                            <h5 className="text-sm font-semibold">Looking For:</h5>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {group.lookingFor.map(skill => (
                                <span key={skill} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {group.members.length}/{group.maxMembers} members
                          </span>
                          <button
                            onClick={() => handleJoinProjectGroup(group.id)}
                            className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                          >
                            Join Group
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-gray-600">No project groups yet.</p>
                  <button
                    onClick={() => setShowProjectGroupModal(true)}
                    className="mt-4 btn btn-primary bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Create Project Group
                  </button>
                </div>
              )}
            </div>

            {/* Filters */}
            {(allTechStacks.length > 0 || allSkills.length > 0) && (
              <div className="mb-6 p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium mb-3">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allTechStacks.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                      <div className="flex flex-wrap gap-2">
                        {allTechStacks.map((tech) => (
                          <button
                            key={tech}
                            onClick={() => {
                              if (selectedTechStack.includes(tech)) {
                                setSelectedTechStack(selectedTechStack.filter(t => t !== tech));
                              } else {
                                setSelectedTechStack([...selectedTechStack, tech]);
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-xs ${selectedTechStack.includes(tech) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {allSkills.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills Needed</label>
                      <div className="flex flex-wrap gap-2">
                        {allSkills.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => {
                              if (selectedSkills.includes(skill)) {
                                setSelectedSkills(selectedSkills.filter(s => s !== skill));
                              } else {
                                setSelectedSkills([...selectedSkills, skill]);
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-xs ${selectedSkills.includes(skill) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Project List */}
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {project.members.length} member{project.members.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">{project.description}</p>
                      {project.techStack.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold">Tech Stack:</h4>
                          <div className="flex flex-wrap mt-1">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded mr-1 mb-1"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {project.skillsNeeded.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold">Skills Needed:</h4>
                          <div className="flex flex-wrap mt-1">
                            {project.skillsNeeded.map((skill) => (
                              <span
                                key={skill}
                                className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded mr-1 mb-1"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-4 flex space-x-2">
                        {project.githubRepo && (
                          <a
                            href={project.githubRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm bg-gray-800 text-white px-3 py-1 rounded flex items-center"
                          >
                            <i className="fab fa-github mr-2"></i> GitHub
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <button className="text-sm bg-purple-600 text-white px-3 py-1 rounded">
                        Join Project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
                <p className="mt-2 text-gray-600">
                  {projects.length === 0 ? 
                    "Be the first to create a project!" : 
                    "Try adjusting your search or filters"}
                </p>
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="mt-4 btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Project
                </button>
              </div>
            )}
          </div>
        )}

        {/* Showcase Tab */}
        {activeTab === 'showcase' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Developer Showcase</h2>
            
            {/* GitHub Integration */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Import Your GitHub Projects</h3>
              <div className="flex">
                <input
                  type="text"
                  className="form-input flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="GitHub username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                />
                <button
                  onClick={fetchGithubRepos}
                  disabled={isLoadingRepos}
                  className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoadingRepos ? 'Loading...' : 'Import'}
                </button>
              </div>
              
              {githubRepos.length > 0 ? (
                <div className="mt-6">
                  <h4 className="text-md font-medium mb-3">Your Repositories</h4>
                  <div className="space-y-4">
                    {githubRepos.map((repo) => (
                      <div key={repo.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{repo.name}</h5>
                            <p className="text-sm text-gray-600">{repo.description}</p>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                              {repo.language}
                            </span>
                            <span className="text-xs flex items-center">
                              <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {repo.stargazers_count}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm bg-gray-800 text-white px-3 py-1 rounded flex items-center"
                          >
                            <i className="fab fa-github mr-2"></i> View on GitHub
                          </a>
                          <button className="text-sm bg-green-600 text-white px-3 py-1 rounded">
                            Add to Portfolio
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : isLoadingRepos ? (
                <div className="mt-6 text-center py-4">
                  <p>Loading repositories...</p>
                </div>
              ) : (
                <div className="mt-6 text-center py-4">
                  <p>No repositories found. Enter your GitHub username to import projects.</p>
                </div>
              )}
            </div>

            {/* Featured Projects */}
            <div>
              <h3 className="text-lg font-medium mb-4">Featured Projects</h3>
              {projects.filter(p => p.demoUrl).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.filter(p => p.demoUrl).map((project) => (
                    <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-4">
                        <h4 className="font-bold">{project.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        {project.techStack.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {project.techStack.slice(0, 3).map(tech => (
                              <span key={tech} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {project.demoUrl && (
                        <div className="bg-gray-100 p-1">
                          <iframe
                            src={project.demoUrl}
                            className="w-full h-48"
                            title={`Demo of ${project.title}`}
                            sandbox="allow-scripts allow-same-origin"
                          ></iframe>
                        </div>
                      )}
                      <div className="p-4 border-t border-gray-200">
                        <button className="text-sm bg-purple-600 text-white px-3 py-1 rounded">
                          Fork Project
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-gray-600">No featured projects with demos yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mentorship Tab */}
        {activeTab === 'mentorship' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mentorship Network</h2>
              {currentUser.role !== 'mentor' ? (
                <button 
                  onClick={() => setShowMentorModal(true)}
                  className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Become a Mentor
                </button>
              ) : (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  You're a mentor
                </span>
              )}
            </div>

            {/* Mentor Filter */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Filter by:</span>
                <button
                  onClick={() => setMentorFilter('all')}
                  className={`px-3 py-1 rounded-md text-sm ${mentorFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  All Mentors
                </button>
                <button
                  onClick={() => setMentorFilter('available')}
                  className={`px-3 py-1 rounded-md text-sm ${mentorFilter === 'available' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  Available Now
                </button>
              </div>
            </div>

            {/* Mentors List */}
            {filteredMentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredMentors.map((mentor) => (
                  <div key={mentor.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h3 className="font-bold">{mentor.name}</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 text-sm text-gray-700">
                              {mentor.rating?.toFixed(1) || 'New'} 
                              ({Math.floor(Math.random() * 100) + 1} sessions)
                            </span>
                          </div>
                          {mentor.skills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {mentor.skills.slice(0, 3).map(skill => (
                                <span key={skill} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded">
                          View Profile
                        </button>
                        <button className="text-sm bg-green-600 text-white px-3 py-1 rounded">
                          Request Session
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow mb-8">
                <h3 className="text-lg font-medium text-gray-900">No mentors found</h3>
                <p className="mt-2 text-gray-600">
                  {users.filter(u => u.role === 'mentor').length === 0 ?
                    "Be the first to become a mentor!" : 
                    "Try adjusting your filters"}
                </p>
                {currentUser.role !== 'mentor' && (
                  <button
                    onClick={() => setShowMentorModal(true)}
                    className="mt-4 btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Become a Mentor
                  </button>
                )}
              </div>
            )}

            {/* Your Sessions */}
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Mentorship Sessions</h3>
            {sessions.filter(s => s.mentee.id === currentUser.id || s.mentor.id === currentUser.id).length > 0 ? (
              <div className="space-y-4">
                {sessions.filter(s => s.mentee.id === currentUser.id || s.mentor.id === currentUser.id).map((session) => (
                  <div key={session.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">
                            Session with {session.mentor.id === currentUser.id ? session.mentee.name : session.mentor.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {session.date.toLocaleDateString()} • {session.duration} mins
                          </p>
                        </div>
                        {session.rating && (
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 text-gray-700">{session.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-gray-700">{session.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-600">No mentorship sessions yet.</p>
              </div>
            )}

            {/* Q&A Forum */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Q&A Forum</h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h4 className="font-medium">Ask your first question</h4>
                  <p className="text-sm text-gray-600 mt-1">The community will help you find answers</p>
                </div>
                <div className="p-4">
                  <textarea
                    className="form-textarea block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={3}
                    placeholder="Type your question here..."
                  ></textarea>
                  <button className="mt-2 btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Post Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Community Builder</h2>
              <button 
                onClick={() => setShowCommunityModal(true)}
                className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Community
              </button>
            </div>

            {/* Community Filter */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Filter by:</span>
                <button
                  onClick={() => setCommunityFilter('all')}
                  className={`px-3 py-1 rounded-md text-sm ${communityFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  All Communities
                </button>
                <button
                  onClick={() => setCommunityFilter('public')}
                  className={`px-3 py-1 rounded-md text-sm ${communityFilter === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  Public
                </button>
                <button
                  onClick={() => setCommunityFilter('private')}
                  className={`px-3 py-1 rounded-md text-sm ${communityFilter === 'private' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  Private
                </button>
              </div>
            </div>

            {/* Communities List */}
            {filteredCommunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredCommunities.map((community) => (
                  <div key={community.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4">
                      <h3 className="text-xl font-bold">{community.name}</h3>
                      <p className="text-gray-600 mt-2">{community.description}</p>
                      {community.topics.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold">Topics:</h4>
                          <div className="flex flex-wrap mt-1">
                            {community.topics.map((topic) => (
                              <span
                                key={topic}
                                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-1 mb-1"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-4">
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {community.members.length} member{community.members.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <button className="text-sm bg-purple-600 text-white px-3 py-1 rounded">
                        Join Community
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No communities found</h3>
                <p className="mt-2 text-gray-600">
                  {communities.length === 0 ? 
                    "Be the first to create a community!" : 
                    "Try adjusting your filters"}
                </p>
                <button
                  onClick={() => setShowCommunityModal(true)}
                  className="mt-4 btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Community
                </button>
              </div>
            )}

            {/* Events Calendar */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h3>
              {communities.flatMap(c => c.events).length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  {communities.flatMap(c => c.events).map((event, i) => (
                    <div key={i} className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{event.title}</h4>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {event.date ? new Date(event.date).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {event.attendees.slice(0, 3).map(user => (
                            <img
                              key={user.id}
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full border-2 border-white"
                            />
                          ))}
                          {event.attendees.length > 3 && (
                            <span className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                              +{event.attendees.length - 3}
                            </span>
                          )}
                        </div>
                        <button className="text-sm bg-green-600 text-white px-3 py-1 rounded">
                          Register
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-gray-600">No upcoming events yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clubs Tab */}
        {activeTab === 'clubs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Clubs and Organizations</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowClubPostModal(true)}
                  className="btn btn-primary bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Create Club Post
                </button>
                <button 
                  onClick={() => setShowClubModal(true)}
                  className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Club
                </button>
              </div>
            </div>

            {/* Club Posts Section */}
            {clubPostsForSelected.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Club Posts</h3>
                <div className="space-y-4">
                  {clubPostsForSelected.slice(0, 3).map((post) => (
                    <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-lg">{post.title}</h4>
                            <p className="text-gray-600 mt-2">{post.content}</p>
                            {post.tags.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1">
                                {post.tags.map(tag => (
                                  <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <p>by {post.author.name}</p>
                            <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-4 text-sm">
                          <button className="text-gray-600 hover:text-blue-600">
                            {post.likes.length} Likes
                          </button>
                          <button className="text-gray-600 hover:text-green-600">
                            {post.comments.length} Comments
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Club Filter */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Filter by:</span>
                <button
                  onClick={() => setClubFilter('all')}
                  className={`px-3 py-1 rounded-md text-sm ${clubFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  All Clubs
                </button>
                <button
                  onClick={() => setClubFilter('public')}
                  className={`px-3 py-1 rounded-md text-sm ${clubFilter === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  Public
                </button>
                <button
                  onClick={() => setClubFilter('private')}
                  className={`px-3 py-1 rounded-md text-sm ${clubFilter === 'private' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  Private
                </button>
                <button
                  onClick={() => setClubFilter('myClubs')}
                  className={`px-3 py-1 rounded-md text-sm ${clubFilter === 'myClubs' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  My Clubs ({userClubs.length})
                </button>
              </div>
            </div>

            {/* Clubs List */}
            {filteredClubs.length > 0 ? (
              <div className="space-y-6">
                {filteredClubs.map((club) => (
                  <div key={club.id} className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Club Header */}
                    <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold">{club.name}</h3>
                          <p className="text-blue-100 mt-2">{club.missionStatement}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {club.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-white/20 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-4">
                            {club.socialLinks.github && (
                              <a href={club.socialLinks.github} className="text-white hover:text-gray-200">
                                <i className="fab fa-github"></i>
                              </a>
                            )}
                            {club.socialLinks.discord && (
                              <a href={club.socialLinks.discord} className="text-white hover:text-gray-200">
                                <i className="fab fa-discord"></i>
                              </a>
                            )}
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="bg-white/20 px-2 py-1 rounded">
                              {club.members.length} members
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Club Navigation */}
                    <div className="border-b border-gray-200">
                      <nav className="flex -mb-px">
                        {(['overview', 'members', 'projects', 'events', 'resources'] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => {
                              setActiveClubView(tab);
                              setSelectedClub(club);
                            }}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                              activeClubView === tab && selectedClub?.id === club.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                        ))}
                      </nav>
                    </div>

                    {/* Club Content */}
                    <div className="p-6">
                      {activeClubView === 'overview' && selectedClub?.id === club.id && (
                        <div className="space-y-6">
                          {/* Core Focus */}
                          <div>
                            <h4 className="text-lg font-semibold mb-3">Core Focus Areas</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {club.coreFocus.map((focus, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                                    <span className="font-medium">{focus}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Leadership Team */}
                          <div>
                            <h4 className="text-lg font-semibold mb-3">Leadership Team</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {club.members
                                .filter(member => member.clubRole !== 'member')
                                .map(member => (
                                  <div key={member.id} className="flex items-center p-3 bg-white border rounded-lg">
                                    <img
                                      src={member.avatar}
                                      alt={member.name}
                                      className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                      <p className="font-medium">{member.name}</p>
                                      <p className="text-sm text-gray-600 capitalize">
                                        {member.clubRole.replace('_', ' ')}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* Semester Plan */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-lg font-semibold">Semester Plan</h4>
                              <button 
                                onClick={() => {
                                  setSelectedClub(club);
                                  setShowEventModal(true);
                                }}
                                className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                              >
                                Add Event
                              </button>
                            </div>
                            <div className="space-y-3">
                              {club.semesterPlan.slice(0, 5).map(event => (
                                <div key={event.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                                  <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full mr-3 ${
                                      event.completed ? 'bg-green-500' : 'bg-blue-500'
                                    }`}></div>
                                    <div>
                                      <p className="font-medium">{event.title}</p>
                                      <p className="text-sm text-gray-600">
                                        Week {event.week} • {event.type.replace('_', ' ')}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {new Date(event.date).toLocaleDateString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeClubView === 'members' && selectedClub?.id === club.id && (
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Club Members</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {club.members.map(member => (
                              <div key={member.id} className="flex items-center justify-between p-4 bg-white border rounded-lg">
                                <div className="flex items-center">
                                  <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-12 h-12 rounded-full mr-4"
                                  />
                                  <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-sm text-gray-600 capitalize">
                                      {member.clubRole.replace('_', ' ')}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                {club.admin.id === currentUser.id && member.id !== club.admin.id && (
                                  <select
                                    value={member.clubRole}
                                    onChange={(e) => handleAssignClubRole(club.id, member.id, e.target.value as ClubRole)}
                                    className="text-sm border rounded px-2 py-1"
                                  >
                                    <option value="member">Member</option>
                                    <option value="vice_president">Vice President</option>
                                    <option value="technical_head">Technical Head</option>
                                    <option value="marketing_head">Marketing Head</option>
                                    <option value="treasurer">Treasurer</option>
                                    <option value="event_coordinator">Event Coordinator</option>
                                  </select>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeClubView === 'events' && selectedClub?.id === club.id && (
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold">Upcoming Events</h4>
                            <button 
                              onClick={() => {
                                setSelectedClub(club);
                                setShowEventModal(true);
                              }}
                              className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                              Create Event
                            </button>
                          </div>
                          <div className="space-y-4">
                            {clubEvents
                              .filter(event => event.organizer.id === club.admin.id && new Date(event.date) >= new Date())
                              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                              .map(event => (
                                <div key={event.id} className="p-4 border rounded-lg">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-semibold">{event.title}</h5>
                                      <p className="text-gray-600 mt-1">{event.description}</p>
                                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                        <span>{event.location}</span>
                                        <span className="capitalize">{event.type.replace('_', ' ')}</span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-sm text-gray-600">
                                          {event.registeredAttendees.length}
                                          {event.maxAttendees && ` / ${event.maxAttendees}`} attending
                                        </span>
                                      </div>
                                      <button
                                        onClick={() => handleRegisterForEvent(event.id, club.id)}
                                        className={`px-3 py-1 rounded text-sm ${
                                          event.registeredAttendees.some(u => u.id === currentUser.id)
                                            ? 'bg-gray-600 text-white'
                                            : 'bg-blue-600 text-white'
                                        }`}
                                      >
                                        {event.registeredAttendees.some(u => u.id === currentUser.id)
                                          ? 'Cancel Registration'
                                          : 'Register'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {activeClubView === 'resources' && selectedClub?.id === club.id && (
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold">Club Resources</h4>
                            <button 
                              onClick={() => {
                                setSelectedClub(club);
                                setShowResourceModal(true);
                              }}
                              className="btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                              Add Resource
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {clubResources
                              .filter(resource => resource.uploadedBy.id === club.admin.id)
                              .map(resource => (
                                <div key={resource.id} className="p-4 border rounded-lg">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h5 className="font-semibold">{resource.name}</h5>
                                      <p className="text-sm text-gray-600 capitalize mt-1">
                                        {resource.type}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-2">
                                        Uploaded by {resource.uploadedBy.name}
                                      </p>
                                    </div>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      {resource.downloads} downloads
                                    </span>
                                  </div>
                                  <div className="mt-3 flex space-x-2">
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 text-center bg-blue-600 text-white py-2 rounded text-sm"
                                    >
                                      Download
                                    </a>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Club Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t">
                      {club.members.some(m => m.id === currentUser.id) ? (
                        <div className="flex justify-between items-center">
                          <span className="text-green-600 font-medium">You are a member</span>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedClub(club);
                                setShowClubPostModal(true);
                              }}
                              className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                            >
                              Create Post
                            </button>
                            <button className="text-sm bg-green-600 text-white px-3 py-1 rounded">
                              Invite Members
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            {club.isPublic ? 'Open to join' : 'Request to join'}
                          </span>
                          <button 
                            onClick={() => handleJoinClub(club.id)}
                            className="text-sm bg-purple-600 text-white px-3 py-1 rounded"
                          >
                            {club.isPublic ? 'Join Club' : 'Request to Join'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No clubs found</h3>
                <p className="mt-2 text-gray-600">
                  {clubs.length === 0 ? 
                    "Be the first to create a club!" : 
                    "Try adjusting your filters"}
                </p>
                <button
                  onClick={() => setShowClubModal(true)}
                  className="mt-4 btn btn-primary bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Club
                </button>
              </div>
            )}
          </div>
        )}

        {/* Project Creation Modal */}
        {showProjectModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Project</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="project-title" className="block text-sm font-medium text-gray-700">Project Title</label>
                        <input
                          type="text"
                          id="project-title"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newProject.title}
                          onChange={(e) => handleProjectInputChange('title', e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="project-description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          id="project-description"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newProject.description}
                          onChange={(e) => handleProjectInputChange('description', e.target.value)}
                        ></textarea>
                      </div>
                      <div>
                        <label htmlFor="project-tech" className="block text-sm font-medium text-gray-700">Tech Stack</label>
                        <div className="mt-1 flex">
                          <input
                            type="text"
                            id="project-tech"
                            className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newTech}
                            onChange={(e) => setNewTech(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTech()}
                            placeholder="Add a technology"
                          />
                          <button
                            onClick={addTech}
                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            Add
                          </button>
                        </div>
                        {newProject.techStack.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {newProject.techStack.map(tech => (
                              <span key={tech} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {tech}
                                <button
                                  type="button"
                                  className="ml-1.5 inline-flex text-blue-500 hover:text-blue-700 focus:outline-none"
                                  onClick={() => removeTech(tech)}
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="project-skills" className="block text-sm font-medium text-gray-700">Skills Needed</label>
                        <div className="mt-1 flex">
                          <input
                            type="text"
                            id="project-skills"
                            className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                            placeholder="Add a skill"
                          />
                          <button
                            onClick={addSkill}
                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            Add
                          </button>
                        </div>
                        {newProject.skillsNeeded.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {newProject.skillsNeeded.map(skill => (
                              <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {skill}
                                <button
                                  type="button"
                                  className="ml-1.5 inline-flex text-green-500 hover:text-green-700 focus:outline-none"
                                  onClick={() => removeSkill(skill)}
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="project-github" className="block text-sm font-medium text-gray-700">GitHub Repository URL (optional)</label>
                        <input
                          type="text"
                          id="project-github"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newProject.githubRepo}
                          onChange={(e) => handleProjectInputChange('githubRepo', e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="project-demo" className="block text-sm font-medium text-gray-700">Demo URL (optional)</label>
                        <input
                          type="text"
                          id="project-demo"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newProject.demoUrl}
                          onChange={(e) => handleProjectInputChange('demoUrl', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          id="project-public"
                          name="project-public"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={newProject.isPublic}
                          onChange={(e) => handleProjectInputChange('isPublic', e.target.checked)}
                        />
                        <label htmlFor="project-public" className="ml-2 block text-sm text-gray-700">
                          Make this project public
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCreateProject}
                  >
                    Create Project
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowProjectModal(false);
                      resetProjectForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Group Creation Modal */}
        {showProjectGroupModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create Project Group</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Group Name</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newProjectGroup.name}
                          onChange={e => setNewProjectGroup({...newProjectGroup, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          rows={3}
                          value={newProjectGroup.description}
                          onChange={e => setNewProjectGroup({...newProjectGroup, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Project</label>
                        <select
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newProjectGroup.projectId}
                          onChange={e => setNewProjectGroup({...newProjectGroup, projectId: e.target.value})}
                        >
                          <option value="">Select a project</option>
                          {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Skills</label>
                        <div className="mt-1 flex">
                          <input
                            type="text"
                            className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newSkill}
                            onChange={e => setNewSkill(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addSkill()}
                            placeholder="Add a skill"
                          />
                          <button
                            onClick={addSkill}
                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            Add
                          </button>
                        </div>
                        {newProjectGroup.skills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {newProjectGroup.skills.map(skill => (
                              <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {skill}
                                <button
                                  type="button"
                                  className="ml-1.5 inline-flex text-green-500 hover:text-green-700 focus:outline-none"
                                  onClick={() => removeSkill(skill)}
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Looking For</label>
                        <div className="mt-1 flex">
                          <input
                            type="text"
                            className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newLookingFor}
                            onChange={e => setNewLookingFor(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addLookingFor()}
                            placeholder="Add a skill needed"
                          />
                          <button
                            onClick={addLookingFor}
                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            Add
                          </button>
                        </div>
                        {newProjectGroup.lookingFor.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {newProjectGroup.lookingFor.map(skill => (
                              <span key={skill} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                {skill}
                                <button
                                  type="button"
                                  className="ml-1.5 inline-flex text-yellow-500 hover:text-yellow-700 focus:outline-none"
                                  onClick={() => removeLookingFor(skill)}
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Max Members</label>
                        <input
                          type="number"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newProjectGroup.maxMembers}
                          onChange={e => setNewProjectGroup({...newProjectGroup, maxMembers: parseInt(e.target.value) || 4})}
                          min="2"
                          max="10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCreateProjectGroup}
                  >
                    Create Group
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowProjectGroupModal(false);
                      resetProjectGroupForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Club Post Creation Modal */}
        {showClubPostModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create Club Post</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newClubPost.title}
                          onChange={(e) => setNewClubPost({...newClubPost, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          rows={4}
                          value={newClubPost.content}
                          onChange={(e) => setNewClubPost({...newClubPost, content: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tags</label>
                        <div className="mt-1 flex">
                          <input
                            type="text"
                            className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newTag) {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                            placeholder="Add a tag and press Enter"
                          />
                          <button
                            type="button"
                            onClick={addTag}
                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            Add
                          </button>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {newClubPost.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {tag}
                              <button
                                type="button"
                                className="ml-1.5 inline-flex text-blue-500 hover:text-blue-700 focus:outline-none"
                                onClick={() => removeTag(tag)}
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Club</label>
                        <select
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newClubPost.clubId}
                          onChange={(e) => setNewClubPost({...newClubPost, clubId: e.target.value})}
                        >
                          <option value="">Select a club</option>
                          {userClubs.map(club => (
                            <option key={club.id} value={club.id}>{club.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCreateClubPost}
                  >
                    Create Post
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowClubPostModal(false);
                      resetClubPostForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Club Creation Modal */}
        {showClubModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Club</h3>

                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="club-name" className="block text-sm font-medium text-gray-700">Club Name</label>
                        <input
                          type="text"
                          id="club-name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newClub.name}
                          onChange={e => handleClubInputChange('name', e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="club-description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          id="club-description"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newClub.description}
                          onChange={e => handleClubInputChange('description', e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="club-college" className="block text-sm font-medium text-gray-700">College</label>
                        <input
                          type="text"
                          id="club-college"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newClub.college}
                          onChange={e => handleClubInputChange('college', e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="club-category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                          id="club-category"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newClub.category}
                          onChange={e => handleClubInputChange('category', e.target.value as Club['category'])}
                        >
                          <option value="coding">Coding</option>
                          <option value="design">Design</option>
                          <option value="research">Research</option>
                          <option value="entrepreneurship">Entrepreneurship</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="club-tags" className="block text-sm font-medium text-gray-700">Tags</label>
                        <div className="mt-1 flex">
                          <input
                            type="text"
                            id="club-tags"
                            className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newTag}
                            onChange={e => setNewTag(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && newTag) {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                            placeholder="Add a tag and press Enter"
                          />
                          <button
                            type="button"
                            onClick={addTag}
                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            Add
                          </button>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {newClub.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {tag}
                              <button
                                type="button"
                                className="ml-1.5 inline-flex text-blue-500 hover:text-blue-700 focus:outline-none"
                                onClick={() => removeTag(tag)}
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="club-public"
                          name="club-public"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={newClub.isPublic}
                          onChange={e => handleClubInputChange('isPublic', e.target.checked)}
                        />
                        <label htmlFor="club-public" className="ml-2 block text-sm text-gray-700">
                          Make this club public
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCreateClub}
                  >
                    Create Club
                  </button>

                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowClubModal(false);
                      resetClubForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Community Creation Modal */}
        {showCommunityModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Community</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="community-name" className="block text-sm font-medium text-gray-700">Community Name</label>
                        <input
                          type="text"
                          id="community-name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newCommunity.name}
                          onChange={(e) => handleCommunityInputChange('name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="community-description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          id="community-description"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newCommunity.description}
                          onChange={(e) => handleCommunityInputChange('description', e.target.value)}
                        ></textarea>
                      </div>
                      <div>
                        <label htmlFor="community-topics" className="block text-sm font-medium text-gray-700">Topics</label>
                        <div className="mt-1 flex">
                          <input
                            type="text"
                            id="community-topics"
                            className="flex-grow border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                            placeholder="Add a topic"
                          />
                          <button
                            onClick={addTopic}
                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            Add
                          </button>
                        </div>
                        {newCommunity.topics.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {newCommunity.topics.map(topic => (
                              <span key={topic} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {topic}
                                <button
                                  type="button"
                                  className="ml-1.5 inline-flex text-green-500 hover:text-green-700 focus:outline-none"
                                  onClick={() => removeTopic(topic)}
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <input
                          id="community-public"
                          name="community-public"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={newCommunity.isPublic}
                          onChange={(e) => handleCommunityInputChange('isPublic', e.target.checked)}
                        />
                        <label htmlFor="community-public" className="ml-2 block text-sm text-gray-700">
                          Make this community public
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCreateCommunity}
                  >
                    Create Community
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowCommunityModal(false);
                      resetCommunityForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mentor Modal */}
        {showMentorModal && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Become a Mentor</h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        As a mentor, you'll be able to help other students, share your knowledge, and build your reputation in the community.
                        You'll be able to set your availability and specify which topics you're comfortable mentoring on.
                      </p>
                      <div className="mt-4 p-4 bg-blue-50 rounded-md">
                        <h4 className="font-medium text-blue-900">Benefits of being a mentor:</h4>
                        <ul className="mt-2 text-sm text-blue-800 list-disc list-inside space-y-1">
                          <li>Help others learn and grow</li>
                          <li>Build your professional network</li>
                          <li>Enhance your leadership skills</li>
                          <li>Gain recognition in the community</li>
                          <li>Improve your own understanding through teaching</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleBecomeMentor}
                  >
                    Become a Mentor
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setShowMentorModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Creation Modal */}
        {showEventModal && selectedClub && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Event for {selectedClub.name}</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Event Title</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newEvent.title}
                          onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          rows={3}
                          value={newEvent.description}
                          onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Event Type</label>
                          <select
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newEvent.type}
                            onChange={e => setNewEvent({...newEvent, type: e.target.value as ClubEvent['type']})}
                          >
                            <option value="workshop">Workshop</option>
                            <option value="talk">Talk</option>
                            <option value="coding_session">Coding Session</option>
                            <option value="project">Project</option>
                            <option value="guest_talk">Guest Talk</option>
                            <option value="hackathon">Hackathon</option>
                            <option value="social">Social</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Max Attendees</label>
                          <input
                            type="number"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newEvent.maxAttendees}
                            onChange={e => setNewEvent({...newEvent, maxAttendees: parseInt(e.target.value) || 0})}
                            min="0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                          type="datetime-local"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newEvent.date}
                          onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newEvent.location}
                          onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCreateClubEvent}
                  >
                    Create Event
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowEventModal(false);
                      resetEventForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resource Creation Modal */}
        {showResourceModal && selectedClub && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add Resource to {selectedClub.name}</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Resource Name</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newResource.name}
                          onChange={e => setNewResource({...newResource, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Resource Type</label>
                        <select
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newResource.type}
                          onChange={e => setNewResource({...newResource, type: e.target.value as ClubResources['type']})}
                        >
                          <option value="document">Document</option>
                          <option value="template">Template</option>
                          <option value="guide">Guide</option>
                          <option value="recording">Recording</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Resource URL</label>
                        <input
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newResource.url}
                          onChange={e => setNewResource({...newResource, url: e.target.value})}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleAddClubResource}
                  >
                    Add Resource
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowResourceModal(false);
                      resetResourceForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Collaboration;