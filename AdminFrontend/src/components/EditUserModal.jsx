import React, { useState } from 'react';
import axiosInstance from './axios_instance';
import '../styles/modal.css';

const EditUserModal = ({ user, setShowModal, fetchUsers }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdate = async () => {
    try {
      const payload = { name, email, role };
      // Only send password if admin filled it in
      if (newPassword.trim().length > 0) {
        if (newPassword.trim().length < 4) {
          alert('New password must be at least 4 characters.');
          return;
        }
        payload.password = newPassword;
      }
      await axiosInstance.put(`/api/users/edit-user/${user._id}`, payload);
      alert('User updated successfully' + (newPassword ? ' (password changed)' : ''));
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('An error occurred while updating the user. Please try again later.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit User</h3>
        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="input-group">
          <label>New Password <span style={{fontWeight:'normal',color:'#888'}}>(leave blank to keep unchanged)</span></label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (optional)"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <button onClick={() => setShowModal(false)}>Cancel</button>
        <button onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
};

export default EditUserModal;
