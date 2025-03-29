import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const slotVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  },
  hover: {
    y: -3,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
  }
};

export default function ScheduleCalendar() {
  const [slots, setSlots] = useState([
    { id: 1, time: '9:00 AM', examiner: 'Dr. Smith', student: 'John Doe', status: 'approved', confidence: 92 },
    { id: 2, time: '10:30 AM', examiner: 'Dr. Johnson', student: 'Jane Smith', status: 'pending', confidence: 85 }
  ]);

  const handleStatusChange = (id, newStatus) => {
    setSlots(slots.map(slot => 
      slot.id === id ? { ...slot, status: newStatus } : slot
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">AI-Generated Schedule</h2>
        
        <div className="space-y-3">
          <AnimatePresence>
            {slots.map((slot) => (
              <motion.div
                key={slot.id}
                variants={slotVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className={`p-4 rounded-lg border-2 transition-all ${
                  slot.status === 'approved' ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30' :
                  slot.status === 'pending' ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/30' :
                  'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{slot.time}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Examiner: {slot.examiner}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Student: {slot.student}</p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusChange(slot.id, 'approved')}
                      className="p-1.5 rounded-md bg-green-100 dark:bg-green-800/50 hover:bg-green-200 dark:hover:bg-green-700"
                    >
                      ✓
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusChange(slot.id, 'rejected')}
                      className="p-1.5 rounded-md bg-red-100 dark:bg-red-800/50 hover:bg-red-200 dark:hover:bg-red-700"
                    >
                      ✕
                    </motion.button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">AI Confidence: {slot.confidence}%</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        slot.confidence > 80 ? 'bg-green-500' :
                        slot.confidence > 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${slot.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}