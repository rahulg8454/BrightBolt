import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import axiosInstance from '../components/axios_instance';
import '../styles/categoryManagement.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      await axiosInstance.post('/api/add-category', {
        name: categoryName,
        description: categoryDescription,
      });
      fetchCategories();
      setCategoryName('');
      setCategoryDescription('');
      alert('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axiosInstance.delete(`/api/delete-category/${categoryId}`);
      fetchCategories();
      alert('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
    }
  };

  const handleEditCategory = (category) => {
    setEditMode(true);
    setEditCategoryId(category._id);
    setCategoryName(category.name);
    setCategoryDescription(category.description);
  };

  const handleUpdateCategory = async () => {
    try {
      await axiosInstance.put(`/api/update-category/${editCategoryId}`, {
        name: categoryName,
        description: categoryDescription,
      });
      fetchCategories();
      setEditMode(false);
      setEditCategoryId(null);
      setCategoryName('');
      setCategoryDescription('');
      alert('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category-management">
      <h2>Manage Categories</h2>
      <input
        className="input-field"
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="Category Name"
      />
      <input
        className="input-field"
        type="text"
        value={categoryDescription}
        onChange={(e) => setCategoryDescription(e.target.value)}
        placeholder="Category Description"
      />
      {editMode ? (
        <button onClick={handleUpdateCategory}>Update Category</button>
      ) : (
        <button onClick={handleAddCategory}>Add Category</button>
      )}
      <div className="category-list">
        <h3>Categories List</h3>
        {categories.map((category) => (
          <div key={category._id} className="category-item">
            <span>{category.name} - {category.description}</span>
            <FaEdit onClick={() => handleEditCategory(category)} />
            <FaTrash onClick={() => handleDeleteCategory(category._id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;
