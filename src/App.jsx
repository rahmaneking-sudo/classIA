import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import Landing from './components/ExpressBuilder/Landing';
import Builder from './components/ExpressBuilder/Builder';
import SiteViewer from './components/ExpressBuilder/SiteViewer';

function App() {
  return (
    <BrowserRouter>
      <div className="relative w-full text-white min-h-screen font-['Inter']">
        <CinematicBackground />
        <CustomCursor />
        <Navbar />
        <Routes>
          <Route path="/" element={<CinematicSlideshow />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
    </BrowserRouter>
  );
}

export default App;
