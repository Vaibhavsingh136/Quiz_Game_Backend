const express = require('express');
const Question = require('../models/Question');
const GameState = require('../models/GameState');
const Score = require('../models/Score');
const User = require('../models/User');
const { registerUser } = require('../controllers/userController'); // Import the controller function

const router = express.Router();

// User Registration Route
router.post('/register', registerUser);

// Fetch questions for the current round
router.get('/questions', async (req, res) => {
  try {
    const gameState = await GameState.findOne();
    if (!gameState || gameState.roundStatus !== 'active') {
      return res.status(400).json({ error: 'No active round at the moment' });
    }

    const questions = await Question.find({ round: gameState.currentRound });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Fetch the leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Score.find()
      .sort({ score: -1 })
      .populate('rollNumber', 'name');
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Submit answers to questions
router.post('/submit', async (req, res) => {
  const { rollNumber, questionId, selectedOption } = req.body;
  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const gameState = await GameState.findOne();
    if (!gameState || gameState.roundStatus !== 'active') {
      return res.status(400).json({ error: 'No active round at the moment' });
    }

    const isCorrect = question.correctOption === selectedOption;
    if (isCorrect) {
      // Increment score if the answer is correct
      await Score.updateOne({ rollNumber }, { $inc: { score: 10 } });
    }

    // Fetch and return the leaderboard
    const leaderboard = await Score.find().sort({ score: -1 }).populate('rollNumber', 'name');
    res.json({ correct: isCorrect, leaderboard });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

module.exports = router;