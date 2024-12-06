const express = require('express');
const Question = require('../models/Question');
const Score = require('../models/Score');

const router = express.Router();

// Fetch all questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Submit an answer
router.post('/submit', async (req, res) => {
  const { rollNumber, questionId, selectedOption } = req.body;
  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const isCorrect = question.correctOption === selectedOption;
    if (isCorrect) {
      await Score.updateOne({ rollNumber }, { $inc: { score: 10 } });
    }

    res.json({ correct: isCorrect });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

module.exports = router;