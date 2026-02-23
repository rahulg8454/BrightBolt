import React, { useState, useEffect } from 'react';
import axiosInstance from './axios_instance';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/pagesStyle/quizCard.css';
import QuizTimer from './QuizTimer.jsx';

const QuizCard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { questions, quizName, quizId, totalTime } = state || {};

  // Check if timer was saved in localStorage and restore it
  const storedTime = localStorage.getItem(`quizTime-${quizId}`);
  const initialTime = storedTime ? parseInt(storedTime) : (totalTime ? totalTime * 60 : 30 * 60);

  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizDuration, setQuizDuration] = useState(initialTime);
  const [quizResult, setQuizResult] = useState(null); // stores { score, totalQuestions, correctAnswers, wrongAnswers }
  const [submitError, setSubmitError] = useState('');

  const QUESTIONS_PER_PAGE = 2;

  // Timer logic
  useEffect(() => {
    if (quizCompleted) return;
    const interval = setInterval(() => {
      setQuizDuration((prevDuration) => {
        if (prevDuration <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        const newDuration = prevDuration - 1;
        localStorage.setItem(`quizTime-${quizId}`, newDuration);
        return newDuration;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quizCompleted, quizId]);

  const handleTimeUp = () => {
    setQuizCompleted(true);
    alert('Time is up! Your quiz is being submitted.');
    handleSubmit();
  };

  const handleOptionChange = (questionIndex, optionValue) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: optionValue,
    }));
  };

  const handleNext = () => {
    if ((currentPage + 1) * QUESTIONS_PER_PAGE < questions.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = async () => {
    setQuizCompleted(true);
    setSubmitError('');
    try {
      // Get userId from token stored in localStorage
      const token = localStorage.getItem('token');
      let userId = null;
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(base64));
          userId = payload.id || payload._id || payload.userId;
        } catch (e) {
          console.error('Token decode error:', e);
        }
      }

      const response = await axiosInstance.post(`/api/quizzes/${quizId}/submit`, {
        userId,
        answers,
      });

      const { score, totalQuestions, correctAnswers, wrongAnswers } = response.data;
      setQuizResult({ score, totalQuestions, correctAnswers, wrongAnswers });
      localStorage.removeItem(`quizTime-${quizId}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setSubmitError('Could not save result. Please try again.');
      // Still show local calculation
      const localScore = calculateScore();
      setQuizResult({
        score: localScore,
        totalQuestions: questions.length,
        correctAnswers: localScore,
        wrongAnswers: questions.length - localScore,
      });
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const currentQuestions = questions?.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const totalAnswered = Object.keys(answers).length;
  const percentage = quizResult
    ? ((quizResult.correctAnswers / Math.max(quizResult.totalQuestions, 1)) * 100).toFixed(1)
    : 0;

  return (
    <div className="quiz-card-container">
      <h2 className="quiz-title">{quizName}</h2>

      {quizCompleted ? (
        <div className="quiz-result-summary">
          <h3>Quiz Completed!</h3>
          {quizResult ? (
            <>
              <div className="result-stats">
                <div className="stat-box total">
                  <span className="stat-label">Total Questions</span>
                  <span className="stat-value">{quizResult.totalQuestions}</span>
                </div>
                <div className="stat-box correct">
                  <span className="stat-label">Correct</span>
                  <span className="stat-value">{quizResult.correctAnswers}</span>
                </div>
                <div className="stat-box wrong">
                  <span className="stat-label">Wrong</span>
                  <span className="stat-value">{quizResult.wrongAnswers}</span>
                </div>
                <div className="stat-box score">
                  <span className="stat-label">Score</span>
                  <span className="stat-value">{percentage}%</span>
                </div>
              </div>
              <p className="result-message">
                {parseFloat(percentage) >= 50
                  ? 'Congratulations! You passed the quiz.'
                  : 'Keep practising! You can do better next time.'}
              </p>
            </>
          ) : (
            <p>Saving your result...</p>
          )}
          {submitError && <p className="submit-error">{submitError}</p>}
          <button className="back-btn" onClick={() => navigate('/quizPage')}>Back to Quizzes</button>
        </div>
      ) : (
        <>
          <div className="quiz-meta">
            <span>Questions answered: {totalAnswered} / {questions?.length || 0}</span>
            <QuizTimer duration={quizDuration} />
          </div>
          {currentQuestions && currentQuestions.length > 0 ? (
            <div className="questions-section">
              {currentQuestions.map((question, index) => {
                const questionIndex = currentPage * QUESTIONS_PER_PAGE + index;
                return (
                  <div key={questionIndex} className="question-block">
                    <p className="question-text">
                      <strong>Question {questionIndex + 1}:</strong> {question.questionText}
                    </p>
                    <div className="options-list">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="option-label">
                          <input
                            type="radio"
                            name={`question-${questionIndex}`}
                            value={option}
                            checked={answers[questionIndex] === option}
                            onChange={() => handleOptionChange(questionIndex, option)}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No questions available.</p>
          )}
          <div className="quiz-nav">
            <button onClick={handlePrevious} disabled={currentPage === 0}>Previous</button>
            {(currentPage + 1) * QUESTIONS_PER_PAGE < questions.length ? (
              <button onClick={handleNext}>Next</button>
            ) : (
              <button onClick={handleSubmit} className="submit-btn">Submit Quiz</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default QuizCard;
