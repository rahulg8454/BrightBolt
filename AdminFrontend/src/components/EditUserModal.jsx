import React, { useState } from 'react';
import axiosInstance from './axios_instance';

const EditUserModal = ({ user, setShowModal, fetchUsers }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const handleUpdate = async () => {
    try {
      await axiosInstance.put(`/api/users/edit-user/${user._id}`, {
        name,
        email,
        role,
      });
      alert('User updated successfully');
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
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <button onClick={() => setShowModal(false)}>Cancel</button>
        <button onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
};

export default EditUserModal;
