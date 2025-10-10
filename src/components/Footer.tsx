// import { Link } from "react-router-dom";
// import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";

// export default function Footer() {
//   const currentYear = new Date().getFullYear();

//   return (
//     <>
//       {/* Desktop Footer (≥851px) */}
//       <footer className="hidden md:block bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             {/* Brand Section */}
//             <div className="md:col-span-1">
//               <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors duration-200 mb-4 inline-block">
//                 SᴛᴀᴄᴋHᴀᴄᴋ
//               </Link>
//               <p className="text-gray-300 mt-2 text-sm">
//                 Empowering developers with resources, roadmaps, and community collaboration.
//               </p>
//               <div className="flex space-x-4 mt-4">
//                 <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200">
//                   <FaGithub className="w-5 h-5" />
//                 </a>
//                 <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200">
//                   <FaTwitter className="w-5 h-5" />
//                 </a>
//                 <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200">
//                   <FaLinkedin className="w-5 h-5" />
//                 </a>
//                 <a href="mailto:contact@stackhack.com" className="text-gray-300 hover:text-white transition-colors duration-200">
//                   <FaEnvelope className="w-5 h-5" />
//                 </a>
//               </div>
//             </div>

//             {/* Resources Section */}
//             <div>
//               <h3 className="text-white font-semibold mb-4 text-lg">Resources</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <Link to="/resources" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">All Resources</Link>
//                 </li>
//                 <li>
//                   <Link to="/resources/tutorials" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Tutorials</Link>
//                 </li>
//                 <li>
//                   <Link to="/resources/articles" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Articles</Link>
//                 </li>
//                 <li>
//                   <Link to="/resources/courses" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Courses</Link>
//                 </li>
//                 <li>
//                   <Link to="/resources/books" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Books</Link>
//                 </li>
//               </ul>
//             </div>

//             {/* Community Section */}
//             <div>
//               <h3 className="text-white font-semibold mb-4 text-lg">Community</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <Link to="/community" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Forums</Link>
//                 </li>
//                 <li>
//                   <Link to="/community/discussions" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Discussions</Link>
//                 </li>
//                 <li>
//                   <Link to="/community/mentors" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Mentors</Link>
//                 </li>
//                 <li>
//                   <Link to="/community/events" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Events</Link>
//                 </li>
//                 <li>
//                   <Link to="/community/blogs" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Blogs</Link>
//                 </li>
//               </ul>
//             </div>

//             {/* Support Section */}
//             <div>
//               <h3 className="text-white font-semibold mb-4 text-lg">Support</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Help Center</Link>
//                 </li>
//                 <li>
//                   <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Contact Us</Link>
//                 </li>
//                 <li>
//                   <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">FAQ</Link>
//                 </li>
//                 <li>
//                   <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Privacy Policy</Link>
//                 </li>
//                 <li>
//                   <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Terms of Service</Link>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Bottom Bar */}
//           <div className="border-t border-blue-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-300 text-sm flex items-center">
//               Crafted with SᴛᴀᴄᴋHɑᴄᴋ · By Developers
//             </p>
//             <p className="text-gray-300 text-sm mt-4 md:mt-0">
//               © {currentYear} SᴛᴀᴄᴋHᴀᴄᴋ. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>

//       {/* Mobile Footer (≤850px) */}
//       <footer className="block md:hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
//         <div className="px-4 py-8">
//           <div className="flex flex-col space-y-8">
//             {/* Brand Section */}
//             <div>
//               <Link to="/" className="text-xl font-bold text-white hover:text-gray-300 transition-colors duration-200 mb-2 inline-block">
//                 SᴛᴀᴄᴋHᴀᴄᴋ
//               </Link>
//               <p className="text-gray-300 text-sm">
//                 Empowering developers with resources, roadmaps, and community collaboration.
//               </p>
//               <div className="flex space-x-4 mt-4">
//                 <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200">
//                   <FaGithub className="w-5 h-5" />
//                 </a>
//                 <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200">
//                   <FaTwitter className="w-5 h-5" />
//                 </a>
//                 <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200">
//                   <FaLinkedin className="w-5 h-5" />
//                 </a>
//                 <a href="mailto:contact@stackhack.com" className="text-gray-300 hover:text-white transition-colors duration-200">
//                   <FaEnvelope className="w-5 h-5" />
//                 </a>
//               </div>
//             </div>

//             {/* Accordion Sections */}
//             <div className="space-y-4">
//               {/* Resources Accordion */}
//               <details className="group">
//                 <summary className="flex justify-between items-center font-semibold cursor-pointer list-none text-lg">
//                   Resources
//                     <span className="transition-transform duration-200 group-open:rotate-180">
//                       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="inline w-4 h-4">
//                         <path d="M4 6l4 4 4-4" />
//                       </svg>
//                     </span>
//                 </summary>
//                 <ul className="mt-2 space-y-2 pl-4">
//                   <li>
//                     <Link to="/resources" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">All Resources</Link>
//                   </li>
//                   <li>
//                     <Link to="/resources/tutorials" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Tutorials</Link>
//                   </li>
//                   <li>
//                     <Link to="/resources/articles" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Articles</Link>
//                   </li>
//                   <li>
//                     <Link to="/resources/courses" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Courses</Link>
//                   </li>
//                   <li>
//                     <Link to="/resources/books" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Books</Link>
//                   </li>
//                 </ul>
//               </details>

//               {/* Community Accordion */}
//               <details className="group">
//                 <summary className="flex justify-between items-center font-semibold cursor-pointer list-none text-lg">
//                   Community
//                     <span className="transition-transform duration-200 group-open:rotate-180">
//                     <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="inline">
//                       <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
//                     </svg>
//                     </span>
//                 </summary>
//                 <ul className="mt-2 space-y-2 pl-4">
//                   <li>
//                     <Link to="/community" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Forums</Link>
//                   </li>
//                   <li>
//                     <Link to="/community/discussions" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Discussions</Link>
//                   </li>
//                   <li>
//                     <Link to="/community/mentors" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Mentors</Link>
//                   </li>
//                   <li>
//                     <Link to="/community/events" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Events</Link>
//                   </li>
//                   <li>
//                     <Link to="/community/blogs" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Blogs</Link>
//                   </li>
//                 </ul>
//               </details>

//               {/* Support Accordion */}
//               <details className="group">
//                 <summary className="flex justify-between items-center font-semibold cursor-pointer list-none text-lg">
//                   Support
//                     <span className="transition-transform duration-200 group-open:rotate-180">
//                       <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="inline">
//                       <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
//                       </svg>
//                     </span>
//                 </summary>
//                 <ul className="mt-2 space-y-2 pl-4">
//                   <li>
//                     <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Help Center</Link>
//                   </li>
//                   <li>
//                     <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Contact Us</Link>
//                   </li>
//                   <li>
//                     <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">FAQ</Link>
//                   </li>
//                   <li>
//                     <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Privacy Policy</Link>
//                   </li>
//                   <li>
//                     <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Terms of Service</Link>
//                   </li>
//                 </ul>
//               </details>
//             </div>

//             {/* Bottom Bar */}
//             <div className="border-t border-blue-800 pt-6 flex flex-col items-center">
//               <p className="text-gray-300 text-sm flex items-center mb-2">
//                Crafted with SᴛᴀᴄᴋHɑᴄᴋ · By Developers
//               </p>
//               <p className="text-gray-300 text-sm">
//                 © {currentYear} SᴛᴀᴄᴋHᴀᴄᴋ. All rights reserved.
//               </p>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </>
//   );
// }