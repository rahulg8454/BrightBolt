import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import axiosInstance from '../components/axios_instance';
import '../styles/QuizManagement.css';

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizName, setQuizName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [totalTime, setTotalTime] = useState(30);
  const [passcode, setPasscode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editQuizId, setEditQuizId] = useState('');

  const fetchQuizzes = async () => {
    try {
      const response = await axiosInstance.get('/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateQuiz = async () => {
    const data = { quizName, categories: [selectedCategory], totalTime, passcode };
    try {
      await axiosInstance.post('/api/create-quiz', data);
      alert('Quiz created successfully');
      fetchQuizzes();
      setQuizName('');
      setSelectedCategory('');
      setTotalTime(30);
      setPasscode('');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axiosInstance.delete(`/api/delete-quiz/${quizId}`);
      alert('Quiz deleted successfully');
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Error deleting quiz');
    }
  };

  const handleEditQuiz = async () => {
    const data = { quizName, categories: [selectedCategory], totalTime, passcode };
    try {
      await axiosInstance.put(`/api/edit-quiz/${editQuizId}`, data);
      alert('Quiz updated successfully');
      fetchQuizzes();
      setIsEditing(false);
      setEditQuizId('');
      setQuizName('');
      setSelectedCategory('');
      setTotalTime(30);
      setPasscode('');
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert('Error updating quiz');
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const getCategoryNames = (categories) => {
    return categories.map((category) => category.name).join(', ');
  };

  useEffect(() => {
    fetchQuizzes();
    fetchCategories();
  }, []);

  return (
    <div className="quiz-management">
      <h2>Quiz Management</h2>

      <div className="create-quiz">
        <TextField
          label="Quiz Name"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          margin="normal"
        />
        <FormControl>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            renderValue={(selected) => {
              const category = categories.find((cat) => cat._id === selected);
              return category ? category.name : 'Select a Category';
            }}
          >
            {categories.length === 0 ? (
              <MenuItem value="" disabled>Loading categories...</MenuItem>
            ) : (
              categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        <TextField
          label="Total Time (minutes)"
          type="number"
          value={totalTime}
          onChange={(e) => setTotalTime(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          onClick={isEditing ? handleEditQuiz : handleCreateQuiz}
        >
          {isEditing ? 'Update Quiz' : 'Create Quiz'}
        </Button>
      </div>

      <div className="quiz-list">
        <h3>Existing Quizzes</h3>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Quiz Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Total Time</TableCell>
                <TableCell>Passcode</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <TableRow key={quiz._id}>
                    <TableCell>{quiz.quizName}</TableCell>
                    <TableCell>{getCategoryNames(quiz.categories)}</TableCell>
                    <TableCell>{quiz.totalTime} minutes</TableCell>
                    <TableCell>{quiz.passcode}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setIsEditing(true);
                          setEditQuizId(quiz._id);
                          setQuizName(quiz.quizName);
                          setSelectedCategory(quiz.categories[0]._id);
                          setTotalTime(quiz.totalTime);
                          setPasscode(quiz.passcode);
                        }}
                      >
                        Edit
                      </Button>
                      <Button onClick={() => handleDeleteQuiz(quiz._id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No quizzes available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default QuizManagement;
