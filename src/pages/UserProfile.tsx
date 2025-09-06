import React, { useState, useEffect, useContext } from "react";
import { AuthContext, api } from "./AuthContext"; // Import the AuthContext and api

interface User {
  id: string;
  username: string;
  full_name?: string;
  email: string;
  phone?: string;
  profile_image?: string;
  bio?: string;
  location?: string;
  social_links?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
  skills?: string[];
  interests?: string[];
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "settings" | "security">("profile");
  const [tempUserData, setTempUserData] = useState<Partial<User>>({});
  
  // Use the AuthContext for logout functionality
  const { logout: authLogout } = useContext(AuthContext);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/me/");
      setUser(response.data);
      setError(null);
    } catch (err: any) {
      setError("Failed to fetch user profile. Please check your session.");
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTempUserData({ ...tempUserData, [name]: value });
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setTempUserData({
      ...tempUserData,
      social_links: {
        ...tempUserData.social_links,
        [platform]: value
      }
    });
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.put("/profile/", {
        ...tempUserData,
        full_name: tempUserData.full_name || user.full_name,
        phone: tempUserData.phone || user.phone,
        bio: tempUserData.bio || user.bio,
        location: tempUserData.location || user.location,
        social_links: tempUserData.social_links || user.social_links,
      });
      
      if (response.data) {
        setUser({ ...user, ...response.data });
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");
        setTempUserData({});
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error("No data returned from server");
      }
    } catch (err: any) {
      setError("Failed to update profile: " + (err.response?.data?.message || err.message));
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !user) return;
    const file = e.target.files[0];
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("profile_picture", file);

      const response = await api.post("/profile/picture/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (response.data) {
        setUser({
          ...user,
          profile_image: response.data.profile_picture_url || response.data.profileImageUrl,
        });
        setSuccessMessage("Profile picture updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      setError("Failed to upload profile picture: " + (err.response?.data?.message || err.message));
      console.error("Error uploading profile picture:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.delete("/profile/picture/");
      
      if (response.status === 200 || response.status === 204) {
        setUser({
          ...user,
          profile_image: undefined,
        });
        setSuccessMessage("Profile picture removed successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      setError("Failed to remove profile picture: " + (err.response?.data?.message || err.message));
      console.error("Error removing profile picture:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempUserData({});
    setError(null);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      // Use the logout function from AuthContext which handles session code
      await authLogout();
      // Redirect to login page after logout
      window.location.href = "/login";
    } catch (err: any) {
      setError("Failed to logout: " + (err.response?.data?.message || err.message));
      console.error("Error during logout:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // This would be implemented with your backend API
      const response = await api.put("/change-password/", {
        current_password: (e.target as any).current_password.value,
        new_password: (e.target as any).new_password.value,
        confirm_password: (e.target as any).confirm_password.value,
      });
      
      if (response.status === 200) {
        setSuccessMessage("Password updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        // Reset the form
        (e.target as HTMLFormElement).reset();
      }
    } catch (err: any) {
      setError("Failed to update password: " + (err.response?.data?.message || err.message));
      console.error("Error updating password:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-white flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-gray-300">Loading your SᴛᴀᴄᴋHᴀᴄᴋ profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-red-400 bg-gray-800 p-6 rounded-xl shadow-lg">
          {error || "Failed to load user profile."}
        </div>
      </div>
    );
  }

  const displayName = user.full_name || user.username;
  const profileImage = user.profile_image;

  // Get social links from temp data or user data
  const socialLinks = {
    github: tempUserData.social_links?.github || user.social_links?.github || "",
    linkedin: tempUserData.social_links?.linkedin || user.social_links?.linkedin || "",
    twitter: tempUserData.social_links?.twitter || user.social_links?.twitter || "",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-3">
              <i className="fas fa-brain text-white"></i>
            </div>
            <h1 className="text-2xl font-bold">SᴛᴀᴄᴋHᴀᴄᴋ<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Profile</span></h1>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center py-2 px-4 rounded-lg bg-gray-800 hover:bg-red-500/20 transition-all group"
            disabled={loading}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <i className="fas fa-sign-out-alt mr-2 text-red-400 group-hover:text-red-300"></i>
            )}
            <span className="text-red-400 group-hover:text-red-300">Logout</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-400/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-400/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-700 mb-4 flex items-center justify-center bg-gray-700 relative">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl font-bold text-gray-300">
                        {displayName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                    
                    {isEditing && activeTab === "profile" && (
                      <div className="absolute bottom-0 right-0 flex flex-col space-y-2">
                        <label htmlFor="profile-picture-upload" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors">
                          <i className="fas fa-camera text-white text-sm"></i>
                          <input
                            id="profile-picture-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            className="hidden"
                          />
                        </label>
                        {profileImage && (
                          <button 
                            onClick={handleRemoveProfilePicture}
                            className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                            title="Remove profile picture"
                            disabled={loading}
                          >
                            <i className="fas fa-trash text-white text-sm"></i>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mt-4">{displayName}</h2>
                <p className="text-gray-400">{user.email}</p>
                
                {user.skills && user.skills.length > 0 && (
                  <div className="mt-6 w-full">
                    <h3 className="font-semibold mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {user.interests && user.interests.length > 0 && (
                  <div className="mt-6 w-full">
                    <h3 className="font-semibold mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map((interest, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {(user.social_links || isEditing) && (
                  <div className="mt-6 w-full">
                    <h3 className="font-semibold mb-3">Social Links</h3>
                    {isEditing && activeTab === "profile" ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">GitHub</label>
                          <input
                            type="url"
                            value={socialLinks.github}
                            onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            placeholder="https://github.com/username"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn</label>
                          <input
                            type="url"
                            value={socialLinks.linkedin}
                            onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Twitter</label>
                          <input
                            type="url"
                            value={socialLinks.twitter}
                            onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            placeholder="https://twitter.com/username"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-around">
                        {user.social_links?.github && (
                          <a href={user.social_links.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-500 transition-colors">
                            <i className="fab fa-github text-white"></i>
                          </a>
                        )}
                        {user.social_links?.linkedin && (
                          <a href={user.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-500 transition-colors">
                            <i className="fab fa-linkedin-in text-white"></i>
                          </a>
                        )}
                        {user.social_links?.twitter && (
                          <a href={user.social_links.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-500 transition-colors">
                            <i className="fab fa-twitter text-white"></i>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Profile Content */}
          <div className="lg:col-span-2">
            <div className="flex bg-gray-800/50 rounded-2xl p-1 mb-6 w-full">
              <button 
                className={`flex-1 py-3 px-4 rounded-lg text-center transition-all ${activeTab === "profile" ? "bg-blue-500/20 border-l-2 border-blue-500" : "hover:bg-gray-700/50"}`}
                onClick={() => setActiveTab("profile")}
              >
                <i className="fas fa-user-circle mr-2"></i>Profile
              </button>
              <button 
                className={`flex-1 py-3 px-4 rounded-lg text-center transition-all ${activeTab === "settings" ? "bg-blue-500/20 border-l-2 border-blue-500" : "hover:bg-gray-700/50"}`}
                onClick={() => setActiveTab("settings")}
              >
                <i className="fas fa-cog mr-2"></i>Settings
              </button>
              <button 
                className={`flex-1 py-3 px-4 rounded-lg text-center transition-all ${activeTab === "security" ? "bg-blue-500/20 border-l-2 border-blue-500" : "hover:bg-gray-700/50"}`}
                onClick={() => setActiveTab("security")}
              >
                <i className="fas fa-shield-alt mr-2"></i>Security
              </button>
            </div>
            
            {/* Profile Tab Content */}
            {activeTab === "profile" && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                      <i className="fas fa-edit mr-2"></i>Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        className="py-2 px-4 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center hover:from-green-600 hover:to-green-700 transition-all"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check mr-2"></i>Save Changes
                          </>
                        )}
                      </button>
                      <button
                        className="py-2 px-4 rounded-lg bg-gray-700 flex items-center hover:bg-gray-600 transition-all"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        <i className="fas fa-times mr-2"></i>Cancel
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={user.username}
                      disabled
                      className="w-full px-4 py-3 rounded-lg bg-gray-700/50 text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={isEditing ? (tempUserData.full_name ?? user.full_name ?? "") : (user.full_name ?? "")}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                        !isEditing
                          ? "bg-gray-700/50 text-gray-300"
                          : "bg-gray-700 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 rounded-lg bg-gray-700/50 text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={isEditing ? (tempUserData.phone ?? user.phone ?? "") : (user.phone ?? "")}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                        !isEditing
                          ? "bg-gray-700/50 text-gray-300"
                          : "bg-gray-700 text-white"
                      }`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={isEditing ? (tempUserData.bio ?? user.bio ?? "") : (user.bio ?? "")}
                      onChange={handleInputChange}
                      rows={3}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                        !isEditing
                          ? "bg-gray-700/50 text-gray-300"
                          : "bg-gray-700 text-white"
                      }`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={isEditing ? (tempUserData.location ?? user.location ?? "") : (user.location ?? "")}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                        !isEditing
                          ? "bg-gray-700/50 text-gray-300"
                          : "bg-gray-700 text-white"
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Settings Tab Content */}
            {activeTab === "settings" && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700 shadow-xl">
                <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-400">Receive updates about your account via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Appearance</h3>
                    <div className="flex space-x-4">
                      <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all">
                        Light
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-blue-500 text-white transition-all">
                        Dark
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all">
                        Auto
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                    <button 
                      onClick={handleLogout}
                      className="w-full py-3 px-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500 flex items-center justify-center hover:bg-red-500/30 transition-all"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                          Logging out...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-out-alt mr-2"></i>
                          Logout from all devices
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Security Tab Content */}
            {activeTab === "security" && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-700 shadow-xl">
                <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                        <input
                          type="password"
                          name="current_password"
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                          placeholder="Enter your current password"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                        <input
                          type="password"
                          name="new_password"
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                          placeholder="Enter your new password"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          name="confirm_password"
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                          placeholder="Confirm your new password"
                          required
                        />
                      </div>
                      <button 
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* AI Assistant */}
        <div className="fixed bottom-6 right-6">
          <button className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
            <i className="fas fa-robot text-white text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;