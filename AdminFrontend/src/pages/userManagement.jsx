import React, { useState, useEffect } from 'react';
import '../styles/userManagement.css';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from '../components/axios_instance';
import AddUserModal from '../components/AddUserModal';
import EditUserModal from '../components/EditUserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const result = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(result);
    }
  }, [search, users]);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/users/delete-user/${id}`);
      setUsers(users.filter(user => user._id !== id));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user. Please try again later.');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleAddUser = () => {
    setIsAddingUser(true);
    setShowModal(true);
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <button onClick={handleAddUser}>+ Add User</button>

      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <FaEdit onClick={() => handleEdit(user)} className="edit-btn" />
                  <FaTrash onClick={() => handleDelete(user._id)} className="delete-btn" />
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4">No users found</td></tr>
          )}
        </tbody>
      </table>

      {showModal && isAddingUser && (
        <AddUserModal
          setShowModal={setShowModal}
          fetchUsers={fetchUsers}
        />
      )}
      {showModal && selectedUser && !isAddingUser && (
        <EditUserModal
          user={selectedUser}
          setShowModal={setShowModal}
          fetchUsers={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserManagement;
