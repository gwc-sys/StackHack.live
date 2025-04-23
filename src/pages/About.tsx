export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">About StudentPortal</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-lg mb-6">
            Welcome to StudentPortal, your comprehensive resource for engineering education materials. 
            We provide access to past question papers, study materials, and educational resources 
            across various engineering disciplines.
          </p>
          <p className="text-lg mb-6">
            Our mission is to help engineering students excel in their academic journey by providing 
            easy access to quality study materials and resources.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
              <p>
                To become the leading platform for engineering education resources, helping students 
                achieve academic excellence and prepare for their professional careers.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Previous Year Question Papers</li>
                <li>Study Materials and Notes</li>
                <li>Branch-wise Resources</li>
                <li>College and University Information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}