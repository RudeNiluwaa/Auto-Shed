import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiCheckCircle, FiRefreshCw, FiEye, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function ConflictResolution() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 opacity-20 dark:opacity-10" style={{ zIndex: -1 }}></div>
        <div className="container mx-auto px-4 py-20 relative" style={{ zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Auto Conflict Resolution <span className="text-green-500">AI</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Real-time detection and automatic resolution of scheduling conflicts with 87% accuracy.
            </p>
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 pb-20 -mt-10 z-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Detection System */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                <FiAlertTriangle className="text-green-500 dark:text-green-400 text-xl" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Conflict Detection
              </h2>
            </div>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Scans schedules every 5 minutes for conflicts
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Identifies resource overallocations
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Flags time zone mismatches
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Detects double-booked participants
              </li>
            </ul>
          </motion.div>

          {/* Resolution Engine */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                <FiCheckCircle className="text-blue-500 dark:text-blue-400 text-xl" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Resolution Engine
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                <FiRefreshCw className="text-green-500 text-xl mb-2" />
                <p className="font-medium">Auto-resolve</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                <FiEye className="text-blue-500 text-xl mb-2" />
                <p className="font-medium">Suggestions</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                <FiSettings className="text-purple-500 text-xl mb-2" />
                <p className="font-medium">Custom rules</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg">
                <FiCheckCircle className="text-yellow-500 text-xl mb-2" />
                <p className="font-medium">87% success</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Demo Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Conflict Resolution Demo
          </h2>
          <div className="max-w-2xl mx-auto bg-gray-100 dark:bg-gray-700 rounded-xl p-8">
            <div className="flex justify-between mb-6">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">Detected Conflict</h3>
                <p className="text-gray-500 dark:text-gray-300">Team Meeting × Client Call</p>
              </div>
              <div className="space-x-2">
                <button className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-lg">
                  Ignore
                </button>
                <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                  Resolve
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {['Reschedule Team Meeting', 'Move Client Call', 'Combine Meetings', 'Cancel One'].map((item, index) => (
                <div key={index} className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full mr-4">
                    <FiCheckCircle className="text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white">{item}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{['9:30 AM', '11:00 AM', '10:00 AM', 'Cancel'][index]}</p>
                  </div>
                  <button className="text-green-500 hover:text-green-600 dark:hover:text-green-400">
                    <FiCheckCircle />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Resolution Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '87%', label: 'Success Rate', color: 'green' },
              { value: '3.2s', label: 'Avg. Resolution', color: 'blue' },
              { value: '24/7', label: 'Monitoring', color: 'purple' },
              { value: '92%', label: 'User Satisfaction', color: 'yellow' }
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
}