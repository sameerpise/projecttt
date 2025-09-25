const express = require('express');
const router = express.Router();
const Question = require('../Models/Question');

// GET all questions
router.get('/', async (req, res) => {
  try {
   const questions = await Question.find();// Fetch all questions
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

module.exports = router;