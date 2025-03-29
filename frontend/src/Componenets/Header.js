import { motion } from 'framer-motion';
import { FiBell, FiSun, FiMoon, FiSearch, FiCalendar } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationCount] = useState(3);

  // Your existing dark mode logic (unchanged)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <motion.header 
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-50"
    >
      <div className="flex items-center space-x-8">
        <motion.h1 
          whileHover={{ scale: 1.02 }}
          className="text-xl font-bold text-gray-800 dark:text-white"
        >
          Presentation Scheduler
        </motion.h1>
        
        {/* NEW: AI Dashboard Link - Only this line was added */}
        <Link to="/ai-dashboard" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
          <FiCalendar className="text-lg" />
          <span>AI Scheduling</span>
        </Link>
      </div>

      {/* Rest of your existing header code remains exactly the same */}
      <div className="flex items-center space-x-4">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 200, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden md:flex items-center relative"
        >
          <FiSearch className="absolute left-3 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </motion.div>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {darkMode ? <FiSun className="text-yellow-400"/> : <FiMoon className="text-gray-600"/>}
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
        >
          <FiBell className="text-gray-600 dark:text-gray-300"/>
          {notificationCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: 'spring',
                stiffness: 500,
                damping: 15
              }}
              className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {notificationCount}
            </motion.span>
          )}
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
            A
          </div>
          <span className="hidden md:inline font-medium text-gray-700 dark:text-gray-300">
            Admin
          </span>
        </motion.div>
      </div>
    </motion.header>
  );
}