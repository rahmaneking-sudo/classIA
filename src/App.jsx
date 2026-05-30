import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomCursor from './effects/CustomCursor';
import Navbar from './components/Navbar';
import CinematicSlideshow from './effects/Scrollytelling';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import StudentLogin from './components/StudentLogin';
import StudentDashboard from './components/StudentDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="relative w-full bg-[#020205] text-white min-h-screen font-['Inter']">
        <CustomCursor />
        <Navbar />
        <Routes>
          <Route path="/" element={<CinematicSlideshow />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
