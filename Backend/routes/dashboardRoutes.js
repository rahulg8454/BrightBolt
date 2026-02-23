import express from "express";
import User from "../models/userModel.js";
import Quiz from "../models/quizModel.js";
import QuizResult from "../models/quizResultModel.js"; // Import QuizResult model

const router = express.Router();

router.get("/dashboard-stats", async (req, res) => {
  try {
    // Count total users
    const totalUsers = await User.countDocuments();

    // Count total quizzes
    const totalQuizzes = await Quiz.countDocuments();

    // Count total attempts from QuizResult collection
    const totalAttempts = await QuizResult.countDocuments();

    // Calculate pass rate:
    // A result is a "pass" if score >= 50% of totalQuestions
    const passData = await QuizResult.aggregate([
      {
        $project: {
          passed: {
            $cond: {
              if: {
                $gte: [
                  { $divide: ["$score", { $max: ["$totalQuestions", 1] }] },
                  0.5
                ]
              },
              then: 1,
              else: 0
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalPasses: { $sum: "$passed" },
          totalAttempts: { $sum: 1 }
        }
      }
    ]);

    let passRate = 0;
    if (passData.length > 0 && passData[0].totalAttempts > 0) {
      passRate = ((passData[0].totalPasses / passData[0].totalAttempts) * 100).toFixed(2);
    }

    res.json({
      users: totalUsers,
      quizzes: totalQuizzes,
      attempts: totalAttempts,
      passRate,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
