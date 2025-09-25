const express = require("express");
const Result = require("../Models/result");
const Question = require("../Models/Question");
// const Student = require("../Models/studentmodel");

const router = express.Router();

/**
 * Save result (only once)
 */
router.post("/save", async (req, res) => {
  try {
    const { studentId, questionIds, answers } = req.body;

    if (!studentId || !Array.isArray(questionIds) || !Array.isArray(answers) || questionIds.length !== answers.length) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    if (student.testGiven) {
      return res.status(403).json({ error: "You have already given the test. Contact admin." });
    }

    const questions = await Question.find({ _id: { $in: questionIds } }).select("_id answer");

    const answerMap = {};
    questions.forEach(q => { answerMap[q._id.toString()] = q.answer; });

    let correctAnswers = 0, wrongAnswers = 0, notAnswered = 0;

    for (let i = 0; i < questionIds.length; i++) {
      const qid = questionIds[i].toString();
      const userAns = answers[i];

      if (!userAns) notAnswered++;
      else if (userAns === answerMap[qid]) correctAnswers++;
      else wrongAnswers++;
    }

    const score = correctAnswers;

    const result = new Result({
      studentId,
      questionIds,
      answers,
      score,
      correctAnswers,
      wrongAnswers,
      notAnswered
    });

    await result.save();

    student.testGiven = true;
    await student.save();

    res.status(201).json({ message: "Result saved", result });
  } catch (err) {
    console.error("❌ Error saving result:", err);
    res.status(500).json({ error: "Failed to save result" });
  }
});

/**
 * Check if student can give test
 */
router.get("/check/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ allowed: !student.testGiven });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check eligibility" });
  }
});

/**
 * Reset test for student (admin only)
 */
router.post("/retest/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    await Result.deleteMany({ studentId });
    await Student.findByIdAndUpdate(studentId, { testGiven: false });
    res.json({ message: "Student can now give test again" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reset result" });
  }
});

module.exports = router;
