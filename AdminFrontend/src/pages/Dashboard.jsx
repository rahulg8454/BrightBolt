import React, { useState, useEffect } from "react";
import axiosInstance from '../components/axios_instance';
import '../styles/Dashborad.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    quizzes: 0,
    attempts: 0,
    passRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetching stats data from backend
  const fetchDashboardStats = async () => {
    try {
      const response = await axiosInstance.get("/api/dashboard-stats");
      const data = response.data;
      setStats({
        users: data.users || 0,
        quizzes: data.quizzes || 0,
        attempts: data.attempts || 0,
        passRate: data.passRate || 0,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setError("Failed to load data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div className="dashboard">Loading...</div>;
  }

  if (error) {
    return <div className="dashboard">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Users</h3>
          <p>{stats.users}</p>
        </div>
        <div className="stat-card">
          <h3>Quizzes</h3>
          <p>{stats.quizzes}</p>
        </div>
        <div className="stat-card">
          <h3>Attempts</h3>
          <p>{stats.attempts}</p>
        </div>
        <div className="stat-card">
          <h3>Pass Rate</h3>
          <p>{stats.passRate}%</p>
        </div>
      </div>
      <div className="chart-section">
        <div className="chart">
          <h3>User Growth</h3>
          <p>Placeholder for chart</p>
        </div>
        <div className="chart">
          <h3>Quiz Performance</h3>
          <p>Placeholder for chart</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
