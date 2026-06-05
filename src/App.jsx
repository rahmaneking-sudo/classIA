import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CustomCursor from './effects/CustomCursor';
import Navbar from './components/Navbar';
import CinematicSlideshow from './effects/Scrollytelling';
import CinematicBackground from './effects/CinematicBackground';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import StudentLogin from './components/StudentLogin';
import StudentDashboard from './components/StudentDashboard';
import PromptsLibrary from './components/PromptsLibrary';
import Courses from './components/Courses';
import Shop from './components/Shop';
import NewsFeed from './components/NewsFeed';
import ClientLogin from './components/ClientLogin';
import ClientDashboard from './components/ClientDashboard';
import Landing from './components/ExpressBuilder/Landing';
import Builder from './components/ExpressBuilder/Builder';
import SiteViewer from './components/ExpressBuilder/SiteViewer';

const AppContent = () => {
  const location = useLocation();
  const isSiteRoute = location.pathname.startsWith('/site/');

  return (
    <div className="relative w-full text-white min-h-screen font-['Inter']">
      {!isSiteRoute && <CinematicBackground />}
      {!isSiteRoute && <CustomCursor />}
      {!isSiteRoute && <Navbar />}
      
      <Routes>
        <Route path="/" element={<CinematicSlideshow />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Client Portal (Agency) */}
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />

        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/prompts" element={<PromptsLibrary />} />
        <Route path="/cours" element={<Courses />} />
        <Route path="/boutique" element={<Shop />} />
        <Route path="/actu-ia" element={<NewsFeed />} />
        
        {/* Express Builder SaaS Routes */}
        <Route path="/creation-site" element={<Landing />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/site/:slug" element={<SiteViewer />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
