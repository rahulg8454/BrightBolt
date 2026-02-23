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
  // correctOptionIndex: 0-3 (index of the correct option selected by admin)
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

  // When editing, find which option index matches the stored correctAnswer
  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionText(question.questionText);
    setOptions(question.options);
    // Find the index of the correct answer in the options array
    const idx = question.options.findIndex(
      (opt) => opt === question.correctAnswer
    );
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
      <div className="select-quiz">
        <h3>Select Quiz</h3>
        <select
          value={selectedQuizId}
          onChange={(e) => setSelectedQuizId(e.target.value)}
        >
          <option value="" disabled>-- Select a Quiz --</option>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <option key={quiz._id} value={quiz._id} className="quizName">
                {quiz.quizName}
              </option>
            ))
          ) : (
            <option disabled>No quizzes available</option>
          )}
        </select>
      </div>

      {/* Add/Edit Question Form */}
      <div className="add-question">
        <h3>{editingQuestion ? 'Edit Question' : 'Add Question'}</h3>

        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter question text"
        />

        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            placeholder={`Option ${index + 1}`}
          />
        ))}

        {/* Correct Option Radio Selector */}
        <div className="correct-option-selector">
          <p className="correct-option-label">Select Correct Option:</p>
          <div className="correct-option-radios">
            {options.map((option, index) => (
              <label key={index} className={`correct-option-radio-label${correctOptionIndex === index ? ' selected' : ''}`}>
                <input
                  type="radio"
                  name="correctOption"
                  value={index}
                  checked={correctOptionIndex === index}
                  onChange={() => setCorrectOptionIndex(index)}
                />
                Option {index + 1}{option.trim() ? `: ${option}` : ''}
              </label>
            ))}
          </div>
          {correctOptionIndex !== null && (
            <p className="correct-option-preview">
              Correct answer set to: <strong>Option {correctOptionIndex + 1}</strong>
              {options[correctOptionIndex].trim() ? ` — "${options[correctOptionIndex]}"` : ' (option text not entered yet)'}
            </p>
          )}
        </div>

        <button onClick={handleAddOrUpdateQuestion}>
          {editingQuestion ? 'Update Question' : 'Add Question'}
        </button>
        {editingQuestion && (
          <button onClick={resetForm}>Cancel</button>
        )}
      </div>

      {/* Question List */}
      {questions.length > 0 && (
        <div className="question-list">
          <h3>Questions in this Quiz</h3>
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Options</th>
                <th>Correct Option</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => {
                const correctIdx = question.options.findIndex(
                  (opt) => opt === question.correctAnswer
                );
                return (
                  <tr key={question._id}>
                    <td>{question.questionText}</td>
                    <td>
                      {question.options.map((option, index) => (
                        <div key={index}>
                          <strong>Option {index + 1}:</strong> {option}
                        </div>
                      ))}
                    </td>
                    <td className="correct-option-cell">
                      {correctIdx >= 0
                        ? `Option ${correctIdx + 1}: ${question.correctAnswer}`
                        : question.correctAnswer || 'N/A'}
                    </td>
                    <td>
                      <div className="action-buttons">
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
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;
