import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import QuizManagement from "./pages/QuizManagement.jsx";
import UserManagement from "./pages/userManagement";
import CatagoryManagement from "./pages/categoryManagement.jsx";
import AdminProfile from './pages/profile.jsx';
import QuestionManagement from "./pages/QuestionManagement.jsx";
import ParentManager from './components/ParentManager.jsx';
import Reports from "./pages/Reports";
import AdminHeader from "./components/adminHeader";
import Sidebar from "./components/adminSidebar";
import "./styles/adminStyles.css";
import LoginPage from "./pages/adminLogin.jsx";
import Signup from "./pages/signup.jsx";

const AdminLayout = ({ children }) => (
  <div className="admin-app">
    <AdminHeader />
    <div className="main-content">
      <Sidebar />
      <div className="page-content">
        {children}
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes - no header/sidebar */}
        <Route path="/" element={<Navigate to="/logging" replace />} />
        <Route path="/logging" element={<LoginPage />} />
        <Route path="/Signup" element={<Signup />} />

        {/* Protected routes - with header and sidebar */}
        <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/quiz-management" element={<AdminLayout><QuizManagement /></AdminLayout>} />
        <Route path="/question-management" element={<AdminLayout><QuestionManagement /></AdminLayout>} />
        <Route path="/user-management" element={<AdminLayout><UserManagement /></AdminLayout>} />
        <Route path="/category-management" element={<AdminLayout><CatagoryManagement /></AdminLayout>} />
        <Route path="/profile" element={<AdminLayout><AdminProfile /></AdminLayout>} />
        <Route path="/reports" element={<AdminLayout><Reports /></AdminLayout>} />
        <Route path="/parent-manager" element={<AdminLayout><ParentManager /></AdminLayout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/logging" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
