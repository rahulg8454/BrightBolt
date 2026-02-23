import express from 'express';
const router = express.Router();
import Quiz from '../models/quizModel.js';
import QuizResult from '../models/quizResultModel.js';

// POST /api/quizzes/:quizId/submit  - Submit quiz answers and save result
router.post('/quizzes/:quizId/submit', async (req, res) => {
  const { userId, answers } = req.body;
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const totalQuestions = quiz.questions.length;

    // Calculate correct and wrong from the submitted answers
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
        correctAnswers += 1;
      }
    });
    const wrongAnswers = totalQuestions - correctAnswers;

    // Save quiz result to the database
    const newResult = new QuizResult({
      userId,
      quizId,
      score: correctAnswers,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      answers,
    });

    await newResult.save();

    return res.status(200).json({
      message: 'Quiz submitted successfully',
      score: correctAnswers,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while submitting the quiz' });
  }
});

// GET /api/results/user/:userId  - Get all quiz results for a user
router.get('/results/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await QuizResult.find({ userId })
      .populate('quizId', 'quizName')
      .sort({ createdAt: -1 });
    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// GET /api/results/all  - Get all quiz results (for admin)
router.get('/results/all', async (req, res) => {
  try {
    const results = await QuizResult.find({})
      .populate('quizId', 'quizName')
      .populate('userId', 'userId email')
      .sort({ createdAt: -1 });
    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch results' });
  }
});

export default router;
