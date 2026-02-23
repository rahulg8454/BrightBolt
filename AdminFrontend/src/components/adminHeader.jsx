import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/adminHeader.css";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/logging");
  };

  return (
    <header className="admin-header">
      <div className="logo">
        Quiz Admin
      </div>
      <nav className="nav-links">
        <Link to="/profile" className="profile">Profile</Link>
        <button id="logout" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
};

export default AdminHeader;
