import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/axios_instance';
import '../styles/Reports.css';

const Reports = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllResults = async () => {
    try {
      const response = await axiosInstance.get('/api/results/all');
      setResults(response.data || []);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to load quiz results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllResults();
  }, []);

  const filtered = results.filter((r) => {
    const username = r.userId?.userId || r.userId?.email || String(r.userId) || '';
    const quizName = r.quizId?.quizName || '';
    return (
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quizName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h2>Quiz Results</h2>
        <p>{results.length} total attempt{results.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="reports-filter">
        <input
          type="text"
          placeholder="Search by user or quiz name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="refresh-btn" onClick={fetchAllResults}>Refresh</button>
      </div>

      {loading ? (
        <div className="loading-msg">Loading results...</div>
      ) : error ? (
        <div className="error-msg">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="empty-msg">No quiz results found.</div>
      ) : (
        <div className="results-table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Quiz</th>
                <th>Total Q</th>
                <th>Correct</th>
                <th>Wrong</th>
                <th>Score</th>
                <th>Pass/Fail</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((result, index) => {
                const username = result.userId?.userId || result.userId?.email || 'Unknown';
                const quizName = result.quizId?.quizName || 'Unknown Quiz';
                const total = result.totalQuestions || 0;
                const correct = result.correctAnswers || 0;
                const wrong = result.wrongAnswers || 0;
                const pct = total > 0 ? ((correct / total) * 100).toFixed(0) : 0;
                const passed = parseFloat(pct) >= 60;
                const date = result.createdAt
                  ? new Date(result.createdAt).toLocaleDateString('en-IN')
                  : '-';
                return (
                  <tr key={result._id || index} className={passed ? 'row-pass' : 'row-fail'}>
                    <td>{index + 1}</td>
                    <td className="cell-user">{username}</td>
                    <td className="cell-quiz">{quizName}</td>
                    <td>{total}</td>
                    <td className="cell-correct">{correct}</td>
                    <td className="cell-wrong">{wrong}</td>
                    <td><strong>{pct}%</strong></td>
                    <td>
                      <span className={`badge ${passed ? 'badge-pass' : 'badge-fail'}`}>
                        {passed ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                    <td>{date}</td>
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

export default Reports;
