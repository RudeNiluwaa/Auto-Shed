import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiTrendingUp, FiZap, FiBarChart2, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const aiSchedulingImage = '/assests/ai-scheduling.jpg';
const analyticsImage = '/assests/analytics.jpg';
const conflictImage = '/assests/conflict.jpg';

export default function AIDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section - Adjusted z-index and padding */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 dark:opacity-10" style={{ zIndex: 0 }}></div>
        <div className="container mx-auto px-4 pt-32 pb-20 relative" style={{ zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Intelligent Scheduling <span className="text-blue-500">Powered by AI</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Our machine learning algorithms optimize schedules, prevent conflicts, and maximize efficiency.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Grid - Adjusted margin and z-index */}
      <div className="container mx-auto px-4 pb-20 -mt-20 relative" style={{ zIndex: 20 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Time Slot Optimization */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/smart-time-allocation')}
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={aiSchedulingImage} 
                alt="AI Scheduling" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                  <FiClock className="text-blue-500 dark:text-blue-400 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Smart Time Allocation
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                AI analyzes hundreds of factors to suggest perfect time slots with 92% accuracy.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-500">Live Preview</span>
                <button className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <FiZap className="text-xl" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Conflict Resolution */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/conflict-resolution')}
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={conflictImage} 
                alt="Conflict Resolution" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                  <FiTrendingUp className="text-green-500 dark:text-green-400 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Auto Conflict Resolution
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Real-time detection and automatic resolution of scheduling conflicts.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-500">Active Monitoring</span>
                <button className="text-green-500 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <FiSettings className="text-xl" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Analytics */}
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/performance-analytics')}
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={analyticsImage} 
                alt="Analytics Dashboard" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                  <FiBarChart2 className="text-purple-500 dark:text-purple-400 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Performance Analytics
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Visualize scheduling patterns and optimize resource allocation.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-purple-500">View Reports</span>
                <button className="text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  <FiTrendingUp className="text-xl" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            AI Scheduling Performance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
            >
              <div className="text-4xl font-bold text-blue-500 mb-2">92%</div>
              <div className="text-gray-600 dark:text-gray-300">Scheduling Accuracy</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl"
            >
              <div className="text-4xl font-bold text-green-500 mb-2">87%</div>
              <div className="text-gray-600 dark:text-gray-300">Conflict Resolution</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
            >
              <div className="text-4xl font-bold text-purple-500 mb-2">3.5x</div>
              <div className="text-gray-600 dark:text-gray-300">Faster Scheduling</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl"
            >
              <div className="text-4xl font-bold text-yellow-500 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-300">Automation</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}