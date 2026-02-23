import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaClipboardList, FaQuestionCircle, FaUsers, FaThList, FaChartLine } from "react-icons/fa";
import "../styles/sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <nav>
        <NavLink to="/dashboard">
          <FaHome className="sidebar-icon" />
          <span className="sidebar-text">Dashboard</span>
        </NavLink>
        <NavLink to="/quiz-management">
          <FaClipboardList className="sidebar-icon" />
          <span className="sidebar-text">Quizzes</span>
        </NavLink>
        <NavLink to="/question-management">
          <FaQuestionCircle className="sidebar-icon" />
          <span className="sidebar-text">Questions</span>
        </NavLink>
        <NavLink to="/user-management">
          <FaUsers className="sidebar-icon" />
          <span className="sidebar-text">Users</span>
        </NavLink>
        <NavLink to="/category-management">
          <FaThList className="sidebar-icon" />
          <span className="sidebar-text">Categories</span>
        </NavLink>
        <NavLink to="/reports">
          <FaChartLine className="sidebar-icon" />
          <span className="sidebar-text">Reports</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
