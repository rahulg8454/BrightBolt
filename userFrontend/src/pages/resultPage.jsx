import React, { useEffect, useState } from 'react';
import axiosInstance from '../components/axios_instance';
import '../styles/pagesStyle/resultPage.css';

const ResultPage = ({ userId }) => {
  const [result, setResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch result and leaderboard
  useEffect(() => {
    const fetchResultAndLeaderboard = async () => {
      try {
        setLoading(true);

        // Fetch user result
        const resultResponse = await axiosInstance.get(`/api/result/${userId}`);
        const resultData = resultResponse.data;

        // Fetch leaderboard
        const leaderboardResponse = await axiosInstance.get('/api/leaderboard');
        const leaderboardData = leaderboardResponse.data;

        setResult(resultData);
        setLeaderboard(leaderboardData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResultAndLeaderboard();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="result-page">
      <h2>Quiz Results</h2>

      {result && (
        <div className="result-section">
          <h3>Your Result</h3>
          <p><strong>Score:</strong> {result.score} / {result.totalQuestions}</p>
          <p><strong>Percentage:</strong> {(result.score / result.totalQuestions * 100).toFixed(2)}%</p>
          <p><strong>Time Taken:</strong> {result.timeTaken} minutes</p>
        </div>
      )}

      <div className="leaderboard-section">
        <h3>Leaderboard</h3>
        {leaderboard.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
                <th>Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.name}</td>
                  <td>{entry.score}</td>
                  <td>{entry.timeTaken} minutes</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No leaderboard data available</p>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
