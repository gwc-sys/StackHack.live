import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

interface CertificateProps {
  userName: string;
  courseTitle: string;
  date: string;
  certificateId: string;
}

const Certificate: React.FC<CertificateProps> = ({ userName, courseTitle, date, certificateId }) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certRef.current) return;
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2 });
      const link = document.createElement('a');
      link.download = `${userName}_${courseTitle.replace(/\s+/g, '_')}_certificate.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center p-10 bg-gray-100 min-h-screen">
      <div
        ref={certRef}
        className="relative w-[900px] h-[600px] bg-white border-8 border-yellow-400 p-12 rounded-xl shadow-2xl flex flex-col justify-between"
        style={{
          background: "linear-gradient(to right, #fefce8, #fff, #fefce8)",
          fontFamily: "'Times New Roman', serif"
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-yellow-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-yellow-500"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-yellow-500"></div>
        
        {/* Logo */}
        <div className="absolute top-12 left-12 w-24 h-24 flex items-center justify-center bg-blue-800 text-white font-bold rounded-full shadow-md">
          LOGO
        </div>

        {/* Certificate Title */}
        <div className="text-center mt-20">
          <h1 className="text-5xl font-bold text-gray-800 tracking-wider">CERTIFICATE</h1>
          <div className="w-48 h-1 bg-yellow-500 mx-auto my-4"></div>
          <p className="text-xl text-gray-600 mt-2">Of Achievement Presented To</p>

          <h2 className="text-4xl font-semibold text-blue-800 mt-6 uppercase tracking-wide">{userName}</h2>
          
          <div className="w-32 h-1 bg-yellow-500 mx-auto my-6"></div>
          
          <p className="text-gray-700 mt-4 text-xl">for successfully completing</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2 italic">{courseTitle}</p>
        </div>

        {/* Signature & Date */}
        <div className="flex justify-between mt-20 px-12">
          <div className="text-center">
            <div className="h-px bg-gray-400 w-48 mb-2 mx-auto"></div>
            <p className="text-gray-700 font-semibold">Director of Education</p>
            <p className="text-gray-500 mt-1">SIGNATURE</p>
          </div>
          <div className="text-center">
            <div className="h-px bg-gray-400 w-48 mb-2 mx-auto"></div>
            <p className="text-gray-700 font-semibold">Date of Completion</p>
            <p className="text-gray-500 mt-1">{date}</p>
          </div>
        </div>

        {/* Certificate ID */}
        <p className="absolute bottom-8 right-12 text-gray-500 text-sm">Certificate ID: {certificateId}</p>
      </div>

      <button
        onClick={handleDownload}
        className="mt-8 px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Certificate
      </button>
    </div>
  );
};

const CertificateGenerator: React.FC = () => {
  const [userName, setUserName] = useState('John Smith');
  const [courseTitle, setCourseTitle] = useState('Advanced Web Development');
  const [date, setDate] = useState('2024-05-08');
  const [certificateId, setCertificateId] = useState('CERT-2024-12345');
  const [showCertificate, setShowCertificate] = useState(false);

  const handleGenerate = () => {
    setShowCertificate(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-2">Certificate Generator</h1>
        <p className="text-lg text-center text-gray-600 mb-10">Create and download professional certificates</p>
        
        {!showCertificate ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Certificate Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Recipient's Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter recipient's name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Course Title</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter course title"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Date of Completion</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Certificate ID</label>
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter certificate ID"
                />
              </div>
              
              <button
                onClick={handleGenerate}
                className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Generate Certificate
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Certificate
              userName={userName}
              courseTitle={courseTitle}
              date={new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              certificateId={certificateId}
            />
            <button
              onClick={() => setShowCertificate(false)}
              className="mt-6 px-6 py-2 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50"
            >
              Edit Details
            </button>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">How to Use</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600">
            <li>Fill in the certificate details</li>
            <li>Click "Generate Certificate" to preview</li>
            <li>Click "Download Certificate" to save as PNG</li>
            <li>Click "Edit Details" to make changes</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;