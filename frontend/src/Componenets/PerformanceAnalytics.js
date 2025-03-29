import React from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiTrendingUp, FiPieChart, FiDatabase, FiDownload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function PerformanceAnalytics() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 opacity-20 dark:opacity-10" style={{ zIndex: -1 }}></div>
        <div className="container mx-auto px-4 py-20 relative" style={{ zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Performance Analytics <span className="text-purple-500">Dashboard</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Comprehensive insights and visualization of your scheduling patterns and efficiency.
            </p>
            <button 
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 pb-20 -mt-10 z-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Analytics Overview */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                <FiBarChart2 className="text-purple-500 dark:text-purple-400 text-xl" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Analytics Overview
              </h2>
            </div>
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                Real-time scheduling metrics
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                Resource utilization trends
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                Conflict occurrence patterns
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                Time allocation efficiency
              </li>
            </ul>
          </motion.div>

          {/* Data Visualization */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center mb-6">
              <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-full mr-4">
                <FiTrendingUp className="text-pink-500 dark:text-pink-400 text-xl" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Visualization Tools
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
                <FiBarChart2 className="text-purple-500 text-xl mb-2" />
                <p className="font-medium">Bar Charts</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                <FiPieChart className="text-blue-500 text-xl mb-2" />
                <p className="font-medium">Pie Charts</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                <FiTrendingUp className="text-green-500 text-xl mb-2" />
                <p className="font-medium">Line Graphs</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg">
                <FiDatabase className="text-yellow-500 text-xl mb-2" />
                <p className="font-medium">Data Export</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Demo Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Analytics Dashboard Preview
          </h2>
          <div className="max-w-4xl mx-auto bg-gray-100 dark:bg-gray-700 rounded-xl p-8">
            <div className="flex justify-between mb-6">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">Last 30 Days</h3>
                <p className="text-gray-500 dark:text-gray-300">Scheduling Efficiency Metrics</p>
              </div>
              <button className="flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
                <FiDownload className="mr-2" />
                Export Report
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sample Chart Placeholders */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg h-64 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <FiBarChart2 className="text-4xl text-purple-500 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Resource Utilization Chart</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg h-64 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <FiPieChart className="text-4xl text-blue-500 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Time Distribution Pie Chart</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Key Performance Indicators
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '92%', label: 'Utilization', color: 'purple' },
              { value: '3.5x', label: 'Efficiency', color: 'blue' },
              { value: '87%', label: 'Accuracy', color: 'green' },
              { value: '24/7', label: 'Tracking', color: 'yellow' }
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