import React, { useState } from 'react';
import { Instagram, Facebook, Twitter, Mail, BookOpen, ArrowUp, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  
  const handleSubscribe = () => {
    if (email && email.includes('@')) {
      alert(`Thank you for subscribing with ${email}! You'll receive our latest updates.`);
      setEmail('');
    } else {
      alert('Please enter a valid email address');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="w-full bg-gradient-to-b from-gray-800 to-black text-white mt-auto border-t-4 border-gray-700">
      {/* Main footer content */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <BookOpen size={28} className="mr-2" />
              <h2 className="text-xl font-bold">Presentation Scheduler</h2>
            </div>
            <p className="text-gray-300 mb-4">Intelligent scheduling platform for academic presentations and exams. Streamline your academic scheduling process with our AI-powered tools.</p>
          </div>
          
          {/* Quick links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/home" className="text-gray-300 hover:text-white transition duration-300">Dashboard</Link></li>
              <li><Link to="/createpresentation" className="text-gray-300 hover:text-white transition duration-300">Create Presentation</Link></li>
              <li><Link to="/ai-dashboard" className="text-gray-300 hover:text-white transition duration-300">AI Tools</Link></li>
              <li><Link to="/add-reschedule" className="text-gray-300 hover:text-white transition duration-300">Schedule Management</Link></li>
              <li><Link to="/get-examiner-user" className="text-gray-300 hover:text-white transition duration-300">Examiners</Link></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Newsletter</h3>
            <p className="text-gray-300 mb-3">Subscribe for updates on new features and scheduling tips.</p>
            <div className="flex flex-col space-y-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email" 
                className="bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400" 
              />
              <button 
                onClick={handleSubscribe} 
                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition duration-300"
              >
                Subscribe
              </button>
            </div>
          </div>
          
          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Us</h3>
            <p className="text-gray-300 mb-2">Support Center</p>
            <p className="text-gray-300 mb-2">University Campus</p>
            <p className="text-gray-300 mb-4">support@scheduler.edu</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Presentation Scheduler. All rights reserved.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex space-x-4 mb-4 md:mb-0 md:mr-8">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition duration-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition duration-300">Help Center</a>
            </div>
            <button 
              onClick={scrollToTop}
              className="flex items-center bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition duration-300"
              aria-label="Scroll to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
        
        {/* Made with love */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs flex items-center justify-center">
            Made with <Heart size={12} className="mx-1 text-red-500" /> for academic excellence
          </p>
        </div>
      </div>
    </footer>
  );
}