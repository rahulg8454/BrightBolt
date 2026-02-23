import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/axios_instance';
import '../styles/profile.css';

// Helper to decode JWT payload without a library
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const AdminProfile = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setAdminInfo(decoded);
      }
    }
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/api/admin/change-password', {
        oldPassword,
        newPassword,
      });
      setMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h2>Admin Profile</h2>

      {/* Profile Info Card */}
      <div className="profile-card">
        <div className="profile-avatar">
          <span>{adminInfo?.email ? adminInfo.email[0].toUpperCase() : 'A'}</span>
        </div>
        <div className="profile-details">
          <div className="profile-field">
            <label>Email</label>
            <p>{adminInfo?.email || 'Loading...'}</p>
          </div>
          <div className="profile-field">
            <label>Role</label>
            <p>Administrator</p>
          </div>
          <div className="profile-field">
            <label>Admin ID</label>
            <p>{adminInfo?.id || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="change-password-card">
        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="oldPassword">Current Password</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              placeholder="Enter current password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password (min 6 chars)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter new password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
