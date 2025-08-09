import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import LeaveManagement from './pages/modules/LeaveManagement';
import MissionEntry from './pages/modules/MissionEntry';
import ComplaintTracker from './pages/modules/ComplaintTracker';
import AttendanceMonitoring from './pages/modules/AttendanceMonitoring';
import MessFeedback from './pages/modules/MessFeedback';
import DigitalID from './pages/modules/DigitalID';
import EmergencyAlert from './pages/modules/EmergencyAlert';
import NoticeBoard from './pages/modules/NoticeBoard';
import TaskChecklist from './pages/modules/TaskChecklist';
import PeerHelp from './pages/modules/PeerHelp';
import LostFound from './pages/modules/LostFound';
import AttendanceMarking from './pages/modules/AttendanceMarking';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/leave-management" element={<Layout><LeaveManagement /></Layout>} />
            <Route path="/mission-entry" element={<Layout><MissionEntry /></Layout>} />
            <Route path="/complaint-tracker" element={<Layout><ComplaintTracker /></Layout>} />
            <Route path="/attendance-monitoring" element={<Layout><AttendanceMonitoring /></Layout>} />
            <Route path="/mess-feedback" element={<Layout><MessFeedback /></Layout>} />
            <Route path="/digital-id" element={<Layout><DigitalID /></Layout>} />
            <Route path="/emergency-alert" element={<Layout><EmergencyAlert /></Layout>} />
            <Route path="/notice-board" element={<Layout><NoticeBoard /></Layout>} />
            <Route path="/task-checklist" element={<Layout><TaskChecklist /></Layout>} />
            <Route path="/peer-help" element={<Layout><PeerHelp /></Layout>} />
            <Route path="/lost-found" element={<Layout><LostFound /></Layout>} />
            <Route path="/attendance-marking" element={<Layout><AttendanceMarking /></Layout>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;