import React from 'react';
import { Toaster } from 'react-hot-toast';
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
import Footer from './Componenets/footer'; // Import the Footer component


const PageLayout = ({ children, showFooter = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.35, ease: "easeInOut" }}
    className="flex flex-col min-h-screen"
  >
    <div className="flex-grow">
      {children}
    </div>
    {showFooter && <Footer />}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position='top-center'/>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageLayout showFooter={false}><Login /></PageLayout>} />
          <Route path="/register" element={<PageLayout showFooter={false}><Register /></PageLayout>} />
          
          <Route path="/home" element={<PageLayout><Home /></PageLayout>} />
          <Route path="/admin" element={<PageLayout><Admin /></PageLayout>} />
          <Route path="/createpresentation" element={<PageLayout><CreatePresentation /></PageLayout>} />
          <Route path="/edit/:id" element={<PageLayout><EditPresentation /></PageLayout>} />
          <Route path="/add-examiner" element={<PageLayout><AddExaminer /></PageLayout>} />
          <Route path="/get-examiner-user" element={<PageLayout><GetExaminers role="user" /></PageLayout>} />
          <Route path="/get-examiner-admin" element={<PageLayout><GetExaminers role="admin" /></PageLayout>} />
          <Route path="/pass-reset" element={<PageLayout><PassReset /></PageLayout>} />
          <Route path='/add-reschedule' element={<PageLayout><AddSchedule /></PageLayout>} />
          <Route path='/get-reschedule-user' element={<PageLayout><GetSchedules role="user" /></PageLayout>} />
          <Route path='/get-reschedule-admin' element={<PageLayout><GetSchedules role="admin" /></PageLayout>} />
          <Route path='/update-reschedule/:id' element={<PageLayout><UpdateReschedule /></PageLayout>} />
          <Route path="/forgot-pass" element={<PageLayout><ForgotPass /></PageLayout>} />
          <Route path="/ai-dashboard" element={<PageLayout><AIDashboard /></PageLayout>} />
          <Route path="/smart-time-allocation" element={<PageLayout><SmartTimeAllocation /></PageLayout>} />
          <Route path="/conflict-resolution" element={<PageLayout><ConflictResolution /></PageLayout>} />
          <Route path="/performance-analytics" element={<PageLayout><PerformanceAnalytics /></PageLayout>} />
        </Routes>
      </AnimatePresence>
    </div>
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