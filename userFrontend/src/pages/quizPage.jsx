import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/axios_instance';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pagesStyle/quizPage.css';

const UserPage = () => {
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Fetch all quizzes on page load
  const fetchQuizzes = async () => {
    try {
      const response = await axiosInstance.get('/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  // Fetch questions and pass total time to QuizCard
  const fetchQuestions = async (quizId, enteredPasscode) => {
    try {
      const response = await axiosInstance.post(`/api/quiz/${quizId}/questions`, {
        passcode: enteredPasscode,
      });
      if (response.data && response.data.length > 0) {
        setQuestions(response.data);
        setMessage('');
        navigate(`/quiz/${quizId}`, {
          state: {
            questions: response.data,
            quizName: selectedQuiz.quizName,
            totalTime: selectedQuiz.totalTime,
          },
        });
      } else {
        setMessage('No questions available.');
      }
    } catch (error) {
      setMessage('Incorrect passcode or failed to fetch questions.');
      console.error('Error fetching questions:', error);
    }
  };

  const handleQuizClick = (quiz) => {
    setSelectedQuiz(quiz);
    setShowPasscodeModal(true);
  };

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    if (selectedQuiz) {
      fetchQuestions(selectedQuiz._id, passcode);
      setShowPasscodeModal(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="quiz-page">
      <h2>Quizzes</h2>

      {quizzes.length > 0 ? (
        quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="quiz-card"
            onClick={() => handleQuizClick(quiz)}
          >
            <h3>{quiz.quizName}</h3>
            <p>Category: {quiz.categories.map((cat) => cat.name).join(', ')}</p>
            <p>Time: {quiz.totalTime} minutes</p>
            <button>Start</button>
          </div>
        ))
      ) : (
        <p>No quizzes available at the moment.</p>
      )}

      {showPasscodeModal && (
        <div className="passcode-modal">
          <h3>Enter Passcode for {selectedQuiz?.quizName}</h3>
          <form onSubmit={handlePasscodeSubmit}>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
              placeholder="Enter passcode"
            />
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowPasscodeModal(false)}>Cancel</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      )}

      {questions.length > 0 && (
        <div className="question-list">
          <h3>Questions</h3>
          {questions.map((question, index) => (
            <p key={index}>{question.questionText}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPage;
