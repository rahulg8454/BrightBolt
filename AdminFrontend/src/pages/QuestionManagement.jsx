import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import axiosInstance from '../components/axios_instance';
import '../styles/QuestionManagement.css';

const QuestionManagement = () => {
  const [quizzes, setQuizzes] = useState([]); // For quizzes
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
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
    setCorrectAnswer('');
    setEditingQuestion(null);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionText(question.questionText);
    setOptions(question.options);
    setCorrectAnswer(question.correctAnswer);
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
        <input
          type="text"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          placeholder="Correct answer"
        />
        <button onClick={handleAddOrUpdateQuestion}>
          {editingQuestion ? 'Update Question' : 'Add Question'}
        </button>
        {editingQuestion && <button onClick={resetForm}>Cancel</button>}
      </div>

      {questions.length > 0 && (
        <div className="question-list">
          <h3>Questions in this Quiz</h3>
          <table>
            <thead>
              <tr>
                <th>Question</th>
                <th>Options</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question._id}>
                  <td>{question.questionText}</td>
                  <td>
                    {question.options.map((option, index) => (
                      <p key={index}>{option}</p>
                    ))}
                  </td>
                  <td>
                    <FaEdit onClick={() => handleEditQuestion(question)} />
                    <FaTrash
                      onClick={async () => {
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
