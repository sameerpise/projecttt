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
router.post("/add", async (req, res) => {
  try {
    const { question, options, correctAnswer, difficulty } = req.body;
    const questions = new Question({ question, options, correctAnswer, difficulty });
    await questions.save();
    res.status(201).json({ message: "Question added successfully", questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/update/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Question updated", question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;