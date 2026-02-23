import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/axios_instance';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pagesStyle/quizPage.css';

const UserPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [message, setMessage] = useState('');
  const [myResults, setMyResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);
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

  // Get userId from token
  const getUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload.id || payload._id || payload.userId;
    } catch (e) {
      return null;
    }
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

  // Fetch user's attempted quiz results
  const fetchMyResults = async () => {
    try {
      const userId = getUserId();
      if (!userId) return;
      const response = await axiosInstance.get(`/api/results/user/${userId}`);
      setMyResults(response.data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoadingResults(false);
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
            quizId: quizId,
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
    fetchMyResults();
  }, []);

  // Build a map of quizId -> best result for quick lookup
  const resultMap = {};
  myResults.forEach((r) => {
    const qid = r.quizId?._id || r.quizId;
    if (!resultMap[qid] || r.score > resultMap[qid].score) {
      resultMap[qid] = r;
    }
  });

  return (
    <div className="quiz-page">
      {/* Available Quizzes */}
      <div className="quiz-section">
        <h2 className="section-title">Available Quizzes</h2>
        <div className="quiz-grid">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => {
              const attempted = resultMap[quiz._id];
              return (
                <div key={quiz._id} className={`quiz-card-item ${attempted ? 'attempted' : ''}`}>
                  <h3 className="quiz-name">{quiz.quizName}</h3>
                  <p className="quiz-category">Category: {quiz.categories?.map((cat) => cat.name).join(', ') || 'General'}</p>
                  <p className="quiz-time">Time: {quiz.totalTime} minutes</p>
                  {attempted && (
                    <div className="attempted-badge">
                      <span>Attempted</span>
                      <span className="attempted-score">
                        Score: {attempted.correctAnswers}/{attempted.totalQuestions} ({((attempted.correctAnswers / Math.max(attempted.totalQuestions, 1)) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  )}
                  <button className="start-btn" onClick={() => handleQuizClick(quiz)}>
                    {attempted ? 'Retake' : 'Start'}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="no-quiz">No quizzes available at the moment.</p>
          )}
        </div>
      </div>

      {/* My Attempted Quizzes */}
      <div className="quiz-section results-section">
        <h2 className="section-title">My Quiz History</h2>
        {loadingResults ? (
          <p className="loading-text">Loading your results...</p>
        ) : myResults.length > 0 ? (
          <div className="results-list">
            {myResults.map((result, index) => {
              const pct = ((result.correctAnswers / Math.max(result.totalQuestions, 1)) * 100).toFixed(0);
              const passed = parseFloat(pct) >= 60;
              return (
                <div key={result._id || index} className="result-item">
                  <div className="result-quiz-name">
                    {result.quizId?.quizName || 'Quiz'}
                  </div>
                  <div className="result-stats">
                    <span>Total: {result.totalQuestions}</span>
                    <span className="correct">Correct: {result.correctAnswers}</span>
                    <span className="wrong">Wrong: {result.wrongAnswers}</span>
                    <span className={`score-badge ${passed ? 'pass' : 'fail'}`}>{pct}%</span>
                  </div>
                  <div className="result-date">
                    {result.createdAt ? new Date(result.createdAt).toLocaleDateString('en-IN') : ''}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-results">You haven't attempted any quizzes yet.</p>
        )}
      </div>

      {/* Passcode Modal */}
      {showPasscodeModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Enter Passcode for {selectedQuiz?.quizName}</h3>
            <form onSubmit={handlePasscodeSubmit}>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                placeholder="Enter passcode"
                className="passcode-input"
              />
              <div className="modal-btns">
                <button type="submit" className="submit-btn">Submit</button>
                <button type="button" className="cancel-btn" onClick={() => setShowPasscodeModal(false)}>Cancel</button>
              </div>
            </form>
            {message && <p className="error-msg">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
