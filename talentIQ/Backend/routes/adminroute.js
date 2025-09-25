const express = require("express");
const Result = require("../Models/result");

const router = express.Router();

// Get all student results
router.get("/results", async (req, res) => {
  try {
    const results = await Result.find().populate("student");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
