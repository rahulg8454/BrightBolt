import React, { useState } from 'react';
import axiosInstance from './axios_instance';
import '../styles/modal.css';

const AddUserModal = ({ setShowModal, fetchUsers }) => {
  const [userData, setUserData] = useState({
    userId: '',
    name: '',
    email: '',
    password: '',
    role: 'user',
    score: 0
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.password || userData.password.length < 4) {
      alert('Password must be at least 4 characters.');
      return;
    }
    console.log('Submitting user data:', userData);
    try {
      const response = await axiosInstance.post('/api/add-user', userData);
      console.log('User added successfully:', response.data);
      alert(`User created!\nUser ID: ${userData.userId}\nPassword: ${userData.password}`);
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error('Error during user submission:', error);
      alert('Error creating user. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={userData.userId}
              onChange={handleChange}
              placeholder="e.g. john01"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Set user password"
                required
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
          <div className="input-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={userData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit">Add User</button>
          <button type="button" onClick={() => setShowModal(false)}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
