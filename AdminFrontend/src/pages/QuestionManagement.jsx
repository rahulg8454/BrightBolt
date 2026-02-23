import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import axiosInstance from '../components/axios_instance';
import '../styles/QuestionManagement.css';

const QuestionManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  // correctOptionIndex: 0-3 (index of correct option), null = not selected
  const [correctOptionIndex, setCorrectOptionIndex] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const fetchQuestions = async () => {
    if (!selectedQuizId) return;
    try {
      const response = await axiosInstance.get(`/api/questions/${selectedQuizId}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axiosInstance.get('/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleAddOrUpdateQuestion = async () => {
    if (!selectedQuizId) {
      alert('Please select a quiz before adding a question.');
      return;
    }
    if (correctOptionIndex === null) {
      alert('Please select the correct option (Option 1, 2, 3, or 4).');
      return;
    }
    // Store the text of the selected option as correctAnswer
    const correctAnswer = options[correctOptionIndex];
    if (!correctAnswer.trim()) {
      alert(`Option ${correctOptionIndex + 1} is empty. Please fill it in before selecting it as correct.`);
      return;
    }
    const data = { quizId: selectedQuizId, questionText, options, correctAnswer };
    try {
      if (editingQuestion) {
        await axiosInstance.put(`/api/update-question/${editingQuestion._id}`, data);
        alert('Question updated successfully');
      } else {
        await axiosInstance.post('/api/add-question', data);
        alert('Question added successfully');
      }
      fetchQuestions();
      resetForm();
    } catch (error) {
      console.error('Error processing question:', error);
      alert('Error processing question');
    }
  };

  const resetForm = () => {
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectOptionIndex(null);
    setEditingQuestion(null);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionText(question.questionText);
    setOptions(question.options);
    // Find index of correctAnswer in options
    const idx = question.options.indexOf(question.correctAnswer);
    setCorrectOptionIndex(idx >= 0 ? idx : null);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [selectedQuizId]);

  return (
    <div className="question-management">
      <h2>Manage Questions</h2>

      {/* Select Quiz */}
      <div className="form-section">
        <h3>Select Quiz</h3>
        <select
          value={selectedQuizId}
          onChange={(e) => setSelectedQuizId(e.target.value)}
          className="quiz-select"
        >
          <option value="" disabled>-- Select a Quiz --</option>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <option key={quiz._id} value={quiz._id}>{quiz.quizName}</option>
            ))
          ) : (
            <option disabled>No quizzes available</option>
          )}
        </select>
      </div>

      {/* Add / Edit Question Form */}
      <div className="form-section">
        <h3>{editingQuestion ? 'Edit Question' : 'Add Question'}</h3>

        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter question text"
          className="question-input"
        />

        {/* Options with radio buttons */}
        <div className="correct-answer-label">Select correct option:</div>
        <div className="options-grid">
          {options.map((option, index) => (
            <div key={index} className={`option-row ${correctOptionIndex === index ? 'option-correct' : ''}`}>
              <label className="option-radio-label">
                <input
                  type="radio"
                  name="correctOption"
                  value={index}
                  checked={correctOptionIndex === index}
                  onChange={() => setCorrectOptionIndex(index)}
                  className="option-radio"
                />
                <span className="option-number">Option {index + 1}</span>
              </label>
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                placeholder={`Enter option ${index + 1}`}
                className="option-text-input"
              />
              {correctOptionIndex === index && (
                <span className="correct-tick">&#10003; Correct</span>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button onClick={handleAddOrUpdateQuestion} className="btn-primary">
            {editingQuestion ? 'Update Question' : 'Add Question'}
          </button>
          {editingQuestion && (
            <button onClick={resetForm} className="btn-secondary">Cancel</button>
          )}
        </div>
      </div>

      {/* Questions List */}
      {questions.length > 0 && (
        <div className="questions-list-section">
          <h3>Questions in this Quiz</h3>
          <table className="questions-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Options</th>
                <th>Correct Answer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, qIdx) => (
                <tr key={question._id}>
                  <td>{qIdx + 1}</td>
                  <td className="question-cell">{question.questionText}</td>
                  <td>
                    <ol className="options-list">
                      {question.options.map((opt, i) => (
                        <li
                          key={i}
                          className={opt === question.correctAnswer ? 'correct-option-item' : ''}
                        >
                          {opt}{opt === question.correctAnswer ? ' ✓' : ''}
                        </li>
                      ))}
                    </ol>
                  </td>
                  <td className="correct-answer-cell">
                    {question.options.indexOf(question.correctAnswer) >= 0
                      ? `Option ${question.options.indexOf(question.correctAnswer) + 1}`
                      : question.correctAnswer}
                  </td>
                  <td className="actions-cell">
                    <FaEdit
                      className="icon-edit"
                      onClick={() => handleEditQuestion(question)}
                    />
                    <FaTrash
                      className="icon-delete"
                      onClick={async () => {
                        if (!window.confirm('Delete this question?')) return;
                        try {
                          await axiosInstance.delete(`/api/delete-question/${question._id}`);
                          alert('Question deleted successfully');
                          fetchQuestions();
                        } catch (error) {
                          console.error('Error deleting question:', error);
                          alert('Error deleting question');
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;
