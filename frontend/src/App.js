import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
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
// New UI Components
import Header from './Componenets/Header';

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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <AnimatePresence mode="wait">
          <Routes>
            {/* Your existing routes with animations added */}
            <Route path="/" element={
              <PageLayout>
                <Home />
              </PageLayout>
            } />
            
            <Route path="/admin" element={
              <PageLayout>
                <Admin />
              </PageLayout>
            } />
            
            <Route path="/createpresentation" element={
              <PageLayout>
                <CreatePresentation />
              </PageLayout>
            } />
            
            <Route path="/edit/:id" element={
              <PageLayout>
                <EditPresentation />
              </PageLayout>
            } />
            
            <Route path="/add-examiner" element={
              <PageLayout>
                <AddExaminer />
              </PageLayout>
            } />
            
            <Route path="/get-examiner" element={
              <PageLayout>
                <GetExaminers />
              </PageLayout>
            } />
            
            <Route path="/login" element={
              <PageLayout>
                <Login />
              </PageLayout>
            } />
            
            <Route path="/register" element={
              <PageLayout>
                <Register />
              </PageLayout>
            } />
            
            <Route path="/pass-reset" element={
              <PageLayout>
                <PassReset />
              </PageLayout>
            } />
            
            <Route path="/forgot-pass" element={
              <PageLayout>
                <ForgotPass />
              </PageLayout>
            } />
            <Route path="/ai-dashboard" element={
              <PageLayout>
              <AIDashboard />
              </PageLayout>
            }/>
            <Route path="/smart-time-allocation" element={
              <SmartTimeAllocation />
            } />
            <Route path="/conflict-resolution" element={
              <ConflictResolution />
            } />
            <Route path="/performance-analytics" element={
              <PerformanceAnalytics />
            } />

          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;