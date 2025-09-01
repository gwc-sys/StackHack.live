import React, { useState, useEffect } from 'react';
import axios from 'axios';

// User interface definition
interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  socialLinks?: {
    linkedIn?: string;
    github?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
  skills?: string[];
  interests?: string[];
}

// API service functions
const userApi = {
  getProfile: async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateProfile: async (userData: Partial<User>) => {
    const token = localStorage.getItem('authToken');
    const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/user/profile`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  uploadProfilePicture: async (file: File) => {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/user/profile/picture`, 
      formData, 
      {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  },

  removeProfilePicture: async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/user/profile/picture`, 
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  }
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await userApi.getProfile();
      setUser(userData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch user profile');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (user) {
      setUser({ ...user, [name]: value });
    }
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    if (user) {
      setUser({
        ...user,
        socialLinks: {
          ...user.socialLinks,
          [platform]: value
        }
      });
    }
  };

  const handleSkillsChange = (skillsString: string) => {
    if (user) {
      const skillsArray = skillsString.split(',').map(skill => skill.trim());
      setUser({ ...user, skills: skillsArray });
    }
  };

  const handleInterestsChange = (interestsString: string) => {
    if (user) {
      const interestsArray = interestsString.split(',').map(interest => interest.trim());
      setUser({ ...user, interests: interestsArray });
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await userApi.updateProfile(user);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;

    const file = e.target.files[0];
    
    try {
      setLoading(true);
      const response = await userApi.uploadProfilePicture(file);
      setUser({ ...user, profilePicture: response.profilePictureUrl });
      setSuccessMessage('Profile picture updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to upload profile picture');
      console.error('Error uploading profile picture:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await userApi.removeProfilePicture();
      setUser({ ...user, profilePicture: undefined });
      setSuccessMessage('Profile picture removed successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to remove profile picture');
      console.error('Error removing profile picture:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">Failed to load user profile.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
        {!isEditing && (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
          {successMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 mb-4">
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl text-gray-600">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {isEditing && (
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <label 
                htmlFor="profile-picture-upload" 
                className="bg-blue-500 hover:bg-blue-600 text-white text-center font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Change Picture
              </label>
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
              
              {user.profilePicture && (
                <button 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  onClick={handleRemoveProfilePicture}
                >
                  Remove Picture
                </button>
              )}
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={user.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                />
              </div>
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={user.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                />
              </div>
              
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                />
                <span className="absolute right-3 top-9 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={user.phone || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio / About
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={user.bio || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Advanced Information (Optional)</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={user.location || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="w-20 text-sm font-medium text-gray-700">LinkedIn</span>
                    <input
                      type="url"
                      placeholder="LinkedIn URL"
                      value={user.socialLinks?.linkedIn || ''}
                      onChange={(e) => handleSocialLinkChange('linkedIn', e.target.value)}
                      disabled={!isEditing}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                      }`}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <span className="w-20 text-sm font-medium text-gray-700">GitHub</span>
                    <input
                      type="url"
                      placeholder="GitHub URL"
                      value={user.socialLinks?.github || ''}
                      onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                      disabled={!isEditing}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                      }`}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <span className="w-20 text-sm font-medium text-gray-700">Twitter</span>
                    <input
                      type="url"
                      placeholder="Twitter URL"
                      value={user.socialLinks?.twitter || ''}
                      onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                      disabled={!isEditing}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                        !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  placeholder="React, TypeScript, Node.js"
                  value={user.skills?.join(', ') || ''}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                />
              </div>
              
              <div>
                <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
                  Interests (comma separated)
                </label>
                <input
                  type="text"
                  id="interests"
                  placeholder="Photography, Hiking, Reading"
                  value={user.interests?.join(', ') || ''}
                  onChange={(e) => handleInterestsChange(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4">
              <button 
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              
              <button 
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                onClick={() => {
                  setIsEditing(false);
                  fetchUserProfile(); // Reset changes
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;