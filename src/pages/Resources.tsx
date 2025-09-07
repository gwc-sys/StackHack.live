import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Configure axios base URL - adjust according to your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:8000';
axios.defaults.baseURL = API_BASE_URL;

interface Resource {
  id: number;
  title: string;
  file_url: string;
  upload_date: string;
  file_type: string;
  size: string;
  college?: string;
  branch?: string;
  resource_type?: string;
  description: string;
}

const COLLEGES = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'IIT Roorkee', 'IIT Guwahati', 'IIT Hyderabad', 'NIT Trichy', 'NIT Surathkal',
  'NIT Warangal', 'BITS Pilani', 'DTU Delhi', 'NSUT Delhi', 'IIIT Hyderabad',
  'Government College of Engineering, Karad (GCEK) – Autonomous',
  'Government College of Engineering, Jalgaon (GCOEJ)',
  'Government College of Engineering, Chandrapur (GCEC)',
  'Government College of Engineering, Amravati (GCOEA)',
  'Vishwakarma Institute of Technology (VIT, Pune) – Autonomous',
  'Maharashtra Institute of Technology (MIT, Pune) – Autonomous',
  'D.Y. Patil College of Engineering, Pune (DYPCoE) – Autonomous',
  'AISSMS College of Engineering (AISSMSCOE, Pune)',
  'Army Institute of Technology (AIT, Pune) – For defense personnel',
  'Sinhgad College of Engineering (SCOE, Vadgaon)',
  'Pimpri Chinchwad College of Engineering (PCCOE, Pune)',
  'JSPMs Rajarshi Shahu College of Engineering (RSCOE, Tathawade)',
  'MKSSSs Cummins College of Engineering for Women (CCEW, Pune)',
  'All India Shri Shivaji Memorial Societys COE (AISSMSCOE, Pune)',
  'Zeal College of Engineering & Research (ZCOER, Narhe)',
  'International Institute of Information Technology (I²IT, Pune)',
  'Sinhgad Academy of Engineering (SAOE, Kondhwa)',
  'Marathwada Mitra Mandals College of Engineering (MMCOE, Pune)',
  'D.Y. Patil College of Engineering, Akurdi (DYPCOE)',
  'JSPMMs Imperial College of Engineering & Research (ICoER, Wagholi)',
  'Indira College of Engineering & Management (ICEM, Pune)',
  'SIT College of Engineering (SIT, Lonavala)',
  'Sandip Institute of Engineering & Management (SIEM, Nashik)',
  'NBN Sinhgad School of Engineering (NBNSSOE, Pune)',
  'G.H. Raisoni College of Engineering & Management (GHRCEM, Pune)',
  'Sinhgad Institute of Technology & Science (SITS, Narhe)',
  'Vishwakarma Institute of Information Technology (VIIT, Pune)',
  'Sinhgad College of Engineering, Pandharpur',
  'Jayawantrao Sawant College of Engineering (JSCOE, Pune)',
  'TSSMMs Bhivarabai Sawant College of Engineering (BSCOE, Pune)',
  'Dattakala Group of Institutions, Pune',
  'Suman Ramesh Tulsiani Technical Campus (SRTTC, Pune)',
  'KJ College of Engineering & Management Research (KJCOEMR) – Pune',
  'Trinity Academy of Engineering (TAE)',
  'Trinity College of Engineering & Research (TCER)'
];

const BRANCHES = [
  'ENTC','CSE', 'ECE', 'EEE', 'ME', 'CE', 
  'IT', 'AIML', 'DS', 'AERO', 'AUTO',
  'BIOTECH', 'CHEM', 'META', 'MINING', 'PROD'
];

const RESOURCE_TYPES = [
  'Assignment', 'Learning Notes', 'Lab Manual', 'Resources', 'Question Paper',
  'Project Report', 'Tutorial', 'Presentation', 'Research Paper'
];

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_FILE_TYPES = ['pdf', 'docx', 'pptx', 'txt', 'zip'];

const ResourcesPage = () => {
  const { user, isAuthenticated, isSuperUser, logout } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [filters, setFilters] = useState({
    college: '',
    branch: '',
    resourceType: ''
  });

  // Fetch resources from backend
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await axios.get(`http://localhost:8000/api/documents/recent/`);
        const mappedResources = response.data.slice(0, 10).map((doc: any) => ({
          id: doc.id,
          title: doc.name || doc.title || 'Untitled',
          file_url: doc.file_url || doc.file,
          upload_date: doc.uploaded_at || doc.upload_date,
          file_type: doc.resource_type || doc.file_type || 'pdf',
          size: doc.size || 'Unknown',
          college: doc.college || '',
          branch: doc.branch || '',
          resource_type: doc.resource_type || '',
          description: doc.description || '',
        }));
        setResources(mappedResources);
        setFilteredResources(mappedResources);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Filter resources based on search query and filters
  useEffect(() => {
    let filtered = resources;
    
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.college && resource.college.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (resource.branch && resource.branch.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (resource.resource_type && resource.resource_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filters.college) {
      filtered = filtered.filter(resource => 
        resource.college === filters.college
      );
    }
    
    if (filters.branch) {
      filtered = filtered.filter(resource => 
        resource.branch === filters.branch
      );
    }
    
    if (filters.resourceType) {
      filtered = filtered.filter(resource => 
        resource.resource_type === filters.resourceType
      );
    }
    
    setFilteredResources(filtered);
  }, [searchQuery, resources, filters]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop()?.toLowerCase();

      if (fileExt && !ALLOWED_FILE_TYPES.includes(fileExt)) {
        setError(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024 ) {
        setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        return;
      }

      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title) {
      setError('Please select a file and provide a title');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      setUploadSuccess(false);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('college', college);
      formData.append('branch', branch);
      formData.append('resource_type', resourceType);

      // const response = await axios.post('https://stackhack-live.onrender.com/api/upload/', formData, {
         const response = await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      const newResource = {
        id: response.data.id,
        title: response.data.title,
        file_url: response.data.file_url,
        upload_date: response.data.upload_date || new Date().toISOString(),
        file_type: response.data.file_type || selectedFile.name.split('.').pop()?.toLowerCase(),
        size: formatFileSize(response.data.size || selectedFile.size),
        college: response.data.college,
        branch: response.data.branch,
        resource_type: response.data.resource_type,
        description: response.data.description,
      };

      setResources(prev => [newResource, ...prev]);
      setFilteredResources(prev => [newResource, ...prev]);

      setTitle('');
      setDescription('');
      setCollege('');
      setBranch('');
      setResourceType('');
      setSelectedFile(null);
      setUploadSuccess(true);

    } catch (err) {
      let errorMessage = 'Upload failed. Please try again.';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || 
                      err.response?.data?.detail ||
                      JSON.stringify(err.response?.data) || 
                      errorMessage;
      }
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getFileIcon = (fileType: string) => {
    const iconClass = "w-6 h-6";
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <svg className={`${iconClass} text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>;
      case 'docx':
        return <svg className={`${iconClass} text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>;
      case 'pptx':
        return <svg className={`${iconClass} text-orange-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>;
      case 'zip':
        return <svg className={`${iconClass} text-purple-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8v16m16-8v8m0 0v-8a2 2 0 00-2-2h-6m0 0l-3-3m0 0l-3 3m3-3v12" />
        </svg>;
      default:
        return <svg className={`${iconClass} text-gray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>;
    }
  };

  const applyFilter = (type: 'college' | 'branch' | 'resourceType', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      college: '',
      branch: '',
      resourceType: ''
    });
    setSearchQuery('');
  };

  const handleDeleteResource = async (resourceId: number) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      await axios.delete(`https://stackhack-live.onrender.com/api/documents/${resourceId}/`);
      setResources(prev => prev.filter(resource => resource.id !== resourceId));
      setFilteredResources(prev => prev.filter(resource => resource.id !== resourceId));
    } catch (error) {
      console.error('Failed to delete resource:', error);
      setError('Failed to delete resource. Please try again.');
    }
  };

  const handleOpenDocument = (resource: Resource) => {
    if (!isAuthenticated) {
      setError('Please log in to view documents');
      return;
    }
    window.open(resource.file_url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Upload result notification */}
        {(uploadSuccess || error) && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-center font-medium text-sm ${uploadSuccess ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {uploadSuccess ? 'Resource uploaded successfully!' : error}
          </div>
        )}
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Engineering Resource Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover, share, and collaborate on the best engineering resources
          </p>
          
          {/* User Status */}
          <div className="mt-4">
            {isAuthenticated ? (
              <div className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                <span className="text-sm text-gray-700 mr-3">
                  Welcome, {user?.username} {isSuperUser && '(Super User)'}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                Guest user - <span className="text-blue-600">Log in to access more features</span>
              </div>
            )}
          </div>
        </div>

        {/* Search and Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Search Panel */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search resources by title, college, branch, or keyword..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Active filters */}
            {(filters.college || filters.branch || filters.resourceType) && (
              <div className="mb-4">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm text-gray-500">Filters:</span>
                  {filters.college && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      College: {filters.college}
                      <button 
                        onClick={() => applyFilter('college', '')}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  {filters.branch && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Branch: {filters.branch}
                      <button 
                        onClick={() => applyFilter('branch', '')}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  {filters.resourceType && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Type: {filters.resourceType}
                      <button 
                        onClick={() => applyFilter('resourceType', '')}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 ml-2"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Resource Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-800">Total Resources</p>
                <p className="text-2xl font-bold text-blue-600">{resources.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-sm font-medium text-green-800">Colleges</p>
                <p className="text-2xl font-bold text-green-600">{COLLEGES.length}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <p className="text-sm font-medium text-purple-800">Resource Types</p>
                <p className="text-2xl font-bold text-purple-600">{RESOURCE_TYPES.length}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <p className="text-sm font-medium text-amber-800">Downloads</p>
                <p className="text-2xl font-bold text-amber-600">1.2K+</p>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Filter by College</h3>
                <select
                  value={filters.college}
                  onChange={(e) => applyFilter('college', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">All Colleges</option>
                  {COLLEGES.map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Filter by Branch</h3>
                <select
                  value={filters.branch}
                  onChange={(e) => applyFilter('branch', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">All Branches</option>
                  {BRANCHES.map(br => (
                    <option key={br} value={br}>{br}</option>
                  ))}
                </select>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Filter by Type</h3>
                <select
                  value={filters.resourceType}
                  onChange={(e) => applyFilter('resourceType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">All Types</option>
                  {RESOURCE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Upload Panel - Visible to everyone, but only superusers can upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New Resource</h2>
            {!isSuperUser && (
              <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                Only Admin can upload resources. The form is disabled for your account.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Resource Title*
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Data Structures Notes"
                  required
                  disabled={!isSuperUser}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
                    College*
                  </label>
                  <select
                    id="college"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!isSuperUser}
                  >
                    <option value="">Select College</option>
                    {COLLEGES.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                    Branch*
                  </label>
                  <select
                    id="branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!isSuperUser}
                  >
                    <option value="">Select Branch</option>
                    {BRANCHES.map(br => (
                      <option key={br} value={br}>{br}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="resourceType" className="block text-sm font-medium text-gray-700 mb-1">
                  Resource Type*
                </label>
                <select
                  id="resourceType"
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!isSuperUser}
                >
                  <option value="">Select Type</option>
                  {RESOURCE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Upload* (Max {MAX_FILE_SIZE_MB}MB)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v-8a4 4 0 00-4-4H12a4 4 0 01-4 4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".pdf,.docx,.pptx,.txt,.zip"
                          onChange={handleFileChange}
                          className="sr-only"
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {ALLOWED_FILE_TYPES.map(ext => ext.toUpperCase()).join(', ')} up to {MAX_FILE_SIZE_MB}MB
                    </p>
                  </div>
                </div>
                {selectedFile && (
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <svg className="flex-shrink-0 mr-1 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{selectedFile.name}</span>
                    <span className="ml-2 text-gray-500">{formatFileSize(selectedFile.size)}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Brief description of the resource..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading || !isSuperUser}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : 'Upload Resource'}
              </button>
            </form>
          </div>
        </div>

        {/* Resources List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Latest Resources
                {searchQuery && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    (Filtered by "{searchQuery}")
                  </span>
                )}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  Showing {filteredResources.length} of {resources.length} resources
                </span>
              </div>
            </div>
          </div>

          {isLoading && !filteredResources.length ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error && !filteredResources.length ? (
            <div className="p-6 bg-red-50 border-l-4 border-red-500">
              <p className="text-red-700">{error}</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No resources found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'Try a different search term' : 'Be the first to upload a resource!'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredResources.map((resource) => (
                <li key={resource.id} className="hover:bg-gray-50 transition-colors">
                  <div className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getFileIcon(resource.file_type)}
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {resource.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex space-x-1">
                            {resource.resource_type && (
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                {resource.resource_type}
                              </p>
                            )}
                            {resource.branch && (
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {resource.branch}
                              </p>
                            )}
                            {resource.college && (
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {resource.college}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="mr-2">{resource.file_type.toUpperCase()}</span>
                          <span className="mx-1">•</span>
                          <span>{resource.size}</span>
                          <span className="mx-1">•</span>
                          <span>{formatDate(resource.upload_date)}</span>
                        </div>
                        {resource.description && (
                          <p className="mt-1 text-sm text-gray-500 truncate">
                            {resource.description}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        {/* View/Open Button */}
                        <button
                          onClick={() => handleOpenDocument(resource)}
                          disabled={!isAuthenticated}
                          className={`inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md ${
                            isAuthenticated 
                              ? 'text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                              : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                          }`}
                          title={isAuthenticated ? "Open document" : "Please log in to view documents"}
                        >
                          {isAuthenticated ? 'Open' : 'Log in to View'}
                        </button>

                        {/* Download Button */}
                        <a
                          href={resource.file_url}
                          download
                          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Download
                        </a>

                        {/* Delete Button - Only for Super Users */}
                        {isSuperUser && (
                          <button
                            onClick={() => handleDeleteResource(resource.id)}
                            className="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Delete resource"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;