import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';
import AddExaminer from './Componenets/AddExaminer';
import GetExaminers from './Componenets/GetExaminers';
import Home from './Componenets/Home';
import CreatePresentation from './Componenets/CreatePresentation';
import EditPresentation from './Componenets/EditPresentation';
import Login from './Componenets/Login';
import Register from './Componenets/Register';
import PassReset from './Componenets/PassReset';
import ForgotPass from './Componenets/ForgotPass';
import Admin from './Componenets/Admin';
import AIDashboard from './Componenets/AIDashboard';
import SmartTimeAllocation from './Componenets/SmartTimeAllocation';
import ConflictResolution from './Componenets/ConflictResolution';
import PerformanceAnalytics from './Componenets/PerformanceAnalytics';
import AddSchedule from './Componenets/AddSchedule';
import GetSchedules from './Componenets/GetSchedules';
import UpdateReschedule from './Componenets/UpdateReschedule';


const PageLayout = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.35, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageLayout><Login /></PageLayout>} />
        <Route path="/home" element={<PageLayout><Home /></PageLayout>} />
        <Route path="/admin" element={<PageLayout><Admin /></PageLayout>} />
        <Route path="/createpresentation" element={<PageLayout><CreatePresentation /></PageLayout>} />
        <Route path="/edit/:id" element={<PageLayout><EditPresentation /></PageLayout>} />
        <Route path="/add-examiner" element={<PageLayout><AddExaminer /></PageLayout>} />
        <Route path="/get-examiner-user" element={<PageLayout><GetExaminers role="user" /></PageLayout>} />
        <Route path="/get-examiner-admin" element={<PageLayout><GetExaminers role="admin" /></PageLayout>} />
        <Route path="/register" element={<PageLayout><Register /></PageLayout>} />
        <Route path="/pass-reset" element={<PageLayout><PassReset /></PageLayout>} />
        <Route path='/add-reschedule' element={<AddSchedule />} />
        <Route path='/get-reschedule-user' element={<GetSchedules role="user" />} />
        <Route path='/get-reschedule-admin' element={<GetSchedules role="admin" />} />
        <Route path='/update-reschedule/:id' element={<UpdateReschedule />} />
        <Route path="/forgot-pass" element={<PageLayout><ForgotPass /></PageLayout>} />
        <Route path="/ai-dashboard" element={<PageLayout><AIDashboard /></PageLayout>} />
        <Route path="/smart-time-allocation" element={<PageLayout><SmartTimeAllocation /></PageLayout>} />
        <Route path="/conflict-resolution" element={<PageLayout><ConflictResolution /></PageLayout>} />
        <Route path="/performance-analytics" element={<PageLayout><PerformanceAnalytics /></PageLayout>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
