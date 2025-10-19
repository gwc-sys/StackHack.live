export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface DeveloperInfo {
  name: string;
  title: string;
  photo: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  socialLinks: SocialLink[];
  skills: string[];
  experience: string;
  education: string;
}

// components/AboutPage.tsx
import React, { useState } from 'react';

const AboutPage: React.FC = () => {
  const developers: DeveloperInfo[] = [
    {
      name: "Mahesh Raskar",
      title: "Full Stack Developer & UI/UX Enthusiast",
      photo: '/src/assets/mahesh-profile-pic.JPG',
      bio: "Passionate developer with 5+ years of experience creating web applications. I love turning complex problems into simple, beautiful designs. When I'm not coding, you can find me hiking, reading tech blogs, or contributing to open-source projects.",
      email: "mahesh-raskar@outlook.com",
      phone: "+91 9890739710",
      location: "Pune, India",
      socialLinks: [
        { name: "GitHub", url: "https://github.com/gwc-sys", icon: "github" },
        { name: "LinkedIn", url: "https://www.linkedin.com/in/mahesh-r-0a109b20a", icon: "linkedin" },
        { name: "Twitter", url: "https://mahesh-raskar.com", icon: "twitter" },
        { name: "Portfolio", url: "https://mahesh-raskar.dev", icon: "globe" },
        { name: "WhatsApp", url: "https://wa.me/919130123", icon: "whatsapp" } // <-- Added WhatsApp
      ],
      skills: [
        "TypeScript", "React", "Node.js", "Tailwind CSS", "JavaScript", "Java", "C++", "C#", 
        "Django", "Flask", "Python", "MongoDB", "AWS", "Docker", "GraphQL"
      ],
      experience: "5+ years in web development",
      education: "Computer Science"
    },
    {
      name: "Sarah Johnson",
      title: "Frontend Developer & React Specialist",
      photo: "/images/sarah.jpg",
      bio: "Creative frontend developer with 3+ years of experience building responsive and accessible web applications. Passionate about user experience and modern JavaScript frameworks.",
      email: "sarah.johnson@example.com",
      phone: "+91 9130 124",
      location: "Bangalore, India",
      socialLinks: [
        { name: "GitHub", url: "https://github.com/sarahj", icon: "github" },
        { name: "LinkedIn", url: "https://linkedin.com/in/sarahj", icon: "linkedin" },
        { name: "Twitter", url: "https://twitter.com/sarahj", icon: "twitter" },
        { name: "Portfolio", url: "https://sarahjohnson.dev", icon: "globe" }
      ],
      skills: [
        "React", "TypeScript", "JavaScript", "CSS", "HTML", "Redux", "Next.js",
        "Jest", "Cypress", "Webpack", "SASS", "Styled Components"
      ],
      experience: "3+ years in frontend development",
      education: "Software Engineering"
    },
    {
      name: "Alex Chen",
      title: "Backend Developer & DevOps Engineer",
      photo: "/images/alex.jpg",
      bio: "Backend specialist with 4+ years of experience in building scalable APIs and cloud infrastructure. Focused on performance optimization and system architecture.",
      email: "alex.chen@example.com",
      phone: "+91 9130 125",
      location: "Hyderabad, India",
      socialLinks: [
        { name: "GitHub", url: "https://github.com/alexchen", icon: "github" },
        { name: "LinkedIn", url: "https://linkedin.com/in/alexchen", icon: "linkedin" },
        { name: "Twitter", url: "https://twitter.com/alexchen", icon: "twitter" }
      ],
      skills: [
        "Node.js", "Python", "AWS", "Docker", "Kubernetes", "PostgreSQL", "MongoDB",
        "Redis", "GraphQL", "REST APIs", "Microservices", "CI/CD"
      ],
      experience: "4+ years in backend development",
      education: "Computer Engineering"
    },
    {
      name: "Priya Sharma",
      title: "Mobile Developer & Cross-Platform Expert",
      photo: "/images/priya.jpg",
      bio: "Mobile app developer with expertise in cross-platform development. Passionate about creating seamless mobile experiences and optimizing app performance.",
      email: "priya.sharma@example.com",
      phone: "+91 9130 126",
      location: "Delhi, India",
      socialLinks: [
        { name: "GitHub", url: "https://github.com/priyas", icon: "github" },
        { name: "LinkedIn", url: "https://linkedin.com/in/priyasharma", icon: "linkedin" },
        { name: "Portfolio", url: "https://priyasharma.dev", icon: "globe" }
      ],
      skills: [
        "React Native", "Flutter", "iOS", "Android", "TypeScript", "Dart", "Swift",
        "Kotlin", "Firebase", "App Store", "Google Play"
      ],
      experience: "3+ years in mobile development",
      education: "Mobile Computing"
    }
  ];

  const [selectedDeveloper, setSelectedDeveloper] = useState<DeveloperInfo>(developers[0]);

  const getSocialIcon = (iconName: string) => {
    const icons: { [key: string]: string } = {
      github: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z",
      linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
      twitter: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
      globe: "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 20v-2.08c-2.339-.367-3.543-1.603-3.543-2.994 0-.244.024-.493.069-.739l1.812-1.473-2.032-2.696-2.785.699c-.624-1.479-.559-3.213.236-4.497 1.013-1.649 2.728-2.443 4.763-2.386v-1.93h2v1.93c1.673.065 3.081.716 3.822 1.771.741 1.055.774 2.365.238 3.586l2.785.699-2.032 2.696 1.812 1.473c.045.246.069.495.069.739 0 1.391-1.204 2.627-3.543 2.994v2.08h-2zm1-12c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z",
      whatsapp: "M16.7,13.4c-0.2-0.1-1.2-0.6-1.4-0.7c-0.2-0.1-0.4-0.1-0.6,0.1c-0.2,0.2-0.7,0.7-0.9,0.9 c-0.2,0.2-0.4,0.2-0.6,0.1c-0.2-0.1-0.9-0.3-1.7-1c-0.6-0.5-1-1.1-1.1-1.3c-0.1-0.2,0-0.4,0.1-0.5 c0.1-0.1,0.2-0.3,0.3-0.4c0.1-0.1,0.1-0.2,0.2-0.3c0.1-0.1,0.1-0.2,0-0.4c-0.1-0.2-0.6-1.4-0.8-1.9 c-0.2-0.5-0.4-0.4-0.6-0.4c-0.2,0-0.4,0-0.6,0c-0.2,0-0.4,0-0.6,0.2c-0.2,0.2-0.7,0.7-0.7,1.7 c0,1,0.7,2,0.8,2.1c0.1,0.1,1.4,2.2,3.4,3c0.5,0.2,0.9,0.3,1.2,0.4c0.5,0.1,0.9,0.1,1.2,0.1 c0.4,0,1.2-0.5,1.4-1c0.2-0.5,0.2-0.9,0.2-1C17,13.6,16.9,13.5,16.7,13.4z M12,2C6.5,2,2,6.5,2,12c0,2.1,0.6,4,1.7,5.7L2,22l4.3-1.7C7.9,21.4,9.9,22,12,22c5.5,0,10-4.5,10-10S17.5,2,12,2z M12,20c-1.8,0-3.5-0.5-5-1.4l-0.4-0.2l-2.5,1l0.9-2.6l-0.2-0.4C4.5,15.5,4,13.8,4,12c0-4.4,3.6-8,8-8s8,3.6,8,8S16.4,20,12,20z"
    };
    return icons[iconName] || icons.globe;
  };

  // Default profile SVG icon
  const DefaultProfileIcon = () => (
    <svg className="w-full h-full text-blue-400" viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="50" fill="#2196f3"/>
      <circle cx="50" cy="40" r="20" fill="#fff"/>
      <ellipse cx="50" cy="75" rx="28" ry="15" fill="#fff"/>
    </svg>
  );

  // Path to your default profile icon image

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the talented developers behind this project
          </p>
        </div>

        {/* Developer Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {developers.map((developer, index) => (
            <button
              key={index}
              onClick={() => setSelectedDeveloper(developer)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedDeveloper.name === developer.name
                  ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              {developer.name}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left Column - Photo & Basic Info */}
            <div className="md:w-1/3 bg-gradient-to-b from-blue-600 to-indigo-700 p-8 text-white">
              <div className="text-center">
                {/* Developer Photo */}
                <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center">
                  {selectedDeveloper.photo ? (
                    <img 
                      src={selectedDeveloper.photo} 
                      alt={selectedDeveloper.name}
                      className="w-full h-full object-cover"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <DefaultProfileIcon />
                  )}
                </div>
                
                <h2 className="text-2xl font-bold mb-2">{selectedDeveloper.name}</h2>
                <p className="text-blue-100 mb-6">{selectedDeveloper.title}</p>
                
                {/* Contact Information */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <span className="text-sm">{selectedDeveloper.email}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    <span className="text-sm">{selectedDeveloper.phone}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm">{selectedDeveloper.location}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-center">Connect With Me</h3>
                  <div className="flex justify-center space-x-4">
                    {selectedDeveloper.socialLinks.map((link: SocialLink) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300 transform hover:scale-110"
                        aria-label={link.name}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d={getSocialIcon(link.icon)}/>
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="md:w-2/3 p-8">
              {/* Bio */}
              <section className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">About</h3>
                <p className="text-gray-600 leading-relaxed">{selectedDeveloper.bio}</p>
              </section>

              {/* Skills */}
              <section className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDeveloper.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Experience & Education */}
              <div className="grid md:grid-cols-2 gap-6">
                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Experience</h3>
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full mt-1 mr-3"></div>
                    <p className="text-gray-600">{selectedDeveloper.experience}</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Education</h3>
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-green-500 rounded-full mt-1 mr-3"></div>
                    <p className="text-gray-600">{selectedDeveloper.education}</p>
                  </div>
                </section>
              </div>

              {/* Call to Action */}
              <section className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Let's Work Together!</h3>
                  <p className="text-gray-600 mb-4">
                    Interested in collaborating or have a project in mind?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={`mailto:${selectedDeveloper.email}`}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium"
                    >
                      Send Email
                    </a>
                    <a
                      href={selectedDeveloper.socialLinks.find(link => link.name === "LinkedIn")?.url || selectedDeveloper.socialLinks[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 font-medium"
                    >
                      View LinkedIn
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Team Overview */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Development Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {developers.map((developer, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {developer.photo ? (
                    <img 
                      src={developer.photo} 
                      alt={developer.name}
                      className="w-full h-full object-cover"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <DefaultProfileIcon />
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{developer.name}</h3>
                <p className="text-sm text-indigo-600 mb-3">{developer.title}</p>
                <p className="text-xs text-gray-600 mb-4">{developer.location}</p>
                <button
                  onClick={() => setSelectedDeveloper(developer)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-sm"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Facts Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-indigo-600 mb-2">50+</div>
            <div className="text-gray-600">Projects Completed</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-indigo-600 mb-2">15+</div>
            <div className="text-gray-600">Years Combined Experience</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-2xl font-bold text-indigo-600 mb-2">100%</div>
            <div className="text-gray-600">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;