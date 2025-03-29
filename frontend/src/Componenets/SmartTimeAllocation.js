import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiZap, FiCalendar, FiUsers, FiPieChart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SmartTimeAllocation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 dark:opacity-10" style={{ zIndex: 0 }}></div>
        <div className="container mx-auto px-4 py-20 relative" style={{ zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Smart Time Allocation <span className="text-blue-500">AI</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Advanced algorithms that analyze multiple factors to optimize your schedule with 92% accuracy.
            </p>
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 pb-20 -mt-10 z-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Algorithm Details */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                <FiClock className="text-blue-500 dark:text-blue-400 text-xl" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                How It Works
              </h2>
            </div>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Analyzes 150+ scheduling factors in real-time
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Learns from historical scheduling patterns
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Adapts to organizational priorities
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Integrates with existing calendar systems
              </li>
            </ul>
          </motion.div>

          {/* Benefits */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                <FiZap className="text-green-500 dark:text-green-400 text-xl" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Key Benefits
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                <FiUsers className="text-blue-500 text-xl mb-2" />
                <p className="font-medium">Reduced conflicts</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                <FiPieChart className="text-purple-500 text-xl mb-2" />
                <p className="font-medium">92% accuracy</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                <FiCalendar className="text-green-500 text-xl mb-2" />
                <p className="font-medium">Time savings</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg">
                <FiClock className="text-yellow-500 text-xl mb-2" />
                <p className="font-medium">Real-time</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Demo Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Try It Now
          </h2>
          <div className="max-w-2xl mx-auto bg-gray-100 dark:bg-gray-700 rounded-xl p-8">
            <div className="flex justify-between mb-6">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">Monday</h3>
                <p className="text-gray-500 dark:text-gray-300">June 12, 2023</p>
              </div>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                Generate Schedule
              </button>
            </div>
            <div className="space-y-3">
              {['Team Meeting', 'Client Call', 'Focus Work', 'Review Session'].map((item, index) => (
                <div key={index} className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full mr-4">
                    <FiCalendar className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white">{item}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Recommended: {['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'][index]}</p>
                  </div>
                  <button className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                    <FiZap />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '92%', label: 'Accuracy', color: 'blue' },
              { value: '3.5x', label: 'Faster', color: 'green' },
              { value: '87%', label: 'Adoption', color: 'purple' },
              { value: '24/7', label: 'Availability', color: 'yellow' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`text-center p-6 bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-xl`}
              >
                <div className={`text-4xl font-bold text-${stat.color}-500 mb-2`}>{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartTimeAllocation;