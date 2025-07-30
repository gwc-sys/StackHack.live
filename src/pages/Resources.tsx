import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Resource {
    id: number;
    title: string;
    file_url: string;
    upload_date: string;
    file_type: string;
    size: string;
    branch?: string;
}

const ResourcesPage = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [branch, setBranch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch resources from Django backend
    useEffect(() => {
        const fetchResources = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/resources/');
                setResources(response.data);
                setFilteredResources(response.data);
            } catch (err) {
                console.error('Error fetching resources:', err);
                setError('Failed to load resources');
            } finally {
                setIsLoading(false);
            }
        };

        fetchResources();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredResources(resources);
        } else {
            const filtered = resources.filter(resource =>
                resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (resource.branch && resource.branch.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredResources(filtered);
        }
    }, [searchQuery, resources]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile || !title) {
            setError('Please select a file and provide a title');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('title', title);
            if (branch) {
                formData.append('branch', branch);
            }

            // Django expects CSRF token for authenticated requests
            const csrfToken = document.cookie.split('; ')
                .find(row => row.startsWith('csrftoken='))
                ?.split('=')[1];

            const response = await axios.post('/api/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true,
            });

            setResources([response.data, ...resources]);
            setTitle('');
            setBranch('');
            setSelectedFile(null);
        } catch (err) {
            console.error('Upload failed:', err);
            setError('File upload failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Engineering Resources</h1>
                    <h2 className="text-2xl font-light text-gray-600 mb-6">Reimagined</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        The most comprehensive platform for engineering students with thousands of question papers,
                        study materials, video lectures, and a thriving community.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search for your branch..."
                            className="w-full p-4 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg
                            className="absolute left-4 top-4 h-5 w-5 text-gray-400"
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

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3 bg-blue-50 rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Upload Resources</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter resource title"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                                        Branch (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="branch"
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g. CSE, ECE, ME"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        File Upload
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg
                                                    className="w-8 h-8 mb-4 text-gray-500"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 16"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                    />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PDF, DOCX, PPTX (MAX. 10MB)
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                accept=".pdf,.docx,.pptx"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                required
                                            />
                                        </label>
                                    </div>
                                    {selectedFile && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            Selected: <span className="font-medium">{selectedFile.name}</span> ({formatFileSize(selectedFile.size)})
                                        </p>
                                    )}
                                </div>

                                {error && <p className="text-sm text-red-600">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                                >
                                    {isLoading ? 'Uploading...' : 'Upload Resource'}
                                </button>
                            </form>
                        </div>

                        <div className="w-full md:w-2/3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">Latest Resources</h3>
                                <button className="text-blue-600 hover:text-blue-800 font-medium">
                                    Explore All Resources
                                </button>
                            </div>

                            <div className="space-y-4">
                                {isLoading && !filteredResources.length ? (
                                    <div className="flex justify-center items-center h-40">
                                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : error && !filteredResources.length ? (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                        <p className="text-red-700">{error}</p>
                                    </div>
                                ) : filteredResources.length === 0 ? (
                                    <div className="bg-blue-50 rounded-lg p-6 text-center">
                                        <p className="text-gray-600">No resources found matching your search.</p>
                                    </div>
                                ) : (
                                    filteredResources.slice(0, 5).map((resource) => (
                                        <div key={resource.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{resource.title}</h4>
                                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                                        {resource.branch && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                                                {resource.branch}
                                                            </span>
                                                        )}
                                                        <span>{resource.file_type}</span>
                                                        <span className="mx-1">•</span>
                                                        <span>{resource.size}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-500">{formatDate(resource.upload_date)}</span>
                                                    <a
                                                        href={resource.file_url}
                                                        download
                                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        Download
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-8 bg-blue-50 rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">Join Our Community</h3>
                                <p className="text-gray-600 mb-4">
                                    Connect with thousands of engineering students, share knowledge, and get help with your studies.
                                </p>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                                    Join Community
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {filteredResources.length > 5 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">All Resources</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Branch
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Size
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Download</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredResources.slice(5).map((resource) => (
                                        <tr key={resource.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {resource.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {resource.branch || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {resource.file_type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {resource.size}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(resource.upload_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a
                                                    href={resource.file_url}
                                                    download
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Download
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResourcesPage;

